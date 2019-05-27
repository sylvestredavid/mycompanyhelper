package com.stockmaga.back.services;

import org.springframework.http.ResponseEntity;

import com.stripe.exception.StripeException;

public interface IAbonnementService {

	ResponseEntity<?> augmenterNbContacts(Integer id);

    ResponseEntity<?> suiviUtilisation(Long idUser);

    ResponseEntity<?> miseEnAvant(String token, Integer idAnnonce);

	ResponseEntity<?> abonementRequete(String token, String email);

	ResponseEntity<?> abonementFournisseur(String token, String email);

	boolean stopAbonnement(Long idUser);

	ResponseEntity<?> abonement(String token, String email);

	void augmenterNbRequete(Long idUser) throws StripeException;

    ResponseEntity<?> changerAbonnement(Long idUser);
}
