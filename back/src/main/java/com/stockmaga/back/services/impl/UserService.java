package com.stockmaga.back.services.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.stockmaga.back.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.stockmaga.back.repositories.OptionRepository;
import com.stockmaga.back.repositories.RoleRepository;
import com.stockmaga.back.repositories.UserRepository;
import com.stockmaga.back.request.JwtResponse;
import com.stockmaga.back.request.LoginForm;
import com.stockmaga.back.request.SignUpForm;
import com.stockmaga.back.security.jwt.JwtProvider;
import com.stockmaga.back.services.IEmailService;
import com.stockmaga.back.services.IOptionService;
import com.stockmaga.back.services.IUserService;

@Service
public class UserService implements IUserService {

	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	UserRepository userRepository;

	@Autowired
	RoleRepository roleRepository;

	@Autowired
	IOptionService optionService;

	@Autowired
	OptionRepository optionRepository;

	@Autowired
	IEmailService emailService;

	@Autowired
	PasswordEncoder encoder;

	@Autowired
	JwtProvider jwtProvider;

	
	@Override
	public List<String> findAllUsername(){
	return userRepository.findAllUsername();
	}
	/**
	 * authentification d'un utilisateur, on retourne un objet contenant le token de connexion et les infos de l'user
	 */
	@Override
	public JwtResponse authenticateUser(LoginForm loginRequest) {

		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);

		String jwt = "Bearer " + jwtProvider.generateJwtToken(authentication);
		UserDetails userDetails = (UserDetails) authentication.getPrincipal();
		Optional<User> user = userRepository.findByUsername(userDetails.getUsername());
		RoleName authorities = ((Role) user.get().getRoles().toArray()[0]).getName();
		return new JwtResponse(jwt, user.get().getId(), userDetails.getUsername(), authorities,
				user.get().getEntreprise(), user.get().getManagementId());
	}
	
	/**
	 * methode utilisée si le token est deja dans le sessionStorage ou le localStorage
	 * on recupere l'username de l'user a l'aide du token puis ses infos et on envoi le tout
	 */
	@Override
	public JwtResponse userDejaAuthentifie(String token) {

		Optional<User> user = userRepository.findByUsername(jwtProvider.getUserNameFromJwtToken(token.substring(7)));
		RoleName authorities = ((Role) user.get().getRoles().toArray()[0]).getName();
		return new JwtResponse(token, user.get().getId(), user.get().getUsername(), authorities,
				user.get().getEntreprise(), user.get().getManagementId());
	}

	/**
	 * methode de création d'un user
	 */
	@Override
	public ResponseEntity<?> registerUser(SignUpForm signUpRequest) {
		if (userRepository.existsByUsername(signUpRequest.getUsername())) {
			return new ResponseEntity<>("Cet email est déjà utilisé.", HttpStatus.BAD_REQUEST);
		}

		// Creating user's account
		User user = new User(signUpRequest.getName(), signUpRequest.getUsername(),
				encoder.encode(signUpRequest.getPassword()), signUpRequest.getManagementId(),
				signUpRequest.getEntreprise());

		Set<String> strRoles = signUpRequest.getRole();
		Set<Role> roles = new HashSet<>();

		strRoles.forEach(role -> {
			switch (role) {
			case "admin":
				Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
						.orElseThrow(() -> new RuntimeException("Fail! -> Cause: User Role not find."));
				roles.add(adminRole);

				break;
			case "gestionnaire":
				Role gestionnaireRole = roleRepository.findByName(RoleName.ROLE_GESTIONNAIRE)
						.orElseThrow(() -> new RuntimeException("Fail! -> Cause: User Role not find."));
				roles.add(gestionnaireRole);
				emailService.sendGestMail(user);

				break;
			case "fournisseur":
				Role fournisseurRole = roleRepository.findByName(RoleName.ROLE_FOURNISSEUR)
						.orElseThrow(() -> new RuntimeException("Fail! -> Cause: User Role not find."));
				roles.add(fournisseurRole);

				break;
			default:
				Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
						.orElseThrow(() -> new RuntimeException("Fail! -> Cause: User Role not find."));
				roles.add(userRole);
			}
		});

		user.setRoles(roles);
		User newUser = userRepository.save(user);
		if (((Role)newUser.getRoles().toArray()[0]).getName() == RoleName.ROLE_ADMIN) {
			Option options = new Option();
			options.setIdUser(newUser.getId().intValue());
			options.setLimiteClients(5);
			options.setLimiteStock(5);
			optionService.saveOptions(options);
			emailService.sendInscriptionMail(signUpRequest);
		}
		LoginForm login = new LoginForm();
		login.setUsername(signUpRequest.getUsername());
		login.setPassword(signUpRequest.getPassword());
		return ResponseEntity.status(HttpStatus.OK).body(authenticateUser(login));
	}

	/**
	 * renvoi tout les gestionnaires ayant un managementId égal a l'id de l'admin
	 */
	@Override
	public List<User> findGestionnaires(Long managementId) {
		return userRepository.findByManagementId(managementId);
	}

	/**
	 * suppression d'un gestionnaire
	 */
	@Override
	public void deleteGestionnaire(Long id) {
		userRepository.deleteById(id);

	}

	/**
	 * methode de changement de mdp
	 */
	@Override
	public void changePassword(LoginForm login) {
		userRepository.changePassword(encoder.encode(login.getPassword()), login.getUsername());

	}

	/**
	 * methode qui envoi un mail avec un lien pour changer de mdp
	 */
	@Override
	public ResponseEntity<?> mailPassword(String mail, String lien) {
		if (!userRepository.existsByUsername(mail)) {
			return new ResponseEntity<>(new Reponse("aucun utilisateur trouvée avec cette adresse mail"),
					HttpStatus.BAD_REQUEST);
		} else {
			emailService.sendPasswordMail(mail, lien);
			return ResponseEntity.ok(new Reponse("mail envoyé"));
		}
	}

	@Override
	public ResponseEntity<?> addAbonnement(String idSubscription, String email) {
		userRepository.addAbonnement(idSubscription, email);

		return ResponseEntity.status(HttpStatus.OK).body(new Reponse("abonnement ajouté"));
	}

	@Override
	public ResponseEntity<?> sendMailSupport(Email email) {
		emailService.sendMailSupport(email);
		return ResponseEntity.ok(new Reponse("mail envoyé"));
	}

	@Override
	public void deleteUser(Long idUser) {
		userRepository.supprimerCompte(idUser);
	}

}
