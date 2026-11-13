
package com.example.clinic.demo_phongkham_nhakhoa.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class BoBuoiDieuTriRequest {

    // Ly do bac si quyet dinh bo buoi dieu tri
    @NotBlank(message = "Ly do bo buoi khong duoc de trong")
    @Size(max = 1000, message = "Ly do bo buoi khong duoc qua 1000 ky tu")
    private String lyDoBo;

    // Constructor cho Jackson
    public BoBuoiDieuTriRequest() {
    }

    // GETTER
    public String getLyDoBo() {
        return lyDoBo;
    }

    // SETTER
    public void setLyDoBo(String lyDoBo) {
        this.lyDoBo = lyDoBo;
    }
}
