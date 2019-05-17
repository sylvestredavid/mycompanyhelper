package com.stockmaga.back.services.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.stockmaga.back.models.Client;
import com.stockmaga.back.models.Produit;
import com.stockmaga.back.models.Reponse;
import com.stockmaga.back.repositories.ProduitRepository;
import com.stockmaga.back.services.IAbonnementService;
import com.stockmaga.back.services.IProduitService;
import com.stripe.exception.StripeException;

@Service
public class ProduitService implements IProduitService {

	@Autowired
	private ProduitRepository produitRepository;

	@Autowired
	private IAbonnementService abonnementService;

	/**
	 * récupere tout les produits d'un utilisateur suivant son id
	 */
	@Override
	public List<Produit> findAllProduits(Long idUser) {
		return produitRepository.findByIdUser(idUser);
	}

	/**
	 * récupere un produit suivant son id
	 */
	@Override
	public Produit findOneProduits(Integer id) {
		return produitRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Produit inexistant"));
	}

	/**
	 * enregistrer ou modifie un produit suivant si le produit envoyaé a un id ou pas
	 */
	@Override
	public ResponseEntity<?> saveProduits(Produit produit) {
		try {
			abonnementService.augmenterNbRequete(produit.getIdUser());
			return ResponseEntity.status(HttpStatus.CREATED).body(produitRepository.save(produit));

		} catch (StripeException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Reponse("problème lors de la création."));

		}
	}

	/**
	 * met un produit hors vente, on ne supprime pas les produits afin de garder les factures
	 * si on supprime un produit, ca supprime les factures correspondantes, ce qui n'est pas interressant pour les users
	 */
	@Override
	public ResponseEntity<?> deleteProduits(Integer id) {
		Optional<Produit> produit = produitRepository.findById(id);
		try {
			abonnementService.augmenterNbRequete(produit.get().getIdUser());
			produitRepository.mettreHorsVente(id);
			return ResponseEntity.status(HttpStatus.OK).body(new Reponse("Client supprimé"));
		} catch (StripeException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Reponse("Problème lors de la suppression"));
		}
	}

	/**
	 * remet un produit en vente
	 */
	@Override
	public ResponseEntity<?> remettreEnVente(Integer id) {
		Optional<Produit> produit = produitRepository.findById(id);
		try {
			abonnementService.augmenterNbRequete(produit.get().getIdUser());
			produitRepository.remettreEnVente(id);
			return ResponseEntity.status(HttpStatus.OK).body(new Reponse("Client supprimé"));
		} catch (StripeException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Reponse("Problème lors de la suppression"));
		}

	}

	/**
	 * diminue la quantité d'un produit, methode appelée a chaque création de facture
	 */
	@Override
	public void enleverQuantite(Integer id, int quantite) {
		produitRepository.enleverQuantite(quantite, id);

	}

	/**
	 * met l'id genre d'un produit a null lorsque son genre est supprimé
	 */
	@Override
	public void idGenreNull(Integer idGenre) {
		produitRepository.idGenreNull(idGenre);

	}

}
