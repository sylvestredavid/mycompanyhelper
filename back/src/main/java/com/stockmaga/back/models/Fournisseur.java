package com.stockmaga.back.models;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="fournisseurs") 
public class Fournisseur implements Serializable {/**
	 * 
	 */
	private static final long serialVersionUID = -8318005828794366457L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer idFournisseur;
	
	private String nom;
	
	private String email;
	
	private String telephone;
	
	private String adresse;
	
	private String codePostal;
	
	private String ville;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "fournisseur_categorie", 
    	joinColumns = @JoinColumn(name = "id_fournisseur"), 
    	inverseJoinColumns = @JoinColumn(name = "id_genre"))
	private List<Genre> categories;

	private Long idUser;

}
