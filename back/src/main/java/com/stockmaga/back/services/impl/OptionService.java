package com.stockmaga.back.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stockmaga.back.models.Option;
import com.stockmaga.back.repositories.OptionRepository;
import com.stockmaga.back.services.IOptionService;

@Service
public class OptionService implements IOptionService {

	@Autowired
	private OptionRepository optionRepository;

	/**
	 * recuperer les options d'un utilisateur suivant son id
	 */
	@Override
	public Option findOptions(int idUser) {
		return optionRepository.findByIdUser(idUser)
				.orElseThrow(() -> new RuntimeException("Option inexistant"));
	}

	/**
	 * enregistrer ou modifer les options
	 * si id, modification sinon creation
	 */
	@Override
	public Option saveOptions(Option option) {
		return optionRepository.save(option);
	}

}
