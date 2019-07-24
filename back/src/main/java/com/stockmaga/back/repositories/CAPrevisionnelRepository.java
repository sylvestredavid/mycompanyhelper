package com.stockmaga.back.repositories;

import com.stockmaga.back.models.CA;
import com.stockmaga.back.models.CAPrevisionnel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CAPrevisionnelRepository extends JpaRepository<CAPrevisionnel, Integer> {
	
	/**
	 * recupère le ca d'un user en le classant du plus ancien au plus récent
	 * @param idUser
	 * @return
	 */
	@Query(value="SELECT * FROM caprevisionnel where id_user = ?1 order by id", nativeQuery=true)
	public List<CAPrevisionnel> getCAPrevisionnelOrdering(int idUser);

}
