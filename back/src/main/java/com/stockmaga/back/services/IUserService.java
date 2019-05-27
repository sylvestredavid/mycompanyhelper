package com.stockmaga.back.services;

import java.util.List;

import com.stockmaga.back.models.Email;
import org.springframework.http.ResponseEntity;

import com.stockmaga.back.models.User;
import com.stockmaga.back.request.JwtResponse;
import com.stockmaga.back.request.LoginForm;
import com.stockmaga.back.request.SignUpForm;

public interface IUserService {
	
	public List<String> findAllUsername();

	public JwtResponse authenticateUser(LoginForm loginRequest);
	
	public ResponseEntity<?> registerUser(SignUpForm signUpRequest);
	
	public List<User> findGestionnaires(Long managementId);
	
	public void deleteGestionnaire(Long id);
	
	public void changePassword(LoginForm login);
	
	public ResponseEntity<?> mailPassword(String mail, String lien);

	public JwtResponse userDejaAuthentifie(String token);

	ResponseEntity<?> addAbonnement(String idSubscription, String email);

    ResponseEntity<?> sendMailSupport(Email email);

	void deleteUser(Long idUser);
}
