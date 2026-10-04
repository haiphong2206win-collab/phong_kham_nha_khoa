package com.example.clinic.demo_phongkham_nhakhoa.service;

import com.example.clinic.demo_phongkham_nhakhoa.entity.TaiKhoan;
import com.example.clinic.demo_phongkham_nhakhoa.repository.TaiKhoanRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaiKhoanService {

    private final TaiKhoanRepository repository;

    public TaiKhoanService(TaiKhoanRepository taiKhoanRepository) {
        this.repository = taiKhoanRepository;
    }

    // Them tai khoan
    public TaiKhoan them(TaiKhoan taiKhoan) {
        taiKhoan.setNgayTao(LocalDateTime.now());
        return repository.save(taiKhoan);
    }

    // Sua tai khoan
    public TaiKhoan sua(TaiKhoan taiKhoan) {

        TaiKhoan taiKhoanCu = repository.findById(taiKhoan.getMaTaiKhoan()).orElse(null);

        if(taiKhoanCu == null) {
            throw new RuntimeException("Khong tim thay tai khoan voi ma: " + taiKhoan.getMaTaiKhoan());
        }

        if (taiKhoan.getTenDangNhap() != null) {
            taiKhoanCu.setTenDangNhap(taiKhoan.getTenDangNhap());
        }
        if (taiKhoan.getMatKhau() != null) {
            taiKhoanCu.setMatKhau(taiKhoan.getMatKhau());
        }
        if (taiKhoan.getVaiTro() != null) {
            taiKhoanCu.setVaiTro(taiKhoan.getVaiTro());
        }
        if (taiKhoan.getTrangThai() != null) {
            taiKhoanCu.setTrangThai(taiKhoan.getTrangThai());
        }
        // 3. Luu doi tuong cu da cap nhat
        return repository.save(taiKhoanCu);
    }

    // Xoa tai khoan theo maTaiKhoan
    public void xoa(String maTaiKhoan) {
        repository.deleteById(maTaiKhoan);
    }

    // Tim tai khoan theo maTaiKhoan
    public TaiKhoan timTheoId(String maTaiKhoan) {
        return repository.findById(maTaiKhoan).orElse(null);
    }

    // Lay danh sach tai khoan
    public List<TaiKhoan> layDanhSach() {
        return repository.findAll();
    }
}
