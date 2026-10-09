package com.example.clinic.demo_phongkham_nhakhoa.repository;

import com.example.clinic.demo_phongkham_nhakhoa.entity.YeuCauDatLich;
import com.example.clinic.demo_phongkham_nhakhoa.enums.CaKham;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiYeuCau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface YeuCauDatLichRepository extends JpaRepository<YeuCauDatLich, String> {

    // Lấy danh sách yêu cầu của 1 bệnh nhân, sắp xếp mới nhất lên đầu
    List<YeuCauDatLich> findByBenhNhan_MaBenhNhanOrderByThoiGianGuiDesc(String maBenhNhan);

    // Kiểm tra bệnh nhân đã có yêu cầu active (chờ phân công / đã phân công) trùng ngày + ca khám chưa
    @Query("SELECT COUNT(y) > 0 FROM YeuCauDatLich y " +
            "WHERE y.benhNhan.maBenhNhan = :maBenhNhan " +
            "AND y.ngayMongMuon = :ngay " +
            "AND y.caKham = :ca " +
            "AND y.trangThai IN (:trangThais)")
    boolean tonTaiYeuCauHoatDong(@Param("maBenhNhan") String maBenhNhan,
                                 @Param("ngay") LocalDate ngay,
                                 @Param("ca") CaKham ca,
                                 @Param("trangThais") List<TrangThaiYeuCau> trangThais);
}
