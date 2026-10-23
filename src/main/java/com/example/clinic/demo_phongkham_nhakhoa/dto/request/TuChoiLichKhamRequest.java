package com.example.clinic.demo_phongkham_nhakhoa.dto.request;

import jakarta.validation.constraints.NotBlank;

public class TuChoiLichKhamRequest {

    @NotBlank(message = "Lý do từ chối không được để trống")
    private String lyDo;

    public TuChoiLichKhamRequest() {
    }

    public String getLyDo() {
        return lyDo;
    }

    public void setLyDo(String lyDo) {
        this.lyDo = lyDo;
    }
}
