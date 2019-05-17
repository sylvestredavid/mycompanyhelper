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
import org.springframework.security.test.context.support.WithSecurityContextTestExecutionListener;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.TestExecutionListeners.MergeMode;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import com.stockmaga.back.request.JwtResponse;
import com.stockmaga.back.services.IUserService;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@TestExecutionListeners(mergeMode = MergeMode.MERGE_WITH_DEFAULTS, listeners = {
		WithSecurityContextTestExecutionListener.class })
public class UserControllerTest {

	@Autowired
	MockMvc mockMvc;

	@MockBean
	private IUserService userService;

	@Test
	public void authenticateUserTest() throws Exception{
		when(this.userService.authenticateUser(any())).thenReturn(new JwtResponse());
		this.mockMvc.perform(post("/api/users/signin").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content("{\"username\": \"test@test.fr\", \"password\": \"testtesttest\"}")).andExpect(status().isOk());
	}

	@Test
	public void registerUserTest() throws Exception{
		this.mockMvc.perform(post("/api/users/signup").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content("{\"name\": \"test\",\"username\": \"test@test.fr\", \"password\": \"testtesttest\"}")).andExpect(status().isOk());
	}

	@Test
	public void findAllclientsTest() throws Exception {
		when(this.userService.findGestionnaires(1L)).thenReturn(new ArrayList<>());
		this.mockMvc.perform(get("/api/users/1/gestionnaires")).andExpect(status().isOk());
	}
	
	@Test
	public void deleteGestionnaireTest() throws Exception{
		this.mockMvc.perform(delete("/api/users/gestionnaires/delete?id=1")).andExpect(status().isOk())
				.andExpect(jsonPath("msg").value("Gestionnaire supprimé"));
	}

	@Test
	public void changePasswordTest() throws Exception{
		this.mockMvc.perform(post("/api/users/changePassword").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content("{\"username\": \"test@test.fr\", \"password\": \"testtesttest\"}")).andExpect(status().isOk())
		.andExpect(jsonPath("msg").value("password changé"));
	}

	@Test
	public void mailPasswordTest() throws Exception{
		this.mockMvc.perform(post("/api/users/mailPassword?mail=test&lien=test")).andExpect(status().isOk());
	}

}
