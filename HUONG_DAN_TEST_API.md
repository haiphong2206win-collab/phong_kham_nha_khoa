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

## 2. Tài khoản dữ liệu demo

Theo `data.sql` trong project:

| Vai trò        | Tên đăng nhập   | Mật khẩu   | Mã hồ sơ      |
|----------------|-----------------|------------|---------------|
| Chủ phòng khám | `chu_demo`      | `password` | `BS_CHU_DEMO` |
| Bác sĩ         | `bacsi_demo`    | `password` | `BS_DEMO`     |
| Bác sĩ 2       | `bacsi_demo2`   | `password` | `BS_DEMO2`    |
| Bác sĩ 3       | `bacsi_demo3`   | `password` | `BS_DEMO3`    |
| Bệnh nhân      | `benhnhan_demo` | `password` | `BN_DEMO`     |

Nếu đăng nhập bằng một tài khoản báo sai mật khẩu, hãy kiểm tra lại dữ liệu `data.sql` và BCrypt hash đang dùng. Không cần tạo lại tài khoản nếu dữ liệu demo đã tồn tại.

## 3. Bước đầu tiên: đăng nhập lấy JWT

### 3.1. Đăng nhập bệnh nhân

- **Method:** `POST`
- **URL:** `http://localhost:8080/api/v1/xac-thuc/dang-nhap`
- **Header:** `Content-Type: application/json`
- **Body:**

```json
{
  "tenDangNhap": "benhnhan_demo",
  "matKhau": "password"
}
```

Trong response, tìm trường `token` và sao chép giá trị. Dùng token này cho các API của bệnh nhân.

### 3.2. Đăng nhập chủ phòng khám

Gửi request đăng nhập tương tự nhưng đổi body thành:

```json
{
  "tenDangNhap": "chu_demo",
  "matKhau": "password"
}
```

Sao chép `token` riêng cho chủ phòng khám.

### 3.3. Đăng nhập bác sĩ

```json
{
  "tenDangNhap": "bacsi_demo",
  "matKhau": "password"
}
```

Sao chép `token` riêng cho bác sĩ. Khi test phân quyền, đừng dùng nhầm token của vai trò khác.

Response đăng nhập dự kiến có các trường tương tự:

```json
{
  "token": "<JWT_THUC_TE_TRA_VE>",
  "loaiToken": "Bearer",
  "maTaiKhoan": "TK_BN_DEMO",
  "tenDangNhap": "benhnhan_demo",
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

Kiểm tra response là hồ sơ của `BN_DEMO` và không trả về mật khẩu hay JWT của tài khoản.

### Bước 2 — Bệnh nhân cập nhật hồ sơ

- **Method:** `PUT`
- **URL:** `http://localhost:8080/api/v1/benh-nhan/ho-so-cua-toi`
- **Authorization:** token bệnh nhân
- **Header:** `Content-Type: application/json`
- **Body mẫu:**

```json
{
  "hoTen": "Le Minh Duc",
  "ngaySinh": "2004-05-15",
  "gioiTinh": "NAM",
  "soDienThoai": "0900000005",
  "email": "benhnhan.demo@example.com",
  "diaChi": "Ha Noi",
  "tienSuBenh": "Chua ghi nhan",
  "diUngThuoc": "Chua ghi nhan"
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
  "ngayMongMuon": "2026-10-24",
  "caKham": "CA_SANG",
  "lyDoKham": "Kiem tra rang dau",
  "ghiChu": "Day la yeu cau dat lich de test"
}
```

`data.sql` tạo ca làm việc vào **ngày hôm sau**. Ví dụ trên dùng ngày `2026-10-24` vì bộ dữ liệu được chuẩn bị ngày `2026-10-23`. Nếu chạy vào ngày khác, hãy thay `ngayMongMuon` thành ngày mai theo máy của bạn, hoặc kiểm tra ngày thực tế trong dữ liệu.

Sau khi gửi thành công, sao chép trường `maYeuCau` trong response. Gọi bước tiếp theo bằng mã này. Trạng thái ban đầu thường là `CHO_PHAN_CONG`.

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
  "maChuPhongKham": "BS_CHU_DEMO",
  "maYeuCau": "THAY_BANG_MA_YEU_CAU_THUC_TE",
  "maBacSi": "BS_DEMO2",
  "maPhong": "P_DEMO2",
  "gioBatDau": "08:30:00",
  "thoiLuongPhut": 30
}
```

Trước khi gửi, thay `THAY_BANG_MA_YEU_CAU_THUC_TE` bằng mã ở bước 3/4. Các mã demo trong `data.sql` là `BS_CHU_DEMO`, `BS_DEMO2`, `P_DEMO2`. Giờ bắt đầu phải nằm trong ca làm việc của bác sĩ vào đúng ngày yêu cầu; ví dụ `08:30:00` nằm trong ca sáng `08:00–12:00`. Nếu chọn ngày hoặc ca khác, cần có ca làm việc tương ứng.

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
- **Authorization:** token của bác sĩ được phân công, ví dụ `bacsi_demo2`
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

## 5. Các API quản lý khác

### Chủ phòng khám — xem hồ sơ

| Method | URL | Mục đích |
|---|---|---|
| GET | `/api/v1/quan-ly/bac-si` | Danh sách bác sĩ |
| GET | `/api/v1/quan-ly/bac-si/BS_DEMO2` | Chi tiết bác sĩ |
| GET | `/api/v1/quan-ly/benh-nhan` | Danh sách bệnh nhân |
| GET | `/api/v1/quan-ly/benh-nhan/BN_DEMO` | Chi tiết bệnh nhân |
| GET | `/api/v1/tai-khoan` | Danh sách tài khoản |
| GET | `/api/v1/tai-khoan?vaiTro=BAC_SI` | Lọc theo vai trò |
| GET | `/api/v1/tai-khoan/TK_BS_DEMO` | Chi tiết tài khoản |

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
  "maChuPhongKham": "BS_CHU_DEMO",
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
| Tài khoản bị khóa        | Khóa một tài khoản demo không dùng để đăng nhập hiện tại, rồi thử đăng nhập lại | Đăng nhập bị từ chối                                         |
| Sai quyền sở hữu dữ liệu | Bác sĩ khác thử xem lịch không được phân công cho mình                          | Bị từ chối nếu kiểm tra quyền sở hữu đã được triển khai đúng |

Nếu request sai vai trò vẫn thành công, kiểm tra lại matcher trong `CauHinhBaoMat` và thứ tự các quy tắc `requestMatchers`. Nếu không có token mà API vẫn trả dữ liệu, cần sửa cấu hình trước khi tiếp tục test nghiệp vụ.

## 7. Các điểm cần nhớ khi test

- Đăng nhập mỗi vai trò riêng và giữ riêng từng JWT.
- Luôn gửi `Authorization: Bearer ...` cho API cần đăng nhập.
- Khi tạo yêu cầu, lấy `maYeuCau` từ response, không tự đoán mã.
- Khi phân công, dùng đúng mã hồ sơ chủ phòng khám `BS_CHU_DEMO`, mã bác sĩ, mã phòng và mã yêu cầu tồn tại.
- Ngày yêu cầu phải khớp ngày ca làm việc; giờ phân công phải nằm trong ca làm việc và không bị trùng lịch.
- Project hiện có endpoint gửi yêu cầu, xem danh sách và xem chi tiết yêu cầu đặt lịch; trong Controller được kiểm tra ở ZIP này **chưa thấy endpoint hủy yêu cầu đặt lịch được ánh xạ**. Không test URL hủy cho tới khi bạn bổ sung mapping.
- Nếu dùng H2 `mem`, dữ liệu thường được tạo lại khi khởi động ứng dụng. Nếu dùng database lưu bền, tránh chạy lại script insert trên dữ liệu đã có vì có thể trùng khóa.

## 8. Checklist test nhanh

- [ ] Đăng nhập bệnh nhân và nhận JWT.
- [ ] Xem hồ sơ bệnh nhân.
- [ ] Cập nhật hồ sơ bệnh nhân.
- [ ] Gửi yêu cầu đặt lịch và lưu `maYeuCau`.
- [ ] Chủ phòng khám xem danh sách yêu cầu.
- [ ] Chủ phòng khám phân công và lưu `maLich`.
- [ ] Bệnh nhân xem thông báo và xác nhận lịch.
- [ ] Bác sĩ xem lịch của mình.
- [ ] Bác sĩ xem thông tin bệnh nhân trong lịch.
- [ ] Bác sĩ cập nhật trạng thái lịch.
- [ ] Test thiếu token (`401`) và sai vai trò (`403`).
