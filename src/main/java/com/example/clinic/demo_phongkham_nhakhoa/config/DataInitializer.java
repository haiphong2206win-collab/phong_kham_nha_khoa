package com.example.clinic.demo_phongkham_nhakhoa.config;

import com.example.clinic.demo_phongkham_nhakhoa.entity.BacSi;
import com.example.clinic.demo_phongkham_nhakhoa.entity.CaLamViec;
import com.example.clinic.demo_phongkham_nhakhoa.entity.TaiKhoan;
import com.example.clinic.demo_phongkham_nhakhoa.enums.CaKham;
import com.example.clinic.demo_phongkham_nhakhoa.enums.VaiTro;
import com.example.clinic.demo_phongkham_nhakhoa.repository.BacSiRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.CaLamViecRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.TaiKhoanRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalTime;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner encodeSeedPasswords(
            TaiKhoanRepository repository,
            BacSiRepository bacSiRepository,
            CaLamViecRepository caLamViecRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {
            taoDuLieuMauBacSi(repository, bacSiRepository, caLamViecRepository, passwordEncoder);

            for (TaiKhoan taiKhoan : repository.findAll()) {
                String matKhau = taiKhoan.getMatKhau();

                // Bỏ qua mật khẩu đã được BCrypt mã hóa
                if (matKhau != null
                        && !matKhau.matches("^\\$2[aby]\\$.*")) {

                    taiKhoan.setMatKhau(
                            passwordEncoder.encode(matKhau)
                    );

                    repository.save(taiKhoan);
                }
            }
        };
    }

    private void taoDuLieuMauBacSi(
            TaiKhoanRepository taiKhoanRepository,
            BacSiRepository bacSiRepository,
            CaLamViecRepository caLamViecRepository,
            PasswordEncoder passwordEncoder) {

        String[][] danhSachBacSi = {
                {"001", "nguyenminhkhang", "Nguyễn Minh Khang", "0901000002", "CCHN-RHM-0101"},
                {"002", "tranthuhang", "Trần Thu Hằng", "0901000003", "CCHN-RHM-0102"},
                {"003", "lequocbao", "Lê Quốc Bảo", "0901000004", "CCHN-RHM-0103"},
                {"004", "phamthilan", "Phạm Thị Lan", "0901000005", "CCHN-RHM-0104"},
                {"005", "vohoanglong", "Võ Hoàng Long", "0901000006", "CCHN-RHM-0105"}
        };

        for (String[] duLieu : danhSachBacSi) {
            String ma = duLieu[0];
            String tenDangNhap = "bs." + duLieu[1];

            TaiKhoan taiKhoan = taiKhoanRepository.findByTenDangNhap(tenDangNhap)
                    .orElseGet(() -> taiKhoanRepository.save(new TaiKhoan(
                            "TK_BS_" + ma,
                            tenDangNhap,
                            passwordEncoder.encode("NhaKhoa@123"),
                            VaiTro.BAC_SI)));

            BacSi bacSi = bacSiRepository.findById("BS_" + ma)
                    .orElseGet(() -> bacSiRepository.save(new BacSi(
                            "BS_" + ma,
                            taiKhoan,
                            duLieu[2],
                            duLieu[3],
                            duLieu[4],
                            true)));

            taoCaLamViecBayNgay(bacSi, caLamViecRepository);
        }
    }

    private void taoCaLamViecBayNgay(
            BacSi bacSi,
            CaLamViecRepository caLamViecRepository) {

        LocalDate ngayBatDau = LocalDate.now();

        for (int soNgay = 0; soNgay < 7; soNgay++) {
            LocalDate ngayLamViec = ngayBatDau.plusDays(soNgay);
            taoCaNeuChuaCo(bacSi, ngayLamViec, CaKham.CA_SANG,
                    LocalTime.of(8, 0), LocalTime.of(12, 0), caLamViecRepository);
            taoCaNeuChuaCo(bacSi, ngayLamViec, CaKham.CA_CHIEU,
                    LocalTime.of(13, 0), LocalTime.of(17, 0), caLamViecRepository);
        }
    }

    private void taoCaNeuChuaCo(
            BacSi bacSi,
            LocalDate ngayLamViec,
            CaKham caKham,
            LocalTime gioBatDau,
            LocalTime gioKetThuc,
            CaLamViecRepository caLamViecRepository) {

        if (caLamViecRepository.existsByBacSi_MaBacSiAndNgayLamViecAndCaKham(
                bacSi.getMaBacSi(), ngayLamViec, caKham)) {
            return;
        }

        String maCa = "CA_" + bacSi.getMaBacSi() + "_" + ngayLamViec + "_" + caKham.name();
        caLamViecRepository.save(new CaLamViec(
                maCa,
                bacSi,
                ngayLamViec,
                caKham,
                gioBatDau,
                gioKetThuc,
                10,
                true));
    }
}
