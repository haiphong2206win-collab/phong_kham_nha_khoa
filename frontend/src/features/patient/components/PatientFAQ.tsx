import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  ChevronDown,
  Layers,
  Calendar,
  User,
  Activity,
  CreditCard,
  Headphones,
  CheckCircle2,
  CalendarPlus,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  PATIENT_FAQS,
  FAQ_CATEGORIES,
  type FAQCategory,
  type FAQItem,
} from '../data/patient-faq.data';
import {
  FaqHeroArt,
  ToothMascotWithHeadphone,
} from './PatientIllustrations';

interface PatientFAQProps {
  onNavigateTab?: (
    tab: 'overview' | 'booking' | 'appointments' | 'treatment-plan' | 'profile' | 'notifications' | 'faq'
  ) => void;
}

/**
 * Hàm loại bỏ dấu tiếng Việt và chuẩn hóa chuỗi
 * Xử lý cả 'đ' -> 'd', chữ hoa/chữ thường và khoảng trắng
 */
export function removeVietnameseTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .trim();
}

export const PatientFAQ: React.FC<PatientFAQProps> = ({ onNavigateTab }) => {
  // Trạng thái tìm kiếm
  const [searchInput, setSearchInput] = useState<string>('');
  const [activeKeyword, setActiveKeyword] = useState<string>('');

  // Trạng thái bộ lọc danh mục
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>('ALL');

  // Trạng thái Accordion: ID câu hỏi đang mở (Mặc định mở câu đầu tiên như mockup)
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-booking-1');

  // Xử lý tìm kiếm khi gõ hoặc bấm nút Tìm kiếm
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setActiveKeyword(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setActiveKeyword('');
  };

  // Toggle mở/đóng Accordion
  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  // Tính số lượng câu hỏi động theo từng danh mục
  const categoryCounts = useMemo(() => {
    const counts: Record<FAQCategory, number> = {
      ALL: PATIENT_FAQS.length,
      BOOKING: 0,
      PROFILE: 0,
      TREATMENT: 0,
      PAYMENT: 0,
      OTHER: 0,
    };
    PATIENT_FAQS.forEach((faq) => {
      counts[faq.category] = (counts[faq.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Lọc danh sách FAQ theo Category và Từ khóa tìm kiếm
  const filteredFaqs = useMemo(() => {
    const normKeyword = removeVietnameseTones(activeKeyword);

    return PATIENT_FAQS.filter((faq) => {
      // 1. Lọc theo Danh mục
      if (selectedCategory !== 'ALL' && faq.category !== selectedCategory) {
        return false;
      }

      // 2. Lọc theo Từ khóa tìm kiếm
      if (!normKeyword) return true;

      const normQuestion = removeVietnameseTones(faq.question);
      const normAnswer = removeVietnameseTones(faq.answer);
      const normSteps = faq.steps ? removeVietnameseTones(faq.steps.join(' ')) : '';

      return (
        normQuestion.includes(normKeyword) ||
        normAnswer.includes(normKeyword) ||
        normSteps.includes(normKeyword)
      );
    });
  }, [selectedCategory, activeKeyword]);

  // Reset toàn bộ bộ lọc & từ khóa khi bấm "Xem tất cả câu hỏi" ở Empty State
  const handleResetFilters = () => {
    setSearchInput('');
    setActiveKeyword('');
    setSelectedCategory('ALL');
  };

  // Lấy icon tương ứng cho Category Pill
  const renderCategoryIcon = (key: FAQCategory) => {
    switch (key) {
      case 'ALL':
        return <Layers className="h-3.5 w-3.5" />;
      case 'BOOKING':
        return <Calendar className="h-3.5 w-3.5" />;
      case 'PROFILE':
        return <User className="h-3.5 w-3.5" />;
      case 'TREATMENT':
        return <Activity className="h-3.5 w-3.5" />;
      case 'PAYMENT':
        return <CreditCard className="h-3.5 w-3.5" />;
      case 'OTHER':
        return <Headphones className="h-3.5 w-3.5" />;
      default:
        return <HelpCircle className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. HERO BANNER: CÂU HỎI THƯỜNG GẶP */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#E6F7F2] via-[#EBF9F5] to-[#DDF4EE] border border-[#CEEDE4] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E384C] tracking-tight">
                Câu hỏi thường gặp
              </h1>
              {/* Question mark badge */}
              <span className="h-7 w-7 rounded-full bg-white/80 text-[#169C89] border border-[#BCE8DD] shadow-2xs flex items-center justify-center font-black text-sm">
                ?
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#527771] font-medium leading-relaxed">
              Giải đáp những thắc mắc phổ biến về dịch vụ và quy trình tại Nha Khoa Nụ Cười Xanh.
            </p>
          </div>

          {/* Minh họa Mascot Hero Art */}
          <div className="flex justify-end shrink-0">
            <FaqHeroArt className="w-56 h-32 sm:w-64 sm:h-36" />
          </div>
        </div>
      </div>

      {/* 2. THANH TÌM KIẾM CÂU HỎI */}
      <form
        onSubmit={handleSearchSubmit}
        className="p-2 sm:p-2.5 rounded-2xl bg-white border border-[#E3ECE9] shadow-soft-card flex items-center gap-2 transition-all focus-within:border-[#169C89] focus-within:ring-2 focus-within:ring-[#169C89]/20"
      >
        <div className="pl-3 text-[#7A9A93] shrink-0">
          <Search className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>

        <input
          type="text"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            // Realtime search: cập nhật ngay khi người dùng gõ
            setActiveKeyword(e.target.value);
          }}
          placeholder="Tìm kiếm câu hỏi (ví dụ: đặt lịch, niềng răng, chi phí...)"
          className="w-full bg-transparent border-none text-xs sm:text-sm text-[#1E384C] placeholder-[#94ABA5] focus:outline-hidden py-1.5"
          aria-label="Tìm kiếm câu hỏi"
        />

        {searchInput && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            title="Xóa từ khóa"
            aria-label="Xóa từ khóa tìm kiếm"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[#169C89] hover:bg-[#138776] text-white text-xs sm:text-sm font-bold transition-all shadow-2xs hover:shadow-xs shrink-0 flex items-center gap-1.5"
        >
          <span>Tìm kiếm</span>
        </button>
      </form>

      {/* 3. DANH MỤC FAQ (CATEGORY PILLS) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {FAQ_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          const count = categoryCounts[cat.key] || 0;

          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#169C89] text-white shadow-xs'
                  : 'bg-white border border-[#E3ECE9] text-[#5A777E] hover:bg-[#F0FAF7] hover:border-[#CEEDE4] hover:text-[#169C89]'
              }`}
            >
              {renderCategoryIcon(cat.key)}
              <span>{cat.label}</span>
              <span
                className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-[#EDF5F3] text-[#7A9A93]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. NỘI DUNG CHÍNH: 2 CỘT (DESKTOP) / 1 CỘT (MOBILE) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CỘT TRÁI (8 CỘT): DANH SÁCH ACCORDION */}
        <div className="lg:col-span-8 space-y-3">
          {/* EMPTY STATE KHI KHÔNG CÓ KẾT QUẢ */}
          {filteredFaqs.length === 0 && (
            <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card text-center space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-[#F0FAF7] text-[#169C89] flex items-center justify-center mx-auto shadow-2xs">
                <Search className="h-7 w-7 text-[#169C89]" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-[#1E384C]">
                  Không tìm thấy câu hỏi phù hợp
                </h3>
                <p className="text-xs text-[#527771] max-w-md mx-auto leading-relaxed">
                  Bạn có thể thử tìm bằng từ khóa khác hoặc xem tất cả các câu hỏi thường gặp của hệ thống.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-xl bg-[#169C89] hover:bg-[#138776] text-white text-xs font-bold transition-all shadow-2xs hover:shadow-xs inline-flex items-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Xem tất cả câu hỏi</span>
                </button>
              </div>
            </div>
          )}

          {/* DANH SÁCH ACCORDION CARDS */}
          {filteredFaqs.map((faq: FAQItem) => {
            const isOpen = openFaqId === faq.id;
            const contentId = `faq-content-${faq.id}`;
            const headerId = `faq-header-${faq.id}`;

            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-[#169C89]/40 shadow-soft-card ring-1 ring-[#169C89]/20'
                    : 'bg-white border-[#E3ECE9] hover:border-[#CEEDE4] hover:bg-[#FAFCFB]'
                }`}
              >
                {/* Header Button: Click to toggle */}
                <button
                  id={headerId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    {/* Question Badge 'Q' */}
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-xs font-black transition-colors ${
                        isOpen
                          ? 'bg-[#169C89] text-white'
                          : 'bg-[#E8F6F2] text-[#169C89]'
                      }`}
                    >
                      Q
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-[#1E384C] leading-snug">
                      {faq.question}
                    </h3>
                  </div>

                  <div className="text-[#169C89] shrink-0 p-1">
                    <ChevronDown
                      className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#169C89]' : 'text-slate-400'
                      }`}
                    />
                  </div>
                </button>

                {/* Content Panel (Expanded) */}
                {isOpen && (
                  <div
                    id={contentId}
                    role="region"
                    aria-labelledby={headerId}
                    className="px-4 sm:px-5 pb-5 pt-1 border-t border-[#F0F7F5] bg-[#FBFCFB]"
                  >
                    <div className="flex items-start gap-3 pt-3">
                      {/* Answer Badge 'A' */}
                      <div className="h-6 w-6 rounded-full bg-[#EBF3F1] text-[#169C89] flex items-center justify-center shrink-0 text-xs font-black mt-0.5">
                        A
                      </div>

                      <div className="space-y-3 flex-1 text-xs sm:text-sm text-[#527771] leading-relaxed">
                        <p>{faq.answer}</p>

                        {/* Các bước hướng dẫn nếu có */}
                        {faq.steps && faq.steps.length > 0 && (
                          <div className="space-y-2 pt-1 pl-1">
                            {faq.steps.map((step, idx) => (
                              <div key={idx} className="flex items-start gap-2.5">
                                <span className="h-5 w-5 rounded-full bg-[#169C89] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <span className="text-xs sm:text-sm text-[#344C52]">
                                  {step}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Nút điều hướng chức năng nếu có */}
                        {faq.actionTab && onNavigateTab && (
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => onNavigateTab(faq.actionTab!)}
                              className="px-3.5 py-1.5 rounded-xl bg-[#E8F6F2] hover:bg-[#D5EFE8] text-[#169C89] font-bold text-xs transition-colors inline-flex items-center gap-1.5"
                            >
                              <span>{faq.actionLabel || 'Xem chi tiết'}</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CỘT PHẢI (4 CỘT): CTA ĐẶT LỊCH & THẺ HỖ TRỢ */}
        <div className="lg:col-span-4 space-y-6">
          {/* CARD 1: BẠN MUỐN ĐẶT LỊCH KHÁM? */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-[#F0F5F3]">
              <div className="h-9 w-9 rounded-xl bg-[#E8F6F2] text-[#169C89] flex items-center justify-center shrink-0">
                <CalendarPlus className="h-5 w-5" />
              </div>
              <h2 className="text-sm font-bold text-[#1E384C]">
                Bạn muốn đặt lịch khám?
              </h2>
            </div>

            <p className="text-xs text-[#527771] leading-relaxed">
              Đặt lịch nhanh chóng, lựa chọn thời gian phù hợp và được phòng khám tiếp nhận, phân công lịch khám chu đáo.
            </p>

            <button
              type="button"
              onClick={() => onNavigateTab?.('booking')}
              className="w-full py-3 px-4 rounded-2xl bg-[#169C89] hover:bg-[#138776] text-white text-xs sm:text-sm font-bold transition-all shadow-2xs hover:shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="h-4 w-4" />
              <span>Đặt lịch khám ngay</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* CARD 2: CẦN THÊM HỖ TRỢ? */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-[#F0F5F3]">
              <div className="h-9 w-9 rounded-xl bg-[#E8F6F2] text-[#169C89] flex items-center justify-center shrink-0">
                <Headphones className="h-5 w-5" />
              </div>
              <h2 className="text-sm font-bold text-[#1E384C]">
                Cần thêm hỗ trợ?
              </h2>
            </div>

            <ul className="space-y-2.5 text-xs text-[#527771]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#169C89] shrink-0 mt-0.5" />
                <span>Không tìm thấy câu trả lời phù hợp?</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#169C89] shrink-0 mt-0.5" />
                <span>Cần tư vấn cụ thể về tình trạng răng miệng?</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#169C89] shrink-0 mt-0.5" />
                <span>Hãy gửi yêu cầu đặt lịch khám để được bác sĩ tư vấn trực tiếp.</span>
              </li>
            </ul>

            {/* Mascot Răng Đeo Tai Nghe (Headphones Mascot) */}
            <div className="pt-2 flex justify-center">
              <ToothMascotWithHeadphone className="w-28 h-24" />
            </div>

            {/* Nút liên kết phụ */}
            <button
              type="button"
              onClick={() => onNavigateTab?.('booking')}
              className="w-full py-2.5 px-3 rounded-xl border border-[#CEEDE4] bg-[#F0FAF7] hover:bg-[#E2F5EF] text-xs font-bold text-[#169C89] transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Gửi yêu cầu tư vấn</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

