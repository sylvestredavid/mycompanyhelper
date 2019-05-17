package com.stockmaga.back.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.stockmaga.back.models.Client;
import com.stockmaga.back.services.IClientService;

@Controller
@CrossOrigin({"http://localhost:4200", "http://www.mycompanyhelper.com", "https://www.mycompanyhelper.com", "http://powersell.eu-west-3.elasticbeanstalk.com"})
@RequestMapping("/api")
public class ClientController {

	@Autowired
	private IClientService clientService;
	
	@GetMapping("/clients")
	@PreAuthorize("hasRole('ADMIN') OR hasRole('GESTIONNAIRE')")
	public ResponseEntity<?> findAllclients(@RequestParam Long idUser){
		List<Client> clients = clientService.findAllclients(idUser);
		return ResponseEntity.status(HttpStatus.OK).body(clients);
	}
	
	@GetMapping("/clients/{id}")
	@PreAuthorize("hasRole('ADMIN') OR hasRole('GESTIONNAIRE')")
	public ResponseEntity<?> findOneclients(@PathVariable() Integer id){
		Client client = clientService.findOneclients(id);
		return ResponseEntity.status(HttpStatus.OK).body(client);
	}
	
	@PostMapping("/clients/save")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> saveclient(@RequestBody Client client){
		return clientService.saveclient(client);
	}
	
	@DeleteMapping("/clients/delete")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> deleteclient(@RequestParam(name="id", required=true) Integer id){
		return clientService.deleteclient(id); 
	}
}
