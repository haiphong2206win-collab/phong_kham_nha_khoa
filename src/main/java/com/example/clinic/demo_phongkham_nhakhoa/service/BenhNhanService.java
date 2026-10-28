package com.example.clinic.demo_phongkham_nhakhoa.service;

import com.example.clinic.demo_phongkham_nhakhoa.dto.request.CapNhatHoSoBenhNhanRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.BenhNhanResponse;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.LichKhamBenhNhanResponse;
import com.example.clinic.demo_phongkham_nhakhoa.entity.BenhNhan;
import com.example.clinic.demo_phongkham_nhakhoa.entity.LichKham;
import com.example.clinic.demo_phongkham_nhakhoa.entity.TaiKhoan;
import com.example.clinic.demo_phongkham_nhakhoa.repository.BenhNhanRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.LichKhamRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.TaiKhoanRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BenhNhanService {

    private final BenhNhanRepository repository;

    private final TaiKhoanRepository taiKhoanRepository;

    private final LichKhamRepository lichKhamRepository;

    public BenhNhanService(BenhNhanRepository benhNhanRepository, TaiKhoanRepository taiKhoanRepository, LichKhamRepository lichKhamRepository) {
        this.repository = benhNhanRepository;
        this.taiKhoanRepository = taiKhoanRepository;
        this.lichKhamRepository = lichKhamRepository;
    }

    // Lấy hồ sơ bệnh nhân theo tên đăng nhập
    public BenhNhan timTheoTenDangNhap(String tenDangNhap) {
        return repository.findByTaiKhoan_TenDangNhap(tenDangNhap)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin bệnh nhân cho tài khoản: " + tenDangNhap));
    }

    // Bệnh nhân tự hoàn thiện / cập nhật hồ sơ cá nhân
    @Transactional
    public BenhNhan capNhatHoSo(String tenDangNhap, CapNhatHoSoBenhNhanRequest request) {
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

    // 3. Thêm bệnh nhân thủ công (Dành cho Quản lý / Bác sĩ chủ tạo hồ sơ hộ)
    @Transactional
    public BenhNhan them(BenhNhan benhNhan) {
        if (benhNhan.getTaiKhoan() == null || benhNhan.getTaiKhoan().getMaTaiKhoan() == null) {
            throw new IllegalArgumentException("Mã tài khoản liên kết không được để trống");
        }

        TaiKhoan taiKhoan = taiKhoanRepository.findById(benhNhan.getTaiKhoan().getMaTaiKhoan())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản liên kết: " + benhNhan.getTaiKhoan().getMaTaiKhoan()));

        benhNhan.setTaiKhoan(taiKhoan);
        return repository.save(benhNhan);
    }

    // 4. Sửa thông tin bệnh nhân theo mã bệnh nhân
    @Transactional
    public BenhNhan sua(String maBenhNhan, BenhNhan benhNhanMoi) {
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

    // 5. Tìm bệnh nhân theo ID (Bác sĩ chủ xem thông tin)
    public BenhNhan timTheoId(String maBenhNhan) {
        return repository.findById(maBenhNhan)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bệnh nhân với mã: " + maBenhNhan));
    }

    // 6. Lấy danh sách toàn bộ bệnh nhân
    public List<BenhNhan> layDanhSach() {
        return repository.findAll();
    }

    // 7. Xóa bệnh nhân theo ID
    @Transactional
    public void xoa(String maBenhNhan) {
        BenhNhan benhNhan = timTheoId(maBenhNhan);
        repository.delete(benhNhan);
    }


    // Bệnh nhân xác nhận lịch khám đã được phân công
    @Transactional
    public LichKhamBenhNhanResponse xacNhanLichKham(
            String tenDangNhap,
            String maLich
    ) {
        LichKham lichKham = timLichCuaBenhNhan(
                tenDangNhap,
                maLich
        );

        lichKham.xacNhan();

        LichKham daLuu = lichKhamRepository.save(lichKham);

        return chuyenSangLichKhamResponse(daLuu);
    }

    // Bệnh nhân từ chối lịch khám đã được phân công
    @Transactional
    public LichKhamBenhNhanResponse tuChoiLichKham(
            String tenDangNhap,
            String maLich,
            String lyDo
    ) {
        LichKham lichKham = timLichCuaBenhNhan(
                tenDangNhap,
                maLich
        );

        lichKham.tuChoi(lyDo);

        LichKham daLuu = lichKhamRepository.save(lichKham);

        return chuyenSangLichKhamResponse(daLuu);
    }

    // Chỉ cho phép bệnh nhân thao tác trên lịch của chính mình
    private LichKham timLichCuaBenhNhan(
            String tenDangNhap,
            String maLich
    ) {
        LichKham lichKham = lichKhamRepository.findById(maLich)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy lịch khám: " + maLich
                ));

        String tenChuSoHuu = lichKham.getBenhNhan()
                .getTaiKhoan()
                .getTenDangNhap();

        if (!tenChuSoHuu.equals(tenDangNhap)) {
            throw new IllegalArgumentException(
                    "Bạn không có quyền thao tác trên lịch khám này"
            );
        }

        return lichKham;
    }

    // Chuyển Entity thành DTO trả về cho bệnh nhân
    private LichKhamBenhNhanResponse chuyenSangLichKhamResponse(
            LichKham lichKham
    ) {
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
                lichKham.getThoiGianTao()
        );
    }

}
