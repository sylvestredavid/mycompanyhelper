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
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.context.support.WithSecurityContextTestExecutionListener;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.TestExecutionListeners.MergeMode;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import com.stockmaga.back.models.Client;
import com.stockmaga.back.services.IClientService;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@TestExecutionListeners(mergeMode = MergeMode.MERGE_WITH_DEFAULTS, listeners = {
		WithSecurityContextTestExecutionListener.class })
public class ClientControllerTest {

	@Autowired
	MockMvc mockMvc;

	@MockBean
	private IClientService clientService;

	@Test
	@WithMockUser(roles = { "ADMIN" })
	public void findAllclientsTest() throws Exception {
		when(this.clientService.findAllclients(any())).thenReturn(new ArrayList<>());
		this.mockMvc.perform(get("/api/clients?idUser=1")).andExpect(status().isOk());
	}

	@Test
	@WithMockUser(roles = { "ADMIN" })
	public void findOneAnnonceTest() throws Exception {
		when(this.clientService.findOneclients(1)).thenReturn(new Client());
		this.mockMvc.perform(get("/api/clients/1")).andExpect(status().isOk());
	}

	@Test
	@WithMockUser(roles={"ADMIN"})
	public void saveclientTest() throws Exception{
		Client client = new Client();
		client.setNom("test");
		this.mockMvc.perform(post("/api/clients/save").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content("{\"nom\": \"test\"}")).andExpect(status().isCreated())
				.andExpect(jsonPath("nom").value("test"));;
	}

	@Test
	@WithMockUser(roles={"ADMIN"})
	public void deleteclientTest() throws Exception{
		this.mockMvc.perform(delete("/api/clients/delete?id=1")).andExpect(status().isOk())
				.andExpect(jsonPath("msg").value("Client supprimé"));;
	}


}
