import React, { useState, useEffect } from 'react';
import { FileText, Pill, Bell, ShieldAlert, Activity, ArrowRight, Download, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { T, CHAT } from '../utils/lang';
import { getDashboardStats } from '../utils/api';
import { StatCard, Panel, LabRow, AISummary, RxCard, AlertItem, Btn } from '../components/UI';

const Dashboard = ({ lang }) => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ lab_count: 24, rx_count: 4, alert_count: 3, recovery_day: 5 });

    useEffect(() => {
        getDashboardStats()
            .then(data => setStats(data))
            .catch(() => { }); // silently fall back to defaults
    }, []);

    return (
        <>
            <div className="stats-row">
                <StatCard title={T[lang].stat_lab} value={stats.lab_count} sub={T[lang].stat_lab_sub} icon={FileText} color="blue" />
                <StatCard title={T[lang].stat_rx} value={stats.rx_count} sub={T[lang].stat_rx_sub} icon={Pill} color="purple" />
                <StatCard title={T[lang].stat_alerts} value={stats.alert_count} sub={T[lang].stat_alert_sub} icon={Bell} color="orange" />
                <StatCard title={T[lang].stat_recovery} value={`Day ${stats.recovery_day}`} sub={T[lang].stat_recovery_sub} icon={ShieldAlert} color="green" />
            </div>

            <div className="main-grid">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    <Panel title={T[lang].lab_title} icon={FileText} action={<Btn icon={Download} variant="secondary">{T[lang].btn_export}</Btn>}>
                        <div className="lab-results">
                            <LabRow name="Hemoglobin" val="13.8" range="12.0 - 15.5" status="normal" />
                            <LabRow name="Blood Sugar (F)" val="142" range="70 - 100" status="high" />
                            <LabRow name="Cholesterol" val="248" range="< 200" status="critical" />
                        </div>
                        <AISummary lang={lang} />
                        <div className="action-bar">
                            <Btn icon={ArrowRight} variant="primary" onClick={() => navigate('/lab-report')}>{T[lang].btn_fullreport}</Btn>
                            <Btn icon={AlertTriangle} variant="danger">{T[lang].btn_alert_doc}</Btn>
                        </div>
                    </Panel>

                    <Panel title={T[lang].rx_title} icon={Pill}>
                        <div className="rx-results">
                            <RxCard rxId="metformin" name="Metformin 500mg" type="TABLET" lang={lang} />
                            <RxCard rxId="atorvastatin" name="Atorvastatin 20mg" type="TABLET" lang={lang} />
                        </div>
                    </Panel>

                </div>

                <div className="right-panel">

                    <Panel title={T[lang].followup_agent} icon={Activity} action={<div className="status-chip"><div className="status-dot"></div>Online</div>}>
                        <div className="chat-messages" style={{ height: '300px', borderRadius: '12px', background: 'var(--bg)', padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {CHAT[lang].map((msg, i) => (
                                <div key={i} className={`msg ${msg.r} ${msg.a ? 'alert-msg' : ''}`}>
                                    <div className="msg-bubble">{msg.t}</div>
                                    <div className="msg-meta">{msg.m}</div>
                                </div>
                            ))}
                        </div>
                    </Panel>

                    <Panel title={T[lang].alerts_title} icon={Bell} action={<div className="alert-count">{stats.alert_count}</div>}>
                        <div className="alerts-list">
                            <AlertItem type="critical" title="High Blood Sugar Detected" sub="Lab result: 142 mg/dL" time="2h ago" />
                            <AlertItem type="warning" title="Missed Check-in" sub="Morning symptom check" time="5h ago" />
                            <AlertItem type="info" title="New Prescription Added" sub="Metformin 500mg" time="1d ago" />
                        </div>
                    </Panel>

                </div>
            </div>
        </>
    );
};

export default Dashboard;
