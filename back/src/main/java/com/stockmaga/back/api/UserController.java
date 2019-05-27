package com.stockmaga.back.api;

import java.util.List;

import javax.validation.Valid;

import com.stockmaga.back.models.Annonce;
import com.stockmaga.back.models.Email;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.stockmaga.back.models.Reponse;
import com.stockmaga.back.models.User;
import com.stockmaga.back.repositories.UserRepository;
import com.stockmaga.back.request.LoginForm;
import com.stockmaga.back.request.SignUpForm;
import com.stockmaga.back.services.IAbonnementService;
import com.stockmaga.back.services.IUserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin({"http://localhost:4200", "http://www.mycompanyhelper.com", "https://www.mycompanyhelper.com", "http://powersell.eu-west-3.elasticbeanstalk.com"})
public class UserController {

	@Autowired
	IUserService userService;

	@Autowired
	IAbonnementService abonnementService;
	
	@GetMapping("/findAllUsername")
	public ResponseEntity<?> findAllUsername() {
		return ResponseEntity.status(HttpStatus.OK).body(userService.findAllUsername());
	}

	@PostMapping("/signin")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginForm loginRequest) {
		
		return ResponseEntity.ok(userService.authenticateUser(loginRequest));
	}

	@PostMapping("/dejaConnecte")
	public ResponseEntity<?> userDejaAuthentifie(@RequestParam(name = "token", required= true) String token) {
		
		return ResponseEntity.ok(userService.userDejaAuthentifie(token));
	}

	@PostMapping("/signup")
	public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpForm signUpRequest) {
		return userService.registerUser(signUpRequest);
	}

	@GetMapping("/{managementId}/gestionnaires")
	public ResponseEntity<?> findGestionnaires(@PathVariable Long managementId) {

		List<User> users = userService.findGestionnaires(managementId);
		
		return ResponseEntity.ok(users);
	}

	@DeleteMapping("/gestionnaires/delete")
	public ResponseEntity<?> deleteGestionnaire(@RequestParam(name="id", required=true) Long id) {

		userService.deleteGestionnaire(id);
		return ResponseEntity.ok(new Reponse("Gestionnaire supprimé"));		
	}

	@PostMapping("/changePassword")
	public ResponseEntity<?> changePassword(@Valid @RequestBody LoginForm login) {
		userService.changePassword(login);
		return ResponseEntity.ok(new Reponse("password changé"));
	}

	@PostMapping("/mailPassword")
	public ResponseEntity<?> mailPassword(@RequestParam String mail, @RequestParam String lien) {
		return userService.mailPassword(mail, lien);
	}

	@PostMapping("/sendMailSupport")
	public ResponseEntity<?> sendMailSupport(@RequestBody Email email) {
		return userService.sendMailSupport(email);
	}

	@PostMapping("/abonnement")
	public ResponseEntity<?> abonnement(@RequestParam(value="token", required=true) String token, @RequestParam(value="email", required=true) String email) {
		return abonnementService.abonement(token, email);
	}

	@PostMapping("/abonnementRequete")
	public ResponseEntity<?> abonnementRequete(@RequestParam(value="token", required=true) String token, @RequestParam(value="email", required=true) String email) {
		return abonnementService.abonementRequete(token, email);
	}

	@PostMapping("/abonnementFournisseur")
	public ResponseEntity<?> abonnementFournisseur(@RequestParam(value="token", required=true) String token, @RequestParam(value="email", required=true) String email) {
		return abonnementService.abonementFournisseur(token, email);
	}

	@PostMapping("/addAbonnement")
	public ResponseEntity<?> stopAbonnement(@RequestParam(value="idSubscription", required=true) String idSubscription, @RequestParam(value="email", required=true) String email) {
		return userService.addAbonnement(idSubscription, email);
	}

	@PutMapping("/changeAbonnement")
	public ResponseEntity<?> changeAbonnement(@RequestParam(value="idUser", required=true) Long idUser) {
		return abonnementService.changerAbonnement(idUser);
	}

	@GetMapping("/suiviUtilisation")
	@PreAuthorize("hasRole('ADMIN') or hasRole('FOURNISSEUR')")
	public ResponseEntity<?> saveAnnonces(@RequestParam(value="idUser", required=true) Long idUser) {
		return abonnementService.suiviUtilisation(idUser);
	}

	@DeleteMapping("/{id}/delete")
	@PreAuthorize("hasRole('ADMIN') or hasRole('FOURNISSEUR')")
	public ResponseEntity<?> deleteUser(@PathVariable Long id) {
		boolean stop = abonnementService.stopAbonnement(id);
		userService.deleteUser(id);

		if(stop) {
			return ResponseEntity.status(HttpStatus.OK).body(new Reponse("compte supprimé"));
		} else {
			return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Reponse("erreur lors de l'annulation"));
		}
	}
}
