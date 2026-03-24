import { type FormEvent } from "react";
import { useProfile } from "../hooks/useProfile";
import ProfileDobField from "./ProfileDobField";
import ProfileGeoCascade from "./ProfileGeoCascade";
import ProfilePhoneField from "./ProfilePhoneField";

const ProfileForm = () => {
  const {
    identity,
    form,
    onFieldChange,
    submitProfile,
    isLoading,
    isUpdating,
    error,
  } = useProfile();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitProfile();
  };

  if (isLoading) {
    return (
      <div className="content-wrapper">
        <div className="profile-card">
          <div className="card-body">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-wrapper">
        <div className="profile-card">
          <div className="card-body">Failed to load profile: {error}</div>
        </div>
      </div>
    );
  }

  return (
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
          <form id="profileForm" onSubmit={onSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Member ID</label>
                <input type="text" className="custom-input" value={identity.user_id} readOnly />
              </div>
              <div className="form-group">
                <label className="form-label">Sponsor ID</label>
                <input type="text" className="custom-input" value={identity.sponser_id} readOnly />
              </div>
              <div className="form-group">
                <label className="form-label">Wallet Address (BEP20)</label>
                <input type="text" className="custom-input" value={identity.eth_address} readOnly />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="custom-input"
                  value={form.email}
                  onChange={(e) => onFieldChange("email", e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="custom-input"
                  value={form.first_name}
                  onChange={(e) => onFieldChange("first_name", e.target.value)}
                  placeholder="Enter First Name"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="custom-input"
                  value={form.last_name}
                  onChange={(e) => onFieldChange("last_name", e.target.value)}
                  placeholder="Enter Last Name"
                />
              </div>
              <ProfilePhoneField
                countryCode={form.country_code}
                phone={form.phone}
                disabled={isUpdating}
                onFieldChange={(field, value) => onFieldChange(field, value)}
              />
              <ProfileDobField
                value={form.dob}
                disabled={isUpdating}
                onChange={(v) => onFieldChange("dob", v)}
              />
              <ProfileGeoCascade
                form={{
                  country: form.country,
                  state: form.state,
                  city: form.city,
                  district: form.district,
                }}
                disabled={isUpdating}
                onFieldChange={(field, value) => onFieldChange(field, value)}
              />
              <div className="form-group">
                <label className="form-label">Pin Code</label>
                <input
                  type="text"
                  className="custom-input"
                  value={form.pin_code}
                  onChange={(e) => onFieldChange("pin_code", e.target.value)}
                  placeholder="Enter Pin Code"
                />
              </div>
            </div>
            <div className="action-row">
              <button type="submit" id="btnSave" className="btn-update" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;

