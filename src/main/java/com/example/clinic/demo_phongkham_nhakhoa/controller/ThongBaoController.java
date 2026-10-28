package com.example.clinic.demo_phongkham_nhakhoa.controller;

import com.example.clinic.demo_phongkham_nhakhoa.dto.response.ThongBaoResponse;
import com.example.clinic.demo_phongkham_nhakhoa.service.ThongBaoService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/thong-bao")
public class ThongBaoController {

    private final ThongBaoService thongBaoService;

    public ThongBaoController(ThongBaoService thongBaoService) {
        this.thongBaoService = thongBaoService;
    }

    // GET /api/v1/thong-bao
    @GetMapping
    public List<ThongBaoResponse> layThongBaoCuaToi(
            Principal principal
    ) {
        return thongBaoService.layThongBaoCuaToi(
                principal.getName()
        );
    }

    // GET /api/v1/thong-bao/chua-doc/dem
    @GetMapping("/chua-doc/dem")
    public Map<String, Long> demThongBaoChuaDoc(
            Principal principal
    ) {
        long soLuong = thongBaoService.demThongBaoChuaDoc(
                principal.getName()
        );

        return Map.of("soLuongChuaDoc", soLuong);
    }

    // PATCH /api/v1/thong-bao/{maThongBao}/da-doc
    @PatchMapping("/{maThongBao}/da-doc")
    public Map<String, String> danhDauDaDoc(
            @PathVariable String maThongBao,
            Principal principal
    ) {
        thongBaoService.danhDauDaDoc(
                maThongBao,
                principal.getName()
        );

        return Map.of("message", "Đã đánh dấu thông báo đã đọc.");
    }
}
