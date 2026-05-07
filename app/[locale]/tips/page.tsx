const tips = [
  { icon:'📋', title:'Packing Tips', desc:'Pack light and layer your clothes for changing climates. Bring a good camera, portable charger, and don\'t forget comprehensive travel insurance for full peace of mind.' },
  { icon:'💳', title:'Money Matters', desc:'Carry some cash alongside cards — remote destinations may lack card terminals. Inform your bank of travel dates and find local ATM locations before heading out.' },
  { icon:'🏨', title:'Accommodation', desc:'Book well in advance for popular hidden gems. Always read recent reviews and verify authenticity. Local homestays offer the most authentic cultural experience.' },
  { icon:'🚗', title:'Transportation', desc:'Use trusted apps like Ola or Rapido. Negotiate taxi fares upfront and prefer daytime travel for mountain or unfamiliar routes for maximum safety.' },
  { icon:'🍽️', title:'Food Safety', desc:'Eat where locals eat — freshest and most authentic. Stay well-hydrated, especially in hot climates. Carry ORS sachets and water purification tablets for remote trips.' },
  { icon:'📱', title:'Connectivity', desc:'Get a local SIM card for data. Download offline maps on Google Maps before you leave. Always share your daily itinerary with a trusted family member.' },
  { icon:'🌿', title:'Eco Travel', desc:'Leave no trace. Carry a reusable water bottle, say no to single-use plastics, and always respect local wildlife and ecosystems for future generations.' },
  { icon:'🏥', title:'Health & Safety', desc:'Carry a basic first-aid kit. Check vaccination requirements and keep emergency numbers — local police (100), ambulance (108) — saved on your phone.' },
  { icon:'🌦️', title:'Best Seasons', desc:'Research the ideal season before visiting. Monsoons can make some areas inaccessible while revealing beautiful waterfalls; winters unveil snow-capped hill station beauty.' },
];

const emergencyNumbers = [
  { label:'🚓 Police', num:'100' },
  { label:'🚑 Ambulance', num:'108' },
  { label:'🔥 Fire', num:'101' },
  { label:'👩‍⚕️ Women Helpline', num:'1091' },
  { label:'☎️ Emergency', num:'112' },
  { label:'🏥 NDRF', num:'011-24363260' },
];

export default function TipsPage() {
  return (
    <div style={{ maxWidth:1100, margin:'0 auto' }}>
      <div className="page-hero">
        <h1>💡 Travel Tips</h1>
        <p className="tagline">Essential advice for every kind of traveler exploring India</p>
      </div>

      <div className="tips-grid">
        {tips.map((tip,i)=>(
          <div key={i} className="tip-card">
            <div className="tip-icon">{tip.icon}</div>
            <div className="tip-title">{tip.title}</div>
            <p style={{fontSize:'13px',color:'var(--text-muted)',lineHeight:1.75}}>{tip.desc}</p>
          </div>
        ))}
      </div>

      {/* Emergency Numbers */}
      <div style={{ marginTop:'48px' }}>
        <div className="section-title">🆘 Emergency Numbers in India</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'14px' }}>
          {emergencyNumbers.map(({label,num})=>(
            <div key={label} className="glass" style={{ padding:'18px 22px', borderRadius:'var(--r-lg)', display:'flex', justifyContent:'space-between', alignItems:'center', transition:'all var(--dur) var(--ease)' }}>
              <span style={{fontSize:'13px',color:'var(--text-muted)'}}>{label}</span>
              <span style={{fontFamily:'var(--heading)',fontWeight:800,color:'var(--gold)',fontSize:'20px'}}>{num}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Checklist */}
      <div className="glass glass-gold" style={{ marginTop:'36px', padding:'32px', borderRadius:'var(--r-xl)', background:'linear-gradient(135deg,var(--gold-dim),var(--teal-dim))' }}>
        <div className="section-title">✅ Pre-Trip Checklist</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'10px' }}>
          {['Valid ID / Passport / Aadhaar','Book stays & transport in advance','Download offline maps','Pack first-aid essentials','Inform someone of your itinerary','Check weather forecast','Keep emergency numbers saved','Carry sufficient cash','Charge all devices before leaving','Travel insurance policy copy'].map(item=>(
            <div key={item} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px', background:'rgba(255,255,255,0.04)', borderRadius:'var(--r-sm)', border:'1px solid var(--border)', fontSize:'13px', color:'var(--text-muted)' }}>
              <span style={{ color:'var(--gold)', fontSize:'16px' }}>◆</span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
