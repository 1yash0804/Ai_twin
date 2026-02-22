import Hero from "@/components/marketing/Hero";
import Problem from "@/components/marketing/Problem";
import Solution from "@/components/marketing/Solution";
import Capabilities from "@/components/marketing/Capabilities";
import WhoFor from "@/components/marketing/WhoFor";
import FinalCTA from "@/components/marketing/FinalCTA";

export default function MarketingPage() {
    return (
        <div className="relative">
            <Hero />
            <Problem />
            <Solution />
            <Capabilities />
            <WhoFor />
            <FinalCTA />
        </div>
    );
}
