package com.stockmaga.back.services.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stockmaga.back.models.Annonce;
import com.stockmaga.back.repositories.AnnonceRepository;
import com.stockmaga.back.services.IAnnonceService;

@Service
public class AnnonceService implements IAnnonceService {

	@Autowired
	private AnnonceRepository annonceRepository;

	/**
	 * recuperer toutes les annonces
	 */
	@Override
	public List<Annonce> findAllAnnonces() {
		return annonceRepository.findAll();
	}

	/**
	 * recuperer les annonces d'un fournisseur par l'id
	 */
	@Override
	public List<Annonce> findAllAnnoncesByFournisseur(Long idFournisseur) {
		return annonceRepository.findByIdFournisseur(idFournisseur);
	}

	/**
	 * recuperer une annonce par l'id
	 */
	@Override
	public Annonce findOneAnnonce(Integer id) {
		return annonceRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Produit inexistant"));
	}

	/**
	 * enregister ou modifier une annonce
	 * si id, modification, sinon création
	 */
	@Override
	public Annonce saveAnnonces(Annonce annonce) {
		return annonceRepository.save(annonce);
	}

	@Override
	public void deleteAnnonce(Integer id) {
		annonceRepository.deleteById(id);

	}

}
