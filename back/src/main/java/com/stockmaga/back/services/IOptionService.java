package com.stockmaga.back.services;

import com.stockmaga.back.models.Option;

public interface IOptionService {

	public Option findOptions(int idUser);
	
	public Option saveOptions(Option option);
}
