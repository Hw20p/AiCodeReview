package com.aicodegem.controller;

import com.aicodegem.model.CodeSubmission;
import com.aicodegem.repository.CodeRepository;
import com.aicodegem.security.JwtUtil;
import com.aicodegem.service.AchievementService;
import com.aicodegem.service.CodeSubmissionService;
import com.aicodegem.service.PylintService;
import com.aicodegem.service.RankingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CodeAnalysisController.class)
@AutoConfigureMockMvc(addFilters = false)
class CodeAnalysisControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @MockBean
        private CodeSubmissionService codeSubmissionService;

        @MockBean
        private RankingService rankingService;

        @MockBean
        private AchievementService achievementService;

        @MockBean
        private CodeRepository codeRepository;

        @MockBean
        private PylintService pylintService;

        @MockBean
        private JwtUtil jwtUtil;

        @Autowired
        private ObjectMapper objectMapper;

        private CodeSubmission mockSubmission;

        @BeforeEach
        void setUp() {
                mockSubmission = new CodeSubmission(1L, "initial code", "Test Title");
                mockSubmission.setId("submissionId");
                mockSubmission.setInitialScore(85);
        }

        @Test
        void testSubmitCode() throws Exception {
                Mockito.when(codeSubmissionService.submitCode(anyLong(), anyString(), anyString()))
                                .thenReturn(mockSubmission);

                mockMvc.perform(post("/api/code/submit")
                                .param("userId", "1")
                                .param("code", "print('Hello World')")
                                .param("title", "Sample Title")
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value("submissionId"))
                                .andExpect(jsonPath("$.initialCode").value("initial code"))
                                .andExpect(jsonPath("$.title").value("Test Title"))
                                .andExpect(jsonPath("$.initialScore").value(85));
        }

        @Test
        void testReviseCode() throws Exception {
                mockSubmission.setRevisedCode("revised code");
                mockSubmission.setRevisedScore(90);

                Mockito.when(codeSubmissionService.reviseCode(anyString(), anyString()))
                                .thenReturn(mockSubmission);

                mockMvc.perform(post("/api/code/revise")
                                .param("submissionId", "submissionId")
                                .param("revisedCode", "print('Hello Revised')")
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.revisedCode").value("revised code"))
                                .andExpect(jsonPath("$.revisedScore").value(90));
        }

        @Test
        void testGetUserSubmissions() throws Exception {
                List<CodeSubmission> submissions = Collections.singletonList(mockSubmission);
                Mockito.when(codeSubmissionService.getUserSubmissions(anyLong()))
                                .thenReturn(submissions);

                mockMvc.perform(get("/api/code/submissions")
                                .param("userId", "1")
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.length()").value(1))
                                .andExpect(jsonPath("$[0].id").value("submissionId"))
                                .andExpect(jsonPath("$[0].title").value("Test Title"));
        }

        @Test
        void testGetUserSubmissions_NoContent() throws Exception {
                Mockito.when(codeSubmissionService.getUserSubmissions(anyLong()))
                                .thenReturn(Collections.emptyList());

                mockMvc.perform(get("/api/code/submissions")
                                .param("userId", "1")
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isNoContent());
        }
}
