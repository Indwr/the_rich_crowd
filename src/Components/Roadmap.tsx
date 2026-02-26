const Roadmap = () => {
  return (
    <>
      <section id="roadmap" className="section-padding">
        <div className="container">
          <div className="text-center">
            <h2>Roadmap Kissan 2.0</h2>
            <p
              style={{
                color: "var(--text-gray)",
                fontSize: "1.1rem",
                marginTop: 10,
              }}
            >
              Our strategic path to 2029
            </p>
          </div>
          <div className="roadmap-container">
            <div className="roadmap-item left" data-year={2025}>
              <div className="roadmap-arrow" />
              <div className="roadmap-content">
                <h3>Expansion Phase</h3>
                <ul>
                  <li>Expand operations to 5 Indian states.</li>
                  <li>Partner with 10,000 farmers.</li>
                  <li>Launch microfinance services based on Kissan Token.</li>
                </ul>
              </div>
            </div>
            <div className="roadmap-item right" data-year={2026}>
              <div className="roadmap-arrow" />
              <div className="roadmap-content">
                <h3>Innovation Phase</h3>
                <ul>
                  <li>Integrate AI-powered disease detection.</li>
                  <li>
                    Enter Southeast Asian markets (Indonesia, Malaysia,
                    Philippines).
                  </li>
                  <li>Launch decentralized agricultural marketplace.</li>
                </ul>
              </div>
            </div>
            <div className="roadmap-item left" data-year={2027}>
              <div className="roadmap-arrow" />
              <div className="roadmap-content">
                <h3>African Expansion</h3>
                <ul>
                  <li>
                    Expand into African markets (Nigeria, Kenya, Tanzania).
                  </li>
                  <li>
                    Launch agricultural education platform using KSN Token.
                  </li>
                  <li>Integrate IoT for precision farming.</li>
                </ul>
              </div>
            </div>
            <div className="roadmap-item right" data-year={2028}>
              <div className="roadmap-arrow" />
              <div className="roadmap-content">
                <h3>Latin America &amp; Carbon</h3>
                <ul>
                  <li>
                    Enter Latin American markets (Brazil, Argentina, Mexico).
                  </li>
                  <li>Launch carbon credit trading powered by Kissan Token.</li>
                  <li>
                    Implement DAO governance for community decision-making.
                  </li>
                </ul>
              </div>
            </div>
            <div className="roadmap-item left" data-year={2029}>
              <div className="roadmap-arrow" />
              <div className="roadmap-content">
                <h3>Global Foundation</h3>
                <ul>
                  <li>
                    Expand to 50 countries, partnering with 100,000 farmers.
                  </li>
                  <li>
                    Establish the Kissan Token Foundation for agricultural
                    development.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Roadmap;
