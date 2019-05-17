package com.stockmaga.back.repositories;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.stockmaga.back.models.Produit;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, Integer> {

	public List<Produit> findByIdUser(Long idUser);
	
	/**
	 * enleve la quantité donnée a un produit suivant son id
	 * @param quantite
	 * @param id
	 */
	@Transactional
	@Modifying
	@Query(value="update produits set quantite = quantite -?1 where id_produit = ?2", nativeQuery=true)
	public void enleverQuantite(int quantite, Integer id);

	/**
	 * met le genre a null pour tout les produits possedant l'idGenre envoyé
	 * @param idGenre
	 */
	@Transactional
	@Modifying
	@Query(value="update produits set id_genre = null where id_genre = ?1", nativeQuery=true)
	public void idGenreNull(Integer idGenre);

	/**
	 * met un produit hors vente
	 * @param id
	 */
	@Transactional
	@Modifying
	@Query(value="update produits set en_vente = 0 where id_produit = ?1", nativeQuery=true)
	public void mettreHorsVente(Integer id);

	/**
	 * met un produit en vente
	 * @param id
	 */
	@Transactional
	@Modifying
	@Query(value="update produits set en_vente = 1 where id_produit = ?1", nativeQuery=true)
	public void remettreEnVente(Integer id);
}
