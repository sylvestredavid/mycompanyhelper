package com.stockmaga.back.services;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.stockmaga.back.models.Fournisseur;

public interface IFournisseurService {

	public List<Fournisseur> getAllFournisseurs(Long idUser);
	
	public Fournisseur getOneFournisseur(Integer id);
	
	public ResponseEntity<?> saveFournisseur(Fournisseur fournisseur);
	
	public ResponseEntity<?> deleteFournisseur(Integer id);
}
