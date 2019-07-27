package com.stockmaga.back.api;

import com.stockmaga.back.models.Prestation;
import com.stockmaga.back.services.IPrestationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@CrossOrigin({"http://localhost:4200", "http://www.mycompanyhelper.com", "https://www.mycompanyhelper.com", "http://powersell.eu-west-3.elasticbeanstalk.com"})
@RequestMapping("/api/prestations")
public class PrestationController {

	@Autowired
	private IPrestationService prestationService;

	@GetMapping("")
	@PreAuthorize("hasRole('ADMIN') OR hasRole('GESTIONNAIRE')")
	public ResponseEntity<?> findAllPrestations(@RequestParam Long idUser){
		List<Prestation> prestations = prestationService.findAllPrestations(idUser);
		return ResponseEntity.status(HttpStatus.OK).body(prestations);
	}

	@PostMapping("/save")
	@PreAuthorize("hasRole('ADMIN') OR hasRole('GESTIONNAIRE')")
	public ResponseEntity<?> savePrestation(@RequestBody Prestation prestation){

		return prestationService.savePrestation(prestation);
	}

	@DeleteMapping("/delete")
	@PreAuthorize("hasRole('ADMIN') OR hasRole('GESTIONNAIRE')")
	public ResponseEntity<?> deletePrestation(@RequestParam(name="id", required=true) Integer id){
		return prestationService.deletePrestation(id);
	}
}
