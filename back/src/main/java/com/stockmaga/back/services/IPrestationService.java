package com.stockmaga.back.services;

import com.stockmaga.back.models.Prestation;
import com.stockmaga.back.models.Produit;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface IPrestationService {
	
	public List<Prestation> findAllPrestations(Long idUser);
	
	public ResponseEntity<?> savePrestation(Prestation prestation);
	
	public ResponseEntity<?> deletePrestation(Integer id);
	
	

}
