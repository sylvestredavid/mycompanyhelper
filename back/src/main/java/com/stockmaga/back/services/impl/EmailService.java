package com.stockmaga.back.services.impl;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import com.stockmaga.back.repositories.EntrepriseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import org.springframework.core.env.Environment;
import com.stockmaga.back.models.Annonce;
import com.stockmaga.back.models.Calendrier;
import com.stockmaga.back.models.Email;
import com.stockmaga.back.models.Facture;
import com.stockmaga.back.models.FactureProduit;
import com.stockmaga.back.models.User;
import com.stockmaga.back.request.SignUpForm;
import com.stockmaga.back.services.IEmailService;

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
	 * @param  to l'adresse mail du destinataire
	 * @param  from l'adresse mail de l'expediteur
	 * @param  title le sujet du mail
	 * @param  mail Le corps du mail
	 */
	public void send(String to, String from, String name, String title, String mail) {

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

			message.setReplyTo(new javax.mail.Address[] { new javax.mail.internet.InternetAddress(from) });

			// Set To: header field of the header.
			message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));

			// Set Subject: header field
			message.setSubject(title);

			// Send the actual HTML message, as big as you like
			message.setContent(mail, "text/html; charset=UTF-8");

			// Send message
			Transport.send(message);


		} catch (MessagingException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
	}

	/**
	 * envoi de la facture a un client
	 */
	@Override
	public void sendFacture(Facture facture, String entreprise) {

		final String FACTURE_DEBUT = "<h1>Bonjour</h1>"
				+ "<p style='margin-top: 10px;'>Vous venez d'effectuer l'achat suivant:</p>"
				+ "<div style='width:80%;margin:auto'>"
				+ "<table style='border: 1px solid black; width:100%; border-collapse: collapse;'>"
				+ "<thead style='border: 1px solid black'>" + "<tr style='border: 1px solid black'>"
				+ "<th style='border: 1px solid black; border: 1px solid black; text-align:center; padding: 10px 20px'>Description</th>"
				+ "<th style='text-align:center; padding: 10px 20px; border: 1px solid black;'>Prix</th>"
				+ "<th style='text-align:center; padding: 10px 20px; border: 1px solid black;'>quantitée</th>"
				+ "<th style='text-align:center; padding: 10px 20px; border: 1px solid black;'>total</th>" + "</tr>"
				+ "</thead>" + "<tbody style='border: 1px solid black'>";
		String facture_millieu = "";
		int total = 0;
		for (FactureProduit factureProduit : facture.getProduitsFacture()) {
			facture_millieu += "<tr>" + "<td style='border: 1px solid black; text-align:center; padding: 10px 20px'>"
					+ factureProduit.getProduit().getDesignation() + "</td>"
					+ "<td style='border: 1px solid black; text-align:center; padding: 10px 20px'>"
					+ factureProduit.getProduit().getPrixVente() + " €</td>"
					+ "<td style='border: 1px solid black; text-align:center; padding: 10px 20px'>"
					+ factureProduit.getQuantite() + "</td>"
					+ "<td style='border: 1px solid black; text-align:center; padding: 10px 20px'>"
					+ (factureProduit.getProduit().getPrixVente() * factureProduit.getQuantite()) + " €</td>" + "</tr>";
			total += (factureProduit.getProduit().getPrixVente() * factureProduit.getQuantite());
		}

		final String FACTURE_FIN = "</tbody>" + "</table>" + "<p style='text-align:right'>Total: " + total + " €</p>"
				+ "</div>" + "<p style='margin-top:10px;'>Nous vous remercions pour votre confiance.</p>"
				+ "<p>Coridlament</p>"
				+ "<p>Ce message vous a été envoyé depuis <a href=\"https://www.mycompanyhelper.com\">mycompanyhelper.com</a></p>";

		final String MAIL = FACTURE_DEBUT + facture_millieu + FACTURE_FIN;

		send(facture.getClient().getEmail(), MAIL_FROM, entreprise,  "Merci pour votre achat", MAIL);
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

		send(user.getUsername(), MAIL_FROM, "mycompanyhelper", "Vous avez été ajouté en tant que gestionnaire.", Gest_Mail);
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

		send(mail, MAIL_FROM, "mycompanyhelper", "Votre demande de changement de mot de passe.", MAIL);

	}

	/**
	 * envoi d'une reponse a une annonce d'un fournisseur
	 */
	@Override
	@Async
	public void sendMailToFournisseur(Email email) {

		final String MAIL = "<div style='white-space: pre;'>" + email.getCorps() + "</div>"
				+ "<p>Ce message vous a été envoyé depuis <a href=\"https://www.mycompanyhelper.com\">mycompanyhelper.com</a></p>";

		send(email.getTo(), email.getFrom(), "mycompanyhelper", email.getTitre(), MAIL);

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

		send(email, MAIL_FROM, "mycompanyhelper", "mycompanyhelper alerte stock bas", MAIL);

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

		send(signUpRequest.getUsername(), MAIL_FROM, "mycompanyhelper", "Merci pour votre inscription", MAIL);

	}

	@Override
	@Async
	public void sendMailMiseEnAvant(Annonce annonce) {
		final String MAIL = "<p>Bonjour</p>" + "<p>L'annonce " + annonce.getTitre() + " à bien été mis en avant</p>"
				+ "<p>Votre compte sera débité de 5€.</p>" + "<p>Cordialement.</p>"
				+ "<p>L'équipe de mycompanyhelper</p>"
				+ "<p>Ce message vous a été envoyé depuis <a href=\"https://www.mycompanyhelper.com\">mycompanyhelper.com</a></p>";

		send(annonce.getEmail(), MAIL_FROM, "mycompanyhelper", "Merci pour votre achat", MAIL);
	}

	@Override
	public void sendMailCalendrier(String email, List<Calendrier> calendrier) {
		final String MAIL_DEBUT = "<p>Bonjour</p>"
				+"<p>voici vos rendez-vous de la journée</p>";
		
		StringBuilder sb = new StringBuilder();
		
		for (Calendrier c : calendrier) {
			sb.append("<p>").append(c.getTitle()).append(" à ").append(c.getStart().substring(11, 16)).append(".</p>");
		}
		String mailMillieu = sb.toString();
		final String MAIL_FIN = "<p>Cordialement.</p>"
				+ "<p>L'équipe de mycompanyhelper</p>"
				+"<p>Ce message vous a été envoyé depuis <a href=\"https://www.mycompanyhelper.com\">mycompanyhelper.com</a></p>";

		send(email, MAIL_FROM, "mycompanyhelper", "Votre planning de la journée", MAIL_DEBUT+mailMillieu+MAIL_FIN);
		
	}

	@Override
	@Async
	public void sendMailSupport(Email email) {

		send(email.getTo(), email.getFrom(), "demande support", email.getTitre(), email.getCorps());
	}

	@Override
	@Async
	public void mailSuppressionCompte(String email) {
		final String MAIL = "<p>Bonjour</p>"
				+ "<p>Votre compte sur mycompanyhelper a bien été supprimé</p>"
				+ "<p>L'équipe de mycompanyhelper</p>"
				+ "<p>Ce message vous a été envoyé depuis <a href=\"https://www.mycompanyhelper.com\">mycompanyhelper.com</a></p>";

		send(email, MAIL_FROM, "mycompanyhelper", "suppression de votre compte", MAIL);
	}
}
