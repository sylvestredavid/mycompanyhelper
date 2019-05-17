package com.stockmaga.back.repositories;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.stockmaga.back.models.CARecu;
import com.stockmaga.back.models.Facture;

@Repository
public interface FactureRepository extends JpaRepository<Facture, Integer> {

	public List<Facture> findByClientIdClient(Integer idClient);
	
	/**
	 * methode qui insert une ligne dans la table de relation facture_produits
	 * @param quantite
	 * @param idFacture
	 * @param idProduit
	 */
	@Modifying
	@Transactional
	@Query(value="INSERT INTO facture_produits(quantite, facture, produit) VALUES (?1, ?2, ?3)", nativeQuery=true)
	public void saveProduit(int quantite, Integer idFacture, Integer idProduit);

	/**
	 * supprime une ligne dans la table de relation facture_produits
	 * @param idFacture
	 */
	@Modifying
	@Transactional
	@Query(value="DELETE FROM facture_produits WHERE facture = ?1", nativeQuery=true)
	public void deleteFactureProduit(Integer idFacture);
	
	public void deleteByIdFacture(Integer idFacture);
	
	/**
	 * methode qui permet de récuperer la somme des factures d'un mois donné pour tout les users
	 * @param mois
	 * @param annee
	 * @return
	 */
	@Query(value="SELECT id_user AS user, sum(total) AS total FROM factures where month(date)=?1 and year(date)=?2 group by id_user", nativeQuery=true)
	public List<CARecu> getChiffreDAffaire(int mois, int annee);
}
