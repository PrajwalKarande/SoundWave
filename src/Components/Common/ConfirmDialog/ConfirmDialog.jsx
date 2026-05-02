import './ConfirmDialog.css';

const WarnIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

export default function ConfirmDialog({ title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  return (
    <div className="cd-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="cd-card" role="alertdialog" aria-modal="true" aria-labelledby="cd-title" aria-describedby="cd-msg">
        <div className="cd-icon-wrap">
          <WarnIcon />
        </div>
        <h2 className="cd-title" id="cd-title">{title}</h2>
        <p className="cd-message" id="cd-msg">{message}</p>
        <div className="cd-actions">
          <button className="cd-btn cd-btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="cd-btn cd-btn-confirm" onClick={onConfirm} autoFocus>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
