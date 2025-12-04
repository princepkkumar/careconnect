import React, { useEffect, useState } from "react";
import api from "../../services/api.js";

const CareRequestForm = () => {
  const [form, setForm] = useState({
    description: "",
    needTagsInput: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [myRequests, setMyRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const res = await api.get("/careseeker/requests");
        setMyRequests(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingRequests(false);
      }
    };

    loadRequests();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    if (!form.description.trim()) {
      setError("Please describe what help you need.");
      setSaving(false);
      return;
    }

    try {
      const tags = form.needTagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const payload = {
        description: form.description.trim(),
        needTags: tags,
      };

      const res = await api.post("/careseeker/requests", payload);

      setMessage("Request created successfully!");
      setForm({ description: "", needTagsInput: "" });
      setMyRequests((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error(err);
      setError("Failed to create request.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <h3>Create a new care request</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Describe your need</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Describe your problem..."
            style={{
              width: "100%",
              padding: "0.6rem",
              borderRadius: "10px",
            }}
          ></textarea>
        </div>

        <div className="form-group">
          <label>Need tags (comma separated)</label>
          <input
            name="needTagsInput"
            value={form.needTagsInput}
            onChange={handleChange}
            placeholder="e.g. note-taking, reading, computer help"
          />
        </div>

        <button
          className="btn btn-primary"
          type="submit"
          disabled={saving}
          style={{ marginTop: "0.5rem" }}
        >
          {saving ? "Creating..." : "Create request"}
        </button>

        {message && <p style={{ color: "lightgreen" }}>{message}</p>}
        {error && <p className="auth-error">{error}</p>}
      </form>
    </div>
  );
};

export default CareRequestForm;
