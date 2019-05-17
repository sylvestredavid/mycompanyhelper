package com.stockmaga.back.services.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.stockmaga.back.models.Client;
import com.stockmaga.back.models.Reponse;
import com.stockmaga.back.repositories.ClientRepository;
import com.stockmaga.back.services.IAbonnementService;
import com.stockmaga.back.services.IClientService;
import com.stripe.exception.StripeException;

@Service
public class ClientService implements IClientService {

	@Autowired
	private ClientRepository clientRepository;

	@Autowired
	private IAbonnementService abonnementService;

	/**
	 * récuperer tout les clients d'un utilisateur par son id
	 */
	@Override
	public List<Client> findAllclients(Long idUser) {
		return clientRepository.findByIdUser(idUser);
	}

	/**
	 * récuperer un client suivant son id
	 */
	@Override
	public Client findOneclients(Integer id) {
		return clientRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Produit inexistant"));
	}

	/**
	 * enregister ou modifier un client
	 * si id, modification, sinon création
	 */
	@Override
	public ResponseEntity<?> saveclient(Client client) {
		try {
			abonnementService.augmenterNbRequete(client.getIdUser());
			return ResponseEntity.status(HttpStatus.CREATED).body(clientRepository.save(client));

		} catch (StripeException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Reponse("problème lors de la création."));

		}
	}

	/**
	 * supprime un client
	 */
	@Override
	public ResponseEntity<?> deleteclient(Integer id) {
		Optional<Client> client = clientRepository.findById(id);
		try {
			abonnementService.augmenterNbRequete(client.get().getIdUser());
			clientRepository.deleteById(id);
			return ResponseEntity.status(HttpStatus.OK).body(new Reponse("Client supprimé"));
		} catch (StripeException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Reponse("Problème lors de la suppression"));
		}
	}

}
