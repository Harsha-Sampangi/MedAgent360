import React, { useState, useRef } from 'react';
import { UploadCloud, Pill, Loader, Volume2 } from 'lucide-react';
import { T } from '../utils/lang';
import { parsePrescription } from '../utils/api';
import { Panel, Btn, LangStrip } from '../components/UI';

const LANG_MAP = { en: 'English', te: 'Telugu', hi: 'Hindi' };

const Prescription = ({ lang }) => {
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
            const data = await parsePrescription(file, LANG_MAP[outputLang]);
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Parsing failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="section-lang-header">
                <h2 className="section-title">{T[lang].rx_page_title}</h2>
                <Btn icon={UploadCloud} variant="primary" onClick={() => fileRef.current?.click()}>
                    {T[lang].btn_upload_rx_new}
                </Btn>
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleUpload}
                />
            </div>

            <div style={{ maxWidth: '800px' }}>

                {/* Upload Zone */}
                {!result && !loading && !error && (
                    <div className="upload-zone" onClick={() => fileRef.current?.click()}>
                        <UploadCloud size={40} color="var(--blue)" style={{ marginBottom: '9px' }} />
                        <div className="upload-title">{T[lang].upload_rx}</div>
                        <div className="upload-sub">{T[lang].upload_rx_sub}</div>
                        <button className="upload-btn">{T[lang].choose_img}</button>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                        <Loader size={36} color="var(--green)" style={{ animation: 'spin 1s linear infinite' }} />
                        <p style={{ marginTop: '12px', fontSize: '13px', color: 'var(--muted)' }}>
                            🤖 Parsing <strong>{fileName}</strong> with OCR + AI...
                        </p>
                        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div style={{ padding: '16px', background: 'var(--red-light)', border: '1px solid #f0c5c5', borderRadius: '12px', color: 'var(--red)', fontSize: '12px', fontWeight: 600 }}>
                        ❌ {error}
                        <div style={{ marginTop: '10px' }}>
                            <Btn variant="secondary" onClick={() => { setError(null); setResult(null); }}>Try Again</Btn>
                        </div>
                    </div>
                )}

                {/* Result */}
                {result && !loading && (
                    <Panel title={T[lang].instr_title} icon={Pill} action={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="clang-label">{T[lang].explain_in}</span>
                            <LangStrip value={outputLang} onChange={setOutputLang} />
                        </div>
                    }>
                        {/* OCR Info */}
                        {result.ocr_text && (
                            <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--bg)', borderRadius: '9px', border: '1px solid var(--border)' }}>
                                <div style={{ fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--muted)', marginBottom: '4px', letterSpacing: '1px' }}>OCR EXTRACTED TEXT</div>
                                <div style={{ fontSize: '11px', color: 'var(--text)', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                                    {result.ocr_text.substring(0, 300)}{result.ocr_text.length > 300 ? '...' : ''}
                                </div>
                                {result.ocr_confidence && (
                                    <div style={{ marginTop: '6px', fontSize: '9px', color: 'var(--muted)' }}>
                                        Confidence: <strong>{result.ocr_confidence}%</strong>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Medicines List */}
                        {result.medicines && result.medicines.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                                {result.medicines.map((med, i) => (
                                    <div key={i} className="rx-card">
                                        <div className="rx-header">
                                            <div className="rx-medicine">💊 {med.medicine}</div>
                                            <div className="rx-type">{med.dosage || 'N/A'}</div>
                                        </div>
                                        <div className="rx-details">
                                            <div className="rx-detail">
                                                <div className="rx-detail-label">FREQUENCY</div>
                                                <div className="rx-detail-val">{med.frequency || '—'}</div>
                                            </div>
                                            <div className="rx-detail">
                                                <div className="rx-detail-label">TIMING</div>
                                                <div className="rx-detail-val">{med.timing || '—'}</div>
                                            </div>
                                            <div className="rx-detail">
                                                <div className="rx-detail-label">DURATION</div>
                                                <div className="rx-detail-val">{med.duration || '—'}</div>
                                            </div>
                                        </div>
                                        {med.special_notes && (
                                            <div style={{ marginTop: '8px', fontSize: '10px', color: 'var(--orange)', fontWeight: 600 }}>
                                                ⚠️ {med.special_notes}
                                            </div>
                                        )}
                                        {med.translated_instruction && (
                                            <div className={`rx-translation ${outputLang}`}>
                                                <span>💬</span> {med.translated_instruction}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>
                                {result.message || 'No medicines detected. Try a clearer image.'}
                            </div>
                        )}

                        {/* Upload another */}
                        <div className="action-bar" style={{ marginTop: '16px' }}>
                            <Btn variant="secondary" icon={UploadCloud} onClick={() => { setResult(null); setError(null); }}>
                                Upload Another
                            </Btn>
                        </div>
                    </Panel>
                )}
            </div>
        </>
    );
};

export default Prescription;
