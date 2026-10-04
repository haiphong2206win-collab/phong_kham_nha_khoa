package com.example.clinic.demo_phongkham_nhakhoa.appointment.dto.request;

import jakarta.validation.constraints.NotBlank;

// nhan ly do huy lich cua bsi or benh nhan 
// PATCH /api/v1/appointments/{id}/cancel

public class CancelAppointmentRequest {
    @NotBlank(message = "Lý do hủy lịch không được để trống")
    private String lyDo;

    public CancelAppointmentRequest() {
    }

    public CancelAppointmentRequest(String lyDo) {
        this.lyDo = lyDo;
    }

    public String getLyDo() {
        return lyDo;
    }

    public void setLyDo(String lyDo) {
        this.lyDo = lyDo;
    }
}
