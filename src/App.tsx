import { Navigate, Route, Routes } from "react-router-dom";
import OnboardingFlow from "@/features/onboarding/OnboardingFlow";

const MobilePrototypePage = () => (
  <div className="mx-auto w-full max-w-[420px] border-x border-slate-300 bg-[#f3f4f6]">
    <div className="overflow-hidden bg-[#f3f4f6]">
      <OnboardingFlow />
    </div>
  </div>
);

const App = () => (
  <main className="min-h-screen bg-[#e8eaee]">
    <Routes>
      <Route path="/" element={<MobilePrototypePage />} />
      <Route path="/onboarding" element={<MobilePrototypePage />} />
      <Route path="*" element={<Navigate to="/onboarding" replace />} />
    </Routes>
  </main>
);

export default App;
