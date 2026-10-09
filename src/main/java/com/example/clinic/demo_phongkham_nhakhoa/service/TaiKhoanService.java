package com.example.clinic.demo_phongkham_nhakhoa.service;

import com.example.clinic.demo_phongkham_nhakhoa.dto.request.ThongTinDangKiRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.request.ThongTinDangNhapRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.KetQuaXacThucResponse;
import com.example.clinic.demo_phongkham_nhakhoa.entity.BenhNhan;
import com.example.clinic.demo_phongkham_nhakhoa.entity.TaiKhoan;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiTaiKhoan;
import com.example.clinic.demo_phongkham_nhakhoa.enums.VaiTro;
import com.example.clinic.demo_phongkham_nhakhoa.repository.BenhNhanRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.TaiKhoanRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TaiKhoanService {

    private final TaiKhoanRepository repository;

    private final BenhNhanRepository benhNhanRepository;

    private final PasswordEncoder passwordEncoder;

    public TaiKhoanService(TaiKhoanRepository taiKhoanRepository, BenhNhanRepository benhNhanRepository, PasswordEncoder passwordEncoder) {
        this.repository = taiKhoanRepository;
        this.benhNhanRepository = benhNhanRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Đăng ký tài khoản Bệnh nhân mới
    @Transactional
    public KetQuaXacThucResponse dangKy(ThongTinDangKiRequest request) {
        if (repository.existsByTenDangNhap(request.getTenDangNhap())) {
            throw new IllegalArgumentException("Tên đăng nhập đã tồn tại trong hệ thống");
        }

        // Tạo mã ngẫu nhiên cho tài khoản
        String maTaiKhoan = "TK-" + UUID.randomUUID().toString().substring(0, 8);

        // Băm mật khẩu bằng BCrypt
        String matKhauMaHoa = passwordEncoder.encode(request.getMatKhau());

        TaiKhoan taiKhoan = new TaiKhoan(maTaiKhoan, request.getTenDangNhap(), matKhauMaHoa, VaiTro.BENH_NHAN);
        taiKhoan.setTrangThai(TrangThaiTaiKhoan.DANG_HOAT_DONG);
        taiKhoan.setNgayTao(LocalDateTime.now());
        repository.save(taiKhoan);

        // Tạo sẵn bản ghi Bệnh nhân rỗng gắn với tài khoản này
        String maBenhNhan = "BN-" + UUID.randomUUID().toString().substring(0, 8);
        BenhNhan benhNhan = new BenhNhan();
        benhNhan.setMaBenhNhan(maBenhNhan);
        benhNhan.setTaiKhoan(taiKhoan);
        benhNhan.setHoTen("");
        benhNhan.setNgaySinh(LocalDate.of(2000, 1, 1));
        benhNhan.setSoDienThoai("");
        benhNhanRepository.save(benhNhan);

        // Giả lập chuỗi token giả định (ở Bước Security ta sẽ gắn JWT thật vào đây)
        String token = "JWT-TOKEN- gia-lap-cho-" + taiKhoan.getTenDangNhap();

        return new KetQuaXacThucResponse(token, maTaiKhoan, taiKhoan.getTenDangNhap(), taiKhoan.getVaiTro().name());
    }

    // Đăng nhập
    public KetQuaXacThucResponse dangNhap(ThongTinDangNhapRequest request) {
        TaiKhoan taiKhoan = repository.findByTenDangNhap(request.getTenDangNhap())
                .orElseThrow(() -> new IllegalArgumentException("Tên đăng nhập hoặc mật khẩu không chính xác"));

        if (!passwordEncoder.matches(request.getMatKhau(), taiKhoan.getMatKhau())) {
            throw new IllegalArgumentException("Tên đăng nhập hoặc mật khẩu không chính xác");
        }

        if (!taiKhoan.dangHoatDong()) {
            throw new IllegalStateException("Tài khoản đã bị khóa");
        }

        String token = "JWT-TOKEN-gia-lap-cho-" + taiKhoan.getTenDangNhap();

        return new KetQuaXacThucResponse(token, taiKhoan.getMaTaiKhoan(), taiKhoan.getTenDangNhap(), taiKhoan.getVaiTro().name());
    }

    // 3. Thêm tài khoản quản trị (Bác sĩ / Bác sĩ chủ) - Băm mật khẩu đầy đủ
    @Transactional
    public TaiKhoan them(TaiKhoan taiKhoan) {
        if (repository.existsByTenDangNhap(taiKhoan.getTenDangNhap())) {
            throw new IllegalArgumentException("Tên đăng nhập đã tồn tại trong hệ thống");
        }

        if (taiKhoan.getMaTaiKhoan() == null || taiKhoan.getMaTaiKhoan().isBlank()) {
            taiKhoan.setMaTaiKhoan("TK-" + UUID.randomUUID().toString().substring(0, 8));
        }

        // Băm mật khẩu trước khi lưu DB
        taiKhoan.doiMatKhau(passwordEncoder.encode(taiKhoan.getMatKhau()));
        taiKhoan.setNgayTao(LocalDateTime.now());
        if (taiKhoan.getTrangThai() == null) {
            taiKhoan.setTrangThai(TrangThaiTaiKhoan.DANG_HOAT_DONG);
        }

        return repository.save(taiKhoan);
    }

    // 4. Sửa thông tin tài khoản (Có kiểm tra băm mật khẩu mới nếu thay đổi)
    @Transactional
    public TaiKhoan sua(TaiKhoan taiKhoan) {
        TaiKhoan taiKhoanCu = timTheoId(taiKhoan.getMaTaiKhoan());

        if (taiKhoan.getMatKhau() != null && !taiKhoan.getMatKhau().isBlank()) {
            taiKhoanCu.doiMatKhau(passwordEncoder.encode(taiKhoan.getMatKhau()));
        }
        if (taiKhoan.getVaiTro() != null) {
            taiKhoanCu.setVaiTro(taiKhoan.getVaiTro());
        }
        if (taiKhoan.getTrangThai() != null) {
            taiKhoanCu.setTrangThai(taiKhoan.getTrangThai());
        }

        return repository.save(taiKhoanCu);
    }

    // 5. Khóa / Bật tài khoản
    @Transactional
    public void doitrangThai(String maTaiKhoan, boolean khoa) {
        TaiKhoan taiKhoan = timTheoId(maTaiKhoan);
        if (khoa) {
            taiKhoan.khoa();
        } else {
            taiKhoan.kichHoat();
        }
        repository.save(taiKhoan);
    }

    // 6. Tìm tài khoản theo ID
    public TaiKhoan timTheoId(String maTaiKhoan) {
        return repository.findById(maTaiKhoan)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản với mã: " + maTaiKhoan));
    }

    // 7. Lấy danh sách toàn bộ tài khoản
    public List<TaiKhoan> layDanhSach() {
        return repository.findAll();
    }

    // 8. Xóa tài khoản
    @Transactional
    public void xoa(String maTaiKhoan) {
        TaiKhoan taiKhoan = timTheoId(maTaiKhoan);
        repository.delete(taiKhoan);
    }
}
