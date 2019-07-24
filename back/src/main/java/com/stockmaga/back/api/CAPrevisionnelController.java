package com.stockmaga.back.api;

import com.stockmaga.back.models.CAPrevisionnel;
import com.stockmaga.back.services.ICAPrevisionnelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@CrossOrigin({"http://localhost:4200", "http://www.mycompanyhelper.com", "https://www.mycompanyhelper.com", "http://powersell.eu-west-3.elasticbeanstalk.com"})
@RequestMapping("/api")
public class CAPrevisionnelController {

	@Autowired
	private ICAPrevisionnelService caPrevisionnelService;
	
	@GetMapping("/caPrevisionnel")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> findCAPrevisionnel(@RequestParam int idUser){
		List<CAPrevisionnel> caPrevisionnel = caPrevisionnelService.findCAPrevisionnel(idUser);
		return ResponseEntity.status(HttpStatus.OK).body(caPrevisionnel);
	}

	@PostMapping("/caPrevisionnel/save")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> saveCAPrevisionnel(@RequestBody CAPrevisionnel caPrevisionnel){
		return caPrevisionnelService.saveCAPrevisionnel(caPrevisionnel);
	}

}
