package com.stockmaga.back.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stockmaga.back.models.Option;

@Repository
public interface OptionRepository extends JpaRepository<Option, Integer> {

	public Optional<Option> findByIdUser(int idUser);
}
