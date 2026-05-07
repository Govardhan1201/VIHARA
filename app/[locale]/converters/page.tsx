'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function Converters() {
  const [activeTab, setActiveTab] = useState('currency');
  
  // Currency State
  const [amount, setAmount] = useState('100');
  const [currency, setCurrency] = useState('USD');
  const rateToINR = { USD: 83.2, EUR: 89.5, GBP: 104.2 };

  // Weather State
  const [temp, setTemp] = useState('25');
  const [tempUnit, setTempUnit] = useState('C');

  const convertCurrency = () => {
    const rate = rateToINR[currency as keyof typeof rateToINR] || 1;
    return (parseFloat(amount || '0') * rate).toFixed(2);
  };

  const convertTemp = () => {
    const t = parseFloat(temp || '0');
    if (tempUnit === 'C') {
      return ((t * 9/5) + 32).toFixed(1) + ' °F';
    } else {
      return ((t - 32) * 5/9).toFixed(1) + ' °C';
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-12 px-6">
      <Navbar />
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 text-gradient text-center">Travel Converters</h1>
        
        <div className="flex gap-4 mb-8 justify-center">
          <button 
            onClick={() => setActiveTab('currency')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'currency' ? 'bg-primary-600 text-white' : 'glass-effect text-slate-400 hover:text-white'}`}
          >
            Currency
          </button>
          <button 
            onClick={() => setActiveTab('weather')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'weather' ? 'bg-primary-600 text-white' : 'glass-effect text-slate-400 hover:text-white'}`}
          >
            Temperature
          </button>
        </div>

        <div className="glass-effect p-8 rounded-3xl min-h-[300px] flex items-center justify-center">
          {activeTab === 'currency' && (
            <div className="w-full max-w-md space-y-6">
              <h2 className="text-2xl font-bold mb-4 text-center">Convert to INR (₹)</h2>
              <div className="flex gap-4">
                <input 
                  type="number" 
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-primary-500 text-2xl text-center font-bold"
                />
                <select 
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-primary-500 font-bold"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              
              <div className="text-center py-6">
                <span className="text-slate-400 block mb-2">Equals</span>
                <span className="text-5xl font-black text-primary-500 tracking-tight">₹{convertCurrency()}</span>
              </div>
            </div>
          )}

          {activeTab === 'weather' && (
            <div className="w-full max-w-md space-y-6">
              <h2 className="text-2xl font-bold mb-4 text-center">Temperature Converter</h2>
              <div className="flex gap-4">
                <input 
                  type="number" 
                  value={temp}
                  onChange={e => setTemp(e.target.value)}
                  className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-primary-500 text-2xl text-center font-bold"
                />
                <select 
                  value={tempUnit}
                  onChange={e => setTempUnit(e.target.value)}
                  className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-primary-500 font-bold"
                >
                  <option value="C">°C to °F</option>
                  <option value="F">°F to °C</option>
                </select>
              </div>
              
              <div className="text-center py-6">
                <span className="text-slate-400 block mb-2">Equals</span>
                <span className="text-5xl font-black text-primary-500 tracking-tight">{convertTemp()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
