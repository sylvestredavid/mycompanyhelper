package com.stockmaga.back.services.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stockmaga.back.models.Notification;
import com.stockmaga.back.repositories.NotificationRepository;
import com.stockmaga.back.services.INotificationService;

@Service
public class NotificationService implements INotificationService {

	@Autowired
	private NotificationRepository notificationRepository;

	/**
	 * recuperer toutes les notifications d'un utilisateur suivant son id
	 */
	@Override
	public List<Notification> findAllNotifications(int idUser) {
		return notificationRepository.findByIdUser(idUser);
	}

	/**
	 * enregistrer une notification
	 */
	@Override
	public Notification saveNotification(Notification notification) {
		return notificationRepository.save(notification);
	}

	/**
	 * mettre une notification a vue
	 */
	@Override
	public void mettreVue(int idProduit) {
		notificationRepository.mettreVue(idProduit);
	}

}
