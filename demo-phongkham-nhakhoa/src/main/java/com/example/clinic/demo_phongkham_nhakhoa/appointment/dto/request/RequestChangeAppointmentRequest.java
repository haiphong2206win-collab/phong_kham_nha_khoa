package com.example.clinic.demo_phongkham_nhakhoa.appointment.dto.request;

// yeu cau thay doi lich kham 
// PATCH /api/v1/appointments/{id}/request-change

import jakarta.validation.constraints.NotBlank;

public class RequestChangeAppointmentRequest {

    @NotBlank(message = "Lý do thay đổi không được để trống")
    // @NotBlank không cho phép:
    private String lyDo;

    public RequestChangeAppointmentRequest() {
    }

    public RequestChangeAppointmentRequest(String lyDo) {
        this.lyDo = lyDo;
    }

    public String getLyDo() {
        return lyDo;
    }

    public void setLyDo(String lyDo) {
        this.lyDo = lyDo;
    }

}
