package com.example.clinic.demo_phongkham_nhakhoa.controller;

import com.example.clinic.demo_phongkham_nhakhoa.entity.TaiKhoan;
import com.example.clinic.demo_phongkham_nhakhoa.service.TaiKhoanService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tai-khoan")
public class TaiKhoanController {

    private final TaiKhoanService taiKhoanService;

    public TaiKhoanController(TaiKhoanService taiKhoanService) {
        this.taiKhoanService = taiKhoanService;
    }

    // POST - Thêm tài khoản
    @PostMapping
    public TaiKhoan them(@RequestBody TaiKhoan taiKhoan) {
        return taiKhoanService.them(taiKhoan);
    }

    // GET - Lấy danh sách tài khoản
    @GetMapping
    public List<TaiKhoan> layDanhSach() {
        return taiKhoanService.layDanhSach();
    }

    // GET - Tìm tài khoản theo ID
    @GetMapping("/{maTaiKhoan}")
    public TaiKhoan timTheoId(@PathVariable String maTaiKhoan) {
        return taiKhoanService.timTheoId(maTaiKhoan);
    }

    // PUT - Sua tai khoan
    @PutMapping("/{maTaiKhoan}")
    public TaiKhoan sua(@PathVariable String maTaiKhoan, @RequestBody TaiKhoan taiKhoan) {
        taiKhoan.setMaTaiKhoan(maTaiKhoan);
        return taiKhoanService.sua(taiKhoan);
    }

    // DELETE - Xoa tai khoan
    @DeleteMapping("/{maTaiKhoan}")
    public void xoa(@PathVariable String maTaiKhoan) {
        taiKhoanService.xoa(maTaiKhoan);
    }
}
