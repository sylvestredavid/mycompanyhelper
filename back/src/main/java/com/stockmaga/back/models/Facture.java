package com.stockmaga.back.models;

import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

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
@Table(name="factures")  
public class Facture implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1628360230303299324L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer idFacture;
	
	private Date date;
	
	private Double totalHT;

	private Double totalTTC;

	private Double tva21;

	private Double tva55;

	private Double tva10;

	private Double tva20;

	@ManyToOne
	@JoinColumn(name="idClient")
	@JsonIgnoreProperties("factures")
	private Client client;
	
	@OneToMany(mappedBy="facture")
	@OnDelete(action=OnDeleteAction.CASCADE)
	private Set<FactureProduit> produitsFacture = new HashSet<FactureProduit>();
	
	private Long idUser;

	private int numero;

}
