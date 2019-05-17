package com.stockmaga.back.models;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="clients") 
public class Client implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 3032142552356113636L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer idClient;
	
	private String nom;
	
	private String prenom;
	
	private String email;
	
	private String telephone;
	
	private String adresse;
	
	private String codePostal;
	
	private String ville;
	
	@OneToMany(mappedBy="client")
	@OnDelete(action=OnDeleteAction.CASCADE)
	private List<Facture> factures;

	private Long idUser;

}
