import React, { useEffect, useState } from "react";
import api from "../../services/api.js";

const SUPPORT_OPTIONS = [
  "Note-taking",
  "Reading assistance",
  "Mobility support",
  "Exam preparation",
  "Digital / computer help",
  "Forms & applications",
  "Other",
];

const LANGUAGE_OPTIONS = ["English", "Hindi", "Tamil", "Telugu", "Other"];

const CareseekerProfileForm = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    disabilityType: "",
    address: "",
    latitude: "",
    longitude: "",
    supportNeeds: [],
    caregiverGender: "",
    languages: [],
    maxDistanceKm: 10,
    budget: "",
  });

  // Load existing profile from backend
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get("/careseeker/profile/me");
        if (res.data) {
          const p = res.data;
          setForm({
            disabilityType: p.disabilityType || "",
            address: p.address || "",
            latitude: p.location?.coordinates?.[1] ?? "",
            longitude: p.location?.coordinates?.[0] ?? "",
            supportNeeds: p.supportNeeds || [],
            caregiverGender: p.preferences?.caregiverGender || "",
            languages: p.preferences?.languages || [],
            maxDistanceKm: p.preferences?.maxDistanceKm ?? 10,
            budget: p.preferences?.budget ?? "",
          });
        }
      } catch (err) {
        console.log("No existing profile or error fetching profile", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleArrayItem = (field, value) => {
    setForm((prev) => {
      const arr = prev[field] || [];
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter((v) => v !== value) };
      } else {
        return { ...prev, [field]: [...arr, value] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        disabilityType: form.disabilityType,
        address: form.address,
        latitude: form.latitude || undefined,
        longitude: form.longitude || undefined,
        supportNeeds: form.supportNeeds,
        preferences: {
          caregiverGender: form.caregiverGender || undefined,
          languages: form.languages,
          maxDistanceKm: Number(form.maxDistanceKm) || 10,
          budget: form.budget ? Number(form.budget) : undefined,
        },
      };

      const res = await api.post("/careseeker/profile", payload);
      setMessage("Profile saved successfully ✅");
      console.log("Saved profile:", res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading your profile...</p>;
  }

  return (
    <div>
      <h3 style={{ marginBottom: "0.8rem" }}>Your care profile</h3>
      <p className="card-subtitle" style={{ marginBottom: "1rem" }}>
        Fill this once so that CareConnect can find the best caregivers for you.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Disability type */}
        <div className="form-group">
          <label>Type of disability (or condition)</label>
          <input
            name="disabilityType"
            value={form.disabilityType}
            onChange={handleChange}
            placeholder="e.g. Visual impairment, physical disability, learning difficulty..."
          />
        </div>

        {/* Address + location */}
        <div className="form-group">
          <label>Address (or area / college)</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="e.g. Hostel name, area, city"
          />
        </div>

        <div
          className="form-group"
          style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}
        >
          <div style={{ flex: 1 }}>
            <label>Latitude (optional)</label>
            <input
              name="latitude"
              value={form.latitude}
              onChange={handleChange}
              placeholder="e.g. 12.9716"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Longitude (optional)</label>
            <input
              name="longitude"
              value={form.longitude}
              onChange={handleChange}
              placeholder="e.g. 77.5946"
            />
          </div>
        </div>

        {/* Support needs */}
        <div className="form-group">
          <label>What kind of support do you need?</label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.4rem 1rem",
              marginTop: "0.2rem",
            }}
          >
            {SUPPORT_OPTIONS.map((opt) => (
              <label key={opt} style={{ fontSize: "0.85rem" }}>
                <input
                  type="checkbox"
                  checked={form.supportNeeds.includes(opt)}
                  onChange={() => toggleArrayItem("supportNeeds", opt)}
                  style={{ marginRight: "0.35rem" }}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="form-group">
          <label>Preferred caregiver gender (optional)</label>
          <select
            name="caregiverGender"
            value={form.caregiverGender}
            onChange={handleChange}
          >
            <option value="">No preference</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Non-binary / Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Preferred languages</label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.4rem 1rem",
              marginTop: "0.2rem",
            }}
          >
            {LANGUAGE_OPTIONS.map((lang) => (
              <label key={lang} style={{ fontSize: "0.85rem" }}>
                <input
                  type="checkbox"
                  checked={form.languages.includes(lang)}
                  onChange={() => toggleArrayItem("languages", lang)}
                  style={{ marginRight: "0.35rem" }}
                />
                {lang}
              </label>
            ))}
          </div>
        </div>

        <div
          className="form-group"
          style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}
        >
          <div style={{ flex: 1 }}>
            <label>Max distance from you (km)</label>
            <input
              name="maxDistanceKm"
              type="number"
              min="1"
              value={form.maxDistanceKm}
              onChange={handleChange}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Budget per visit / hour (optional)</label>
            <input
              name="budget"
              type="number"
              min="0"
              value={form.budget}
              onChange={handleChange}
              placeholder="0 for volunteer / free"
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ marginTop: "0.8rem" }}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save profile"}
        </button>

        {message && <p style={{ color: "#4ade80", marginTop: "0.6rem" }}>{message}</p>}
        {error && <p className="auth-error">{error}</p>}
      </form>
    </div>
  );
};

export default CareseekerProfileForm;
