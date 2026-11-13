
package com.example.clinic.demo_phongkham_nhakhoa.dto.request;

import jakarta.validation.constraints.NotBlank;

public class LienKetBuoiVoiLichRequest {

    // Ma lich kham da duoc tao trong he thong
    @NotBlank(message = "Ma lich kham khong duoc de trong")
    private String maLichKham;

    // Constructor mac dinh
    public LienKetBuoiVoiLichRequest() {
    }

    // Getter
    public String getMaLichKham() {
        return maLichKham;
    }

    // Setter
    public void setMaLichKham(String maLichKham) {
        this.maLichKham = maLichKham;
    }
}
