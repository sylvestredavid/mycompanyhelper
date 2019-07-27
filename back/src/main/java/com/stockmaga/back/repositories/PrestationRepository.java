package com.stockmaga.back.repositories;

import com.stockmaga.back.models.Prestation;
import com.stockmaga.back.models.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface PrestationRepository extends JpaRepository<Prestation, Integer> {

	public List<Prestation> findByIdUser(Long idUser);
}
