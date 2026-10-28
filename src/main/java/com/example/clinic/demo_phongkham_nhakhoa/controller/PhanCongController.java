package com.example.clinic.demo_phongkham_nhakhoa.controller;

import com.example.clinic.demo_phongkham_nhakhoa.dto.request.PhanCongRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.request.TuChoiRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.KetQuaPhanCongResponse;
import com.example.clinic.demo_phongkham_nhakhoa.service.PhanCongLichService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/phan-cong")
public class PhanCongController {

    private PhanCongLichService phanCongService;

    public PhanCongController(PhanCongLichService phanCongService) {
        this.phanCongService = phanCongService;
    }

    @PostMapping
    public ResponseEntity<?> phanCongLich(@RequestBody PhanCongRequest request) {
        try {
            KetQuaPhanCongResponse ketQua = phanCongService.phanCong(
                    request.getMaChuPhongKham(),
                    request.getMaYeuCau(),
                    request.getMaBacSi(),
                    request.getMaPhong(),
                    request.getGioBatDau(),
                    request.getThoiLuongPhut()
            );

            return ResponseEntity.ok(ketQua);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/tu-choi")
    public ResponseEntity<?> tuChoiYeuCau(@RequestBody TuChoiRequest request) {
        try {
            phanCongService.tuChoiYeuCau(
                    request.getMaChuPhongKham(),
                    request.getMaYeuCau(),
                    request.getLyDo()
            );
            return ResponseEntity.ok("Đã từ chối yêu cầu thành công.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
