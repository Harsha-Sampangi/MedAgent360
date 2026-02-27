import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { T } from '../utils/lang';
import { getAlerts } from '../utils/api';
import { Panel, AlertItem } from '../components/UI';

const Alerts = ({ lang }) => {
    const [alerts, setAlerts] = useState([
        { type: 'critical', title: 'High Blood Sugar Detected', sub: 'Lab result: 142 mg/dL', time: '2 hours ago' },
        { type: 'warning', title: 'Missed Check-in', sub: 'Morning symptom check', time: '5 hours ago' },
        { type: 'info', title: 'New Prescription Added', sub: 'Metformin 500mg', time: '1 day ago' },
    ]);

    useEffect(() => {
        getAlerts()
            .then(data => setAlerts(data.alerts))
            .catch(() => { }); // keep defaults
    }, []);

    return (
        <>
            <div className="section-lang-header">
                <h2 className="section-title">{T[lang].alerts_page}</h2>
            </div>

            <div style={{ maxWidth: '800px' }}>
                <Panel title={T[lang].alerts_title} icon={Bell} action={<div className="alert-count">{alerts.length} Active</div>}>
                    <div className="alerts-list" style={{ gap: '12px' }}>
                        {alerts.map((a, i) => (
                            <AlertItem key={i} type={a.type} title={a.title} sub={a.sub} time={a.time} />
                        ))}
                    </div>
                </Panel>
            </div>
        </>
    );
};

export default Alerts;
