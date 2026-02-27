import React, { useState, useEffect } from 'react';
import { ShieldAlert, Activity, CheckCircle, Clock } from 'lucide-react';
import { T, RECOVERY_H } from '../utils/lang';
import { getRecoveryData } from '../utils/api';
import { Panel, Btn } from '../components/UI';

const Recovery = ({ lang }) => {
    const [recoveryData, setRecoveryData] = useState(null);
    const history = RECOVERY_H[lang];

    useEffect(() => {
        getRecoveryData()
            .then(data => setRecoveryData(data))
            .catch(() => { }); // keep fallback
    }, []);

    const vitals = recoveryData?.vitals || {
        pain: { value: 6, max: 10, label: "6/10" },
        energy: { value: 4, max: 10, label: "Low" },
        sleep: { value: 6, max: 10, label: "6h" },
        appetite: { value: 8, max: 10, label: "Good" },
    };

    const currentDay = recoveryData?.current_day || 5;
    const totalDays = recoveryData?.total_days || 7;

    return (
        <>
            <div className="section-lang-header">
                <h2 className="section-title">{T[lang].recovery_page}</h2>
            </div>

            <div className="main-grid">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    <Panel title={T[lang].day_progress} icon={Activity}>
                        <div className="recovery-days" style={{ marginBottom: '20px' }}>
                            {Array.from({ length: totalDays }, (_, i) => {
                                const day = i + 1;
                                const isDone = day < currentDay;
                                const isToday = day === currentDay;
                                return (
                                    <React.Fragment key={day}>
                                        {i > 0 && (
                                            <div style={{
                                                height: '2px',
                                                flex: 1,
                                                background: isDone || isToday ? (isDone ? 'var(--green)' : 'var(--blue)') : 'var(--border)',
                                                marginTop: '20px'
                                            }}></div>
                                        )}
                                        <div className="day-pill">
                                            <div className="day-label">D{day}</div>
                                            <div className={`day-dot ${isDone ? 'done' : isToday ? 'today' : 'future'}`}>
                                                {isDone ? '✓' : day}
                                            </div>
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </div>

                        <h3 style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--muted)' }}>{T[lang].checkin_history}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {[...history].reverse().map((item, i) => (
                                <div key={i} style={{ display: 'flex', padding: '10px', background: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border)', gap: '12px' }}>
                                    <div style={{ paddingTop: '2px' }}>
                                        {item.ok ? <CheckCircle size={14} color="var(--green)" /> : <ShieldAlert size={14} color="var(--red)" />}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '2px' }}>{item.d}</div>
                                        <div style={{ fontSize: '11px' }}>{item.t}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Panel>

                </div>

                <div className="right-panel">

                    <Panel title={T[lang].todays_vitals} icon={Activity}>
                        <div className="vitals">
                            <div className="vital-row">
                                <div className="vital-name">{T[lang].v_pain}</div>
                                <div className="vital-bar-bg">
                                    <div className="vital-bar" style={{ width: `${(vitals.pain.value / vitals.pain.max) * 100}%`, background: 'var(--orange)' }}></div>
                                </div>
                                <div className="vital-val">{vitals.pain.label}</div>
                            </div>
                            <div className="vital-row">
                                <div className="vital-name">{T[lang].v_energy}</div>
                                <div className="vital-bar-bg">
                                    <div className="vital-bar" style={{ width: `${(vitals.energy.value / vitals.energy.max) * 100}%`, background: 'var(--blue)' }}></div>
                                </div>
                                <div className="vital-val">{vitals.energy.label}</div>
                            </div>
                            <div className="vital-row">
                                <div className="vital-name">{T[lang].v_sleep}</div>
                                <div className="vital-bar-bg">
                                    <div className="vital-bar" style={{ width: `${(vitals.sleep.value / vitals.sleep.max) * 100}%`, background: 'var(--green)' }}></div>
                                </div>
                                <div className="vital-val">{vitals.sleep.label}</div>
                            </div>
                            <div className="vital-row">
                                <div className="vital-name">{T[lang].v_appetite}</div>
                                <div className="vital-bar-bg">
                                    <div className="vital-bar" style={{ width: `${(vitals.appetite.value / vitals.appetite.max) * 100}%`, background: 'var(--green)' }}></div>
                                </div>
                                <div className="vital-val">{vitals.appetite.label}</div>
                            </div>
                        </div>

                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={12} /> Last updated: 06:15 AM
                            </div>
                            <Btn variant="secondary" style={{ width: '100%', justifyContent: 'center' }}>Request Update</Btn>
                        </div>
                    </Panel>

                </div>
            </div>
        </>
    );
};

export default Recovery;
