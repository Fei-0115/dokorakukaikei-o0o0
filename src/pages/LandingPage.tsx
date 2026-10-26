import { useState, useEffect } from 'react';
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

const WalkingSideSheep = ({ color = '#16a34a', size = 46 }: { color?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0, display: 'block' }}
  >
    <ellipse cx="82" cy="46" rx="6" ry="5" fill={color} opacity="0.85" />
    <circle cx="68" cy="48" r="16" fill={color} />
    <circle cx="50" cy="42" r="18" fill={color} />
    <circle cx="38" cy="50" r="15" fill={color} />
    <circle cx="54" cy="56" r="16" fill={color} />
    <circle cx="68" cy="54" r="14" fill={color} />
    <rect x="33" y="66" width="5" height="18" rx="2.5" fill={color} transform="rotate(8 33 66)" />
    <rect x="44" y="66" width="5" height="18" rx="2.5" fill={color} transform="rotate(-6 44 66)" />
    <rect x="62" y="66" width="5" height="18" rx="2.5" fill={color} transform="rotate(6 62 66)" />
    <rect x="73" y="66" width="5" height="18" rx="2.5" fill={color} transform="rotate(-8 73 66)" />
    <ellipse cx="22" cy="40" rx="10" ry="8" fill="#f8fafc" stroke={color} strokeWidth="3.5" />
    <ellipse cx="28" cy="34" rx="3" ry="7" fill={color} transform="rotate(25 28 34)" />
    <circle cx="18" cy="39" r="2" fill={color} />
    <circle cx="13" cy="42" r="1.5" fill={color} />
    <ellipse cx="24" cy="30" rx="6" ry="4" fill={color} />
  </svg>
);

const CARD_COLORS = [
  { bg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', badge: '#2563eb', text: '#1d4ed8' },
  { bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', badge: '#16a34a', text: '#15803d' },
  { bg: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)', badge: '#ca8a04', text: '#a16207' },
  { bg: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)', badge: '#9333ea', text: '#7e22ce' },
  { bg: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)', badge: '#e11d48', text: '#be123c' },
];

// お知らせのデータ一覧
type NewsEntry = {
  id: string;
  date: string;
  isPinned?: boolean;
  category: '機能追加' | 'お知らせ' | 'アップデート';
  categoryColor: string;
  title: string;
  link?: string;
};

const NEWS_ENTRIES: NewsEntry[] = [
  {
    id: 'n-1',
    date: '2026.10.19',
    isPinned: true,
    category: '機能追加',
    categoryColor: '#fb7185', // やわらかなピンク/赤系
    title: 'Googleスプレッドシートへのリアルタイム全自動連携機能を公開しました。',
    link: '/blog/spreadsheet-gas-tutorial',
  },
  {
    id: 'n-2',
    date: '2026.10.16',
    category: 'お知らせ',
    categoryColor: '#78716c', // シックなグレー系
    title: 'POSheepの公式サイトおよび使い方ガイドページをオープンしました。',
    link: '/blog',
  },
  {
    id: 'n-3',
    date: '2026.10.14',
    category: 'アップデート',
    categoryColor: '#3b82f6', // ブルー系
    title: 'レジ画面のカラーテーマを自由にカスタマイズできる機能を追加しました。',
    link: '/blog/theme-custom-guide',
  },
  {
    id: 'n-4',
    date: '2026.10.11',
    category: 'お知らせ',
    categoryColor: '#78716c',
    title: '小規模店舗・イベント出店向けWebレジツール「POSheep」のテスト提供を開始しました。',
    link: '/app',
  },
  {
    id: 'n-5',
    date: '2026.10.05',
    category: '機能追加',
    categoryColor: '#fb7185',
    title: '誤入力を安全に防ぐ、二重線の修正履歴保存機能を導入しました。',
    link: '/blog/history-edit-guide',
  },
];

export default function LandingPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      color: '#1e293b',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      lineHeight: '2.1',
      letterSpacing: '0.05em',
      textAlign: 'left',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      
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

        .moko-moko-border {
          width: 100%;
          height: 18px;
          background-color: #ffffff;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 16' preserveAspectRatio='none'%3E%3Cpath d='M0,3 Q12.5,15 25,3 Q37.5,15 50,3' fill='none' stroke='%2393c5fd' stroke-width='2.5' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: repeat-x;
          background-size: 48px 18px;
        }

        .horizontal-scroll-container {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding: 8px 4px 24px 4px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }

        .horizontal-scroll-container::-webkit-scrollbar {
          height: 6px;
        }

        .horizontal-scroll-container::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .horizontal-scroll-container::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        .scroll-card {
          flex: 0 0 280px;
          scroll-snap-align: start;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .scroll-card:hover {
          transform: translateY(-4px);
        }

        .news-row-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 8px;
          border-bottom: 1px solid #f1f5f9;
          text-decoration: none;
          color: inherit;
          transition: background-color 0.2s ease, padding-left 0.2s ease;
        }

        .news-row-item:hover {
          background-color: #f8fafc;
          padding-left: 14px;
        }

        .news-row-item:hover .news-title-text {
          text-decoration: underline;
        }

        .back-to-top-btn {
          position: fixed;
          bottom: 28px;
          right: 28px;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background-color: #ffffff;
          border: 2px solid #2563eb;
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
          display: flex;
          flex-direction: column;
          align-items: center;
          justifyContent: center;
          cursor: pointer;
          z-index: 999;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .back-to-top-btn:hover {
          transform: translateY(-5px) scale(1.06);
          box-shadow: 0 12px 26px rgba(37, 99, 235, 0.35);
          background-color: #eff6ff;
        }

        @media (max-width: 640px) {
          .moko-moko-border {
            height: 14px;
            background-size: 36px 14px;
          }
          .scroll-card {
            flex: 0 0 250px;
          }
          .news-row-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
            padding: 14px 4px;
          }
          .news-row-meta {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .back-to-top-btn {
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
          }
        }
      `}</style>

      {/* グローバルナビゲーション */}
      <header style={{ backgroundColor: '#ffffff', padding: '16px 24px 10px 24px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          
          <Link to="/" style={{ textDecoration: 'none', fontSize: '20px', fontWeight: 'bold', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <OctagonSheepLogo color="#2563eb" size={32} />
            <span style={{ letterSpacing: '0.04em' }}>POSheep</span>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 'normal', letterSpacing: '0.05em' }}>| ポシープ</span>
          </Link>

          <nav style={{ display: 'flex', gap: '22px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: '#0f172a', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', letterSpacing: '0.05em' }}>
              ホーム
            </Link>
            <a href="#features" style={{ color: '#475569', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', letterSpacing: '0.05em' }}>
              特長
            </a>
            <a href="#guides" style={{ color: '#475569', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', letterSpacing: '0.05em' }}>
              使い方ガイド
            </a>
            <a href="#news" style={{ color: '#475569', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', letterSpacing: '0.05em' }}>
              お知らせ
            </a>
            <Link to="/blog" style={{ color: '#475569', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', letterSpacing: '0.05em' }}>
              ガイド一覧
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
                gap: '8px',
                boxShadow: '0 2px 6px rgba(15, 23, 42, 0.2)'
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

      {/* ファーストビュー（ミニマル・タイポグラフィヒーロー） */}
      <section style={{
        position: 'relative',
        minHeight: '74vh',
        display: 'flex',
        alignItems: 'center',
        padding: '60px 24px 80px 24px',
        maxWidth: '1200px',
        margin: '0 auto',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 'clamp(90px, 18vw, 220px)',
          fontWeight: '900',
          color: '#f8fafc',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          userSelect: 'none',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          zIndex: 0
        }}>
          POSheep
        </div>

        <div style={{
          position: 'absolute',
          right: '8px',
          bottom: '36px',
          writingMode: 'vertical-rl',
          fontSize: '11px',
          letterSpacing: '0.22em',
          color: '#94a3b8',
          textTransform: 'lowercase',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>|down (scroll)</span>
        </div>

        <div style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '40px'
        }}>
          
          <div style={{ flex: '1 1 420px', minWidth: '280px' }}>
            <h1 style={{
              fontSize: 'clamp(46px, 7vw, 76px)',
              fontWeight: '900',
              color: '#0f172a',
              letterSpacing: '-0.02em',
              margin: '0 0 24px 0',
              lineHeight: '1.08'
            }}>
              Philosophy
            </h1>

            <div style={{ marginTop: '28px' }}>
              <div style={{ fontSize: '15px', color: '#64748b', fontWeight: 'bold', letterSpacing: '0.08em', marginBottom: '8px' }}>
                もっと、スマートにお会計しよう
              </div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>POSheep.</span>
              </div>
            </div>

            <div style={{ marginTop: '36px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link 
                to="/app" 
                style={{ 
                  backgroundColor: '#0f172a', 
                  color: '#ffffff', 
                  padding: '14px 30px', 
                  borderRadius: '30px', 
                  textDecoration: 'none', 
                  fontWeight: 'bold', 
                  fontSize: '15px',
                  letterSpacing: '0.06em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 16px rgba(15, 23, 42, 0.2)'
                }}
              >
                <OctagonSheepLogo color="#ffffff" size={20} />
                今すぐ無料で使う
              </Link>

              <a
                href="#features"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  padding: '14px 26px',
                  borderRadius: '30px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '15px',
                  letterSpacing: '0.06em',
                  border: '1px solid #cbd5e1'
                }}
              >
                特長を見る ↓
              </a>
            </div>
          </div>

          <div style={{
            flex: '1 1 420px',
            minWidth: '280px',
            position: 'relative',
            paddingLeft: '24px'
          }}>
            <div style={{
              position: 'absolute',
              left: 0,
              top: '12px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#0f172a'
            }} />

            <div style={{
              fontSize: '15px',
              color: '#334155',
              lineHeight: '2.3',
              letterSpacing: '0.06em',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <p style={{ margin: 0 }}>専用端末を用意するわずらわしさから、</p>
              <p style={{ margin: 0 }}>小さなお店やイベント出店を自由にしたい。</p>
              <p style={{ margin: 0 }}>だからこそ、高額なレジ機器の当たり前をなくし、</p>
              <p style={{ margin: 0 }}>スマホやPCひとつで、</p>
              <p style={{ margin: 0 }}>すぐに始められる手軽さをかたちにしました。</p>
              <p style={{ margin: 0 }}>売上は自動でスプレッドシートへ。</p>
              <p style={{ margin: 0, fontWeight: 'bold', color: '#0f172a', marginTop: '10px' }}>
                あなたも、お客様も、もっと心地よくなるレジ体験を。
              </p>
            </div>
          </div>

        </div>
      </section>

      <main style={{ maxWidth: '980px', margin: '0 auto', padding: '0 20px 80px 20px', textAlign: 'left' }}>
        
        {/* 特長セクション */}
        <section id="features" style={{ marginBottom: '68px', paddingTop: '40px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '3px solid #2563eb', paddingBottom: '12px', marginBottom: '32px' }}>
            <OctagonSheepLogo color="#2563eb" size={26} />
            <h2 style={{ fontSize: '23px', fontWeight: 'bold', color: '#0f172a', margin: 0, letterSpacing: '0.05em' }}>
              POSheepの主な特長
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', padding: '28px 24px', borderRadius: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', textAlign: 'left' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginTop: 0, marginBottom: '12px', letterSpacing: '0.05em' }}>
                1. 面倒なインストールなしですぐに使えます
              </h3>
              <p style={{ color: '#334155', margin: 0, fontSize: '15px', lineHeight: '2.1', letterSpacing: '0.05em' }}>
                アプリをインストールしたり、専用の端末を購入したりする必要はありません。お手持ちのスマートフォンやパソコンでページを開くだけで、その場ですぐにお会計を始められます。
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', padding: '28px 24px', borderRadius: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', textAlign: 'left' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginTop: 0, marginBottom: '12px', letterSpacing: '0.05em' }}>
                2. Googleスプレッドシートへ自動で記録されます
              </h3>
              <p style={{ color: '#334155', margin: 0, fontSize: '15px', lineHeight: '2.1', letterSpacing: '0.05em' }}>
                お会計の完了ボタンを押すと、日時や商品名、合計金額などのデータがご自身のGoogleスプレッドシートへすぐに転送されます。手書きの集計メモを用意する必要がなくなります。
              </p>
            </div>
          </div>
        </section>

        {/* 使い方ガイド一覧（横スクロールカルーセル） */}
        <section id="guides" style={{ marginBottom: '84px', textAlign: 'left' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px', borderBottom: '2px solid #0f172a', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', margin: 0, letterSpacing: '0.08em' }}>
                GUIDE
              </h2>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500', letterSpacing: '0.05em' }}>
                | 使い方ガイドを順番にご紹介します
              </span>
            </div>
            
            <Link to="/blog" style={{ color: '#0f172a', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
              SHOW MORE →
            </Link>
          </div>

          <div className="horizontal-scroll-container">
            {BLOG_POSTS.map((post, index) => {
              const colorTheme = CARD_COLORS[index % CARD_COLORS.length];
              const stepNumber = String(index + 1).padStart(2, '0');

              return (
                <div key={post.id} className="scroll-card">
                  <Link to={`/blog/${post.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}>
                    
                    <div style={{
                      height: '170px',
                      background: colorTheme.bg,
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      padding: '16px',
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{ position: 'absolute', right: '-12px', bottom: '-12px', opacity: 0.12 }}>
                        <OctagonSheepLogo color={colorTheme.badge} size={110} />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{
                          backgroundColor: '#ffffff',
                          color: colorTheme.badge,
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                          letterSpacing: '0.05em'
                        }}>
                          STEP {stepNumber}
                        </span>
                        
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 'bold',
                          color: colorTheme.text,
                          letterSpacing: '0.04em'
                        }}>
                          {post.category}
                        </span>
                      </div>

                      <div style={{ zIndex: 1 }}>
                        <OctagonSheepLogo color={colorTheme.badge} size={32} />
                      </div>
                    </div>

                    <div style={{ padding: '12px 4px 6px 4px', textAlign: 'left' }}>
                      <h3 style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#0f172a',
                        margin: '0 0 8px 0',
                        lineHeight: '1.5',
                        letterSpacing: '0.03em',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '42px'
                      }}>
                        {post.title}
                      </h3>
                      
                      <div style={{ fontSize: '11px', color: '#94a3b8', letterSpacing: '0.04em' }}>
                        {post.date}
                      </div>
                    </div>

                  </Link>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'right', fontSize: '12px', color: '#94a3b8', marginTop: '4px', letterSpacing: '0.05em' }}>
            ← 横にスクロールしてご覧いただけます →
          </div>

        </section>

        {/* ======================================================== */}
        {/* 画像風デザインの「お知らせ」セクション（一番下に配置） */}
        {/* ======================================================== */}
        <section id="news" style={{ marginBottom: '60px', textAlign: 'left' }}>
          
          {/* 上部ヘッダー（角丸ベージュスクエア + NEWS ラベル） */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{
              display: 'inline-block',
              width: '18px',
              height: '18px',
              borderRadius: '5px',
              backgroundColor: '#d6cec7' // 画像に合わせたベージュスクエア
            }} />
            <span style={{
              fontSize: '13px',
              fontWeight: '700',
              color: '#0f172a',
              letterSpacing: '0.08em'
            }}>
              NEWS
            </span>
          </div>

          {/* 特大の見出し「お知らせ」 */}
          <h2 style={{
            fontSize: 'clamp(36px, 5vw, 48px)',
            fontWeight: '900',
            color: '#0f172a',
            margin: '0 0 32px 0',
            lineHeight: '1.2',
            letterSpacing: '0.02em'
          }}>
            お知らせ
          </h2>

          {/* お知らせリスト一覧 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {NEWS_ENTRIES.map((item) => (
              <Link
                key={item.id}
                to={item.link || '#'}
                className="news-row-item"
              >
                {/* 日付・ピン・バッジを含むメタ情報エリア */}
                <div className="news-row-meta" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                  
                  {/* 日付 */}
                  <span style={{
                    fontFamily: 'monospace, sans-serif',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#334155',
                    minWidth: '94px',
                    letterSpacing: '0.02em'
                  }}>
                    {item.date}
                  </span>

                  {/* ピン留めアイコン（固定記事のみ表示） */}
                  {item.isPinned ? (
                    <span style={{ fontSize: '13px', color: '#0f172a', display: 'flex', alignItems: 'center' }} title="固定記事">
                      📌
                    </span>
                  ) : (
                    <span style={{ width: '13px', display: 'inline-block' }} />
                  )}

                  {/* カテゴリバッジ（角丸長方形） */}
                  <span style={{
                    backgroundColor: item.categoryColor,
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '3px 12px',
                    borderRadius: '4px',
                    textAlign: 'center',
                    minWidth: '78px',
                    boxSizing: 'border-box',
                    letterSpacing: '0.04em'
                  }}>
                    {item.category}
                  </span>
                </div>

                {/* 記事タイトル */}
                <span className="news-title-text" style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1e293b',
                  lineHeight: '1.7',
                  letterSpacing: '0.03em',
                  flex: 1
                }}>
                  {item.title}
                </span>
              </Link>
            ))}
          </div>

          {/* 左下の「お知らせ一覧へ →」リンクボタン */}
          <div style={{ marginTop: '36px' }}>
            <Link
              to="/blog"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                textDecoration: 'none',
                color: '#0f172a',
                fontSize: '14px',
                fontWeight: 'bold',
                letterSpacing: '0.04em'
              }}
            >
              <span>お知らせ一覧へ</span>
              <span style={{
                width: '32px',
                height: '24px',
                backgroundColor: '#0f172a',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                →
              </span>
            </Link>
          </div>

        </section>

      </main>

      {/* 画面下部：歩く羊 */}
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
            <WalkingSideSheep color="#16a34a" size={42} />
          </div>
        </div>
      </div>

      <footer style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '36px 20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <OctagonSheepLogo color="#64748b" size={20} />
          <span style={{ fontWeight: 'bold', color: '#334155', fontSize: '14px', letterSpacing: '0.05em' }}>POSheep（ポシープ）</span>
        </div>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0, letterSpacing: '0.05em' }}>
          © POSheep - Web POS Application All Rights Reserved.
        </p>
      </footer>

      {/* 右下のトップ戻り羊ボタン */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="back-to-top-btn"
          title="トップへ戻る"
          aria-label="トップへ戻る"
        >
          <OctagonSheepLogo color="#2563eb" size={28} />
          <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#2563eb', marginTop: '1px' }}>
            TOP
          </span>
        </button>
      )}

    </div>
  );
}