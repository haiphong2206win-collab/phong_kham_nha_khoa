package com.example.clinic.demo_phongkham_nhakhoa.controller;

import com.example.clinic.demo_phongkham_nhakhoa.dto.request.CapNhatCaLamViecRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.request.TaoCaLamViecRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.CaLamViecResponse;
import com.example.clinic.demo_phongkham_nhakhoa.service.CaLamViecService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/quan-ly/ca-lam-viec")
public class QuanLyCaLamViecController {

    private final CaLamViecService caLamViecService;

    public QuanLyCaLamViecController(CaLamViecService caLamViecService) {
        this.caLamViecService = caLamViecService;
    }

    // GET /api/v1/quan-ly/ca-lam-viec
    @GetMapping
    public List<CaLamViecResponse> layDanhSachCa(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tuNgay,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate denNgay,
            @RequestParam(required = false) String maBacSi
    ) {
        return caLamViecService.layDanhSach(tuNgay, denNgay, maBacSi);
    }

    // GET /api/v1/quan-ly/ca-lam-viec/{maCa}
    @GetMapping("/{maCa}")
    public CaLamViecResponse layChiTietCa(@PathVariable String maCa) {
        return caLamViecService.layChiTiet(maCa);
    }

    // POST /api/v1/quan-ly/ca-lam-viec
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CaLamViecResponse taoCaLamViec(@Valid @RequestBody TaoCaLamViecRequest request) {
        return caLamViecService.taoCaLamViec(request);
    }

    // PUT /api/v1/quan-ly/ca-lam-viec/{maCa}
    @PutMapping("/{maCa}")
    public CaLamViecResponse capNhatCaLamViec(
            @PathVariable String maCa,
            @Valid @RequestBody CapNhatCaLamViecRequest request
    ) {
        return caLamViecService.capNhatCaLamViec(maCa, request);
    }

    // DELETE /api/v1/quan-ly/ca-lam-viec/{maCa}
    @DeleteMapping("/{maCa}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void xoaCaLamViec(@PathVariable String maCa) {
        caLamViecService.xoaCaLamViec(maCa);
    }
}
