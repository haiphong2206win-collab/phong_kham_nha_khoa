package com.example.clinic.demo_phongkham_nhakhoa.service;

import com.example.clinic.demo_phongkham_nhakhoa.dto.request.CapNhatCaLamViecRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.request.TaoCaLamViecRequest;
import com.example.clinic.demo_phongkham_nhakhoa.dto.response.CaLamViecResponse;
import com.example.clinic.demo_phongkham_nhakhoa.entity.BacSi;
import com.example.clinic.demo_phongkham_nhakhoa.entity.CaLamViec;
import com.example.clinic.demo_phongkham_nhakhoa.entity.LichKham;
import com.example.clinic.demo_phongkham_nhakhoa.enums.CaKham;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiDatLich;
import com.example.clinic.demo_phongkham_nhakhoa.repository.BacSiRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.CaLamViecRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.LichKhamRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CaLamViecService {

    private final CaLamViecRepository caLamViecRepository;
    private final BacSiRepository bacSiRepository;
    private final LichKhamRepository lichKhamRepository;

    public CaLamViecService(
            CaLamViecRepository caLamViecRepository,
            BacSiRepository bacSiRepository,
            LichKhamRepository lichKhamRepository
    ) {
        this.caLamViecRepository = caLamViecRepository;
        this.bacSiRepository = bacSiRepository;
        this.lichKhamRepository = lichKhamRepository;
    }

    @Transactional(readOnly = true)
    public List<CaLamViecResponse> layDanhSach(LocalDate tuNgay, LocalDate denNgay, String maBacSi) {
        List<CaLamViec> danhSach;

        if (tuNgay != null && denNgay != null) {
            if (maBacSi != null && !maBacSi.isBlank()) {
                danhSach = caLamViecRepository.findByBacSi_MaBacSiAndNgayLamViecBetweenOrderByNgayLamViecAscGioBatDauAsc(
                        maBacSi, tuNgay, denNgay
                );
            } else {
                danhSach = caLamViecRepository.findByNgayLamViecBetweenOrderByNgayLamViecAscGioBatDauAsc(
                        tuNgay, denNgay
                );
            }
        } else if (maBacSi != null && !maBacSi.isBlank()) {
            danhSach = caLamViecRepository.findByBacSi_MaBacSi(maBacSi);
        } else {
            danhSach = caLamViecRepository.findAllByOrderByNgayLamViecDescGioBatDauAsc();
        }

        return danhSach.stream()
                .map(this::chuyenSangResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CaLamViecResponse layChiTiet(String maCa) {
        CaLamViec clv = caLamViecRepository.findById(maCa)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy ca làm việc: " + maCa
                ));
        return chuyenSangResponse(clv);
    }

    @Transactional
    public CaLamViecResponse taoCaLamViec(TaoCaLamViecRequest request) {
        BacSi bacSi = bacSiRepository.findById(request.getMaBacSi())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Bác sĩ không tồn tại với mã: " + request.getMaBacSi()
                ));

        if (!bacSi.dangHoatDong()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Bác sĩ " + bacSi.getHoTen() + " hiện không hoạt động (đã nghỉ hoặc bị khóa)."
            );
        }

        LocalDate ngay = request.getNgayLamViec();
        CaKham ca = request.getCaKham();

        // Kiểm tra ca trực trùng buổi của bác sĩ trong cùng ngày
        if (caLamViecRepository.existsByBacSi_MaBacSiAndNgayLamViecAndCaKham(bacSi.getMaBacSi(), ngay, ca)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Bác sĩ " + bacSi.getHoTen() + " đã có ca trực " +
                            (ca == CaKham.CA_SANG ? "buổi sáng" : "buổi chiều") + " vào ngày " + ngay
            );
        }

        LocalTime gioBatDau = request.getGioBatDau();
        LocalTime gioKetThuc = request.getGioKetThuc();

        // Gợi ý giờ mặc định theo ca nếu không truyền
        if (gioBatDau == null || gioKetThuc == null) {
            if (ca == CaKham.CA_SANG) {
                gioBatDau = (gioBatDau != null) ? gioBatDau : LocalTime.of(8, 0);
                gioKetThuc = (gioKetThuc != null) ? gioKetThuc : LocalTime.of(12, 0);
            } else {
                gioBatDau = (gioBatDau != null) ? gioBatDau : LocalTime.of(13, 0);
                gioKetThuc = (gioKetThuc != null) ? gioKetThuc : LocalTime.of(17, 0);
            }
        }

        if (!gioBatDau.isBefore(gioKetThuc)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Giờ kết thúc (" + gioKetThuc + ") phải sau giờ bắt đầu (" + gioBatDau + ")."
            );
        }

        int soBN = request.getSoBenhNhanToiDa() > 0 ? request.getSoBenhNhanToiDa() : 10;
        boolean hoatDong = request.getDangHoatDong() != null ? request.getDangHoatDong() : true;

        String maCa = "CA_" + ca.name() + "_" + ngay.toString().replace("-", "") + "_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        CaLamViec caLamViec = new CaLamViec(
                maCa,
                bacSi,
                ngay,
                ca,
                gioBatDau,
                gioKetThuc,
                soBN,
                hoatDong
        );

        CaLamViec daLuu = caLamViecRepository.save(caLamViec);
        return chuyenSangResponse(daLuu);
    }

    @Transactional
    public CaLamViecResponse capNhatCaLamViec(String maCa, CapNhatCaLamViecRequest request) {
        CaLamViec caLamViec = caLamViecRepository.findById(maCa)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy ca làm việc: " + maCa
                ));

        LocalTime gioMoiBatDau = request.getGioBatDau() != null ? request.getGioBatDau() : caLamViec.getGioBatDau();
        LocalTime gioMoiKetThuc = request.getGioKetThuc() != null ? request.getGioKetThuc() : caLamViec.getGioKetThuc();

        if (!gioMoiBatDau.isBefore(gioMoiKetThuc)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Giờ kết thúc (" + gioMoiKetThuc + ") phải sau giờ bắt đầu (" + gioMoiBatDau + ")."
            );
        }

        // Kiểm tra xem có lịch khám nào bị ảnh hưởng không
        List<LichKham> lichKhamTrongNgay = lichKhamRepository.findByBacSiAndNgayKham(
                caLamViec.getBacSi(), caLamViec.getNgayLamViec()
        );

        for (LichKham lk : lichKhamTrongNgay) {
            if (lk.getTrangThai() == TrangThaiDatLich.DA_HUY) {
                continue;
            }
            // Nếu lịch khám thuộc ca cũ
            if (caLamViec.chuaThoiGian(lk.getGioBatDau(), lk.getGioKetThuc())) {
                // Kiểm tra nếu tắt hoạt động ca
                if (request.getDangHoatDong() != null && !request.getDangHoatDong()) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Không thể tạm ngưng ca trực vì đã có lịch khám đã phân công cho bác sĩ (mã lịch: " + lk.getMaLich() + ")."
                    );
                }
                // Kiểm tra nếu giờ mới không chứa lịch khám đã xếp
                if (lk.getGioBatDau().isBefore(gioMoiBatDau) || lk.getGioKetThuc().isAfter(gioMoiKetThuc)) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Không thể thu hẹp khung giờ ca trực vì lịch khám " + lk.getMaLich() +
                                    " (" + lk.getGioBatDau() + " - " + lk.getGioKetThuc() + ") nằm ngoài khung giờ mới."
                    );
                }
            }
        }

        caLamViec.setGioBatDau(gioMoiBatDau);
        caLamViec.setGioKetThuc(gioMoiKetThuc);

        if (request.getSoBenhNhanToiDa() != null && request.getSoBenhNhanToiDa() > 0) {
            caLamViec.setSoBenhNhanToiDa(request.getSoBenhNhanToiDa());
        }

        if (request.getDangHoatDong() != null) {
            caLamViec.setDangHoatDong(request.getDangHoatDong());
        }

        CaLamViec daLuu = caLamViecRepository.save(caLamViec);
        return chuyenSangResponse(daLuu);
    }

    @Transactional
    public void xoaCaLamViec(String maCa) {
        CaLamViec caLamViec = caLamViecRepository.findById(maCa)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy ca làm việc: " + maCa
                ));

        // Kiểm tra lịch khám đang có của bác sĩ trong ca này
        List<LichKham> lichKhamTrongNgay = lichKhamRepository.findByBacSiAndNgayKham(
                caLamViec.getBacSi(), caLamViec.getNgayLamViec()
        );

        for (LichKham lk : lichKhamTrongNgay) {
            if (lk.getTrangThai() != TrangThaiDatLich.DA_HUY
                    && caLamViec.chuaThoiGian(lk.getGioBatDau(), lk.getGioKetThuc())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Không thể xóa ca trực vì đã có lịch khám phân công cho bác sĩ (mã lịch: " + lk.getMaLich() + ")."
                );
            }
        }

        caLamViecRepository.delete(caLamViec);
    }

    private CaLamViecResponse chuyenSangResponse(CaLamViec clv) {
        int soLich = 0;
        try {
            List<LichKham> lich = lichKhamRepository.findByBacSiAndNgayKham(clv.getBacSi(), clv.getNgayLamViec());
            for (LichKham lk : lich) {
                if (lk.getTrangThai() != TrangThaiDatLich.DA_HUY
                        && clv.chuaThoiGian(lk.getGioBatDau(), lk.getGioKetThuc())) {
                    soLich++;
                }
            }
        } catch (Exception ignored) {
        }

        return new CaLamViecResponse(
                clv.getMaCa(),
                clv.getBacSi().getMaBacSi(),
                clv.getBacSi().getHoTen(),
                clv.getBacSi().getSoChungChi(),
                clv.getNgayLamViec(),
                clv.getCaKham(),
                clv.getGioBatDau(),
                clv.getGioKetThuc(),
                clv.getSoBenhNhanToiDa(),
                clv.isDangHoatDong(),
                soLich
        );
    }
}
