import { Link } from "react-router-dom";

export default function SuccessPage() {
  return (
    <div className="hero" style={{ minHeight: '100vh', paddingTop: '6rem' }}>
      <div className="hero-content">
        {/* Animated checkmark */}
        <div style={{ fontSize: '6rem', marginBottom: '1rem', color: '#4ade80', animation: 'pop 0.5s ease' }}>
          ✅
        </div>

        <h1 className="hero-title gradient-text">
          WoWStats Pro Activated!
        </h1>

        <p className="hero-subtitle">
          Congratulations! Your WoWStats Pro subscription is now active. 
          You now have access to advanced analytics, arena stats, and premium features.
        </p>

        <Link to="/dashboard" className="hero-button">
          Go back to homepage
        </Link>
      </div>
    </div>
  );
}
