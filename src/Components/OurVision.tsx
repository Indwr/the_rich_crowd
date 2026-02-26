const OurVision = () => {
  return (
    <>
      <section id="about" className="section-padding">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 60 }}>
            <h2>Our Vision &amp; Goals</h2>
            <p
              style={{
                color: "var(--text-gray)",
                fontSize: "1.1rem",
                maxWidth: 600,
                margin: "20px auto 0",
              }}
            >
              Empowering individuals globally through a decentralized financial
              ecosystem.
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Financial Freedom</h3>
              <p>
                We envision a future where financial freedom is a fundamental
                human right, accessible to all regardless of geographical
                location or socioeconomic status.
              </p>
            </div>
            <div className="feature-card">
              <h3>Total Inclusivity</h3>
              <p>
                Our pioneering approach guarantees inclusivity, enabling
                individuals of all backgrounds and experiences to engage and
                prosper within the community.
              </p>
            </div>
            <div className="feature-card">
              <h3>Trust &amp; Transparency</h3>
              <p>
                All transactions occur using KSN tokens, guaranteeing
                transparency and efficiency, founded on trust and innovation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default OurVision;
