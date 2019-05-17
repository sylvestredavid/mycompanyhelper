package com.stockmaga.back.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stockmaga.back.models.Calendrier;

@Repository
public interface CalendrierRepository extends JpaRepository<Calendrier, Integer> {
	
	public List<Calendrier> findByIdUser(Long idUser);
	
	public List<Calendrier> findByStartStartingWithAndIdUser(String start, Long idUser);

}
