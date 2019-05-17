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

import com.stockmaga.back.models.Facture;
import com.stockmaga.back.services.IEmailService;
import com.stockmaga.back.services.IFactureService;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@TestExecutionListeners(mergeMode = MergeMode.MERGE_WITH_DEFAULTS, listeners = {
		WithSecurityContextTestExecutionListener.class })
public class FactureControllerTest {

	@Autowired
	MockMvc mockMvc;

	@MockBean
	private IFactureService factureService;

	@MockBean
	private IEmailService emailService;

	@Test
	@WithMockUser(roles = { "ADMIN" })
	public void findAllfacturestest() throws Exception {
		when(this.factureService.findAllfactures(1)).thenReturn(new ArrayList<>());
		this.mockMvc.perform(get("/api/factures?idClient=1")).andExpect(status().isOk());
	}

	@Test
	@WithMockUser(roles = { "ADMIN" })
	public void findOnefacturesTest() throws Exception {
		when(this.factureService.findOnefactures(1)).thenReturn(new Facture());
		this.mockMvc.perform(get("/api/factures/1")).andExpect(status().isOk());
	}

	@Test
	@WithMockUser(roles={"ADMIN"})
	public void savefacturesTest() throws Exception{
		Facture facture = new Facture();
		facture.setTotal(12.00);
		this.mockMvc.perform(post("/api/factures/save").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content("{\"total\": \"12.00\"}")).andExpect(status().isCreated())
				.andExpect(jsonPath("total").value(12.00));
	}

	@Test
	@WithMockUser(roles={"ADMIN"})
	public void saveProduitfacturesTest() throws Exception{
		this.mockMvc.perform(post("/api/factures/saveProduits?quantite=1&idProduit=1&idFacture=1"))
		.andExpect(status().isCreated())
		.andExpect(jsonPath("msg").value("Facture enregistrée"));
	}

	@Test
	@WithMockUser(roles={"ADMIN"})
	public void sendFactureTest() throws Exception{
		when(factureService.findOnefactures(1)).thenReturn(new Facture());
		this.mockMvc.perform(post("/api/factures/sendMail?idFacture=1"))
		.andExpect(status().isOk())
		.andExpect(jsonPath("msg").value("mail envoyé."));
	}

	@Test
	@WithMockUser(roles={"ADMIN"})
	public void deletefacturesTest() throws Exception{
		this.mockMvc.perform(delete("/api/factures/delete?id=1")).andExpect(status().isOk())
				.andExpect(jsonPath("msg").value("Facture supprimée."));;
	}

}
