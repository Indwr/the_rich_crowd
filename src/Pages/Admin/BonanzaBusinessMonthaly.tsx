import { Link } from "react-router-dom";

const BonanzaBusinessMonthaly = () => {
  return (
    <>
      <div className="content-wrapper">
        <div className="filter-card">
          <h2 className="page-title">BONANZA BUSINESS MONTHLY</h2>
          <div className="date-controls">
            <div className="input-group">
              <label className="input-label">Start Date:</label>
              <input type="date" id="startDate" className="date-input" />
            </div>
            <div className="input-group">
              <label className="input-label">End Date:</label>
              <input type="date" id="endDate" className="date-input" />
            </div>
            <button className="btn-result" onClick={undefined}>
              Get Result
            </button>
          </div>
        </div>
        <div className="stats-grid">
          <div className="biz-card">
            <h3 className="biz-title">X2 Business</h3>
            <div className="stat-row">
              <span className="stat-label">Direct Member</span>
              <span className="stat-value" id="val_directMember">
                0
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Left Team</span>
              <span className="stat-value" id="val_leftTeam">
                0
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Right Team</span>
              <span className="stat-value" id="val_rightTeam">
                0
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Direct Business</span>
              <span className="stat-value" id="val_directBusiness">
                0
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Team Left Business</span>
              <span className="stat-value" id="val_teamLeftBusiness">
                0
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Team Right Business</span>
              <span className="stat-value" id="val_teamRightBusiness">
                0
              </span>
            </div>
          </div>
          <div className="biz-card">
            <h3 className="biz-title">X3 Business</h3>
            <div className="stat-row">
              <span className="stat-label">X3 Self Staking</span>
              <span className="stat-value" id="val_selfStacking">
                0
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Left Right Business</span>
              <span className="stat-value" id="val_leftRightBusiness">
                0
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Direct Business</span>
              <span className="stat-value" id="val_directBusiness">
                0
              </span>
            </div>
          </div>
        </div>

        <div className="b-b-btn">
          <Link
            to={""}
            target="_blank"
            className="go-btn header-btn"
            style={{ padding: "0.6rem 1.2rem", fontSize: "0.8rem" }}
          >
            <i className="fa-solid fa-file-lines"></i>
            Plan PDF & Video
          </Link>
        </div>
      </div>
    </>
  );
};
export default BonanzaBusinessMonthaly;
