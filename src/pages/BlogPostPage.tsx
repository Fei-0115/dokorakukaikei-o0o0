import { useParams, Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blogPosts';

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const post = BLOG_POSTS.find(p => p.id === id);

  if (!post) {
    return (
      <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '60px 20px', textAlign: 'center', fontFamily: 'sans-serif', color: '#111827' }}>
        <h2>お探しのガイド記事が見つかりませんでした。</h2>
        <Link to="/blog" style={{ color: '#2563eb', fontWeight: 'bold' }}>コラム一覧へ戻る</Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#0f172a', fontFamily: 'sans-serif', lineHeight: '1.8', textAlign: 'left' }}>
      
      {/* ナビゲーションヘッダー */}
      <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', fontSize: '20px', fontWeight: 'bold', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🐑 POSheep <span style={{ fontSize: '13px', color: '#475569', fontWeight: 'normal' }}>| ポシップ</span>
          </Link>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link to="/blog" style={{ color: '#334155', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
              コラム一覧
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

      <main style={{ maxWidth: '780px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ marginBottom: '24px', textAlign: 'left' }}>
          <Link to="/blog" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
            ← 使い方ガイド一覧へ戻る
          </Link>
        </div>

        {/* 記事本文枠 */}
        <article style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', padding: '36px 32px', borderRadius: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', textAlign: 'left' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: '#1d4ed8', fontWeight: 'bold', backgroundColor: '#eff6ff', padding: '4px 10px', borderRadius: '4px', border: '1px solid #bfdbfe' }}>
              {post.category}
            </span>
            <span style={{ fontSize: '13px', color: '#475569', fontWeight: 'bold' }}>公開日: {post.date}</span>
          </div>

          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '16px 0 24px 0', lineHeight: '1.4', borderBottom: '2px solid #e2e8f0', paddingBottom: '16px', textAlign: 'left' }}>
            {post.title}
          </h1>

          {/* セクションごとの解説テキスト */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', fontSize: '16px', color: '#0f172a', fontWeight: '400', letterSpacing: '0.02em', textAlign: 'left' }}>
            {post.content.map((section, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                {section.heading && (
                  <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', margin: '8px 0 0 0', paddingLeft: '12px', borderLeft: '4px solid #2563eb', textAlign: 'left' }}>
                    {section.heading}
                  </h2>
                )}
                
                <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.9', textAlign: 'left', color: '#334155' }}>
                  {section.text}
                </p>
              </div>
            ))}
          </div>
        </article>

        {/* ツール起動への誘導枠（中央揃え） */}
        <div style={{ marginTop: '40px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', padding: '28px', borderRadius: '12px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginTop: 0, marginBottom: '8px', textAlign: 'center' }}>
            今すぐ使える無料Web POSレジ「POSheep」
          </h3>
          <p style={{ fontSize: '14px', color: '#334155', marginBottom: '20px', textAlign: 'center' }}>
            インストール・登録不要でブラウザから即起動<br />売上データはスプレッドシートへ簡単連携可能！
          </p>
          <div style={{ textAlign: 'center' }}>
            <Link 
              to="/app" 
              style={{ 
                backgroundColor: '#2563eb', 
                color: '#ffffff', 
                padding: '12px 28px', 
                borderRadius: '8px', 
                textDecoration: 'none', 
                fontWeight: 'bold', 
                fontSize: '16px',
                display: 'inline-block' 
              }}
            >
              🚀 レジツールを使ってみる（無料）
            </Link>
          </div>
        </div>
      </main>

      <footer style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '32px 20px', textAlign: 'center', marginTop: '60px' }}>
        <p style={{ color: '#475569', fontSize: '13px', margin: 0 }}>
          © POSheep - Web POS Application All Rights Reserved.
        </p>
      </footer>

    </div>
  );
}