import React from 'react';
import { Bell } from 'lucide-react';
import { PAGES_META } from '../utils/lang';

const Topbar = ({ lang, activePageKey }) => {
    const meta = PAGES_META[activePageKey] || PAGES_META.dashboard;

    return (
        <div className="topbar">
            <div className="topbar-left">
                <h2 className={lang === 'te' ? 'telugu' : lang === 'hi' ? 'hindi' : ''}>
                    {meta.title[lang]}
                </h2>
                <p className={lang === 'te' ? 'telugu' : lang === 'hi' ? 'hindi' : ''}>
                    {meta.sub[lang]}
                </p>
            </div>
            <div className="topbar-right">
                <div className={`lang-pill ${lang}`}>
                    {lang === 'en' ? '🇬🇧 EN' : lang === 'te' ? '🇮🇳 TE' : '🇮🇳 HI'}
                </div>
                <div className="status-chip">
                    <div className="status-dot"></div>
                    Agent Online
                </div>
                <div className="alert-bell">
                    <Bell size={18} fill="currentColor" />
                </div>
            </div>
        </div>
    );
};

export default Topbar;
