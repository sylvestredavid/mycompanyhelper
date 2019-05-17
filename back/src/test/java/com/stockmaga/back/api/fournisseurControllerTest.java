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

import com.stockmaga.back.models.Fournisseur;
import com.stockmaga.back.services.IFournisseurService;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@TestExecutionListeners(mergeMode = MergeMode.MERGE_WITH_DEFAULTS, listeners = {
		WithSecurityContextTestExecutionListener.class })
public class fournisseurControllerTest {

	@Autowired
	MockMvc mockMvc;

	@MockBean
	private IFournisseurService fournisseurService;

	@Test
	@WithMockUser(roles = { "ADMIN" })
	public void getAllFournisseursTest() throws Exception {
		when(this.fournisseurService.getAllFournisseurs(any())).thenReturn(new ArrayList<>());
		this.mockMvc.perform(get("/api/fournisseurs?idUser=1")).andExpect(status().isOk());
	}

	@Test
	@WithMockUser(roles = { "ADMIN" })
	public void getOneFournisseurTest() throws Exception {
		when(this.fournisseurService.getOneFournisseur(1)).thenReturn(new Fournisseur());
		this.mockMvc.perform(get("/api/fournisseurs/1")).andExpect(status().isOk());
	}

	@Test
	@WithMockUser(roles={"ADMIN"})
	public void saveFournisseurTest() throws Exception{
		Fournisseur fournisseur = new Fournisseur();
		fournisseur.setNom("test");
		this.mockMvc.perform(post("/api/fournisseurs/save").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content("{\"nom\": \"test\"}")).andExpect(status().isCreated())
				.andExpect(jsonPath("nom").value("test"));;
	}

	@Test
	@WithMockUser(roles={"ADMIN"})
	public void deleteFournisseurTest() throws Exception{
		this.mockMvc.perform(delete("/api/fournisseurs/delete?id=1")).andExpect(status().isOk())
				.andExpect(jsonPath("msg").value("Fournisseur supprimé."));;
	}


}
