import FooterSection from "@/components/footer";
import HeroSection from "@/components/hero-section";
import Image from "next/image";
//import Testimonials from "@/components/testimonials";
import FAQsTwo from "@/components/q&a";
import CallToAction from "@/components/call-to-action";
import LaunchSection from '@/components/launchsection'
import PlatformSimplifies from "@/components/killcomplexity";
import OurGoal from "@/components/initialboxes";
import SupportedTypes from "@/components/intro";
import RoadmapNowNextLater from "@/components/roadmap";

export default function Home() {
  return (

    <><HeroSection />
    {/* <Testimonials /> */}
    <OurGoal/>
    <SupportedTypes/>
    <PlatformSimplifies/>
    <RoadmapNowNextLater/>

    <CallToAction/>
    <FooterSection />   
         
    </>
  )
  
}
