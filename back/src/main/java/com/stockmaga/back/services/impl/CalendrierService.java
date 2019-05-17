package com.stockmaga.back.services.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.stockmaga.back.models.Calendrier;
import com.stockmaga.back.models.Reponse;
import com.stockmaga.back.repositories.CalendrierRepository;
import com.stockmaga.back.services.IAbonnementService;
import com.stockmaga.back.services.ICalendrierService;
import com.stripe.exception.StripeException;

@Service 
public class CalendrierService implements ICalendrierService {
	
	@Autowired
	CalendrierRepository calendrierRepository;

	@Autowired
	private IAbonnementService abonnementService;
	
	@Override
	public List<Calendrier> findAllCalendrier(Long idUser) {
		return calendrierRepository.findByIdUser(idUser);
	}

	@Override
	public ResponseEntity<?> saveCalendrier(Calendrier calendrier) {
		try {
			abonnementService.augmenterNbRequete(calendrier.getIdUser());
			return ResponseEntity.status(HttpStatus.CREATED).body(calendrierRepository.save(calendrier));

		} catch (StripeException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Reponse("problème lors de la création."));

		}
	}

	@Override
	public ResponseEntity<?> deleteCalendrier(Integer id) {
		Optional<Calendrier> calendrier = calendrierRepository.findById(id);
		try {
			abonnementService.augmenterNbRequete(calendrier.get().getIdUser());
			calendrierRepository.deleteById(id);
			return ResponseEntity.status(HttpStatus.OK).body(new Reponse("calendrier supprimé"));
		} catch (StripeException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Reponse("Problème lors de la suppression"));
		}
	}

}
