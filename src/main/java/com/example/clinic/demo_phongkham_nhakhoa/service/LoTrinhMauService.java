
package com.example.clinic.demo_phongkham_nhakhoa.service;

import com.example.clinic.demo_phongkham_nhakhoa.entity.LoTrinhMau;
import com.example.clinic.demo_phongkham_nhakhoa.entity.BuoiMau;

import com.example.clinic.demo_phongkham_nhakhoa.repository.LoTrinhMauRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.BuoiMauRepository;

import com.example.clinic.demo_phongkham_nhakhoa.dto.response.LoTrinhMauResponse;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.BuoiMauResponse;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class LoTrinhMauService {

    private final LoTrinhMauRepository loTrinhMauRepository;
    private final BuoiMauRepository buoiMauRepository;

    public LoTrinhMauService(
            LoTrinhMauRepository loTrinhMauRepository,
            BuoiMauRepository buoiMauRepository) {

        this.loTrinhMauRepository = loTrinhMauRepository;
        this.buoiMauRepository = buoiMauRepository;
    }

    // 1. Lấy danh sách tất cả lộ trình mẫu
    public List<LoTrinhMauResponse> layTatCaLoTrinhMau() {

        return loTrinhMauRepository.findAll()
                .stream()
                .map(this::chuyenLoTrinhSangResponse)
                .toList();
    }

    // 2. Lấy chi tiết một lộ trình mẫu
    public LoTrinhMauResponse layLoTrinhTheoMa(
            String maLoTrinh) {

        LoTrinhMau loTrinh = timLoTrinh(maLoTrinh);

        return chuyenLoTrinhSangResponse(loTrinh);
    }

    // 3. Lấy danh sách các buổi theo lộ trình
    public List<BuoiMauResponse> layDanhSachBuoi(
            String maLoTrinh) {

        // Kiểm tra lộ trình tồn tại
        timLoTrinh(maLoTrinh);

        return buoiMauRepository
                .findByLoTrinhMau_MaLoTrinhOrderBySoThuTuAsc(
                        maLoTrinh)
                .stream()
                .map(this::chuyenBuoiSangResponse)
                .toList();
    }

    // 4. Tìm lộ trình, nếu không có thì báo lỗi 404
    private LoTrinhMau timLoTrinh(String maLoTrinh) {

        return loTrinhMauRepository.findById(maLoTrinh)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy lộ trình mẫu: "
                                + maLoTrinh));
    }

    // 5. Chuyển Entity thành Response DTO
    private LoTrinhMauResponse chuyenLoTrinhSangResponse(
            LoTrinhMau loTrinh) {

        return new LoTrinhMauResponse(
                loTrinh.getMaLoTrinh(),
                loTrinh.getTenLoTrinh(),
                loTrinh.getMoTa(),
                loTrinh.getTongSoBuoi(),
                loTrinh.getThoiGianDuKien());
    }

    // 6. Chuyển BuoiMau thành Response DTO
    private BuoiMauResponse chuyenBuoiSangResponse(
            BuoiMau buoi) {

        return new BuoiMauResponse(
                buoi.getMaBuoi(),
                buoi.getLoTrinhMau().getMaLoTrinh(),
                buoi.getSoThuTu(),
                buoi.getTenBuoi(),
                buoi.getNoiDung(),
                buoi.getKhoangCachMin(),
                buoi.getKhoangCachMax(),
                buoi.getGhiChu());
    }
}
