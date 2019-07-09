package com.stockmaga.back.api;

import com.stockmaga.back.models.Entreprise;
import com.stockmaga.back.models.Produit;
import com.stockmaga.back.models.Reponse;
import com.stockmaga.back.repositories.EntrepriseRepository;
import com.stockmaga.back.services.IEmailService;
import com.stockmaga.back.services.IProduitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@CrossOrigin({"http://localhost:4200", "http://www.mycompanyhelper.com", "https://www.mycompanyhelper.com",
		"http://powersell.eu-west-3.elasticbeanstalk.com"})
@RequestMapping("/api")
public class EntrepriseController {

	@Autowired
	private EntrepriseRepository entrepriseRepository;
	
	@GetMapping("/entreprise")
	@PreAuthorize("hasRole('ADMIN') OR hasRole('GESTIONNAIRE')")
	public ResponseEntity<?> findEntreprise(@RequestParam Long idUser){
		Entreprise entreprise = entrepriseRepository.findByIdUser(idUser);
		return ResponseEntity.status(HttpStatus.OK).body(entreprise);
	}
	
	@PostMapping("/entreprise/save")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> saveProduits(@RequestBody Entreprise entreprise){
		return ResponseEntity.status(HttpStatus.CREATED).body(entrepriseRepository.save(entreprise));
	}

}
