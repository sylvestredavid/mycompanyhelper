package com.stockmaga.back.api;

import java.util.List;

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

import com.stockmaga.back.models.Notification;
import com.stockmaga.back.models.Reponse;
import com.stockmaga.back.services.INotificationService;

@Controller
@CrossOrigin({"http://localhost:4200", "http://www.mycompanyhelper.com", "https://www.mycompanyhelper.com", "http://powersell.eu-west-3.elasticbeanstalk.com"})
@RequestMapping("/api/notifications")
public class NotificationController {

	@Autowired
	private INotificationService notificationService;
	
	@GetMapping("")
	@PreAuthorize("hasRole('ADMIN') OR hasRole('GESTIONNAIRE')")
	public ResponseEntity<?> findAllNotifications(@RequestParam int idUser){
		List<Notification> notification = notificationService.findAllNotifications(idUser);
		return ResponseEntity.status(HttpStatus.OK).body(notification);
	}
	
	@PostMapping("/save") 
	@PreAuthorize("hasRole('ADMIN') OR hasRole('GESTIONNAIRE')")
	public ResponseEntity<?> saveNotification(@RequestBody Notification notification){
		Notification newNotification = notificationService.saveNotification(notification);
		return ResponseEntity.status(HttpStatus.CREATED).body(newNotification);
	}
	
	@PostMapping("/mettreVue")
	@PreAuthorize("hasRole('ADMIN') OR hasRole('GESTIONNAIRE')")
	public ResponseEntity<?> mettreVue(@RequestParam(name="idProduit", required=true) int idProduit){
		notificationService.mettreVue(idProduit);
		return ResponseEntity.status(HttpStatus.OK).body(new Reponse("notification vue"));
	}
}
