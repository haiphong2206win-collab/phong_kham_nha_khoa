# PHÒNG KHÁM NHA KHOA NỤ CƯỜI XANH (GREEN SMILE DENTAL CLINIC)

> Hệ thống quản lý phòng khám nha khoa toàn diện, hỗ trợ 3 vai trò: **Bệnh nhân (Patient)**, **Bác sĩ (Doctor)** và **Chủ phòng khám (Owner)**.
> Dự án môn học Lập trình hướng đối tượng (OOP) – Kiến trúc Full-Stack Spring Boot & React TypeScript.

---

## 1. GIỚI THIỆU DỰ ÁN

Phòng khám Nha Khoa Nụ Cười Xanh số hóa toàn bộ quy trình chăm sóc răng miệng khép kín:
- **Bệnh nhân (Patient):** Gửi yêu cầu đặt lịch, nhận phản hồi phân công, xác nhận/từ chối lịch khám, theo dõi lộ trình điều trị nhiều buổi, cập nhật hồ sơ sức khỏe và tiền sử bệnh.
- **Bác sĩ (Doctor):** Theo dõi lịch khám trong ngày, cập nhật tiến trình tiếp đón (Đã đến → Đang khám → Hoàn thành / Vắng mặt), tạo và theo dõi phác đồ điều trị, liên kết từng buổi điều trị với ca khám thực tế.
- **Chủ phòng khám (Owner):** Giám sát toàn bộ hoạt động phòng khám, duyệt và phân công bác sĩ/phòng/giờ khám cho yêu cầu của bệnh nhân, quản lý nhân sự bác sĩ, quản lý hồ sơ bệnh nhân và giám sát lộ trình điều trị.

---

## 2. CÔNG NGHỆ SỬ DỤNG

### Backend
- **Ngôn ngữ:** Java 21 (LTS)
- **Framework:** Spring Boot 4.0.8
- **ORM & Database:** Spring Data JPA, Hibernate ORM 7.x, MySQL Server 8.0
- **Bảo mật:** Spring Security, JWT (io.jsonwebtoken:jjwt 0.11.5), BCrypt Password Encoder
- **Công cụ build:** Maven 3.9+ (đã tích hợp sẵn Maven Wrapper `mvnw.cmd` / `mvnw`)

### Frontend
- **Thư viện UI:** React 18.3, TypeScript 5.6
- **Build Tool:** Vite 6.0
- **Styling & Icons:** Tailwind CSS 3.4, Lucide React
- **HTTP Client:** Axios (cấu hình proxy ngược `/api` tới backend port 8080)

---

## 3. CÔNG CỤ VÀ PHIÊN BẢN CẦN CÀI ĐẶT

Trước khi bắt đầu, đảm bảo máy tính của bạn đã cài đặt các công cụ sau:
1. **Hệ điều hành:** Windows 10/11 (khuyên dùng PowerShell) hoặc macOS/Linux.
2. **Java Development Kit (JDK):** **JDK 21** (Eclipse Temurin 21, Microsoft OpenJDK 21 hoặc Oracle JDK 21).
   *Kiểm tra:* `java -version`
3. **Node.js & npm:** **Node.js 18+ hoặc 20+ LTS**, npm 9+.
   *Kiểm tra:* `node -v` và `npm -v`
4. **MySQL Database Server:** **MySQL 8.0+** chạy trên cổng mặc định `3306`.
   *Kiểm tra dịch vụ MySQL:* Đang chạy (Running).
5. **Git:** Phiên bản Git mới nhất.
   *Kiểm tra:* `git --version`

---

## 4. CLONE DỰ ÁN TỪ GITHUB

Mở Terminal (PowerShell hoặc Git Bash), di chuyển đến thư mục làm việc và clone nhánh `fe`:

```powershell
git clone -b fe https://github.com/haiphong2206win-collab/phong_kham_nha_khoa.git
cd phong_kham_nha_khoa
```

Xác minh bạn đang ở đúng nhánh `fe`:
```powershell
git branch --show-current
# Kết quả hiển thị: fe
```

---

## 5. KHỞI ĐỘNG MYSQL VÀ TẠO DATABASE LẦN ĐẦU

1. Đảm bảo dịch vụ MySQL đang chạy.
2. Mở MySQL CLI hoặc MySQL Workbench:
   ```powershell
   mysql -u root -p
   ```
3. Nhập mật khẩu MySQL của bạn và chạy câu lệnh tạo Database:
   ```sql
   CREATE DATABASE clinic_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

---

## 6. CẤU HÌNH DATASOURCE TRONG SPRING BOOT

Mở file cấu hình `src/main/resources/application.properties`:

```properties
# ===============================
# MYSQL DATABASE
# ===============================
spring.datasource.url=jdbc:mysql://localhost:3306/clinic_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Ho_Chi_Minh&characterEncoding=UTF-8
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD_HERE
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# ===============================
# JPA / HIBERNATE
# ===============================
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# ===============================
# SQL INITIALIZATION
# ===============================
spring.jpa.defer-datasource-initialization=true
spring.sql.init.mode=never
```

> **LƯU Ý QUAN TRỌNG VỀ BẢO MẬT:**
> - Thay `YOUR_MYSQL_PASSWORD_HERE` bằng mật khẩu MySQL của máy bạn.
> - **TUYỆT ĐỐI KHÔNG commit file `application.properties` chứa mật khẩu cá nhân lên Git.**

---

## 7. KHỞI TẠO BẢNG VÀ DỮ LIỆU BAN ĐẦU

Hệ thống được thiết kế với cơ chế khởi tạo thông minh để tránh lỗi `Duplicate entry`:

### A. Lần chạy đầu tiên (Khởi tạo Schema & Nạp dữ liệu mẫu)
Chạy lệnh khởi động Spring Boot kèm cờ kích hoạt nạp dữ liệu từ `data.sql`:

```powershell
# Chạy trên Windows PowerShell:
.\mvnw.cmd --% spring-boot:run -Dspring-boot.run.arguments=--spring.sql.init.mode=always
```

Nếu database `clinic_db` của bản cũ đã chứa các tài khoản có hậu tố `DEMO`, hãy sao lưu dữ liệu cần giữ rồi tạo lại database trước khi chạy lệnh trên. Thao tác sau sẽ xóa toàn bộ dữ liệu hiện có trong `clinic_db`:

```sql
DROP DATABASE clinic_db;
CREATE DATABASE clinic_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Không cần xóa database nếu đây là lần cài đặt đầu tiên.

**Quá trình diễn ra tự động:**
1. Hibernate (`ddl-auto=update`) tự tạo toàn bộ 12 bảng trong MySQL.
2. `data.sql` nạp tài khoản mẫu, phòng khám, bác sĩ và ca làm việc.
3. `DataInitializer` tự động quét và mã hóa BCrypt cho toàn bộ mật khẩu tài khoản ban đầu.
4. `LoTrinhMauDataInitializer` tự nạp 3 lộ trình điều trị nha khoa chuẩn (Niềng răng, Cấy ghép Implant, Điều trị tủy).

Sau khi thấy dòng chữ `Started DemoPhongkhamNhakhoaApplication in ... seconds`, bạn có thể dừng server bằng `Ctrl + C`.

### B. Các lần chạy tiếp theo (Chạy bình thường)
Chỉ cần chạy lệnh thông thường:

```powershell
.\mvnw.cmd spring-boot:run
```

Do file `application.properties` đã cấu hình sẵn `spring.sql.init.mode=never`, Spring Boot sẽ không nạp lại `data.sql`, giúp bảo toàn dữ liệu thao tác và hoàn toàn không bao giờ bị lỗi `Duplicate entry`!

---

## 8. CÁC LỆNH KHỞI CHẠY HỆ THỐNG

### Khởi chạy Backend (Terminal 1)
```powershell
# Tại thư mục gốc của dự án:
.\mvnw.cmd spring-boot:run
```
Backend lắng nghe tại cổng: `http://localhost:8080`

### Khởi chạy Frontend (Terminal 2)
```powershell
# Mở một cửa sổ Terminal mới:
cd frontend
npm install
npm run dev
```
Frontend sẵn sàng tại: `http://localhost:5173`

---

## 9. ĐỊA CHỈ TRUY CẬP VÀ CỔNG SỬ DỤNG

| Ứng dụng | Địa chỉ URL | Ghi chú |
|:---|:---|:---|
| **Giao diện Web (Frontend)** | `http://localhost:5173` | Giao diện tương tác người dùng |
| **Backend REST API** | `http://localhost:8080/api/v1` | Cung cấp toàn bộ API nghiệp vụ |
| **Tài liệu API Auth** | `http://localhost:8080/api/v1/xac-thuc` | Endpoint xác thực JWT |

---

## 10. TÀI KHOẢN KHỞI TẠO

Sau khi khởi tạo dữ liệu mẫu, hệ thống cung cấp sẵn các tài khoản sau:

| Vai trò                               | Tên đăng nhập           | Mật khẩu mặc định | Mô tả chức năng                                                              |
|:--------------------------------------|:------------------------|:-----------------:|:-----------------------------------------------------------------------------|
| **Chủ phòng khám – Nguyễn Hoàng Nam** | `quanly.nguyenhoangnam` |   `NhaKhoa@123`   | Xem dashboard, duyệt và phân công lịch, quản lý nhân sự và giám sát lộ trình |
| **Bác sĩ – Nguyễn Minh Khang**        | `bs.nguyenminhkhang`    |   `NhaKhoa@123`   | Xem lịch khám, cập nhật tiến trình và lập lộ trình điều trị                  |
| **Bác sĩ – Trần Thu Hằng**            | `bs.tranthuhang`        |   `NhaKhoa@123`   | Tài khoản bác sĩ dùng cho phân công lịch                                     |
| **Bác sĩ – Lê Quốc Bảo**              | `bs.lequocbao`          |   `NhaKhoa@123`   | Tài khoản bác sĩ dùng cho phân công lịch                                     |
| **Bệnh nhân – Phạm Gia Hân**          | `bn.phamgiahan`         |   `NhaKhoa@123`   | Đặt lịch, xác nhận lịch và theo dõi điều trị                                 |

*(Lưu ý: Bệnh nhân cũng có thể tự đăng ký tài khoản mới bằng nút **"Đăng ký"** ngay trên giao diện web).*

---

## 11. HƯỚNG DẪN OWNER TẠO TÀI KHOẢN BÁC SĨ MỚI

1. Đăng nhập với tài khoản Chủ phòng khám: `quanly.nguyenhoangnam` / `NhaKhoa@123`.
2. Trên thanh điều hướng bên trái, chọn tab **"Quản lý Bác sĩ"**.
3. Bấm nút **"Thêm bác sĩ mới"**.
4. Điền đầy đủ thông tin:
   - Họ và tên bác sĩ
   - Số điện thoại, Email, Chuyên khoa
   - Tên đăng nhập mong muốn
   - Mật khẩu đăng nhập
5. Bấm **"Tạo tài khoản"**. Tài khoản bác sĩ mới sẽ được mã hóa BCrypt ngay lập tức và có thể đăng nhập vào hệ thống ngay.

---

## 12. CHECKLIST KIỂM THỬ THỦ CÔNG (4 LUỒNG NGHIỆP VỤ KHÉP KÍN)

### Luồng 1: Bệnh nhân đặt lịch → Chủ phòng khám phân công
1. Đăng nhập Bệnh nhân (`bn.phamgiahan`).
2. Vào mục **"Đặt lịch khám mới"**, chọn ngày mong muốn, ca khám (Sáng/Chiều) và nhập lý do khám.
3. Bấm **"Gửi yêu cầu"**. Trạng thái yêu cầu hiển thị: `Chờ phân công`.
4. Đăng xuất, đăng nhập Chủ phòng khám (`quanly.nguyenhoangnam`).
5. Vào tab **"Phân công lịch"** → Danh sách yêu cầu chờ xử lý.
6. Bấm **"Phân công"**, chọn Bác sĩ phụ trách, Phòng khám và Giờ khám cụ thể.
7. Bấm **"Xác nhận phân công"**. Yêu cầu chuyển sang trạng thái: `Đã phân công`.

### Luồng 2: Bệnh nhân nhận thông báo & Xác nhận lịch
1. Đăng nhập lại Bệnh nhân (`bn.phamgiahan`).
2. Vào tab **"Cuộc hẹn & Lịch khám"** → Mục **"Lịch khám chính thức"**.
3. Lịch khám vừa được xếp hiển thị trạng thái `Chờ xác nhận`.
4. Bệnh nhân có 2 lựa chọn:
   - Bấm **"Xác nhận lịch"**: Trạng thái chuyển sang `Đã xác nhận` (Lịch chính thức được chốt).
   - Bấm **"Từ chối lịch"**: Nhập lý do từ chối → Trạng thái chuyển sang `Đã hủy`.

### Luồng 3: Bác sĩ tiếp đón, khám bệnh & Lập lộ trình điều trị
1. Đăng nhập Bác sĩ (`bs.nguyenminhkhang`).
2. Vào tab **"Lịch khám"**, kiểm tra danh sách bệnh nhân trong ngày.
3. Cập nhật trạng thái từng bước:
   - Bấm **"Bệnh nhân đã đến"** (Trạng thái: `Đã đến`).
   - Bấm **"Bắt đầu khám"** (Trạng thái: `Đang khám`).
   - Bấm **"Hoàn thành khám"** (Trạng thái: `Hoàn thành`).
4. Tại ca khám đã hoàn thành, bấm **"Tạo lộ trình điều trị"**:
   - Chọn lộ trình mẫu (ví dụ: *Niềng răng* hoặc *Cấy ghép Implant*) hoặc tự tạo mới.
   - Nhập tên lộ trình, mô tả, chọn buổi điều trị và liên kết với ca khám hiện tại.
   - Bấm lưu lộ trình.

### Luồng 4: Bệnh nhân theo dõi tiến độ lộ trình điều trị
1. Đăng nhập Bệnh nhân (`bn.phamgiahan`).
2. Vào tab **"Lộ trình điều trị"**.
3. Xem thẻ tóm tắt: Tên lộ trình, Bác sĩ điều trị chính, thanh % tiến độ hoàn thành.
4. Xem danh sách chi tiết các buổi điều trị (Buổi đã hoàn thành, buổi đã lên lịch, buổi tiếp theo).
5. Dữ liệu đồng bộ trực tiếp từ kết quả thao tác của Bác sĩ ở Luồng 3.

---

## 13. TÍNH NĂNG: BỆNH NHÂN HỦY YÊU CẦU ĐẶT LỊCH (CHO_PHAN_CONG)

Hệ thống cung cấp tính năng hủy yêu cầu an toàn dành riêng cho Bệnh nhân:
- **Điều kiện hiển thị:** Nút **"Hủy yêu cầu"** chỉ hiển thị khi yêu cầu đang ở trạng thái **`Chờ phân công`** (`CHO_PHAN_CONG`). Khi yêu cầu đã được phân công (`DA_PHAN_CONG`), đã từ chối (`TU_CHOI`) hoặc đã hủy (`DA_HUY`), nút sẽ tự động ẩn.
- **Hộp thoại xác nhận:** Khi bấm nút, modal xác nhận mở ra với thông điệp:
  > *"Bạn có chắc muốn hủy yêu cầu đặt lịch này? Bạn có thể tạo yêu cầu mới sau khi hủy."*
- **Tùy chọn:** Bấm **"Quay lại"** để hủy thao tác hoặc bấm **"Xác nhận hủy"** để hoàn tất.
- **Bảo toàn dữ liệu & Quyền đặt lại:**
  + Bản ghi được lưu vết với trạng thái `DA_HUY` (không xóa cứng khỏi MySQL).
  + Bệnh nhân có thể gửi lại yêu cầu đặt lịch mới cùng khung giờ đó ngay sau khi hủy mà không bị chặn trùng lịch.

---

## 14. TỔNG HỢP CÁC CHỨC NĂNG CỦA CHỦ PHÒNG KHÁM (OWNER)

- **Bảng điều khiển (Dashboard):** Xem thống kê số lượng bệnh nhân, bác sĩ, yêu cầu cần xử lý và lịch khám trong ngày.
- **Phân công lịch khám:** Xem danh sách yêu cầu chờ xử lý, xếp bác sĩ, phòng khám, thời gian bắt đầu.
- **Từ chối yêu cầu:** Từ chối yêu cầu đặt lịch không phù hợp kèm lý do thông báo cho bệnh nhân.
- **Quản lý Bác sĩ:** Xem danh sách đội ngũ, trạng thái hoạt động, tạo tài khoản bác sĩ mới.
- **Quản lý Bệnh nhân:** Tra cứu hồ sơ bệnh nhân, xem thông tin liên hệ, tiền sử bệnh án và dị ứng thuốc.
- **Giám sát lộ trình điều trị:** Theo dõi tiến độ điều trị của tất cả bệnh nhân tại phòng khám.

*(Lưu ý minh bạch: Các module Doanh thu, Hóa đơn và Thanh toán online đang ở giai đoạn thiết kế, chưa nằm trong phạm vi phiên bản này).*

---

## 15. HƯỚNG DẪN XỬ LÝ LỖI THƯỜNG GẶP (TROUBLESHOOTING)

### 1. Lỗi cổng 8080 hoặc 5173 đã bị chiếm dụng
- **Hiện tượng:** `Port 8080 was already in use` hoặc Vite tự chuyển sang cổng `5174`.
- **Khắc phục:** Mở PowerShell với quyền Admin và tắt tiến trình đang chiếm cổng:
  ```powershell
  # Tìm PID chiếm cổng 8080:
  Get-NetTCPConnection -LocalPort 8080 | Select-Object OwningProcess
  # Tắt tiến trình (thay PID tương ứng):
  Stop-Process -Id <PID> -Force
  ```

### 2. Lỗi `Access denied for user 'root'@'localhost'`
- **Hiện tượng:** Backend không kết nối được MySQL.
- **Khắc phục:** Mở `src/main/resources/application.properties`, kiểm tra và sửa đúng `spring.datasource.password` theo mật khẩu tài khoản MySQL máy của bạn.

### 3. Lỗi `Table 'clinic_db.tai_khoan' doesn't exist` hoặc tài khoản khởi tạo không tồn tại
- **Hiện tượng:** Database vừa tạo chưa có bảng hoặc chưa có dữ liệu mẫu.
- **Khắc phục:** Chạy backend một lần với tham số nạp dữ liệu:
  ```powershell
  .\mvnw.cmd --% spring-boot:run -Dspring-boot.run.arguments=--spring.sql.init.mode=always
  ```

### 4. Lỗi `Duplicate entry ... for key 'PRIMARY'`
- **Hiện tượng:** Khởi động backend bị văng lỗi do cố chèn lại dữ liệu khóa chính đã có.
- **Khắc phục:** Đảm bảo file `application.properties` có dòng:
  ```properties
  spring.sql.init.mode=never
  ```
  Và chạy lệnh `.\mvnw.cmd spring-boot:run` bình thường không kèm tham số `always`.

### 5. Lỗi kết nối Frontend tới Backend (CORS / Network Error)
- **Hiện tượng:** Gọi API báo lỗi kết nối hoặc Failed to fetch.
- **Khắc phục:**
  - Đảm bảo Backend đang chạy tại `http://localhost:8080`.
  - Luôn mở giao diện qua `http://localhost:5173` (được Vite reverse-proxy sang backend) thay vì mở trực tiếp file HTML.

---

## 16. CẬP NHẬT CODE TỪ GIT VÀ DỪNG ỨNG DỤNG

### Cập nhật mã nguồn mới nhất từ nhóm:
```powershell
git checkout fe
git fetch origin fe
git pull origin fe
```

### Dừng ứng dụng:
- Tại cửa sổ Terminal đang chạy Backend: Nhấn tổ hợp phím `Ctrl + C`.
- Tại cửa sổ Terminal đang chạy Frontend: Nhấn tổ hợp phím `Ctrl + C`.
- Đóng Terminal khi không còn sử dụng.

---

*Chúc các thành viên trong nhóm thiết lập và trải nghiệm dự án thành công!*
