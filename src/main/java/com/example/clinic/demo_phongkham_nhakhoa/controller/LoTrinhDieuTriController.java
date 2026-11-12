
package com.example.clinic.demo_phongkham_nhakhoa.controller;

import com.example.clinic.demo_phongkham_nhakhoa.dto.request.TaoLoTrinhDieuTriRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.request.LienKetBuoiVoiLichRequest;

import com.example.clinic.demo_phongkham_nhakhoa.dto.response.BuoiDieuTriResponse;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.LoTrinhDieuTriResponse;

import com.example.clinic.demo_phongkham_nhakhoa.entity.BuoiDieuTri;

import com.example.clinic.demo_phongkham_nhakhoa.service.LoTrinhDieuTriService;
import com.example.clinic.demo_phongkham_nhakhoa.service.LienKetDieuTriService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/lo-trinh-dieu-tri")
public class LoTrinhDieuTriController {

        private final LoTrinhDieuTriService loTrinhDieuTriService;

        // GIAI DOAN 3 - SERVICE LIEN KET LICH KHAM
        private final LienKetDieuTriService lienKetDieuTriService;

        // Constructor Dependency Injection
        public LoTrinhDieuTriController(
                        LoTrinhDieuTriService loTrinhDieuTriService,
                        LienKetDieuTriService lienKetDieuTriService) {

                this.loTrinhDieuTriService = loTrinhDieuTriService;
                this.lienKetDieuTriService = lienKetDieuTriService;
        }

        // ==================================================
        // 1. TAO LO TRINH RIENG CHO BENH NHAN - GIU NGUYEN
        // ==================================================

        @PostMapping
        @PreAuthorize("hasAnyRole('BAC_SI', 'CHU_PHONG_KHAM')")
        public ResponseEntity<LoTrinhDieuTriResponse> taoLoTrinhDieuTri(
                        @Valid @RequestBody TaoLoTrinhDieuTriRequest request) {

                LoTrinhDieuTriResponse response = loTrinhDieuTriService
                                .taoLoTrinhDieuTri(request);

                return ResponseEntity
                                .status(HttpStatus.CREATED)
                                .body(response);
        }

        // ==================================================
        // 2. XEM CHI TIET LO TRINH THEO MA - GIU NGUYEN
        // ==================================================

        @GetMapping("/{maLoTrinhDieuTri}")
        @PreAuthorize("hasAnyRole('BAC_SI', 'CHU_PHONG_KHAM')")
        public ResponseEntity<LoTrinhDieuTriResponse> layChiTietLoTrinh(
                        @PathVariable String maLoTrinhDieuTri) {

                LoTrinhDieuTriResponse response = loTrinhDieuTriService
                                .layLoTrinhTheoMa(maLoTrinhDieuTri);

                return ResponseEntity.ok(response);
        }

        // ==================================================
        // 3. XEM DANH SACH LO TRINH THEO BENH NHAN - GIU NGUYEN
        // ==================================================

        @GetMapping("/benh-nhan/{maBenhNhan}")
        @PreAuthorize("hasAnyRole('BAC_SI', 'CHU_PHONG_KHAM')")
        public ResponseEntity<List<LoTrinhDieuTriResponse>> layDanhSachTheoBenhNhan(
                        @PathVariable String maBenhNhan) {

                List<LoTrinhDieuTriResponse> response = loTrinhDieuTriService
                                .layLoTrinhTheoBenhNhan(maBenhNhan);

                return ResponseEntity.ok(response);
        }

        // ==================================================
        // 4. XEM DANH SACH BUOI CUA LO TRINH - GIU NGUYEN
        // ==================================================

        @GetMapping("/{maLoTrinhDieuTri}/buoi")
        @PreAuthorize("hasAnyRole('BAC_SI', 'CHU_PHONG_KHAM')")
        public ResponseEntity<List<BuoiDieuTriResponse>> layDanhSachBuoi(
                        @PathVariable String maLoTrinhDieuTri) {

                List<BuoiDieuTriResponse> response = loTrinhDieuTriService
                                .layDanhSachBuoi(maLoTrinhDieuTri);

                return ResponseEntity.ok(response);
        }

        // ==================================================
        // 5. GIAI DOAN 3 - LIEN KET BUOI VOI LICH KHAM CO SAN
        // ==================================================

        @PostMapping("/{maLoTrinhDieuTri}/buoi/{maBuoiDieuTri}/lien-ket-lich")
        @PreAuthorize("hasAnyRole('BAC_SI', 'CHU_PHONG_KHAM')")
        public ResponseEntity<Void> lienKetBuoiVoiLich(
                        @PathVariable String maLoTrinhDieuTri,
                        @PathVariable String maBuoiDieuTri,
                        @Valid @RequestBody LienKetBuoiVoiLichRequest request) {

                lienKetDieuTriService.lienKetBuoiVoiLich(
                                maLoTrinhDieuTri,
                                maBuoiDieuTri,
                                request.getMaLichKham());

                return ResponseEntity.noContent().build();
        }

        // ==================================================
        // 6. GIAI DOAN 3 - GO LIEN KET LICH KHAM
        // ==================================================

        @DeleteMapping("/{maLoTrinhDieuTri}/buoi/{maBuoiDieuTri}/lich-kham")
        @PreAuthorize("hasAnyRole('BAC_SI', 'CHU_PHONG_KHAM')")
        public ResponseEntity<Void> goLichKhoiBuoi(
                        @PathVariable String maLoTrinhDieuTri,
                        @PathVariable String maBuoiDieuTri) {

                lienKetDieuTriService.goLichKhoiBuoi(
                                maLoTrinhDieuTri,
                                maBuoiDieuTri);

                return ResponseEntity.noContent().build();
        }

        // ==================================================
        // 7. GIAI DOAN 3 - DONG BO TRANG THAI TU LICH KHAM
        // ==================================================

        @PostMapping("/{maLoTrinhDieuTri}/buoi/{maBuoiDieuTri}/dong-bo")
        @PreAuthorize("hasAnyRole('BAC_SI', 'CHU_PHONG_KHAM')")
        public ResponseEntity<Void> dongBoTrangThai(
                        @PathVariable String maLoTrinhDieuTri,
                        @PathVariable String maBuoiDieuTri) {

                lienKetDieuTriService.dongBoTrangThai(
                                maLoTrinhDieuTri,
                                maBuoiDieuTri);

                return ResponseEntity.noContent().build();
        }
}
