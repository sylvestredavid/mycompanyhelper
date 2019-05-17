package com.stockmaga.back.api;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
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

import com.stockmaga.back.models.Notification;
import com.stockmaga.back.services.INotificationService;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@TestExecutionListeners(mergeMode = MergeMode.MERGE_WITH_DEFAULTS, listeners = {
		WithSecurityContextTestExecutionListener.class })
public class NotificationControllerTest {

	@Autowired
	MockMvc mockMvc;

	@MockBean
	private INotificationService notificationService;

	@Test
	@WithMockUser(roles = { "ADMIN" })
	public void findAllNotificationsTest() throws Exception {
		when(this.notificationService.findAllNotifications(1)).thenReturn(new ArrayList<>());
		this.mockMvc.perform(get("/api/notifications?idUser=1")).andExpect(status().isOk());
	}

	@Test
	@WithMockUser(roles={"ADMIN"})
	public void saveNotificationTest() throws Exception{
		Notification notification = new Notification();
		notification.setNotification("test");
		when(this.notificationService.saveNotification(any())).thenReturn(notification);
		this.mockMvc.perform(post("/api/notifications/save").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content("{\"notification\": \"test\"}")).andExpect(status().isCreated())
				.andExpect(jsonPath("notification").value("test"));;
	}

}
