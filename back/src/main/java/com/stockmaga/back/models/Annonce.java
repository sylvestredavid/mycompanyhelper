package com.stockmaga.back.models;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.Type;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="annonces") 
public class Annonce implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1628360230303299326L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer id;
	
	private String titre;
	
	private String corps;
	
	private String resumer;
	
	private String image;
	
	@Type(type = "org.hibernate.type.NumericBooleanType")
	private boolean isMisEnAvant;
	
	private String categories;
	
	private int prixMin;
	
	private int prixMax;
	
	private String email;
	
	private Long idFournisseur;
	
	private int nbContacts;
	
	private String datePoste;

}
