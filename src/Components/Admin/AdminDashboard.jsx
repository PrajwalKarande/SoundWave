import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../Context/AuthContextProvider';
import api from '../../Services/api';
import { motion } from 'framer-motion';
import { Music, Users, Mic2, HardDrive, RefreshCw, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── Platform stat card ───────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, delay, onclick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{
      scale: 1.05,
      borderColor: 'rgba(6, 201, 224, 0.4)',
      backgroundColor: 'rgba(31, 41, 55, 0.7)',
    }}
    className="bg-section-bg/50 backdrop-blur-md border border-accent/10 p-8 rounded-lg flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer group"
    onClick={onclick}
  >
    <div className="p-4 bg-accent/10 rounded-lg text-accent group-hover:bg-accent/20 transition-colors">
      <Icon size={32} />
    </div>
    <div className="text-center">
      <h3 className="text-4xl font-primary-bg text-primary-text tracking-tight">{value}</h3>
      <p className="text-muted-text text-xs font-bold uppercase tracking-[0.2em] mt-1">{title}</p>
    </div>
  </motion.div>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)} GB`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)} MB`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)} KB`;
  return `${n} B`;
};

const fmtOps = (n) => {
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
};

// ─── Animated ring / donut chart ─────────────────────────────────────────────
const RingChart = ({ pct, label, sub }) => {
  const sz = 148;
  const sw = 11;
  const r = (sz - sw) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(pct, 100) / 100);

  return (
    <div className="relative shrink-0" style={{ width: sz, height: sz }}>
      <svg
        width={sz}
        height={sz}
        style={{ transform: 'rotate(-90deg)', position: 'absolute', inset: 0 }}
      >
        <defs>
          <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06C9E0" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <filter id="arcGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <circle
          cx={sz / 2} cy={sz / 2} r={r}
          fill="none"
          stroke="rgba(6,201,224,0.07)"
          strokeWidth={sw}
        />

        {/* Filled arc */}
        <motion.circle
          cx={sz / 2} cy={sz / 2} r={r}
          fill="none"
          stroke="url(#arcGrad)"
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={circ}
          filter="url(#arcGlow)"
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
        />
      </svg>

      {/* Centre label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <span className="text-sm font-bold text-primary-text tabular-nums leading-none">{label}</span>
        <span className="text-[11px] font-mono text-accent/70 leading-none">{sub}</span>
      </div>
    </div>
  );
};

// ─── Single operation bar row ─────────────────────────────────────────────────
const OpBar = ({ label, badge, value, max, gradient, delay, unlimited }) => {
  const pct = unlimited ? 20 : (max > 0 ? Math.min((value / max) * 100, 100) : 0);
  const pctLabel = unlimited ? 'FREE' : (pct < 0.1 ? '< 0.1%' : `${pct.toFixed(1)}%`);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-muted-text/70">
            {label}
          </span>
          <span
            className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold border"
            style={{
              color: badge,
              borderColor: badge + '50',
              background: badge + '14',
            }}
          >
            {pctLabel}
          </span>
        </div>
        <span className="text-sm font-mono font-semibold text-primary-text tabular-nums">
          {fmtOps(value)}
        </span>
      </div>

      <div
        className="h-[5px] rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.04)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: gradient }}
          initial={{ width: 0 }}
          animate={{ width: unlimited ? '20%' : `${pct}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay }}
        />
      </div>

      <p className="text-[9px] text-muted-text/30 mt-1 font-mono">
        {unlimited ? 'Always free · no limit' : `of ${fmtOps(max)} free-tier ops`}
      </p>
    </div>
  );
};

// ─── R2 analytics block ───────────────────────────────────────────────────────
const R2Analytics = ({ data, loading, error, onRetry }) => {
  const FREE_STORAGE = 10 * 1e9;
  const FREE_CLASS_A = 1_000_000;
  const FREE_CLASS_B = 10_000_000;

  let inner;

  if (loading) {
    inner = (
      <div className="flex items-center justify-center gap-3 py-14 text-muted-text">
        <RefreshCw size={14} className="animate-spin text-accent/60" />
        <span className="text-sm">Querying Cloudflare analytics…</span>
      </div>
    );
  } else if (error) {
    inner = (
      <div className="flex items-center justify-center gap-3 py-14">
        <AlertCircle size={14} className="text-rose-400/80" />
        <span className="text-sm text-muted-text/70">{error}</span>
        <button onClick={onRetry} className="text-xs text-accent hover:underline ml-1">
          Retry
        </button>
      </div>
    );
  } else if (data) {
    const bytes      = data.storage?.bytes       ?? 0;
    const objects    = data.storage?.objectCount ?? 0;
    const storagePct = (bytes / FREE_STORAGE) * 100;
    const remaining  = Math.max(FREE_STORAGE - bytes, 0);
    const period     = data.operations?.period;
    const monthLabel = period
      ? new Date(period.start).toLocaleString('default', { month: 'long', year: 'numeric' })
      : '—';

    inner = (
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.05]">

        {/* ── Storage panel ── */}
        <div className="p-6 flex flex-col gap-5">
          <p className="text-[10px] uppercase tracking-[0.22em] font-bold text-muted-text/50">
            Storage usage
          </p>

          <div className="flex items-center gap-6">
            <RingChart
              pct={storagePct}
              label={fmt(bytes)}
              sub={`${storagePct.toFixed(1)}%`}
            />

            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-muted-text/40 mb-0.5">
                  Objects stored
                </p>
                <p className="text-2xl font-bold text-primary-text tabular-nums">
                  {objects.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-muted-text/40 mb-0.5">
                  Remaining
                </p>
                <p className="text-sm font-semibold text-emerald-400">{fmt(remaining)}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-muted-text/40 mb-0.5">
                  Free limit
                </p>
                <p className="text-xs text-muted-text/50">10.00 GB</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Operations panel ── */}
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.22em] font-bold text-muted-text/50">
              Operations
            </p>
            <span className="text-[9px] font-mono text-muted-text/35">{monthLabel}</span>
          </div>

          <div className="flex flex-col gap-5">
            <OpBar
              label="Class A — Writes / Lists"
              badge="#06C9E0"
              value={data.operations?.classA ?? 0}
              max={FREE_CLASS_A}
              gradient="linear-gradient(90deg, #06C9E0 0%, #0284c7 100%)"
              delay={0.55}
            />
            <OpBar
              label="Class B — Reads"
              badge="#818cf8"
              value={data.operations?.classB ?? 0}
              max={FREE_CLASS_B}
              gradient="linear-gradient(90deg, #818cf8 0%, #6366f1 100%)"
              delay={0.7}
            />
          </div>

          <div className="mt-auto pt-4 border-t border-white/[0.05] flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-muted-text/40">
              Total requests
            </span>
            <span className="text-sm font-mono font-bold text-primary-text tabular-nums">
              {fmtOps(data.operations?.total ?? 0)} ops
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.4 }}
      className="bg-section-bg/50 backdrop-blur-md border border-accent/10 rounded-xl overflow-hidden"
    >
      {/* Card header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10 text-accent">
            <HardDrive size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary-text">R2 Storage Analytics</p>
            <p className="text-[11px] text-muted-text/45">Cloudflare R2 · Free tier monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRetry}
            disabled={loading}
            className="p-1.5 rounded-lg text-muted-text/50 hover:text-accent hover:bg-accent/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Refresh"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
          <span className="text-[9px] uppercase tracking-[0.2em] font-bold border border-accent/20 text-accent/55 px-2.5 py-1 rounded-full">
            Live
          </span>
        </div>
      </div>

      {inner}
    </motion.div>
  );
};

// ─── Admin dashboard page ─────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats,     setStats]     = useState({ songs: 0, artists: 0, users: 0 });
  const [r2Data,    setR2Data]    = useState(null);
  const [r2Loading, setR2Loading] = useState(true);
  const [r2Error,   setR2Error]   = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/stats').then((res) => {
      setStats({ users: res.data.users, songs: res.data.songs, artists: res.data.artists });
    }).catch((err) => console.error('Failed to fetch dashboard stats', err));
  }, []);

  const fetchR2 = useCallback(async () => {
    setR2Loading(true);
    setR2Error(null);
    try {
      const res = await api.get('/stats/r2');
      setR2Data(res.data);
    } catch (err) {
      setR2Error(err.response?.data?.message ?? 'Failed to load R2 analytics');
    } finally {
      setR2Loading(false);
    }
  }, []);

  useEffect(() => { fetchR2(); }, [fetchR2]);

  return (
    <div className="min-h-screen bg-primary-bg w-full rounded-lg mx-2">
      <nav className="bg-section-bg rounded-lg shadow-sm max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <h1 className="text-xl font-semibold text-accent">Admin Dashboard</h1>
          <span className="text-primary-text bg-primary-bg/50 px-4 py-1.5 rounded-full border border-accent/10">
            {user?.username}{' '}
            <span className="text-accent font-bold ml-1">ADMIN</span>
          </span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 flex flex-col gap-12">

        {/* Platform overview */}
        <section>
          <h2 className="text-3xl font-primary-bg text-primary-text mb-8">Platform Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Songs"  value={stats.songs}   icon={Music} delay={0.1} onclick={() => navigate('/admin/manage/songs')}   />
            <StatCard title="Artists"      value={stats.artists} icon={Mic2}  delay={0.2} onclick={() => navigate('/admin/manage/artists')} />
            <StatCard title="Active Users" value={stats.users}   icon={Users} delay={0.3} onclick={() => navigate('/admin/manage/users')}   />
          </div>
        </section>

        {/* R2 analytics */}
        <section>
          <h2 className="text-3xl font-primary-bg text-primary-text mb-8">Storage &amp; Operations</h2>
          <R2Analytics
            data={r2Data}
            loading={r2Loading}
            error={r2Error}
            onRetry={fetchR2}
          />
        </section>

      </div>
    </div>
  );
};

export default AdminDashboard;
