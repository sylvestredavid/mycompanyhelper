package com.stockmaga.back.api;

import com.stockmaga.back.models.*;
import com.stockmaga.back.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.List;

@Controller
@CrossOrigin({"http://localhost:4200", "http://www.mycompanyhelper.com", "https://www.mycompanyhelper.com", "http://powersell.eu-west-3.elasticbeanstalk.com"})
@RequestMapping("/api/achats")
public class AchatController {

	@Autowired
	private IAchatService achatService;

	@GetMapping("")
	@PreAuthorize("hasRole('ADMIN') OR hasRole('GESTIONNAIRE')")
	public ResponseEntity<?> findAllAchatsByUser(@RequestParam Long idUser){
		List<Achat> achats = achatService.findAllAchat(idUser);
		return ResponseEntity.status(HttpStatus.OK).body(achats);
	}

	@PostMapping("/save")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> savefactures(@RequestBody Achat achat){

		return achatService.saveAchat(achat);
	}

	@DeleteMapping("/delete")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> deleteAchat(@RequestParam(name="id", required=true) Integer id){
		return achatService.deleteAchat(id);
	}
}
