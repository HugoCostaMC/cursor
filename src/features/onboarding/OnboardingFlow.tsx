import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Input,
  Progress,
  Radio,
  Row,
  Space,
  Statistic,
  Steps,
  Tag,
  Typography,
} from "antd";
import styled from "styled-components";

type FlowStep =
  | "connect"
  | "indexing"
  | "greeting"
  | "goals"
  | "tone"
  | "offer"
  | "skillOne"
  | "skillTwo"
  | "goLive";

type ToneId = "warm" | "direct" | "playful" | "professional";

interface GoalOption {
  id: string;
  icon: string;
  label: string;
  description: string;
  monetizationRelated: boolean;
}

const GOAL_OPTIONS: GoalOption[] = [
  {
    id: "reply",
    icon: "🗣️",
    label: "Reply to followers I'm missing",
    description: "Handle unanswered DMs and story replies quickly.",
    monetizationRelated: false,
  },
  {
    id: "sell",
    icon: "💰",
    label: "Sell more of my course / product",
    description: "Qualify buyers and send the right links automatically.",
    monetizationRelated: true,
  },
  {
    id: "email",
    icon: "📧",
    label: "Grow my email list",
    description: "Capture leads naturally while chatting in DMs.",
    monetizationRelated: true,
  },
  {
    id: "faq",
    icon: "🤝",
    label: "Answer the same questions I get every day",
    description: "Use indexed content to answer common audience questions.",
    monetizationRelated: false,
  },
];

const TONE_OPTIONS: Array<{ id: ToneId; label: string; helper: string }> = [
  {
    id: "warm",
    label: "Warm & friendly 😊",
    helper: "Supportive and conversational.",
  },
  {
    id: "direct",
    label: "Straight to the point 💪",
    helper: "Concise and action-focused.",
  },
  {
    id: "playful",
    label: "Fun & playful 🎉",
    helper: "Energetic with personality.",
  },
  {
    id: "professional",
    label: "Professional & polished ✨",
    helper: "Clear, expert, and confident.",
  },
];

const TONE_LABELS: Record<ToneId, string> = {
  warm: "Warm & friendly",
  direct: "Straight to the point",
  playful: "Fun & playful",
  professional: "Professional & polished",
};

const SContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const SFlowFrame = styled.div`
  width: min(100%, 560px);
`;

const SAgentBubble = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
`;

const SOptionGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SGoalOption = styled.button<{ $selected: boolean }>`
  width: 100%;
  text-align: left;
  border: 1px solid
    ${({ theme, $selected }) => ($selected ? theme.colors.primary : theme.colors.border)};
  background: ${({ theme, $selected }) => ($selected ? `${theme.colors.primary}10` : theme.colors.surface)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  transition: border-color 0.15s ease;
`;

const SMessagePreview = styled.div`
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  white-space: pre-line;
`;

const getGoalsLabel = (selectedIds: string[]): string => {
  const selected = GOAL_OPTIONS.filter((goal) => selectedIds.includes(goal.id)).map(
    (goal) => goal.label,
  );
  return selected.length > 0 ? selected.join(", ") : "Not selected";
};

const OnboardingFlow = () => {
  const [step, setStep] = useState<FlowStep>("connect");
  const [indexingProgress, setIndexingProgress] = useState(0);
  const [contextAccuracy, setContextAccuracy] = useState<"yes" | "tweak" | null>(null);
  const [contextCorrection, setContextCorrection] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [tone, setTone] = useState<ToneId>("warm");
  const [offer, setOffer] = useState("Online course / coaching program");
  const [leadMagnet, setLeadMagnet] = useState("free guide");
  const [skillOneCustomMessage, setSkillOneCustomMessage] = useState<string | null>(null);
  const [skillOneDraft, setSkillOneDraft] = useState("");
  const [editingSkillOne, setEditingSkillOne] = useState(false);
  const [skillOneConfigured, setSkillOneConfigured] = useState<"default" | "custom" | null>(null);
  const [skillTwoEnabled, setSkillTwoEnabled] = useState<boolean | null>(null);

  const creatorName = "Anna";
  const creatorNiche = "Cake decorating / baking education";

  const monetizationPath = useMemo(
    () =>
      GOAL_OPTIONS.some(
        (goal) => goal.monetizationRelated && goals.some((selectedGoal) => selectedGoal === goal.id),
      ),
    [goals],
  );

  useEffect(() => {
    if (step !== "indexing") {
      return;
    }

    setIndexingProgress(0);
    let timeoutId: number | undefined;

    const intervalId = window.setInterval(() => {
      setIndexingProgress((previous) => {
        const next = Math.min(previous + 12, 100);

        if (next >= 100) {
          window.clearInterval(intervalId);
          timeoutId = window.setTimeout(() => {
            setStep("greeting");
          }, 350);
        }

        return next;
      });
    }, 450);

    return () => {
      window.clearInterval(intervalId);
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [step]);

  const stepLabels = monetizationPath
    ? ["Connect", "Index", "Context", "Goals", "Tone", "Offer", "Skills", "Go live"]
    : ["Connect", "Index", "Context", "Goals", "Tone", "Skills", "Go live"];

  const currentStepIndex = useMemo(() => {
    if (monetizationPath) {
      switch (step) {
        case "connect":
          return 0;
        case "indexing":
          return 1;
        case "greeting":
          return 2;
        case "goals":
          return 3;
        case "tone":
          return 4;
        case "offer":
          return 5;
        case "skillOne":
        case "skillTwo":
          return 6;
        case "goLive":
          return 7;
        default:
          return 0;
      }
    }

    switch (step) {
      case "connect":
        return 0;
      case "indexing":
        return 1;
      case "greeting":
        return 2;
      case "goals":
        return 3;
      case "tone":
        return 4;
      case "skillOne":
      case "skillTwo":
        return 5;
      case "goLive":
        return 6;
      case "offer":
        return 4;
      default:
        return 0;
    }
  }, [monetizationPath, step]);

  const skillOneDefaultMessage = monetizationPath
    ? `Hey there 👋 Thanks for following!\nI’d love to share my ${leadMagnet} and point you to the ${offer}. Want me to send it?`
    : `Hey there 👋 Thanks for following!\nI can help with common questions and point you to the best post when you need details.`;

  const skillOnePreviewMessage = skillOneCustomMessage ?? skillOneDefaultMessage;

  const skillTwoPrompt = monetizationPath
    ? "One more — you get comments asking about your offer. Want me to DM details automatically when someone shows intent?"
    : "One more — want me to auto-reply to story mentions so no engagement goes cold?";

  const skillTwoName = monetizationPath
    ? "Comment-to-DM with product details"
    : "Story mention auto-reply";

  const activeSkills = [
    monetizationPath
      ? "Follow-to-DM welcome + lead magnet"
      : "Follow-to-DM welcome + FAQ starter",
    ...(skillTwoEnabled ? [skillTwoName] : []),
  ];

  const resetFlow = () => {
    setStep("connect");
    setIndexingProgress(0);
    setContextAccuracy(null);
    setContextCorrection("");
    setGoals([]);
    setTone("warm");
    setOffer("Online course / coaching program");
    setLeadMagnet("free guide");
    setSkillOneCustomMessage(null);
    setSkillOneDraft("");
    setEditingSkillOne(false);
    setSkillOneConfigured(null);
    setSkillTwoEnabled(null);
  };

  const toggleGoal = (goalId: string) => {
    setGoals((previous) =>
      previous.includes(goalId)
        ? previous.filter((item) => item !== goalId)
        : [...previous, goalId],
    );
  };

  const proceedFromTone = () => {
    if (monetizationPath) {
      setStep("offer");
      return;
    }
    setStep("skillOne");
  };

  const handleSkillOneLooksGood = () => {
    setSkillOneConfigured("default");
    setEditingSkillOne(false);
    setStep("skillTwo");
  };

  const handleSkillOneEditStart = () => {
    setSkillOneDraft(skillOnePreviewMessage);
    setEditingSkillOne(true);
  };

  const handleSkillOneEditSave = () => {
    if (skillOneDraft.trim().length === 0) {
      return;
    }
    setSkillOneCustomMessage(skillOneDraft.trim());
    setSkillOneConfigured("custom");
    setEditingSkillOne(false);
    setStep("skillTwo");
  };

  return (
    <SContainer>
      <SFlowFrame>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Card size="small">
            <Steps
              current={currentStepIndex}
              size="small"
              items={stepLabels.map((label) => ({ title: label }))}
            />
          </Card>

          <Card title="Mobile-first conversational onboarding">
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {step === "connect" && (
                <>
                  <SAgentBubble>
                    <Typography.Paragraph style={{ marginBottom: 8 }}>
                      Connect Instagram and I’ll build your creator profile automatically from your
                      content, bio, and audience signals.
                    </Typography.Paragraph>
                    <Typography.Text type="secondary">
                      No forms, no setup wizard — just a quick connection.
                    </Typography.Text>
                  </SAgentBubble>

                  <Button type="primary" size="large" onClick={() => setStep("indexing")}>
                    Connect Instagram
                  </Button>
                </>
              )}

              {step === "indexing" && (
                <>
                  <SAgentBubble>
                    <Typography.Paragraph style={{ marginBottom: 8 }}>
                      Getting to know your Instagram…
                    </Typography.Paragraph>
                    <Typography.Text type="secondary">
                      Indexing profile, posts, bio links, and recent engagement patterns.
                    </Typography.Text>
                  </SAgentBubble>

                  <Progress percent={indexingProgress} status="active" />
                </>
              )}

              {step === "greeting" && (
                <>
                  <SAgentBubble>
                    <Typography.Paragraph style={{ marginBottom: 8 }}>
                      Hey {creatorName}! 👋 I checked out your Instagram — love your {creatorNiche}{" "}
                      content. Looks like you teach your craft and sell programs. Am I close?
                    </Typography.Paragraph>
                    <Typography.Paragraph style={{ marginBottom: 0 }}>
                      Based on your replies, your vibe feels warm and encouraging. Is that accurate?
                    </Typography.Paragraph>
                  </SAgentBubble>

                  <Space>
                    <Button type="primary" onClick={() => setStep("goals")}>
                      Yep
                    </Button>
                    <Button onClick={() => setContextAccuracy("tweak")}>Close (tweak it)</Button>
                  </Space>

                  {contextAccuracy === "tweak" && (
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <Input.TextArea
                        rows={3}
                        placeholder="Tell me a bit more about what you do..."
                        value={contextCorrection}
                        onChange={(event) => setContextCorrection(event.target.value)}
                      />
                      <Button
                        type="primary"
                        onClick={() => {
                          setContextAccuracy("tweak");
                          setStep("goals");
                        }}
                      >
                        Continue
                      </Button>
                    </Space>
                  )}
                </>
              )}

              {step === "goals" && (
                <>
                  <SAgentBubble>
                    <Typography.Paragraph style={{ marginBottom: 0 }}>
                      So what&apos;s the main thing you&apos;d love help with right now?
                    </Typography.Paragraph>
                  </SAgentBubble>

                  <SOptionGrid>
                    {GOAL_OPTIONS.map((goal) => {
                      const selected = goals.includes(goal.id);
                      return (
                        <SGoalOption
                          key={goal.id}
                          $selected={selected}
                          onClick={() => toggleGoal(goal.id)}
                          type="button"
                        >
                          <Typography.Text strong>
                            {goal.icon} {goal.label}
                          </Typography.Text>
                          <br />
                          <Typography.Text type="secondary">{goal.description}</Typography.Text>
                        </SGoalOption>
                      );
                    })}
                  </SOptionGrid>

                  <Button
                    type="primary"
                    disabled={goals.length === 0}
                    onClick={() => setStep("tone")}
                  >
                    Continue
                  </Button>
                </>
              )}

              {step === "tone" && (
                <>
                  <SAgentBubble>
                    <Typography.Paragraph style={{ marginBottom: 0 }}>
                      When you reply to followers, how should I sound?
                    </Typography.Paragraph>
                  </SAgentBubble>

                  <Radio.Group
                    onChange={(event) => setTone(event.target.value as ToneId)}
                    value={tone}
                  >
                    <Space direction="vertical">
                      {TONE_OPTIONS.map((toneOption) => (
                        <Radio key={toneOption.id} value={toneOption.id}>
                          {toneOption.label} —{" "}
                          <Typography.Text type="secondary">{toneOption.helper}</Typography.Text>
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>

                  <Alert
                    type="info"
                    showIcon
                    message={`Tone selected: ${TONE_LABELS[tone]}`}
                    description="You can edit tone and guardrails anytime after go-live."
                  />

                  <Button type="primary" onClick={proceedFromTone}>
                    Continue
                  </Button>
                </>
              )}

              {step === "offer" && (
                <>
                  <SAgentBubble>
                    <Typography.Paragraph style={{ marginBottom: 0 }}>
                      What&apos;s the main thing you offer? Tell me in a few words so I can qualify
                      and recommend it naturally.
                    </Typography.Paragraph>
                  </SAgentBubble>

                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Input
                      value={offer}
                      onChange={(event) => setOffer(event.target.value)}
                      placeholder="Example: Online cake decorating masterclass"
                    />
                    <Input
                      value={leadMagnet}
                      onChange={(event) => setLeadMagnet(event.target.value)}
                      placeholder="Example: Free recipe guide"
                    />
                    <Typography.Text type="secondary">
                      I spotted a link in bio and will use it for recommendations unless you change
                      it later.
                    </Typography.Text>
                  </Space>

                  <Button
                    type="primary"
                    disabled={offer.trim().length === 0}
                    onClick={() => setStep("skillOne")}
                  >
                    Continue
                  </Button>
                </>
              )}

              {step === "skillOne" && (
                <>
                  <SAgentBubble>
                    <Typography.Paragraph style={{ marginBottom: 0 }}>
                      {monetizationPath
                        ? `Here’s what I suggest first: welcome every new follower and offer your ${leadMagnet}.`
                        : "Here’s what I suggest first: welcome every new follower and help with common FAQs."}
                    </Typography.Paragraph>
                  </SAgentBubble>

                  <SMessagePreview>{skillOnePreviewMessage}</SMessagePreview>

                  {!editingSkillOne && (
                    <Space>
                      <Button type="primary" onClick={handleSkillOneLooksGood}>
                        Looks good
                      </Button>
                      <Button onClick={handleSkillOneEditStart}>Edit this</Button>
                    </Space>
                  )}

                  {editingSkillOne && (
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <Input.TextArea
                        rows={4}
                        value={skillOneDraft}
                        onChange={(event) => setSkillOneDraft(event.target.value)}
                      />
                      <Space>
                        <Button type="primary" onClick={handleSkillOneEditSave}>
                          Save & continue
                        </Button>
                        <Button onClick={() => setEditingSkillOne(false)}>Cancel</Button>
                      </Space>
                    </Space>
                  )}
                </>
              )}

              {step === "skillTwo" && (
                <>
                  <SAgentBubble>
                    <Typography.Paragraph style={{ marginBottom: 0 }}>
                      {skillTwoPrompt}
                    </Typography.Paragraph>
                  </SAgentBubble>

                  <Space>
                    <Button
                      type="primary"
                      onClick={() => {
                        setSkillTwoEnabled(true);
                        setStep("goLive");
                      }}
                    >
                      Yes, do it
                    </Button>
                    <Button
                      onClick={() => {
                        setSkillTwoEnabled(false);
                        setStep("goLive");
                      }}
                    >
                      Not yet
                    </Button>
                  </Space>
                </>
              )}

              {step === "goLive" && (
                <>
                  <SAgentBubble>
                    <Typography.Paragraph style={{ marginBottom: 0 }}>
                      You&apos;re all set! I&apos;ll start in pre-moderation mode so you approve
                      messages before send. You can switch to autonomy skill-by-skill anytime.
                    </Typography.Paragraph>
                  </SAgentBubble>

                  <Row gutter={[12, 12]}>
                    <Col span={8}>
                      <Card size="small">
                        <Statistic title="Active skills" value={activeSkills.length} />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card size="small">
                        <Statistic title="Pre-moderation" value="ON" />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card size="small">
                        <Statistic title="Conversations handled" value={0} />
                      </Card>
                    </Col>
                  </Row>

                  <Card size="small" title="Creator model after onboarding">
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Niche">{creatorNiche}</Descriptions.Item>
                      <Descriptions.Item label="Product">{offer}</Descriptions.Item>
                      <Descriptions.Item label="Goal">{getGoalsLabel(goals)}</Descriptions.Item>
                      <Descriptions.Item label="Tone">{TONE_LABELS[tone]}</Descriptions.Item>
                      <Descriptions.Item label="Lead magnet">{leadMagnet}</Descriptions.Item>
                      <Descriptions.Item label="Active skills">
                        {activeSkills.map((skill) => (
                          <Tag key={skill} color="processing">
                            {skill}
                          </Tag>
                        ))}
                      </Descriptions.Item>
                      <Descriptions.Item label="Trust level">
                        <Tag color="gold">Pre-moderation ON</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Skill customization">
                        {skillOneConfigured === "custom"
                          ? "First skill customized"
                          : "Default skill copy accepted"}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>

                  <Space>
                    <Button type="primary" onClick={resetFlow}>
                      Restart onboarding
                    </Button>
                    <Button onClick={() => setStep("skillOne")}>Adjust skills</Button>
                  </Space>
                </>
              )}
            </Space>
          </Card>

          <Card size="small">
            <Typography.Text type="secondary">
              Principles: conversation (not configuration), index first, no jargon, and trust
              gradient from supervised to autonomous.
            </Typography.Text>
            <Divider style={{ margin: "12px 0" }} />
            <Typography.Text type="secondary">
              Prototype note: this flow uses local state only and does not call backend APIs yet.
            </Typography.Text>
          </Card>
        </Space>
      </SFlowFrame>
    </SContainer>
  );
};

export default OnboardingFlow;
