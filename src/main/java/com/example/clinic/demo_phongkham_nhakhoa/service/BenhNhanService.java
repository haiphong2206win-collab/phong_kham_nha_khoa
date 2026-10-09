package com.example.clinic.demo_phongkham_nhakhoa.service;

import com.example.clinic.demo_phongkham_nhakhoa.dto.request.CapNhatHoSoBenhNhanRequest;
import com.example.clinic.demo_phongkham_nhakhoa.entity.BenhNhan;
import com.example.clinic.demo_phongkham_nhakhoa.entity.TaiKhoan;
import com.example.clinic.demo_phongkham_nhakhoa.repository.BenhNhanRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.TaiKhoanRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BenhNhanService {

    private final BenhNhanRepository repository;

    private final TaiKhoanRepository taiKhoanRepository;

    public BenhNhanService(BenhNhanRepository benhNhanRepository, TaiKhoanRepository taiKhoanRepository) {
        this.repository = benhNhanRepository;
        this.taiKhoanRepository = taiKhoanRepository;
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
}
