package com.stockmaga.back.request;

import com.stockmaga.back.models.RoleName;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class JwtResponse {
	private String token;
	private Long id;
	private String username;
	private RoleName authorities;
	private String entreprise;
	private Long managementId;
}

