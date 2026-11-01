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

export default function PrivacyPolicyPage() {
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
          プライバシーポリシー
        </h1>

        <section style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', borderLeft: '4px solid #2563eb', paddingLeft: '12px', marginBottom: '12px' }}>
            1. 基本方針
          </h2>
          <p style={{ margin: 0, color: '#334155' }}>
            POSheep（以下、「当サイト」といいます）は、利用者の個人情報の取り扱いについて細心の注意を払い、適正な管理と保護に努めます。
          </p>
        </section>

        <section style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', borderLeft: '4px solid #2563eb', paddingLeft: '12px', marginBottom: '12px' }}>
            2. 個人情報の収集と利用目的
          </h2>
          <p style={{ margin: 0, color: '#334155' }}>
            当サイトでは、お問い合わせフォームのご利用時に、お名前やメールアドレスなどの個人情報をご入力いただく場合があります。これらの情報は、お問い合わせに対する回答や必要な情報をご連絡する目的にのみ使用し、それ以外の目的で利用することはありません。
          </p>
        </section>

        <section style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', borderLeft: '4px solid #2563eb', paddingLeft: '12px', marginBottom: '12px' }}>
            3. 広告配信サービスについて（Google AdSense）
          </h2>
          <p style={{ margin: 0, color: '#334155' }}>
            当サイトでは、第三者配信の広告サービス「Google AdSense」を利用する場合があります。Googleなどの第三者配信事業者は、利用者の当サイトや他のウェブサイトへの過去のアクセス情報に基づいて広告を配信するため、Cookie（クッキー）を使用することがあります。<br />
            利用者は、Googleアカウントの広告設定ページから、パーソナライズ広告の無効化を行うことができます。また、Cookieを無効化する設定はお使いのブラウザからも行えます。
          </p>
        </section>

        <section style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', borderLeft: '4px solid #2563eb', paddingLeft: '12px', marginBottom: '12px' }}>
            4. アクセス解析ツールについて
          </h2>
          <p style={{ margin: 0, color: '#334155' }}>
            当サイトでは、利用状況の把握およびサイト改善を目的として、アクセス解析ツールを利用しています。これらのツールはトラフィックデータの収集のためにCookieを使用していますが、データは匿名で収集されており、個人を特定するものではありません。
          </p>
        </section>

        <section style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', borderLeft: '4px solid #2563eb', paddingLeft: '12px', marginBottom: '12px' }}>
            5. レジデータおよび入力情報の取り扱い
          </h2>
          <p style={{ margin: 0, color: '#334155' }}>
            当サイトのレジ機能において入力される商品情報、売上金額、会員番号などの業務データは、利用者の端末内（ブラウザのローカルストレージ）および利用者が任意で設定した外部スプレッドシートにのみ保存されます。当サイトの運営元がそれらの業務データを不正に収集・閲覧・保存することは一切ありません。
          </p>
        </section>

        <section style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', borderLeft: '4px solid #2563eb', paddingLeft: '12px', marginBottom: '12px' }}>
            6. 免責事項
          </h2>
          <p style={{ margin: 0, color: '#334155' }}>
            当サイトに掲載されている情報や提供するツールについて、その正確性や安全性を完全に保証するものではありません。当サイトのご利用によって生じた損害や不利益について、当サイト管理者は一切の責任を負いかねます。
          </p>
        </section>

        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', borderLeft: '4px solid #2563eb', paddingLeft: '12px', marginBottom: '12px' }}>
            7. お問い合わせ先
          </h2>
          <p style={{ margin: 0, color: '#334155' }}>
            当サイトのプライバシーポリシーに関するお問い合わせは、<Link to="/contact" style={{ color: '#2563eb', fontWeight: 'bold' }}>お問い合わせフォーム</Link>よりご連絡ください。
          </p>
          <div style={{ marginTop: '20px', fontSize: '13px', color: '#64748b' }}>
            制定日：2026年10月11日<br />
            最終改定日：2026年11月1日
          </div>
        </section>
      </main>

      <footer style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '32px 20px', textAlign: 'center' }}>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>© POSheep All Rights Reserved.</p>
      </footer>
    </div>
  );
}