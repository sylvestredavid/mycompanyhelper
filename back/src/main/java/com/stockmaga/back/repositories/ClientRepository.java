package com.stockmaga.back.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.stockmaga.back.models.Client;

import javax.transaction.Transactional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Integer> {

	public List<Client> findByIdUser(Long idUser);

	@Modifying
	@Transactional
	@Query(value = "UPDATE clients set panier_moyen=?1 WHERE id_client=?2", nativeQuery = true)
	public void updatePanierMoyen(Double panierMoyen, Integer idClient);
}
