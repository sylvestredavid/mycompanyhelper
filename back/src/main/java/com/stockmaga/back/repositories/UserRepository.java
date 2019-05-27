package com.stockmaga.back.repositories;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.stockmaga.back.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	
    Optional<User> findByUsername(String username);
    Boolean existsByUsername(String username);
    List<User> findByManagementId(Long managementId);

	@Modifying
	@Transactional
	@Query(value="SELECT username FROM user", nativeQuery=true)
	public List<String> findAllUsername();

    /**
     * change le mdp
     * @param password
     * @param email
     */
	@Modifying
	@Transactional
	@Query(value="update user set password = ?1 where username = ?2", nativeQuery=true)
	public void changePassword(String password, String email);

	@Modifying
	@Transactional
	@Query(value="update user set abonnement = ?1 where username = ?2", nativeQuery=true)
	public void addAbonnement(String abonnement, String email);

	@Modifying
	@Transactional
	@Query(value="CALL delete_user(?1)", nativeQuery=true)
	public void supprimerCompte(Long idUser) throws NoSuchElementException;
}
