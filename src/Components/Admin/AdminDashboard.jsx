import { useEffect, useState } from 'react';
import { useAuth } from '../../Context/AuthContextProvider';
// import { useNavigate } from 'react-router-dom';
import api from '../../Services/api';
import { motion } from 'framer-motion';
import { Music, Users, Mic2 } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ 
      scale: 1.05, 
      borderColor: "rgba(255, 67, 19, 0.4)",
      backgroundColor: "rgba(31, 41, 55, 0.7)"
    }}
    className="bg-section-bg/50 backdrop-blur-md border border-accent/10 p-8 rounded-2xl flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-default group"
  >
    <div className="p-4 bg-accent/10 rounded-2xl text-accent group-hover:bg-accent/20 transition-colors">
      <Icon size={32} />
    </div>
    <div className="text-center">
      <h3 className="text-4xl font-black text-primary-text tracking-tight">{value}</h3>
      <p className="text-muted-text text-xs font-bold uppercase tracking-[0.2em] mt-1">{title}</p>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ songs: 0, artists: 0, users: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch users count (available)
        const userRes = await api.get('/stats');
        // Setting state - you can add songs and artists counts here if endpoints are available
        setStats({
          users: userRes.data.users,
          songs: userRes.data.songs,
          artists: userRes.data.artists,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-primary-bg w-full rounded-2xl mx-2">
      <nav className="bg-section-bg rounded-2xl shadow-sm max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <h1 className="text-xl font-semibold text-accent">Admin Dashboard</h1>
          <span className="text-primary-text bg-primary-bg/50 px-4 py-1.5 rounded-full border border-accent/10">
            {user?.username} <span className="text-accent font-bold ml-1">ADMIN</span>
          </span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black text-primary-text mb-8">Platform Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Songs" 
            value={stats.songs} 
            icon={Music} 
            delay={0.1} 
          />
          <StatCard 
            title="Artists" 
            value={stats.artists} 
            icon={Mic2} 
            delay={0.2} 
          />
          <StatCard 
            title="Active Users" 
            value={stats.users} 
            icon={Users} 
            delay={0.3} 
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;