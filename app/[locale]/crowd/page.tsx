import CrowdPredictor from '@/components/CrowdPredictor';
import { getTranslations } from 'next-intl/server';

export default async function CrowdPage() {
  const t = await getTranslations('crowd');

  return (
    <div className="container" style={{ maxWidth: 860, paddingTop: 40, paddingBottom: 80 }}>
      <div className="page-hero" style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🧭</div>
        <h1>{t('title')}</h1>
        <p className="sub">{t('sub')}</p>
      </div>
      <CrowdPredictor />
    </div>
  );
}
