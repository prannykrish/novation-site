'use client';

import BrokenSystem from "@/components/brokensystem";
import FooterSection from "@/components/footer";
import { HeroHeader } from "@/components/nav-bar";
import MissionVisionSection from "@/components/missionvision";

import WhyBroken from "@/components/whybrokensystem";

export default function OurVision() {
  return (
    <>
      <HeroHeader />
      <BrokenSystem/>
      <WhyBroken/>  
      <MissionVisionSection/>
      <FooterSection/>      
    </>
  );
}
