package com.stockmaga.back.repositories;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.stockmaga.back.models.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {

	/**
	 * methode qui recupere toutes les notifications d'un utilisateur de la plus récente a la plus ancienne
	 * @param idUser
	 * @return
	 */
	@Query(value="SELECT * FROM notifications where id_user = ?1 order by id DESC", nativeQuery=true)
	public List<Notification> findByIdUser(int idUser);

	/**
	 * methode qui met une notification a vue, dans l'ihm, elle ne sera donc plus mise en avant
	 * @param id
	 */
	@Transactional
	@Modifying
	@Query(value="update notifications set vue = 1 where id_produit = ?1", nativeQuery=true)
	public void mettreVue(Integer id);
}
