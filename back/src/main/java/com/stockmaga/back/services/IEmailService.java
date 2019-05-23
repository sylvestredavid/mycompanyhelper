package com.stockmaga.back.services;

import java.util.List;

import com.stockmaga.back.models.Annonce;
import com.stockmaga.back.models.Calendrier;
import com.stockmaga.back.models.Email;
import com.stockmaga.back.models.Facture;
import com.stockmaga.back.models.User;
import com.stockmaga.back.request.SignUpForm;

public interface IEmailService {

	public void sendFacture(Facture facture, String entreprise);
	
	public void sendGestMail(User user);
	
	public void sendMailToFournisseur(Email email);
	
	public void sendPasswordMail(String mail, String lien);

	public void mailStockBas(String produit, String email);

	public void sendInscriptionMail(SignUpForm signUpRequest);

	public void sendMailMiseEnAvant(Annonce annonce);

	public void sendMailCalendrier(String email, List<Calendrier> calendrier);
}
