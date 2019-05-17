package com.stockmaga.back.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stockmaga.back.models.Genre;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Integer> {
	
	public List<Genre> findByIdUser(Long idUser);
	
	public Optional<Genre> findByDesignationAndIdUser(String designation, Long idUser);

}
