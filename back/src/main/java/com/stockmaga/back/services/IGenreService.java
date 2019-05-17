package com.stockmaga.back.services;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.stockmaga.back.models.Genre;

public interface IGenreService {

	public List<Genre> findAllGenres(Long idUser);

	public Genre findOnegenre(String designation, Long IdUser);

	public ResponseEntity<?> saveGenre(Genre genre);

	public ResponseEntity<?> deleteGenre(Integer id);
}
