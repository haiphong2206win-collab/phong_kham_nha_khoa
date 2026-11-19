
package com.example.clinic.demo_phongkham_nhakhoa.service;

import com.example.clinic.demo_phongkham_nhakhoa.dto.request.CapNhatHoSoBenhNhanRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.BuoiDieuTriResponse;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.LichKhamBenhNhanResponse;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.LoTrinhDieuTriResponse;
import com.example.clinic.demo_phongkham_nhakhoa.entity.BenhNhan;
import com.example.clinic.demo_phongkham_nhakhoa.entity.BuoiDieuTri;
import com.example.clinic.demo_phongkham_nhakhoa.entity.LichKham;
import com.example.clinic.demo_phongkham_nhakhoa.entity.LoTrinhDieuTri;
import com.example.clinic.demo_phongkham_nhakhoa.entity.TaiKhoan;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiBuoiDieuTri;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiDatLich;
import com.example.clinic.demo_phongkham_nhakhoa.event.LichKhamTrangThaiThayDoiEvent;
import com.example.clinic.demo_phongkham_nhakhoa.repository.BenhNhanRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.BuoiDieuTriRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.LichKhamRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.LoTrinhDieuTriRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.TaiKhoanRepository;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class BenhNhanService {

    private final BenhNhanRepository repository;

    private final TaiKhoanRepository taiKhoanRepository;

    private final LichKhamRepository lichKhamRepository;

    // GIAI DOAN 3 - Bo sung bo phat su kien
    private final ApplicationEventPublisher eventPublisher;

    // GIAI DOAN 4 - Bo sung repositories lo trinh va buoi dieu tri
    private final LoTrinhDieuTriRepository loTrinhDieuTriRepository;

    private final BuoiDieuTriRepository buoiDieuTriRepository;

    public BenhNhanService(
            BenhNhanRepository benhNhanRepository,
            TaiKhoanRepository taiKhoanRepository,
            LichKhamRepository lichKhamRepository,
            ApplicationEventPublisher eventPublisher,
            LoTrinhDieuTriRepository loTrinhDieuTriRepository,
            BuoiDieuTriRepository buoiDieuTriRepository) {

        this.repository = benhNhanRepository;
        this.taiKhoanRepository = taiKhoanRepository;
        this.lichKhamRepository = lichKhamRepository;
        this.eventPublisher = eventPublisher;
        this.loTrinhDieuTriRepository = loTrinhDieuTriRepository;
        this.buoiDieuTriRepository = buoiDieuTriRepository;
    }

    // Lay ho so benh nhan theo ten dang nhap
    public BenhNhan timTheoTenDangNhap(String tenDangNhap) {
        return repository.findByTaiKhoan_TenDangNhap(tenDangNhap)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy thông tin bệnh nhân cho tài khoản: "
                                + tenDangNhap));
    }

    // Benh nhan tu hoan thien / cap nhat ho so ca nhan
    @Transactional
    public BenhNhan capNhatHoSo(
            String tenDangNhap,
            CapNhatHoSoBenhNhanRequest request) {

        BenhNhan benhNhan = timTheoTenDangNhap(tenDangNhap);

        benhNhan.setHoTen(request.getHoTen());
        benhNhan.setNgaySinh(request.getNgaySinh());
        benhNhan.setGioiTinh(request.getGioiTinh());
        benhNhan.setSoDienThoai(request.getSoDienThoai());
        benhNhan.setEmail(request.getEmail());
        benhNhan.setDiaChi(request.getDiaChi());

        if (request.getTienSuBenh() != null) {
            benhNhan.capNhatTienSuBenh(request.getTienSuBenh());
        }

        if (request.getDiUngThuoc() != null) {
            benhNhan.capNhatDiUngThuoc(request.getDiUngThuoc());
        }

        return repository.save(benhNhan);
    }

    // 3. Them benh nhan thu cong
    @Transactional
    public BenhNhan them(BenhNhan benhNhan) {

        if (benhNhan.getTaiKhoan() == null
                || benhNhan.getTaiKhoan().getMaTaiKhoan() == null) {

            throw new IllegalArgumentException(
                    "Mã tài khoản liên kết không được để trống");
        }

        TaiKhoan taiKhoan = taiKhoanRepository
                .findById(benhNhan.getTaiKhoan().getMaTaiKhoan())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy tài khoản liên kết: "
                                + benhNhan.getTaiKhoan().getMaTaiKhoan()));

        benhNhan.setTaiKhoan(taiKhoan);

        return repository.save(benhNhan);
    }

    // 4. Sua thong tin benh nhan theo ma benh nhan
    @Transactional
    public BenhNhan sua(
            String maBenhNhan,
            BenhNhan benhNhanMoi) {

        BenhNhan benhNhanCu = timTheoId(maBenhNhan);

        benhNhanCu.setHoTen(benhNhanMoi.getHoTen());
        benhNhanCu.setNgaySinh(benhNhanMoi.getNgaySinh());
        benhNhanCu.setGioiTinh(benhNhanMoi.getGioiTinh());
        benhNhanCu.setSoDienThoai(benhNhanMoi.getSoDienThoai());
        benhNhanCu.setEmail(benhNhanMoi.getEmail());
        benhNhanCu.setDiaChi(benhNhanMoi.getDiaChi());
        benhNhanCu.capNhatTienSuBenh(benhNhanMoi.getTienSuBenh());
        benhNhanCu.capNhatDiUngThuoc(benhNhanMoi.getDiUngThuoc());

        return repository.save(benhNhanCu);
    }

    // 5. Tim benh nhan theo ID
    public BenhNhan timTheoId(String maBenhNhan) {

        return repository.findById(maBenhNhan)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy bệnh nhân với mã: "
                                + maBenhNhan));
    }

    // 6. Lay danh sach toan bo benh nhan
    public List<BenhNhan> layDanhSach() {
        return repository.findAll();
    }

    // 7. Xoa benh nhan theo ID
    @Transactional
    public void xoa(String maBenhNhan) {

        BenhNhan benhNhan = timTheoId(maBenhNhan);
        repository.delete(benhNhan);
    }

    // ==================================================
    // 8. BENH NHAN XAC NHAN LICH KHAM - GIU NGUYEN
    // ==================================================

    @Transactional
    public LichKhamBenhNhanResponse xacNhanLichKham(
            String tenDangNhap,
            String maLich) {

        LichKham lichKham = timLichCuaBenhNhan(
                tenDangNhap,
                maLich);

        lichKham.xacNhan();

        LichKham daLuu = lichKhamRepository.save(lichKham);

        return chuyenSangLichKhamResponse(daLuu);
    }

    // ==================================================
    // 9. BENH NHAN TU CHOI LICH KHAM
    // GIAI DOAN 3 - TU DONG DONG BO
    // ==================================================

    @Transactional
    public LichKhamBenhNhanResponse tuChoiLichKham(
            String tenDangNhap,
            String maLich,
            String lyDo) {

        // 1. Tim lich kham thuoc dung benh nhan
        LichKham lichKham = timLichCuaBenhNhan(
                tenDangNhap,
                maLich);

        // 2. Ghi nhan trang thai cu
        TrangThaiDatLich trangThaiCu = lichKham.getTrangThai();

        // 3. Giu nguyen logic tu choi cua nhom
        lichKham.tuChoi(lyDo);

        // 4. Luu trang thai lich kham
        LichKham daLuu = lichKhamRepository.save(lichKham);

        // 5. Phat su kien dong bo trong transaction
        //
        // Lich thong thuong: listener bo qua.
        //
        // Lich thuoc lo trinh:
        // LichKham DA_HUY
        // ↓
        // BuoiDieuTri LICH_DA_HUY
        //
        // Buoi van ton tai va co the dat lich moi.
        eventPublisher.publishEvent(
                new LichKhamTrangThaiThayDoiEvent(
                        daLuu.getMaLich(),
                        trangThaiCu,
                        daLuu.getTrangThai()));

        // 6. Tra ve response nhu logic cu
        return chuyenSangLichKhamResponse(daLuu);
    }

    // ==================================================
    // 10. KIEM TRA LICH THUOC BENH NHAN
    // GIU NGUYEN
    // ==================================================

    private LichKham timLichCuaBenhNhan(
            String tenDangNhap,
            String maLich) {

        LichKham lichKham = lichKhamRepository
                .findById(maLich)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy lịch khám: " + maLich));

        String tenChuSoHuu = lichKham
                .getBenhNhan()
                .getTaiKhoan()
                .getTenDangNhap();

        if (!tenChuSoHuu.equals(tenDangNhap)) {
            throw new IllegalArgumentException(
                    "Bạn không có quyền thao tác trên lịch khám này");
        }

        return lichKham;
    }

    // ==================================================
    // 11. LAY DANH SACH LICH KHAM CUA BENH NHAN
    // ==================================================

    @Transactional(readOnly = true)
    public List<LichKhamBenhNhanResponse> layDanhSachLichKham(String tenDangNhap) {
        // Xac minh benh nhan ton tai theo ten dang nhap
        timTheoTenDangNhap(tenDangNhap);

        return lichKhamRepository
                .findByBenhNhan_TaiKhoan_TenDangNhapOrderByNgayKhamDescGioBatDauDesc(tenDangNhap)
                .stream()
                .map(this::chuyenSangLichKhamResponse)
                .toList();
    }

    // ==================================================
    // 12. CHUYEN ENTITY SANG DTO
    // GIU NGUYEN
    // ==================================================

    private LichKhamBenhNhanResponse chuyenSangLichKhamResponse(
            LichKham lichKham) {

        return new LichKhamBenhNhanResponse(
                lichKham.getMaLich(),
                lichKham.getYeuCauGoc() != null
                        ? lichKham.getYeuCauGoc().getMaYeuCau()
                        : null,
                lichKham.getBacSi().getMaBacSi(),
                lichKham.getBacSi().getHoTen(),
                lichKham.getPhongKham().getMaPhong(),
                lichKham.getPhongKham().getTenPhong(),
                lichKham.getNgayKham(),
                lichKham.getGioBatDau(),
                lichKham.getGioKetThuc(),
                lichKham.getLyDoKham(),
                lichKham.getTrangThai(),
                lichKham.getLyDoHuyThayDoi(),
                lichKham.getThoiGianTao());
    }

    // ==================================================
    // 13. GIAI DOAN 4 - BENH NHAN XEM LO TRINH CUA MINH
    // ==================================================

    @Transactional(readOnly = true)
    public List<LoTrinhDieuTriResponse> layDanhSachLoTrinhCuaToi(String tenDangNhap) {
        BenhNhan benhNhan = timTheoTenDangNhap(tenDangNhap);

        return loTrinhDieuTriRepository
                .findByBenhNhan_MaBenhNhanOrderByThoiGianTaoDesc(benhNhan.getMaBenhNhan())
                .stream()
                .map(this::chuyenSangLoTrinhResponse)
                .toList();
    }

    // ==================================================
    // 14. GIAI DOAN 4 - BENH NHAN XEM BUOI CUA LO TRINH
    // BAO VE IDOR: XAC MINH QUYEN SO HUU
    // ==================================================

    @Transactional(readOnly = true)
    public List<BuoiDieuTriResponse> layDanhSachBuoiDieuTriCuaToi(String tenDangNhap, String maLoTrinh) {
        if (maLoTrinh == null || maLoTrinh.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã lộ trình không được để trống");
        }

        BenhNhan benhNhan = timTheoTenDangNhap(tenDangNhap);

        LoTrinhDieuTri loTrinh = loTrinhDieuTriRepository.findById(maLoTrinh.trim())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy lộ trình điều trị: " + maLoTrinh));

        // Kiểm tra quyền sở hữu IDOR
        if (loTrinh.getBenhNhan() == null
                || !loTrinh.getBenhNhan().getMaBenhNhan().equals(benhNhan.getMaBenhNhan())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Bạn không có quyền truy cập lộ trình điều trị này");
        }

        return buoiDieuTriRepository
                .findByLoTrinhDieuTri_MaLoTrinhDieuTriOrderBySoThuTuAsc(loTrinh.getMaLoTrinhDieuTri())
                .stream()
                .map(this::chuyenSangBuoiResponse)
                .toList();
    }

    // ==================================================
    // 15. CHUYEN LO TRINH SANG DTO RESPONSE
    // ==================================================

    private LoTrinhDieuTriResponse chuyenSangLoTrinhResponse(LoTrinhDieuTri loTrinh) {
        String maLoTrinh = loTrinh.getMaLoTrinhDieuTri();

        long tongBanGhi = buoiDieuTriRepository.countByLoTrinhDieuTri_MaLoTrinhDieuTri(maLoTrinh);
        long soBuoiDaBo = buoiDieuTriRepository.countByLoTrinhDieuTri_MaLoTrinhDieuTriAndTrangThai(
                maLoTrinh, TrangThaiBuoiDieuTri.DA_BO);
        long soBuoiHoanThanh = buoiDieuTriRepository.countByLoTrinhDieuTri_MaLoTrinhDieuTriAndTrangThai(
                maLoTrinh, TrangThaiBuoiDieuTri.HOAN_THANH);

        long tongSoBuoi = tongBanGhi - soBuoiDaBo;

        return new LoTrinhDieuTriResponse(
                loTrinh.getMaLoTrinhDieuTri(),
                loTrinh.getBenhNhan().getMaBenhNhan(),
                loTrinh.getLoTrinhMau() != null ? loTrinh.getLoTrinhMau().getMaLoTrinh() : null,
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

    // ==================================================
    // 16. CHUYEN BUOI DIEU TRI SANG DTO RESPONSE
    // ==================================================

    private BuoiDieuTriResponse chuyenSangBuoiResponse(BuoiDieuTri buoi) {
        String maLichKham = null;
        if (buoi.getLichKham() != null) {
            maLichKham = buoi.getLichKham().getMaLich();
        }

        return new BuoiDieuTriResponse(
                buoi.getMaBuoiDieuTri(),
                buoi.getLoTrinhDieuTri().getMaLoTrinhDieuTri(),
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
                buoi.getVersion(),
                maLichKham);
    }
}
