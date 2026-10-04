package com.example.clinic.demo_phongkham_nhakhoa.service;

import com.example.clinic.demo_phongkham_nhakhoa.entity.BenhNhan;
import com.example.clinic.demo_phongkham_nhakhoa.entity.TaiKhoan;
import com.example.clinic.demo_phongkham_nhakhoa.repository.BenhNhanRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.TaiKhoanRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BenhNhanService {

    private final BenhNhanRepository repository;

    private final TaiKhoanRepository taiKhoanRepository;

    public BenhNhanService(BenhNhanRepository benhNhanRepository, TaiKhoanRepository taiKhoanRepository) {
        this.repository = benhNhanRepository;
        this.taiKhoanRepository = taiKhoanRepository;
    }

    // Them benh nhan
    public BenhNhan them(BenhNhan benhNhan) {
        TaiKhoan taiKhoan = taiKhoanRepository
                .findById(benhNhan.getTaiKhoan().getMaTaiKhoan())
                .orElseThrow();

        benhNhan.setTaiKhoan(taiKhoan);

        return repository.save(benhNhan);
    }

    // Sua benh nhan
    public BenhNhan sua(BenhNhan benhNhan) {
        return repository.save(benhNhan);
    }

    // Xoa benh nhan theo Id
    public void xoa(String maBenhNhan) {
        repository.deleteById(maBenhNhan);
    }

    // Tim benh nhan theo Id
    public BenhNhan timTheoId(String maBenhNhan) {
        return repository.findById(maBenhNhan).orElse(null);
    }

    // Lấy danh sách bệnh nhân
    public List<BenhNhan> layDanhSach() {
        return repository.findAll();
    }
}
