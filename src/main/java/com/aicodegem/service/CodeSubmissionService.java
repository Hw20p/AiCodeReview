package com.aicodegem.service;

import java.io.IOException;
import java.util.List;
import com.aicodegem.model.CodeSubmission;

public interface CodeSubmissionService {
    /** 코드 제출 */
    CodeSubmission submitCode(Long userId, String code, String title) throws IOException, InterruptedException;

    /** 코드 재제출 */
    CodeSubmission reviseCode(String submissionId, String revisedCode) throws IOException, InterruptedException;

    /** 제출된 코드 목록 가져오기 */
    List<CodeSubmission> getUserSubmissions(Long userId);
}
