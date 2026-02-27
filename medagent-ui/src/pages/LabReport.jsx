import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Download, RefreshCw, AlertTriangle, Loader } from 'lucide-react';
import { T } from '../utils/lang';
import { analyzeLabReport } from '../utils/api';
import { Panel, LabRow, AISummary, VoicePlayer, Btn, LangStrip } from '../components/UI';

const LANG_MAP = { en: 'English', te: 'Telugu', hi: 'Hindi' };

const LabReport = ({ lang }) => {
    const [outputLang, setOutputLang] = useState(lang);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fileName, setFileName] = useState('');
    const fileRef = useRef(null);

    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFileName(file.name);
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const data = await analyzeLabReport(file, LANG_MAP[outputLang]);
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Analysis failed');
        } finally {
            setLoading(false);
        }
    };

    const handleReanalyze = async () => {
        if (!fileRef.current?.files?.[0]) return;
        setLoading(true);
        setError(null);
        try {
            const data = await analyzeLabReport(fileRef.current.files[0], LANG_MAP[outputLang]);
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Analysis failed');
        } finally {
            setLoading(false);
        }
    };

    const getStatus = (val) => {
        const s = (val.status || '').toUpperCase();
        if (s === 'CRITICAL' || s === 'HIGH') return s === 'CRITICAL' ? 'critical' : 'high';
        if (s === 'LOW') return 'high';
        return 'normal';
    };

    return (
        <>
            <div className="section-lang-header">
                <h2 className="section-title">{T[lang].lab_page_title}</h2>
                <label htmlFor="lab-upload">
                    <Btn icon={UploadCloud} variant="primary" onClick={() => fileRef.current?.click()}>
                        {T[lang].btn_upload_lab}
                    </Btn>
                </label>
                <input
                    ref={fileRef}
                    id="lab-upload"
                    type="file"
                    accept=".pdf"
                    style={{ display: 'none' }}
                    onChange={handleUpload}
                />
            </div>

            <div style={{ maxWidth: '800px' }}>

                {/* Upload Zone — shown when no result yet */}
                {!result && !loading && (
                    <div className="upload-zone" onClick={() => fileRef.current?.click()}>
                        <UploadCloud size={40} color="var(--blue)" style={{ marginBottom: '9px' }} />
                        <div className="upload-title">{T[lang].upload_lab}</div>
                        <div className="upload-sub">{T[lang].upload_lab_sub}</div>
                        <button className="upload-btn">{T[lang].choose_pdf}</button>
                    </div>
                )}

                {/* Loading state */}
                {loading && (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                        <Loader size={36} color="var(--green)" style={{ animation: 'spin 1s linear infinite' }} />
                        <p style={{ marginTop: '12px', fontSize: '13px', color: 'var(--muted)' }}>
                            🤖 Analysing <strong>{fileName}</strong> with AI...
                        </p>
                        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                    </div>
                )}

                {/* Error state */}
                {error && (
                    <div style={{ padding: '16px', background: 'var(--red-light)', border: '1px solid #f0c5c5', borderRadius: '12px', color: 'var(--red)', fontSize: '12px', fontWeight: 600 }}>
                        ❌ {error}
                    </div>
                )}

                {/* Results */}
                {result && !loading && (
                    <Panel title={T[lang].results_title} icon={FileText} action={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="clang-label">{T[lang].show_in}</span>
                            <LangStrip value={outputLang} onChange={setOutputLang} />
                        </div>
                    }>
                        {/* Patient Info */}
                        {result.patient_info && (
                            <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--bg)', borderRadius: '9px', border: '1px solid var(--border)' }}>
                                <div style={{ fontSize: '13px', fontWeight: 700 }}>
                                    {result.patient_info.name} | Age: {result.patient_info.age} | {result.patient_info.date}
                                </div>
                            </div>
                        )}

                        {/* Stats */}
                        {result.stats && (
                            <div className="stats-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '16px' }}>
                                <div className="stat-card green">
                                    <div className="stat-label">Total Tests</div>
                                    <div className="stat-value">{result.stats.total}</div>
                                </div>
                                <div className="stat-card blue">
                                    <div className="stat-label">Normal</div>
                                    <div className="stat-value">{result.stats.normal}</div>
                                </div>
                                <div className="stat-card orange">
                                    <div className="stat-label">Abnormal</div>
                                    <div className="stat-value">{result.stats.abnormal}</div>
                                </div>
                            </div>
                        )}

                        {/* Lab Rows */}
                        {result.classified_values && result.classified_values.length > 0 && (
                            <div className="lab-results">
                                {result.classified_values.map((v, i) => (
                                    <LabRow
                                        key={i}
                                        name={v.test}
                                        val={`${v.value} ${v.unit || ''}`}
                                        range={`${v.benchmark_min ?? ''} - ${v.benchmark_max ?? ''}`}
                                        status={getStatus(v)}
                                    />
                                ))}
                            </div>
                        )}

                        {/* AI Summary */}
                        {result.summary && (
                            <div className={`ai-summary ${outputLang}`} style={{ marginTop: '14px' }}>
                                <div className="ai-header">
                                    <div className="ai-label-text">AI ANALYSIS</div>
                                </div>
                                <div className="ai-text">{result.summary}</div>
                            </div>
                        )}

                        {/* Critical Flags */}
                        {result.critical_flags && result.critical_flags.length > 0 && (
                            <div style={{ marginTop: '12px', padding: '12px', background: 'var(--red-light)', border: '1px solid #f0c5c5', borderRadius: '9px', color: 'var(--red)', fontWeight: 600, fontSize: '11px' }}>
                                🚨 CRITICAL: {result.critical_flags.join(', ')} — Please see a doctor immediately!
                            </div>
                        )}

                        <div className="action-bar" style={{ marginTop: '20px' }}>
                            <Btn icon={Download} variant="primary">{T[lang].btn_download}</Btn>
                            <Btn icon={RefreshCw} variant="secondary" onClick={handleReanalyze}>{T[lang].btn_reanalyze}</Btn>
                            <Btn icon={AlertTriangle} variant="danger">{T[lang].btn_alert_doc}</Btn>
                        </div>
                    </Panel>
                )}
            </div>
        </>
    );
};

export default LabReport;
