package com.example.clinic.demo_phongkham_nhakhoa.dto.response;

import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiTaiKhoan;
import com.example.clinic.demo_phongkham_nhakhoa.enums.VaiTro;

import java.time.LocalDateTime;

public class TaiKhoanQuanLyResponse {

    private String maTaiKhoan;
    private String tenDangNhap;
    private VaiTro vaiTro;
    private TrangThaiTaiKhoan trangThai;
    private LocalDateTime ngayTao;
    private String maHoSo;
    private String hoTen;
    private String soDienThoai;

    public TaiKhoanQuanLyResponse() {
    }

    public TaiKhoanQuanLyResponse(
            String maTaiKhoan,
            String tenDangNhap,
            VaiTro vaiTro,
            TrangThaiTaiKhoan trangThai,
            LocalDateTime ngayTao,
            String maHoSo,
            String hoTen,
            String soDienThoai) {

        this.maTaiKhoan = maTaiKhoan;
        this.tenDangNhap = tenDangNhap;
        this.vaiTro = vaiTro;
        this.trangThai = trangThai;
        this.ngayTao = ngayTao;
        this.maHoSo = maHoSo;
        this.hoTen = hoTen;
        this.soDienThoai = soDienThoai;
    }

    public String getMaTaiKhoan() {
        return maTaiKhoan;
    }

    public String getTenDangNhap() {
        return tenDangNhap;
    }

    public VaiTro getVaiTro() {
        return vaiTro;
    }

    public TrangThaiTaiKhoan getTrangThai() {
        return trangThai;
    }

    public LocalDateTime getNgayTao() {
        return ngayTao;
    }

    public String getMaHoSo() {
        return maHoSo;
    }

    public String getHoTen() {
        return hoTen;
    }

    public String getSoDienThoai() {
        return soDienThoai;
    }
}
