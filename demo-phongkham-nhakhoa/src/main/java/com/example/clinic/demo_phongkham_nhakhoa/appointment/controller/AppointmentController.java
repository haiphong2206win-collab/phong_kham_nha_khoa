package com.example.clinic.demo_phongkham_nhakhoa.appointment.controller;

// Controller cung cấp API quản lý lịch khám.
import com.example.clinic.demo_phongkham_nhakhoa.appointment.dto.request.CancelAppointmentRequest;
import com.example.clinic.demo_phongkham_nhakhoa.appointment.dto.request.RequestChangeAppointmentRequest;
import com.example.clinic.demo_phongkham_nhakhoa.appointment.dto.request.RescheduleAppointmentRequest;
import com.example.clinic.demo_phongkham_nhakhoa.appointment.dto.response.AppointmentResponse;
import com.example.clinic.demo_phongkham_nhakhoa.appointment.service.AppointmentService;

import jakarta.validation.Valid;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(
            AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // Bệnh nhân xem toàn bộ lịch khám của mình.
    // GET /api/v1/appointments/me

    @GetMapping("/appointments/me")
    public ResponseEntity<List<AppointmentResponse>> layLichCuaBenhNhan(
            @RequestHeader("X-Benh-Nhan-Id") String benhNhanId) {
        return ResponseEntity.ok(
                appointmentService.layLichCuaBenhNhan(
                        benhNhanId));
    }

    // Bệnh nhân xem chi tiết một lịch thuộc về mình.
    // GET /api/v1/appointments/{id}
    @GetMapping("/appointments/{id}")
    public ResponseEntity<AppointmentResponse> xemChiTietLichCuaBenhNhan(
            @PathVariable("id") String maLich,

            @RequestHeader("X-Benh-Nhan-Id") String benhNhanId) {
        return ResponseEntity.ok(
                appointmentService.xemChiTietCuaBenhNhan(
                        maLich,
                        benhNhanId));
    }

    // Bệnh nhân xác nhận lịch.
    // PATCH /api/v1/appointments/{id}/confirm
    @PatchMapping("/appointments/{id}/confirm")
    public ResponseEntity<AppointmentResponse> xacNhanLich(
            @PathVariable("id") String maLich,

            @RequestHeader("X-Benh-Nhan-Id") String benhNhanId) {
        return ResponseEntity.ok(
                appointmentService.xacNhanLich(
                        maLich,
                        benhNhanId));
    }

    // Bệnh nhân yêu cầu đổi lịch.
    // PATCH /api/v1/appointments/{id}/request-change
    @PatchMapping("/appointments/{id}/request-change")
    public ResponseEntity<AppointmentResponse> yeuCauDoiLich(
            @PathVariable("id") String maLich,

            @RequestHeader("X-Benh-Nhan-Id") String benhNhanId,

            @Valid @RequestBody RequestChangeAppointmentRequest request) {
        return ResponseEntity.ok(
                appointmentService.yeuCauDoiLich(
                        maLich,
                        benhNhanId,
                        request));
    }

    // Bệnh nhân hủy lịch.
    // PATCH /api/v1/appointments/{id}/cancel
    @PatchMapping("/appointments/{id}/cancel")
    public ResponseEntity<AppointmentResponse> huyLich(
            @PathVariable("id") String maLich,

            @RequestHeader("X-Benh-Nhan-Id") String benhNhanId,

            @Valid @RequestBody CancelAppointmentRequest request) {
        return ResponseEntity.ok(
                appointmentService.huyLich(
                        maLich,
                        benhNhanId,
                        request));
    }

    // Bác sĩ xem những lịch hiện tại và sắp tới.
    // GET /api/v1/doctors/me/appointments
    @GetMapping("/doctors/me/appointments")
    public ResponseEntity<List<AppointmentResponse>> layLichCuaBacSi(
            @RequestHeader("X-Bac-Si-Id") String bacSiId) {
        return ResponseEntity.ok(
                appointmentService.layLichSapToiCuaBacSi(
                        bacSiId));
    }

    // Bác sĩ xem chi tiết lịch được phân công cho mình.
    // GET /api/v1/doctors/me/appointments/{id}
    @GetMapping("/doctors/me/appointments/{id}")
    public ResponseEntity<AppointmentResponse> xemChiTietLichCuaBacSi(
            @PathVariable("id") String maLich,

            @RequestHeader("X-Bac-Si-Id") String bacSiId) {
        return ResponseEntity.ok(
                appointmentService.xemChiTietCuaBacSi(
                        maLich,
                        bacSiId));
    }

    // Bác sĩ bắt đầu khám.
    // PATCH /api/v1/doctors/me/appointments/{id}/start
    @PatchMapping("/doctors/me/appointments/{id}/start")
    public ResponseEntity<AppointmentResponse> batDauKham(
            @PathVariable("id") String maLich,

            @RequestHeader("X-Bac-Si-Id") String bacSiId) {
        return ResponseEntity.ok(
                appointmentService.batDauKham(
                        maLich,
                        bacSiId));
    }

    // Bác sĩ hoàn thành buổi khám.
    // PATCH /api/v1/doctors/me/appointments/{id}/complete
    @PatchMapping("/doctors/me/appointments/{id}/complete")
    public ResponseEntity<AppointmentResponse> hoanThanhKham(
            @PathVariable("id") String maLich,

            @RequestHeader("X-Bac-Si-Id") String bacSiId) {
        return ResponseEntity.ok(
                appointmentService.hoanThanhKham(
                        maLich,
                        bacSiId));
    }

    // Chủ phòng khám xem lịch trong một ngày.
    // GET /api/v1/management/appointments?date=
    @GetMapping("/management/appointments")
    public ResponseEntity<List<AppointmentResponse>> layLichTrongNgay(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayKham) {
        return ResponseEntity.ok(
                appointmentService.layLichTrongNgay(
                        ngayKham));
    }

    // Chủ phòng khám đổi ngày, giờ, bác sĩ hoặc phòng.
    // PATCH /api/v1/management/appointments/{id}/reschedule
    @PatchMapping("/management/appointments/{id}/reschedule")
    public ResponseEntity<AppointmentResponse> doiLich(
            @PathVariable("id") String maLich,

            @Valid @RequestBody RescheduleAppointmentRequest request) {
        return ResponseEntity.ok(
                appointmentService.doiLich(
                        maLich,
                        request));
    }

    // Chủ phòng khám đánh dấu bệnh nhân đã đến.
    // PATCH /api/v1/management/appointments/{id}/arrived
    @PatchMapping("/management/appointments/{id}/arrived")
    public ResponseEntity<AppointmentResponse> danhDauBenhNhanDaDen(
            @PathVariable("id") String maLich) {
        return ResponseEntity.ok(
                appointmentService.danhDauBenhNhanDaDen(
                        maLich));
    }

    // Chủ phòng khám đánh dấu bệnh nhân vắng mặt.
    // PATCH /api/v1/management/appointments/{id}/no-show
    @PatchMapping("/management/appointments/{id}/no-show")
    public ResponseEntity<AppointmentResponse> danhDauVangMat(
            @PathVariable("id") String maLich) {
        return ResponseEntity.ok(
                appointmentService.danhDauVangMat(
                        maLich));
    }

}
