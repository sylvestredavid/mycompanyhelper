package com.stockmaga.back.services;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.stockmaga.back.models.Produit;

public interface IProduitService {
	
	public List<Produit> findAllProduits(Long idUser);
	
	public Produit findOneProduits(Integer id);
	
	public ResponseEntity<?> saveProduits(Produit produit);
	
	public ResponseEntity<?> deleteProduits(Integer id);
	
	public ResponseEntity<?> remettreEnVente(Integer id);
	
	public void enleverQuantite(Integer id, int quantite);
	
	public void idGenreNull(Integer idGenre);
	
	

}
