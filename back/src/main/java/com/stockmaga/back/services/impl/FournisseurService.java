package com.stockmaga.back.services.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.stockmaga.back.models.Client;
import com.stockmaga.back.models.Fournisseur;
import com.stockmaga.back.models.Reponse;
import com.stockmaga.back.repositories.FournisseurRepository;
import com.stockmaga.back.services.IAbonnementService;
import com.stockmaga.back.services.IFournisseurService;
import com.stripe.exception.StripeException;

@Service
public class FournisseurService implements IFournisseurService {

	@Autowired
	private FournisseurRepository fournisseurRepository;

	@Autowired
	private IAbonnementService abonnementService;

	/**
	 * recuperer tout les fournisseurs d'un utilisateur suivant son id
	 */
	@Override
	public List<Fournisseur> getAllFournisseurs(Long idUser) {
		return fournisseurRepository.findByIdUser(idUser);
	}

	/**
	 * recuperer un fournisseur suivant son id
	 */
	@Override
	public Fournisseur getOneFournisseur(Integer id) {
		return fournisseurRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Fournisseur inexistant"));
	}

	/**
	 * créer ou modifier un fournisseur
	 * si id, modification, sinon création
	 */
	@Override
	public ResponseEntity<?> saveFournisseur(Fournisseur fournisseur) {
		try {
			abonnementService.augmenterNbRequete(fournisseur.getIdUser());
			return ResponseEntity.status(HttpStatus.CREATED).body(fournisseurRepository.save(fournisseur));

		} catch (StripeException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Reponse("problème lors de la création."));

		}
	}

	/**
	 * suppression d'un fournisseur
	 */
	@Override
	public ResponseEntity<?> deleteFournisseur(Integer id) {
		Optional<Fournisseur> fournisseur = fournisseurRepository.findById(id);
		try {
			abonnementService.augmenterNbRequete(fournisseur.get().getIdUser());
			fournisseurRepository.deleteById(id);
			return ResponseEntity.status(HttpStatus.OK).body(new Reponse("Client supprimé"));
		} catch (StripeException e) {
			e.printStackTrace();
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Reponse("Problème lors de la suppression"));
		}
	}

}
