import FooterSection from "@/components/footer";
import HeroSection from "@/components/hero-section";
import PrivacyPolicyPage from "@/components/privacypolicy";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#0F0004] text-white">
            <PrivacyPolicyPage />
            <FooterSection />
        </div>
    )
}