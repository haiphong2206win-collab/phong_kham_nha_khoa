
package com.example.clinic.demo_phongkham_nhakhoa.repository;

import com.example.clinic.demo_phongkham_nhakhoa.entity.BuoiMau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BuoiMauRepository
        extends JpaRepository<BuoiMau, String> {

    // Lấy các buổi thuộc một lộ trình,
    // sắp xếp tăng dần theo số thứ tự.
    List<BuoiMau> findByLoTrinhMau_MaLoTrinhOrderBySoThuTuAsc(
            String maLoTrinh);

    // Đếm số buổi thuộc một lộ trình.
    long countByLoTrinhMau_MaLoTrinh(
            String maLoTrinh);
}
