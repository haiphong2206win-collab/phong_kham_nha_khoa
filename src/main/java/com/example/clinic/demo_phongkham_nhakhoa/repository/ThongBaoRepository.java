package com.example.clinic.demo_phongkham_nhakhoa.repository;

import com.example.clinic.demo_phongkham_nhakhoa.entity.ThongBao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ThongBaoRepository
        extends JpaRepository<ThongBao, String> {

    List<ThongBao> findByTaiKhoan_TenDangNhapOrderByThoiGianTaoDesc(
            String tenDangNhap
    );

    long countByTaiKhoan_TenDangNhapAndDaDocFalse(
            String tenDangNhap
    );

    Optional<ThongBao> findByMaThongBaoAndTaiKhoan_TenDangNhap(
            String maThongBao,
            String tenDangNhap
    );
}
