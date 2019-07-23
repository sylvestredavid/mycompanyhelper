package com.stockmaga.back.services.impl;

import com.stockmaga.back.models.Achat;
import com.stockmaga.back.models.Genre;
import com.stockmaga.back.models.Reponse;
import com.stockmaga.back.repositories.AchatRepository;
import com.stockmaga.back.repositories.GenreRepository;
import com.stockmaga.back.repositories.ProduitRepository;
import com.stockmaga.back.services.IAbonnementService;
import com.stockmaga.back.services.IAchatService;
import com.stockmaga.back.services.IGenreService;
import com.stripe.exception.StripeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AchatService implements IAchatService {

	@Autowired
	private AchatRepository achatRepository;

	@Autowired
	private IAbonnementService abonnementService;


	@Override
	public List<Achat> findAllAchat(Long idUser) {
		return achatRepository.findByIdUser(idUser);
	}

	@Override
	public ResponseEntity<?> saveAchat(Achat achat) {
		try {
			abonnementService.augmenterNbRequete(achat.getIdUser());
			return ResponseEntity.status(HttpStatus.CREATED).body(achatRepository.save(achat));

		} catch (StripeException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Reponse("problème lors de la création."));

		}
	}

	@Override
	public ResponseEntity<?> deleteAchat(Integer id) {
		Optional<Achat> achat = achatRepository.findById(id);
		try {
			abonnementService.augmenterNbRequete(achat.get().getIdUser());
			achatRepository.deleteById(id);
			return ResponseEntity.status(HttpStatus.OK).body(new Reponse("achat supprimé"));
		} catch (StripeException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Reponse("Problème lors de la suppression"));
		}
	}
}
