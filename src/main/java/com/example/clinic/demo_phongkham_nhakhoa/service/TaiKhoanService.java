package com.example.clinic.demo_phongkham_nhakhoa.service;

import com.example.clinic.demo_phongkham_nhakhoa.dto.request.CapNhatTaiKhoanRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.request.TaoTaiKhoanBacSiRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.request.TaoTaiKhoanBenhNhanRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.request.ThongTinDangKiRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.request.ThongTinDangNhapRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.KetQuaXacThucResponse;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.TaiKhoanQuanLyResponse;
import com.example.clinic.demo_phongkham_nhakhoa.entity.BacSi;
import com.example.clinic.demo_phongkham_nhakhoa.entity.BenhNhan;
import com.example.clinic.demo_phongkham_nhakhoa.entity.TaiKhoan;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiTaiKhoan;
import com.example.clinic.demo_phongkham_nhakhoa.enums.VaiTro;
import com.example.clinic.demo_phongkham_nhakhoa.repository.BacSiRepository;
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
    private final BacSiRepository bacSiRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public TaiKhoanService(
            TaiKhoanRepository taiKhoanRepository,
            BenhNhanRepository benhNhanRepository,
            BacSiRepository bacSiRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.repository = taiKhoanRepository;
        this.benhNhanRepository = benhNhanRepository;
        this.bacSiRepository = bacSiRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // ==================== ĐĂNG KÝ ====================

    @Transactional
    public KetQuaXacThucResponse dangKy(
            ThongTinDangKiRequest request) {

        kiemTraTenDangNhapChuaTonTai(request.getTenDangNhap());

        TaiKhoan taiKhoan = taoTaiKhoanMoi(
                request.getTenDangNhap(),
                request.getMatKhau(),
                VaiTro.BENH_NHAN
        );

        taiKhoan = repository.save(taiKhoan);

        // Giữ nguyên nghiệp vụ đăng ký hiện tại:
        // tạo hồ sơ bệnh nhân để người dùng cập nhật sau.
        BenhNhan benhNhan = new BenhNhan();
        benhNhan.setMaBenhNhan(
                "BN-" + UUID.randomUUID().toString().substring(0, 8));
        benhNhan.setTaiKhoan(taiKhoan);
        benhNhan.setHoTen("");
        benhNhan.setNgaySinh(LocalDate.of(2000, 1, 1));
        benhNhan.setSoDienThoai("");

        benhNhanRepository.save(benhNhan);

        String token = jwtService.taoToken(
                taiKhoan.getTenDangNhap(),
                taiKhoan.getVaiTro().name()
        );

        return new KetQuaXacThucResponse(
                token,
                taiKhoan.getMaTaiKhoan(),
                taiKhoan.getTenDangNhap(),
                taiKhoan.getVaiTro().name()
        );
    }

    // ==================== ĐĂNG NHẬP ====================

    public KetQuaXacThucResponse dangNhap(
            ThongTinDangNhapRequest request) {

        TaiKhoan taiKhoan = repository
                .findByTenDangNhap(request.getTenDangNhap())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Tên đăng nhập hoặc mật khẩu không chính xác"));


        if (!passwordEncoder.matches(
                request.getMatKhau(), taiKhoan.getMatKhau())) {

            throw new IllegalArgumentException(
                    "Tên đăng nhập hoặc mật khẩu không chính xác");
        }

        if (!taiKhoan.dangHoatDong()) {
            throw new IllegalStateException("Tài khoản đã bị khóa");
        }

        String token = jwtService.taoToken(
                taiKhoan.getTenDangNhap(),
                taiKhoan.getVaiTro().name()
        );

        return new KetQuaXacThucResponse(
                token,
                taiKhoan.getMaTaiKhoan(),
                taiKhoan.getTenDangNhap(),
                taiKhoan.getVaiTro().name()
        );
    }

    // ==================== TẠO TÀI KHOẢN ====================

    @Transactional
    public TaiKhoanQuanLyResponse taoTaiKhoanBenhNhan(
            TaoTaiKhoanBenhNhanRequest request) {

        kiemTraTenDangNhapChuaTonTai(request.getTenDangNhap());

        TaiKhoan taiKhoan = taoTaiKhoanMoi(
                request.getTenDangNhap(),
                request.getMatKhau(),
                VaiTro.BENH_NHAN
        );

        taiKhoan = repository.save(taiKhoan);

        BenhNhan benhNhan = new BenhNhan();
        benhNhan.setMaBenhNhan(
                "BN-" + UUID.randomUUID().toString().substring(0, 8));
        benhNhan.setTaiKhoan(taiKhoan);
        benhNhan.setHoTen(request.getHoTen().trim());
        benhNhan.setNgaySinh(request.getNgaySinh());
        benhNhan.setGioiTinh(request.getGioiTinh());
        benhNhan.setSoDienThoai(request.getSoDienThoai().trim());
        benhNhan.setEmail(request.getEmail());
        benhNhan.setDiaChi(request.getDiaChi());

        benhNhanRepository.save(benhNhan);

        return chuyenSangTaiKhoanQuanLyResponse(taiKhoan);
    }

    @Transactional
    public TaiKhoanQuanLyResponse taoTaiKhoanBacSi(
            TaoTaiKhoanBacSiRequest request) {

        kiemTraTenDangNhapChuaTonTai(request.getTenDangNhap());

        TaiKhoan taiKhoan = taoTaiKhoanMoi(
                request.getTenDangNhap(),
                request.getMatKhau(),
                VaiTro.BAC_SI
        );

        taiKhoan = repository.save(taiKhoan);

        BacSi bacSi = new BacSi();
        bacSi.setMaBacSi(
                "BS-" + UUID.randomUUID().toString().substring(0, 8));
        bacSi.setTaiKhoan(taiKhoan);
        bacSi.setHoTen(request.getHoTen().trim());
        bacSi.setSoDienThoai(request.getSoDienThoai());
        bacSi.setSoChungChi(request.getSoChungChi());
        bacSi.setDangLamViec(true);

        bacSiRepository.save(bacSi);

        return chuyenSangTaiKhoanQuanLyResponse(taiKhoan);
    }

    // ==================== XEM TÀI KHOẢN ====================

    public List<TaiKhoanQuanLyResponse> layDanhSach(
            VaiTro vaiTro,
            TrangThaiTaiKhoan trangThai) {

        return repository.findAll()
                .stream()
                .filter(tk ->
                        vaiTro == null || tk.getVaiTro() == vaiTro)
                .filter(tk ->
                        trangThai == null
                                || tk.getTrangThai() == trangThai)
                .map(this::chuyenSangTaiKhoanQuanLyResponse)
                .toList();
    }

    public TaiKhoanQuanLyResponse timTaiKhoanQuanLyTheoId(
            String maTaiKhoan) {

        return chuyenSangTaiKhoanQuanLyResponse(
                timTheoId(maTaiKhoan));
    }

    // ==================== CẬP NHẬT TÀI KHOẢN ====================

    @Transactional
    public TaiKhoanQuanLyResponse capNhatTaiKhoan(
            String maTaiKhoan,
            CapNhatTaiKhoanRequest request,
            String tenDangNhapNguoiGoi) {

        TaiKhoan taiKhoan = timTheoId(maTaiKhoan);

        if (taiKhoan.getTenDangNhap().equals(tenDangNhapNguoiGoi)) {
            throw new IllegalArgumentException(
                    "Không thể sửa tài khoản đang đăng nhập bằng API quản lý");
        }

        if (taiKhoan.coVaiTro(VaiTro.CHU_PHONG_KHAM)) {
            throw new IllegalArgumentException(
                    "Không thể sửa tài khoản chủ phòng khám bằng API này");
        }

        String tenDangNhapMoi = request.getTenDangNhap();

        String matKhauMoi = request.getMatKhauMoi();

        boolean coTenDangNhap =
                tenDangNhapMoi != null && !tenDangNhapMoi.isBlank();

        boolean coMatKhau =
                matKhauMoi != null && !matKhauMoi.isBlank();

        if (!coTenDangNhap && !coMatKhau) {
            throw new IllegalArgumentException(
                    "Cần cung cấp tên đăng nhập mới hoặc mật khẩu mới");
        }

        if (coTenDangNhap) {
            String tenDaChuanHoa = tenDangNhapMoi.trim();

            repository.findByTenDangNhap(tenDaChuanHoa)
                    .filter(tk ->
                            !tk.getMaTaiKhoan().equals(maTaiKhoan))
                    .ifPresent(tk -> {
                        throw new IllegalArgumentException(
                                "Tên đăng nhập đã tồn tại trong hệ thống");
                    });

            taiKhoan.setTenDangNhap(tenDaChuanHoa);
        }

        if (coMatKhau) {
            taiKhoan.doiMatKhau(
                    passwordEncoder.encode(matKhauMoi));
        }

        repository.save(taiKhoan);

        return chuyenSangTaiKhoanQuanLyResponse(taiKhoan);
    }

    // ==================== KHÓA / KÍCH HOẠT ====================

    @Transactional
    public TaiKhoanQuanLyResponse capNhatTrangThai(
            String maTaiKhoan,
            boolean dangHoatDong,
            String tenDangNhapNguoiGoi) {

        TaiKhoan taiKhoan = timTheoId(maTaiKhoan);

        if (taiKhoan.getTenDangNhap().equals(tenDangNhapNguoiGoi)) {
            throw new IllegalArgumentException(
                    "Không thể khóa tài khoản đang đăng nhập");
        }

        if (taiKhoan.coVaiTro(VaiTro.CHU_PHONG_KHAM)) {
            throw new IllegalArgumentException(
                    "Không thể khóa tài khoản chủ phòng khám bằng API này");
        }

        if (dangHoatDong) {
            taiKhoan.kichHoat();
        } else {
            taiKhoan.khoa();
        }

        repository.save(taiKhoan);

        return chuyenSangTaiKhoanQuanLyResponse(taiKhoan);
    }

    // ==================== XÓA MỀM ====================

    @Transactional
    public void xoaMem(
            String maTaiKhoan,
            String tenDangNhapNguoiGoi) {

        TaiKhoan taiKhoan = timTheoId(maTaiKhoan);

        if (taiKhoan.getTenDangNhap().equals(tenDangNhapNguoiGoi)) {
            throw new IllegalArgumentException(
                    "Không thể xóa tài khoản đang đăng nhập");
        }

        if (taiKhoan.coVaiTro(VaiTro.CHU_PHONG_KHAM)) {
            throw new IllegalArgumentException(
                    "Không thể xóa tài khoản chủ phòng khám bằng API này");
        }

        taiKhoan.khoa();

        repository.save(taiKhoan);
    }

    // ==================== HÀM DÙNG CHUNG ====================

    private TaiKhoan taoTaiKhoanMoi(
            String tenDangNhap,
            String matKhau,
            VaiTro vaiTro) {

        TaiKhoan taiKhoan = new TaiKhoan(
                "TK-" + UUID.randomUUID().toString().substring(0, 8),
                tenDangNhap.trim(),
                passwordEncoder.encode(matKhau),
                vaiTro
        );

        taiKhoan.setTrangThai(TrangThaiTaiKhoan.DANG_HOAT_DONG);
        taiKhoan.setNgayTao(LocalDateTime.now());

        return taiKhoan;
    }

    private void kiemTraTenDangNhapChuaTonTai(
            String tenDangNhap) {

        if (repository.existsByTenDangNhap(tenDangNhap.trim())) {
            throw new IllegalArgumentException(
                    "Tên đăng nhập đã tồn tại trong hệ thống");
        }
    }

    private TaiKhoanQuanLyResponse chuyenSangTaiKhoanQuanLyResponse(
            TaiKhoan taiKhoan) {

        String maHoSo = null;
        String hoTen = null;
        String soDienThoai = null;

        if (taiKhoan.coVaiTro(VaiTro.BENH_NHAN)) {
            var ketQua = benhNhanRepository
                    .findByTaiKhoan_MaTaiKhoan(
                            taiKhoan.getMaTaiKhoan());

            if (ketQua.isPresent()) {
                BenhNhan benhNhan = ketQua.get();

                maHoSo = benhNhan.getMaBenhNhan();
                hoTen = benhNhan.getHoTen();
                soDienThoai = benhNhan.getSoDienThoai();
            }

        } else if (taiKhoan.coVaiTro(VaiTro.BAC_SI)) {
            var ketQua = bacSiRepository
                    .findByTaiKhoan_MaTaiKhoan(
                            taiKhoan.getMaTaiKhoan());

            if (ketQua.isPresent()) {
                BacSi bacSi = ketQua.get();

                maHoSo = bacSi.getMaBacSi();
                hoTen = bacSi.getHoTen();
                soDienThoai = bacSi.getSoDienThoai();
            }
        }

        return new TaiKhoanQuanLyResponse(
                taiKhoan.getMaTaiKhoan(),
                taiKhoan.getTenDangNhap(),
                taiKhoan.getVaiTro(),
                taiKhoan.getTrangThai(),
                taiKhoan.getNgayTao(),
                maHoSo,
                hoTen,
                soDienThoai
        );
    }

    public TaiKhoan timTheoId(String maTaiKhoan) {
        return repository.findById(maTaiKhoan)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy tài khoản với mã: " + maTaiKhoan));
    }
}