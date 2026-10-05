package com.example.clinic.demo_phongkham_nhakhoa.appointment.repository;

//Repository dùng để đọc và lưu lịch khám trong cơ sở dữ liệu H2.

/* api 
GET    /api/v1/appointments/me
GET    /api/v1/doctors/me/appointments
GET    /api/v1/appointments/{id}
PATCH  /api/v1/appointments/{id}/confirm
PATCH  /api/v1/appointments/{id}/request-change
PATCH  /api/v1/appointments/{id}/cancel
PATCH  /api/v1/management/appointments/{id}/reschedule

*/

import com.example.clinic.demo_phongkham_nhakhoa.appointment.entity.LichKham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
// LichKham: lớp Entity được Repository quản lý.
// Nhờ kế thừa JpaRepository, bạn đã có sẵn
// JpaRepository cung cấp sẵn save(), findById(), findAll(), deleteById()...
public interface LichKhamRepository extends JpaRepository<LichKham, String> {

        boolean existsByYeuCauDatLichId(String yeuCauDatLichId);

        Optional<LichKham> findByYeuCauDatLichId(String yeuCauDatLichId);

        Optional<LichKham> findByMaLichAndBenhNhanId(
                        String maLich,
                        String benhNhanId);

        Optional<LichKham> findByMaLichAndBacSiId(
                        String maLich,
                        String bacSiId);

        // Lấy toàn bộ lịch khám của bệnh nhân.=> Lịch mới nhất được đưa lên trước.
        List<LichKham> findByBenhNhanIdOrderByNgayKhamDescGioBatDauDesc(
                        String benhNhanId);

        List<LichKham> findByBacSiIdAndNgayKhamOrderByGioBatDauAsc(
                        String bacSiId,
                        LocalDate ngayKham);

        List<LichKham> findByPhongIdAndNgayKhamOrderByGioBatDauAsc(
                        String phongId,
                        LocalDate ngayKham);

        List<LichKham> findByBacSiIdAndNgayKhamGreaterThanEqualOrderByNgayKhamAscGioBatDauAsc(
                        String bacSiId,
                        LocalDate tuNgay);

        // Lấy toàn bộ lịch khám trong một ngày.
        // Người quản lý có thể dùng để xem lịch làm việc chung của phòng khám.
        List<LichKham> findByNgayKhamOrderByGioBatDauAsc(
                        LocalDate ngayKham);
}
