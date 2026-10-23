package com.example.clinic.demo_phongkham_nhakhoa.config;

import com.example.clinic.demo_phongkham_nhakhoa.security.JwtAuthenticationFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
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
public class CauHinhBaoMat {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public FilterRegistrationBean<JwtAuthenticationFilter>
    jwtFilterRegistration(JwtAuthenticationFilter filter) {

        FilterRegistrationBean<JwtAuthenticationFilter> registration =
                new FilterRegistrationBean<>(filter);

        // Tránh filter được đăng ký hai lần.
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
                .headers(headers ->
                        headers.frameOptions(frame -> frame.disable()))
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS))
                .exceptionHandling(exceptions ->
                        exceptions.authenticationEntryPoint(
                                new HttpStatusEntryPoint(
                                        HttpStatus.UNAUTHORIZED)))
                .authorizeHttpRequests(auth -> auth
                        // Dang ky, dang nhap cong khai
                        .requestMatchers(
                                "/api/v1/xac-thuc/dang-ky",
                                "/api/v1/xac-thuc/dang-nhap",
                                "/h2-console/**"
                        ).permitAll()

                        // Chu phong kham
                        .requestMatchers(
                                "/api/v1/quan-ly/**",
                                "/api/v1/phan-cong/**",
                                "/api/v1/tai-khoan/**"
                        ).hasRole("CHU_PHONG_KHAM")

                        // Bac si
                        .requestMatchers(
                                "/api/v1/bac-si/**"
                        ).hasRole("BAC_SI")

                        // Benh nhan
                        .requestMatchers(
                                "/api/v1/benh-nhan/**",
                                "/api/v1/yeu-cau-dat-lich/**",
                                "/api/v1/thong-bao/**"
                        ).hasRole("BENH_NHAN")

                        // Cac API con lai phai dang nhap
                        .anyRequest().authenticated()
                )
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}
