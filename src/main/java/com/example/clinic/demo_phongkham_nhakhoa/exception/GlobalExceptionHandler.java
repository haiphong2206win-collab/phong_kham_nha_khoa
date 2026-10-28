package com.example.clinic.demo_phongkham_nhakhoa.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Bắt lỗi Validation (@NotNull, @NotBlank...)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> xuLyLoiValidation(MethodArgumentNotValidException ex) {
        Map<String, String> chiTietLoi = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            chiTietLoi.put(error.getField(), error.getDefaultMessage());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("thoiGian", LocalDateTime.now().toString());
        response.put("trangThai", 400);
        response.put("loi", "Dữ liệu gửi lên không hợp lệ");
        response.put("chiTiet", chiTietLoi);

        return response;
    }

    // 2. Bắt lỗi Jackson parse JSON (Sai định dạng Date, sai Enum CaKham)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> xuLyLoiParseJson(HttpMessageNotReadableException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("thoiGian", LocalDateTime.now().toString());
        response.put("trangThai", 400);
        response.put("loi", "Lỗi định dạng dữ liệu JSON (Kiểm tra lại ngày YYYY-MM-DD hoặc CaKham)");
        response.put("chiTiet", ex.getMostSpecificCause().getMessage());

        return response;
    }

    // 3. Bắt lỗi nghiệp vụ throw từ Service (IllegalArgumentException, IllegalStateException)
    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> xuLyLoiNghiepVu(RuntimeException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("thoiGian", LocalDateTime.now().toString());
        response.put("trangThai", 400);
        response.put("loi", ex.getMessage());

        return response;
    }

    // 4. Bắt tất cả các Exception còn lại
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, Object> xuLyLoiHeThong(Exception ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("thoiGian", LocalDateTime.now().toString());
        response.put("trangThai", 500);
        response.put("loi", "Lỗi hệ thống: " + ex.getMessage());

        return response;
    }
}