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

const SSpacingRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SSpacingBar = styled.div<{ $width: string }>`
  min-width: 24px;
  width: ${({ $width }) => $width};
  height: 10px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ theme }) => theme.colors.primary};
`;

const SShadowPreview = styled.div<{ $shadow: string }>`
  height: 72px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ $shadow }) => $shadow};
  border: 1px solid ${({ theme }) => theme.colors.border};
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
          <Col xs={24} md={12}>
            <Typography.Text strong>Heading 1 size</Typography.Text>
            <Typography.Title level={1} style={{ margin: "8px 0 0" }}>
              Prototype Heading
            </Typography.Title>
            <STokenValue code>{theme.typography.heading1Size}</STokenValue>
          </Col>
          <Col xs={24} md={12}>
            <Typography.Text strong>Default shadow</Typography.Text>
            <SShadowPreview $shadow={theme.shadows.md} />
            <STokenValue code>{theme.shadows.md}</STokenValue>
          </Col>
        </Row>
      </Card>
    </SCardColumn>
  );
};

const TokensPage = () => {
  const theme = useTheme();
  const colorEntries = Object.entries(theme.colors);
  const spacingEntries = Object.entries(theme.spacing);
  const shadowEntries = Object.entries(theme.shadows);

  return (
    <SCardColumn size="large">
      <Card title="Color tokens">
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

      <Card title="Spacing tokens">
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {spacingEntries.map(([key, value]) => (
            <SSpacingRow key={key}>
              <Typography.Text strong style={{ minWidth: 40 }}>
                {key}
              </Typography.Text>
              <SSpacingBar $width={value} />
              <STokenValue code>{value}</STokenValue>
            </SSpacingRow>
          ))}
        </Space>
      </Card>

      <Card title="Typography tokens">
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <STokenValue code>fontFamily: {theme.typography.fontFamily}</STokenValue>
          <STokenValue code>fontSizeSm: {theme.typography.fontSizeSm}</STokenValue>
          <STokenValue code>fontSizeBase: {theme.typography.fontSizeBase}</STokenValue>
          <STokenValue code>fontSizeLg: {theme.typography.fontSizeLg}</STokenValue>
          <STokenValue code>lineHeightBase: {theme.typography.lineHeightBase}</STokenValue>
          <STokenValue code>lineHeightHeading: {theme.typography.lineHeightHeading}</STokenValue>
          <STokenValue code>
            fontWeightRegular: {theme.typography.fontWeightRegular}
          </STokenValue>
          <STokenValue code>fontWeightMedium: {theme.typography.fontWeightMedium}</STokenValue>
          <STokenValue code>fontWeightBold: {theme.typography.fontWeightBold}</STokenValue>
          <STokenValue code>heading1Size: {theme.typography.heading1Size}</STokenValue>
          <STokenValue code>heading2Size: {theme.typography.heading2Size}</STokenValue>

          <Typography.Title level={1} style={{ marginBottom: 0 }}>
            Heading 1 preview
          </Typography.Title>
          <Typography.Title level={2} style={{ marginBottom: 0 }}>
            Heading 2 preview
          </Typography.Title>
          <Typography.Paragraph style={{ marginBottom: 0 }}>
            Body text preview uses your external typography tokens via global styles.
          </Typography.Paragraph>
        </Space>
      </Card>

      <Card title="Shadow tokens">
        <Row gutter={[16, 16]}>
          {shadowEntries.map(([key, value]) => (
            <Col key={key} xs={24} sm={12} md={8}>
              <Typography.Text strong>{key}</Typography.Text>
              <SShadowPreview $shadow={value} />
              <STokenValue code>{value}</STokenValue>
            </Col>
          ))}
        </Row>
      </Card>
    </SCardColumn>
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
