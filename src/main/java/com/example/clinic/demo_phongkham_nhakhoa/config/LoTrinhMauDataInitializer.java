
package com.example.clinic.demo_phongkham_nhakhoa.config;

import com.example.clinic.demo_phongkham_nhakhoa.entity.LoTrinhMau;
import com.example.clinic.demo_phongkham_nhakhoa.entity.BuoiMau;
import com.example.clinic.demo_phongkham_nhakhoa.repository.LoTrinhMauRepository;
import com.example.clinic.demo_phongkham_nhakhoa.repository.BuoiMauRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LoTrinhMauDataInitializer {

    @Bean
    CommandLineRunner khoiTaoLoTrinhMau(
            LoTrinhMauRepository loTrinhRepo,
            BuoiMauRepository buoiRepo) {

        return args -> {

            // 1. LỘ TRÌNH NIỀNG RĂNG
            LoTrinhMau niengRang = taoLoTrinh(
                    loTrinhRepo,
                    "NIENG_RANG",
                    "Niềng răng",
                    "Lộ trình theo dõi chỉnh nha mẫu",
                    10,
                    "Khoảng 9-12 tháng cho 10 mốc đầu");

            taoBuoi(buoiRepo, niengRang, 1,
                    "Khám tổng quát",
                    "Đánh giá khớp cắn và nhu cầu chỉnh nha",
                    3, 7,
                    "Tư vấn và lập kế hoạch sơ bộ");

            taoBuoi(buoiRepo, niengRang, 2,
                    "Chụp phim và lấy dấu",
                    "Chụp X-quang, chụp ảnh, lấy dấu hoặc quét mẫu răng",
                    7, 14,
                    "Thu thập dữ liệu để lập phác đồ");

            taoBuoi(buoiRepo, niengRang, 3,
                    "Tư vấn phác đồ",
                    "Thống nhất phương án và kế hoạch điều trị",
                    3, 7,
                    "Có thể chỉ định điều trị răng miệng trước khi gắn mắc cài");

            taoBuoi(buoiRepo, niengRang, 4,
                    "Chuẩn bị trước chỉnh nha",
                    "Vệ sinh răng, xử lý sâu răng hoặc viêm lợi nếu cần",
                    7, 14,
                    "Thực hiện các xử lý phù hợp với tình trạng thực tế");

            taoBuoi(buoiRepo, niengRang, 5,
                    "Bắt đầu chỉnh nha",
                    "Gắn mắc cài hoặc bàn giao khay niềng, hướng dẫn chăm sóc",
                    28, 42,
                    "Bắt đầu giai đoạn điều chỉnh răng");

            taoBuoi(buoiRepo, niengRang, 6,
                    "Tái khám lần 1",
                    "Kiểm tra lực kéo và tình trạng răng, lợi",
                    28, 42,
                    "Điều chỉnh dây cung hoặc khay theo chỉ định");

            taoBuoi(buoiRepo, niengRang, 7,
                    "Điều chỉnh khí cụ",
                    "Tái khám và điều chỉnh khí cụ chỉnh nha",
                    28, 42,
                    "Theo dõi dịch chuyển răng");

            taoBuoi(buoiRepo, niengRang, 8,
                    "Kiểm tra tiến độ",
                    "Kiểm tra khớp cắn và tiến độ điều trị",
                    28, 42,
                    "Có thể thay đổi kế hoạch nếu cần");

            taoBuoi(buoiRepo, niengRang, 9,
                    "Tiếp tục chỉnh nha",
                    "Tái khám và tiếp tục điều chỉnh khí cụ",
                    28, 42,
                    "Duy trì vệ sinh và đeo khí cụ đúng hướng dẫn");

            taoBuoi(buoiRepo, niengRang, 10,
                    "Đánh giá giai đoạn",
                    "Kiểm tra kết quả và lập lịch tái khám tiếp theo",
                    null, null,
                    "Không mặc định đây là buổi tháo niềng");

            // 2. LỘ TRÌNH IMPLANT
            LoTrinhMau implant = taoLoTrinh(
                    loTrinhRepo,
                    "IMPLANT",
                    "Cấy ghép Implant",
                    "Lộ trình mẫu cho một vị trí Implant đơn giản",
                    8,
                    "Khoảng 3-8 tháng hoặc lâu hơn");

            taoBuoi(buoiRepo, implant, 1,
                    "Khám ban đầu",
                    "Đánh giá sức khỏe răng miệng và vùng mất răng",
                    3, 7,
                    "Xác định chỉ định và yếu tố nguy cơ");

            taoBuoi(buoiRepo, implant, 2,
                    "Chụp phim và lập kế hoạch",
                    "Chụp phim hoặc CT Cone Beam, đánh giá xương",
                    3, 14,
                    "Có thể cần xét nghiệm hoặc hội chẩn bổ sung");

            taoBuoi(buoiRepo, implant, 3,
                    "Chuẩn bị phẫu thuật",
                    "Điều trị bệnh lý răng miệng và vệ sinh trước phẫu thuật",
                    7, 14,
                    "Có thể rút gọn nếu bệnh nhân đủ điều kiện");

            taoBuoi(buoiRepo, implant, 4,
                    "Đặt trụ Implant",
                    "Phẫu thuật đặt trụ và hướng dẫn chăm sóc",
                    7, 14,
                    "Tái khám sớm để kiểm tra vết thương hoặc cắt chỉ");

            taoBuoi(buoiRepo, implant, 5,
                    "Kiểm tra lành thương",
                    "Kiểm tra mô mềm, vết thương và tình trạng trụ",
                    56, 84,
                    "Theo dõi quá trình tích hợp xương");

            taoBuoi(buoiRepo, implant, 6,
                    "Đánh giá tích hợp xương",
                    "Kiểm tra tích hợp xương, lấy dấu hoặc quét phục hình",
                    7, 21,
                    "Có thể cần tạo hình lợi hoặc đặt trụ lành thương");

            taoBuoi(buoiRepo, implant, 7,
                    "Lắp mão Implant",
                    "Thử và lắp mão răng, kiểm tra khớp cắn",
                    7, 14,
                    "Điều chỉnh nếu có điểm cộm hoặc sai khớp cắn");

            taoBuoi(buoiRepo, implant, 8,
                    "Tái khám phục hình",
                    "Kiểm tra mô quanh Implant và hướng dẫn vệ sinh",
                    90, 180,
                    "Sau đó duy trì kiểm tra định kỳ");

            // 3. LỘ TRÌNH ĐIỀU TRỊ TỦY
            LoTrinhMau dieuTriTuy = taoLoTrinh(
                    loTrinhRepo,
                    "DIEU_TRI_TUY",
                    "Điều trị tủy răng",
                    "Lộ trình điều trị tủy mẫu gồm 3-4 buổi",
                    4,
                    "Khoảng 1-3 tuần");

            taoBuoi(buoiRepo, dieuTriTuy, 1,
                    "Khám và chẩn đoán",
                    "Khám, chụp X-quang, kiểm tra tình trạng tủy",
                    1, 7,
                    "Thông báo kế hoạch và số buổi dự kiến");

            taoBuoi(buoiRepo, dieuTriTuy, 2,
                    "Làm sạch ống tủy",
                    "Mở buồng tủy, làm sạch và tạo hình ống tủy, đặt thuốc nếu cần",
                    3, 7,
                    "Một số ca có thể hoàn tất làm sạch trong cùng buổi");

            taoBuoi(buoiRepo, dieuTriTuy, 3,
                    "Trám bít ống tủy",
                    "Kiểm tra triệu chứng, làm sạch bổ sung và trám bít ống tủy",
                    1, 7,
                    "Có thể gộp với buổi 2 nếu đủ điều kiện");

            taoBuoi(buoiRepo, dieuTriTuy, 4,
                    "Phục hồi thân răng",
                    "Phục hồi bằng miếng trám hoặc mão răng, kiểm tra khớp cắn",
                    180, 365,
                    "Mốc 6-12 tháng là tái khám theo dõi; phục hình có thể sớm hơn");

            System.out.println(
                    "Da kiem tra khoi tao 3 lo trinh mau nha khoa");
        };
    }

    // Tạo lộ trình nếu chưa tồn tại trong MySQL
    private LoTrinhMau taoLoTrinh(
            LoTrinhMauRepository repo,
            String ma,
            String ten,
            String moTa,
            int soBuoi,
            String thoiGian) {

        return repo.findById(ma).orElseGet(() -> {
            LoTrinhMau loTrinh = new LoTrinhMau(
                    ma, ten, moTa, soBuoi, thoiGian);
            return repo.save(loTrinh);
        });
    }

    // Tạo buổi mẫu nếu chưa tồn tại
    private void taoBuoi(
            BuoiMauRepository repo,
            LoTrinhMau loTrinh,
            int thuTu,
            String ten,
            String noiDung,
            Integer min,
            Integer max,
            String ghiChu) {

        String maBuoi = loTrinh.getMaLoTrinh()
                + "_" + String.format("%02d", thuTu);

        if (repo.existsById(maBuoi)) {
            return;
        }

        BuoiMau buoi = new BuoiMau(
                maBuoi,
                loTrinh,
                thuTu,
                ten,
                noiDung,
                min,
                max,
                ghiChu);

        repo.save(buoi);
    }
}
