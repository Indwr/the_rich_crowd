const Profile = () => {
  return (
    <>
      <div className="content-wrapper">
        <div className="profile-card">
          <div className="card-header">
            <div className="profile-avatar">
              <i className="fas fa-user" />
            </div>
            <div className="header-text">
              <h2>Profile Settings</h2>
              <p>Manage your personal information</p>
            </div>
          </div>
          <div className="card-body">
            <form id="profileForm" onSubmit={undefined}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Member ID</label>
                  <input
                    type="text"
                    className="custom-input"
                    defaultValue={3869766}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Sponsor ID</label>
                  <input
                    type="text"
                    className="custom-input"
                    defaultValue={2072139}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="custom-input"
                    defaultValue={""}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Wallet Address (BEP20)</label>
                  <input
                    type="text"
                    className="custom-input"
                    defaultValue="0x81f7cACB00432a8Dd41eDe8B107feFa76e3f77C7"
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    className="custom-input"
                    defaultValue={""}
                    placeholder="Enter First Name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    className="custom-input"
                    defaultValue={""}
                    placeholder="Enter Last Name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    className="custom-input"
                    defaultValue={""}
                    placeholder="Enter Phone Number"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    className="custom-input"
                    defaultValue="0000-00-00"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    className="custom-input"
                    defaultValue={""}
                    placeholder="Enter City"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    name="state"
                    className="custom-input"
                    defaultValue={""}
                    placeholder="Enter State"
                  />
                </div>
              </div>
              <div className="action-row">
                <div id="msgBox" className="status-msg" />
                <button type="submit" id="btnSave" className="btn-update">
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
