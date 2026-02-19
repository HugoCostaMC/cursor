const App = () => {
  return (
    <main className="app-shell">
      <section className="card">
        <p className="eyebrow">Prototype project</p>
        <h1>AI Playground Starter</h1>
        <p>
          This is a lightweight second project in the repository. Use it as a clean space for fast
          experiments before moving ideas into production-like flows.
        </p>
      </section>

      <section className="card">
        <h2>Quick commands</h2>
        <ul>
          <li>
            <code>npm run dev:starter</code>
          </li>
          <li>
            <code>npm run check:starter</code>
          </li>
          <li>
            <code>npm run build:starter</code>
          </li>
        </ul>
      </section>
    </main>
  );
};

export default App;
