import React, { useEffect, useState } from "react";
import api from "../../services/api.js";

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningMatchId, setRunningMatchId] = useState(null);
  const [error, setError] = useState("");

  const loadRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/requests");
      setRequests(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const runMatch = async (requestId) => {
    setRunningMatchId(requestId);
    setError("");
    try {
      const res = await api.post(`/match/${requestId}/match`);
      // update status in list
      setRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, status: res.data.request.status } : r))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to run matching for this request.");
    } finally {
      setRunningMatchId(null);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card" style={{ maxWidth: "1000px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <div>
            <h2 className="auth-title" style={{ marginBottom: "0.2rem" }}>
              Admin – All Requests
            </h2>
            <p className="auth-subtitle">
              View all care requests and trigger caregiver matching.
            </p>
          </div>
          <button className="btn btn-secondary" onClick={loadRequests}>
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="card-subtitle">No requests found.</p>
        ) : (
          <div
            style={{
              maxHeight: "420px",
              overflowY: "auto",
              border: "1px solid rgba(148,163,184,0.3)",
              borderRadius: "12px",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.85rem",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "rgba(15,23,42,0.9)",
                    position: "sticky",
                    top: 0,
                  }}
                >
                  <th style={{ padding: "0.5rem", textAlign: "left" }}>Careseeker</th>
                  <th style={{ padding: "0.5rem", textAlign: "left" }}>Description</th>
                  <th style={{ padding: "0.5rem", textAlign: "left" }}>Status</th>
                  <th style={{ padding: "0.5rem", textAlign: "left" }}>Created</th>
                  <th style={{ padding: "0.5rem" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr
                    key={req._id}
                    style={{ borderTop: "1px solid rgba(148,163,184,0.2)" }}
                  >
                    <td style={{ padding: "0.5rem", verticalAlign: "top" }}>
                      <div>{req.careseeker?.name || "N/A"}</div>
                      <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                        {req.careseeker?.email}
                      </div>
                    </td>
                    <td style={{ padding: "0.5rem", verticalAlign: "top" }}>
                      {req.description}
                      {req.needTags?.length > 0 && (
                        <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.2rem" }}>
                          Tags: {req.needTags.join(", ")}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "0.5rem", verticalAlign: "top" }}>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          padding: "0.15rem 0.5rem",
                          borderRadius: "999px",
                          border: "1px solid rgba(148,163,184,0.4)",
                          textTransform: "capitalize",
                        }}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "0.5rem",
                        verticalAlign: "top",
                        fontSize: "0.75rem",
                        color: "#9ca3af",
                      }}
                    >
                      {new Date(req.createdAt).toLocaleString()}
                    </td>
                    <td
                      style={{
                        padding: "0.5rem",
                        textAlign: "center",
                        verticalAlign: "top",
                      }}
                    >
                      {req.status === "open" ? (
                        <button
                          className="btn btn-primary"
                          style={{ padding: "0.35rem 0.8rem", fontSize: "0.8rem" }}
                          onClick={() => runMatch(req._id)}
                          disabled={runningMatchId === req._id}
                        >
                          {runningMatchId === req._id ? "Matching..." : "Run match"}
                        </button>
                      ) : (
                        <span style={{ fontSize: "0.75rem", color: "#a5b4fc" }}>
                          Already matched
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {error && <p className="auth-error" style={{ marginTop: "0.7rem" }}>{error}</p>}
      </div>
    </div>
  );
};

export default AdminRequests;
