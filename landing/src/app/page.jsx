import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PlatformSupport from "@/components/PlatformSupport";
import SocialProof from "@/components/SocialProof";
import ProblemEscalation from "@/components/ProblemEscalation";
import CostOfMissing from "@/components/CostOfMissing";
import ChaosVisualization from "@/components/ChaosVisualization";
import SolutionReveal from "@/components/SolutionReveal";
import FeatureGrid from "@/components/FeatureGrid";
import WhoItIsFor from "@/components/WhoItIsFor";
import Differentiation from "@/components/Differentiation";
import FinalCTA from "@/components/FinalCTA";

export default function Home() {
    return (
        <main className="bg-white text-gray-900 overflow-x-hidden selection:bg-gray-900 selection:text-white">
            <Navbar />
            <Hero />
            <PlatformSupport />
            <SocialProof />
            <div className="space-y-16">
                <ProblemEscalation />
                <CostOfMissing />
                <ChaosVisualization />
                <SolutionReveal />
                <FeatureGrid />
                <Differentiation />
                <WhoItIsFor />
                <FinalCTA />
            </div>
        </main>
    );
}
