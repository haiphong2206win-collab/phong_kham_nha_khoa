
package com.example.clinic.demo_phongkham_nhakhoa.controller;

import com.example.clinic.demo_phongkham_nhakhoa.dto.request.BoBuoiDieuTriRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.request.CapNhatBuoiDieuTriRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.request.ThemBuoiDieuTriRequest;

import com.example.clinic.demo_phongkham_nhakhoa.dto.response.BuoiDieuTriResponse;

import com.example.clinic.demo_phongkham_nhakhoa.service.BuoiDieuTriService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/lo-trinh-dieu-tri")
public class BuoiDieuTriController {

    private final BuoiDieuTriService buoiDieuTriService;

    // Constructor Dependency Injection
    public BuoiDieuTriController(
            BuoiDieuTriService buoiDieuTriService) {

        this.buoiDieuTriService = buoiDieuTriService;
    }

    // 1. THEM BUOI DIEU TRI VAO LO TRINH BENH NHAN

    @PostMapping("/{maLoTrinhDieuTri}/buoi")
    @PreAuthorize("hasAnyRole('BAC_SI', 'CHU_PHONG_KHAM')")
    public ResponseEntity<BuoiDieuTriResponse> themBuoi(
            @PathVariable String maLoTrinhDieuTri,
            @Valid @RequestBody ThemBuoiDieuTriRequest request) {

        BuoiDieuTriResponse response = buoiDieuTriService.themBuoi(
                maLoTrinhDieuTri,
                request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // 2. CAP NHAT NOI DUNG BUOI DIEU TRI

    @PutMapping("/{maLoTrinhDieuTri}/buoi/{maBuoiDieuTri}")
    @PreAuthorize("hasAnyRole('BAC_SI', 'CHU_PHONG_KHAM')")
    public ResponseEntity<BuoiDieuTriResponse> capNhatBuoi(
            @PathVariable String maLoTrinhDieuTri,
            @PathVariable String maBuoiDieuTri,
            @Valid @RequestBody CapNhatBuoiDieuTriRequest request) {

        BuoiDieuTriResponse response = buoiDieuTriService.capNhatBuoi(
                maLoTrinhDieuTri,
                maBuoiDieuTri,
                request);

        return ResponseEntity.ok(response);
    }

    // 3. BO BUOI DIEU TRI - KHONG XOA DU LIEU

    @PatchMapping("/{maLoTrinhDieuTri}/buoi/{maBuoiDieuTri}/bo")
    @PreAuthorize("hasAnyRole('BAC_SI', 'CHU_PHONG_KHAM')")
    public ResponseEntity<BuoiDieuTriResponse> boBuoi(
            @PathVariable String maLoTrinhDieuTri,
            @PathVariable String maBuoiDieuTri,
            @Valid @RequestBody BoBuoiDieuTriRequest request) {

        BuoiDieuTriResponse response = buoiDieuTriService.boBuoi(
                maLoTrinhDieuTri,
                maBuoiDieuTri,
                request.getLyDoBo());

        return ResponseEntity.ok(response);
    }

    // 4. XEM CHI TIET MOT BUOI DIEU TRI

    @GetMapping("/{maLoTrinhDieuTri}/buoi/{maBuoiDieuTri}")
    @PreAuthorize("hasAnyRole('BAC_SI', 'CHU_PHONG_KHAM')")
    public ResponseEntity<BuoiDieuTriResponse> layChiTietBuoi(
            @PathVariable String maLoTrinhDieuTri,
            @PathVariable String maBuoiDieuTri) {

        BuoiDieuTriResponse response = buoiDieuTriService.layChiTietBuoi(
                maLoTrinhDieuTri,
                maBuoiDieuTri);

        return ResponseEntity.ok(response);
    }
}
