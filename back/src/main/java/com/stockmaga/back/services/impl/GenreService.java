package com.stockmaga.back.services.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.stockmaga.back.models.Genre;
import com.stockmaga.back.models.Produit;
import com.stockmaga.back.models.Reponse;
import com.stockmaga.back.repositories.GenreRepository;
import com.stockmaga.back.repositories.ProduitRepository;
import com.stockmaga.back.services.IAbonnementService;
import com.stockmaga.back.services.IGenreService;
import com.stripe.exception.StripeException;

@Service
public class GenreService implements IGenreService {

	@Autowired
	private GenreRepository genreRepository;

	@Autowired
	private ProduitRepository produitRepository;

	@Autowired
	private IAbonnementService abonnementService;

	/**
	 * récuperation de tout les genrs d'un utilisateur suivant son id
	 */
	@Override
	public List<Genre> findAllGenres(Long idUser) {
		return genreRepository.findByIdUser(idUser);
	}

	/**
	 * récuperation d'un genre suivant sa désignation
	 */
	@Override
	public Genre findOnegenre(String designation, Long idUser) {
		return genreRepository.findByDesignationAndIdUser(designation, idUser)
				.orElseThrow(() -> new RuntimeException("Genre inexistant"));
	}

	/**
	 * créer modifier un genre
	 * si id, modification sinon création
	 */
	@Override
	public ResponseEntity<?> saveGenre(Genre genre) {
		try {
			abonnementService.augmenterNbRequete(genre.getIdUser());
			return ResponseEntity.status(HttpStatus.CREATED).body(genreRepository.save(genre));

		} catch (StripeException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Reponse("problème lors de la création."));

		}
	}

	/**
	 * suppression d'un genre et mis a null l'idGenre des produits attachés
	 */
	@Override
	public ResponseEntity<?> deleteGenre(Integer id) {
		Optional<Genre> genre = genreRepository.findById(id);
		try {
			abonnementService.augmenterNbRequete(genre.get().getIdUser());
			genreRepository.deleteById(id);
			produitRepository.idGenreNull(id);
			return ResponseEntity.status(HttpStatus.OK).body(new Reponse("genre supprimé"));
		} catch (StripeException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Reponse("Problème lors de la suppression"));
		}
	}

}
