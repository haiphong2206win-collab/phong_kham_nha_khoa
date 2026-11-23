# Hướng dẫn test API phòng khám nha khoa bằng Talend API Tester

Tài liệu này dành cho **test thủ công bằng extension Talend API Tester trên Chrome**. Không cần chạy file `.http` trong IntelliJ.

## 1. Chuẩn bị

1. Mở project trong IntelliJ và chạy ứng dụng Spring Boot.
2. Mở Talend API Tester.
3. Dùng địa chỉ gốc sau (nếu ứng dụng chạy cổng khác thì thay lại):

   `http://localhost:8080`

4. Với request có JSON, chọn method phù hợp, nhập URL, mở phần **Body** và chọn JSON.
5. Thêm header `Content-Type` với giá trị `application/json` cho request gửi JSON.
6. Với API cần đăng nhập, thêm header:

   `Authorization: Bearer <TOKEN_CUA_VAI_TRO_DANG_TEST>`

   Thay phần trong dấu `<...>` bằng token thật nhận được khi đăng nhập. Không gửi dấu `<` và `>`.

> Lưu ý: URL trong tài liệu dựa theo mapping của các Controller trong project ZIP mới nhất. Nếu bạn đã sửa mapping sau khi gửi ZIP, hãy ưu tiên URL đang có trong code hiện tại.

## 2. Tài khoản dữ liệu khởi tạo

Theo `data.sql` trong project:

| Vai trò                           | Tên đăng nhập             | Mật khẩu      | Mã hồ sơ       |
|-----------------------------------|---------------------------|---------------|----------------|
| Chủ phòng khám – Nguyễn Hoàng Nam | `quanly.nguyenhoangnam`   | `NhaKhoa@123` | `BS_CHU_001`   |
| Bác sĩ – Nguyễn Minh Khang        | `bs.nguyenminhkhang`      | `NhaKhoa@123` | `BS_001`       |
| Bác sĩ – Trần Thu Hằng            | `bs.tranthuhang`          | `NhaKhoa@123` | `BS_002`       |
| Bác sĩ – Lê Quốc Bảo              | `bs.lequocbao`            | `NhaKhoa@123` | `BS_003`       |
| Bác sĩ – Phạm Thị Lan             | `bs.phamthilan`           | `NhaKhoa@123` | `BS_004`       |
| Bác sĩ – Võ Hoàng Long            | `bs.vohoanglong`          | `NhaKhoa@123` | `BS_005`       |
| Bệnh nhân – Phạm Gia Hân          | `bn.phamgiahan`           | `NhaKhoa@123` | `BN_001`       |

Mỗi bác sĩ `BS_001`–`BS_005` có ca sáng `08:00–12:00` và ca chiều `13:00–17:00` trong 7 ngày liên tiếp, tính từ ngày backend khởi động đến 6 ngày tiếp theo. Mỗi ca nhận tối đa 10 bệnh nhân.

Nếu đăng nhập báo sai mật khẩu, hãy kiểm tra dữ liệu `data.sql` và bảo đảm đã chạy bước nạp dữ liệu ban đầu. `DataInitializer` bổ sung idempotent bác sĩ/ca mẫu còn thiếu và tự mã hóa mật khẩu chưa mã hóa bằng BCrypt.

Nếu database được tạo từ phiên bản cũ và vẫn còn tài khoản có hậu tố `DEMO`, hãy sao lưu dữ liệu cần giữ, tạo lại `clinic_db`, rồi chạy backend một lần với `spring.sql.init.mode=always` theo README. Việc tạo lại database sẽ xóa dữ liệu cũ.

## 3. Bước đầu tiên: đăng nhập lấy JWT

### 3.1. Đăng nhập bệnh nhân

- **Method:** `POST`
- **URL:** `http://localhost:8080/api/v1/xac-thuc/dang-nhap`
- **Header:** `Content-Type: application/json`
- **Body:**

```json
{
  "tenDangNhap": "bn.phamgiahan",
  "matKhau": "NhaKhoa@123"
}
```

Trong response, tìm trường `token` và sao chép giá trị. Dùng token này cho các API của bệnh nhân.

### 3.2. Đăng nhập chủ phòng khám

Gửi request đăng nhập tương tự nhưng đổi body thành:

```json
{
  "tenDangNhap": "quanly.nguyenhoangnam",
  "matKhau": "NhaKhoa@123"
}
```

Sao chép `token` riêng cho chủ phòng khám.

### 3.3. Đăng nhập bác sĩ

```json
{
  "tenDangNhap": "bs.nguyenminhkhang",
  "matKhau": "NhaKhoa@123"
}
```

Sao chép `token` riêng cho bác sĩ. Khi test phân quyền, đừng dùng nhầm token của vai trò khác.

Response đăng nhập dự kiến có các trường tương tự:

```json
{
  "token": "<JWT_THUC_TE_TRA_VE>",
  "loaiToken": "Bearer",
  "maTaiKhoan": "TK_BN_001",
  "tenDangNhap": "bn.phamgiahan",
  "vaiTro": "BENH_NHAN"
}
```

Token là chuỗi thực tế do server sinh ra; ví dụ trên chỉ minh họa cấu trúc.

## 4. Luồng test nghiệp vụ chính nên chạy theo thứ tự

### Bước 1 — Bệnh nhân xem hồ sơ

- **Method:** `GET`
- **URL:** `http://localhost:8080/api/v1/benh-nhan/ho-so-cua-toi`
- **Authorization:** token bệnh nhân
- **Body:** không cần

Kiểm tra response là hồ sơ của `BN_001` và không trả về mật khẩu hay JWT của tài khoản.

### Bước 2 — Bệnh nhân cập nhật hồ sơ

- **Method:** `PUT`
- **URL:** `http://localhost:8080/api/v1/benh-nhan/ho-so-cua-toi`
- **Authorization:** token bệnh nhân
- **Header:** `Content-Type: application/json`
- **Body mẫu:**

```json
{
  "hoTen": "Phạm Gia Hân",
  "ngaySinh": "2001-08-18",
  "gioiTinh": "NU",
  "soDienThoai": "0902000001",
  "email": "pham.gia.han@example.com",
  "diaChi": "Quận Bình Thạnh, Thành phố Hồ Chí Minh",
  "tienSuBenh": "Không ghi nhận bệnh nền",
  "diUngThuoc": "Không ghi nhận dị ứng thuốc"
}
```

Ngày sinh phải là ngày trong quá khứ; số điện thoại phải có 10 chữ số và bắt đầu bằng `0`. Có thể thay dữ liệu nhưng giữ đúng định dạng.

### Bước 3 — Bệnh nhân gửi yêu cầu đặt lịch

- **Method:** `POST`
- **URL:** `http://localhost:8080/api/v1/yeu-cau-dat-lich`
- **Authorization:** token bệnh nhân
- **Header:** `Content-Type: application/json`
- **Body mẫu:**

```json
{
  "ngayMongMuon": "THAY_BANG_NGAY_MAI_YYYY-MM-DD",
  "caKham": "CA_SANG",
  "lyDoKham": "Kiem tra rang dau",
  "ghiChu": "Day la yeu cau dat lich de test"
}
```

Hệ thống tạo ca làm việc cho **7 ngày liên tiếp**, từ ngày backend khởi động đến 6 ngày tiếp theo. Trước khi gửi request, thay `THAY_BANG_NGAY_MAI_YYYY-MM-DD` bằng một ngày nằm trong khoảng này; nên chọn ngày mai để thuận tiện test.

Sau khi gửi thành công, sao chép trường `maYeuCau` trong response. Gọi bước tiếp theo bằng mã này. Trạng thái ban đầu thường là `CHO_PHAN_CONG`.

Để kiểm thử hủy một yêu cầu còn chờ phân công:

- **Method:** `PATCH`
- **URL:** `http://localhost:8080/api/v1/yeu-cau-dat-lich/MA_YEU_CAU_THUC_TE/huy`
- **Authorization:** token bệnh nhân sở hữu yêu cầu
- **Header:** `Content-Type: application/json`
- **Body tùy chọn:**

```json
{
  "lyDo": "Bệnh nhân thay đổi kế hoạch"
}
```

Chỉ yêu cầu ở trạng thái `CHO_PHAN_CONG` mới được hủy. Hãy tạo một yêu cầu khác nếu vẫn muốn tiếp tục luồng phân công bên dưới.

### Bước 4 — Chủ phòng khám xem tất cả yêu cầu

- **Method:** `GET`
- **URL:** `http://localhost:8080/api/v1/quan-ly/yeu-cau-dat-lich`
- **Authorization:** token chủ phòng khám
- **Body:** không cần

Tìm yêu cầu vừa tạo và ghi lại `maYeuCau`. Nếu không thấy, kiểm tra lại bước 3 và trạng thái response.

### Bước 5 — Chủ phòng khám phân công yêu cầu cho bác sĩ

- **Method:** `POST`
- **URL:** `http://localhost:8080/api/v1/phan-cong`
- **Authorization:** token chủ phòng khám
- **Header:** `Content-Type: application/json`
- **Body mẫu:**

```json
{
  "maChuPhongKham": "BS_CHU_001",
  "maYeuCau": "THAY_BANG_MA_YEU_CAU_THUC_TE",
  "maBacSi": "BS_002",
  "maPhong": "PK_02",
  "gioBatDau": "08:30:00",
  "thoiLuongPhut": 30
}
```

Trước khi gửi, thay `THAY_BANG_MA_YEU_CAU_THUC_TE` bằng mã ở bước 3/4. Các mã khởi tạo tương ứng là `BS_CHU_001`, `BS_002`, `PK_02`. Giờ bắt đầu phải nằm trong ca làm việc của bác sĩ vào đúng ngày yêu cầu; ví dụ `08:30:00` nằm trong ca sáng `08:00–12:00`. Nếu chọn ngày hoặc ca khác, cần có ca làm việc tương ứng.

Nếu phân công thành công, ghi lại `maLich` từ response. Nếu response không chứa `maLich`, xem nội dung response để xác định mã lịch được tạo.

### Bước 6 — Bệnh nhân xem thông báo

- **Method:** `GET`
- **URL:** `http://localhost:8080/api/v1/thong-bao`
- **Authorization:** token bệnh nhân
- **Body:** không cần

Phân công lịch có thể tạo thông báo cho bệnh nhân. Tìm mã thông báo (`maThongBao`) trong response.

Đếm thông báo chưa đọc:

- **Method:** `GET`
- **URL:** `http://localhost:8080/api/v1/thong-bao/chua-doc/dem`
- **Authorization:** token bệnh nhân

Đánh dấu một thông báo đã đọc:

- **Method:** `PATCH`
- **URL:** `http://localhost:8080/api/v1/thong-bao/MA_THONG_BAO_THUC_TE/da-doc`
- **Authorization:** token bệnh nhân

Thay `MA_THONG_BAO_THUC_TE` bằng mã thông báo thực tế.

### Bước 7 — Bệnh nhân xác nhận lịch đã được phân công

- **Method:** `PATCH`
- **URL:** `http://localhost:8080/api/v1/benh-nhan/lich-kham/MA_LICH_THUC_TE/xac-nhan`
- **Authorization:** token bệnh nhân
- **Body:** không cần

Thay `MA_LICH_THUC_TE` bằng mã lịch thực tế lấy ở bước 5 hoặc từ API lịch phù hợp. Chỉ xác nhận lịch thuộc về bệnh nhân đang đăng nhập.

Nếu muốn test nhánh từ chối thay vì xác nhận, dùng:

- **Method:** `PATCH`
- **URL:** `http://localhost:8080/api/v1/benh-nhan/lich-kham/MA_LICH_THUC_TE/tu-choi`
- **Authorization:** token bệnh nhân
- **Header:** `Content-Type: application/json`
- **Body:**

```json
{
  "lyDo": "Thoi gian nay toi khong the den kham"
}
```

Nên tạo một yêu cầu mới nếu muốn test cả xác nhận và từ chối, vì trạng thái lịch có thể không cho thực hiện cả hai hành động trên cùng một lịch.

### Bước 8 — Bác sĩ xem lịch của mình

- **Method:** `GET`
- **URL:** `http://localhost:8080/api/v1/bac-si/lich-kham`
- **Authorization:** token của bác sĩ được phân công, ví dụ `bs.tranthuhang`
- **Body:** không cần

Tìm lịch vừa phân công và sao chép `maLich` nếu cần.

### Bước 9 — Bác sĩ xem bệnh nhân trong lịch

- **Method:** `GET`
- **URL:** `http://localhost:8080/api/v1/bac-si/lich-kham/MA_LICH_THUC_TE/benh-nhan`
- **Authorization:** token đúng bác sĩ được phân công
- **Body:** không cần

Thay `MA_LICH_THUC_TE` bằng mã lịch thực tế. Dùng token bác sĩ khác để kiểm tra rằng không thể xem lịch không thuộc phạm vi của mình.

### Bước 10 — Bác sĩ cập nhật trạng thái lịch

- **Method:** `PATCH`
- **URL:** `http://localhost:8080/api/v1/bac-si/lich-kham/MA_LICH_THUC_TE/trang-thai`
- **Authorization:** token bác sĩ được phân công
- **Header:** `Content-Type: application/json`
- **Body mẫu:**

```json
{
  "trangThai": "DA_DEN"
}
```

Các giá trị enum trong project gồm:

- `CHO_BENH_NHAN_XAC_NHAN`
- `DA_XAC_NHAN`
- `YEU_CAU_THAY_DOI`
- `DA_DEN`
- `DANG_KHAM`
- `HOAN_THANH`
- `VANG_MAT`
- `DA_HUY`

Hãy cập nhật theo đúng quy trình nghiệp vụ và trạng thái hiện tại. Không phải trạng thái nào cũng hợp lệ ở mọi thời điểm.

### Bước 11 — Bác sĩ xem các lộ trình mẫu và danh sách buổi

- **Method:** `GET`
- **URL:** `http://localhost:8080/api/v1/lo-trinh-mau`
- **Authorization:** token bác sĩ

Chọn một `maLoTrinh` trong response để tạo lộ trình riêng. Ba mã mẫu hiện tại là `NIENG_RANG`, `IMPLANT` và `DIEU_TRI_TUY`.

Gọi thêm API sau để biết chính xác số buổi và thứ tự phải xếp lịch:

- **Method:** `GET`
- **URL:** `http://localhost:8080/api/v1/lo-trinh-mau/DIEU_TRI_TUY/buoi`
- **Authorization:** token bác sĩ

Ví dụ `DIEU_TRI_TUY` có 4 buổi, vì vậy request tạo lộ trình phải chứa lịch của đủ các buổi 2, 3 và 4. Buổi 1 chính là ca khám đầu tiên đã hoàn thành.

### Bước 12 — Bác sĩ tạo lộ trình cho bệnh nhân được phân công

- **Method:** `POST`
- **URL:** `http://localhost:8080/api/v1/lo-trinh-dieu-tri`
- **Authorization:** token đúng bác sĩ được phân công
- **Header:** `Content-Type: application/json`
- **Body mẫu:**

```json
{
  "maBenhNhan": "BN_001",
  "maLoTrinhMau": "DIEU_TRI_TUY",
  "tenLoTrinh": "Lộ trình điều trị của Phạm Gia Hân",
  "ghiChu": "Theo dõi bởi bác sĩ được phân công",
  "maLichKhamBanDau": "THAY_BANG_MA_LICH_DA_HOAN_THANH",
  "lichCacBuoiTiepTheo": [
    {
      "soThuTu": 2,
      "ngayKham": "THAY_BANG_NGAY_TUONG_LAI_1_YYYY-MM-DD",
      "gioBatDau": "09:00:00",
      "thoiLuongPhut": 60
    },
    {
      "soThuTu": 3,
      "ngayKham": "THAY_BANG_NGAY_TUONG_LAI_2_YYYY-MM-DD",
      "gioBatDau": "09:00:00",
      "thoiLuongPhut": 60
    },
    {
      "soThuTu": 4,
      "ngayKham": "THAY_BANG_NGAY_TUONG_LAI_3_YYYY-MM-DD",
      "gioBatDau": "09:00:00",
      "thoiLuongPhut": 60
    }
  ]
}
```

Thay mã lịch bằng `maLich` ở bước 5 và hoàn tất chuỗi trạng thái ở bước 10 cho tới `HOAN_THANH` trước khi tạo lộ trình. Ba ngày tương lai phải tăng dần; nên chọn các ngày khác nhau và bảo đảm không trùng lịch hiện có. Số phần tử trong `lichCacBuoiTiepTheo` phải đúng bằng tổng số buổi mẫu trừ một và `soThuTu` phải liên tục từ 2.

Khi thành công, hệ thống thực hiện trong cùng một giao dịch:

- Gắn ca khám đã hoàn thành vào buổi 1 và chuyển lộ trình sang `DANG_DIEU_TRI`.
- Tạo lịch `DA_XAC_NHAN` cho mọi buổi tiếp theo, dùng cùng bác sĩ và phòng của ca đầu.
- Kiểm tra trùng lịch bác sĩ, phòng khám và bệnh nhân.
- Gửi thông báo cho bệnh nhân. Bệnh nhân không cần xác nhận lại các lịch này, chỉ xem trong **Lộ trình điều trị** và **Lịch khám của tôi**.

Bác sĩ được phép tiếp tục quản lý lộ trình của bệnh nhân mình phụ trách sau khi lịch đầu ở trạng thái `HOAN_THANH`. Chủ phòng khám vẫn có quyền với mọi bệnh nhân.

### Bước 13 — Xem lộ trình và các buổi điều trị

Danh sách lộ trình của bệnh nhân:

- **Method:** `GET`
- **URL:** `http://localhost:8080/api/v1/lo-trinh-dieu-tri/benh-nhan/BN_001`
- **Authorization:** token bác sĩ phụ trách hoặc token chủ phòng khám

Danh sách buổi của một lộ trình:

- **Method:** `GET`
- **URL:** `http://localhost:8080/api/v1/lo-trinh-dieu-tri/MA_LO_TRINH_DIEU_TRI/buoi`
- **Authorization:** token bác sĩ phụ trách hoặc token chủ phòng khám

Lấy `maLoTrinhDieuTri` và `maBuoiDieuTri` thực tế từ response cho các bước tiếp theo.

Mỗi buổi đã liên kết lịch sẽ có thêm `ngayKham`, `gioBatDau`, `gioKetThuc`, `tenBacSi` và `tenPhong`. Dùng token bệnh nhân gọi API lịch của bệnh nhân hoặc kiểm tra trên giao diện **Lịch khám của tôi** để xác nhận cả ba lịch tương lai đều hiển thị.

### Bước 14 — Bác sĩ thêm buổi điều trị bổ sung

- **Method:** `POST`
- **URL:** `http://localhost:8080/api/v1/lo-trinh-dieu-tri/MA_LO_TRINH_DIEU_TRI/buoi`
- **Authorization:** token bác sĩ phụ trách
- **Header:** `Content-Type: application/json`
- **Body mẫu:**

```json
{
  "soThuTu": 2,
  "tenBuoi": "Tái khám bổ sung",
  "noiDung": "Kiểm tra đáp ứng điều trị và điều chỉnh kế hoạch",
  "khoangCachMin": 3,
  "khoangCachMax": 7,
  "ghiChu": "Theo dõi thêm nếu còn đau"
}
```

`soThuTu` phải là vị trí hợp lệ. Nếu chèn giữa lộ trình, các buổi bị dịch thứ tự phải đang ở trạng thái `CHUA_LEN_LICH`.

### Bước 15 — Bác sĩ chỉnh sửa buổi chưa lên lịch hoặc buổi sắp tới

- **Method:** `PUT`
- **URL:** `http://localhost:8080/api/v1/lo-trinh-dieu-tri/MA_LO_TRINH_DIEU_TRI/buoi/MA_BUOI_DIEU_TRI`
- **Authorization:** token bác sĩ phụ trách
- **Header:** `Content-Type: application/json`
- **Body mẫu:**

```json
{
  "tenBuoi": "Tái khám và đánh giá tiến độ",
  "noiDung": "Khám lại, chụp phim nếu cần và cập nhật chỉ định",
  "khoangCachMin": 5,
  "khoangCachMax": 10,
  "ghiChu": "Cập nhật chỉ định điều trị"
}
```

Với buổi `DA_LEN_LICH` còn ở tương lai, gửi thêm đầy đủ ba trường lịch hẹn:

```json
{
  "tenBuoi": "Tái khám và đánh giá tiến độ",
  "noiDung": "Khám lại, chụp phim nếu cần và cập nhật chỉ định",
  "khoangCachMin": 5,
  "khoangCachMax": 10,
  "ghiChu": "Bệnh nhân đã thống nhất đổi lịch",
  "ngayKham": "THAY_BANG_NGAY_TUONG_LAI_YYYY-MM-DD",
  "gioBatDau": "14:00:00",
  "thoiLuongPhut": 45
}
```

Điều kiện và kết quả cần kiểm tra:

- Lộ trình phải ở `CHUA_BAT_DAU` hoặc `DANG_DIEU_TRI`; buổi phải là `CHUA_LEN_LICH`, hoặc `DA_LEN_LICH` có thời điểm bắt đầu còn ở tương lai.
- Khi đổi lịch của buổi `DA_LEN_LICH`, `ngayKham`, `gioBatDau`, `thoiLuongPhut` phải được gửi cùng nhau; thời lượng từ 15 đến 480 phút.
- Lịch mới phải ở tương lai, nằm trọn trong một ca làm việc đang hoạt động và không trùng lịch của bác sĩ, phòng khám hoặc bệnh nhân.
- Thành công trả `200 OK`, cập nhật cả buổi điều trị lẫn bản ghi lịch khám và tạo thông báo loại `LICH_DA_CAP_NHAT` cho bệnh nhân.
- Buổi trong quá khứ hoặc ở trạng thái `DANG_THUC_HIEN`, `HOAN_THANH`, `DA_BO`, `TAM_HOAN`, `LICH_DA_HUY` phải bị từ chối bằng `409 Conflict`.

### Bước 16 — Bác sĩ bỏ một buổi chưa lên lịch

- **Method:** `PATCH`
- **URL:** `http://localhost:8080/api/v1/lo-trinh-dieu-tri/MA_LO_TRINH_DIEU_TRI/buoi/MA_BUOI_DIEU_TRI/bo`
- **Authorization:** token bác sĩ phụ trách
- **Header:** `Content-Type: application/json`
- **Body mẫu:**

```json
{
  "lyDoBo": "Bệnh nhân đáp ứng tốt nên không cần thực hiện buổi này"
}
```

Thao tác này không xóa bản ghi mà chuyển trạng thái buổi thành `DA_BO`. Chủ phòng khám có thể gọi các API tạo, xem, thêm, sửa và bỏ buổi tương tự bằng token chủ phòng khám.

## 5. Các API quản lý khác

### Chủ phòng khám — xem hồ sơ

| Method | URL | Mục đích |
|---|---|---|
| GET | `/api/v1/quan-ly/bac-si` | Danh sách bác sĩ |
| GET | `/api/v1/quan-ly/bac-si/BS_002` | Chi tiết bác sĩ |
| GET | `/api/v1/quan-ly/benh-nhan` | Danh sách bệnh nhân |
| GET | `/api/v1/quan-ly/benh-nhan/BN_001` | Chi tiết bệnh nhân |
| GET | `/api/v1/tai-khoan` | Danh sách tài khoản |
| GET | `/api/v1/tai-khoan?vaiTro=BAC_SI` | Lọc theo vai trò |
| GET | `/api/v1/tai-khoan/TK_BS_001` | Chi tiết tài khoản |

Tất cả các URL trên dùng `http://localhost:8080` làm gốc và cần token chủ phòng khám.

### Chủ phòng khám — tạo tài khoản bác sĩ

- **Method:** `POST`
- **URL:** `http://localhost:8080/api/v1/tai-khoan/bac-si`
- **Authorization:** token chủ phòng khám
- **Body:**

```json
{
  "tenDangNhap": "bacsi_test4",
  "matKhau": "password123",
  "hoTen": "Pham Van Test",
  "soDienThoai": "0900000014",
  "soChungChi": "CC-BS-TEST4"
}
```

### Chủ phòng khám — tạo tài khoản bệnh nhân

- **Method:** `POST`
- **URL:** `http://localhost:8080/api/v1/tai-khoan/benh-nhan`
- **Authorization:** token chủ phòng khám
- **Body:**

```json
{
  "tenDangNhap": "benhnhan_test2",
  "matKhau": "password123",
  "hoTen": "Nguyen Thi Test",
  "ngaySinh": "2003-08-12",
  "gioiTinh": "NU",
  "soDienThoai": "0900000015",
  "email": "benhnhan.test2@example.com",
  "diaChi": "Ha Noi"
}
```

Tên đăng nhập phải chưa tồn tại. Mật khẩu tối thiểu 8 ký tự.

### Chủ phòng khám — khóa/kích hoạt tài khoản

- **Method:** `PATCH`
- **URL:** `http://localhost:8080/api/v1/tai-khoan/MA_TAI_KHOAN/trang-thai`
- **Authorization:** token chủ phòng khám
- **Body:**

```json
{
  "dangHoatDong": false
}
```

Dùng `true` để kích hoạt lại. Không thử khóa tài khoản chủ phòng khám đang đăng nhập; service chủ động chặn thao tác đó.

### Chủ phòng khám — từ chối yêu cầu đặt lịch

- **Method:** `POST`
- **URL:** `http://localhost:8080/api/v1/phan-cong/tu-choi`
- **Authorization:** token chủ phòng khám
- **Body:**

```json
{
  "maChuPhongKham": "BS_CHU_001",
  "maYeuCau": "THAY_BANG_MA_YEU_CAU_THUC_TE",
  "lyDo": "Khong con khung gio phu hop"
}
```

Nên dùng một yêu cầu khác chưa được phân công để test từ chối.

## 6. Kiểm thử xác thực và phân quyền

Sau khi các matcher trong `CauHinhBaoMat` đã được sửa khớp với URL hiện tại, thử các trường hợp sau:

| Ca kiểm thử              | Cách làm                                                                        | Kết quả mong đợi                                             |
|--------------------------|---------------------------------------------------------------------------------|--------------------------------------------------------------|
| Không có token           | Gọi API cần đăng nhập mà không thêm `Authorization`                             | `401 Unauthorized`                                           |
| Token sai/hết hạn        | Gửi token không hợp lệ                                                          | Thường là `401 Unauthorized`                                 |
| Sai vai trò              | Dùng token bác sĩ gọi `/api/v1/quan-ly/bac-si`                                  | `403 Forbidden`                                              |
| Đúng vai trò             | Dùng token chủ phòng khám gọi `/api/v1/quan-ly/bac-si`                          | Thành công nếu dữ liệu và ứng dụng hợp lệ                    |
| Tài khoản bị khóa        | Khóa một tài khoản khởi tạo không dùng để đăng nhập hiện tại, rồi thử đăng nhập lại | Đăng nhập bị từ chối                                      |
| Sai quyền sở hữu dữ liệu | Bác sĩ khác thử xem lịch không được phân công cho mình                          | Bị từ chối nếu kiểm tra quyền sở hữu đã được triển khai đúng |
| Bác sĩ tạo lộ trình       | Dùng lịch đầu chưa `HOAN_THANH`, thiếu một buổi tương lai hoặc chọn giờ bị trùng | Request bị từ chối và không tạo lộ trình/lịch dở dang          |
| Bác sĩ phụ trách lộ trình | Dùng token bác sĩ được phân công tạo/xem lộ trình khi lịch đầu đã `HOAN_THANH` | Thành công; lộ trình và toàn bộ lịch tương lai được tạo        |
| Bác sĩ khác xem lộ trình  | Dùng token bác sĩ không được phân công gọi lộ trình của `BN_001`                | `403 Forbidden`                                               |
| Chủ sửa lộ trình          | Dùng token chủ phòng khám thêm/sửa/bỏ buổi của bất kỳ bệnh nhân                 | Thành công nếu trạng thái lộ trình và buổi cho phép           |
| Bác sĩ đổi buổi sắp tới   | Đổi sang giờ hợp lệ, không trùng lịch và còn trong ca làm việc                  | `200 OK`; lịch đổi và bệnh nhân nhận thông báo                |
| Bác sĩ đổi lịch không hợp lệ | Dùng giờ quá khứ, ngoài ca hoặc trùng bác sĩ/phòng/bệnh nhân                  | `400/409`; không ghi dở dang buổi, lịch hay thông báo         |

Nếu request sai vai trò vẫn thành công, kiểm tra lại matcher trong `CauHinhBaoMat` và thứ tự các quy tắc `requestMatchers`. Nếu không có token mà API vẫn trả dữ liệu, cần sửa cấu hình trước khi tiếp tục test nghiệp vụ.

## 7. Các điểm cần nhớ khi test

- Đăng nhập mỗi vai trò riêng và giữ riêng từng JWT.
- Luôn gửi `Authorization: Bearer ...` cho API cần đăng nhập.
- Khi tạo yêu cầu, lấy `maYeuCau` từ response, không tự đoán mã.
- Khi phân công, dùng đúng mã hồ sơ chủ phòng khám `BS_CHU_001`, mã bác sĩ, mã phòng và mã yêu cầu tồn tại.
- Ngày yêu cầu phải khớp ngày ca làm việc; giờ phân công phải nằm trong ca làm việc và không bị trùng lịch.
- Năm bác sĩ mẫu có hai ca mỗi ngày trong 7 ngày tính từ ngày backend khởi động; không chọn ngày nằm ngoài khoảng này khi test phân công.
- Bác sĩ chỉ quản lý lộ trình của bệnh nhân đã được phân công cho chính mình. Chỉ ca khám `HOAN_THANH` mới được chọn làm buổi đầu; một ca khám đầu không được dùng cho hai lộ trình.
- Khi tạo lộ trình, phải truyền ngày giờ chính xác cho tất cả các buổi còn lại. Các lịch này được xác nhận tự động để bệnh nhân chỉ cần xem và đến khám.
- Khi sửa buổi đã lên lịch, ba trường `ngayKham`, `gioBatDau`, `thoiLuongPhut` phải đi cùng nhau. Việc cập nhật buổi, lịch và thông báo nằm trong cùng một transaction.
- Bệnh nhân có thể hủy yêu cầu của chính mình bằng `PATCH /api/v1/yeu-cau-dat-lich/{maYeuCau}/huy` khi yêu cầu vẫn ở trạng thái `CHO_PHAN_CONG`.
- Nếu dùng H2 `mem`, dữ liệu thường được tạo lại khi khởi động ứng dụng. Nếu dùng database lưu bền, tránh chạy lại script insert trên dữ liệu đã có vì có thể trùng khóa.

## 8. Checklist test nhanh

- [ ] Đăng nhập bệnh nhân và nhận JWT.
- [ ] Xem hồ sơ bệnh nhân.
- [ ] Cập nhật hồ sơ bệnh nhân.
- [ ] Gửi yêu cầu đặt lịch và lưu `maYeuCau`.
- [ ] Tạo một yêu cầu phụ và kiểm tra hủy khi còn `CHO_PHAN_CONG`.
- [ ] Chủ phòng khám xem danh sách yêu cầu.
- [ ] Chủ phòng khám phân công và lưu `maLich`.
- [ ] Bệnh nhân xem thông báo và xác nhận lịch.
- [ ] Bác sĩ xem lịch của mình.
- [ ] Bác sĩ xem thông tin bệnh nhân trong lịch.
- [ ] Bác sĩ cập nhật trạng thái lịch.
- [ ] Hoàn thành ca khám đầu, rồi dùng đúng bác sĩ được phân công tạo lộ trình từ phác đồ mẫu.
- [ ] Nhập đủ ngày giờ chính xác cho mọi buổi tiếp theo; kiểm tra lộ trình chuyển `DANG_DIEU_TRI`.
- [ ] Sửa nội dung và ngày giờ của một buổi `DA_LEN_LICH` trong tương lai; kiểm tra lịch bệnh nhân đổi theo.
- [ ] Kiểm tra bệnh nhân nhận thông báo `LICH_DA_CAP_NHAT` sau khi sửa thành công.
- [ ] Thử giờ quá khứ, ngoài ca và trùng lịch; xác nhận API từ chối và không tạo thông báo.
- [ ] Bệnh nhân nhận thông báo, thấy ngày giờ trong Lộ trình điều trị và thấy các buổi trong Lịch khám của tôi.
- [ ] Bác sĩ thêm, chỉnh sửa và bỏ một buổi `CHUA_LEN_LICH`.
- [ ] Bác sĩ khác không được phân công nhận `403` khi truy cập lộ trình.
- [ ] Chủ phòng khám vẫn xem và chỉnh sửa được lộ trình.
- [ ] Test thiếu token (`401`) và sai vai trò (`403`).
