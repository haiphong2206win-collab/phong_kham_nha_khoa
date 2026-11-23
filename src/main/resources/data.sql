-- =========================================================
-- DU LIEU KHOI TAO PHONG KHAM NHA KHOA NU CUOI XANH
-- Mat khau ban dau cua tat ca tai khoan: NhaKhoa@123
-- DataInitializer se ma hoa BCrypt ngay sau khi nap du lieu.
-- =========================================================

-- 1. Tai khoan khoi tao
INSERT INTO tai_khoan (
    ma_tai_khoan, ten_dang_nhap, mat_khau, vai_tro, trang_thai, ngay_tao
) VALUES
    ('TK_CHU_001', 'quanly.nguyenhoangnam', 'NhaKhoa@123', 'CHU_PHONG_KHAM', 'DANG_HOAT_DONG', CURRENT_TIMESTAMP),
    ('TK_BS_001', 'bs.nguyenminhkhang', 'NhaKhoa@123', 'BAC_SI', 'DANG_HOAT_DONG', CURRENT_TIMESTAMP),
    ('TK_BS_002', 'bs.tranthuhang', 'NhaKhoa@123', 'BAC_SI', 'DANG_HOAT_DONG', CURRENT_TIMESTAMP),
    ('TK_BS_003', 'bs.lequocbao', 'NhaKhoa@123', 'BAC_SI', 'DANG_HOAT_DONG', CURRENT_TIMESTAMP),
    ('TK_BS_004', 'bs.phamthilan', 'NhaKhoa@123', 'BAC_SI', 'DANG_HOAT_DONG', CURRENT_TIMESTAMP),
    ('TK_BS_005', 'bs.vohoanglong', 'NhaKhoa@123', 'BAC_SI', 'DANG_HOAT_DONG', CURRENT_TIMESTAMP),
    ('TK_BN_001', 'bn.phamgiahan', 'NhaKhoa@123', 'BENH_NHAN', 'DANG_HOAT_DONG', CURRENT_TIMESTAMP);

-- 2. Ho so chu phong kham va bac si
-- He thong hien tai dung bang bac_si cho ca chu phong kham de phuc vu luong phan cong.
INSERT INTO bac_si (
    ma_bac_si, ma_tai_khoan, ho_ten, so_dien_thoai, so_chung_chi, dang_lam_viec
) VALUES
    ('BS_CHU_001', 'TK_CHU_001', 'Nguyễn Hoàng Nam', '0901000001', 'CCHN-RHM-0001', TRUE),
    ('BS_001', 'TK_BS_001', 'Nguyễn Minh Khang', '0901000002', 'CCHN-RHM-0101', TRUE),
    ('BS_002', 'TK_BS_002', 'Trần Thu Hằng', '0901000003', 'CCHN-RHM-0102', TRUE),
    ('BS_003', 'TK_BS_003', 'Lê Quốc Bảo', '0901000004', 'CCHN-RHM-0103', TRUE),
    ('BS_004', 'TK_BS_004', 'Phạm Thị Lan', '0901000005', 'CCHN-RHM-0104', TRUE),
    ('BS_005', 'TK_BS_005', 'Võ Hoàng Long', '0901000006', 'CCHN-RHM-0105', TRUE);

-- 3. Phong kham
INSERT INTO phong_kham (
    ma_phong, ten_phong, trang_thai, ghi_chu
) VALUES
    ('PK_01', 'Phòng khám tổng quát 01', 'TRONG', 'Khám tổng quát và tư vấn điều trị'),
    ('PK_02', 'Phòng điều trị 02', 'TRONG', 'Điều trị nội nha và phục hình'),
    ('PK_03', 'Phòng tiểu phẫu 03', 'TRONG', 'Tiểu phẫu và cấy ghép Implant');

-- 4. Hai ca lam viec moi ngay cho 5 bac si trong 7 ngay lien tiep
INSERT INTO ca_lam_viec (
    ma_ca,
    ma_bac_si,
    ngay_lam_viec,
    ca_kham,
    gio_bat_dau,
    gio_ket_thuc,
    so_benh_nhan_toi_da,
    dang_hoat_dong
)
SELECT
    CONCAT('CA_', bac_si.ma_bac_si, '_D', ngay.so_ngay, '_', ca.ma_ca_ngan),
    bac_si.ma_bac_si,
    DATE_ADD(CURRENT_DATE, INTERVAL ngay.so_ngay DAY),
    ca.ca_kham,
    ca.gio_bat_dau,
    ca.gio_ket_thuc,
    10,
    TRUE
FROM (
    SELECT 'BS_001' AS ma_bac_si UNION ALL
    SELECT 'BS_002' UNION ALL
    SELECT 'BS_003' UNION ALL
    SELECT 'BS_004' UNION ALL
    SELECT 'BS_005'
) bac_si
CROSS JOIN (
    SELECT 0 AS so_ngay UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL
    SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6
) ngay
CROSS JOIN (
    SELECT 'CA_SANG' AS ca_kham, 'SANG' AS ma_ca_ngan,
           CAST('08:00:00' AS TIME) AS gio_bat_dau, CAST('12:00:00' AS TIME) AS gio_ket_thuc
    UNION ALL
    SELECT 'CA_CHIEU', 'CHIEU', CAST('13:00:00' AS TIME), CAST('17:00:00' AS TIME)
) ca;

-- 5. Ho so benh nhan khoi tao
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
    'BN_001',
    'TK_BN_001',
    'Phạm Gia Hân',
    '2001-08-18',
    'NU',
    '0902000001',
    'pham.gia.han@example.com',
    'Quận Bình Thạnh, Thành phố Hồ Chí Minh',
    'Không ghi nhận bệnh nền',
    'Không ghi nhận dị ứng thuốc'
);
