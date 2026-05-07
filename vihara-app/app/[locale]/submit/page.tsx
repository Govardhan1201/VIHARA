'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useTranslations } from 'next-intl';

export default function Submit() {
  const t = useTranslations('Navigation');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    destination: '',
    reason: ''
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', destination: '', reason: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const handleAIAutofill = () => {
    // Mock AI autofill for now, until backend endpoint is ready
    setFormData({
      ...formData,
      destination: 'Ziro Valley, Arunachal Pradesh',
      reason: 'A beautiful valley known for its pine hills and the Apatani tribe, offering a serene escape from city life.'
    });
  };

  return (
    <main className="min-h-screen pt-24 pb-12 px-6">
      <Navbar />
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 text-gradient text-center">Submit a Hidden Gem</h1>
        
        <form onSubmit={handleSubmit} className="glass-effect p-8 rounded-3xl space-y-6">
          <div className="flex justify-end">
            <button 
              type="button" 
              onClick={handleAIAutofill}
              className="text-xs bg-primary-500/20 text-primary-400 px-3 py-1.5 rounded-full hover:bg-primary-500/30 transition-colors flex items-center gap-2"
            >
              ✨ AI Auto-fill Idea
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Your Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Destination Name & Location</label>
            <input 
              type="text" 
              required
              value={formData.destination}
              onChange={e => setFormData({...formData, destination: e.target.value})}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Why is it special?</label>
            <textarea 
              required
              rows={4}
              value={formData.reason}
              onChange={e => setFormData({...formData, reason: e.target.value})}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-primary-500 transition-colors resize-none"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={status === 'submitting'}
            className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-transform transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:transform-none"
          >
            {status === 'submitting' ? 'Submitting...' : 'Submit Destination'}
          </button>
          
          {status === 'success' && (
            <p className="text-primary-400 text-center text-sm font-semibold">Thank you! Your submission is under review.</p>
          )}
          {status === 'error' && (
            <p className="text-red-400 text-center text-sm font-semibold">Something went wrong. Please try again.</p>
          )}
        </form>
      </div>
    </main>
  );
}
