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
@Table(name="genres") 
public class Genre implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 3409072616896134197L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer idGenre;
	
	private String designation;
	
	@OneToMany(mappedBy="genre")
	@OnDelete(action=OnDeleteAction.NO_ACTION)
	private List<Produit> produits;

	private Long idUser;
	
}
