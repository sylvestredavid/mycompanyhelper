package com.stockmaga.back.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Email {

	private String to;
	
	private String from;
	
	private String corps;
	
	private String titre;
}
