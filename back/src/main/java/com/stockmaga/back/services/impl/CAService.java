package com.stockmaga.back.services.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stockmaga.back.models.CA;
import com.stockmaga.back.repositories.CARepository;
import com.stockmaga.back.services.ICAService;

@Service
public class CAService implements ICAService {

	@Autowired(required=true)
	private CARepository caRepository;

	/**
	 * récupère le chiffre d'affaire d'un utilisateur
	 */
	@Override
	public List<CA> findCA(int idUser) {
		return caRepository.getCAOrdering(idUser);
	}

}
