package com.example.clinic.demo_phongkham_nhakhoa.security;

import com.example.clinic.demo_phongkham_nhakhoa.entity.TaiKhoan;
import com.example.clinic.demo_phongkham_nhakhoa.repository.TaiKhoanRepository;
import com.example.clinic.demo_phongkham_nhakhoa.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final TaiKhoanRepository taiKhoanRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            TaiKhoanRepository taiKhoanRepository) {
        this.jwtService = jwtService;
        this.taiKhoanRepository = taiKhoanRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authorization = request.getHeader("Authorization");

        if (authorization != null
                && authorization.startsWith("Bearer ")
                && SecurityContextHolder.getContext().getAuthentication() == null) {

            String token = authorization.substring(7).trim();

            try {
                Claims claims = jwtService.docClaims(token);
                String tenDangNhap = claims.getSubject();

                if (tenDangNhap != null && !tenDangNhap.isBlank()) {
                    taiKhoanRepository.findByTenDangNhap(tenDangNhap)
                            .filter(TaiKhoan::dangHoatDong)
                            .ifPresent(taiKhoan -> {
                                var authentication =
                                        new UsernamePasswordAuthenticationToken(
                                                taiKhoan.getTenDangNhap(),
                                                null,
                                                List.of(new SimpleGrantedAuthority(
                                                        "ROLE_" + taiKhoan.getVaiTro().name()))
                                        );

                                authentication.setDetails(
                                        new WebAuthenticationDetailsSource()
                                                .buildDetails(request));

                                SecurityContextHolder.getContext()
                                        .setAuthentication(authentication);
                            });
                }
            } catch (JwtException | IllegalArgumentException ex) {
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}