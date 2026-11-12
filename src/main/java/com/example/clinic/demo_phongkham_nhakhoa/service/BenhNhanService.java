
package com.example.clinic.demo_phongkham_nhakhoa.service;

import com.example.clinic.demo_phongkham_nhakhoa.dto.request.CapNhatHoSoBenhNhanRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.LichKhamBenhNhanResponse;
import com.example.clinic.demo_phongkham_nhakhoa.entity.BenhNhan;
import com.example.clinic.demo_phongkham_nhakhoa.entity.LichKham;
import com.example.clinic.demo_phongkham_nhakhoa.entity.TaiKhoan;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiDatLich;
import com.example.clinic.demo_phongkham_nhakhoa.event.LichKhamTrangThaiThayDoiEvent;
import com.example.clinic.demo_phongkham_nhakhoa.repository.BenhNhanRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.LichKhamRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.TaiKhoanRepository;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BenhNhanService {

    private final BenhNhanRepository repository;

    private final TaiKhoanRepository taiKhoanRepository;

    private final LichKhamRepository lichKhamRepository;

    // GIAI DOAN 3 - Bo sung bo phat su kien
    private final ApplicationEventPublisher eventPublisher;

    public BenhNhanService(
            BenhNhanRepository benhNhanRepository,
            TaiKhoanRepository taiKhoanRepository,
            LichKhamRepository lichKhamRepository,
            ApplicationEventPublisher eventPublisher) {

        this.repository = benhNhanRepository;
        this.taiKhoanRepository = taiKhoanRepository;
        this.lichKhamRepository = lichKhamRepository;
        this.eventPublisher = eventPublisher;
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
    // 11. CHUYEN ENTITY SANG DTO
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
}
