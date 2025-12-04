import React, { useEffect, useState } from "react";
import api from "../../services/api.js";

const AdminUsers = () => {
  const [caregivers, setCaregivers] = useState([]);
  const [careseekers, setCareseekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/users");
      setCaregivers(res.data.caregivers || []);
      setCareseekers(res.data.careseekers || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="auth-wrapper">
      <div className="card" style={{ maxWidth: "1100px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <div>
            <h2 className="auth-title" style={{ marginBottom: "0.3rem" }}>
              Users – Caregivers & Careseekers
            </h2>
            <p className="auth-subtitle">
              View all registered users with their basic profile info.
            </p>
          </div>
          <button className="btn btn-secondary" onClick={loadUsers}>
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p className="auth-error">{error}</p>
        ) : (
          <>
            {/* Caregivers table */}
            <h3 style={{ marginTop: "0.5rem", marginBottom: "0.4rem" }}>
              Caregivers ({caregivers.length})
            </h3>
            {caregivers.length === 0 ? (
              <p className="card-subtitle">No caregivers registered yet.</p>
            ) : (
              <div
                style={{
                  maxHeight: "220px",
                  overflowY: "auto",
                  border: "1px solid rgba(148,163,184,0.3)",
                  borderRadius: "12px",
                  marginBottom: "1.2rem",
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
                      <th style={{ padding: "0.5rem", textAlign: "left" }}>
                        Name
                      </th>
                      <th style={{ padding: "0.5rem", textAlign: "left" }}>
                        Email
                      </th>
                      <th style={{ padding: "0.5rem", textAlign: "left" }}>
                        Skills
                      </th>
                      <th style={{ padding: "0.5rem", textAlign: "left" }}>
                        Area
                      </th>
                      <th style={{ padding: "0.5rem", textAlign: "left" }}>
                        Languages
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {caregivers.map((cg) => (
                      <tr
                        key={cg._id}
                        style={{
                          borderTop: "1px solid rgba(148,163,184,0.2)",
                        }}
                      >
                        <td style={{ padding: "0.5rem" }}>
                          {cg.user?.name || "N/A"}
                        </td>
                        <td style={{ padding: "0.5rem" }}>
                          {cg.user?.email || "N/A"}
                        </td>
                        <td style={{ padding: "0.5rem" }}>
                          {cg.skills && cg.skills.length > 0
                            ? cg.skills.join(", ")
                            : "-"}
                        </td>
                        <td style={{ padding: "0.5rem" }}>
                          {cg.address || "-"}
                        </td>
                        <td style={{ padding: "0.5rem" }}>
                          {cg.languages && cg.languages.length > 0
                            ? cg.languages.join(", ")
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Careseekers table */}
            <h3 style={{ marginBottom: "0.4rem" }}>
              Careseekers ({careseekers.length})
            </h3>
            {careseekers.length === 0 ? (
              <p className="card-subtitle">No careseekers registered yet.</p>
            ) : (
              <div
                style={{
                  maxHeight: "220px",
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
                      <th style={{ padding: "0.5rem", textAlign: "left" }}>
                        Name
                      </th>
                      <th style={{ padding: "0.5rem", textAlign: "left" }}>
                        Email
                      </th>
                      <th style={{ padding: "0.5rem", textAlign: "left" }}>
                        Disability / Condition
                      </th>
                      <th style={{ padding: "0.5rem", textAlign: "left" }}>
                        Area
                      </th>
                      <th style={{ padding: "0.5rem", textAlign: "left" }}>
                        Support needs
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {careseekers.map((cs) => (
                      <tr
                        key={cs._id}
                        style={{
                          borderTop: "1px solid rgba(148,163,184,0.2)",
                        }}
                      >
                        <td style={{ padding: "0.5rem" }}>
                          {cs.user?.name || "N/A"}
                        </td>
                        <td style={{ padding: "0.5rem" }}>
                          {cs.user?.email || "N/A"}
                        </td>
                        <td style={{ padding: "0.5rem" }}>
                          {cs.disabilityType || "-"}
                        </td>
                        <td style={{ padding: "0.5rem" }}>
                          {cs.address || "-"}
                        </td>
                        <td style={{ padding: "0.5rem" }}>
                          {cs.supportNeeds && cs.supportNeeds.length > 0
                            ? cs.supportNeeds.join(", ")
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
