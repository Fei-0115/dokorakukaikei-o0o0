import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blogPosts';

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

// トップページと連動したカード配色プリセット
const CARD_COLORS = [
  { bg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', badge: '#2563eb', text: '#1d4ed8' },
  { bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', badge: '#16a34a', text: '#15803d' },
  { bg: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)', badge: '#ca8a04', text: '#a16207' },
  { bg: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)', badge: '#9333ea', text: '#7e22ce' },
  { bg: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)', badge: '#e11d48', text: '#be123c' },
];

export default function BlogListPage() {
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
      
      <style>{`
        .moko-moko-border {
          width: 100%;
          height: 18px;
          background-color: #ffffff;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 16' preserveAspectRatio='none'%3E%3Cpath d='M0,3 Q12.5,15 25,3 Q37.5,15 50,3' fill='none' stroke='%2393c5fd' stroke-width='2.5' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: repeat-x;
          background-size: 48px 18px;
        }

        .guide-card-item {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .guide-card-item:hover {
          transform: translateY(-4px);
        }

        .guide-card-item:hover .guide-card-title {
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .moko-moko-border {
            height: 14px;
            background-size: 36px 14px;
          }
        }
      `}</style>

      {/* ナビゲーションヘッダー */}
      <header style={{ backgroundColor: '#ffffff', padding: '16px 24px 10px 24px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <Link to="/" style={{ textDecoration: 'none', fontSize: '20px', fontWeight: 'bold', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <OctagonSheepLogo color="#2563eb" size={32} />
            <span style={{ letterSpacing: '0.04em' }}>POSheep</span>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 'normal', letterSpacing: '0.05em' }}>| ポシープ</span>
          </Link>

          <nav style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
            <Link to="/" style={{ color: '#334155', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', letterSpacing: '0.05em' }}>
              トップページ
            </Link>
            <Link 
              to="/app" 
              style={{ 
                backgroundColor: '#0f172a', 
                color: '#ffffff', 
                padding: '8px 18px', 
                borderRadius: '8px', 
                textDecoration: 'none', 
                fontWeight: 'bold', 
                fontSize: '13px',
                letterSpacing: '0.05em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <OctagonSheepLogo color="#ffffff" size={16} />
              レジツールを起動
            </Link>
          </nav>
        </div>
      </header>

      {/* もこもこライン */}
      <div className="moko-moko-border" />

      <main style={{ maxWidth: '1080px', margin: '0 auto', padding: '40px 24px 80px 24px' }}>
        
        {/* トップへ戻るリンク */}
        <div style={{ marginBottom: '24px' }}>
          <Link to="/" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', letterSpacing: '0.05em' }}>
            ← トップページへ戻る
          </Link>
        </div>

        {/* ページ見出し（トップページのGUIDEヘッダーと統一） */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '36px', borderBottom: '2px solid #0f172a', paddingBottom: '16px', flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', margin: 0, letterSpacing: '0.08em' }}>
            GUIDE
          </h1>
          <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500', letterSpacing: '0.05em' }}>
            | 使い方ガイド一覧（順番にご覧いただけます）
          </span>
        </div>

        {/* ガイド一覧グリッド表示（トップページと同じカードビジュアル） */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '28px 22px'
        }}>
          {BLOG_POSTS.map((post, index) => {
            const colorTheme = CARD_COLORS[index % CARD_COLORS.length];
            const stepNumber = String(index + 1).padStart(2, '0');

            return (
              <div key={post.id}>
                <Link to={`/blog/${post.id}`} className="guide-card-item">
                  
                  {/* カード上部：カラーグラデーションバナー ＆ 透かし羊アイコン */}
                  <div style={{
                    height: '180px',
                    background: colorTheme.bg,
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    padding: '18px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* 背景の透かし羊アイコン */}
                    <div style={{ position: 'absolute', right: '-14px', bottom: '-14px', opacity: 0.12 }}>
                      <OctagonSheepLogo color={colorTheme.badge} size={120} />
                    </div>

                    {/* ステップ番号 ＆ カテゴリバッジ */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        backgroundColor: '#ffffff',
                        color: colorTheme.badge,
                        fontSize: '11px',
                        fontWeight: '800',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                        letterSpacing: '0.06em'
                      }}>
                        STEP {stepNumber}
                      </span>
                      
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: colorTheme.text,
                        letterSpacing: '0.04em'
                      }}>
                        {post.category}
                      </span>
                    </div>

                    {/* カード内アイコン */}
                    <div style={{ zIndex: 1 }}>
                      <OctagonSheepLogo color={colorTheme.badge} size={34} />
                    </div>
                  </div>

                  {/* カード下部：タイトル ＆ 日付 */}
                  <div style={{ padding: '14px 4px 6px 4px', textAlign: 'left' }}>
                    <h2 className="guide-card-title" style={{
                      fontSize: '15px',
                      fontWeight: 'bold',
                      color: '#0f172a',
                      margin: '0 0 8px 0',
                      lineHeight: '1.6',
                      letterSpacing: '0.04em',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '48px'
                    }}>
                      {post.title}
                    </h2>
                    
                    <div style={{ fontSize: '12px', color: '#94a3b8', letterSpacing: '0.04em' }}>
                      {post.date}
                    </div>
                  </div>

                </Link>
              </div>
            );
          })}
        </div>
      </main>

      {/* フッター */}
      <footer style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '36px 20px', textAlign: 'center', marginTop: '60px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <OctagonSheepLogo color="#64748b" size={18} />
          <span style={{ fontWeight: 'bold', color: '#334155', fontSize: '13px' }}>POSheep（ポシープ）</span>
        </div>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0, letterSpacing: '0.05em' }}>
          © POSheep - Web POS Application All Rights Reserved.
        </p>
      </footer>

    </div>
  );
}