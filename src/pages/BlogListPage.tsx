import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blogPosts';

export default function BlogListPage() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#111827', fontFamily: 'sans-serif', lineHeight: '1.8', textAlign: 'left' }}>
      
      {/* ナビゲーションヘッダー */}
      <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', fontSize: '20px', fontWeight: 'bold', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
            POSheep <span style={{ fontSize: '13px', color: '#475569', fontWeight: 'normal' }}>| ポシープ</span>
          </Link>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link to="/" style={{ color: '#334155', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
              トップページ
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
                fontSize: '14px' 
              }}
            >
              レジツールを起動
            </Link>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', textAlign: 'left' }}>
        <div style={{ marginBottom: '24px', textAlign: 'left' }}>
          <Link to="/" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
            ← トップページへ戻る
          </Link>
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', borderBottom: '3px solid #2563eb', paddingBottom: '12px', marginBottom: '32px', textAlign: 'left' }}>
          📖 使い方ガイド一覧
        </h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {BLOG_POSTS.map(post => (
            <div 
              key={post.id} 
              style={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #cbd5e1', 
                padding: '24px', 
                borderRadius: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 'bold', backgroundColor: '#eff6ff', padding: '4px 8px', borderRadius: '4px', border: '1px solid #bfdbfe' }}>
                  {post.category}
                </span>
                <span style={{ fontSize: '13px', color: '#64748b' }}>📅 {post.date}</span>
              </div>

              <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '8px 0 12px 0', lineHeight: '1.4', textAlign: 'left' }}>
                <Link to={`/blog/${post.id}`} style={{ color: '#0f172a', textDecoration: 'none' }}>
                  {post.title}
                </Link>
              </h2>

              <p style={{ color: '#334155', fontSize: '15px', margin: '0 0 16px 0', lineHeight: '1.6', textAlign: 'left' }}>
                {post.summary}
              </p>

              <div style={{ textAlign: 'left' }}>
                <Link to={`/blog/${post.id}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', display: 'inline-block' }}>
                  ガイドを読む ➔
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '32px 20px', textAlign: 'center', marginTop: '60px' }}>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
          © POSheep - Web POS Application All Rights Reserved.
        </p>
      </footer>

    </div>
  );
}