import React, { useState } from 'react';
import { Activity, Settings, Calendar, Globe, Bell as BellIcon, Stethoscope, Play, UserPlus, Loader } from 'lucide-react';
import { T, CHAT } from '../utils/lang';
import { sendCheckin, enrollPatient } from '../utils/api';
import { Panel, Btn } from '../components/UI';

const FollowUp = ({ lang }) => {
    const [chatLang, setChatLang] = useState(lang);
    const [inputText, setInputText] = useState('');
    const [checkinStatus, setCheckinStatus] = useState(null);
    const [checkinLoading, setCheckinLoading] = useState(false);
    const [enrollForm, setEnrollForm] = useState({ phone: '', name: '', language: 'English', doctorPhone: '' });
    const [enrollStatus, setEnrollStatus] = useState(null);

    const handleSend = (e) => {
        e.preventDefault();
        if (inputText.trim()) {
            setInputText('');
        }
    };

    const handleTriggerCheckin = async () => {
        setCheckinLoading(true);
        setCheckinStatus(null);
        try {
            const result = await sendCheckin('+919999999999', 'Ravi Kumar', chatLang === 'te' ? 'Telugu' : chatLang === 'hi' ? 'Hindi' : 'English');
            setCheckinStatus({ ok: true, msg: result.message_sid ? `✅ Check-in sent (SID: ${result.message_sid})` : '✅ Check-in triggered (Twilio not configured — demo mode)' });
        } catch (err) {
            const detail = err.response?.data?.detail || err.message;
            setCheckinStatus({ ok: false, msg: `⚠️ ${detail || 'Check-in failed — Twilio credentials may be missing'}` });
        } finally {
            setCheckinLoading(false);
        }
    };

    const handleEnroll = async (e) => {
        e.preventDefault();
        try {
            await enrollPatient(enrollForm.phone, enrollForm.name, enrollForm.language, enrollForm.doctorPhone);
            setEnrollStatus({ ok: true, msg: '✅ Patient enrolled successfully' });
        } catch (err) {
            setEnrollStatus({ ok: false, msg: `❌ ${err.response?.data?.detail || err.message}` });
        }
    };

    return (
        <>
            <div className="section-lang-header">
                <h2 className="section-title">{T[lang].followup_title}</h2>
            </div>

            <div className="followup-grid">

                <div className="chat-panel">
                    <div className="chat-header">
                        <div className="chat-title">
                            <Activity size={16} /> WhatsApp Follow-up AI
                        </div>
                        <div className="chat-status">
                            <div className="status-dot" style={{ width: '6px', height: '6px' }}></div>
                            Listening
                        </div>
                    </div>

                    <div className="chat-lang-bar">
                        <div className="clang-label">OUTPUT LANG:</div>
                        <button className={`clang-btn ${chatLang === 'en' ? 'active' : ''}`} onClick={() => setChatLang('en')}>EN</button>
                        <button className={`clang-btn ${chatLang === 'te' ? 'active' : ''}`} onClick={() => setChatLang('te')}>TE</button>
                        <button className={`clang-btn ${chatLang === 'hi' ? 'active' : ''}`} onClick={() => setChatLang('hi')}>HI</button>
                    </div>

                    <div className="chat-messages">
                        {CHAT[chatLang].map((msg, i) => (
                            <div key={i} className={`msg ${msg.r} ${msg.a ? 'alert-msg' : ''}`}>
                                <div className="msg-bubble">{msg.t}</div>
                                <div className="msg-meta">{msg.m}</div>
                            </div>
                        ))}
                    </div>

                    <form className="chat-input" onSubmit={handleSend}>
                        <input
                            type="text"
                            placeholder="Type to test agent..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />
                        <button type="submit" className="send-btn">
                            <Play size={14} fill="white" />
                        </button>
                    </form>
                </div>

                <div className="right-panel">
                    <Panel title={T[lang].agent_settings} icon={Settings}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '11px', fontWeight: 'bold' }}><Calendar size={12} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} /> {T[lang].daily_checkin}</span>
                                <input type="time" defaultValue="08:00" style={{ fontSize: '10px', padding: '4px', borderRadius: '4px', border: '1px solid var(--border)' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '11px', fontWeight: 'bold' }}><Globe size={12} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} /> {T[lang].lang_setting}</span>
                                <select style={{ fontSize: '10px', padding: '4px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                                    <option>English</option>
                                    <option>Telugu</option>
                                    <option>Hindi</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '11px', fontWeight: 'bold' }}><BellIcon size={12} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} /> {T[lang].alert_thresh}</span>
                                <span style={{ fontSize: '10px', background: 'var(--orange-light)', color: 'var(--orange)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{T[lang].thresh_med}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '11px', fontWeight: 'bold' }}><Stethoscope size={12} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} /> {T[lang].doctor_contact}</span>
                                <span style={{ fontSize: '10px', color: 'var(--muted)' }}>Dr. Sharma (+91 98...)</span>
                            </div>
                        </div>

                        <div style={{ marginTop: '16px' }}>
                            <Btn
                                variant="primary"
                                icon={checkinLoading ? Loader : Play}
                                style={{ width: '100%', justifyContent: 'center' }}
                                onClick={handleTriggerCheckin}
                                disabled={checkinLoading}
                            >
                                {checkinLoading ? 'Sending...' : T[lang].btn_trigger}
                            </Btn>
                            {checkinStatus && (
                                <div style={{ marginTop: '8px', fontSize: '10px', color: checkinStatus.ok ? 'var(--green)' : 'var(--orange)', fontWeight: 600 }}>
                                    {checkinStatus.msg}
                                </div>
                            )}
                        </div>
                    </Panel>

                    {/* Patient Enrollment */}
                    <Panel title="Enroll Patient" icon={UserPlus}>
                        <form onSubmit={handleEnroll} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <input placeholder="Phone (+91...)" value={enrollForm.phone} onChange={e => setEnrollForm(f => ({ ...f, phone: e.target.value }))} style={{ fontSize: '11px', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', fontFamily: "'Plus Jakarta Sans', sans-serif" }} />
                            <input placeholder="Patient Name" value={enrollForm.name} onChange={e => setEnrollForm(f => ({ ...f, name: e.target.value }))} style={{ fontSize: '11px', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', fontFamily: "'Plus Jakarta Sans', sans-serif" }} />
                            <Btn type="submit" variant="primary" icon={UserPlus} style={{ width: '100%', justifyContent: 'center' }}>Enroll</Btn>
                            {enrollStatus && (
                                <div style={{ fontSize: '10px', color: enrollStatus.ok ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>
                                    {enrollStatus.msg}
                                </div>
                            )}
                        </form>
                    </Panel>
                </div>

            </div>
        </>
    );
};

export default FollowUp;
