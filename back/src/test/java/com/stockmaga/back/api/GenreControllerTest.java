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

import com.stockmaga.back.models.Genre;
import com.stockmaga.back.services.IGenreService;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@TestExecutionListeners(mergeMode = MergeMode.MERGE_WITH_DEFAULTS, listeners = {
		WithSecurityContextTestExecutionListener.class })
public class GenreControllerTest {

	@Autowired
	MockMvc mockMvc;

	@MockBean
	private IGenreService genreService;

	@Test
	@WithMockUser(roles = { "ADMIN" })
	public void findAllGenresTest() throws Exception {
		when(this.genreService.findAllGenres(any())).thenReturn(new ArrayList<>());
		this.mockMvc.perform(get("/api/genres?idUser=1")).andExpect(status().isOk());
	}

	@Test
	@WithMockUser(roles = { "ADMIN" })
	public void findOnegenreTest() throws Exception {
		when(this.genreService.findOnegenre(any(), any())).thenReturn(new Genre());
		this.mockMvc.perform(get("/api/genres/test")).andExpect(status().isOk());
	}

	@Test
	@WithMockUser(roles={"ADMIN"})
	public void saveGenreTest() throws Exception{
		Genre genre = new Genre();
		genre.setDesignation("test");
		this.mockMvc.perform(post("/api/genres/save").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content("{\"designation\": \"test\"}")).andExpect(status().isCreated())
				.andExpect(jsonPath("designation").value("test"));;
	}

	@Test
	@WithMockUser(roles={"ADMIN"})
	public void deleteGenreTest() throws Exception{
		this.mockMvc.perform(delete("/api/genres/delete?id=1")).andExpect(status().isOk())
				.andExpect(jsonPath("msg").value("categorie supprimée."));;
	}


}
