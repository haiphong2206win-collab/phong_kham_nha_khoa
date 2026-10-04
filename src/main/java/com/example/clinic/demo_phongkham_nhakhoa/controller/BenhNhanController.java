package com.example.clinic.demo_phongkham_nhakhoa.controller;

import com.example.clinic.demo_phongkham_nhakhoa.entity.BenhNhan;
import com.example.clinic.demo_phongkham_nhakhoa.service.BenhNhanService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/benh-nhan")
public class BenhNhanController {

    private final BenhNhanService benhNhanService;

    public BenhNhanController(BenhNhanService benhNhanService) {
        this.benhNhanService = benhNhanService;
    }

    // POST - Them benh nhan
    @PostMapping
    public BenhNhan them(@RequestBody BenhNhan benhNhan) {
        return benhNhanService.them(benhNhan);
    }

    // GET - Lay danh sach benh nhan
    @GetMapping
    public List<BenhNhan> layDanhSach() {
        return benhNhanService.layDanhSach();
    }

    // GET - Tim benh nhan theo Id
    @GetMapping("/{maBenhNhan}")
    public BenhNhan timTheoId(@PathVariable String maBenhNhan) {
        return benhNhanService.timTheoId(maBenhNhan);
    }

    // PUT - Sua benh nhan
    @PutMapping("/{maBenhNhan}")
    public BenhNhan sua(@PathVariable String maBenhNhan, @RequestBody BenhNhan benhNhan) {
        benhNhan.setMaBenhNhan(maBenhNhan);
        return benhNhanService.sua(benhNhan);
    }

    // DELETE - Xoa benh nhan
    @DeleteMapping("/{maBenhNhan}")
    public void xoa(@PathVariable String maBenhNhan) {
        benhNhanService.xoa(maBenhNhan);
    }
}
