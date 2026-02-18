import { Navigate, Route, Routes } from "react-router-dom";
import { Space, Tag, Typography } from "antd";
import styled from "styled-components";
import OnboardingFlow from "./features/onboarding/OnboardingFlow";
import manychatLogo from "./assets/brand/manychat-logo.png";

const SViewport = styled.main`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.md};
  background: linear-gradient(
    180deg,
    ${({ theme }) => `${theme.colors.primary}12`} 0%,
    ${({ theme }) => theme.colors.background} 32%
  );
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const SPhoneFrame = styled.section`
  width: min(100%, 420px);
  min-height: calc(100vh - 32px);
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  display: flex;
  flex-direction: column;

  @media (max-width: 520px) {
    width: 100%;
    min-height: calc(100vh - 16px);
    border-radius: ${({ theme }) => theme.borderRadius.md};
  }
`;

const STopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.md}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`;

const SBrand = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SLogo = styled.img`
  width: 122px;
  height: auto;
  display: block;
`;

const STopBarText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.sm};
`;

const MobilePrototypePage = () => {
  return (
    <SPhoneFrame>
      <STopBar>
        <SBrand>
          <SLogo src={manychatLogo} alt="Manychat" />
          <STopBarText>
            <Typography.Text strong>Creator onboarding prototype</Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Mobile-first flow
            </Typography.Text>
          </STopBarText>
        </SBrand>
        <Space size="small">
          <Tag color="success">Mobile</Tag>
          <Tag color="processing">JTBD</Tag>
        </Space>
      </STopBar>
      <SContent>
        <OnboardingFlow />
      </SContent>
    </SPhoneFrame>
  );
};

const App = () => {
  return (
    <SViewport>
      <Routes>
        <Route path="/" element={<MobilePrototypePage />} />
        <Route path="/onboarding" element={<MobilePrototypePage />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    </SViewport>
  );
};

export default App;
