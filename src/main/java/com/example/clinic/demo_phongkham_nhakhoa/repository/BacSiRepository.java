package com.example.clinic.demo_phongkham_nhakhoa.repository;

import com.example.clinic.demo_phongkham_nhakhoa.entity.BacSi;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BacSiRepository extends JpaRepository<BacSi, String> {
    Optional<BacSi> findByTaiKhoan_MaTaiKhoan(String maTaiKhoan);

    Optional<BacSi> findByTaiKhoan_TenDangNhap(String tenDangNhap);
}
