package com.stockmaga.back.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="prestations")
public class Prestation implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer id;
	
	private String designation;
	
	private String unitee;
	
	private double prix;
	
	@JsonIgnoreProperties({"prestation", "produit"})
	@OneToMany(mappedBy="prestation")
	private List<FacturePrestation> factures;

	private Long idUser;

	private double tva;
}
