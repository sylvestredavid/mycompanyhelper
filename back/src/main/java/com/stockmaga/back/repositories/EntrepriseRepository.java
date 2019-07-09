package com.stockmaga.back.repositories;

import com.stockmaga.back.models.Annonce;
import com.stockmaga.back.models.Entreprise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface EntrepriseRepository extends JpaRepository<Entreprise, Integer> {

	public Entreprise findByIdUser(Long idUser);
}
