package com.stockmaga.back.services;

import com.stockmaga.back.models.Achat;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface IAchatService {

	public List<Achat> findAllAchat(Long idUser);

	public ResponseEntity<?> saveAchat(Achat achat);

    ResponseEntity<?> deleteAchat(Integer id);
}
