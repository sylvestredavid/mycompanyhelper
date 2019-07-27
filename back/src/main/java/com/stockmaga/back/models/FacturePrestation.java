package com.stockmaga.back.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="facture_prestations")
public class FacturePrestation implements Serializable {


	/**
	 * 
	 */
	private static final long serialVersionUID = 7982703716244812236L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer id; 
	
	@ManyToOne
	@JoinColumn(name="facture")
	@JsonIgnoreProperties(value="prestationsFacture", allowSetters = true)
	private Facture facture;

	@ManyToOne
	@JoinColumn(name="prestations")
	@JsonIgnoreProperties("factures")
	private Prestation prestation;
	
	private int quantite; 
}
