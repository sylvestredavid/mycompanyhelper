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

import com.stockmaga.back.models.Fournisseur;
import com.stockmaga.back.models.Reponse;
import com.stockmaga.back.services.IFournisseurService;

@Controller
@CrossOrigin({"http://localhost:4200", "http://www.mycompanyhelper.com", "https://www.mycompanyhelper.com", "http://powersell.eu-west-3.elasticbeanstalk.com"})
@RequestMapping("/api")
public class FournisseurController {

	@Autowired
	private IFournisseurService fournisseurService;
	
	@GetMapping("/fournisseurs")
	@PreAuthorize("hasRole('ADMIN') OR hasRole('GESTIONNAIRE')")
	public ResponseEntity<?> getAllFournisseurs(@RequestParam Long idUser){
		List<Fournisseur> fournisseurs = fournisseurService.getAllFournisseurs(idUser);
		return ResponseEntity.ok(fournisseurs);
	}
	
	@GetMapping("/fournisseurs/{id}")
	@PreAuthorize("hasRole('ADMIN') OR hasRole('GESTIONNAIRE')")
	public ResponseEntity<?> getOneFournisseur(@PathVariable Integer id){
		Fournisseur fournisseur = fournisseurService.getOneFournisseur(id);
		return ResponseEntity.ok(fournisseur);
	}
	
	@PostMapping("/fournisseurs/save")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> saveFournisseur(@RequestBody Fournisseur fournisseur){
		return fournisseurService.saveFournisseur(fournisseur);
	}
	
	@DeleteMapping("/fournisseurs/delete")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> deleteFournisseur(@RequestParam(name="id", required=true) Integer id){
		return fournisseurService.deleteFournisseur(id);
	}
}
