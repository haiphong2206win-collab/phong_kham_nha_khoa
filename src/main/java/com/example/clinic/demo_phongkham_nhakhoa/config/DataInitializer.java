package com.example.clinic.demo_phongkham_nhakhoa.config;

import com.example.clinic.demo_phongkham_nhakhoa.entity.TaiKhoan;
import com.example.clinic.demo_phongkham_nhakhoa.repository.TaiKhoanRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner encodeSeedPasswords(
            TaiKhoanRepository repository,
            PasswordEncoder passwordEncoder) {

        return args -> {
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
}
