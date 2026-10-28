package com.example.clinic.demo_phongkham_nhakhoa.repository;

import com.example.clinic.demo_phongkham_nhakhoa.entity.TaiKhoan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TaiKhoanRepository extends JpaRepository<TaiKhoan, String> {

    // Tìm tài khoản theo tên đăng nhập để làm chức năng Đăng nhập / Load User
    Optional<TaiKhoan> findByTenDangNhap(String tenDangNhap);

    // Kiểm tra trùng tên đăng nhập khi Bệnh nhân đăng ký
    boolean existsByTenDangNhap(String tenDangNhap);
}
