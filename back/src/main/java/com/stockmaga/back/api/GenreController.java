package com.stockmaga.back.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.stockmaga.back.models.Genre;
import com.stockmaga.back.models.Reponse;
import com.stockmaga.back.services.IGenreService;

@Controller
@CrossOrigin({"http://localhost:4200", "http://www.mycompanyhelper.com", "https://www.mycompanyhelper.com", "http://powersell.eu-west-3.elasticbeanstalk.com"})
@RequestMapping("/api")
public class GenreController {

	@Autowired
	private IGenreService genreService;
	
	@GetMapping("/genres")
	@PreAuthorize("hasRole('ADMIN') OR hasRole('GESTIONNAIRE')")
	public ResponseEntity<?> findAllGenres(@RequestParam Long idUser){
		List<Genre> genres = genreService.findAllGenres(idUser);
		return ResponseEntity.status(HttpStatus.OK).body(genres);
	}
	
	@GetMapping("/genres/{designation}")
	@PreAuthorize("hasRole('ADMIN') OR hasRole('GESTIONNAIRE')")
	public ResponseEntity<?> findOnegenre(@PathVariable() String designation, @RequestParam Long idUser){
		Genre genre = genreService.findOnegenre(designation, idUser);
		return ResponseEntity.status(HttpStatus.OK).body(genre);
	}
	
	@PostMapping("/genres/save")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> saveGenre(@RequestBody Genre genre){
		return genreService.saveGenre(genre);
	}
	
	@DeleteMapping("/genres/delete")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> deleteGenre(@RequestParam(name="id", required=true) Integer id){
		return genreService.deleteGenre(id);
	}
}
