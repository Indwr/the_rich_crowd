const Technology = () => {
  return (
    <>
      <section id="tech" className="section-padding burn-section">
        <div className="container text-center">
          <h2>Technology &amp; Tokenomics</h2>
          <p
            style={{
              color: "var(--text-gray)",
              marginBottom: 50,
              fontSize: "1.1rem",
            }}
          >
            Powered by Binance Smart Chain for automated security.
          </p>
          <div className="features-grid" style={{ textAlign: "left" }}>
            <div className="feature-card">
              <h3>Smart Contract Security</h3>
              <p>
                Our contract adheres strictly to the underlying program with no
                option to alter execution. This guarantees immunity to hacking
                attempts and interruptions.
              </p>
            </div>
            <div className="feature-card burn-card">
              <h3 style={{ color: "#ff4d4d" }}>The Burning Mechanism</h3>
              <p>
                <strong>1%</strong> of each transaction is permanently taken out
                of circulation. This scarcity enhances token demand and value,
                establishing a sustainable ecosystem for enduring growth.
              </p>
            </div>
            <div className="feature-card">
              <h3>Decentralized Ledger</h3>
              <p>
                Blockchain serves as an unalterable ledger of transactions,
                safeguarded through cryptographic measures against any potential
                tampering.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Technology;
