'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
    }
  }, [isAuthenticated]);

  const fetchSubmissions = async () => {
    const res = await fetch('/api/submissions');
    const data = await res.json();
    setSubmissions(data.submissions || []);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'vihara123') { // Simple auth for demo
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <form onSubmit={handleLogin} className="glass-effect p-8 rounded-3xl w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center text-gradient">Admin Login</h2>
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 mb-6 outline-none focus:border-primary-500"
          />
          <button className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-colors">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-12 px-6">
      <Navbar />
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gradient">Admin Dashboard</h1>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-semibold"
          >
            Logout
          </button>
        </div>
        
        <div className="glass-effect rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-white/10">
                <th className="p-4 text-sm font-semibold text-slate-300">Date</th>
                <th className="p-4 text-sm font-semibold text-slate-300">Name</th>
                <th className="p-4 text-sm font-semibold text-slate-300">Destination</th>
                <th className="p-4 text-sm font-semibold text-slate-300">Status</th>
                <th className="p-4 text-sm font-semibold text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map(sub => (
                <tr key={sub.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-sm text-slate-400">{new Date(sub.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-sm">{sub.name}</td>
                  <td className="p-4 text-sm">{sub.destination}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      sub.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                      sub.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button className="px-3 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 text-xs transition-colors">Approve</button>
                    <button className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 text-xs transition-colors">Reject</button>
                  </td>
                </tr>
              ))}
              {submissions.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">No submissions yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
