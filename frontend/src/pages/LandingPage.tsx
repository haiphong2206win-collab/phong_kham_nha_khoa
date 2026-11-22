import React from 'react';
import type { AuthSession } from '@/types/auth';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { AboutSection } from '@/components/landing/AboutSection';
import { ServicesSection } from '@/components/landing/ServicesSection';
import { DentalKnowledgeSection } from '@/components/landing/DentalKnowledgeSection';
import { DoctorsSection } from '@/components/landing/DoctorsSection';
import { ProcessSection } from '@/components/landing/ProcessSection';
import { AppointmentCTA } from '@/components/landing/AppointmentCTA';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { Footer } from '@/components/landing/Footer';

interface LandingPageProps {
  session: AuthSession;
  onOpenAuth: (tab: 'login' | 'register') => void;
  onOpenDashboard: () => void;
  onLogout: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  session,
  onOpenAuth,
  onOpenDashboard,
  onLogout,
}) => {
  const handleBookAppointment = () => {
    if (session.isAuthenticated && session.user) {
      onOpenDashboard();
    } else {
      onOpenAuth('register');
    }
  };

  return (
    <div className="min-h-screen bg-dental-bg text-dental-text font-sans selection:bg-dental-mint selection:text-dental-accent">
      {/* 1. Sticky Navigation Bar */}
      <Navbar
        session={session}
        onOpenAuth={onOpenAuth}
        onOpenDashboard={onOpenDashboard}
        onLogout={onLogout}
      />

      <main>
        {/* 2. Hero Section with Soft Blended Medical Photography */}
        <HeroSection
          session={session}
          onOpenAuth={onOpenAuth}
          onOpenDashboard={onOpenDashboard}
        />

        {/* 3. About Dental Clinic */}
        <AboutSection />

        {/* 4. Dental Services & Interactive Modals */}
        <ServicesSection onBookAppointment={handleBookAppointment} />

        {/* 5. Dental Knowledge & Oral Pathologies */}
        <DentalKnowledgeSection />

        {/* 6. Doctors & Specialists Team */}
        <DoctorsSection onBookAppointment={handleBookAppointment} />

        {/* 7. Treatment & Booking Process Stepper */}
        <ProcessSection />

        {/* 8. Appointment Call-To-Action Banner */}
        <AppointmentCTA
          session={session}
          onOpenAuth={onOpenAuth}
          onOpenDashboard={onOpenDashboard}
        />

        {/* 9. Patient Feedback & Testimonials */}
        <TestimonialsSection />

        {/* 10. Frequently Asked Questions (FAQ) Accordion */}
        <FAQSection />
      </main>

      {/* 11. Footer Information & Brand Details */}
      <Footer />
    </div>
  );
};

export default LandingPage;

