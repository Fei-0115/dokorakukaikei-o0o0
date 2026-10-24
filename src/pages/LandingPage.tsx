import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blogPosts';

// レジシステムと共通の八角形羊アイコン（正面）
const OctagonSheepLogo = ({ color = '#1e293b', size = 32 }: { color?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}
  >
    <polygon
      points="30,5 70,5 95,30 95,70 70,92 30,92 5,70 5,30"
      stroke={color}
      strokeWidth="4.5"
      fill="none"
      strokeLinejoin="round"
    />
    <path d="M38,91 C38,97 44,97 44,91 Z" stroke={color} strokeWidth="3.5" fill={color} />
    <path d="M56,91 C56,97 62,97 62,91 Z" stroke={color} strokeWidth="3.5" fill={color} />
    <path
      d="M38,40 C32,40 28,46 30,52 C26,56 28,64 34,66 C72,64 74,56 70,52 C72,46 68,40 62,40 C58,34 42,34 38,40 Z"
      stroke={color}
      strokeWidth="3.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M34,42 C20,32 10,46 18,58 C24,66 34,60 30,50 C28,44 22,46 22,50" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <path d="M66,42 C80,32 90,46 82,58 C76,66 66,60 70,50 C72,44 78,46 78,50" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <circle cx="43" cy="51" r="2.5" fill={color} />
    <circle cx="57" cy="51" r="2.5" fill={color} />
    <path d="M50,56 L50,60 M46,63 C48,65 52,65 54,63" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// 最下部を左向きに歩く横向きの羊アイコン
const WalkingSideSheep = ({ color = '#16a34a', size = 46 }: { color?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0, display: 'block' }}
  >
    {/* しっぽ */}
    <ellipse cx="82" cy="46" rx="6" ry="5" fill={color} opacity="0.85" />
    {/* もこもこ胴体 */}
    <circle cx="68" cy="48" r="16" fill={color} />
    <circle cx="50" cy="42" r="18" fill={color} />
    <circle cx="38" cy="50" r="15" fill={color} />
    <circle cx="54" cy="56" r="16" fill={color} />
    <circle cx="68" cy="54" r="14" fill={color} />
    {/* 前後の脚（歩行姿勢） */}
    <rect x="33" y="66" width="5" height="18" rx="2.5" fill={color} transform="rotate(8 33 66)" />
    <rect x="44" y="66" width="5" height="18" rx="2.5" fill={color} transform="rotate(-6 44 66)" />
    <rect x="62" y="66" width="5" height="18" rx="2.5" fill={color} transform="rotate(6 62 66)" />
    <rect x="73" y="66" width="5" height="18" rx="2.5" fill={color} transform="rotate(-8 73 66)" />
    {/* 頭（左向き） */}
    <ellipse cx="22" cy="40" rx="10" ry="8" fill="#f8fafc" stroke={color} strokeWidth="3.5" />
    {/* 羊の耳 */}
    <ellipse cx="28" cy="34" rx="3" ry="7" fill={color} transform="rotate(25 28 34)" />
    {/* 目（左側） */}
    <circle cx="18" cy="39" r="2" fill={color} />
    {/* 鼻 */}
    <circle cx="13" cy="42" r="1.5" fill={color} />
    {/* 頭の上の毛 */}
    <ellipse cx="24" cy="30" rx="6" ry="4" fill={color} />
  </svg>
);

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#111827', fontFamily: 'sans-serif', lineHeight: '1.8', textAlign: 'left', overflowX: 'hidden' }}>
      
      {/* アニメーション用スタイル */}
      <style>{`
        @keyframes walkRightToLeft {
          0% {
            transform: translateX(100vw);
          }
          100% {
            transform: translateX(-120px);
          }
        }
        @keyframes sheepBob {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        @keyframes fluffyCloud {
          0%, 100% {
            border-radius: 28px 36px 32px 40px;
          }
          50% {
            border-radius: 40px 28px 38px 30px;
          }
        }
      `}</style>

      {/* グローバルナビゲーションヘッダー */}
      <header style={{ backgroundColor: '#ffffff', padding: '14px 24px 8px 24px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          
          {/* ロゴエリア */}
          <Link to="/" style={{ textDecoration: 'none', fontSize: '20px', fontWeight: 'bold', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <OctagonSheepLogo color="#2563eb" size={32} />
            <span>POSheep</span>
            <span style={{ fontSize: '13px', color: '#475569', fontWeight: 'normal' }}>| ポシープ</span>
          </Link>

          {/* ナビゲーションリンク */}
          <nav style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: '#0f172a', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
              ホーム
            </Link>
            <a href="#features" style={{ color: '#475569', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
              特長
            </a>
            <a href="#guides" style={{ color: '#475569', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
              使い方ガイド
            </a>
            <Link to="/blog" style={{ color: '#475569', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
              コラム一覧
            </Link>
            <Link 
              to="/app" 
              style={{ 
                backgroundColor: '#2563eb', 
                color: '#ffffff', 
                padding: '8px 18px', 
                borderRadius: '8px', 
                textDecoration: 'none', 
                fontWeight: 'bold', 
                fontSize: '14px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(37,99,235,0.25)'
              }}
            >
              <OctagonSheepLogo color="#ffffff" size={18} />
              レジツールを起動
            </Link>
          </nav>
        </div>
      </header>

      {/* ヘッダー下部の「もこもこ」境界線（スカラップ波型デザイン） */}
      <div style={{ width: '100%', overflow: 'hidden', lineHeight: 0, backgroundColor: '#ffffff' }}>
        <svg
          viewBox="0 0 1200 24"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '18px', display: 'block' }}
        >
          <path
            d="M0,4 Q30,22 60,4 Q90,22 120,4 Q150,22 180,4 Q210,22 240,4 Q270,22 300,4 Q330,22 360,4 Q390,22 420,4 Q450,22 480,4 Q510,22 540,4 Q570,22 600,4 Q630,22 660,4 Q690,22 720,4 Q750,22 780,4 Q810,22 840,4 Q870,22 900,4 Q930,22 960,4 Q990,22 1020,4 Q1050,22 1080,4 Q1110,22 1140,4 Q1170,22 1200,4"
            fill="none"
            stroke="#93c5fd"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '36px 20px 80px 20px', textAlign: 'left' }}>
        
        {/* もこもこクラウド ヒーローセクション */}
        <section style={{
          position: 'relative',
          textAlign: 'center',
          padding: '50px 30px',
          backgroundColor: '#eff6ff',
          border: '2px dashed #93c5fd',
          boxShadow: '0 8px 24px rgba(37, 99, 235, 0.08)',
          marginBottom: '56px',
          animation: 'fluffyCloud 6s ease-in-out infinite',
          overflow: 'hidden'
        }}>
          {/* 背景の装飾アイコン */}
          <div style={{ position: 'absolute', top: '10px', left: '20px', opacity: 0.15 }}>
            <OctagonSheepLogo color="#2563eb" size={80} />
          </div>
          <div style={{ position: 'absolute', bottom: '10px', right: '20px', opacity: 0.15 }}>
            <OctagonSheepLogo color="#2563eb" size={80} />
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', padding: '6px 16px', borderRadius: '20px', border: '1px solid #bfdbfe', marginBottom: '16px' }}>
            <OctagonSheepLogo color="#2563eb" size={20} />
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1d4ed8' }}>無料Web POSレジ「ポシープ」</span>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', marginBottom: '16px', lineHeight: '1.4' }}>
            個人イベント・小規模店舗のための<br />完全無料 Web POSレジシステム
          </h1>
          
          <p style={{ fontSize: '16px', color: '#334155', maxWidth: '640px', margin: '0 auto 32px auto', fontWeight: '500' }}>
            専用端末の購入は不要。スマホやパソコンのブラウザから今すぐ起動！売上データはGoogleスプレッドシートへリアルタイム全自動記録されます。
          </p>

          <Link 
            to="/app" 
            style={{ 
              backgroundColor: '#2563eb', 
              color: '#ffffff', 
              padding: '16px 36px', 
              borderRadius: '12px', 
              textDecoration: 'none', 
              fontWeight: 'bold', 
              fontSize: '18px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
              transition: 'transform 0.2s ease'
            }}
          >
            <OctagonSheepLogo color="#ffffff" size={24} />
            無料でレジツールを使ってみる
          </Link>
        </section>

        {/* 特長セクション */}
        <section id="features" style={{ marginBottom: '56px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '3px solid #2563eb', paddingBottom: '10px', marginBottom: '28px' }}>
            <OctagonSheepLogo color="#2563eb" size={26} />
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
              POSheep（ポシープ）の特長
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', textAlign: 'left' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginTop: 0, marginBottom: '10px', textAlign: 'left' }}>
                1. アプリインストール不要でブラウザから即起動
              </h3>
              <p style={{ color: '#334155', margin: 0, fontSize: '15px', textAlign: 'left' }}>
                高額なPOSレジ端末を購入したり、アプリストアからダウンロードする必要はありません。スマートフォン・タブレット・PCのブラウザからアクセスするだけで、その場でレジとして起動します。
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', textAlign: 'left' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginTop: 0, marginBottom: '10px', textAlign: 'left' }}>
                2. Googleスプレッドシートへの全自動リアルタイム連携
              </h3>
              <p style={{ color: '#334155', margin: 0, fontSize: '15px', textAlign: 'left' }}>
                Google Apps Script（GAS）を活用し、会計ボタンを押した瞬間に設定したGoogleスプレッドシートへ売上データ（日時・商品名・個数・金額など）が全自動で即座に記録されます。
              </p>
            </div>
          </div>
        </section>

        {/* 使い方ガイド一覧セクション */}
        <section id="guides" style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '3px solid #2563eb', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <OctagonSheepLogo color="#2563eb" size={26} />
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
                使い方ガイド
              </h2>
            </div>
            <Link to="/blog" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
              すべてのガイドを見る ➔
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {BLOG_POSTS.map(post => (
              <div key={post.id} style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'left' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 'bold', backgroundColor: '#eff6ff', padding: '4px 8px', borderRadius: '4px', border: '1px solid #bfdbfe' }}>
                    {post.category}
                  </span>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: '12px 0 8px 0', lineHeight: '1.4', textAlign: 'left' }}>
                    <Link to={`/blog/${post.id}`} style={{ color: '#0f172a', textDecoration: 'none' }}>
                      {post.title}
                    </Link>
                  </h3>
                  <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 16px 0', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textAlign: 'left' }}>
                    {post.summary}
                  </p>
                </div>
                <Link to={`/blog/${post.id}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>
                  ガイドを読む ➔
                </Link>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* 画面最下部：横向きの羊が右から左へ歩くレーン（文字なし） */}
      <div style={{
        width: '100%',
        height: '64px',
        backgroundColor: '#f8fafc',
        borderTop: '2px solid #e2e8f0',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          animation: 'walkRightToLeft 14s linear infinite'
        }}>
          <div style={{ animation: 'sheepBob 0.6s ease-in-out infinite' }}>
            <WalkingSideSheep color="#16a34a" size={44} />
          </div>
        </div>
      </div>

      {/* フッター */}
      <footer style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '32px 20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <OctagonSheepLogo color="#64748b" size={20} />
          <span style={{ fontWeight: 'bold', color: '#334155', fontSize: '14px' }}>POSheep（ポシープ）</span>
        </div>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
          © POSheep - Web POS Application All Rights Reserved.
        </p>
      </footer>

    </div>
  );
}