import { useParams, Link } from 'react-router-dom';
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

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const post = BLOG_POSTS.find(p => p.id === id);

  if (!post) {
    return (
      <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '60px 20px', textAlign: 'center', fontFamily: 'sans-serif', color: '#111827' }}>
        <h2>お探しのガイド記事が見つかりませんでした。</h2>
        <Link to="/blog" style={{ color: '#2563eb', fontWeight: 'bold' }}>ガイド一覧へ戻る</Link>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      color: '#0f172a',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      lineHeight: '2.1',
      letterSpacing: '0.05em',
      textAlign: 'left'
    }}>
      
      <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', fontSize: '20px', fontWeight: 'bold', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <OctagonSheepLogo color="#2563eb" size={28} />
            <span style={{ letterSpacing: '0.04em' }}>POSheep</span>
            <span style={{ fontSize: '13px', color: '#475569', fontWeight: 'normal', letterSpacing: '0.05em' }}>| ポシープ</span>
          </Link>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link to="/blog" style={{ color: '#334155', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', letterSpacing: '0.05em' }}>
              ガイド一覧
            </Link>
            <Link 
              to="/app" 
              style={{ 
                backgroundColor: '#2563eb', 
                color: '#ffffff', 
                padding: '8px 16px', 
                borderRadius: '6px', 
                textDecoration: 'none', 
                fontWeight: 'bold', 
                fontSize: '14px',
                letterSpacing: '0.05em'
              }}
            >
              レジを使う
            </Link>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 20px 80px 20px' }}>
        <div style={{ marginBottom: '28px', textAlign: 'left' }}>
          <Link to="/blog" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', letterSpacing: '0.05em' }}>
            ← 使い方ガイド一覧へ戻る
          </Link>
        </div>

        <article style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', padding: '44px 36px', borderRadius: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', textAlign: 'left' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', color: '#1d4ed8', fontWeight: 'bold', backgroundColor: '#eff6ff', padding: '4px 10px', borderRadius: '4px', border: '1px solid #bfdbfe', letterSpacing: '0.05em' }}>
              {post.category}
            </span>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold', letterSpacing: '0.05em' }}>公開日: {post.date}</span>
          </div>

          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '16px 0 28px 0', lineHeight: '1.6', letterSpacing: '0.04em', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px', textAlign: 'left' }}>
            {post.title}
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', fontSize: '16px', color: '#1e293b', fontWeight: '400', textAlign: 'left' }}>
            {post.content.map((section, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
                {section.heading && (
                  <h2 style={{ fontSize: '19px', fontWeight: 'bold', color: '#0f172a', margin: '10px 0 0 0', paddingLeft: '14px', borderLeft: '4px solid #2563eb', lineHeight: '1.5', letterSpacing: '0.04em', textAlign: 'left' }}>
                    {section.heading}
                  </h2>
                )}
                
                <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: '2.2', letterSpacing: '0.06em', textAlign: 'left', color: '#334155' }}>
                  {section.text}
                </p>
              </div>
            ))}
          </div>
        </article>

        {/* ツールへの誘導枠 */}
        <div style={{ marginTop: '48px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', padding: '36px 24px', borderRadius: '16px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '19px', fontWeight: 'bold', color: '#0f172a', marginTop: 0, marginBottom: '12px', letterSpacing: '0.04em', textAlign: 'center' }}>
            無料で今すぐ使えるWebレジアプリ「POSheep」
          </h3>
          <p style={{ fontSize: '15px', color: '#475569', marginBottom: '24px', lineHeight: '2.1', letterSpacing: '0.05em', textAlign: 'center' }}>
            面倒な登録なしで、ブラウザからすぐに起動できます。売上データはご自身のスプレッドシートへ自動で保存されます。
          </p>
          <div style={{ textAlign: 'center' }}>
            <Link 
              to="/app" 
              style={{ 
                backgroundColor: '#2563eb', 
                color: '#ffffff', 
                padding: '14px 32px', 
                borderRadius: '10px', 
                textDecoration: 'none', 
                fontWeight: 'bold', 
                fontSize: '16px',
                letterSpacing: '0.05em',
                display: 'inline-block' 
              }}
            >
              🚀 無料でレジを使ってみる
            </Link>
          </div>
        </div>
      </main>

      <footer style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '36px 20px', textAlign: 'center', marginTop: '60px' }}>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0, letterSpacing: '0.05em' }}>
          © POSheep - Web POS Application All Rights Reserved.
        </p>
      </footer>

    </div>
  );
}