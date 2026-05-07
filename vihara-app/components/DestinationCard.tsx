export default function DestinationCard({ dest }: { dest: any }) {
  return (
    <div className="glass-effect rounded-2xl overflow-hidden hover:-translate-y-2 transition-transform duration-300 group">
      <div className="h-48 w-full bg-slate-800 relative overflow-hidden">
        {dest.image ? (
          <img 
            src={dest.image} 
            alt={dest.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500">
            No Image
          </div>
        )}
        <div className="absolute top-4 right-4 px-3 py-1 bg-slate-900/80 backdrop-blur-sm rounded-full text-xs font-semibold text-primary-400">
          {dest.category}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary-400 transition-colors">{dest.name}</h3>
        <p className="text-sm text-slate-400 mb-4 line-clamp-2">{dest.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">
            📍 {dest.location}, {dest.state}
          </span>
          <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">
            ⏱ {dest.duration} days
          </span>
          <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">
            💰 {dest.budget}
          </span>
        </div>
        
        <button className="w-full py-3 bg-white/5 hover:bg-primary-500/20 text-white hover:text-primary-400 rounded-xl transition-colors text-sm font-semibold">
          View Details
        </button>
      </div>
    </div>
  );
}
