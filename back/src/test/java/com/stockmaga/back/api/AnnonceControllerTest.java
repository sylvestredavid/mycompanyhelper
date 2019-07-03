package com.stockmaga.back.api;

import com.stockmaga.back.models.Annonce;
import com.stockmaga.back.services.IAnnonceService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class AnnonceControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    IAnnonceService annonceService;

    @Test
    @WithMockUser(roles={"FOURNISSEUR"})
    public void findAllAnnoncesByFournisseurTest() throws Exception {
        when(this.annonceService.findAllAnnoncesByFournisseur(any())).thenReturn(new ArrayList<Annonce>());

        this.mockMvc.perform(get("/api/annuaireFournisseur/1/annonces")).andExpect(status().isOk());
    }
}
