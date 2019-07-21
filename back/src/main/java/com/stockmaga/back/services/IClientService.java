package com.stockmaga.back.services;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;

import com.stockmaga.back.models.Client;

public interface IClientService {

	public List<Client> findAllclients(Long idUser);
	
	public Client findOneclients(Integer id);
	
	public ResponseEntity<?> saveclient(Client client);
	
	public ResponseEntity<?> deleteclient(Integer id);

	public Optional<Client> updatePanierMoyen(Double panierMoyen, Integer idClient);
}
