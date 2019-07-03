package com.stockmaga.back.scheduled;

import java.util.Calendar;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.stockmaga.back.models.CA;
import com.stockmaga.back.models.CARecu;
import com.stockmaga.back.models.Calendrier;
import com.stockmaga.back.models.User;
import com.stockmaga.back.repositories.CARepository;
import com.stockmaga.back.repositories.CalendrierRepository;
import com.stockmaga.back.repositories.FactureRepository;
import com.stockmaga.back.repositories.UserRepository;
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
				caAEnvoyer.setChiffreDAffaire(ca.getTotal());
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
}
