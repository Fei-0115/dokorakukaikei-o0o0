import { Link } from 'react-router-dom';

const OctagonSheepLogo = ({ color = '#1e293b', size = 32 }: { color?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}
  >
    <polygon points="30,5 70,5 95,30 95,70 70,92 30,92 5,70 5,30" stroke={color} strokeWidth="4.5" fill="none" strokeLinejoin="round" />
    <path d="M38,91 C38,97 44,97 44,91 Z" stroke={color} strokeWidth="3.5" fill={color} />
    <path d="M56,91 C56,97 62,97 62,91 Z" stroke={color} strokeWidth="3.5" fill={color} />
    <path d="M38,40 C32,40 28,46 30,52 C26,56 28,64 34,66 C72,64 74,56 70,52 C72,46 68,40 62,40 C58,34 42,34 38,40 Z" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M34,42 C20,32 10,46 18,58 C24,66 34,60 30,50 C28,44 22,46 22,50" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <path d="M66,42 C80,32 90,46 82,58 C76,66 66,60 70,50 C72,44 78,46 78,50" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <circle cx="43" cy="51" r="2.5" fill={color} />
    <circle cx="57" cy="51" r="2.5" fill={color} />
    <path d="M50,56 L50,60 M46,63 C48,65 52,65 54,63" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export default function AboutPage() {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      color: '#1e293b',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      lineHeight: '2.1',
      letterSpacing: '0.05em',
      textAlign: 'left'
    }}>
      <header style={{ backgroundColor: '#ffffff', padding: '16px 24px 10px 24px', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', fontSize: '20px', fontWeight: 'bold', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <OctagonSheepLogo color="#2563eb" size={32} />
            <span>POSheep</span>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 'normal' }}>| ポシープ</span>
          </Link>
          <Link to="/" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
            ← ホームへ戻る
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px 80px 24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', borderBottom: '3px solid #2563eb', paddingBottom: '16px', marginBottom: '32px' }}>
          当サイトについて（運営者情報）
        </h1>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', borderLeft: '4px solid #2563eb', paddingLeft: '12px', marginBottom: '12px' }}>
            POSheep（ポシープ）の運営方針
          </h2>
          <p style={{ margin: 0, color: '#334155' }}>
            POSheepは、個人作家様、フリーマーケット出店者様、キッチンカーや小規模店舗を運営される方々に向けて開発された、完全無料のWebレジツールです。<br />
            「高額なレジ機器を買うほどではないけれど、計算間違いを防ぎ、売上データを簡単に整理したい」という現場の想いから生まれました。
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', borderLeft: '4px solid #2563eb', paddingLeft: '12px', marginBottom: '16px' }}>
            運営者概要
          </h2>

          <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', padding: '14px 18px', backgroundColor: '#f8fafc' }}>
              <div style={{ width: '160px', fontWeight: 'bold', color: '#0f172a', flexShrink: 0 }}>サービス名</div>
              <div style={{ color: '#334155' }}>POSheep（ポシープ）</div>
            </div>

            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', padding: '14px 18px' }}>
              <div style={{ width: '160px', fontWeight: 'bold', color: '#0f172a', flexShrink: 0 }}>運営者 / 開発元</div>
              <div style={{ color: '#334155' }}>POSheep 開発プロジェクト</div>
            </div>

            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', padding: '14px 18px', backgroundColor: '#f8fafc' }}>
              <div style={{ width: '160px', fontWeight: 'bold', color: '#0f172a', flexShrink: 0 }}>サイトURL</div>
              <div style={{ color: '#334155' }}>https://posheep.vercel.app</div>
            </div>

            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', padding: '14px 18px' }}>
              <div style={{ width: '160px', fontWeight: 'bold', color: '#0f172a', flexShrink: 0 }}>お問い合わせ</div>
              <div style={{ color: '#334155' }}>
                <Link to="/contact" style={{ color: '#2563eb', fontWeight: 'bold' }}>お問い合わせフォーム</Link> よりご連絡ください
              </div>
            </div>

            <div style={{ display: 'flex', padding: '14px 18px', backgroundColor: '#f8fafc' }}>
              <div style={{ width: '160px', fontWeight: 'bold', color: '#0f172a', flexShrink: 0 }}>事業内容・活動内容</div>
              <div style={{ color: '#334155' }}>
                Webアプリケーションの企画・開発・運営、店舗運営に関する情報発信
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '32px 20px', textAlign: 'center' }}>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>© POSheep All Rights Reserved.</p>
      </footer>
    </div>
  );
}