package com.stockmaga.back.repositories;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.stockmaga.back.models.Annonce;

@Repository
public interface AnnonceRepository extends JpaRepository<Annonce, Integer> {

	public List<Annonce> findByIdFournisseur(Long id);
	
	/**
	 * augmente le nombre de contact d'une annonce
	 * @param id
	 */
	@Transactional
	@Modifying
	@Query(value="update annonces set nb_contacts = nb_contacts + 1 where id = ?1", nativeQuery=true)
	public void augmenterNbContacts(Integer id);

	@Transactional
	@Modifying
	@Query(value="update annonces set is_mis_en_avant = 1 where id = ?1", nativeQuery=true)
	public void miseEnAvant(Integer id);
}
