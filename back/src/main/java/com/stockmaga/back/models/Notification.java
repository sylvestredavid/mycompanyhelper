package com.stockmaga.back.models;

import java.io.Serializable;

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
@Table(name="notifications") 
public class Notification implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 3032142552356113636L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer id;
	
	private String notification;

	private int idUser;
	
	private int idProduit;
	
	@Type(type = "org.hibernate.type.NumericBooleanType")
	private boolean vue;
}
