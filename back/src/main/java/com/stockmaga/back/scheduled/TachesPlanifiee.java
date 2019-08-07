package com.stockmaga.back.scheduled;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import com.stockmaga.back.models.*;
import com.stockmaga.back.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.stockmaga.back.services.IEmailService;

@Component
public class TachesPlanifiee {

	@Autowired
	UserRepository userRepository;

	@Autowired
	CalendrierRepository calendrierRepository;

	@Autowired
	IEmailService emailService;

	@Autowired
	FactureRepository factureRepository;

	@Autowired
	CARepository caRepository;

	@Autowired
	AchatRepository achatRepository;

	/**
	 * tache planifiée lancée tout les 28 29 30 31 de chaques mois à 22h
	 * elle vérifie que le jour est bien le dernier jour du mois en cours
	 * si oui, elle recupere la somme des factures du mois pour chaque client
	 * puis boucle sur le résultat de la requete et enregistre en base de donnée chaque
	 * ca de chaque client.
	 */
	@Scheduled(cron="0 0 22 28-31 * ?", zone="Europe/Paris")
	public void executeCA() {
		Calendar c = Calendar.getInstance();
		int year = c.get(Calendar.YEAR);
		int month = c.get(Calendar.MONTH);
		int day = c.get(Calendar.DAY_OF_MONTH);
		int lastDayOfMonth = c.getActualMaximum(Calendar.DAY_OF_MONTH);
		if (day == lastDayOfMonth) {
			List<CARecu> cas = factureRepository.getChiffreDAffaire(month + 1, year);
			for (CARecu ca : cas) {
				CA caAEnvoyer = new CA();
				caAEnvoyer.setAnnee(year);
				caAEnvoyer.setMois(month);
				caAEnvoyer.setChiffreDAffaire(ca.getTotal() != null ? ca.getTotal() : 0);
				caAEnvoyer.setIdUser(ca.getUser());
				CA newCA = caRepository.save(caAEnvoyer);
			}
		}
	}
	

	@Scheduled(cron="0 0 7 * * * ", zone="Europe/Paris")
	public void executeCalendrier() {
		List<User> users = userRepository.findAll();
		Calendar c = Calendar.getInstance();
		int year = c.get(Calendar.YEAR);
		int month = c.get(Calendar.MONTH);
		int day = c.get(Calendar.DAY_OF_MONTH);
		String monthStr;
		String dayStr;
		
		if (month < 10) {
			monthStr = "0" + (month + 1);
		} else {
			monthStr = "" + (month + 1);
		}
		
		if (day < 10) {
			dayStr = "0" + day;
		} else {
			dayStr = "" + day;
		}
		String start = new StringBuilder().append(year).append("-").append(monthStr).append("-").append(dayStr).toString();
		users.forEach(user -> {
			List<Calendrier> calendriers = calendrierRepository.findByStartStartingWithAndIdUser(start, user.getId());
			if(calendriers.size() > 0) {
				emailService.sendMailCalendrier(user.getUsername(), calendriers);
			}
		});
	}

	@Scheduled(cron="0 0 1 1 * ?", zone="Europe/Paris")
	public void achatRecurrent() {
		System.out.println("coucou");
		Calendar c = Calendar.getInstance();
		c.add(Calendar.MONTH, -1);
		int lastMonth = c.get(Calendar.MONTH);
		List<Achat> achats = achatRepository.findAll();

		achats.forEach(
				achat ->{
					Calendar date = Calendar.getInstance();
					date.setTime(achat.getDate());

					if (achat.isRecurrent()) {
						if(lastMonth == 12) {
							if(lastMonth == date.get(Calendar.MONTH) && date.get(Calendar.YEAR) == c.get(Calendar.YEAR) - 1) {
								saveAchat(achat, date);
							}
						} else {
							if(lastMonth == date.get(Calendar.MONTH) && date.get(Calendar.YEAR) == c.get(Calendar.YEAR)) {
								saveAchat(achat, date);
							}
						}
					}
				}
		);
	}

	private void saveAchat(Achat achat, Calendar date) {
		Achat newAchat = new Achat();
		newAchat.setDesignation(achat.getDesignation());
		newAchat.setIdUser(achat.getIdUser());
		newAchat.setPrixUnitaire(achat.getPrixUnitaire());
		newAchat.setQuantite(achat.getQuantite());
		newAchat.setRecurrent(true);
		newAchat.setTotal(achat.getTotal());
		date.add(Calendar.MONTH, 1);
		newAchat.setDate(date.getTime());
		achatRepository.save(newAchat);
		System.out.println(achat.getDesignation());
	}
}
