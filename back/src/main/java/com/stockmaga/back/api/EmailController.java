package com.stockmaga.back.api;

import com.stockmaga.back.models.Facture;
import com.stockmaga.back.models.Reponse;
import com.stockmaga.back.models.User;
import com.stockmaga.back.services.IEmailService;
import com.stockmaga.back.services.IFactureService;
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
public class EmailController {

//	@Autowired
//	private IEmailService emailService;
//
//	@PostMapping("/email/sendFacture")
//	@PreAuthorize("hasRole('ADMIN') OR hasRole('GESTIONNAIRE')")
//	public ResponseEntity<?> sendFacture(@RequestBody Facture facture){
//		return emailService.sendFacture(facture);
//	}
//
//	@PostMapping("/email/sendGestMail")
//	@PreAuthorize("hasRole('ADMIN')")
//	public ResponseEntity<?> sendGestMail(@RequestBody User user){
//		return emailService.sendGestMail(user);
//	}
//
//	@PostMapping("/email/sendPasswordMail")
//	@PreAuthorize("hasRole('ADMIN') OR hasRole('GESTIONNAIRE')")
//	public ResponseEntity<?> sendPasswordMail(@RequestParam(name = "mail") String mail, @RequestParam(name = "lien") String lien){
//		return emailService.sendPasswordMail(mail, lien);
//	}


}
