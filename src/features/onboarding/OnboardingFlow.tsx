import { useMemo, useState } from "react";
import { Check, Circle, Sparkles, X } from "lucide-react";
import manychatLogo from "@/assets/brand/manychat-logo.png";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Step = 0 | 1 | 2 | 3;
type Plan = "annual" | "monthly";

interface Goal {
  id: string;
  label: string;
  description: string;
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

const SKILLS = [
  {
    title: "Life-long skills",
    description: "Auto-reply to FAQs using your Instagram and product context.",
  },
  {
    title: "Lead capture moments",
    description: "Collect email intent without pushing followers away.",
  },
  {
    title: "Conversion nudges",
    description: "Send the right offer links when purchase intent appears.",
  },
];

const Illustration = ({ step }: { step: Step }) => {
  const palette =
    step === 0
      ? "from-[#FFBF00] to-[#F7A600]"
      : step === 3
        ? "from-[#FFE067] to-[#F9C73E]"
        : "from-[#FF8C1A] to-[#FF7B15]";

  return (
    <div className={cn("relative h-60 w-full overflow-hidden bg-gradient-to-b", palette)}>
      <div className="absolute -left-16 top-6 h-36 w-36 rounded-full border-[16px] border-orange-200/60" />
      <div className="absolute -right-14 top-2 h-40 w-40 rounded-full border-[16px] border-orange-200/60" />
      <div className="absolute left-1/2 top-14 flex h-[5.5rem] w-[5.5rem] -translate-x-1/2 items-center justify-center rounded-full bg-yellow-300 shadow-inner">
        <div className="flex items-center gap-2">
          <span className="block h-1.5 w-1.5 rounded-full bg-orange-900/70" />
          <span className="block h-1.5 w-1.5 rounded-full bg-orange-900/70" />
        </div>
        <span className="absolute top-11 h-2 w-8 rounded-full border-t-2 border-orange-900/70" />
      </div>
      <div className="absolute -bottom-7 left-1/2 h-20 w-[120%] -translate-x-1/2 rounded-[50%] bg-card" />
    </div>
  );
};

const OnboardingFlow = () => {
  const [step, setStep] = useState<Step>(0);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan>("annual");
  const [startedTrial, setStartedTrial] = useState(false);

  const progressValue = ((step + 1) / 4) * 100;
  const activeGoal = useMemo(
    () => GOALS.find((goal) => goal.id === selectedGoal) ?? null,
    [selectedGoal],
  );

  const continueFromGoal = () => {
    if (!selectedGoal) {
      return;
    }
    setStep((previous) => (previous === 0 ? 1 : 2));
  };

  return (
    <div className="flex min-h-[760px] flex-col overflow-hidden rounded-[1.8rem] bg-card">
      <div className="relative">
        <Illustration step={step} />
        <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
          <img src={manychatLogo} alt="Manychat" className="h-6 w-auto" />
          <Badge variant="secondary" className="bg-white/85 text-slate-700">
            Mobile onboarding
          </Badge>
        </div>
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
                className="h-12 w-full rounded-full bg-[#2F6FEB] text-white hover:bg-[#2A63D3]"
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
                    <CardDescription className="text-xs">{skill.description}</CardDescription>
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
                className="h-12 rounded-full bg-[#2F6FEB] text-white hover:bg-[#2A63D3]"
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
                <p className="mt-2 text-sm text-muted-foreground">
                  Unlock goal-based automations and start your first live trial.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close paywall"
                className="rounded-full border border-slate-200 p-1.5 text-slate-500"
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
                    : "border-slate-200 bg-slate-50",
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900">$69.99 Annual ($5.84/month)</p>
                  <Badge className="bg-[#2F6FEB] text-white">Best value</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">First 14 days free</p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlan("monthly")}
                className={cn(
                  "w-full rounded-2xl border p-4 text-left transition",
                  selectedPlan === "monthly"
                    ? "border-[#2F6FEB] bg-[#2F6FEB]/10"
                    : "border-slate-200 bg-slate-50",
                )}
              >
                <p className="font-semibold text-slate-900">$12.99 Monthly</p>
                <p className="mt-1 text-xs text-muted-foreground">First 7 days free</p>
              </button>
            </div>

            <Separator className="my-4" />

            {startedTrial && (
              <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
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
              className="mt-auto h-12 rounded-full bg-[#2F6FEB] text-white hover:bg-[#2A63D3]"
              onClick={() => setStartedTrial(true)}
            >
              Start your free trial
            </Button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
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
