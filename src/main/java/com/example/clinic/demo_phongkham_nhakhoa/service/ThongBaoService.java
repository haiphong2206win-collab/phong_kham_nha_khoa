package com.example.clinic.demo_phongkham_nhakhoa.service;

import com.example.clinic.demo_phongkham_nhakhoa.dto.response.ThongBaoResponse;
import com.example.clinic.demo_phongkham_nhakhoa.entity.LichKham;
import com.example.clinic.demo_phongkham_nhakhoa.entity.TaiKhoan;
import com.example.clinic.demo_phongkham_nhakhoa.entity.ThongBao;
import com.example.clinic.demo_phongkham_nhakhoa.enums.LoaiThongBao;
import com.example.clinic.demo_phongkham_nhakhoa.repository.ThongBaoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ThongBaoService {

    private final ThongBaoRepository thongBaoRepository;

    public ThongBaoService(ThongBaoRepository thongBaoRepository) {
        this.thongBaoRepository = thongBaoRepository;
    }

    // Tạo thông báo cho một tài khoản.
    public void taoThongBao(
            TaiKhoan taiKhoan,
            LichKham lichKham,
            LoaiThongBao loaiThongBao,
            String tieuDe,
            String noiDung
    ) {
        ThongBao thongBao = new ThongBao();

        thongBao.setTaiKhoan(taiKhoan);
        thongBao.setLichKham(lichKham);
        thongBao.setLoaiThongBao(loaiThongBao);
        thongBao.setTieuDe(tieuDe);
        thongBao.setNoiDung(noiDung);

        thongBaoRepository.save(thongBao);
    }

    // Bệnh nhân xem thông báo của chính mình.
    @Transactional(readOnly = true)
    public List<ThongBaoResponse> layThongBaoCuaToi(
            String tenDangNhap
    ) {
        return thongBaoRepository
                .findByTaiKhoan_TenDangNhapOrderByThoiGianTaoDesc(
                        tenDangNhap
                )
                .stream()
                .map(ThongBaoResponse::new)
                .toList();
    }

    // Đếm số thông báo chưa đọc.
    @Transactional(readOnly = true)
    public long demThongBaoChuaDoc(String tenDangNhap) {
        return thongBaoRepository
                .countByTaiKhoan_TenDangNhapAndDaDocFalse(tenDangNhap);
    }

    // Chỉ người nhận thông báo mới được đánh dấu đã đọc.
    @Transactional
    public void danhDauDaDoc(
            String maThongBao,
            String tenDangNhap
    ) {
        ThongBao thongBao = thongBaoRepository
                .findByMaThongBaoAndTaiKhoan_TenDangNhap(
                        maThongBao,
                        tenDangNhap
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy thông báo."
                ));

        thongBao.danhDauDaDoc();
    }
}
