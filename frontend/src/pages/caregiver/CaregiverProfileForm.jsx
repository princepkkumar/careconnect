import React, { useEffect, useState } from "react";
import api from "../../services/api.js";

const SKILL_OPTIONS = [
  "Note-taking support",
  "Reading out content",
  "Mobility assistance",
  "Digital/Computer help",
  "Exam preparation",
  "Form filling & documentation",
  "Emotional support",
  "Other",
];

const LANGUAGE_OPTIONS = ["English", "Hindi", "Tamil", "Telugu", "Other"];

const DAYS_OPTIONS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const TIME_SLOT_OPTIONS = [
  "Morning",
  "Afternoon",
  "Evening",
  "Night",
];

const CaregiverProfileForm = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    age: "",
    gender: "",
    address: "",
    latitude: "",
    longitude: "",
    education: "",
    experience: "",
    skills: [],
    languages: [],
    availabilityDays: [],
    availabilitySlots: [],
    weekend: false,
    travel: false,
    emergencySupport: false,
    strengths: "",
    caregiverPlan: "",
    hourlyRate: "",
    isVolunteer: false,
  });

  // Load existing profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get("/caregiver/profile/me");
        if (res.data) {
          const p = res.data;
          setForm({
            age: p.age ?? "",
            gender: p.gender || "",
            address: p.address || "",
            latitude: p.location?.coordinates?.[1] ?? "",
            longitude: p.location?.coordinates?.[0] ?? "",
            education: p.education || "",
            experience: p.experience || "",
            skills: p.skills || [],
            languages: p.languages || [],
            availabilityDays: p.availability?.days || [],
            availabilitySlots: p.availability?.timeSlots || [],
            weekend: p.willingness?.weekend ?? false,
            travel: p.willingness?.travel ?? false,
            emergencySupport: p.willingness?.emergencySupport ?? false,
            strengths: p.strengths || "",
            caregiverPlan: p.caregiverPlan || "",
            hourlyRate: p.hourlyRate ?? "",
            isVolunteer: p.isVolunteer ?? false,
          });
        }
      } catch (err) {
        console.log("No existing caregiver profile or error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "isVolunteer") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "checkbox" && ["weekend", "travel", "emergencySupport"].includes(name)) {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
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
    setMessage("");
    setError("");

    try {
      const payload = {
        age: form.age ? Number(form.age) : undefined,
        gender: form.gender || undefined,
        address: form.address,
        education: form.education,
        experience: form.experience,
        skills: form.skills,
        languages: form.languages,
        availability: {
          days: form.availabilityDays,
          timeSlots: form.availabilitySlots,
        },
        willingness: {
          weekend: form.weekend,
          travel: form.travel,
          emergencySupport: form.emergencySupport,
        },
        strengths: form.strengths,
        caregiverPlan: form.caregiverPlan,
        hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : undefined,
        isVolunteer: form.isVolunteer,
      };

      if (form.latitude && form.longitude) {
        payload.latitude = form.latitude;
        payload.longitude = form.longitude;
      }

      const res = await api.post("/caregiver/profile", payload);
      console.log("Saved caregiver profile:", res.data);
      setMessage("Profile saved successfully ✅");
    } catch (err) {
      console.error(err);
      setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading your caregiver profile...</p>;
  }

  return (
    <div>
      <h3 style={{ marginBottom: "0.8rem" }}>Your caregiver profile</h3>
      <p className="card-subtitle" style={{ marginBottom: "1rem" }}>
        This helps CareConnect understand how you can support careseekers.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Basic info */}
        <div
          className="form-group"
          style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}
        >
          <div style={{ flex: 1 }}>
            <label>Age</label>
            <input
              name="age"
              type="number"
              min="16"
              value={form.age}
              onChange={handleChange}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Non-binary / Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Address / Area</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Hostel / area / city"
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
              placeholder="12.9716"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Longitude (optional)</label>
            <input
              name="longitude"
              value={form.longitude}
              onChange={handleChange}
              placeholder="77.5946"
            />
          </div>
        </div>

        {/* Education & experience */}
        <div className="form-group">
          <label>Education</label>
          <input
            name="education"
            value={form.education}
            onChange={handleChange}
            placeholder="e.g. MCA student, BSc, etc."
          />
        </div>

        <div className="form-group">
          <label>Experience (if any)</label>
          <textarea
            name="experience"
            value={form.experience}
            onChange={handleChange}
            rows={2}
            placeholder="Any past volunteering, teaching, support work..."
            style={{
              width: "100%",
              padding: "0.6rem",
              borderRadius: "10px",
            }}
          />
        </div>

        {/* Skills */}
        <div className="form-group">
          <label>Skills you can offer</label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.4rem 1rem",
              marginTop: "0.2rem",
            }}
          >
            {SKILL_OPTIONS.map((opt) => (
              <label key={opt} style={{ fontSize: "0.85rem" }}>
                <input
                  type="checkbox"
                  checked={form.skills.includes(opt)}
                  onChange={() => toggleArrayItem("skills", opt)}
                  style={{ marginRight: "0.35rem" }}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="form-group">
          <label>Languages you can support in</label>
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

        {/* Availability */}
        <div className="form-group">
          <label>Availability – days</label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.4rem 1rem",
              marginTop: "0.2rem",
            }}
          >
            {DAYS_OPTIONS.map((day) => (
              <label key={day} style={{ fontSize: "0.85rem" }}>
                <input
                  type="checkbox"
                  checked={form.availabilityDays.includes(day)}
                  onChange={() => toggleArrayItem("availabilityDays", day)}
                  style={{ marginRight: "0.35rem" }}
                />
                {day}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Availability – time slots</label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.4rem 1rem",
              marginTop: "0.2rem",
            }}
          >
            {TIME_SLOT_OPTIONS.map((slot) => (
              <label key={slot} style={{ fontSize: "0.85rem" }}>
                <input
                  type="checkbox"
                  checked={form.availabilitySlots.includes(slot)}
                  onChange={() => toggleArrayItem("availabilitySlots", slot)}
                  style={{ marginRight: "0.35rem" }}
                />
                {slot}
              </label>
            ))}
          </div>
        </div>

        {/* Willingness */}
        <div className="form-group">
          <label>Extra willingness</label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.8rem",
              marginTop: "0.2rem",
              fontSize: "0.85rem",
            }}
          >
            <label>
              <input
                type="checkbox"
                name="weekend"
                checked={form.weekend}
                onChange={handleChange}
                style={{ marginRight: "0.35rem" }}
              />
              Available on weekends
            </label>

            <label>
              <input
                type="checkbox"
                name="travel"
                checked={form.travel}
                onChange={handleChange}
                style={{ marginRight: "0.35rem" }}
              />
              Can travel within city
            </label>

            <label>
              <input
                type="checkbox"
                name="emergencySupport"
                checked={form.emergencySupport}
                onChange={handleChange}
                style={{ marginRight: "0.35rem" }}
              />
              Can help in emergencies
            </label>
          </div>
        </div>

        {/* Strengths and plan */}
        <div className="form-group">
          <label>Your strengths (optional)</label>
          <textarea
            name="strengths"
            value={form.strengths}
            onChange={handleChange}
            rows={2}
            placeholder="e.g. patient, good listener, good with computers..."
            style={{
              width: "100%",
              padding: "0.6rem",
              borderRadius: "10px",
            }}
          />
        </div>

        <div className="form-group">
          <label>How will you support a careseeker?</label>
          <textarea
            name="caregiverPlan"
            value={form.caregiverPlan}
            onChange={handleChange}
            rows={3}
            placeholder="Describe your approach – how you will help them in studies or daily tasks."
            style={{
              width: "100%",
              padding: "0.6rem",
              borderRadius: "10px",
            }}
          />
        </div>

        {/* Payment / volunteer */}
        <div
          className="form-group"
          style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}
        >
          <div style={{ flex: 1 }}>
            <label>Hourly rate (optional)</label>
            <input
              name="hourlyRate"
              type="number"
              min="0"
              value={form.hourlyRate}
              onChange={handleChange}
              placeholder="0 for volunteer / free"
            />
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <label style={{ fontSize: "0.9rem" }}>
              <input
                type="checkbox"
                name="isVolunteer"
                checked={form.isVolunteer}
                onChange={handleChange}
                style={{ marginRight: "0.35rem" }}
              />
              I am open to volunteering / free support
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ marginTop: "0.8rem" }}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save caregiver profile"}
        </button>

        {message && (
          <p style={{ color: "#4ade80", marginTop: "0.6rem" }}>{message}</p>
        )}
        {error && <p className="auth-error">{error}</p>}
      </form>
    </div>
  );
};

export default CaregiverProfileForm;
