package com.stockmaga.back.services.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.stockmaga.back.models.Facture;
import com.stockmaga.back.models.Reponse;
import com.stockmaga.back.repositories.FactureRepository;
import com.stockmaga.back.services.IAbonnementService;
import com.stockmaga.back.services.IFactureService;
import com.stripe.exception.StripeException;

@Service
public class FactureService implements IFactureService {

	@Autowired
	private FactureRepository factureRepository;

	@Autowired
	private IAbonnementService abonnementService;

	/**
	 * récuperer toutes les factures d'un client suivant son id
	 */
	@Override
	public List<Facture> findAllfactures(Integer idClient) {
		return factureRepository.findByClientIdClient(idClient);
	}

	/**
	 * récuperer une facture suivant son id
	 */
	@Override
	public Facture findOnefactures(Integer id) {
		return factureRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Produit inexistant"));
	}

	/**
	 * créer ou modifier une facture
	 * si id, modification sinon création
	 */
	@Override
	public ResponseEntity<?> savefactures(Facture facture) {
		try {
			abonnementService.augmenterNbRequete(facture.getIdUser());
			return ResponseEntity.status(HttpStatus.CREATED).body(factureRepository.save(facture));

		} catch (StripeException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Reponse("problème lors de la création."));

		}
	}

	/**
	 * enregistre les produits d'une facture
	 */
	@Override
	public void saveProduitfactures(int quantite, Integer idProduit, Integer idFacture) {
		factureRepository.saveProduit(quantite, idFacture, idProduit);

	}
	@Override
	public void savePrestationfactures(int quantite, Integer idPrestation, Integer idFacture) {
		factureRepository.savePrestation(quantite, idFacture, idPrestation);

	}

	/**
	 * supprimer une facture
	 */
	@Override
	public void deletefactures(Integer id) {
		factureRepository.deleteById(id);
		factureRepository.deleteFactureProduit(id);

	}

	@Override
	public List<Facture> findAllfacturesByUser(Long idUser) {
		return factureRepository.findByIdUser(idUser);
	}

	public void autoIncrement() {
		factureRepository.setAutoIncrement();
	}

}
