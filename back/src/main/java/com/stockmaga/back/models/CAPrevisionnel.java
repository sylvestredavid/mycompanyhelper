package com.stockmaga.back.models;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.io.Serializable;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CAPrevisionnel implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = -48670456339265037L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer id;
	
	private int mois;
	
	private Double chiffreDAffaire;

	private Long idUser;
}
