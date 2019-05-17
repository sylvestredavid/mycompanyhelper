package com.stockmaga.back.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stockmaga.back.models.Client;

@Repository
public interface ClientRepository extends JpaRepository<Client, Integer> {

	public List<Client> findByIdUser(Long idUser);
}
