import "./bonanzaBusinessMonthly.css";

type DirectOfferRow = {
  stakingValue: string;
  bonus: string;
  allocation: string;
  eligibleFund: string;
  onAchieve: string;
};

type TeamOfferRow = {
  stakingValue: string;
  bonus: string;
  allocation: string;
  eligibleFund: string;
};

type BonanzaAchiever = {
  userId: string;
  name: string;
  category: "Direct Referral" | "Team Business";
  bonus: string;
  amountAchieved: string;
  achievedFund: string;
  achievedDate: string;
};

const directOffers: DirectOfferRow[] = [
  {
    stakingValue: "$1000 to $2999 (Direct Referral)",
    bonus: "3%",
    allocation: "$89.97",
    eligibleFund: "$750 International Trip & Seminar",
    onAchieve: "You get 3% on direct business",
  },
  {
    stakingValue: "$3000 to $4999 (Direct Referral)",
    bonus: "4%",
    allocation: "$199.96",
    eligibleFund: "$750 International Trip & Seminar",
    onAchieve: "You get 4% on direct business",
  },
  {
    stakingValue: "$5000 & Above (Direct Referral)",
    bonus: "5%",
    allocation: "$250",
    eligibleFund: "$750 International Trip & Seminar",
    onAchieve: "You get 5% on direct business",
  },
];

const teamOffers: TeamOfferRow[] = [
  {
    stakingValue: "$1000 to $5000 (Pair Match)",
    bonus: "3%",
    allocation: "$299.97",
    eligibleFund: "$750 International Trip & Seminar",
  },
  {
    stakingValue: "$5001 to $10000 (Pair Match)",
    bonus: "4%",
    allocation: "$799.96",
    eligibleFund: "$3000 Car Fund",
  },
  {
    stakingValue: "$10001 & Above (Pair Match)",
    bonus: "5%",
    allocation: "$1500",
    eligibleFund: "$5000 House Fund",
  },
];

const bonanzaAchievers: BonanzaAchiever[] = [
  {
    userId: "TRC10452",
    name: "Amit Kumar",
    category: "Direct Referral",
    bonus: "3%",
    amountAchieved: "$2,250",
    achievedFund: "International Trip & Seminar",
    achievedDate: "12 Dec 2025",
  },
  {
    userId: "TRC10891",
    name: "Neha Sharma",
    category: "Team Business",
    bonus: "4%",
    amountAchieved: "$8,200",
    achievedFund: "Car Fund",
    achievedDate: "28 Dec 2025",
  },
  {
    userId: "TRC11207",
    name: "Sanjay Verma",
    category: "Team Business",
    bonus: "5%",
    amountAchieved: "$24,000",
    achievedFund: "House Fund",
    achievedDate: "06 Jan 2026",
  },
];

const BonanzaBusinessMonthaly = () => {
  return (
    <div className="content-wrapper bbm-wrapper">
      <section className="bbm-hero">
        <p className="bbm-kicker">BONANZA BUSINESS MONTHLY</p>
        <h1>Step Into Your Dream Life This New Year</h1>
        <div className="bbm-hero-meta">
          <span className="bbm-pill">Offer 2026</span>
          <span className="bbm-pill">Start from 1st Dec 2025</span>
          <span className="bbm-pill">X3 Business Plan</span>
        </div>
      </section>

      <section className="bbm-section">
        <div className="bbm-section-head">
          <h2>X3 Direct Referral Business Offer</h2>
          <p>Bonus slab by staking value as per bonanza monthly plan.</p>
        </div>

        <div className="bbm-table-shell">
          <table className="bbm-table">
            <thead>
              <tr>
                <th>Staking Value</th>
                <th>Bonus</th>
                <th>Allocation</th>
                <th>Eligible Fund</th>
                <th>On Achieve</th>
              </tr>
            </thead>
            <tbody>
              {directOffers.map((row) => (
                <tr key={row.stakingValue}>
                  <td>{row.stakingValue}</td>
                  <td>{row.bonus}</td>
                  <td>{row.allocation}</td>
                  <td>{row.eligibleFund}</td>
                  <td>{row.onAchieve}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bbm-section">
        <div className="bbm-section-head">
          <h2>X3 Team Business Offer</h2>
          <p>Pair match based slabs with trip, car and house fund eligibility.</p>
        </div>

        <div className="bbm-table-shell">
          <table className="bbm-table">
            <thead>
              <tr>
                <th>Staking Value</th>
                <th>Bonus</th>
                <th>Allocation</th>
                <th>Eligible Fund</th>
              </tr>
            </thead>
            <tbody>
              {teamOffers.map((row) => (
                <tr key={row.stakingValue}>
                  <td>{row.stakingValue}</td>
                  <td>{row.bonus}</td>
                  <td>{row.allocation}</td>
                  <td>{row.eligibleFund}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bbm-section">
        <div className="bbm-section-head">
          <h2>Team Business Examples</h2>
          <p>Lower side volume calculation logic from the brochure.</p>
        </div>

        <div className="bbm-example-grid">
          <article className="bbm-example-card">
            <h3>Example 1</h3>
            <p className="bbm-example-line">$1000 : $1000 to $5000 : $5000</p>
            <p className="bbm-example-line">Lower volume calculated: $5000</p>
            <p className="bbm-highlight">$5000 × 3% = $150 to Tour Fund</p>
          </article>

          <article className="bbm-example-card">
            <h3>Example 2</h3>
            <p className="bbm-example-line">$5001 : $5001 to $10000 : $10000</p>
            <p className="bbm-highlight">$5000 × 3% = $150 to Tour Fund</p>
            <p className="bbm-highlight">$5000 × 4% = $200 to Car Fund</p>
          </article>

          <article className="bbm-example-card">
            <h3>Example 3</h3>
            <p className="bbm-example-line">$10001 : $10001 & Above</p>
            <p className="bbm-example-line">Example volume: $31000 : $24000</p>
            <p className="bbm-highlight">$5000 × 3% = $150 to Tour Fund</p>
            <p className="bbm-highlight">$5000 × 4% = $200 to Car Fund</p>
            <p className="bbm-highlight">$14000 × 5% = $700 to House Fund</p>
          </article>
        </div>
      </section>

      <section className="bbm-section">
        <div className="bbm-section-head">
          <h2>Bonanza Achievers List</h2>
          <p>Users who already achieved bonanza benefits in this campaign.</p>
        </div>

        <div className="bbm-table-shell">
          <table className="bbm-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Bonus</th>
                <th>Amount Achieved</th>
                <th>Achieved Fund</th>
                <th>Achieved Date</th>
              </tr>
            </thead>
            <tbody>
              {bonanzaAchievers.length > 0 ? (
                bonanzaAchievers.map((achiever) => (
                  <tr key={achiever.userId}>
                    <td>{achiever.userId}</td>
                    <td>{achiever.name}</td>
                    <td>
                      <span className="bbm-tag">{achiever.category}</span>
                    </td>
                    <td>{achiever.bonus}</td>
                    <td>{achiever.amountAchieved}</td>
                    <td>{achiever.achievedFund}</td>
                    <td>{achiever.achievedDate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="bbm-empty-row">
                    No achievers yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default BonanzaBusinessMonthaly;
