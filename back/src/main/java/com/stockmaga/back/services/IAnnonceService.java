package com.stockmaga.back.services;

import java.util.List;

import com.stockmaga.back.models.Annonce;

public interface IAnnonceService {
	
	public List<Annonce> findAllAnnonces();
	
	public List<Annonce> findAllAnnoncesByFournisseur(Long idFournisseur);
	
	public Annonce findOneAnnonce(Integer id);
	
	public Annonce saveAnnonces(Annonce annonce);
	
	public void deleteAnnonce(Integer id);
	
	

}
