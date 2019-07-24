package com.stockmaga.back.services;

import com.stockmaga.back.models.CAPrevisionnel;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ICAPrevisionnelService {

	public List<CAPrevisionnel> findCAPrevisionnel(int idUser);

	public ResponseEntity<?> saveCAPrevisionnel(CAPrevisionnel caPrevisionnel);
}
