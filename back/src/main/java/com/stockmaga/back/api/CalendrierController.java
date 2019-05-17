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

import com.stockmaga.back.models.Calendrier;
import com.stockmaga.back.models.Client;
import com.stockmaga.back.services.ICalendrierService;
import com.stockmaga.back.services.IClientService;

@Controller
@CrossOrigin({"http://localhost:4200", "http://www.mycompanyhelper.com", "https://www.mycompanyhelper.com", "http://powersell.eu-west-3.elasticbeanstalk.com"})
@RequestMapping("/api")
public class CalendrierController {

	@Autowired
	private ICalendrierService calendrierService;
	
	@GetMapping("/calendrier")
	@PreAuthorize("hasRole('ADMIN') OR hasRole('GESTIONNAIRE')")
	public ResponseEntity<?> findAllclients(@RequestParam Long idUser){
		List<Calendrier> calendriers = calendrierService.findAllCalendrier(idUser);
		return ResponseEntity.status(HttpStatus.OK).body(calendriers);
	}
	
	@PostMapping("/calendrier/save")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> saveclient(@RequestBody Calendrier calendrier){
		return calendrierService.saveCalendrier(calendrier);
	}
	
	@DeleteMapping("/calendrier/delete")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> deleteclient(@RequestParam(name="id", required=true) Integer id){
		return calendrierService.deleteCalendrier(id); 
	}
}
