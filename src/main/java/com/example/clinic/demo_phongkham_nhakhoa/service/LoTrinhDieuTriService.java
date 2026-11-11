
package com.example.clinic.demo_phongkham_nhakhoa.service;

import com.example.clinic.demo_phongkham_nhakhoa.dto.request.TaoLoTrinhDieuTriRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.BuoiDieuTriResponse;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.LoTrinhDieuTriResponse;

import com.example.clinic.demo_phongkham_nhakhoa.entity.BenhNhan;
import com.example.clinic.demo_phongkham_nhakhoa.entity.BuoiDieuTri;
import com.example.clinic.demo_phongkham_nhakhoa.entity.BuoiMau;
import com.example.clinic.demo_phongkham_nhakhoa.entity.LoTrinhDieuTri;
import com.example.clinic.demo_phongkham_nhakhoa.entity.LoTrinhMau;

import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiBuoiDieuTri;

import com.example.clinic.demo_phongkham_nhakhoa.repository.BenhNhanRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.BuoiDieuTriRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.BuoiMauRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.LoTrinhDieuTriRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.LoTrinhMauRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class LoTrinhDieuTriService {

    private final LoTrinhDieuTriRepository loTrinhDieuTriRepository;
    private final BuoiDieuTriRepository buoiDieuTriRepository;
    private final BenhNhanRepository benhNhanRepository;
    private final LoTrinhMauRepository loTrinhMauRepository;
    private final BuoiMauRepository buoiMauRepository;

    // Constructor Dependency Injection
    public LoTrinhDieuTriService(
            LoTrinhDieuTriRepository loTrinhDieuTriRepository,
            BuoiDieuTriRepository buoiDieuTriRepository,
            BenhNhanRepository benhNhanRepository,
            LoTrinhMauRepository loTrinhMauRepository,
            BuoiMauRepository buoiMauRepository) {

        this.loTrinhDieuTriRepository = loTrinhDieuTriRepository;

        this.buoiDieuTriRepository = buoiDieuTriRepository;

        this.benhNhanRepository = benhNhanRepository;

        this.loTrinhMauRepository = loTrinhMauRepository;

        this.buoiMauRepository = buoiMauRepository;
    }

    // 1. TAO LO TRINH RIENG CHO BENH NHAN

    @Transactional
    public LoTrinhDieuTriResponse taoLoTrinhDieuTri(
            TaoLoTrinhDieuTriRequest request) {

        if (request == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Du lieu tao lo trinh khong hop le");
        }

        // Kiem tra ma benh nhan
        String maBenhNhan = request.getMaBenhNhan();

        if (maBenhNhan == null || maBenhNhan.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ma benh nhan khong duoc de trong");
        }

        maBenhNhan = maBenhNhan.trim();

        // Kiem tra ma lo trinh mau
        String maLoTrinhMau = request.getMaLoTrinhMau();

        if (maLoTrinhMau == null || maLoTrinhMau.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ma lo trinh mau khong duoc de trong");
        }

        maLoTrinhMau = maLoTrinhMau.trim();

        // Tim benh nhan co san trong MySQL
        BenhNhan benhNhan = benhNhanRepository
                .findById(maBenhNhan)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Khong tim thay benh nhan"));

        // Tim lo trinh mau co san
        LoTrinhMau loTrinhMau = loTrinhMauRepository
                .findById(maLoTrinhMau)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Khong tim thay lo trinh mau"));

        // Lay danh sach buoi mau theo thu tu
        List<BuoiMau> danhSachBuoiMau = buoiMauRepository
                .findByLoTrinhMau_MaLoTrinhOrderBySoThuTuAsc(
                        maLoTrinhMau);

        // Khong tao lo trinh neu mau chua du buoi
        if (danhSachBuoiMau.isEmpty()
                || danhSachBuoiMau.size() != loTrinhMau.getTongSoBuoi()) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Du lieu buoi mau chua day du");
        }

        // Xac dinh ten lo trinh
        String tenLoTrinh = request.getTenLoTrinh();

        if (tenLoTrinh == null || tenLoTrinh.isBlank()) {
            tenLoTrinh = loTrinhMau.getTenLoTrinh();
        } else {
            tenLoTrinh = tenLoTrinh.trim();
        }

        if (tenLoTrinh.length() > 200) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ten lo trinh vuot qua 200 ky tu");
        }

        String ghiChu = request.getGhiChu();

        if (ghiChu != null) {
            ghiChu = ghiChu.trim();
        }

        if (ghiChu != null && ghiChu.length() > 2000) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ghi chu vuot qua 2000 ky tu");
        }

        // Tao lo trinh rieng
        LoTrinhDieuTri loTrinhMoi = new LoTrinhDieuTri(
                benhNhan,
                loTrinhMau,
                tenLoTrinh,
                ghiChu);

        // Luu va sinh ma UUID
        loTrinhMoi = loTrinhDieuTriRepository.saveAndFlush(
                loTrinhMoi);

        // Sao chep tung buoi mau thanh buoi rieng
        List<BuoiDieuTri> danhSachBuoiMoi = new ArrayList<>();

        for (BuoiMau buoiMau : danhSachBuoiMau) {

            BuoiDieuTri buoiMoi = new BuoiDieuTri(
                    loTrinhMoi,
                    buoiMau.getSoThuTu(),
                    buoiMau.getTenBuoi(),
                    buoiMau.getNoiDung(),
                    buoiMau.getKhoangCachMin(),
                    buoiMau.getKhoangCachMax(),
                    buoiMau.getGhiChu(),
                    false);

            danhSachBuoiMoi.add(buoiMoi);
        }

        // Luu tat ca buoi trong cung transaction
        buoiDieuTriRepository.saveAll(
                danhSachBuoiMoi);

        // Tra ve lo trinh vua tao
        return chuyenSangResponse(loTrinhMoi);
    }

    // 2. LAY THONG TIN LO TRINH THEO MA

    public LoTrinhDieuTriResponse layLoTrinhTheoMa(
            String maLoTrinhDieuTri) {

        LoTrinhDieuTri loTrinh = timLoTrinhTheoMa(maLoTrinhDieuTri);

        return chuyenSangResponse(loTrinh);
    }

    // 3. LAY DANH SACH LO TRINH CUA BENH NHAN

    public List<LoTrinhDieuTriResponse> layLoTrinhTheoBenhNhan(String maBenhNhan) {

        if (maBenhNhan == null || maBenhNhan.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ma benh nhan khong duoc de trong");
        }

        maBenhNhan = maBenhNhan.trim();

        if (!benhNhanRepository.existsById(maBenhNhan)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Khong tim thay benh nhan");
        }

        List<LoTrinhDieuTri> danhSach = loTrinhDieuTriRepository
                .findByBenhNhan_MaBenhNhanOrderByThoiGianTaoDesc(
                        maBenhNhan);

        return danhSach.stream()
                .map(this::chuyenSangResponse)
                .toList();
    }

    // 4. LAY DANH SACH BUOI CUA MOT LO TRINH

    public List<BuoiDieuTriResponse> layDanhSachBuoi(
            String maLoTrinhDieuTri) {

        LoTrinhDieuTri loTrinh = timLoTrinhTheoMa(maLoTrinhDieuTri);

        List<BuoiDieuTri> danhSachBuoi = buoiDieuTriRepository
                .findByLoTrinhDieuTri_MaLoTrinhDieuTriOrderBySoThuTuAsc(
                        loTrinh.getMaLoTrinhDieuTri());

        return danhSachBuoi.stream()
                .map(this::chuyenBuoiSangResponse)
                .toList();
    }

    // 5. TIM LO TRINH, BAO LOI NEU KHONG TON TAI

    private LoTrinhDieuTri timLoTrinhTheoMa(
            String maLoTrinhDieuTri) {

        if (maLoTrinhDieuTri == null
                || maLoTrinhDieuTri.isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ma lo trinh khong duoc de trong");
        }

        return loTrinhDieuTriRepository
                .findById(maLoTrinhDieuTri.trim())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Khong tim thay lo trinh dieu tri"));
    }

    // 6. CHUYEN ENTITY LO TRINH SANG RESPONSE

    private LoTrinhDieuTriResponse chuyenSangResponse(
            LoTrinhDieuTri loTrinh) {

        String maLoTrinh = loTrinh.getMaLoTrinhDieuTri();

        // Dem tat ca buoi ke ca buoi da bo
        long tongBanGhi = buoiDieuTriRepository
                .countByLoTrinhDieuTri_MaLoTrinhDieuTri(
                        maLoTrinh);

        // Dem so buoi da bo
        long soBuoiDaBo = buoiDieuTriRepository
                .countByLoTrinhDieuTri_MaLoTrinhDieuTriAndTrangThai(
                        maLoTrinh,
                        TrangThaiBuoiDieuTri.DA_BO);

        // Dem so buoi hoan thanh
        long soBuoiHoanThanh = buoiDieuTriRepository
                .countByLoTrinhDieuTri_MaLoTrinhDieuTriAndTrangThai(
                        maLoTrinh,
                        TrangThaiBuoiDieuTri.HOAN_THANH);

        // Tong buoi dang ap dung
        long tongSoBuoi = tongBanGhi - soBuoiDaBo;

        return new LoTrinhDieuTriResponse(
                loTrinh.getMaLoTrinhDieuTri(),
                loTrinh.getBenhNhan().getMaBenhNhan(),
                loTrinh.getLoTrinhMau().getMaLoTrinh(),
                loTrinh.getTenLoTrinh(),
                loTrinh.getGhiChu(),
                loTrinh.getTrangThai(),
                tongSoBuoi,
                soBuoiHoanThanh,
                soBuoiDaBo,
                loTrinh.getThoiGianTao(),
                loTrinh.getThoiGianCapNhat(),
                loTrinh.getVersion());
    }

    // 7. CHUYEN ENTITY BUOI SANG RESPONSE

    private BuoiDieuTriResponse chuyenBuoiSangResponse(
            BuoiDieuTri buoi) {

        return new BuoiDieuTriResponse(
                buoi.getMaBuoiDieuTri(),
                buoi.getLoTrinhDieuTri()
                        .getMaLoTrinhDieuTri(),
                buoi.getSoThuTu(),
                buoi.getTenBuoi(),
                buoi.getNoiDung(),
                buoi.getKhoangCachMin(),
                buoi.getKhoangCachMax(),
                buoi.getGhiChu(),
                buoi.getTrangThai(),
                buoi.isBuoiBoSung(),
                buoi.getLyDoBo(),
                buoi.getThoiGianTao(),
                buoi.getThoiGianCapNhat(),
                buoi.getVersion());
    }
}
