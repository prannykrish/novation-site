"use client";

import { HeroHeader } from "@/components/nav-bar";
import FooterSection from "@/components/footer";
import { motion } from "framer-motion";
import Pricing from "@/misc_components/pricing";
import CallToAction from "@/components/call-to-action";
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
        <Pricing />
      </motion.div>
      <motion.div variants={itemVariants}>
        <CallToAction/>
      </motion.div>
      <motion.div variants={itemVariants}>
        <FooterSection />
      </motion.div>
      
    </motion.div>
  );
}