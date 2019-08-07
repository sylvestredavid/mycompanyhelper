package com.stockmaga.back.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="achats")
public class Achat implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1628360230303295466L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer id;
	
	private String designation;
	
	private Date date;

	private double prixUnitaire;

	private int quantite;
	
	private double total;
	
	private Long idUser;

	@Type(type = "org.hibernate.type.NumericBooleanType")
	private boolean recurrent;

}
