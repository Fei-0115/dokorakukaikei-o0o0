import { useState } from 'react';
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
    <path d="M50,56 L50,60 M46,63 C48,65 52,65 54,63" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round" />
  </svg>
);

const CONTACT_GAS_URL = 'https://script.google.com/macros/s/AKfycby-K4JPPfPLIFzO0wJmv53JV-7G6uSKUaWQEQlVFpNem7ZuucK8Q88464cOc8QyGPMwaw/exec';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) {
      alert('お名前とお問い合わせ内容を入力してください。');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      '日時': new Date().toLocaleString('ja-JP'),
      'お名前': name,
      'メールアドレス': email || '未記入',
      '件名': subject || 'Webフォームより',
      'お問い合わせ内容': message,
    };

    try {
      await fetch(CONTACT_GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });
      setIsSubmitted(true);
    } catch {
      alert('送信中にエラーが発生しました。時間をおいて再度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '48px 24px 80px 24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', borderBottom: '3px solid #2563eb', paddingBottom: '16px', marginBottom: '24px' }}>
          お問い合わせ
        </h1>

        <p style={{ color: '#475569', fontSize: '15px', marginBottom: '32px' }}>
          当サービスに関するご意見、ご要望、不具合の報告、その他ご質問は下記フォームよりお気軽にお送りください。
        </p>

        {isSubmitted ? (
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '32px 24px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>✅</div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#166534', margin: '0 0 12px 0' }}>送信が完了しました</h2>
            <p style={{ color: '#15803d', margin: '0 0 24px 0', fontSize: '14px' }}>お問い合わせいただき誠にありがとうございます。内容を確認のうえ、必要に応じてご連絡いたします。</p>
            <Link to="/" style={{ backgroundColor: '#16a34a', color: '#ffffff', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', display: 'inline-block' }}>
              トップページへ戻る
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>
                お名前 <span style={{ color: '#dc2626' }}>*必須</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例：山田 太郎"
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>
                メールアドレス <span style={{ color: '#64748b', fontSize: '12px', fontWeight: 'normal' }}>（返信が必要な場合）</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="例：example@domain.com"
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>
                件名
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="例：機能の要望について"
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>
                お問い合わせ内容 <span style={{ color: '#dc2626' }}>*必須</span>
              </label>
              <textarea
                required
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="お問い合わせ内容をご入力ください..."
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: '1.8' }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                backgroundColor: isSubmitting ? '#94a3af' : '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '14px 28px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: isSubmitting ? 'wait' : 'pointer',
                marginTop: '10px'
              }}
            >
              {isSubmitting ? '送信中...' : '送信する'}
            </button>
          </form>
        )}
      </main>

      <footer style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '32px 20px', textAlign: 'center' }}>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>© POSheep All Rights Reserved.</p>
      </footer>
    </div>
  );
}