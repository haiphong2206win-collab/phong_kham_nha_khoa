package com.example.clinic.demo_phongkham_nhakhoa.repository;

import com.example.clinic.demo_phongkham_nhakhoa.entity.CaLamViec;
import com.example.clinic.demo_phongkham_nhakhoa.enums.CaKham;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface CaLamViecRepository extends JpaRepository<CaLamViec, String> {

    List<CaLamViec> findByBacSi_MaBacSi(String maBacSi);

    List<CaLamViec> findByNgayLamViec(LocalDate ngayLamViec);

    List<CaLamViec> findByNgayLamViecBetweenOrderByNgayLamViecAscGioBatDauAsc(LocalDate tuNgay, LocalDate denNgay);

    List<CaLamViec> findByBacSi_MaBacSiAndNgayLamViecBetweenOrderByNgayLamViecAscGioBatDauAsc(
            String maBacSi, LocalDate tuNgay, LocalDate denNgay
    );

    List<CaLamViec> findAllByOrderByNgayLamViecDescGioBatDauAsc();

    Optional<CaLamViec> findByBacSi_MaBacSiAndNgayLamViecAndCaKham(
            String maBacSi, LocalDate ngayLamViec, CaKham caKham
    );

    boolean existsByBacSi_MaBacSiAndNgayLamViecAndCaKham(
            String maBacSi, LocalDate ngayLamViec, CaKham caKham
    );
}
