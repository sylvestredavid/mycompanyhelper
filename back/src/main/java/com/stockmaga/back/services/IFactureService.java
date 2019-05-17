package com.stockmaga.back.services;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.stockmaga.back.models.Facture;

public interface IFactureService {

	public List<Facture> findAllfactures(Integer idClient);
	
	public Facture findOnefactures(Integer id);
	
	public ResponseEntity<?> savefactures(Facture facture);
	
	public void saveProduitfactures(int quantite, Integer idProduit, Integer idFacture);
	
	public void deletefactures(Integer id);
}
