package com.stockmaga.back.models;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.Type;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="produits")
public class Produit implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer idProduit;
	
	private String designation;
	
	private double prixAchat;
	
	private double prixVente;
	
	private int quantite;
	
	@ManyToOne
	@JoinColumn(name="idGenre")
	@JsonIgnoreProperties("produits")
	private Genre genre;

	@JsonIgnoreProperties({"prestation", "produit"})
	@OneToMany(mappedBy="produit")
	private List<FactureProduit> factures;

	private Long idUser;
	
	@Type(type = "org.hibernate.type.NumericBooleanType")
	private boolean enVente;

	private double tva;

	private int seuilStockBas;
}
