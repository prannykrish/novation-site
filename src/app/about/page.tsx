"use client";

import { HeroHeader } from "@/components/hero5-header";
import FooterSection from "@/components/footer";
import Features1 from "@/components/features-1";
import Features12 from "@/components/features-12";
import Team from "@/components/team";
import { motion } from "framer-motion";
import ContentSection  from "@/components/content-5";
import CommunitySection  from "@/components/content-6";

export default function Home() {
  // Container animation settings
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  // Child component animation settings
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="overflow-hidden"
    >
      <motion.div variants={itemVariants}>
        <HeroHeader />
      </motion.div>
      <motion.div variants={itemVariants}>
        <ContentSection />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Team/>
      </motion.div>
      {/* <motion.div variants={itemVariants}>
        <CommunitySection/>
      </motion.div> */}
      <motion.div variants={itemVariants}>
        <FooterSection />
      </motion.div>
    </motion.div>
  );
}