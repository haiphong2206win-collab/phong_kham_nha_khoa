
package com.example.clinic.demo_phongkham_nhakhoa.event;

import com.example.clinic.demo_phongkham_nhakhoa.enums.TrangThaiDatLich;

/**
 * Thong bao lich kham da thay doi trang thai.
 * Duoc phat ra tu service quan ly lich kham, va duoc xu ly
 * dong bo boi module lo trinh dieu tri.
 */
public record LichKhamTrangThaiThayDoiEvent(
        String maLich,
        TrangThaiDatLich trangThaiCu,
        TrangThaiDatLich trangThaiMoi) {
}
