import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="app-root">
      <div className="card">
        <div className="badge">
          <span className="badge-dot" />
          Inclusive support platform for students & persons with disabilities
        </div>

        <h1 className="card-title">CareConnect</h1>
        <p className="card-subtitle">
          Smartly matching <b>careseekers</b> who need academic or daily support
          with <b>caregivers</b> who are ready to help.
        </p>

        <div className="row" style={{ marginBottom: "1.2rem" }}>
          <div className="col">
            <div className="role-card">
              <div className="role-title">Careseekers</div>
              <p className="role-desc">
                Students or individuals with disabilities looking for note-taking
                help, reading assistance, mobility support, exam prep and more.
              </p>
            </div>
          </div>

          <div className="col">
            <div className="role-card">
              <div className="role-title">Caregivers</div>
              <p className="role-desc">
                Volunteers, classmates or trained helpers who can provide academic,
                digital or physical support — nearby or online.
              </p>
            </div>
          </div>
        </div>

        <div className="arrow-center">
          <span className="arrow-pill">
            careseekers <span style={{ margin: "0 6px" }}>↔</span> caregivers
          </span>
        </div>

        <div className="btn-row">
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>

          <Link to="/register" className="btn btn-secondary">
            Create an account
          </Link>
        </div>

        <p className="small-text">
          Choose your role (careseeker / caregiver / admin) during registration.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
