package com.stockmaga.back.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="entreprises")
public class Entreprise implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1628360230303299326L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer id;
	
	private String nom;
	
	private String adresse;
	
	private String codePostal;
	
	private String ville;

	private String siret;

	private String telephone;

	private String email;

	private Long idUser;

}
