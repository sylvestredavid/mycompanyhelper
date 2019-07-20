package com.stockmaga.back.api;

import com.stockmaga.back.models.Entreprise;
import com.stockmaga.back.models.Produit;
import com.stockmaga.back.models.Reponse;
import com.stockmaga.back.repositories.EntrepriseRepository;
import com.stockmaga.back.services.IEmailService;
import com.stockmaga.back.services.IProduitService;
import com.stockmaga.back.services.impl.FileService;
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
@CrossOrigin({"http://localhost:4200", "http://www.mycompanyhelper.com", "https://www.mycompanyhelper.com",
		"http://powersell.eu-west-3.elasticbeanstalk.com"})
@RequestMapping("/api/entreprise")
public class EntrepriseController {

	@Autowired
	private EntrepriseRepository entrepriseRepository;

	@Autowired
	private FileService fileService;
	
	@GetMapping("")
	@PreAuthorize("hasRole('ADMIN') OR hasRole('GESTIONNAIRE')")
	public ResponseEntity<?> findEntreprise(@RequestParam Long idUser){
		Entreprise entreprise = entrepriseRepository.findByIdUser(idUser);
		return ResponseEntity.status(HttpStatus.OK).body(entreprise);
	}
	
	@PostMapping("/save")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> saveProduits(@RequestBody Entreprise entreprise){
		return ResponseEntity.status(HttpStatus.CREATED).body(entrepriseRepository.save(entreprise));
	}

	@PostMapping(value = "/files/upload", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
	public ResponseEntity<?> uploadFile(@RequestParam(name = "data") MultipartFile file) throws IOException {
		File convFile = new File(file.getOriginalFilename());
		convFile.createNewFile();
		FileOutputStream fos = new FileOutputStream(convFile);
		fos.write(file.getBytes());
		fos.close();
		return fileService.uploadFile(convFile);

	}

	@GetMapping("/files/{filename}")
	@ResponseBody
	public ResponseEntity<?> getFile(@PathVariable String filename) throws MalformedURLException {
		Resource file = fileService.getFile(filename);
		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
				.body(file);
	}

	@DeleteMapping("files/delete")
	public ResponseEntity<?> deleteFile(@RequestParam(value = "nom", required = true) String nom) {
		fileService.deleteFile(nom);
		return ResponseEntity.status(HttpStatus.OK).body(new Reponse("image supprimée."));
	}

}
