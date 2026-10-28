-- =========================================
-- 1. TAI KHOAN CHU PHONG KHAM
-- Username: chu_demo
-- Password: password
-- =========================================

INSERT INTO tai_khoan (
    ma_tai_khoan,
    ten_dang_nhap,
    mat_khau,
    vai_tro,
    trang_thai,
    ngay_tao
) VALUES (
             'TK_CHU_DEMO',
             'chu_demo',
             'password',
             'CHU_PHONG_KHAM',
             'DANG_HOAT_DONG',
             CURRENT_TIMESTAMP
         );

-- =========================================
-- 2. TAI KHOAN BAC SI
-- Username: bacsi_demo
-- Password: password
-- =========================================

INSERT INTO tai_khoan (
    ma_tai_khoan,
    ten_dang_nhap,
    mat_khau,
    vai_tro,
    trang_thai,
    ngay_tao
) VALUES (
             'TK_BS_DEMO',
             'bacsi_demo',
             'password',
             'BAC_SI',
             'DANG_HOAT_DONG',
             CURRENT_TIMESTAMP
         );

-- =========================================
-- 3. HO SO CHU PHONG KHAM
-- =========================================

INSERT INTO bac_si (
    ma_bac_si,
    ma_tai_khoan,
    ho_ten,
    so_dien_thoai,
    so_chung_chi,
    dang_lam_viec
) VALUES (
             'BS_CHU_DEMO',
             'TK_CHU_DEMO',
             'Chu phong kham demo',
             '0900000001',
             'CC-CHU-DEMO',
             TRUE
         );

-- =========================================
-- 4. HO SO BAC SI
-- =========================================

INSERT INTO bac_si (
    ma_bac_si,
    ma_tai_khoan,
    ho_ten,
    so_dien_thoai,
    so_chung_chi,
    dang_lam_viec
) VALUES (
             'BS_DEMO',
             'TK_BS_DEMO',
             'Bac si demo',
             '0900000002',
             'CC-BS-DEMO',
             TRUE
         );

-- =========================================
-- 5. PHONG KHAM
-- =========================================

INSERT INTO phong_kham (
    ma_phong,
    ten_phong,
    trang_thai,
    ghi_chu
) VALUES (
             'P_DEMO',
             'Phong kham demo',
             'TRONG',
             'Phong dung de test phan cong'
         );

-- =========================================
-- 6. CA LAM VIEC BUOI SANG
-- Ngay mai, 08:00 - 12:00
-- =========================================

INSERT INTO ca_lam_viec (
    ma_ca,
    ma_bac_si,
    ngay_lam_viec,
    ca_kham,
    gio_bat_dau,
    gio_ket_thuc,
    so_benh_nhan_toi_da,
    dang_hoat_dong
) VALUES (
             'CA_SANG_DEMO',
             'BS_DEMO',
             DATEADD('DAY', 1, CURRENT_DATE),
             'CA_SANG',
             TIME '08:00:00',
             TIME '12:00:00',
             10,
             TRUE
         );

-- =========================================
-- 7. CA LAM VIEC BUOI CHIEU
-- Ngay mai, 13:00 - 17:00
-- =========================================

INSERT INTO ca_lam_viec (
    ma_ca,
    ma_bac_si,
    ngay_lam_viec,
    ca_kham,
    gio_bat_dau,
    gio_ket_thuc,
    so_benh_nhan_toi_da,
    dang_hoat_dong
) VALUES (
             'CA_CHIEU_DEMO',
             'BS_DEMO',
             DATEADD('DAY', 1, CURRENT_DATE),
             'CA_CHIEU',
             TIME '13:00:00',
             TIME '17:00:00',
             10,
             TRUE
         );

-- =========================================
-- 8. TAI KHOAN BAC SI THU HAI
-- Username: bacsi_demo2
-- Password: password
-- =========================================

INSERT INTO tai_khoan (
    ma_tai_khoan,
    ten_dang_nhap,
    mat_khau,
    vai_tro,
    trang_thai,
    ngay_tao
) VALUES (
             'TK_BS_DEMO2',
             'bacsi_demo2',
             'password',
             'BAC_SI',
             'DANG_HOAT_DONG',
             CURRENT_TIMESTAMP
         );

-- =========================================
-- 9. TAI KHOAN BAC SI THU BA
-- Username: bacsi_demo3
-- Password: password
-- =========================================

INSERT INTO tai_khoan (
    ma_tai_khoan,
    ten_dang_nhap,
    mat_khau,
    vai_tro,
    trang_thai,
    ngay_tao
) VALUES (
             'TK_BS_DEMO3',
             'bacsi_demo3',
             'password',
             'BAC_SI',
             'DANG_HOAT_DONG',
             CURRENT_TIMESTAMP
         );

-- =========================================
-- 10. HO SO BAC SI THU HAI
-- =========================================

INSERT INTO bac_si (
    ma_bac_si,
    ma_tai_khoan,
    ho_ten,
    so_dien_thoai,
    so_chung_chi,
    dang_lam_viec
) VALUES (
             'BS_DEMO2',
             'TK_BS_DEMO2',
             'Nguyen Van An',
             '0900000003',
             'CC-BS-DEMO2',
             TRUE
         );

-- =========================================
-- 11. HO SO BAC SI THU BA
-- =========================================

INSERT INTO bac_si (
    ma_bac_si,
    ma_tai_khoan,
    ho_ten,
    so_dien_thoai,
    so_chung_chi,
    dang_lam_viec
) VALUES (
             'BS_DEMO3',
             'TK_BS_DEMO3',
             'Tran Thi Binh',
             '0900000004',
             'CC-BS-DEMO3',
             TRUE
         );

-- =========================================
-- 12. PHONG KHAM THU HAI
-- =========================================

INSERT INTO phong_kham (
    ma_phong,
    ten_phong,
    trang_thai,
    ghi_chu
) VALUES (
             'P_DEMO2',
             'Phong kham so 2',
             'TRONG',
             'Phong dung de test phan cong lich'
         );

-- =========================================
-- 13. PHONG KHAM THU BA
-- =========================================

INSERT INTO phong_kham (
    ma_phong,
    ten_phong,
    trang_thai,
    ghi_chu
) VALUES (
             'P_DEMO3',
             'Phong kham so 3',
             'TRONG',
             'Phong dung de test phan cong lich'
         );

-- =========================================
-- 14. CA SANG CUA BAC SI DEMO2
-- Ngay mai, 08:00 - 12:00
-- =========================================

INSERT INTO ca_lam_viec (
    ma_ca,
    ma_bac_si,
    ngay_lam_viec,
    ca_kham,
    gio_bat_dau,
    gio_ket_thuc,
    so_benh_nhan_toi_da,
    dang_hoat_dong
) VALUES (
             'CA_SANG_BS2',
             'BS_DEMO2',
             DATEADD('DAY', 1, CURRENT_DATE),
             'CA_SANG',
             TIME '08:00:00',
             TIME '12:00:00',
             10,
             TRUE
         );

-- =========================================
-- 15. CA CHIEU CUA BAC SI DEMO2
-- Ngay mai, 13:00 - 17:00
-- =========================================

INSERT INTO ca_lam_viec (
    ma_ca,
    ma_bac_si,
    ngay_lam_viec,
    ca_kham,
    gio_bat_dau,
    gio_ket_thuc,
    so_benh_nhan_toi_da,
    dang_hoat_dong
) VALUES (
             'CA_CHIEU_BS2',
             'BS_DEMO2',
             DATEADD('DAY', 1, CURRENT_DATE),
             'CA_CHIEU',
             TIME '13:00:00',
             TIME '17:00:00',
             10,
             TRUE
         );

-- =========================================
-- 16. CA SANG CUA BAC SI DEMO3
-- Ngay mai, 08:00 - 12:00
-- =========================================

INSERT INTO ca_lam_viec (
    ma_ca,
    ma_bac_si,
    ngay_lam_viec,
    ca_kham,
    gio_bat_dau,
    gio_ket_thuc,
    so_benh_nhan_toi_da,
    dang_hoat_dong
) VALUES (
             'CA_SANG_BS3',
             'BS_DEMO3',
             DATEADD('DAY', 1, CURRENT_DATE),
             'CA_SANG',
             TIME '08:00:00',
             TIME '12:00:00',
             10,
             TRUE
         );

-- =========================================
-- 17. CA CHIEU CUA BAC SI DEMO3
-- Ngay mai, 13:00 - 17:00
-- =========================================

INSERT INTO ca_lam_viec (
    ma_ca,
    ma_bac_si,
    ngay_lam_viec,
    ca_kham,
    gio_bat_dau,
    gio_ket_thuc,
    so_benh_nhan_toi_da,
    dang_hoat_dong
) VALUES (
             'CA_CHIEU_BS3',
             'BS_DEMO3',
             DATEADD('DAY', 1, CURRENT_DATE),
             'CA_CHIEU',
             TIME '13:00:00',
             TIME '17:00:00',
             10,
             TRUE
         );

-- =========================================
-- 18. TAI KHOAN BENH NHAN DEMO
-- Username: benhnhan_demo
-- Password: password
-- =========================================

INSERT INTO tai_khoan (
    ma_tai_khoan,
    ten_dang_nhap,
    mat_khau,
    vai_tro,
    trang_thai,
    ngay_tao
) VALUES (
             'TK_BN_DEMO',
             'benhnhan_demo',
             'password',
             'BENH_NHAN',
             'DANG_HOAT_DONG',
             CURRENT_TIMESTAMP
         );

-- =========================================
-- 19. HO SO BENH NHAN DEMO
-- =========================================

INSERT INTO benh_nhan (
    ma_benh_nhan,
    ma_tai_khoan,
    ho_ten,
    ngay_sinh,
    gioi_tinh,
    so_dien_thoai,
    email,
    dia_chi,
    tien_su_benh,
    di_ung_thuoc
) VALUES (
             'BN_DEMO',
             'TK_BN_DEMO',
             'Le Minh Duc',
             DATE '2004-05-15',
             'NAM',
             '0900000005',
             'benhnhan.demo@example.com',
             'Ha Noi',
             'Chua ghi nhan',
             'Chua ghi nhan'
         );
