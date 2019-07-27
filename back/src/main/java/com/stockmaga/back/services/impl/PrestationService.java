package com.stockmaga.back.services.impl;

import com.stockmaga.back.models.Prestation;
import com.stockmaga.back.models.Reponse;
import com.stockmaga.back.repositories.PrestationRepository;
import com.stockmaga.back.services.IAbonnementService;
import com.stockmaga.back.services.IPrestationService;
import com.stripe.exception.StripeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PrestationService implements IPrestationService {

	@Autowired
	private PrestationRepository prestationRepository;

	@Autowired
	private IAbonnementService abonnementService;


	@Override
	public List<Prestation> findAllPrestations(Long idUser) {
		return prestationRepository.findByIdUser(idUser);
	}

	@Override
	public ResponseEntity<?> savePrestation(Prestation prestation) {
		try {
			abonnementService.augmenterNbRequete(prestation.getIdUser());
			return ResponseEntity.status(HttpStatus.CREATED).body(prestationRepository.save(prestation));

		} catch (StripeException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Reponse("problème lors de la création."));

		}
	}

	@Override
	public ResponseEntity<?> deletePrestation(Integer id) {
		Optional<Prestation> prestation = prestationRepository.findById(id);
		try {
			abonnementService.augmenterNbRequete(prestation.get().getIdUser());
			prestationRepository.deleteById(id);
			return ResponseEntity.status(HttpStatus.OK).body(new Reponse("achat supprimé"));
		} catch (StripeException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Reponse("Problème lors de la suppression"));
		}
	}
}
