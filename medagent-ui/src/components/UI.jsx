import React from 'react';
import { ShieldAlert, FileText, Pill, Activity, ArrowRight, Play, Download, RefreshCw, UploadCloud, Bell } from 'lucide-react';
import { T, AI, RX, VOICE, CHAT, RECOVERY_H, PAGES_META } from '../utils/lang';

export const StatCard = ({ title, value, sub, icon: Icon, color }) => (
    <div className={`stat-card ${color}`}>
        <div className="stat-label">{title}</div>
        <div className="stat-value">{value}</div>
        <div className="stat-change">{sub}</div>
        {Icon && <Icon className="stat-icon" />}
    </div>
);

export const Panel = ({ title, children, action, icon: Icon }) => (
    <div className="panel">
        <div className="panel-header">
            <div className="panel-title">
                {Icon && <Icon size={16} />}
                {title}
            </div>
            {action && <div>{action}</div>}
        </div>
        <div className="panel-body">{children}</div>
    </div>
);

export const LabRow = ({ name, val, range, status }) => {
    const getBadgeClass = (s) => {
        switch (s) {
            case 'normal': return 'normal';
            case 'high': return 'high';
            case 'critical': return 'critical';
            default: return 'normal';
        }
    };

    const getBadgeText = (s, lang) => {
        switch (s) {
            case 'normal': return T[lang].badge_normal;
            case 'high': return T[lang].badge_high;
            case 'critical': return T[lang].badge_critical;
            default: return 'NORMAL';
        }
    };

    // Default to English for generic components, or pass lang as prop if needed.
    return (
        <div className="lab-row">
            <div className={`lab-ind ${status}`}></div>
            <div className="lab-name">{name}</div>
            <div className={`lab-val ${status}`}>{val}</div>
            <div className="lab-range">{range}</div>
            <div className={`lab-badge ${getBadgeClass(status)}`}>
                {getBadgeText(status, 'en')}
            </div>
        </div>
    );
};

export const AISummary = ({ lang = 'en' }) => {
    const data = AI[lang];
    return (
        <div className={`ai-summary ${lang}`}>
            <div className="ai-header">
                <div className="ai-label-text">{data.label}</div>
                <div className={`lang-badge ${lang}`}>{data.badge}</div>
            </div>
            <div className="ai-text" dangerouslySetInnerHTML={{ __html: data.text }} />
        </div>
    );
};

export const VoicePlayer = ({ lang = 'en' }) => {
    const data = VOICE[lang];
    return (
        <div className={`voice-player ${lang}`}>
            <button className="play-btn">
                <Play size={16} fill="currentColor" />
            </button>
            <div className="voice-info">
                <div className="voice-title">{data.title}</div>
                <div className="voice-sub">{data.sub}</div>
            </div>
            <div className="voice-waveform">
                {[...Array(8)].map((_, i) => <div key={i} className="wave-bar"></div>)}
            </div>
        </div>
    );
};

export const RxCard = ({ rxId, name, type, lang = 'en' }) => {
    const data = RX[rxId] ? RX[rxId][lang] : null;
    return (
        <div className="rx-card">
            <div className="rx-header">
                <div className="rx-medicine">{name}</div>
                <div className="rx-type">{type}</div>
            </div>
            {data && (
                <div className={`rx-translation ${lang}`} dangerouslySetInnerHTML={{ __html: data }} />
            )}
        </div>
    );
};

export const AlertItem = ({ type, title, sub, time }) => (
    <div className={`alert-item ${type}`}>
        <div className="alert-dot"></div>
        <div className="alert-content">
            <div className="alert-title">{title}</div>
            <div className="alert-sub">{sub}</div>
            <div className="alert-time">{time}</div>
        </div>
        <ArrowRight size={14} color="var(--muted)" style={{ marginTop: '4px' }} />
    </div>
);

export const Btn = ({ variant = 'primary', icon: Icon, children, ...props }) => {
    return (
        <button className={`btn btn-${variant}`} {...props}>
            {Icon && <Icon size={14} />}
            {children}
        </button>
    );
};

export const UploadZone = ({ icon: Icon, title, sub, btnText, onClick }) => (
    <div className="upload-zone" onClick={onClick}>
        {Icon && <Icon className="upload-icon" color="var(--blue)" />}
        <div className="upload-title">{title}</div>
        <div className="upload-sub">{sub}</div>
        <button className="upload-btn">{btnText}</button>
    </div>
);

export const LangStrip = ({ value, onChange }) => {
    return (
        <div className="lang-strip">
            <button className={`ls-btn ${value === 'en' ? 'active' : ''}`} onClick={() => onChange('en')}>English</button>
            <button className={`ls-btn telugu ${value === 'te' ? 'active' : ''}`} onClick={() => onChange('te')}>తెలుగు</button>
            <button className={`ls-btn hindi ${value === 'hi' ? 'active' : ''}`} onClick={() => onChange('hi')}>हिंदी</button>
        </div>
    );
};
