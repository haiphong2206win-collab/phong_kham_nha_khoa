
package com.example.clinic.demo_phongkham_nhakhoa.config;

import com.example.clinic.demo_phongkham_nhakhoa.security.JwtAuthenticationFilter;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class CauHinhBaoMat {

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public FilterRegistrationBean<JwtAuthenticationFilter> jwtFilterRegistration(
                        JwtAuthenticationFilter filter) {

                FilterRegistrationBean<JwtAuthenticationFilter> registration = new FilterRegistrationBean<>(filter);

                // Tranh filter duoc dang ky hai lan.
                registration.setEnabled(false);

                return registration;
        }

        @Bean
        public SecurityFilterChain filterChain(
                        HttpSecurity http,
                        JwtAuthenticationFilter jwtAuthenticationFilter)
                        throws Exception {

                http
                                .csrf(csrf -> csrf.disable())

                                .headers(headers -> headers.frameOptions(
                                                frame -> frame.disable()))

                                .sessionManagement(session -> session.sessionCreationPolicy(
                                                SessionCreationPolicy.STATELESS))

                                .exceptionHandling(exceptions -> exceptions.authenticationEntryPoint(
                                                new HttpStatusEntryPoint(
                                                                HttpStatus.UNAUTHORIZED)))

                                .authorizeHttpRequests(auth -> auth

                                                // ======================================
                                                // DANG KY, DANG NHAP CONG KHAI
                                                // ======================================

                                                .requestMatchers(
                                                                "/api/v1/xac-thuc/dang-ky",
                                                                "/api/v1/xac-thuc/dang-nhap",
                                                                "/h2-console/**")
                                                .permitAll()

                                                // ======================================
                                                // LO TRINH DIEU TRI MAU
                                                // ======================================

                                                // Bac si va chu phong kham duoc xem
                                                // 3 lo trinh mau co dinh.
                                                //
                                                // Khong cung cap API them, sua
                                                // hoac xoa lo trinh mau.

                                                .requestMatchers(
                                                                "/api/v1/lo-trinh-mau",
                                                                "/api/v1/lo-trinh-mau/**")
                                                .hasAnyRole(
                                                                "BAC_SI",
                                                                "CHU_PHONG_KHAM")

                                                // ======================================
                                                // LO TRINH DIEU TRI RIENG
                                                // MOI THEM - GIAI DOAN 2
                                                // ======================================

                                                // Chi bac si va chu phong kham
                                                // duoc tao, xem, them, sua, bo buoi
                                                // trong lo trinh dieu tri rieng.
                                                //
                                                // Benh nhan khong duoc truy cap
                                                // cac API quan ly nay.

                                                .requestMatchers(
                                                                "/api/v1/lo-trinh-dieu-tri",
                                                                "/api/v1/lo-trinh-dieu-tri/**")
                                                .hasAnyRole(
                                                                "BAC_SI",
                                                                "CHU_PHONG_KHAM")

                                                // ======================================
                                                // QUYEN CU CUA NHOM - GIU NGUYEN
                                                // ======================================

                                                // Chu phong kham
                                                .requestMatchers(
                                                                "/api/v1/quan-ly/**",
                                                                "/api/v1/phan-cong/**",
                                                                "/api/v1/tai-khoan/**")
                                                .hasRole("CHU_PHONG_KHAM")

                                                // Bac si
                                                .requestMatchers(
                                                                "/api/v1/bac-si/**")
                                                .hasRole("BAC_SI")

                                                // Benh nhan
                                                .requestMatchers(
                                                                "/api/v1/benh-nhan/**",
                                                                "/api/v1/yeu-cau-dat-lich/**",
                                                                "/api/v1/thong-bao/**")
                                                .hasRole("BENH_NHAN")

                                                // Cac API con lai phai dang nhap
                                                .anyRequest().authenticated())

                                .addFilterBefore(
                                                jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}
