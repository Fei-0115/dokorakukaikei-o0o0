import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blogPosts';

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#111827', fontFamily: 'sans-serif', lineHeight: '1.8', textAlign: 'left' }}>
      
      {/* ナビゲーションヘッダー */}
      <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', fontSize: '20px', fontWeight: 'bold', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🐑 POSheep <span style={{ fontSize: '13px', color: '#475569', fontWeight: 'normal' }}>| ポシップ</span>
          </Link>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link to="/blog" style={{ color: '#334155', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
              使い方ガイド一覧
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

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px', textAlign: 'left' }}>
        
        {/* メインヒーローエリア */}
        <section style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', marginBottom: '16px', lineHeight: '1.3' }}>
            個人イベント・小規模店舗のための<br />完全無料 Web POSレジシステム
          </h1>
          <p style={{ fontSize: '16px', color: '#334155', maxWidth: '640px', margin: '0 auto 32px auto', fontWeight: '500' }}>
            専用端末不要。スマホやPCのブラウザから今すぐ使える軽量POSツールです。売上データはGoogleスプレッドシートへリアルタイム全自動記録！
          </p>
          <Link 
            to="/app" 
            style={{ 
              backgroundColor: '#2563eb', 
              color: '#ffffff', 
              padding: '16px 36px', 
              borderRadius: '10px', 
              textDecoration: 'none', 
              fontWeight: 'bold', 
              fontSize: '18px',
              display: 'inline-block',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
            }}
          >
            🚀 無料でレジツールを使ってみる
          </Link>
        </section>

        {/* 使い方ガイド・特長セクション */}
        <section style={{ marginBottom: '56px', textAlign: 'left' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', borderBottom: '3px solid #2563eb', paddingBottom: '10px', marginBottom: '28px', textAlign: 'left' }}>
            📖 POSheepの特長
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', textAlign: 'left' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginTop: 0, marginBottom: '10px', textAlign: 'left' }}>
                3. 開発の背景とこだわり（ストーリー）
              </h3>
              <p style={{ color: '#334155', margin: 0, fontSize: '15px', textAlign: 'left' }}>
                個人イベントやハンドメイドマーケットなどの出店において、「高額なレジを購入するほどではないが、電卓での計算ミスやお釣り間違い、手書きメモでの集計漏れを防ぎたい」という悩みから開発が始まりました。誰でも迷わず直感的に操作できる羊デザインと実用的なデータ連携の両立を追求しています。
              </p>
            </div>
          </div>
        </section>

        {/* 使い方ガイド一覧セクション */}
        <section style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '3px solid #2563eb', paddingBottom: '10px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: 0, textAlign: 'left' }}>
              📖 使い方ガイド
            </h2>
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

      {/* フッター */}
      <footer style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '32px 20px', textAlign: 'center', marginTop: '60px' }}>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
          © POSheep - Web POS Application All Rights Reserved.
        </p>
      </footer>

    </div>
  );
}