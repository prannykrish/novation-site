'use client';

import BrokenSystem from "@/components/brokensystem";
import FooterSection from "@/components/footer";
//import LawStatisticsSection from "@/components/lawstatistics";
import { HeroHeader } from "@/components/nav-bar";
import MissionVisionSection from "@/components/missionvision";
import { OurVisionHeader } from "@/components/ourvisionheader";
import { ProblemSection } from "@/components/problemsection";
import { SolutionSection } from "@/components/solution";
import  VisionSection  from "@/components/vision";
import WhyBroken from "@/components/whybrokensystem";

export default function OurVision() {
  return (
    <>
      <HeroHeader />
      <BrokenSystem/>
      <WhyBroken/>
      {/* <VisionSection/> */}
      <MissionVisionSection/>
      <FooterSection/>
   
      
      
    </>
  );
}
