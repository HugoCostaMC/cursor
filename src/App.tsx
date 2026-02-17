import { Button, Card, Col, Layout, Menu, Row, Space, Tag, Typography } from "antd";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import styled, { useTheme } from "styled-components";

const { Header, Content } = Layout;

const SAppLayout = styled(Layout)`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const SHeader = styled(Header)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: 0 ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.sidebar};
  border-bottom: 1px solid ${({ theme }) => theme.colors.sidebarHover};
`;

const STitle = styled(Typography.Title)`
  && {
    margin: 0;
    color: ${({ theme }) => theme.colors.surface};
  }
`;

const SContent = styled(Content)`
  padding: ${({ theme }) => theme.spacing.xl};
`;

const SCardColumn = styled(Space)`
  width: 100%;
`;

const STokenSwatch = styled.div<{ $color: string }>`
  width: 100%;
  height: 64px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $color }) => $color};
`;

const STokenValue = styled(Typography.Text)`
  display: block;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const HomePage = () => {
  const theme = useTheme();

  return (
    <SCardColumn size="large">
      <Card title="Prototype environment is connected" extra={<Tag color="success">Ready</Tag>}>
        <Typography.Paragraph>
          This UI is wired to <Typography.Text code>design-system/tokens.json</Typography.Text>.
          Run <Typography.Text code>npm run sync:design-tokens</Typography.Text> to refresh tokens
          from your external source.
        </Typography.Paragraph>
        <Space>
          <Button type="primary">Primary action</Button>
          <Button>Secondary action</Button>
        </Space>
      </Card>

      <Card title="Current design token preview">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Typography.Text strong>Primary</Typography.Text>
            <STokenSwatch $color={theme.colors.primary} />
            <STokenValue code>{theme.colors.primary}</STokenValue>
          </Col>
          <Col xs={24} md={12}>
            <Typography.Text strong>Background</Typography.Text>
            <STokenSwatch $color={theme.colors.background} />
            <STokenValue code>{theme.colors.background}</STokenValue>
          </Col>
        </Row>
      </Card>
    </SCardColumn>
  );
};

const TokensPage = () => {
  const theme = useTheme();
  const colorEntries = Object.entries(theme.colors);

  return (
    <Card title="External design tokens">
      <Row gutter={[16, 16]}>
        {colorEntries.map(([key, value]) => (
          <Col key={key} xs={24} sm={12} md={8} lg={6}>
            <Typography.Text strong>{key}</Typography.Text>
            <STokenSwatch $color={value} />
            <STokenValue code>{value}</STokenValue>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

const App = () => {
  const location = useLocation();

  return (
    <SAppLayout>
      <SHeader>
        <STitle level={4}>ManyChat Prototype</STitle>
        <Menu
          mode="horizontal"
          theme="dark"
          selectedKeys={[location.pathname]}
          items={[
            { key: "/", label: <Link to="/">Home</Link> },
            { key: "/tokens", label: <Link to="/tokens">Tokens</Link> },
          ]}
          style={{ flex: 1, minWidth: 240, justifyContent: "flex-end" }}
        />
      </SHeader>
      <SContent>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tokens" element={<TokensPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SContent>
    </SAppLayout>
  );
};

export default App;
