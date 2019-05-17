package com.stockmaga.back.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.stockmaga.back.models.CA;

@Repository
public interface CARepository extends JpaRepository<CA, Integer> {
	
	/**
	 * recupère le ca d'un user en le classant du plus ancien au plus récent
	 * @param idUser
	 * @return
	 */
	@Query(value="SELECT * FROM ca where id_user = ?1 order by id", nativeQuery=true)
	public List<CA> getCAOrdering(int idUser);

}
