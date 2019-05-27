package com.stockmaga.back.services;

import java.util.List;

import com.stockmaga.back.models.Annonce;
import com.stockmaga.back.models.Calendrier;
import com.stockmaga.back.models.Email;
import com.stockmaga.back.models.Facture;
import com.stockmaga.back.models.User;
import com.stockmaga.back.request.SignUpForm;

public interface IEmailService {

	void sendFacture(Facture facture, String entreprise);
	
	void sendGestMail(User user);
	
	void sendMailToFournisseur(Email email);
	
	void sendPasswordMail(String mail, String lien);

	void mailStockBas(String produit, String email);

	void sendInscriptionMail(SignUpForm signUpRequest);

	void sendMailMiseEnAvant(Annonce annonce);

	void sendMailCalendrier(String email, List<Calendrier> calendrier);

	void sendMailSupport(Email email);

	void mailSuppressionCompte(String email);


}
