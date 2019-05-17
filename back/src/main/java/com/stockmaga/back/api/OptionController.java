package com.stockmaga.back.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.stockmaga.back.models.Option;
import com.stockmaga.back.services.IOptionService;

@Controller
@CrossOrigin({"http://localhost:4200", "http://www.mycompanyhelper.com", "https://www.mycompanyhelper.com", "http://powersell.eu-west-3.elasticbeanstalk.com"})
@RequestMapping("/api")
public class OptionController {

	@Autowired
	private IOptionService optionService;
	
	@GetMapping("/option")
	@PreAuthorize("hasRole('ADMIN') OR hasRole('GESTIONNAIRE')")
	public ResponseEntity<?> findOptions(@RequestParam int idUser){
		Option option = optionService.findOptions(idUser);
		return ResponseEntity.status(HttpStatus.OK).body(option);
	}
	
	@PostMapping("/option/modif")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> saveOptions(@RequestBody Option option){
		Option newOption = optionService.saveOptions(option);
		return ResponseEntity.status(HttpStatus.CREATED).body(newOption);
	} 

}
