package com.stockmaga.back.api;

import java.util.List;
import java.util.Optional;

import com.stockmaga.back.models.User;
import com.stockmaga.back.repositories.EntrepriseRepository;
import com.stockmaga.back.repositories.UserRepository;
import com.stockmaga.back.services.IUserService;
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

import com.stockmaga.back.models.Facture;
import com.stockmaga.back.models.Reponse;
import com.stockmaga.back.services.IEmailService;
import com.stockmaga.back.services.IFactureService;

@Controller
@CrossOrigin({"http://localhost:4200", "http://www.mycompanyhelper.com", "https://www.mycompanyhelper.com", "http://powersell.eu-west-3.elasticbeanstalk.com"})
@RequestMapping("/api")
public class FactureController {

	@Autowired
	private IFactureService factureService;

	@Autowired
	private IEmailService emailService;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private EntrepriseRepository entrepriseRepository;

	@GetMapping("/factures/findByUser")
	@PreAuthorize("hasRole('ADMIN') OR hasRole('GESTIONNAIRE')")
	public ResponseEntity<?> findAllfacturesByUser(@RequestParam Long idUser){
		List<Facture> factures = factureService.findAllfacturesByUser(idUser);
		return ResponseEntity.status(HttpStatus.OK).body(factures);
	}

	@GetMapping("/factures")
	@PreAuthorize("hasRole('ADMIN') OR hasRole('GESTIONNAIRE')")
	public ResponseEntity<?> findAllfactures(@RequestParam Integer idClient){
		List<Facture> factures = factureService.findAllfactures(idClient);
		return ResponseEntity.status(HttpStatus.OK).body(factures);
	}
	
	@GetMapping("/factures/{id}")
	@PreAuthorize("hasRole('ADMIN') OR hasRole('GESTIONNAIRE')")
	public ResponseEntity<?> findOnefactures(@PathVariable() Integer id){
		Facture facture = factureService.findOnefactures(id);
		return ResponseEntity.status(HttpStatus.OK).body(facture);
	}
	
	@PostMapping("/factures/save")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> savefactures(@RequestBody Facture facture){
		return factureService.savefactures(facture);
	} 
	
	@PostMapping("/factures/saveProduits")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> saveProduitfactures(@RequestParam(name="quantite", required=true) int quantite,
			@RequestParam(name="idProduit", required=true) Integer idProduit,
			@RequestParam(name="idFacture", required=true) Integer idFacture){
		factureService.saveProduitfactures(quantite, idProduit, idFacture);
		return ResponseEntity.status(HttpStatus.CREATED).body(new Reponse("Facture enregistrée"));
	}

	@PostMapping("/factures/savePestations")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> savePrestationfactures(@RequestParam(name="quantite", required=true) int quantite,
												 @RequestParam(name="idPrestation", required=true) Integer idPrestation,
												 @RequestParam(name="idFacture", required=true) Integer idFacture){
		factureService.savePrestationfactures(quantite, idPrestation, idFacture);
		return ResponseEntity.status(HttpStatus.CREATED).body(new Reponse("Facture enregistrée"));
	}

	@PostMapping("/factures/sendMail")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> sendFacture(@RequestParam(name="idFacture", required=true) Integer idFacture){
		Facture facture = factureService.findOnefactures(idFacture);
		Optional<User> user = userRepository.findById(facture.getIdUser());
		String entreprise = entrepriseRepository.findByIdUser(user.get().getId()) != null ? entrepriseRepository.findByIdUser(user.get().getId()).getNom() : "mycompanyhelper";
		emailService.sendFacture(facture, entreprise);
		return ResponseEntity.status(HttpStatus.OK).body(new Reponse("mail envoyé."));
	}  
	
	@DeleteMapping("/factures/delete")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> deletefactures(@RequestParam(name="id", required=true) Integer id){
		factureService.deletefactures(id);
		return ResponseEntity.status(HttpStatus.OK).body(new Reponse("Facture supprimée."));
	}
}
