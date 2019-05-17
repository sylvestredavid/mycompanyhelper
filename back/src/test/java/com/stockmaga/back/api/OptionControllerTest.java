package com.stockmaga.back.api;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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

import com.stockmaga.back.models.Option;
import com.stockmaga.back.services.IOptionService;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@TestExecutionListeners(mergeMode = MergeMode.MERGE_WITH_DEFAULTS, listeners = {
		WithSecurityContextTestExecutionListener.class })
public class OptionControllerTest {

	@Autowired
	MockMvc mockMvc;

	@MockBean
	private IOptionService optionService;

	@Test
	@WithMockUser(roles = { "ADMIN" })
	public void findOptionsTest() throws Exception {
		when(this.optionService.findOptions(1)).thenReturn(new Option());
		this.mockMvc.perform(get("/api/option?idUser=1")).andExpect(status().isOk());
	}

	@Test
	@WithMockUser(roles={"ADMIN"})
	public void saveOptionsTest() throws Exception{
		Option option = new Option();
		option.setLimiteClients(2);
		when(this.optionService.saveOptions(any())).thenReturn(option);
		this.mockMvc.perform(post("/api/option/modif").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content("{\"limiteClients\": 2}")).andExpect(status().isCreated())
				.andExpect(jsonPath("limiteClients").value(2));;
	}

}
