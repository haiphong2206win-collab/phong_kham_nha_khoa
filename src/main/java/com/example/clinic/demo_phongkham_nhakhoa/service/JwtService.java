package com.example.clinic.demo_phongkham_nhakhoa.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    private final String secret;
    private final long expirationMs;

    public JwtService(
            @Value("${security.jwt.secret}") String secret,
            @Value("${security.jwt.expiration-ms:7200000}") long expirationMs) {
        this.secret = secret;
        this.expirationMs = expirationMs;
    }

    public String taoToken(String tenDangNhap, String vaiTro) {
        Date now = new Date();
        Date hetHan = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setSubject(tenDangNhap)
                .claim("role", vaiTro)
                .setIssuedAt(now)
                .setExpiration(hetHan)
                .signWith(khoaKy(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims docClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(khoaKy())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private SecretKey khoaKy() {
        return Keys.hmacShaKeyFor(
                Decoders.BASE64.decode(secret)
        );
    }
}