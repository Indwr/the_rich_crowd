const Mytree = () => {
  return (
    <>
      <div className="content-wrapper">
        <div className="tree-page-header">
          <h1 className="tree-title">
            <i className="fas fa-network-wired" /> My Tree
          </h1>
        </div>
        <div className="tree-scroll-container">
          <div className="tree">
            <ul>
              <li>
                <div className="node-card active">
                  <span className="node-status status-red" />
                  <div className="node-icon">
                    <i className="fas fa-user" />
                  </div>
                  <span className="node-id">3869766</span>
                  <div
                    className="on-card-stats"
                    style={{
                      display: "flex",
                      gap: 10,
                      marginTop: 8,
                      background: "rgba(0,0,0,0.6)",
                      padding: "4px 8px",
                      borderRadius: 6,
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <div
                      className="stat"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        fontSize: "0.65rem",
                        color: "#ddd",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--gold-primary)",
                          fontWeight: 700,
                          fontSize: "0.6rem",
                        }}
                      >
                        LEFT
                      </span>
                      $0
                    </div>
                    <div
                      className="stat"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        fontSize: "0.65rem",
                        color: "#ddd",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--gold-primary)",
                          fontWeight: 700,
                          fontSize: "0.6rem",
                        }}
                      >
                        RIGHT
                      </span>
                      $0
                    </div>
                  </div>
                  <div className="node-tooltip">
                    <div className="tooltip-row">
                      <span>Total Biz:</span> <strong>$0.00</strong>
                    </div>
                    <div className="tooltip-row">
                      <span>Left Biz:</span> <strong>$0.00</strong>
                    </div>
                    <div className="tooltip-row">
                      <span>Right Biz:</span> <strong>$0.00</strong>
                    </div>
                    <div className="tooltip-row">
                      <span>Left Team:</span> <strong>0</strong>
                    </div>
                    <div className="tooltip-row">
                      <span>Right Team:</span> <strong>0</strong>
                    </div>
                    <div className="tooltip-row">
                      <span>Position:</span> <span />
                    </div>
                    <div className="tooltip-row">
                      <span>Joined:</span> <span>27 Feb 2026</span>
                    </div>
                    <a
                      href="https://therichcrowd.live/mytree?node_id=3869766"
                      className="view-tree-btn"
                    >
                      <i className="fas fa-sitemap" /> View Tree
                    </a>
                  </div>
                </div>
                <ul>
                  <li>
                    <div className="node-card empty">
                      <div className="node-icon">
                        <i className="fas fa-plus" />
                      </div>
                      <span className="node-id">Empty</span>
                    </div>{" "}
                    <ul>
                      <li>
                        <div className="node-card empty">
                          <div className="node-icon">
                            <i className="fas fa-plus" />
                          </div>
                          <span className="node-id">Empty</span>
                        </div>{" "}
                        <ul>
                          <li>
                            <div className="node-card empty">
                              <div className="node-icon">
                                <i className="fas fa-plus" />
                              </div>
                              <span className="node-id">Empty</span>
                            </div>
                          </li>
                          <li>
                            <div className="node-card empty">
                              <div className="node-icon">
                                <i className="fas fa-plus" />
                              </div>
                              <span className="node-id">Empty</span>
                            </div>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <div className="node-card empty">
                          <div className="node-icon">
                            <i className="fas fa-plus" />
                          </div>
                          <span className="node-id">Empty</span>
                        </div>{" "}
                        <ul>
                          <li>
                            <div className="node-card empty">
                              <div className="node-icon">
                                <i className="fas fa-plus" />
                              </div>
                              <span className="node-id">Empty</span>
                            </div>
                          </li>
                          <li>
                            <div className="node-card empty">
                              <div className="node-icon">
                                <i className="fas fa-plus" />
                              </div>
                              <span className="node-id">Empty</span>
                            </div>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <div className="node-card empty">
                      <div className="node-icon">
                        <i className="fas fa-plus" />
                      </div>
                      <span className="node-id">Empty</span>
                    </div>{" "}
                    <ul>
                      <li>
                        <div className="node-card empty">
                          <div className="node-icon">
                            <i className="fas fa-plus" />
                          </div>
                          <span className="node-id">Empty</span>
                        </div>{" "}
                        <ul>
                          <li>
                            <div className="node-card empty">
                              <div className="node-icon">
                                <i className="fas fa-plus" />
                              </div>
                              <span className="node-id">Empty</span>
                            </div>
                          </li>
                          <li>
                            <div className="node-card empty">
                              <div className="node-icon">
                                <i className="fas fa-plus" />
                              </div>
                              <span className="node-id">Empty</span>
                            </div>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <div className="node-card empty">
                          <div className="node-icon">
                            <i className="fas fa-plus" />
                          </div>
                          <span className="node-id">Empty</span>
                        </div>{" "}
                        <ul>
                          <li>
                            <div className="node-card empty">
                              <div className="node-icon">
                                <i className="fas fa-plus" />
                              </div>
                              <span className="node-id">Empty</span>
                            </div>
                          </li>
                          <li>
                            <div className="node-card empty">
                              <div className="node-icon">
                                <i className="fas fa-plus" />
                              </div>
                              <span className="node-id">Empty</span>
                            </div>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
export default Mytree;
