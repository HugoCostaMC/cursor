import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  RefreshCcw,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type ChatStep =
  | "welcome"
  | "goal"
  | "tone"
  | "offer"
  | "skill1"
  | "skill1_edit"
  | "skill2"
  | "summary"
  | "trial"
  | "complete";

interface GoalOption {
  id: string;
  label: string;
  monetization: boolean;
}

interface ToneOption {
  id: string;
  label: string;
}

interface ChatMessage {
  id: number;
  role: "agent" | "user";
  content: string;
}

const GOALS: GoalOption[] = [
  { id: "reply", label: "Reply to followers I'm missing", monetization: false },
  { id: "sell", label: "Sell more of my course / product", monetization: true },
  { id: "email", label: "Grow my email list", monetization: true },
  { id: "faq", label: "Answer repetitive questions faster", monetization: false },
];

const TONES: ToneOption[] = [
  { id: "warm", label: "Warm & friendly" },
  { id: "direct", label: "Straight to the point" },
  { id: "playful", label: "Fun & playful" },
  { id: "professional", label: "Professional & polished" },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    role: "agent",
    content:
      "Hey 👋 I reviewed your profile and drafted a setup path. Ready to configure your AI onboarding?",
  },
  {
    id: 2,
    role: "agent",
    content: "Tap Start to begin. This takes around 2 minutes.",
  },
];

const createSkillOneDraft = (offer: string, tone: string): string =>
  `Hey 👋 Thanks for following!\nI can share details about ${offer} and help with your most common questions.\n\nTone: ${tone}.\n\nWant me to send this?`;

const buildSummary = ({
  goal,
  tone,
  offer,
  skill2Enabled,
  skill2Name,
}: {
  goal: string;
  tone: string;
  offer?: string | null;
  skill2Enabled: boolean;
  skill2Name: string;
}): string => {
  const lines = [
    "You're all set. Here's your onboarding summary:",
    `• Goal: ${goal}`,
    `• Tone: ${tone}`,
    "• Skill 1: Follow-to-DM welcome",
    `• Skill 2: ${skill2Enabled ? skill2Name : "Skipped for now"}`,
    "• Pre-moderation: ON",
  ];

  if (offer) {
    lines.splice(3, 0, `• Offer: ${offer}`);
  }

  return lines.join("\n");
};

const OnboardingFlow = () => {
  const [step, setStep] = useState<ChatStep>("welcome");
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [quickReplies, setQuickReplies] = useState<string[]>(["Start", "Not now"]);
  const [inputValue, setInputValue] = useState("");

  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [selectedToneId, setSelectedToneId] = useState<string | null>(null);
  const [offer, setOffer] = useState<string | null>(null);
  const [skill1Message, setSkill1Message] = useState<string | null>(null);
  const [skill2Enabled, setSkill2Enabled] = useState<boolean | null>(null);
  const [trialStarted, setTrialStarted] = useState<boolean | null>(null);

  const messageIdRef = useRef(3);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const selectedGoal = useMemo(
    () => GOALS.find((goal) => goal.id === selectedGoalId) ?? null,
    [selectedGoalId],
  );
  const selectedTone = useMemo(
    () => TONES.find((tone) => tone.id === selectedToneId) ?? null,
    [selectedToneId],
  );

  const monetizationPath = selectedGoal?.monetization ?? false;

  const stepSequence = useMemo(
    () =>
      monetizationPath
        ? ([
            "welcome",
            "goal",
            "tone",
            "offer",
            "skill1",
            "skill2",
            "summary",
            "trial",
            "complete",
          ] as const)
        : ([
            "welcome",
            "goal",
            "tone",
            "skill1",
            "skill2",
            "summary",
            "trial",
            "complete",
          ] as const),
    [monetizationPath],
  );

  const progressKey = step === "skill1_edit" ? "skill1" : step;
  const progressIndex = Math.max(stepSequence.indexOf(progressKey as (typeof stepSequence)[number]), 0);
  const progressValue = Math.round(((progressIndex + 1) / stepSequence.length) * 100);

  const needsTextInput = step === "offer" || step === "skill1_edit";
  const inputPlaceholder =
    step === "offer"
      ? "What do you sell? Example: Online coaching program"
      : "Write your preferred first DM wording";

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, quickReplies, step]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = inputValue.trim();
    if (!value || !needsTextInput) {
      return;
    }
    appendMessage("user", value);
    setInputValue("");

    if (step === "offer") {
      setOffer(value);
      const toneLabel = selectedTone?.label ?? "Warm & friendly";
      const draft = createSkillOneDraft(value, toneLabel);
      setSkill1Message(draft);
      appendMessage(
        "agent",
        `Great — I drafted your first message:\n\n${draft}\n\nUse this version?`,
      );
      setStep("skill1");
      setQuickReplies(["Looks good", "Edit this"]);
      return;
    }

    if (step === "skill1_edit") {
      setSkill1Message(value);
      appendMessage("agent", "Nice update. Saved your edited Skill 1 message.");
      startSkillTwoStep();
    }
  };

  const appendMessage = (role: ChatMessage["role"], content: string) => {
    setMessages((previous) => [
      ...previous,
      {
        id: messageIdRef.current++,
        role,
        content,
      },
    ]);
  };

  const resetConversation = () => {
    messageIdRef.current = 3;
    setStep("welcome");
    setMessages(INITIAL_MESSAGES);
    setQuickReplies(["Start", "Not now"]);
    setInputValue("");
    setSelectedGoalId(null);
    setSelectedToneId(null);
    setOffer(null);
    setSkill1Message(null);
    setSkill2Enabled(null);
    setTrialStarted(null);
  };

  const startSkillTwoStep = () => {
    const prompt = monetizationPath
      ? "One more suggestion: should I auto-reply to comments and send your offer link in DM?"
      : "One more suggestion: should I auto-reply to story mentions so engagement never goes cold?";
    appendMessage("agent", prompt);
    setStep("skill2");
    setQuickReplies(["Yes, do it", "Not yet"]);
  };

  const handleQuickReply = (reply: string) => {
    if (reply === "Restart onboarding") {
      resetConversation();
      return;
    }

    appendMessage("user", reply);

    if (step === "welcome") {
      if (reply === "Not now") {
        appendMessage("agent", "No problem. Tap Start whenever you're ready.");
        setQuickReplies(["Start"]);
        return;
      }
      appendMessage("agent", "Great. What's the main thing you want help with first?");
      setStep("goal");
      setQuickReplies(GOALS.map((goal) => goal.label));
      return;
    }

    if (step === "goal") {
      const goal = GOALS.find((item) => item.label === reply);
      if (!goal) {
        return;
      }
      setSelectedGoalId(goal.id);
      appendMessage("agent", `Perfect. We will prioritize: ${goal.label.toLowerCase()}.`);
      appendMessage("agent", "How should I sound when replying on your behalf?");
      setStep("tone");
      setQuickReplies(TONES.map((tone) => tone.label));
      return;
    }

    if (step === "tone") {
      const tone = TONES.find((item) => item.label === reply);
      if (!tone) {
        return;
      }
      setSelectedToneId(tone.id);
      appendMessage("agent", `Got it — using a ${tone.label.toLowerCase()} tone.`);

      if (monetizationPath) {
        appendMessage(
          "agent",
          "What is the main thing you offer? Send a short description so I can draft Skill 1.",
        );
        setStep("offer");
        setQuickReplies([]);
        return;
      }

      const draft = createSkillOneDraft("your content and offers", tone.label);
      setSkill1Message(draft);
      appendMessage(
        "agent",
        `I drafted your first follow-to-DM message:\n\n${draft}\n\nUse this version?`,
      );
      setStep("skill1");
      setQuickReplies(["Looks good", "Edit this"]);
      return;
    }

    if (step === "skill1") {
      if (reply === "Edit this") {
        appendMessage("agent", "Send me the exact wording you want for Skill 1.");
        setStep("skill1_edit");
        setQuickReplies([]);
        return;
      }
      appendMessage("agent", "Great. Skill 1 approved.");
      startSkillTwoStep();
      return;
    }

    if (step === "skill2") {
      const enabled = reply === "Yes, do it";
      setSkill2Enabled(enabled);
      const summary = buildSummary({
        goal: selectedGoal?.label ?? "Not set",
        tone: selectedTone?.label ?? "Not set",
        offer,
        skill2Enabled: enabled,
        skill2Name: monetizationPath ? "Comment-to-DM with offer link" : "Story mention auto-reply",
      });
      appendMessage("agent", summary);
      appendMessage("agent", "Continue to final trial step?");
      setStep("summary");
      setQuickReplies(["Continue"]);
      return;
    }

    if (step === "summary") {
      appendMessage(
        "agent",
        "Final step: start your free trial now, or skip and continue in setup mode.",
      );
      setStep("trial");
      setQuickReplies(["Start free trial", "Skip for now"]);
      return;
    }

    if (step === "trial") {
      if (reply === "Start free trial") {
        setTrialStarted(true);
        appendMessage(
          "agent",
          "Trial started ✅\nNext: connect Instagram and launch your first two skills.",
        );
      } else {
        setTrialStarted(false);
        appendMessage(
          "agent",
          "No worries — setup is saved. You can start the trial anytime from settings.",
        );
      }
      setStep("complete");
      setQuickReplies(["Restart onboarding"]);
    }
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
      <div className="border-b border-slate-300 bg-[#f3f4f6] px-4 pb-2 pt-1">
        <div className="mb-1 flex items-center justify-between text-[11px] text-slate-600">
          <span>
            Step {Math.min(progressIndex + 1, stepSequence.length - 1)} of {stepSequence.length - 1}
          </span>
          <span>Onboarding</span>
        </div>
        <Progress value={progressValue} className="h-1.5 bg-slate-300/80" />
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
        <div ref={scrollRef} className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex w-full", message.role === "user" ? "justify-end" : "justify-start")}
            >
              {message.role === "agent" ? (
                <div className="flex max-w-[92%] items-end gap-2">
                  <span className="mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-slate-700">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                  <div className="whitespace-pre-line rounded-2xl rounded-tl-md bg-[#dce3ee] px-4 py-3 text-[13px] leading-relaxed text-slate-800">
                    {message.content}
                  </div>
                </div>
              ) : (
                <div className="max-w-[82%] whitespace-pre-line rounded-2xl rounded-br-md bg-[#1F5ED8] px-4 py-3 text-[13px] leading-relaxed text-white">
                  {message.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <footer className="px-4 pb-4 pt-2">
        {quickReplies.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {quickReplies.map((reply) => (
              <Button
                key={reply}
                type="button"
                size="sm"
                variant="outline"
                onClick={() => handleQuickReply(reply)}
                className="rounded-lg border-slate-300 bg-[#f8f8f8] text-[13px] text-slate-700 hover:bg-slate-200"
              >
                {reply}
              </Button>
            ))}
          </div>
        )}

        <form className="relative" onSubmit={handleSubmit}>
          <Input
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder={needsTextInput ? inputPlaceholder : "Use quick replies above"}
            className="h-16 rounded-xl border-slate-300 bg-[#f8f9fb] pr-14 text-[16px] text-slate-800 placeholder:text-slate-500"
            disabled={!needsTextInput}
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-3 top-1/2 h-10 w-10 -translate-y-1/2 text-slate-700 hover:bg-slate-200"
            aria-label="Send"
            disabled={!needsTextInput || inputValue.trim().length === 0}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
        {step === "complete" && (
          <p className="mt-2 text-[12px] font-medium text-slate-700">
            Status: {trialStarted ? "Trial started" : "Setup saved without trial"}
          </p>
        )}
        <p className="mt-2 text-[12px] text-slate-500">Manychat AI can make mistakes.</p>
      </footer>
    </div>
  );
};

export default OnboardingFlow;
