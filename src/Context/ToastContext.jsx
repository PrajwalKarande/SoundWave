import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

let _uid = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timers = useRef({});

    const dismiss = useCallback((id) => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, out: true } : t));
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 340);
        clearTimeout(timers.current[id]);
        delete timers.current[id];
    }, []);

    const push = useCallback((message, type, duration = 3200) => {
        const id = ++_uid;
        // Cap at 4 visible toasts — slice oldest if exceeded
        setToasts(prev => [...prev.slice(-3), { id, message, type, out: false }]);
        timers.current[id] = setTimeout(() => dismiss(id), duration);
        return id;
    }, [dismiss]);

    const success = useCallback((msg, dur) => push(msg, 'success', dur), [push]);
    const error   = useCallback((msg, dur) => push(msg, 'error',   dur), [push]);
    const info    = useCallback((msg, dur) => push(msg, 'info',    dur), [push]);

    return (
        <ToastContext.Provider value={{ success, error, info, dismiss }}>
            {children}
            <div
                aria-live="polite"
                aria-atomic="false"
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    alignItems: 'center',
                    gap: '8px',
                    pointerEvents: 'none',
                }}
            >
                {toasts.map(t => <Toast key={t.id} t={t} onDismiss={dismiss} />)}
            </div>
        </ToastContext.Provider>
    );
}

const STYLES = {
    success: { Icon: CheckCircle2, color: '#06C9E0', glow: 'rgba(6,201,224,0.18)'   },
    error:   { Icon: AlertCircle,  color: '#f87171', glow: 'rgba(248,113,113,0.18)' },
    info:    { Icon: Info,         color: '#8BAABF', glow: 'rgba(139,170,191,0.10)' },
};

function Toast({ t, onDismiss }) {
    const s = STYLES[t.type] || STYLES.info;
    return (
        <div
            style={{
                pointerEvents: 'auto',
                animation: t.out
                    ? 'toast-out 0.32s cubic-bezier(0.4,0,1,1) forwards'
                    : 'toast-in 0.38s cubic-bezier(0.16,1,0.3,1) forwards',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    background: 'rgba(7,13,28,0.96)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: `1px solid ${s.color}28`,
                    borderLeft: `2px solid ${s.color}`,
                    borderRadius: '12px',
                    minWidth: '260px',
                    maxWidth: '400px',
                    boxShadow: `0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03), 0 0 24px ${s.glow}`,
                }}
            >
                <s.Icon size={15} style={{ color: s.color, flexShrink: 0 }} />
                <p style={{
                    flex: 1,
                    fontSize: '13px',
                    fontFamily: "'Outfit', sans-serif",
                    color: '#EFF6FF',
                    fontWeight: 500,
                    lineHeight: 1.45,
                    margin: 0,
                }}>
                    {t.message}
                </p>
                <button
                    onClick={() => onDismiss(t.id)}
                    style={{
                        flexShrink: 0,
                        padding: '2px',
                        borderRadius: '4px',
                        background: 'none',
                        border: 'none',
                        color: '#3A6080',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'color 0.15s',
                    }}
                    aria-label="Dismiss"
                >
                    <X size={12} />
                </button>
            </div>
        </div>
    );
}

export const useToast = () => useContext(ToastContext);
