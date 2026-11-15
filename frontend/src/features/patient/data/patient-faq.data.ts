export type FAQCategory =
  | 'ALL'
  | 'BOOKING'
  | 'PROFILE'
  | 'TREATMENT'
  | 'PAYMENT'
  | 'OTHER';

export interface FAQCategoryDef {
  key: FAQCategory;
  label: string;
}

export interface FAQItem {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
  steps?: string[];
  actionTab?: 'overview' | 'booking' | 'appointments' | 'treatment-plan' | 'profile';
  actionLabel?: string;
}

export const FAQ_CATEGORIES: FAQCategoryDef[] = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'BOOKING', label: 'Đặt lịch khám' },
  { key: 'PROFILE', label: 'Hồ sơ & tài khoản' },
  { key: 'TREATMENT', label: 'Điều trị' },
  { key: 'PAYMENT', label: 'Chi phí & thanh toán' },
  { key: 'OTHER', label: 'Khác / Hỗ trợ' },
];

export const PATIENT_FAQS: FAQItem[] = [
  // ==========================================
  // NHÓM 1: ĐẶT LỊCH KHÁM (BOOKING)
  // ==========================================
  {
    id: 'faq-booking-1',
    category: 'BOOKING',
    question: 'Làm thế nào để đặt lịch khám tại Nha Khoa Nụ Cười Xanh?',
    answer: 'Bạn có thể gửi yêu cầu đặt lịch khám trực tuyến ngay trên cổng bệnh nhân bằng các bước:',
    steps: [
      'Chọn mục Đặt lịch khám trong menu bên trái.',
      'Điền thông tin ngày khám mong muốn, chọn ca khám (Sáng hoặc Chiều), nhập lý do khám hoặc dịch vụ quan tâm.',
      'Gửi yêu cầu và chờ phòng khám tiếp nhận, phân công lịch khám phù hợp.',
    ],
    actionTab: 'booking',
    actionLabel: 'Đặt lịch khám ngay',
  },
  {
    id: 'faq-booking-2',
    category: 'BOOKING',
    question: 'Sau khi gửi yêu cầu đặt lịch, tôi đã có lịch khám chính thức chưa?',
    answer: 'Chưa. Thao tác trên cổng bệnh nhân là gửi yêu cầu đặt lịch. Sau khi bạn gửi yêu cầu thành công, hệ thống ghi nhận trạng thái ban đầu là "Chờ phân công". Lịch khám chính thức sẽ được xác lập sau khi nhân viên phòng khám đối soát khung giờ trống của Bác sĩ và chuyển trạng thái sang "Đã phân công" hoặc liên hệ xác nhận với bạn.',
    actionTab: 'appointments',
    actionLabel: 'Xem lịch khám của tôi',
  },
  {
    id: 'faq-booking-3',
    category: 'BOOKING',
    question: 'Trạng thái "Chờ phân công" và "Đã phân công" có ý nghĩa như thế nào?',
    answer: 'Hệ thống quản lý trạng thái lịch khám rõ ràng theo quy trình y tế:',
    steps: [
      'Chờ phân công: Yêu cầu đặt lịch của bạn đã vào hệ thống an toàn và đang chờ nhân viên phòng khám xếp lịch với bác sĩ chuyên khoa.',
      'Đã phân công: Phòng khám đã xếp lịch và phân công nhân sự y tế phụ trách. Trạng thái này cho biết phòng khám đã chuẩn bị ca khám nhưng không mặc định bệnh nhân đã đến hoặc hoàn thành.',
    ],
    actionTab: 'appointments',
    actionLabel: 'Kiểm tra trạng thái yêu cầu',
  },

  // ==========================================
  // NHÓM 2: HỒ SƠ & TÀI KHOẢN (PROFILE)
  // ==========================================
  {
    id: 'faq-profile-1',
    category: 'PROFILE',
    question: 'Tôi cần hoàn thiện những thông tin nào trong Hồ sơ cá nhân trước khi đặt lịch?',
    answer: 'Để đảm bảo quyền lợi và hỗ trợ bác sĩ chẩn đoán chính xác, bạn nên kiểm tra và cập nhật đầy đủ các thông tin: Họ và tên, Ngày sinh, Số điện thoại liên hệ chính xác, Giới tính, Địa chỉ cư trú và đặc biệt là ghi chú Dị ứng thuốc nếu có.',
    actionTab: 'profile',
    actionLabel: 'Kiểm tra hồ sơ cá nhân',
  },
  {
    id: 'faq-profile-2',
    category: 'PROFILE',
    question: 'Làm thế nào để chỉnh sửa thông tin cá nhân và dị ứng thuốc?',
    answer: 'Trong mục "Hồ sơ cá nhân", bạn nhấn nút "Chỉnh sửa hồ sơ" ở góc trên thẻ thông tin. Sau khi chỉnh sửa các mục cần thiết, nhấn "Lưu thay đổi". Nếu muốn hủy bỏ các chỉnh sửa chưa lưu, nhấn nút "Hủy" để khôi phục lại dữ liệu ban đầu mà không gửi yêu cầu cập nhật lên máy chủ.',
    actionTab: 'profile',
    actionLabel: 'Chỉnh sửa hồ sơ',
  },
  {
    id: 'faq-profile-3',
    category: 'PROFILE',
    question: 'Vì sao mục Tiền sử bệnh trong hồ sơ hiển thị "Chưa đồng bộ dữ liệu"?',
    answer: 'Thông tin tiền sử bệnh hiện được lưu trữ và quản lý trực tiếp trong hồ sơ bệnh án chuyên khoa tại phòng khám. Dữ liệu này đang trong lộ trình đồng bộ trực tuyến hai chiều với tài khoản của bạn và sẽ được Bác sĩ chuyên khoa cập nhật chi tiết sau khi thăm khám trực tiếp.',
  },

  // ==========================================
  // NHÓM 3: ĐIỀU TRỊ (TREATMENT)
  // ==========================================
  {
    id: 'faq-treatment-1',
    category: 'TREATMENT',
    question: 'Lộ trình điều trị nha khoa là gì và ai là người thiết lập?',
    answer: 'Lộ trình điều trị là kế hoạch phác đồ chuyên khoa bao gồm nhiều giai đoạn hoặc buổi khám (như chỉnh nha niềng răng, cấy ghép implant, điều trị tủy...). Phác đồ này do chính Bác sĩ chuyên khoa phụ trách thăm khám, chỉ định chụp phim (khi cần thiết) và thiết lập riêng theo tình trạng răng miệng thực tế của từng bệnh nhân tại phòng khám.',
  },
  {
    id: 'faq-treatment-2',
    category: 'TREATMENT',
    question: 'Vì sao tôi chưa xem được lộ trình điều trị trực tuyến trên tài khoản?',
    answer: 'Hệ thống máy chủ hiện tại bảo mật quyền thiết lập và quản lý lộ trình cho vai trò Bác sĩ và Chủ phòng khám để đảm bảo tính an toàn chuyên môn y tế. Tính năng đồng bộ trực tuyến hai chiều dành riêng cho tài khoản Bệnh nhân đang được chuẩn bị và sẽ sớm khả dụng khi có API đồng bộ.',
    actionTab: 'treatment-plan',
    actionLabel: 'Xem màn hình lộ trình',
  },
  {
    id: 'faq-treatment-3',
    category: 'TREATMENT',
    question: 'Các trạng thái buổi điều trị (Hoàn thành, Đã lên lịch, Tạm hoãn, Đã bỏ) có ý nghĩa gì?',
    answer: 'Mỗi buổi điều trị trong phác đồ được quản lý theo trạng thái y khoa chuẩn xác:',
    steps: [
      'Hoàn thành: Buổi điều trị đã hoàn tất và được tính vào tiến độ chung của lộ trình.',
      'Đã lên lịch: Đã xếp ngày giờ hẹn khám cụ thể cho buổi điều trị.',
      'Đang thực hiện: Buổi khám đang trong quá trình thực hiện thủ thuật nha khoa.',
      'Chưa lên lịch: Buổi khám dự kiến tiếp theo trong phác đồ.',
      'Tạm hoãn / Lịch đã hủy / Đã bỏ: Buổi khám được điều chỉnh hoặc hủy theo chỉ định bác sĩ, tuyệt đối không được tính là buổi hoàn thành.',
    ],
  },

  // ==========================================
  // NHÓM 4: CHI PHÍ & THANH TOÁN (PAYMENT)
  // ==========================================
  {
    id: 'faq-payment-1',
    category: 'PAYMENT',
    question: 'Chi phí khám và điều trị tại Nha Khoa Nụ Cười Xanh được tính như thế nào?',
    answer: 'Chi phí điều trị phụ thuộc vào tình trạng răng miệng thực tế, mức độ điều trị và chỉ định kỹ thuật của Bác sĩ sau khi thăm khám trực tiếp. Nha Khoa Nụ Cười Xanh cam kết giải thích rõ ràng phác đồ, tư vấn minh bạch chi phí trước khi thực hiện thủ thuật, không phát sinh chi phí ẩn.',
  },
  {
    id: 'faq-payment-2',
    category: 'PAYMENT',
    question: 'Tôi có thể thanh toán chi phí điều trị bằng những hình thức nào?',
    answer: 'Phòng khám hỗ trợ đa dạng phương thức thanh toán linh hoạt trực tiếp tại quầy thu ngân: Tiền mặt, chuyển khoản ngân hàng (quét mã QR) và thanh toán qua thẻ ngân hàng/POS. Bệnh nhân luôn nhận được hóa đơn và phiếu thu chi tiết cho từng buổi điều trị.',
  },

  // ==========================================
  // NHÓM 5: KHÁC / HỖ TRỢ (OTHER)
  // ==========================================
  {
    id: 'faq-other-1',
    category: 'OTHER',
    question: 'Tôi có thể hủy hoặc thay đổi yêu cầu đặt lịch khám đã gửi không?',
    answer: 'Khi yêu cầu đặt lịch đang ở trạng thái "Chờ phân công", bạn có thể liên hệ trực tiếp với quầy tiếp đón phòng khám để nhân viên hỗ trợ điều chỉnh hoặc xếp lại khung giờ. Tính năng tự đổi/hủy trực tuyến trên cổng đang được nâng cấp để đồng bộ tức thời với lịch làm việc của Bác sĩ.',
    actionTab: 'appointments',
    actionLabel: 'Xem danh sách yêu cầu',
  },
  {
    id: 'faq-other-2',
    category: 'OTHER',
    question: 'Thông tin cá nhân và dữ liệu y tế của tôi được bảo mật như thế nào?',
    answer: 'Nha Khoa Nụ Cười Xanh cam kết bảo mật tuyệt đối thông tin cá nhân và dữ liệu bệnh án theo quy định ngành y tế. Thông tin của bạn chỉ được sử dụng cho mục đích chăm sóc sức khỏe răng miệng và lưu trữ hồ sơ điều trị nội bộ.',
  },
  {
    id: 'faq-other-3',
    category: 'OTHER',
    question: 'Nếu gặp lỗi kết nối hoặc không tải được dữ liệu, tôi nên xử lý thế nào?',
    answer: 'Khi gặp sự cố mạng hoặc lỗi kết nối, bạn hãy nhấn nút "Thử lại kết nối" hiển thị trên màn hình hoặc tải lại trang web. Nếu phiên đăng nhập hết hạn, vui lòng đăng nhập lại tài khoản để tiếp tục sử dụng cổng bệnh nhân.',
  },
];

