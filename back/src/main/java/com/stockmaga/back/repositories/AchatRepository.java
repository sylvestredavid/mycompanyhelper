package com.stockmaga.back.repositories;

import com.stockmaga.back.models.Achat;
import com.stockmaga.back.models.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AchatRepository extends JpaRepository<Achat, Integer> {

	public List<Achat> findByIdUser(Long idUser);
}
