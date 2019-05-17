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

import com.stockmaga.back.models.Produit;
import com.stockmaga.back.models.Reponse;
import com.stockmaga.back.services.IEmailService;
import com.stockmaga.back.services.IProduitService;

@Controller
@CrossOrigin({"http://localhost:4200", "http://www.mycompanyhelper.com", "https://www.mycompanyhelper.com", "http://powersell.eu-west-3.elasticbeanstalk.com"})
@RequestMapping("/api")
public class ProduitController {

	@Autowired
	private IProduitService produitService;

	@Autowired
	private IEmailService emailService;
	
	@GetMapping("/produits")
	@PreAuthorize("hasRole('ADMIN') OR hasRole('GESTIONNAIRE')")
	public ResponseEntity<?> findAllProduits(@RequestParam Long idUser){
		List<Produit> produits = produitService.findAllProduits(idUser);
		return ResponseEntity.status(HttpStatus.OK).body(produits);
	}
	
	@GetMapping("/produits/{id}")
	@PreAuthorize("hasRole('ADMIN') OR hasRole('GESTIONNAIRE')")
	public ResponseEntity<?> findOneProduits(@PathVariable() Integer id){
		Produit produit = produitService.findOneProduits(id);
		return ResponseEntity.status(HttpStatus.OK).body(produit);
	}
	
	@PostMapping("/produits/save") 
	@PreAuthorize("hasRole('ADMIN') OR hasRole('GESTIONNAIRE')")
	public ResponseEntity<?> saveProduits(@RequestBody Produit produit){
		return produitService.saveProduits(produit);
	}
	
	@DeleteMapping("/produits/delete")
	@PreAuthorize("hasRole('ADMIN') OR hasRole('GESTIONNAIRE')")
	public ResponseEntity<?> deleteProduits(@RequestParam(name="id", required=true) Integer id){
		return produitService.deleteProduits(id);
	}
	
	@PostMapping("/produits/remettreEnVente") 
	@PreAuthorize("hasRole('ADMIN') OR hasRole('GESTIONNAIRE')")
	public ResponseEntity<?> remettreEnVente(@RequestParam(name="id", required=true) Integer id){
		return produitService.remettreEnVente(id);
	}
	
	@PostMapping("/produits/diminuer") 
	@PreAuthorize("hasRole('ADMIN') OR hasRole('GESTIONNAIRE')")
	public ResponseEntity<?> enleverQuantite(@RequestParam(name="id", required=true) Integer id, @RequestParam(name="quantite", required=true) int quantite){
		produitService.enleverQuantite(id, quantite);
		return ResponseEntity.status(HttpStatus.OK).body(new Reponse("Quantitée diminuée."));
	}
	
	@PostMapping("/produits/mailStockBas") 
	@PreAuthorize("hasRole('ADMIN') OR hasRole('GESTIONNAIRE')")
	public ResponseEntity<?> mailStockBas(@RequestParam(name="email", required=true) String email, @RequestParam(name="produit", required=true) String produit){
		emailService.mailStockBas(produit, email);
		return ResponseEntity.status(HttpStatus.OK).body(new Reponse("mail envoyé."));
	}
}
