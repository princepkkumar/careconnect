import React, { useEffect, useState } from "react";
import api from "../../services/api";

const CaregiverAssigned = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");

  const loadAssigned = async () => {
    setLoading(true);
    try {
      const res = await api.get("/caregiver/assigned");
      setRequests(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load assigned requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssigned();
  }, []);

  const acceptRequest = async (id) => {
    setActionId(id);
    try {
      await api.patch(`/caregiver/assigned/${id}/accept`);
      loadAssigned();
    } catch (err) {
      console.error(err);
    } finally {
      setActionId(null);
    }
  };

  const completeRequest = async (id) => {
    setActionId(id);
    try {
      await api.patch(`/caregiver/assigned/${id}/complete`);
      loadAssigned();
    } catch (err) {
      console.error(err);
    } finally {
      setActionId(null);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "matched":
        return "#facc15";
      case "in_progress":
        return "#38bdf8";
      case "completed":
        return "#22c55e";
      default:
        return "#e5e7eb";
    }
  };

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <h3 style={{ marginBottom: "0.7rem" }}>Assigned Requests</h3>
      <p className="card-subtitle">Requests assigned to you by admin or system match.</p>

      {loading ? (
        <p>Loading assigned requests...</p>
      ) : requests.length === 0 ? (
        <p className="card-subtitle">No requests assigned yet.</p>
      ) : (
        <div
          style={{
            maxHeight: "350px",
            overflowY: "auto",
            border: "1px solid rgba(148,163,184,0.3)",
            borderRadius: "12px",
            padding: "0.6rem",
          }}
        >
          {requests.map((r) => (
            <div
              key={r._id}
              style={{
                borderBottom: "1px solid rgba(148,163,184,0.2)",
                paddingBottom: "0.7rem",
                marginBottom: "0.7rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span
                  style={{
                    fontSize: "0.8rem",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "999px",
                    border: "1px solid rgba(148,163,184,0.4)",
                    color: statusColor(r.status),
                  }}
                >
                  {r.status}
                </span>

                <span style={{ fontSize: "0.7rem", color: "#9ca3af" }}>
                  {new Date(r.createdAt).toLocaleString()}
                </span>
              </div>

              <p style={{ marginTop: "0.4rem", fontSize: "0.95rem" }}>{r.description}</p>

              <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                Careseeker: <b>{r.careseeker?.name}</b> ({r.careseeker?.email})
              </p>

              {r.needTags?.length > 0 && (
                <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                  Tags: {r.needTags.join(", ")}
                </p>
              )}

              {/* Buttons */}
              {r.status === "matched" && (
                <button
                  className="btn btn-primary"
                  disabled={actionId === r._id}
                  onClick={() => acceptRequest(r._id)}
                  style={{ marginTop: "0.6rem" }}
                >
                  {actionId === r._id ? "Accepting..." : "Accept Request"}
                </button>
              )}

              {r.status === "in_progress" && (
                <button
                  className="btn btn-secondary"
                  disabled={actionId === r._id}
                  onClick={() => completeRequest(r._id)}
                  style={{ marginTop: "0.6rem" }}
                >
                  {actionId === r._id ? "Completing..." : "Mark Completed"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {error && <p className="auth-error">{error}</p>}
    </div>
  );
};

export default CaregiverAssigned;
