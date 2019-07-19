package com.stockmaga.back.api;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.stockmaga.back.models.Annonce;
import com.stockmaga.back.models.Email;
import com.stockmaga.back.models.Reponse;
import com.stockmaga.back.services.IAbonnementService;
import com.stockmaga.back.services.IAnnonceService;
import com.stockmaga.back.services.IEmailService;
import com.stockmaga.back.services.IFileService;

@Controller
@CrossOrigin({"http://localhost:4200", "http://www.mycompanyhelper.com", "https://www.mycompanyhelper.com", "http://powersell.eu-west-3.elasticbeanstalk.com"})
@RequestMapping("/api/annuaireFournisseur")
public class AnnonceController {

	@Autowired
	private IAnnonceService annonceService;

	@Autowired
	private IEmailService emailService;

	@Autowired
	private IFileService fileService;

	@Autowired
	private IAbonnementService abonnementService;

	@GetMapping("/annonces")
	public ResponseEntity<?> findAllAnnonces() {
		List<Annonce> annonces = annonceService.findAllAnnonces();
		return ResponseEntity.status(HttpStatus.OK).body(annonces);
	}

	@GetMapping("/{idFournisseur}/annonces")
	@PreAuthorize("hasRole('FOURNISSEUR')")
	public ResponseEntity<?> findAllAnnoncesByFournisseur(@PathVariable() Long idFournisseur) {
		List<Annonce> annonces = annonceService.findAllAnnoncesByFournisseur(idFournisseur);
		return ResponseEntity.status(HttpStatus.OK).body(annonces);
	}

	@GetMapping("/annonces/{id}")
	public ResponseEntity<?> findOneAnnonce(@PathVariable() Integer id) {
		Annonce annonce = annonceService.findOneAnnonce(id);
		return ResponseEntity.status(HttpStatus.OK).body(annonce);
	}

	@PostMapping("/annonces/save")
	@PreAuthorize("hasRole('FOURNISSEUR')")
	public ResponseEntity<?> saveAnnonces(@RequestBody Annonce annonce) {
		Annonce newAnnonce = annonceService.saveAnnonces(annonce);
		return ResponseEntity.status(HttpStatus.CREATED).body(newAnnonce);
	}

	@PostMapping("/sendMail")
	public ResponseEntity<?> sendMailToFournisseur(@RequestBody Email email) {
		emailService.sendMailToFournisseur(email);
		return ResponseEntity.status(HttpStatus.OK).body(new Reponse("mail envoyé"));
	}

	@PostMapping("/annonces/augmenterNbContacts")
	public ResponseEntity<?> augmenterNbContacts(@RequestParam(name = "id", required = true) Integer id) {
		abonnementService.augmenterNbContacts(id);
		return ResponseEntity.status(HttpStatus.OK).body(new Reponse("contacts augmenté."));
	}

	@DeleteMapping("/annonces/delete")
	@PreAuthorize("hasRole('FOURNISSEUR')")
	public ResponseEntity<?> deleteAnnonce(@RequestParam(name = "id", required = true) Integer id) {
		annonceService.deleteAnnonce(id);
		return ResponseEntity.status(HttpStatus.OK).body(new Reponse("annonce supprimée."));
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
	
	@PostMapping("/miseEnAvant")
	public ResponseEntity<?> misenEnAvant(@RequestParam(value = "token", required = true) String token, @RequestParam(value = "idAnnonce", required = true) Integer idAnnonce){
		return abonnementService.miseEnAvant(token, idAnnonce);	
	}
}
