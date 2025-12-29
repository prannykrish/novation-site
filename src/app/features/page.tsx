// FULLY UPDATED FILE
"use client";

import { HeroHeader } from "@/components/nav-bar";
import FooterSection from "@/components/footer";
import HowItWorksPage from "@/components/featuressimilarity";
import HowItWorksHeader from "@/components/featuresheader";
import SpeedSection from "@/components/speedofsearch";
import EvidenceSection from "@/components/evidencebased";
import RoadmapSection from "@/components/fullroadmap";
import FeatureNaturalLanguage from "@/components/featuresnaturallanguage";


export default function HowItWorks() {
  return (
    <><HeroHeader/>
    <HowItWorksHeader/>
        <FeatureNaturalLanguage/>

    <HowItWorksPage/>
    <SpeedSection/>
    <EvidenceSection/>
    <RoadmapSection/>
    <FooterSection/>
    </>

  )
  
  
}
