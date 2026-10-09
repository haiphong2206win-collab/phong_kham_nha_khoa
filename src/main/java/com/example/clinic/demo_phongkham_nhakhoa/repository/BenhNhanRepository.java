package com.example.clinic.demo_phongkham_nhakhoa.repository;

import com.example.clinic.demo_phongkham_nhakhoa.entity.BenhNhan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BenhNhanRepository extends JpaRepository<BenhNhan, String> {

    // Tìm bệnh nhân dựa theo tên đăng nhập của tài khoản
    Optional<BenhNhan> findByTaiKhoan_TenDangNhap(String tenDangNhap);
}
