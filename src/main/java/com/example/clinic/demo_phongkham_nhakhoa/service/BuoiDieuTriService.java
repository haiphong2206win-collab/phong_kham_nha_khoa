
package com.example.clinic.demo_phongkham_nhakhoa.service;

import com.example.clinic.demo_phongkham_nhakhoa.dto.request.CapNhatBuoiDieuTriRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.request.ThemBuoiDieuTriRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.BuoiDieuTriResponse;

import com.example.clinic.demo_phongkham_nhakhoa.entity.BuoiDieuTri;
import com.example.clinic.demo_phongkham_nhakhoa.entity.LoTrinhDieuTri;

import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiBuoiDieuTri;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiLoTrinh;

import com.example.clinic.demo_phongkham_nhakhoa.repository.BuoiDieuTriRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.LoTrinhDieuTriRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class BuoiDieuTriService {

    private final BuoiDieuTriRepository buoiDieuTriRepository;
    private final LoTrinhDieuTriRepository loTrinhDieuTriRepository;

    public BuoiDieuTriService(
            BuoiDieuTriRepository buoiDieuTriRepository,
            LoTrinhDieuTriRepository loTrinhDieuTriRepository) {

        this.buoiDieuTriRepository = buoiDieuTriRepository;
        this.loTrinhDieuTriRepository = loTrinhDieuTriRepository;
    }

    // ==================================================
    // 1. THEM BUOI DIEU TRI
    // ==================================================

    @Transactional
    public BuoiDieuTriResponse themBuoi(
            String maLoTrinhDieuTri,
            ThemBuoiDieuTriRequest request) {

        LoTrinhDieuTri loTrinh = timLoTrinh(maLoTrinhDieuTri);

        kiemTraLoTrinhChoPhepChinhSua(loTrinh);

        if (request == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Du lieu them buoi khong hop le");
        }

        if (request.getSoThuTu() == null
                || request.getSoThuTu() < 1) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "So thu tu phai lon hon 0");
        }

        kiemTraThongTinBuoi(
                request.getTenBuoi(),
                request.getNoiDung(),
                request.getKhoangCachMin(),
                request.getKhoangCachMax(),
                request.getGhiChu());

        List<BuoiDieuTri> danhSach = buoiDieuTriRepository
                .findByLoTrinhDieuTri_MaLoTrinhDieuTriOrderBySoThuTuAsc(
                        loTrinh.getMaLoTrinhDieuTri());

        int viTriChen = request.getSoThuTu();

        // Lay thu tu lon nhat, bao gom ca buoi da bo.
        int thuTuLonNhat = danhSach.stream()
                .mapToInt(BuoiDieuTri::getSoThuTu)
                .max()
                .orElse(0);

        if (viTriChen > thuTuLonNhat + 1) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Vi tri chen vuot qua danh sach buoi hien tai");
        }

        // Neu chen vao giua, cac buoi phia sau
        // can duoc doi thu tu.
        List<BuoiDieuTri> cacBuoiCanDich = new ArrayList<>();

        for (BuoiDieuTri buoi : danhSach) {

            if (buoi.getSoThuTu() >= viTriChen) {

                // Chi cho phep dich buoi chua len lich.
                // Khong thay doi lich su hay lich hen.
                if (buoi.getTrangThai() != TrangThaiBuoiDieuTri.CHUA_LEN_LICH) {

                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "Khong the chen tai vi tri nay vi "
                                    + "co buoi da len lich, da thuc hien "
                                    + "hoac da thay doi trang thai");
                }

                cacBuoiCanDich.add(buoi);
            }
        }

        // Dich tu cuoi ve dau de giu thu tu ro rang.
        cacBuoiCanDich.sort(
                Comparator.comparingInt(
                        BuoiDieuTri::getSoThuTu).reversed());

        for (BuoiDieuTri buoi : cacBuoiCanDich) {
            buoi.capNhatSoThuTu(
                    buoi.getSoThuTu() + 1);
        }

        // Tao buoi rieng, danh dau la buoi bo sung.
        BuoiDieuTri buoiMoi = new BuoiDieuTri(
                loTrinh,
                viTriChen,
                request.getTenBuoi().trim(),
                request.getNoiDung().trim(),
                request.getKhoangCachMin(),
                request.getKhoangCachMax(),
                chuanHoaGhiChu(request.getGhiChu()),
                true);

        // Luu thu tu moi va buoi moi trong 1 transaction.
        buoiDieuTriRepository.saveAll(cacBuoiCanDich);

        buoiMoi = buoiDieuTriRepository.save(buoiMoi);

        buoiDieuTriRepository.flush();

        return chuyenSangResponse(buoiMoi);
    }

    // ==================================================
    // 2. CAP NHAT THONG TIN MOT BUOI
    // ==================================================

    @Transactional
    public BuoiDieuTriResponse capNhatBuoi(
            String maLoTrinhDieuTri,
            String maBuoiDieuTri,
            CapNhatBuoiDieuTriRequest request) {

        LoTrinhDieuTri loTrinh = timLoTrinh(maLoTrinhDieuTri);

        kiemTraLoTrinhChoPhepChinhSua(loTrinh);

        BuoiDieuTri buoi = timBuoiThuocLoTrinh(
                loTrinh,
                maBuoiDieuTri);

        if (request == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Du lieu cap nhat khong hop le");
        }

        kiemTraThongTinBuoi(
                request.getTenBuoi(),
                request.getNoiDung(),
                request.getKhoangCachMin(),
                request.getKhoangCachMax(),
                request.getGhiChu());

        // Chi sua buoi chua co lich.
        // Khong thay doi buoi da len lich hoac lich su.
        if (buoi.getTrangThai() != TrangThaiBuoiDieuTri.CHUA_LEN_LICH) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Chi duoc sua buoi chua len lich");
        }

        buoi.capNhatThongTin(
                request.getTenBuoi().trim(),
                request.getNoiDung().trim(),
                request.getKhoangCachMin(),
                request.getKhoangCachMax(),
                chuanHoaGhiChu(request.getGhiChu()));

        buoi = buoiDieuTriRepository.saveAndFlush(buoi);

        return chuyenSangResponse(buoi);
    }

    // ==================================================
    // 3. BO BUOI - KHONG XOA BAN GHI
    // ==================================================

    @Transactional
    public BuoiDieuTriResponse boBuoi(
            String maLoTrinhDieuTri,
            String maBuoiDieuTri,
            String lyDoBo) {

        LoTrinhDieuTri loTrinh = timLoTrinh(maLoTrinhDieuTri);

        kiemTraLoTrinhChoPhepChinhSua(loTrinh);

        BuoiDieuTri buoi = timBuoiThuocLoTrinh(
                loTrinh,
                maBuoiDieuTri);

        if (lyDoBo == null || lyDoBo.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Phai nhap ly do bo buoi");
        }

        if (lyDoBo.length() > 1000) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ly do bo buoi vuot qua 1000 ky tu");
        }

        // Chi cho bo buoi chua len lich.
        if (buoi.getTrangThai() != TrangThaiBuoiDieuTri.CHUA_LEN_LICH) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Chi duoc bo buoi chua len lich");
        }

        // Entity doi trang thai thanh DA_BO
        // va luu ly do, khong delete du lieu.
        buoi.boBuoi(lyDoBo.trim());

        buoi = buoiDieuTriRepository.saveAndFlush(buoi);

        return chuyenSangResponse(buoi);
    }

    // ==================================================
    // 4. XEM CHI TIET MOT BUOI
    // ==================================================

    public BuoiDieuTriResponse layChiTietBuoi(
            String maLoTrinhDieuTri,
            String maBuoiDieuTri) {

        LoTrinhDieuTri loTrinh = timLoTrinh(maLoTrinhDieuTri);

        BuoiDieuTri buoi = timBuoiThuocLoTrinh(
                loTrinh,
                maBuoiDieuTri);

        return chuyenSangResponse(buoi);
    }

    // ==================================================
    // 5. TIM LO TRINH
    // ==================================================

    private LoTrinhDieuTri timLoTrinh(
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

    // ==================================================
    // 6. TIM BUOI VA KIEM TRA THUOC DUNG LO TRINH
    // ==================================================

    private BuoiDieuTri timBuoiThuocLoTrinh(
            LoTrinhDieuTri loTrinh,
            String maBuoiDieuTri) {

        if (maBuoiDieuTri == null
                || maBuoiDieuTri.isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ma buoi dieu tri khong duoc de trong");
        }

        BuoiDieuTri buoi = buoiDieuTriRepository
                .findById(maBuoiDieuTri.trim())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Khong tim thay buoi dieu tri"));

        if (!buoi.getLoTrinhDieuTri()
                .getMaLoTrinhDieuTri()
                .equals(loTrinh.getMaLoTrinhDieuTri())) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Buoi khong thuoc lo trinh nay");
        }

        return buoi;
    }

    // ==================================================
    // 7. KIEM TRA TRANG THAI LO TRINH
    // ==================================================

    private void kiemTraLoTrinhChoPhepChinhSua(
            LoTrinhDieuTri loTrinh) {

        TrangThaiLoTrinh trangThai = loTrinh.getTrangThai();

        if (trangThai != TrangThaiLoTrinh.CHUA_BAT_DAU
                && trangThai != TrangThaiLoTrinh.DANG_DIEU_TRI) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Khong the chinh sua lo trinh "
                            + "dang tam dung, da hoan thanh hoac da huy");
        }
    }

    // ==================================================
    // 8. KIEM TRA NOI DUNG BUOI
    // ==================================================

    private void kiemTraThongTinBuoi(
            String tenBuoi,
            String noiDung,
            Integer min,
            Integer max,
            String ghiChu) {

        if (tenBuoi == null || tenBuoi.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ten buoi khong duoc de trong");
        }

        if (noiDung == null || noiDung.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Noi dung khong duoc de trong");
        }

        if (tenBuoi.length() > 200
                || noiDung.length() > 2000) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ten buoi hoac noi dung vuot qua gioi han");
        }

        if (ghiChu != null && ghiChu.length() > 1000) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ghi chu vuot qua 1000 ky tu");
        }

        if ((min != null && min < 0)
                || (max != null && max < 0)) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Khoang cach khong duoc am");
        }

        if (min != null && max != null && min > max) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Khoang cach min khong duoc lon hon max");
        }
    }

    // ==================================================
    // 9. CHUAN HOA GHI CHU
    // ==================================================

    private String chuanHoaGhiChu(String ghiChu) {

        if (ghiChu == null) {
            return null;
        }

        return ghiChu.trim();
    }

    // ==================================================
    // 10. CHUYEN ENTITY SANG DTO RESPONSE
    // ==================================================

    private BuoiDieuTriResponse chuyenSangResponse(
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
