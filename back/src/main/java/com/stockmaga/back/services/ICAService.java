package com.stockmaga.back.services;

import java.util.List;

import com.stockmaga.back.models.CA;

public interface ICAService {

	public List<CA> findCA(int idUser);
}
