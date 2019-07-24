package com.stockmaga.back.services.impl;

import com.stockmaga.back.models.CAPrevisionnel;
import com.stockmaga.back.models.Reponse;
import com.stockmaga.back.repositories.CAPrevisionnelRepository;
import com.stockmaga.back.services.IAbonnementService;
import com.stockmaga.back.services.ICAPrevisionnelService;
import com.stripe.exception.StripeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CAPrevisionnelService implements ICAPrevisionnelService {

	@Autowired
	private CAPrevisionnelRepository caPrevisionnelRepository;

	@Autowired
	private IAbonnementService abonnementService;

	@Override
	public List<CAPrevisionnel> findCAPrevisionnel(int idUser) {
		return caPrevisionnelRepository.getCAPrevisionnelOrdering(idUser);
	}

	@Override
	public ResponseEntity<?> saveCAPrevisionnel(CAPrevisionnel caPrevisionnel) {
		try {
			abonnementService.augmenterNbRequete(caPrevisionnel.getIdUser());
			return ResponseEntity.status(HttpStatus.CREATED).body(caPrevisionnelRepository.save(caPrevisionnel));

		} catch (StripeException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Reponse("problème lors de la création."));

		}
	}
}
