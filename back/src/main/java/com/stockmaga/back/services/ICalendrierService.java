package com.stockmaga.back.services;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.stockmaga.back.models.Calendrier;

public interface ICalendrierService {

	public List<Calendrier> findAllCalendrier(Long idUser);
	
	public ResponseEntity<?> saveCalendrier(Calendrier Calendrier);
	
	public ResponseEntity<?> deleteCalendrier(Integer id);
}
