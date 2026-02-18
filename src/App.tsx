import { Navigate, Route, Routes } from "react-router-dom";
import OnboardingFlow from "@/features/onboarding/OnboardingFlow";

const MobilePrototypePage = () => (
  <div className="mx-auto w-full max-w-[420px] px-2 pb-3 pt-2 sm:px-0">
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.10)]">
      <OnboardingFlow />
    </div>
  </div>
);

const App = () => (
  <main className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f3f7fb_55%,#eef4fa_100%)]">
    <Routes>
      <Route path="/" element={<MobilePrototypePage />} />
      <Route path="/onboarding" element={<MobilePrototypePage />} />
      <Route path="*" element={<Navigate to="/onboarding" replace />} />
    </Routes>
  </main>
);

export default App;
