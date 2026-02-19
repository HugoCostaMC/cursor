import { type FormEvent, useState } from "react";
import {
  Link2,
  MessageCircleMore,
  RefreshCcw,
  Send,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const OnboardingFlow = () => {
  const [question, setQuestion] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuestion("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f3f4f6]">
      <header className="flex items-center justify-between border-b border-slate-300 bg-[#f3f4f6] px-4 py-3">
        <h1 className="text-[20px] font-semibold leading-none text-slate-800">AI Playground</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Refresh"
            className="rounded-lg border border-slate-300 bg-[#f3f4f6] p-2 text-slate-600 hover:bg-slate-200"
          >
            <RefreshCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Close"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
        <div className="flex items-start gap-3">
          <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-slate-700">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <div className="max-w-[86%] rounded-2xl rounded-tl-md bg-[#dce3ee] px-4 py-3 text-[13px] leading-relaxed text-slate-800">
            Hi! 👋 Yes, absolutely — most of our classes are beginner-friendly. Our Beginner Yoga
            sessions are held every Tuesday and Thursday at 10:00 AM and focus on foundational
            strength, balance, and breathing. These classes are led by Mia, who specializes in
            Hatha and Restorative yoga and is known for her gentle approach with new students.
            You&apos;re welcome anytime! 🧘✨
          </div>
        </div>

        <div className="pl-10">
          <p className="text-[13px] text-slate-700">Answered based on:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-[#f8f8f8] px-2.5 py-1.5 text-[13px] font-medium text-slate-700"
            >
              <Link2 className="h-3.5 w-3.5" />
              Classes
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-[#f8f8f8] px-2.5 py-1.5 text-[13px] font-medium text-slate-700"
            >
              <Link2 className="h-3.5 w-3.5" />
              Yoga Instructors
            </button>
          </div>
          <div className="mt-4 flex items-center gap-3 text-slate-600">
            <button
              type="button"
              aria-label="Helpful"
              className="rounded-md p-1 hover:bg-slate-200"
            >
              <ThumbsUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Not helpful"
              className="rounded-md p-1 hover:bg-slate-200"
            >
              <ThumbsDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div>
          <p className="text-[15px] text-slate-700">
            Updated it! <span className="font-medium">∞ Classes</span> is now part of AI&apos;s
            brain for future answers
          </p>
          <h2 className="mt-2 text-[16px] font-semibold leading-snug text-slate-800">
            Do you want to see how AI answers with the same question?
          </h2>
          <button
            type="button"
            className="mt-4 w-full rounded-xl border border-slate-300 bg-[#f4f4f5] px-4 py-5 text-left"
          >
            <MessageCircleMore className="mb-3 h-5 w-5 text-slate-500" />
            <p className="text-[16px] font-semibold leading-snug text-slate-800">See how AI answers now</p>
          </button>
        </div>
      </div>

      <footer className="px-4 pb-4 pt-2">
        <form className="relative" onSubmit={handleSubmit}>
          <Input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask me anything"
            className="h-16 rounded-xl border-slate-300 bg-[#f8f9fb] pr-14 text-[16px] text-slate-800 placeholder:text-slate-500"
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-3 top-1/2 h-10 w-10 -translate-y-1/2 text-slate-700 hover:bg-slate-200"
            aria-label="Send"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
        <p className="mt-2 text-[12px] text-slate-500">Manychat AI can make mistakes.</p>
      </footer>
    </div>
  );
};

export default OnboardingFlow;
