'use client';
import Navbar from '@/components/Navbar';

const tips = [
  { title: "Respect Local Culture", desc: "Always research and adhere to the local customs, dress codes, and traditions of the region.", icon: "🙏" },
  { title: "Eco-Friendly Travel", desc: "Carry reusable water bottles, avoid single-use plastics, and leave no trace behind.", icon: "🍃" },
  { title: "Local Cuisine", desc: "Skip the chains and eat where the locals eat. It's safer if you pick busy places with high turnover.", icon: "🍛" },
  { title: "Learn Basic Phrases", desc: "Learning a few local words like 'Hello' and 'Thank you' can open many doors and hearts.", icon: "🗣️" },
  { title: "Public Transport", desc: "Use state transport buses and local trains to experience the true pulse of India.", icon: "🚌" },
  { title: "Travel Insurance", desc: "Always have comprehensive travel insurance that covers emergency medical evacuations.", icon: "🛡️" }
];

export default function Tips() {
  return (
    <main className="min-h-screen pt-24 pb-12 px-6">
      <Navbar />
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-gradient text-center">Travel Tips & Tricks</h1>
        <p className="text-slate-400 text-center max-w-2xl mx-auto mb-12">
          Make your journey across India smooth, safe, and deeply enriching with these essential travel tips.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip, i) => (
            <div key={i} className="glass-effect p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 group">
              <div className="text-4xl mb-6 bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {tip.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary-400 transition-colors">{tip.title}</h3>
              <p className="text-slate-400 leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
