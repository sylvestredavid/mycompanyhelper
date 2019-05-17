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

import com.stockmaga.back.models.Annonce;
import com.stockmaga.back.services.IAnnonceService;
import com.stockmaga.back.services.IEmailService;
import com.stockmaga.back.services.IFileService;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@TestExecutionListeners(mergeMode = MergeMode.MERGE_WITH_DEFAULTS, listeners = {
		WithSecurityContextTestExecutionListener.class })
public class AnnonceControllerTest {

	@Autowired
	MockMvc mockMvc;

	@MockBean
	private IAnnonceService annonceService;

	@MockBean
	private IEmailService emailService;

	@MockBean
	private IFileService fileService;

	@Test
	public void test() throws Exception {
		when(this.annonceService.findAllAnnonces()).thenReturn(new ArrayList<>());
		this.mockMvc.perform(get("/api/annuaireFournisseur/annonces")).andExpect(status().isOk());
	}

	@Test
	public void findOneAnnonceTest() throws Exception {
		when(this.annonceService.findOneAnnonce(1)).thenReturn(new Annonce());
		this.mockMvc.perform(get("/api/annuaireFournisseur/annonces/1")).andExpect(status().isOk());
	}

	@Test
	@WithMockUser(roles = { "FOURNISSEUR" })
	public void findAllAnnoncesByFournisseurTest() throws Exception {
		when(this.annonceService.findAllAnnoncesByFournisseur(1L)).thenReturn(new ArrayList<>());
		this.mockMvc.perform(get("/api/annuaireFournisseur/1/annonces")).andExpect(status().isOk());
	}

	@Test
	@WithMockUser(roles={"FOURNISSEUR"})
	public void saveAnnoncesTest() throws Exception{
		Annonce annonce = new Annonce();
		annonce.setTitre("test");
		when(this.annonceService.saveAnnonces(any())).thenReturn(annonce);
		this.mockMvc.perform(post("/api/annuaireFournisseur/annonces/save").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content("{\"titre\": \"test\"}")).andExpect(status().isCreated())
				.andExpect(jsonPath("titre").value("test"));;
	}

	@Test
	public void sendMailToFournisseurTest() throws Exception{
		this.mockMvc.perform(post("/api/annuaireFournisseur/sendMail").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content("{\"to\": \"test@gmail.com\"}")).andExpect(status().isOk())
				.andExpect(jsonPath("msg").value("mail envoyé"));;
	}

	@Test
	public void augmenterNbContactsTest() throws Exception{
		this.mockMvc.perform(post("/api/annuaireFournisseur/annonces/augmenterNbContacts?id=1")).andExpect(status().isOk())
				.andExpect(jsonPath("msg").value("contacts augmenté."));;
	}

	@Test
	@WithMockUser(roles={"FOURNISSEUR"})
	public void deleteAnnonceTest() throws Exception{
		this.mockMvc.perform(delete("/api/annuaireFournisseur/annonces/delete?id=1")).andExpect(status().isOk())
				.andExpect(jsonPath("msg").value("annonce supprimée."));;
	}

}
