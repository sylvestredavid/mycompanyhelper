package com.stockmaga.back.models;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name="facture_produits")
public class FactureProduit implements Serializable {


	/**
	 * 
	 */
	private static final long serialVersionUID = 7982703716244812736L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer id; 
	
	@ManyToOne
	@JoinColumn(name="facture")
	@JsonIgnoreProperties(value="produitsFacture", allowSetters = true)
	private Facture facture;

	@ManyToOne
	@JoinColumn(name="produit")
	@JsonIgnoreProperties("factures")
	private Produit produit;
	
	private int quantite; 
}
