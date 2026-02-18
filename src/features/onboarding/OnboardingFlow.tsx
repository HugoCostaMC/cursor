import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Check, RotateCcw, Send, Sparkles } from "lucide-react";
import manychatLogo from "@/assets/brand/manychat-logo.png";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type ChatStep =
  | "goal"
  | "tone"
  | "offer"
  | "skill-one"
  | "skill-one-edit"
  | "skill-two"
  | "trial";

interface Goal {
  id: string;
  label: string;
  description: string;
}

interface Tone {
  id: string;
  label: string;
}

interface ChatMessage {
  id: number;
  role: "agent" | "user" | "system";
  content: string;
}

const GOALS: Goal[] = [
  {
    id: "reply",
    label: "Reply to followers I'm missing",
    description: "Catch conversations that currently go unanswered.",
  },
  {
    id: "sell",
    label: "Sell more of my course / product",
    description: "Turn DMs into leads and buyers.",
  },
  {
    id: "email",
    label: "Grow my email list",
    description: "Capture contact info naturally in chat.",
  },
  {
    id: "faq",
    label: "Answer repetitive questions faster",
    description: "Handle common asks with your voice and style.",
  },
];

const TONES: Tone[] = [
  { id: "warm", label: "Warm & friendly" },
  { id: "direct", label: "Straight to the point" },
  { id: "playful", label: "Fun & playful" },
  { id: "professional", label: "Professional & polished" },
];

const MONETIZATION_GOALS = new Set(["sell", "email"]);

const createSkillOneDraft = (offer: string): string =>
  `Hey 👋 Thanks for following!\nI can share details about ${offer} and help you with the most common questions. Want me to send it?`;

const getSecondSkillPrompt = (monetizationPath: boolean): string =>
  monetizationPath
    ? "One more suggestion: should I auto-reply to comments and send your offer link in DM?"
    : "One more suggestion: should I auto-reply to story mentions so engagement never goes cold?";

const getSecondSkillName = (monetizationPath: boolean): string =>
  monetizationPath ? "Comment-to-DM with offer link" : "Story mention auto-reply";

const initialMessages = (): ChatMessage[] => [
  {
    id: 1,
    role: "agent",
    content:
      "Hey Anna! 👋 I reviewed your Instagram profile and content. It looks like you teach your craft and monetize through conversations.",
  },
  {
    id: 2,
    role: "agent",
    content: "What's the main thing you'd like Manychat to help with first?",
  },
];

const OnboardingFlow = () => {
  const [step, setStep] = useState<ChatStep>("goal");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [quickReplies, setQuickReplies] = useState<string[]>(GOALS.map((goal) => goal.label));
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [selectedToneId, setSelectedToneId] = useState<string | null>(null);
  const [offerText, setOfferText] = useState<string | null>(null);
  const [skillOneMessage, setSkillOneMessage] = useState<string | null>(null);
  const [secondSkillEnabled, setSecondSkillEnabled] = useState<boolean | null>(null);
  const [startedTrial, setStartedTrial] = useState(false);
  const [inputValue, setInputValue] = useState("");
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
  const monetizationPath = selectedGoalId ? MONETIZATION_GOALS.has(selectedGoalId) : false;

  const progressValue = useMemo(() => {
    const values: Record<ChatStep, number> = {
      goal: 16,
      tone: 34,
      offer: 50,
      "skill-one": 66,
      "skill-one-edit": 72,
      "skill-two": 82,
      trial: 100,
    };
    return values[step];
  }, [step]);

  const needsTextInput = step === "offer" || step === "skill-one-edit";
  const inputPlaceholder =
    step === "offer"
      ? "Example: Online cake decorating masterclass"
      : "Write your preferred first DM message";

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, quickReplies, needsTextInput]);

  const appendMessage = (role: ChatMessage["role"], content: string) => {
    const nextMessage: ChatMessage = {
      id: messageIdRef.current,
      role,
      content,
    };
    messageIdRef.current += 1;
    setMessages((previous) => [...previous, nextMessage]);
  };

  const resetConversation = () => {
    messageIdRef.current = 3;
    setMessages(initialMessages());
    setQuickReplies(GOALS.map((goal) => goal.label));
    setStep("goal");
    setSelectedGoalId(null);
    setSelectedToneId(null);
    setOfferText(null);
    setSkillOneMessage(null);
    setSecondSkillEnabled(null);
    setStartedTrial(false);
    setInputValue("");
  };

  const handleQuickReply = (reply: string) => {
    if (reply === "Restart onboarding") {
      resetConversation();
      return;
    }

    appendMessage("user", reply);

    if (step === "goal") {
      const goal = GOALS.find((item) => item.label === reply);
      if (!goal) {
        return;
      }

      setSelectedGoalId(goal.id);
      appendMessage("agent", `Great. We'll prioritize: ${goal.label.toLowerCase()}.`);
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
      appendMessage("agent", `Perfect — I'll use a ${tone.label.toLowerCase()} tone.`);

      if (monetizationPath) {
        appendMessage(
          "agent",
          "What is the main thing you sell? Send a short description and I'll craft your first DM.",
        );
        setStep("offer");
        setQuickReplies([]);
        return;
      }

      const generatedMessage = createSkillOneDraft("your content and offers");
      setSkillOneMessage(generatedMessage);
      appendMessage(
        "agent",
        `I suggest this first follow-to-DM message:\n\n${generatedMessage}\n\nUse it as-is?`,
      );
      setStep("skill-one");
      setQuickReplies(["Looks good", "Edit first message"]);
      return;
    }

    if (step === "skill-one") {
      if (reply === "Looks good") {
        appendMessage("agent", getSecondSkillPrompt(monetizationPath));
        setStep("skill-two");
        setQuickReplies(["Yes, do it", "Not yet"]);
        return;
      }

      appendMessage("agent", "Send me the exact first DM wording you want.");
      setStep("skill-one-edit");
      setQuickReplies([]);
      return;
    }

    if (step === "skill-two") {
      const enabled = reply === "Yes, do it";
      setSecondSkillEnabled(enabled);
      const secondSkill = getSecondSkillName(monetizationPath);
      const summary = [
        "You're set! Here's your activation summary:",
        `• Goal: ${selectedGoal?.label ?? "Not set"}`,
        `• Tone: ${selectedTone?.label ?? "Not set"}`,
        "• Skill 1: Follow-to-DM welcome",
        enabled ? `• Skill 2: ${secondSkill}` : "• Skill 2: Skipped for now",
        "• Pre-moderation: ON",
      ].join("\n");
      appendMessage("agent", summary);
      appendMessage("agent", "Ready to start your free trial?");
      setStep("trial");
      setQuickReplies(["Start free trial"]);
      return;
    }

    if (step === "trial" && reply === "Start free trial") {
      setStartedTrial(true);
      appendMessage(
        "agent",
        "Awesome. Trial started in prototype mode ✅\nNext: connect Instagram and launch your first two skills.",
      );
      setQuickReplies(["Restart onboarding"]);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = inputValue.trim();
    if (!value || !needsTextInput) {
      return;
    }

    appendMessage("user", value);
    setInputValue("");

    if (step === "offer") {
      setOfferText(value);
      const generatedMessage = createSkillOneDraft(value);
      setSkillOneMessage(generatedMessage);
      appendMessage(
        "agent",
        `Great — this is your first follow-to-DM message:\n\n${generatedMessage}\n\nUse it as-is?`,
      );
      setStep("skill-one");
      setQuickReplies(["Looks good", "Edit first message"]);
      return;
    }

    if (step === "skill-one-edit") {
      setSkillOneMessage(value);
      appendMessage("agent", "Perfect, message updated.");
      appendMessage("agent", getSecondSkillPrompt(monetizationPath));
      setStep("skill-two");
      setQuickReplies(["Yes, do it", "Not yet"]);
    }
  };

  const secondaryMeta = useMemo(() => {
    if (step !== "trial") {
      return "Live setup";
    }
    if (startedTrial) {
      return "Trial active";
    }
    return secondSkillEnabled === null ? "Awaiting choice" : "Ready";
  }, [startedTrial, step, secondSkillEnabled]);

  return (
    <div className="flex min-h-[760px] flex-col overflow-hidden rounded-[1.8rem] bg-white">
      <header className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img src={manychatLogo} alt="Manychat" className="h-6 w-auto" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Onboarding chat</p>
              <p className="text-xs text-slate-600">{secondaryMeta}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#1F5ED8] text-white">Light mode</Badge>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 border-slate-300"
              onClick={resetConversation}
              aria-label="Restart onboarding"
            >
              <RotateCcw className="h-4 w-4 text-slate-700" />
            </Button>
          </div>
        </div>
        <Progress value={progressValue} className="mt-3 h-1.5 bg-slate-200" />
      </header>

      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-slate-50 to-white px-3 py-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex w-full",
              message.role === "user"
                ? "justify-end"
                : message.role === "system"
                  ? "justify-center"
                  : "justify-start",
            )}
          >
            {message.role === "agent" ? (
              <div className="flex max-w-[92%] items-end gap-2">
                <span className="mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#1F5ED8] text-white">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div className="whitespace-pre-line rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-900 shadow-sm">
                  {message.content}
                </div>
              </div>
            ) : message.role === "user" ? (
              <div className="max-w-[82%] whitespace-pre-line rounded-2xl rounded-br-sm bg-[#1F5ED8] px-3 py-2.5 text-sm leading-relaxed text-white">
                {message.content}
              </div>
            ) : (
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                {message.content}
              </div>
            )}
          </div>
        ))}
      </div>

      <footer className="border-t border-slate-200 bg-white px-3 pb-3 pt-2">
        {quickReplies.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {quickReplies.map((reply) => {
              const primaryReply =
                reply === "Start free trial" || reply === "Yes, do it" || reply === "Looks good";
              return (
                <Button
                  key={reply}
                  type="button"
                  size="sm"
                  variant={primaryReply ? "default" : "outline"}
                  className={cn(
                    "rounded-full text-xs",
                    primaryReply
                      ? "bg-[#1F5ED8] text-white hover:bg-[#1A4FC0]"
                      : "border-slate-300 bg-white text-slate-800 hover:bg-slate-100",
                  )}
                  onClick={() => handleQuickReply(reply)}
                >
                  {reply}
                </Button>
              );
            })}
          </div>
        )}

        {needsTextInput ? (
          <form className="flex items-center gap-2" onSubmit={handleSubmit}>
            <Input
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder={inputPlaceholder}
              className="h-11 rounded-full border-slate-300 text-slate-900 placeholder:text-slate-500"
              aria-label={inputPlaceholder}
            />
            <Button
              type="submit"
              size="icon"
              className="h-11 w-11 rounded-full bg-[#1F5ED8] text-white hover:bg-[#1A4FC0]"
              disabled={inputValue.trim().length === 0}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
            Choose a quick reply to continue this onboarding chat.
          </div>
        )}

        {step === "trial" && startedTrial && (
          <div className="mt-2 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
            <p className="flex items-center gap-1.5 font-medium">
              <Check className="h-3.5 w-3.5" />
              Trial started in prototype mode
            </p>
            <p className="mt-0.5 text-emerald-800/90">Goal: {selectedGoal?.label ?? "—"}</p>
            <p className="mt-0.5 text-emerald-800/90">Tone: {selectedTone?.label ?? "—"}</p>
            {offerText ? (
              <p className="mt-0.5 text-emerald-800/90">Offer: {offerText}</p>
            ) : null}
            {skillOneMessage ? (
              <p className="mt-0.5 text-emerald-800/90">Skill 1 ready</p>
            ) : null}
          </div>
        )}
      </footer>
    </div>
  );
};

export default OnboardingFlow;
      </div>

      <div className="-mt-5 flex flex-1 flex-col rounded-t-[1.8rem] bg-card px-5 pb-5 pt-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Step {step + 1} of 4
          </p>
          <p className="text-xs text-muted-foreground">~2 min setup</p>
        </div>
        <Progress value={progressValue} className="mb-5 h-1.5 bg-slate-200" />

        {(step === 0 || step === 1) && (
          <div className="flex flex-1 flex-col">
            <h2 className="text-[1.65rem] font-semibold leading-tight text-slate-800">
              {step === 0 ? "What's your top onboarding goal?" : activeGoal?.label ?? "Your goal"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose one option for now. You can add more skills right after activation.
            </p>

            <div className="mt-6 space-y-2.5">
              {GOALS.map((goal) => {
                const selected = selectedGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setSelectedGoal(goal.id)}
                    className={cn(
                      "w-full rounded-full border px-4 py-3 text-left transition",
                      selected
                        ? "border-slate-800 bg-slate-800 text-white"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100",
                    )}
                  >
                    <span className="block text-sm font-semibold">{goal.label}</span>
                    <span
                      className={cn(
                        "mt-1 block text-xs",
                        selected ? "text-slate-200" : "text-muted-foreground",
                      )}
                    >
                      {goal.description}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto pt-6">
              <Button
                size="lg"
                className="h-12 w-full rounded-full bg-[#1F5ED8] text-white hover:bg-[#1A4FC0]"
                disabled={!selectedGoal}
                onClick={continueFromGoal}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-1 flex-col">
            <h2 className="text-[1.6rem] font-semibold leading-tight text-slate-800">
              Let's create your Manychat practice.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We'll activate a focused starter bundle for{" "}
              <span className="font-medium text-slate-700">{activeGoal?.label.toLowerCase()}</span>.
            </p>

            <div className="mt-5 space-y-3">
              {SKILLS.map((skill) => (
                <Card key={skill.title} className="rounded-2xl border-slate-200 shadow-none">
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2F6FEB]/10 text-[#2F6FEB]">
                        <Sparkles className="h-4 w-4" />
                      </span>
                      {skill.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <CardDescription className="text-xs text-slate-600">{skill.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
              <Button
                size="lg"
                variant="secondary"
                className="h-12 rounded-full"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                size="lg"
                className="h-12 rounded-full bg-[#1F5ED8] text-white hover:bg-[#1A4FC0]"
                onClick={() => setStep(3)}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-1 flex-col">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[1.55rem] font-semibold leading-tight text-slate-800">
                  Try Manychat Pro
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Unlock goal-based automations and start your first live trial.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close paywall"
                className="rounded-full border border-slate-300 p-1.5 text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={() => setSelectedPlan("annual")}
                className={cn(
                  "w-full rounded-2xl border p-4 text-left transition",
                  selectedPlan === "annual"
                    ? "border-[#FF8C1A] bg-[#FF8C1A]/10"
                    : "border-slate-300 bg-slate-50",
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900">$69.99 Annual ($5.84/month)</p>
                  <Badge className="bg-[#1F5ED8] text-white">Best value</Badge>
                </div>
                <p className="mt-1 text-xs text-slate-600">First 14 days free</p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlan("monthly")}
                className={cn(
                  "w-full rounded-2xl border p-4 text-left transition",
                  selectedPlan === "monthly"
                    ? "border-[#1F5ED8] bg-[#1F5ED8]/10"
                    : "border-slate-300 bg-slate-50",
                )}
              >
                <p className="font-semibold text-slate-900">$12.99 Monthly</p>
                <p className="mt-1 text-xs text-slate-600">First 7 days free</p>
              </button>
            </div>

            <Separator className="my-4" />

            {startedTrial && (
              <div className="mb-3 rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800">
                <p className="flex items-center gap-2 font-medium">
                  <Check className="h-4 w-4" />
                  Trial started in prototype mode
                </p>
                <p className="mt-1 text-xs">
                  Next step: connect Instagram and activate your first two skills.
                </p>
              </div>
            )}

            <Button
              size="lg"
              className="mt-auto h-12 rounded-full bg-[#1F5ED8] text-white hover:bg-[#1A4FC0]"
              onClick={() => setStartedTrial(true)}
            >
              Start your free trial
            </Button>
            <p className="mt-3 text-center text-[11px] text-slate-600">
              Restore Purchase · Terms & Conditions
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center pb-3">
        <Circle className="h-2.5 w-2.5 fill-slate-900 text-slate-900" />
      </div>
    </div>
  );
};

export default OnboardingFlow;
