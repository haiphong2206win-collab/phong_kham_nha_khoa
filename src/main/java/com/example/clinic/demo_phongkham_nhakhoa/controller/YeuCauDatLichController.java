package com.example.clinic.demo_phongkham_nhakhoa.controller;

import com.example.clinic.demo_phongkham_nhakhoa.entity.YeuCauDatLich;
import com.example.clinic.demo_phongkham_nhakhoa.service.YeuCauDatLichService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/yeu-cau-dat-lich")
public class YeuCauDatLichController {

    private final YeuCauDatLichService yeuCauDatLichService;

    public YeuCauDatLichController(YeuCauDatLichService yeuCauDatLichService) {
        this.yeuCauDatLichService = yeuCauDatLichService;
    }

    // POST - Them yeu cau dat lich
    @PostMapping
    public YeuCauDatLich them(@RequestBody YeuCauDatLich yeuCauDatLich) {
        return yeuCauDatLichService.them(yeuCauDatLich);
    }

    // GET - Lay danh sach yeu cau dat lich
    @GetMapping
    public List<YeuCauDatLich> layDanhSach() {
        return yeuCauDatLichService.layDanhSach();
    }

    // GET - Tim yeu cau dat lich theo Id
    @GetMapping("/{maYeuCau}")
    public YeuCauDatLich timTheoId(@PathVariable String maYeuCau) {
        return yeuCauDatLichService.timTheoId(maYeuCau);
    }

    // PUT - Sửa yêu cầu đặt lịch
    @PutMapping("/{maYeuCau}")
    public YeuCauDatLich sua(
            @PathVariable String maYeuCau,
            @RequestBody YeuCauDatLich yeuCauDatLich) {

        yeuCauDatLich.setMaYeuCau(maYeuCau);

        return yeuCauDatLichService.sua(yeuCauDatLich);
    }

    // PUT - Hủy yêu cầu
    @PutMapping("/{maYeuCau}/huy")
    public YeuCauDatLich huy(@PathVariable String maYeuCau, @RequestBody HashMap<String, String> body) {
        String lyDo = body.get("lyDo");
        return yeuCauDatLichService.huy(maYeuCau, lyDo);
    }

    // PUT - Từ chối yêu cầu
    @PutMapping("/{maYeuCau}/tu-choi")
    public YeuCauDatLich tuChoi(
            @PathVariable String maYeuCau,
            @RequestBody HashMap<String, String> body) {

        String lyDo = body.get("lyDo");

        return yeuCauDatLichService.tuChoi(
                maYeuCau,
                lyDo
        );
    }

    // PUT - Phân công
    @PutMapping("/{maYeuCau}/phan-cong")
    public YeuCauDatLich phanCong(
            @PathVariable String maYeuCau) {

        return yeuCauDatLichService.phanCong(maYeuCau);
    }

    // DELETE - Xóa yêu cầu đặt lịch
    @DeleteMapping("/{maYeuCau}")
    public void xoa(@PathVariable String maYeuCau) {
        yeuCauDatLichService.xoa(maYeuCau);
    }
}
