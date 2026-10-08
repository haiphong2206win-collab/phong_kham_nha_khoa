package com.example.clinic.demo_phongkham_nhakhoa.controller;

import com.example.clinic.demo_phongkham_nhakhoa.dto.*;
import com.example.clinic.demo_phongkham_nhakhoa.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// @RestController
// @RequestMapping("/api/phan-cong")
public class PhanCongController {

    // @Autowired
    private PhanCongLichService phanCongService;

    // @PostMapping
    public ResponseEntity<?> phanCongLich(@RequestBody PhanCongRequest request) {
        try {
            KetQuaPhanCong ketQua = phanCongService.phanCong(
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

    // @PostMapping("/tu-choi")
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
