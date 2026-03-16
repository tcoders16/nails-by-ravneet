import ClientLayout from "@/components/ClientLayout";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Gallery from "@/components/sections/Gallery";
import About from "@/components/sections/About";
import Testimonials from "@/components/sections/Testimonials";
import BookingCTA from "@/components/sections/BookingCTA";
import Process from "@/components/sections/Process";
import ConsultationTeaser from "@/components/sections/ConsultationTeaser";
import MarqueeTicker from "@/components/ui/MarqueeTicker";
import PhotoStrip from "@/components/ui/PhotoStrip";
import FloatingBookButton from "@/components/ui/FloatingBookButton";
import ServicesTeaser from "@/components/sections/ServicesTeaser";

export default function Home() {
  return (
    <ClientLayout>
      <Navbar />
      <main>
        <Hero />
        <MarqueeTicker />
        <ServicesTeaser />
        <PhotoStrip />
        <Process />
        <Gallery />
        <About />
        <Testimonials />
        <ConsultationTeaser />
        <BookingCTA />
      </main>
      <Footer />
      <FloatingBookButton />
    </ClientLayout>
  );
}
