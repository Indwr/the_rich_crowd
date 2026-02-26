const TokenOverview = () => {
  return (
    <>
      <section id="token" className="section-padding ksn-section">
        <div className="container">
          <div className="text-center">
            <h2>KSN Token Overview</h2>
            <p
              style={{
                maxWidth: 800,
                margin: "20px auto",
                color: "var(--text-gray)",
                fontSize: "1.1rem",
              }}
            >
              KSN Token is a groundbreaking fusion of farming and finance that
              embodies sustainability. It serves as a conduit linking farmers
              and consumers worldwide.
            </p>
          </div>
          <div className="token-stats">
            <div className="stat-box">
              <h4>63 Million</h4>
              <p>Capped Total Supply</p>
            </div>
            <div className="stat-box">
              <h4>45%</h4>
              <p>Locked Reserve until 2033</p>
            </div>
            <div className="stat-box">
              <h4>Eco-Friendly</h4>
              <p>Tree Planting Rewards</p>
            </div>
          </div>
          <div className="features-grid">
            <div className="feature-card" style={{ textAlign: "center" }}>
              <h3>Sustainability</h3>
              <p>
                By locking reserves, KSN Token showcases dedication to long-term
                sustainability, advocating for eco-conscious farming methods.
              </p>
            </div>
            <div className="feature-card" style={{ textAlign: "center" }}>
              <h3>Real Utility</h3>
              <p>
                Beyond digital currency, KSN caters to anyone seeking a secure
                entry into the digital economy, incentivizing environmental
                enthusiasts.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TokenOverview;
