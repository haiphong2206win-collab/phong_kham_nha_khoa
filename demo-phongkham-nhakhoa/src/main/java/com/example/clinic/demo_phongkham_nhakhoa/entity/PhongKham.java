package com.example.clinic.demo_phongkham_nhakhoa.entity;
import com.example.clinic.demo_phongkham_nhakhoa.enums.*;
import jakarta.persistence.*;

@Entity
public class PhongKham {
    @Id
    private String maPhong;
    private String tenPhong;

    @Enumerated(EnumType.STRING)
    private TrangThaiPhong trangThai;

    private String ghiChu;
    // Constructors, Getters, Setters...

    public boolean coTheXepLich() {
        return this.trangThai == TrangThaiPhong.TRONG || this.trangThai == TrangThaiPhong.DANG_SU_DUNG;
    }

    public void tamNgung() {
        this.trangThai = TrangThaiPhong.TAM_NGUNG;
    }

    public void baoTri() {
        this.trangThai = TrangThaiPhong.BAO_TRI;
    }

    public void moLai() {
        this.trangThai = TrangThaiPhong.TRONG;
    }
}
