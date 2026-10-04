package com.example.clinic.demo_phongkham_nhakhoa.service;

import com.example.clinic.demo_phongkham_nhakhoa.entity.BenhNhan;
import com.example.clinic.demo_phongkham_nhakhoa.entity.YeuCauDatLich;
import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiYeuCau;
import com.example.clinic.demo_phongkham_nhakhoa.repository.BenhNhanRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.YeuCauDatLichRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class YeuCauDatLichService {

    private final YeuCauDatLichRepository repository;

    private final BenhNhanRepository benhNhanRepository;

    public YeuCauDatLichService(YeuCauDatLichRepository repository, BenhNhanRepository benhNhanRepository) {
        this.repository = repository;
        this.benhNhanRepository = benhNhanRepository;
    }

    // Thêm yêu cầu đặt lịch
    public YeuCauDatLich them(YeuCauDatLich yeuCauDatLich) {

        if(yeuCauDatLich.getNgayMongMuon() == null) {
            throw new IllegalArgumentException("Ngày mong muốn không được để trống");
        }

        if(yeuCauDatLich.getNgayMongMuon().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException( "Ngày mong muốn không được ở quá khứ");
        }

        if(yeuCauDatLich.getBenhNhan() == null || yeuCauDatLich.getBenhNhan().getMaBenhNhan() == null) {
            throw new IllegalArgumentException("Bệnh nhân không được để trống");
        }

        String maBenhNhan = yeuCauDatLich.getBenhNhan().getMaBenhNhan();

        BenhNhan benhNhan = benhNhanRepository.findById(maBenhNhan).orElseThrow(
                () -> new IllegalArgumentException("Không tìm thấy bệnh nhân: " + maBenhNhan)
        );

        yeuCauDatLich.setBenhNhan(benhNhan);

        yeuCauDatLich.setThoiGianGui(LocalDateTime.now());

        yeuCauDatLich.setTrangThai(TrangThaiYeuCau.CHO_PHAN_CONG);

        yeuCauDatLich.setLyDoTuChoi(null);

        return repository.save(yeuCauDatLich);
    }

    // Sửa yêu cầu đặt lịch
    public YeuCauDatLich sua(YeuCauDatLich yeuCauDatLich) {

        YeuCauDatLich yeuCauCu = repository.findById(yeuCauDatLich.getMaYeuCau()).orElseThrow(
                () -> new IllegalArgumentException("Không tìm thấy yêu cầu: " + yeuCauDatLich.getMaYeuCau())
        );

        if(!yeuCauCu.dangChoPhanCong()) {
            throw new IllegalArgumentException("Chỉ có thể sửa yêu cầu đang chờ phân công");
        }

        if(yeuCauDatLich.getNgayMongMuon() == null) {
            throw new IllegalArgumentException("Ngày mong muốn không được để trống");
        }

        if(yeuCauDatLich.getNgayMongMuon().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Ngày mong muốn không được ở quá khứ");
        }

        if(yeuCauDatLich.getBenhNhan() == null || yeuCauDatLich.getBenhNhan().getMaBenhNhan() == null) {
            throw new IllegalArgumentException("Bệnh nhân không được để trống");
        }

        String maBenhNhan = yeuCauDatLich.getBenhNhan().getMaBenhNhan();

        BenhNhan benhNhan = benhNhanRepository.findById(maBenhNhan).orElseThrow(
                () -> new IllegalArgumentException("Không tìm thấy bệnh nhân: " + maBenhNhan)
        );

        yeuCauDatLich.setBenhNhan(benhNhan);

        yeuCauDatLich.setThoiGianGui(yeuCauCu.getThoiGianGui());

        yeuCauDatLich.setTrangThai(yeuCauCu.getTrangThai());

        yeuCauDatLich.setLyDoTuChoi(yeuCauCu.getLyDoTuChoi());

        return repository.save(yeuCauDatLich);
    }

    // Hủy yêu cầu đặt lịch
    public YeuCauDatLich huy(String maYeuCau, String lyDo) {

        YeuCauDatLich yeuCauDatLich = timTheoId(maYeuCau);

        if(yeuCauDatLich == null) {
            throw new IllegalArgumentException("Yêu cầu đặt lịch không tồn tại");
        }

        yeuCauDatLich.huy(lyDo);

        return repository.save(yeuCauDatLich);
    }

    // Từ chối yêu cầu đặt lịch
    public YeuCauDatLich tuChoi(
            String maYeuCau,
            String lyDo) {

        YeuCauDatLich yeuCauDatLich = timTheoId(maYeuCau);

        if(yeuCauDatLich == null) {
            throw new IllegalArgumentException("Yêu cầu đặt lịch không tồn tại");
        }

        yeuCauDatLich.tuChoi(lyDo);

        return repository.save(yeuCauDatLich);
    }

    // Phân công
    public YeuCauDatLich phanCong(String maYeuCau) {

        YeuCauDatLich yeuCauDatLich = timTheoId(maYeuCau);

        if(yeuCauDatLich == null) {
            throw new IllegalArgumentException("Yêu cầu đặt lịch không tồn tại");
        }

        yeuCauDatLich.danhDauDaPhanCong();

        return repository.save(yeuCauDatLich);
    }

    // Tìm yêu cầu đặt lịch theo ID
    public YeuCauDatLich timTheoId(String maYeuCau) {
        return repository.findById(maYeuCau).orElseThrow(
                () -> new IllegalArgumentException("Không tìm thấy yêu cầu: " + maYeuCau)
        );
    }

    // Lấy danh sách yêu cầu đặt lịch
    public List<YeuCauDatLich> layDanhSach() {
        return repository.findAll();
    }

    // Xóa yêu cầu đặt lịch theo ID
    public void xoa(String maYeuCau) {
        YeuCauDatLich yeuCauDatLich = timTheoId(maYeuCau);
        repository.delete(yeuCauDatLich);
    }
}
