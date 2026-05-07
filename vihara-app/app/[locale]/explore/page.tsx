'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import DestinationCard from '@/components/DestinationCard';
import Navbar from '@/components/Navbar';

// Dynamically import map to avoid SSR issues with Leaflet
const Map = dynamic(() => import('@/components/Map'), { ssr: false, loading: () => <div className="h-[400px] w-full bg-slate-900 animate-pulse rounded-2xl flex items-center justify-center text-slate-500">Loading Map...</div> });

export default function Explore() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ category: 'All', budget: 'All' });

  useEffect(() => {
    fetchDestinations();
  }, [filter]);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (filter.category !== 'All') query.append('category', filter.category);
      if (filter.budget !== 'All') query.append('budget', filter.budget);
      
      const res = await fetch(`/api/destinations?${query.toString()}`);
      const data = await res.json();
      setDestinations(data.destinations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-12 px-6">
      <Navbar />
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gradient">Explore India</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-effect p-4 rounded-2xl flex gap-4">
              <select 
                className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm flex-1 outline-none focus:border-primary-500"
                value={filter.category}
                onChange={(e) => setFilter({...filter, category: e.target.value})}
              >
                <option value="All">All Categories</option>
                <option value="Nature">Nature</option>
                <option value="Heritage">Heritage</option>
                <option value="Adventure">Adventure</option>
              </select>
              <select 
                className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm flex-1 outline-none focus:border-primary-500"
                value={filter.budget}
                onChange={(e) => setFilter({...filter, budget: e.target.value})}
              >
                <option value="All">All Budgets</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-80 bg-slate-900 animate-pulse rounded-2xl"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {destinations.map(dest => (
                  <DestinationCard key={dest.id} dest={dest} />
                ))}
                {destinations.length === 0 && (
                  <div className="col-span-2 py-12 text-center text-slate-500 glass-effect rounded-2xl">
                    No destinations found matching your criteria.
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1 h-fit sticky top-24">
            <Map destinations={destinations} />
          </div>
        </div>
      </div>
    </main>
  );
}
