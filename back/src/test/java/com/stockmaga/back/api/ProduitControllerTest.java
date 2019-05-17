package com.stockmaga.back.api;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.context.support.WithSecurityContextTestExecutionListener;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.TestExecutionListeners.MergeMode;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import com.stockmaga.back.models.Produit;
import com.stockmaga.back.services.IProduitService;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@TestExecutionListeners(mergeMode = MergeMode.MERGE_WITH_DEFAULTS, listeners = {
		WithSecurityContextTestExecutionListener.class })
public class ProduitControllerTest {

	@Autowired
	MockMvc mockMvc;

	@MockBean
	private IProduitService produitService;

	@Test
	@WithMockUser(roles = { "ADMIN" })
	public void findAllProduitsTest() throws Exception {
		when(this.produitService.findAllProduits(any())).thenReturn(new ArrayList<>());
		this.mockMvc.perform(get("/api/produits?idUser=1")).andExpect(status().isOk());
	}

	@Test
	@WithMockUser(roles = { "ADMIN" })
	public void findOneProduitsTest() throws Exception {
		when(this.produitService.findOneProduits(1)).thenReturn(new Produit());
		this.mockMvc.perform(get("/api/produits/1")).andExpect(status().isOk());
	}

	@Test
	@WithMockUser(roles={"ADMIN"})
	public void saveProduitsTest() throws Exception{
		Produit produit = new Produit();
		produit.setDesignation("test");
		this.mockMvc.perform(post("/api/produits/save").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content("{\"designation\": \"test\"}")).andExpect(status().isCreated())
				.andExpect(jsonPath("designation").value("test"));;
	}

	@Test
	@WithMockUser(roles={"ADMIN"})
	public void deleteProduitsTest() throws Exception{
		this.mockMvc.perform(delete("/api/produits/delete?id=1")).andExpect(status().isOk())
				.andExpect(jsonPath("msg").value("Produit supprimé."));;
	}

	@Test
	@WithMockUser(roles={"ADMIN"})
	public void remettreEnVenteTest() throws Exception{
		this.mockMvc.perform(post("/api/produits/remettreEnVente?id=1")).andExpect(status().isOk())
				.andExpect(jsonPath("msg").value("produit remis en vente"));;
	}

	@Test
	@WithMockUser(roles={"ADMIN"})
	public void enleverQuantiteTest() throws Exception{
		this.mockMvc.perform(post("/api/produits/diminuer?id=1&quantite=1")).andExpect(status().isOk())
				.andExpect(jsonPath("msg").value("Quantitée diminuée."));;
	}

}
