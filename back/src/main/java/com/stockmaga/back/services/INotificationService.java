package com.stockmaga.back.services;

import java.util.List;

import com.stockmaga.back.models.Notification;

public interface INotificationService {

	public List<Notification> findAllNotifications(int idUser);
	
	public Notification saveNotification(Notification notification);
	
	public void mettreVue(int idProduit);
}
