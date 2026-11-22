package com.example.clinic.demo_phongkham_nhakhoa.controller;

import com.example.clinic.demo_phongkham_nhakhoa.dto.request.TaoYeuCauDatLichRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.YeuCauDatLichResponse;
import com.example.clinic.demo_phongkham_nhakhoa.service.YeuCauDatLichService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/yeu-cau-dat-lich")
public class YeuCauDatLichController {

    private final YeuCauDatLichService yeuCauDatLichService;

    public YeuCauDatLichController(YeuCauDatLichService yeuCauDatLichService) {
        this.yeuCauDatLichService = yeuCauDatLichService;
    }

    // POST /api/v1/appointment-requests - Bệnh nhân gửi yêu cầu đặt lịch
    @PostMapping
    public YeuCauDatLichResponse guiYeuCau(Principal principal,
                                           @Valid @RequestBody TaoYeuCauDatLichRequest request) {
        String tenDangNhap = principal.getName();
        return yeuCauDatLichService.guiYeuCau(tenDangNhap, request);
    }

    // GET /api/v1/appointment-requests/me - Bệnh nhân xem danh sách các yêu cầu của mình
    @GetMapping("/cua-toi")
    public List<YeuCauDatLichResponse> layDanhSachCuaToi(Principal principal) {
        String tenDangNhap = principal.getName();
        return yeuCauDatLichService.layDanhSachCuaToi(tenDangNhap);
    }

    // GET - Tim yeu cau dat lich theo Id
    @GetMapping("/{maYeuCau}")
    public YeuCauDatLichResponse timTheoId(
            @PathVariable String maYeuCau,
            Principal principal
    ) {
        return yeuCauDatLichService.layChiTiet(
                maYeuCau,
                principal.getName()
        );
    }

    // PATCH /api/v1/yeu-cau-dat-lich/{maYeuCau}/huy - Bệnh nhân hủy yêu cầu đang chờ phân công
    @PatchMapping("/{maYeuCau}/huy")
    public YeuCauDatLichResponse huyYeuCau(
            @PathVariable String maYeuCau,
            @RequestBody(required = false) java.util.Map<String, String> body,
            Principal principal
    ) {
        if (principal == null) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.UNAUTHORIZED,
                    "Bạn cần đăng nhập để thực hiện thao tác này"
            );
        }
        String lyDo = (body != null) ? body.get("lyDo") : null;
        return yeuCauDatLichService.huyYeuCau(maYeuCau, principal.getName(), lyDo);
    }
}
