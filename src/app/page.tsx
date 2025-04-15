import FooterSection from "@/components/footer";
import HeroSection from "@/components/hero-section";
import Image from "next/image";
import Testimonials from "@/components/testimonials";
import FAQsTwo from "@/components/faqs-2";
import CallToAction from "@/components/call-to-action";
export default function Home() {
  return (

    <><HeroSection />
    {/* <Testimonials /> */}
    <FAQsTwo />
    <CallToAction/>
    <FooterSection />   
         
    </>
  )
  
}
