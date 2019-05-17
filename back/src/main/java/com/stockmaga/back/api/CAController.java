package com.stockmaga.back.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.stockmaga.back.models.CA;
import com.stockmaga.back.services.ICAService;

@Controller
@CrossOrigin({"http://localhost:4200", "http://www.mycompanyhelper.com", "https://www.mycompanyhelper.com", "http://powersell.eu-west-3.elasticbeanstalk.com"})
@RequestMapping("/api")
public class CAController {

	@Autowired
	private ICAService caService;
	
	@GetMapping("/ca")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> findCA(@RequestParam int idUser){
		List<CA> ca = caService.findCA(idUser);
		return ResponseEntity.status(HttpStatus.OK).body(ca);
	}

}
