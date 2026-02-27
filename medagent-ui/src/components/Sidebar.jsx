import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldAlert, FileText, Pill, Activity, Bell, Home } from 'lucide-react';
import { T } from '../utils/lang';

const Sidebar = ({ lang, setLang }) => {
    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-mark">
                    <div className="logo-icon"><ShieldAlert size={20} color="white" /></div>
                    <div className="logo-text">MedAgent<span>360</span></div>
                </div>
                <div className="logo-sub">INTELLIGENCE PLATFORM</div>
            </div>

            <div className="sidebar-patient">
                <div className="patient-avatar">👨</div>
                <div>
                    <div className="patient-name">Ravi Kumar (42M)</div>
                    <div className="patient-id">ID: 8894-MAX</div>
                </div>
            </div>

            <div className="sidebar-nav">
                <div className="nav-section">MAIN</div>

                <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Home className="nav-icon" /> {T[lang].nav_dashboard}
                </NavLink>

                <div className="nav-section" style={{ marginTop: '10px' }}>MODULES</div>

                <NavLink to="/lab-report" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <FileText className="nav-icon" /> {T[lang].nav_lab}
                </NavLink>

                <NavLink to="/prescription" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Pill className="nav-icon" /> {T[lang].nav_rx}
                </NavLink>

                <NavLink to="/followup" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Activity className="nav-icon" /> {T[lang].nav_followup}
                    <span className="nav-badge green">ON</span>
                </NavLink>

                <NavLink to="/alerts" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Bell className="nav-icon" /> {T[lang].nav_alerts}
                    <span className="nav-badge">3</span>
                </NavLink>

                <NavLink to="/recovery" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <ShieldAlert className="nav-icon" /> {T[lang].nav_recovery}
                </NavLink>
            </div>

            <div className="lang-section-label">AI OUTPUT LANGUAGE</div>
            <div className="lang-switcher">
                <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>
                    <div className="flag">🇬🇧</div>
                    <div className="code">EN</div>
                    <div className="native">English</div>
                </button>
                <button className={`lang-btn ${lang === 'te' ? 'active' : ''}`} onClick={() => setLang('te')}>
                    <div className="flag">🇮🇳</div>
                    <div className="code">TE</div>
                    <div className="native telugu">తెలుగు</div>
                </button>
                <button className={`lang-btn ${lang === 'hi' ? 'active' : ''}`} onClick={() => setLang('hi')}>
                    <div className="flag">🇮🇳</div>
                    <div className="code">HI</div>
                    <div className="native hindi">हिंदी</div>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
