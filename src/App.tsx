import { Navigate, Route, Routes } from "react-router-dom";
import OnboardingFlow from "@/features/onboarding/OnboardingFlow";

const MobilePrototypePage = () => (
  <div className="mx-auto w-full max-w-[420px] px-2 pb-3 pt-2 sm:px-0">
    <div className="overflow-hidden rounded-[2rem] border border-white/20 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
      <OnboardingFlow />
    </div>
  </div>
);

const App = () => (
  <main className="min-h-screen bg-black bg-[radial-gradient(circle_at_top,_#1a2232_0%,_#000_62%)]">
    <Routes>
      <Route path="/" element={<MobilePrototypePage />} />
      <Route path="/onboarding" element={<MobilePrototypePage />} />
      <Route path="*" element={<Navigate to="/onboarding" replace />} />
    </Routes>
  </main>
);

export default App;
