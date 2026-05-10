export default function GuidePage() {
  const features = [
    {
      id: 'explore',
      icon: '🌍',
      title: 'Explore India',
      description: 'Discover hidden gems across India using our interactive map.',
      steps: [
        'Select a State from the bubbles at the top.',
        'Select a Sub-Zone or City to narrow down your search.',
        'Use the filters (Activity, Duration, Budget, Transport) to find the perfect spot.',
        'Click on a destination card to view photos, videos, and detailed information.'
      ]
    },
    {
      id: 'story',
      icon: '✨',
      title: 'AI Travel Stories',
      description: 'Turn your travel photos into a cinematic journal using Gemini AI.',
      steps: [
        'Upload your travel photos (drag & drop or click).',
        'Add optional context like where you were and how you felt.',
        'Click "Generate Story" and let our AI craft a personalized narrative.',
        'Copy the story to share with friends or post on social media.'
      ]
    },
    {
      id: 'food',
      icon: '🍛',
      title: 'Local Food Explorer',
      description: 'Find authentic, hyper-local dishes around your destination.',
      steps: [
        'Enter a destination name (e.g., "Araku Valley").',
        'Our AI will find the most authentic local and tribal dishes in that area.',
        'Read descriptions of what makes the food special and where to find it.'
      ]
    },
    {
      id: 'crowd',
      icon: '🧭',
      title: 'Crowd Predictor',
      description: 'Plan your visit to avoid the rush using AI-driven crowd predictions.',
      steps: [
        'Search for a popular destination or hidden gem.',
        'The AI analyzes seasonal trends, local holidays, and current events.',
        'View the crowd score and the best times to visit for peace and quiet.'
      ]
    },
    {
      id: 'converters',
      icon: '💱',
      title: 'Universal Converters',
      description: 'Handy tools for international and local travelers.',
      steps: [
        'Switch between tabs: Currency, Distance, Weight, Temp, Speed, Time.',
        'Type a value into the top field to instantly see conversions.',
        'Use the live time zone viewer to keep track of home and local time.'
      ]
    },
    {
      id: 'submit',
      icon: '✍️',
      title: 'Submit a Gem',
      description: 'Help the community by sharing your own offbeat discoveries.',
      steps: [
        'Fill in the destination details (Name, State, Description).',
        'Use the "Auto-Fill with AI" button if you need help generating descriptions.',
        'Add links to maps and photos.',
        'Submit for admin review to get it featured on the map!'
      ]
    }
  ];

  return (
    <div className="container" style={{ maxWidth: 860, paddingBottom: 80 }}>
      <div className="page-hero">
        <h1 style={{ fontFamily: 'Playfair Display, serif' }}>📖 How It Works</h1>
        <p className="sub">Your complete guide to using the features of VIHARA</p>
      </div>

      <div style={{ display: 'grid', gap: 32 }}>
        {features.map(f => (
          <div key={f.id} className="glass" style={{ padding: '32px', borderRadius: 'var(--r-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, background: 'var(--gold-dim)', border: '1px solid var(--gold-border)', borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                {f.icon}
              </div>
              <div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: 'var(--gold)', margin: 0 }}>{f.title}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '4px 0 0' }}>{f.description}</p>
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '24px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>Step-by-Step Guide</h3>
              <div style={{ display: 'grid', gap: 12 }}>
                {f.steps.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--text-muted)', flexShrink: 0, fontWeight: 700 }}>
                      {i + 1}
                    </div>
                    <span style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ marginTop: 24 }}>
               <a href={`./${f.id}`} className="btn btn-primary btn-sm" style={{ padding: '8px 24px' }}>Try {f.title} →</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
