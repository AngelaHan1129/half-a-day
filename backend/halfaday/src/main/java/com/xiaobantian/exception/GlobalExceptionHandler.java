package com.xiaobantian.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.ai.retry.NonTransientAiException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ProblemDetail> handleResponseStatusException(
            ResponseStatusException ex,
            HttpServletRequest request
    ) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                ex.getStatusCode(),
                ex.getReason() != null ? ex.getReason() : "Request failed"
        );
        problem.setTitle("Request Error");
        problem.setType(URI.create("https://xiaobantian.dev/errors/request-error"));
        problem.setInstance(URI.create(request.getRequestURI()));
        return problem(ex.getStatusCode().value(), problem);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ProblemDetail> handleIllegalArgument(
            IllegalArgumentException ex,
            HttpServletRequest request
    ) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
        problem.setTitle("Bad Request");
        problem.setType(URI.create("https://xiaobantian.dev/errors/bad-request"));
        problem.setInstance(URI.create(request.getRequestURI()));
        return problem(HttpStatus.BAD_REQUEST.value(), problem);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ProblemDetail> handleValidation(
            MethodArgumentNotValidException ex,
            HttpServletRequest request
    ) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "請求參數驗證失敗"
        );
        problem.setTitle("Validation Failed");
        problem.setType(URI.create("https://xiaobantian.dev/errors/validation-failed"));
        problem.setInstance(URI.create(request.getRequestURI()));
        return problem(HttpStatus.BAD_REQUEST.value(), problem);
    }

    @ExceptionHandler(HttpMediaTypeNotAcceptableException.class)
    public ResponseEntity<ProblemDetail> handleNotAcceptable(
            HttpMediaTypeNotAcceptableException ex,
            HttpServletRequest request
    ) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.NOT_ACCEPTABLE,
                "僅支援 application/json 回應，請將 Accept 設為 application/json"
        );
        problem.setTitle("Not Acceptable");
        problem.setType(URI.create("https://xiaobantian.dev/errors/not-acceptable"));
        problem.setInstance(URI.create(request.getRequestURI()));
        return problem(HttpStatus.NOT_ACCEPTABLE.value(), problem);
    }

    @ExceptionHandler(NonTransientAiException.class)
    public ResponseEntity<ProblemDetail> handleAiError(
            NonTransientAiException ex,
            HttpServletRequest request
    ) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_GATEWAY,
                "向量模型或 AI 服務呼叫失敗：" + ex.getMessage()
        );
        problem.setTitle("AI Service Error");
        problem.setType(URI.create("https://xiaobantian.dev/errors/ai-service"));
        problem.setInstance(URI.create(request.getRequestURI()));
        return problem(HttpStatus.BAD_GATEWAY.value(), problem);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ProblemDetail> handleRuntime(
            RuntimeException ex,
            HttpServletRequest request
    ) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.INTERNAL_SERVER_ERROR,
                ex.getMessage() != null ? ex.getMessage() : "伺服器執行失敗"
        );
        problem.setTitle("Runtime Error");
        problem.setType(URI.create("https://xiaobantian.dev/errors/runtime-error"));
        problem.setInstance(URI.create(request.getRequestURI()));
        return problem(HttpStatus.INTERNAL_SERVER_ERROR.value(), problem);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ProblemDetail> handleException(
            Exception ex,
            HttpServletRequest request
    ) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "伺服器發生未預期錯誤"
        );
        problem.setTitle("Internal Server Error");
        problem.setType(URI.create("https://xiaobantian.dev/errors/internal-server-error"));
        problem.setInstance(URI.create(request.getRequestURI()));
        problem.setProperty("error", ex.getClass().getSimpleName());
        return problem(HttpStatus.INTERNAL_SERVER_ERROR.value(), problem);
    }

    private ResponseEntity<ProblemDetail> problem(int status, ProblemDetail problem) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PROBLEM_JSON);
        return new ResponseEntity<>(problem, headers, HttpStatus.valueOf(status));
    }
}