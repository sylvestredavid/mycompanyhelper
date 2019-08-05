package com.stockmaga.back.services.impl;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.stockmaga.back.models.*;
import com.stockmaga.back.repositories.EntrepriseRepository;
import com.stockmaga.back.request.SignUpForm;
import com.stockmaga.back.services.IEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.util.ByteArrayDataSource;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Properties;

@Service
public class EmailService implements IEmailService {

	private static final String MAIL_FROM = "david.sylvestre.lp2@gmail.com";

	@Autowired
	private EntrepriseRepository entrepriseRepository;

	@Autowired
	private Environment env;

	/**
	 * Methode d'envoi d'un email
	 *
	 * @param to    l'adresse mail du destinataire
	 * @param from  l'adresse mail de l'expediteur
	 * @param title le sujet du mail
	 * @param mail  Le corps du mail
	 */
	public void send(String to, String from, String name, String title, String mail, Facture facture) {

		final String username = env.getProperty("email.username");// change accordingly
		final String password = env.getProperty("email.mdp");// change accordingly
		// Assuming you are sending email through relay.jangosmtp.net
		String host = "smtp.gmail.com";

		Properties props = new Properties();
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.host", host);
		props.put("mail.smtp.port", "587");

		// Get the Session object.
		Session session = Session.getInstance(props, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(username, password);
			}
		});

		try {
			// Create a default MimeMessage object.
			Message message = new MimeMessage(session);

			// Set From: header field of the header.
			message.setFrom(new InternetAddress(from, name));

			message.setReplyTo(new javax.mail.Address[]{new javax.mail.internet.InternetAddress(from)});

			// Set To: header field of the header.
			message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));

			// Set Subject: header field
			message.setSubject(title);

			Multipart multipart = new MimeMultipart();

			MimeBodyPart messageBodyPart = new MimeBodyPart();
			messageBodyPart.setContent(mail, "text/html; charset=UTF-8");

			if (facture != null) {

				String fileName = facture.isDevis() ? "Devis_" + facture.getNumero() : "Facture_" + facture.getNumero();

				ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
				writePdf(outputStream, facture);
				byte[] bytes = outputStream.toByteArray();

				//construct the pdf body part
				DataSource dataSource = new ByteArrayDataSource(bytes, "application/pdf");
				MimeBodyPart pdfBodyPart = new MimeBodyPart();
				pdfBodyPart.setDataHandler(new DataHandler(dataSource));
				pdfBodyPart.setFileName(fileName + ".pdf");
				multipart.addBodyPart(pdfBodyPart);
			}

			multipart.addBodyPart(messageBodyPart);
			// Send the actual HTML message, as big as you like
			message.setContent(multipart);

			// Send message
			Transport.send(message);


		} catch (MessagingException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * envoi de la facture a un client
	 */
	@Override
	public void sendFacture(Facture facture, String entreprise) {

		final String MAIL = facture.isDevis() ? "Bonjour voici votre devis" : "Merci pour votre achat, voici votre facture.";

		final String TITLE = facture.isDevis() ? "Voici votre devis" : "Merci pour votre achat";

		send(facture.getClient().getEmail(), MAIL_FROM, entreprise, TITLE, MAIL, facture);
	}

	/**
	 * envoi de la confirmation d'inscription a un gestionnaire
	 */
	@Override
	@Async
	public void sendGestMail(User user) {
		final String Gest_Mail = "<h1>Bienvenue</h1>"
				+ "<p>Vous avez été ajouté en tant que gestionnaire pour le compte de " + entrepriseRepository.findByIdUser(user.getManagementId()).getNom() + ".</p>"
				+ "<p>Vous pouvez à présent vous connecter avec les identifiants suivants:</p>"
				+ "<p> email: cet email,</p>" + "<p>mot de passe: mycompanyhelper</p>"
				+ "<p>lors de votre première connexion, il vous sera demandé de changer de mot de passe.</p>"
				+ "<p>Cordialement.</p>" + "<p>L'équipe de mycompanyhelper</p>"
				+ "<p>Ce message vous a été envoyé depuis <a href=\"https://www.mycompanyhelper.com\">mycompanyhelper.com</a></p>";

		send(user.getUsername(), MAIL_FROM, "mycompanyhelper", "Vous avez été ajouté en tant que gestionnaire.", Gest_Mail, null);
	}

	/**
	 * envoi du lien de changement de mot de passe
	 */
	@Override
	@Async
	public void sendPasswordMail(String mail, String lien) {
		final String MAIL = "<p>Vous venez de faire une demande de changement de mot de passe.</p>"
				+ "<p>Merci de <a href='https://www.mycompanyhelper.com/connexion/changePassword/" + lien
				+ "'>cliquer ici</a>.</p>"
				+ "<p>Si vous n'etes pas à l'origine de cette demande, merci de nous en informer"
				+ "<p>Ce message vous a été envoyé depuis <a href=\"https://www.mycompanyhelper.com\">mycompanyhelper.com</a></p>";

		send(mail, MAIL_FROM, "mycompanyhelper", "Votre demande de changement de mot de passe.", MAIL, null);

	}

	/**
	 * envoi d'une reponse a une annonce d'un fournisseur
	 */
	@Override
	@Async
	public void sendMailToFournisseur(Email email) {

		final String MAIL = "<div style='white-space: pre;'>" + email.getCorps() + "</div>"
				+ "<p>Ce message vous a été envoyé depuis <a href=\"https://www.mycompanyhelper.com\">mycompanyhelper.com</a></p>";

		send(email.getTo(), email.getFrom(), "mycompanyhelper", email.getTitre(), MAIL, null);

	}

	/**
	 * envoi d'un mail d'alerte de stock bas
	 */
	@Override
	@Async
	public void mailStockBas(String produit, String email) {

		final String MAIL = "<p>Bonjour</p>" + "<p>Le produit " + produit + " est en stock insufisant.</p>"
				+ "<p>Cordialement.</p>" + "<p>L'équipe de mycompanyhelper</p>"
				+ "<p>Ce message vous a été envoyé depuis <a href=\"https://www.mycompanyhelper.com\">mycompanyhelper.com</a></p>";

		send(email, MAIL_FROM, "mycompanyhelper", "mycompanyhelper alerte stock bas", MAIL, null);

	}

	/**
	 * envoi de la confirmation d'inscription a un admin ou un fournisseur
	 */
	@Override
	@Async
	public void sendInscriptionMail(SignUpForm signUpRequest) {

		final String MAIL = "<p>Bonjour</p>" + "<p>Vous venez de vous inscrire en tant que "
				+ signUpRequest.getRole().toArray()[0] + " sur mycompanyhelper.</p>"
				+ "<p>Voici vos identifiants de connexion:</p>" + "<p>Email : " + signUpRequest.getUsername() + "</p>"
				+ "<p>Cordialement.</p>" + "<p>L'équipe de mycompanyhelper</p>"
				+ "<p>Ce message vous a été envoyé depuis <a href=\"https://www.mycompanyhelper.com\">mycompanyhelper.com</a></p>";

		send(signUpRequest.getUsername(), MAIL_FROM, "mycompanyhelper", "Merci pour votre inscription", MAIL, null);

	}

	@Override
	@Async
	public void sendMailMiseEnAvant(Annonce annonce) {
		final String MAIL = "<p>Bonjour</p>" + "<p>L'annonce " + annonce.getTitre() + " à bien été mis en avant</p>"
				+ "<p>Votre compte sera débité de 5€.</p>" + "<p>Cordialement.</p>"
				+ "<p>L'équipe de mycompanyhelper</p>"
				+ "<p>Ce message vous a été envoyé depuis <a href=\"https://www.mycompanyhelper.com\">mycompanyhelper.com</a></p>";

		send(annonce.getEmail(), MAIL_FROM, "mycompanyhelper", "Merci pour votre achat", MAIL, null);
	}

	@Override
	public void sendMailCalendrier(String email, List<Calendrier> calendrier) {
		final String MAIL_DEBUT = "<p>Bonjour</p>"
				+ "<p>voici vos rendez-vous de la journée</p>";

		StringBuilder sb = new StringBuilder();

		for (Calendrier c : calendrier) {
			sb.append("<p>").append(c.getTitle()).append(" à ").append(c.getStart().substring(11, 16)).append(".</p>");
		}
		String mailMillieu = sb.toString();
		final String MAIL_FIN = "<p>Cordialement.</p>"
				+ "<p>L'équipe de mycompanyhelper</p>"
				+ "<p>Ce message vous a été envoyé depuis <a href=\"https://www.mycompanyhelper.com\">mycompanyhelper.com</a></p>";

		send(email, MAIL_FROM, "mycompanyhelper", "Votre planning de la journée", MAIL_DEBUT + mailMillieu + MAIL_FIN, null);

	}

	@Override
	@Async
	public void sendMailSupport(Email email) {

		send(email.getTo(), email.getFrom(), "demande support", email.getTitre(), email.getCorps(), null);
	}

	@Override
	@Async
	public void mailSuppressionCompte(String email) {
		final String MAIL = "<p>Bonjour</p>"
				+ "<p>Votre compte sur mycompanyhelper a bien été supprimé</p>"
				+ "<p>L'équipe de mycompanyhelper</p>"
				+ "<p>Ce message vous a été envoyé depuis <a href=\"https://www.mycompanyhelper.com\">mycompanyhelper.com</a></p>";

		send(email, MAIL_FROM, "mycompanyhelper", "suppression de votre compte", MAIL, null);
	}

	public void writePdf(OutputStream outputStream, Facture facture) throws Exception {

		Entreprise entreprise = entrepriseRepository.findByIdUser(facture.getIdUser());
		Client client = facture.getClient();

		Document document = new Document();
		PdfWriter.getInstance(document, outputStream);

		document.open();

		Font big = new Font(Font.FontFamily.TIMES_ROMAN, 18, Font.BOLD);
		Font small = new Font(Font.FontFamily.TIMES_ROMAN, 10);

		PdfPTable details = new PdfPTable(2);
		details.addCell(getCell(client.getNom() + " " + client.getPrenom(), Element.ALIGN_LEFT));
		details.addCell(getCell(entreprise.getNom(), Element.ALIGN_RIGHT));
		details.addCell(getCell(client.getAdresse(), Element.ALIGN_LEFT));
		details.addCell(getCell("Siret : " + entreprise.getSiret(), Element.ALIGN_RIGHT));
		details.addCell(getCell(client.getCodePostal() + " " + client.getVille(), Element.ALIGN_LEFT));
		details.addCell(getCell(entreprise.getAdresse(), Element.ALIGN_RIGHT));
		details.addCell(getCell(" ", Element.ALIGN_LEFT));
		details.addCell(getCell(entreprise.getCodePostal() + " " + entreprise.getVille(), Element.ALIGN_RIGHT));
		details.addCell(getCell(" ", Element.ALIGN_LEFT));
		details.addCell(getCell(entreprise.getTelephone(), Element.ALIGN_RIGHT));
		details.addCell(getCell(" ", Element.ALIGN_LEFT));
		details.addCell(getCell(entreprise.getEmail(), Element.ALIGN_RIGHT));
		details.setWidthPercentage(100);
		document.add(details);

		document.add(new Paragraph(" "));

		Paragraph factureParagraph = new Paragraph();
		Paragraph numero = new Paragraph(facture.isDevis() ? "Devis n° " + facture.getNumero() : "Facture n° " + facture.getNumero(), big);
		numero.setAlignment(Element.ALIGN_CENTER);
		factureParagraph.add(numero);
		document.add(factureParagraph);

		SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
		document.add(new Paragraph(dateFormat.format(facture.getDate())));

		document.add(new Paragraph(" "));

		PdfPTable tableau;

		if(!entreprise.isMicroEntreprise()) {
			tableau = new PdfPTable(5);
		} else {
			tableau = new PdfPTable(4);
		}

		PdfPCell c = new PdfPCell(new Phrase("Produit"));
		c.setHorizontalAlignment(Element.ALIGN_CENTER);
		c.setPadding(10);
		tableau.addCell(c);

		c = new PdfPCell(new Phrase("prix unitaire"));
		c.setHorizontalAlignment(Element.ALIGN_CENTER);
		c.setPadding(10);
		tableau.addCell(c);

		c = new PdfPCell(new Phrase("quantitée"));
		c.setHorizontalAlignment(Element.ALIGN_CENTER);
		c.setPadding(10);
		tableau.addCell(c);

		c = new PdfPCell(new Phrase("Prix"));
		c.setHorizontalAlignment(Element.ALIGN_CENTER);
		c.setPadding(10);
		tableau.addCell(c);
		tableau.setHeaderRows(1);

		if(!entreprise.isMicroEntreprise()) {
			c = new PdfPCell(new Phrase("TVA"));
			c.setHorizontalAlignment(Element.ALIGN_CENTER);
			c.setPadding(10);
			tableau.addCell(c);
			tableau.setHeaderRows(1);
		}

		facture.getProduitsFacture().forEach(
				p -> {
					PdfPCell pCell = new PdfPCell(new Phrase(p.getProduit().getDesignation()));
					pCell.setHorizontalAlignment(Element.ALIGN_CENTER);
					pCell.setPadding(10);
					tableau.addCell(pCell);

					pCell = new PdfPCell(new Phrase(p.getProduit().getPrixVente() + "€"));
					pCell.setHorizontalAlignment(Element.ALIGN_CENTER);
					pCell.setPadding(10);
					tableau.addCell(pCell);

					pCell = new PdfPCell(new Phrase(Integer.toString(p.getQuantite())));
					pCell.setHorizontalAlignment(Element.ALIGN_CENTER);
					pCell.setPadding(10);
					tableau.addCell(pCell);

					pCell = new PdfPCell(new Phrase(p.getQuantite() * p.getProduit().getPrixVente() + "€"));
					pCell.setHorizontalAlignment(Element.ALIGN_CENTER);
					pCell.setPadding(10);
					tableau.addCell(pCell);

					if(!entreprise.isMicroEntreprise()) {
						pCell = new PdfPCell(new Phrase(p.getProduit().getTva() + "%"));
						pCell.setHorizontalAlignment(Element.ALIGN_CENTER);
						pCell.setPadding(10);
						tableau.addCell(pCell);
					}
				}
		);

		facture.getPrestationsFacture().forEach(
				p -> {
					PdfPCell pCell = new PdfPCell(new Phrase(p.getPrestation().getDesignation()));
					pCell.setHorizontalAlignment(Element.ALIGN_CENTER);
					pCell.setPadding(10);
					tableau.addCell(pCell);

					pCell = new PdfPCell(new Phrase(p.getPrestation().getPrix() + "€/" + p.getPrestation().getUnitee()));
					pCell.setHorizontalAlignment(Element.ALIGN_CENTER);
					pCell.setPadding(10);
					tableau.addCell(pCell);

					pCell = new PdfPCell(new Phrase(p.getQuantite() + " " + p.getPrestation().getUnitee()));
					pCell.setHorizontalAlignment(Element.ALIGN_CENTER);
					pCell.setPadding(10);
					tableau.addCell(pCell);

					pCell = new PdfPCell(new Phrase(p.getQuantite() * p.getPrestation().getPrix() + "€"));
					pCell.setHorizontalAlignment(Element.ALIGN_CENTER);
					pCell.setPadding(10);
					tableau.addCell(pCell);

					if(!entreprise.isMicroEntreprise()) {
						pCell = new PdfPCell(new Phrase(p.getPrestation().getTva() + "%"));
						pCell.setHorizontalAlignment(Element.ALIGN_CENTER);
						pCell.setPadding(10);
						tableau.addCell(pCell);
					}
				}
		);
		tableau.setWidthPercentage(100);
		document.add(tableau);

		Paragraph totalHT = new Paragraph();
		totalHT.add("Total HT : " + facture.getTotalHT() + "€");
		totalHT.setAlignment(Element.ALIGN_RIGHT);
		document.add(totalHT);

		if(facture.getTva21() != 0) {
			Paragraph tva21 = new Paragraph();
			tva21.add("TVA à 2,1% : " + facture.getTva21() + "€");
			tva21.setAlignment(Element.ALIGN_RIGHT);
			document.add(tva21);
		}

		if(facture.getTva55() != 0) {
			Paragraph tva55 = new Paragraph();
			tva55.add("TVA à 5,5% : " + facture.getTva55() + "€");
			tva55.setAlignment(Element.ALIGN_RIGHT);
			document.add(tva55);
		}

		if(facture.getTva10() != 0) {
			Paragraph tva10 = new Paragraph();
			tva10.add("TVA à 10% : " + facture.getTva10() + "€");
			tva10.setAlignment(Element.ALIGN_RIGHT);
			document.add(tva10);
		}

		if(facture.getTva20() != 0) {
			Paragraph tva20 = new Paragraph();
			tva20.add("TVA à 20% : " + facture.getTva20() + "€");
			tva20.setAlignment(Element.ALIGN_RIGHT);
			document.add(tva20);
		}

		if(facture.getRemise() != 0) {
			Paragraph remise = new Paragraph();
			remise.add("Remise : " + facture.getRemise() + "%");
			remise.setAlignment(Element.ALIGN_RIGHT);
			document.add(remise);
		}

		Paragraph totalTTC = new Paragraph();
		totalTTC.add("Total TTC : " + facture.getTotalTTC() + "€");
		totalTTC.setAlignment(Element.ALIGN_RIGHT);
		document.add(totalTTC);

		if(entreprise.isMicroEntreprise()) {
			Paragraph sansTva = new Paragraph();
			sansTva.add(new Paragraph("TVA non applicable, art. 293B du CGI"));
			document.add(sansTva);
		}

		if(!facture.isDevis()) {
			Paragraph mentions = new Paragraph();
			mentions.add(new Paragraph("Payable à 30 jours date de facture", small));
			mentions.add(new Paragraph("En cas de retard de paiement, indemnité forfaitaire légale pour frais de recouvrement : 40,00 €", small));
			document.add(mentions);
		}

		document.close();
	}

	private PdfPCell getCell(String text, int align) {
		PdfPCell cell = new PdfPCell(new Phrase(new Paragraph(text)));
		cell.setPadding(0);
		cell.setHorizontalAlignment(align);
		cell.setBorder(0);
		return cell;
	}
}
