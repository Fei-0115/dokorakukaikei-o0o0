import { useState, useEffect } from 'react';

// ==========================================
// 1. データ型の定義（商品と回数券の形式）
// ==========================================
type Item = {
  id: string;
  name: string;
  price: number;
};

type Ticket = {
  id: string;
  name: string;
  amount: number;
};

// ==========================================
// 2. Google Apps Script（GAS）連携URL設定
// ==========================================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwyLOy2SO5X9bvR8SBc_uPy1ICbw6D3u_ABkQYRHAEJgNMK3LeNl7EAsvassfClx26CQA/exec';

// ==========================================
// 3. 商品リストの設定
// ==========================================
const PRODUCTS: Item[] = [
 { id: '1', name: '大人 A', price: 1100 },
  { id: '2', name: '大人 B', price: 1000 },
  { id: '3', name: '大人 C', price: 600 },
  { id: '4', name: '大人 D', price: 500 },
  { id: '5', name: '子供 A', price: 600 },
  { id: '6', name: '子供 B', price: 500 }, 
  { id: '7', name: '子供 C', price: 400 },
  { id: '8', name: '子供 D', price: 300 }, 
  { id: '9', name: '大人回数券', price: 2000 },
  { id: '10', name: '子供回数券', price: 1200 }, 
];

// ==========================================
// 4. 回数券リストの設定
// ==========================================
const TICKETS: Ticket[] = [
  { id: 't1', name: '★大人回数券', amount: 500 },
  { id: 't2', name: '★子供回数券', amount: 300 },
];

export default function App() {
  const [cart, setCart] = useState<{ item: Item; quantity: number }[]>([]);
  const [appliedTickets, setAppliedTickets] = useState<{ ticket: Ticket; quantity: number }[]>([]);
  const [receivedAmount, setReceivedAmount] = useState<number | ''>('');
  const [memberNumber, setMemberNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  });
  const formattedTime = currentTime.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const addToCart = (product: Item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === product.id);
      if (existing) {
        return prev.map((c) =>
          c.item.id === product.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { item: product, quantity: 1 }];
    });
  };

  const applyTicket = (ticket: Ticket) => {
    setAppliedTickets((prev) => {
      const existing = prev.find((t) => t.ticket.id === ticket.id);
      if (existing) {
        return prev.map((t) =>
          t.ticket.id === ticket.id ? { ...t, quantity: t.quantity + 1 } : t
        );
      }
      return [...prev, { ticket, quantity: 1 }];
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedTickets([]);
    setReceivedAmount('');
    setMemberNumber('');
  };

  const subtotal = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const totalTicketAmount = appliedTickets.reduce((sum, t) => sum + t.ticket.amount * t.quantity, 0);
  const totalAmount = Math.max(0, subtotal - totalTicketAmount);

  const numericReceived = Number(receivedAmount) || 0;
  const changeAmount = numericReceived >= totalAmount ? numericReceived - totalAmount : 0;

  const handleCheckout = () => {
    if (numericReceived < totalAmount) {
      alert('お預かり金額が不足しています');
      return;
    }
    alert(`お会計のお渡し確認完了！\n\nお釣り: ¥${changeAmount.toLocaleString()}\n\n※続けて「2. シートへ送信」を押して記録を完了してください。`);
  };

  const handleSendToSpreadsheet = async () => {
    if (cart.length === 0 && appliedTickets.length === 0) {
      alert('送信するデータ（商品または回数券）を選択してください');
      return;
    }

    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('ここにURLを貼り付け')) {
      alert('Google Apps ScriptのURLが設定されていません。コードをご確認ください。');
      return;
    }

    setIsSubmitting(true);

    const payload: Record<string, any> = {
      '日時': `${formattedDate} ${formattedTime}`,
      '会員番号': memberNumber || 'なし',
      '小計': subtotal,
      'お支払い合計': totalAmount,
      'お預かり': numericReceived,
      'お釣り': changeAmount,
    };

    PRODUCTS.forEach((product) => {
      const cartItem = cart.find((c) => c.item.id === product.id);
      payload[product.name] = cartItem ? cartItem.quantity : 0;
    });

    TICKETS.forEach((ticket) => {
      const ticketItem = appliedTickets.find((t) => t.ticket.id === ticket.id);
      payload[ticket.name] = ticketItem ? ticketItem.quantity : 0;
    });

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });

      alert('スプレッドシートへの記録が完了しました！データをリセットします。');
      clearCart();
    } catch (error) {
      alert('スプレッドシートへの送信中にエラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: '100%',
      height: '100vh',
      fontFamily: 'sans-serif',
      /* 【色変更】画面全体の背景色 */
      backgroundColor: '#f3f4f6',
      padding: '12px 16px',
      gap: '12px',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      
      {/* 画面最上部：タイトル ＆ 時計バー */}
      <div style={{
        /* 【色変更】最上部バーの背景色 */
        backgroundColor: '#ffffff',
        padding: '10px 24px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        boxSizing: 'border-box',
        flexShrink: 0
      }}>
        {/* 【色変更】店舗タイトルの文字色 */}
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
          ドコラクかいけい
        </h1>
        
        {/* 右上の時計表示エリア */}
        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#374151', display: 'flex', gap: '16px', alignItems: 'center', marginLeft: 'auto' }}>
          {/* 【色変更】日付（年月日）の文字色 */}
          <span style={{ color: '#374151' }}>{formattedDate}</span>
          {/* 【色変更】リアルタイム時計の数字の色 */}
          <span style={{ color: '#2563eb', fontSize: '18px', fontFamily: 'monospace' }}>{formattedTime}</span>
        </div>
      </div>

      {/* メインエリア（左右分割） */}
      <div style={{ display: 'flex', flex: 1, gap: '16px', minHeight: 0, width: '100%' }}>
        
        {/* ---------------------------------- */}
        {/* 左側：操作パネル（商品・回数券選択） */}
        {/* ---------------------------------- */}
        <div style={{
          flex: 1,
          /* 【色変更】左側操作パネルの背景色 */
          backgroundColor: '#ffffff',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          boxSizing: 'border-box',
          minWidth: 0
        }}>
          
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
            
            {/* 会員番号入力ボックス */}
            <div style={{
              /* 【色変更】会員番号入力エリアの背景色 ＆ 枠線色 */
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '10px 12px',
              borderRadius: '8px',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              {/* 【色変更】「会員番号:」の文字色 */}
              <label style={{ fontSize: '15px', fontWeight: 'bold', color: '#334155', whiteSpace: 'nowrap' }}>会員番号:</label>
              <input
                type="text"
                value={memberNumber}
                onChange={(e) => setMemberNumber(e.target.value)}
                placeholder="例: M-00123"
                style={{
                  flex: 1,
                  fontSize: '16px',
                  fontWeight: 'bold',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  /* 【色変更】入力欄の背景色 ＆ 枠線色 ＆ 文字色 */
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a'
                }}
              />
            </div>

            {/* 商品選択ボタンエリア */}
            {/* 【色変更】「商品選択」の見出し文字色 */}
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', color: '#374151' }}>商品選択</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
              {PRODUCTS.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  style={{
                    padding: '10px 12px',
                    /* 【色変更】商品ボタンの背景色 ＆ 枠線色 */
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '8px',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  {/* 【色変更】商品ボタンの商品名文字色 */}
                  <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#1f2937' }}>{product.name}</div>
                  {/* 【色変更】商品ボタンの価格文字色 */}
                  <div style={{ color: '#2563eb', fontWeight: 'bold', marginTop: '2px', fontSize: '14px' }}>¥{product.price.toLocaleString()}</div>
                </button>
              ))}
            </div>

            {/* 回数券選択ボタンエリア */}
            {/* 【色変更】「回数券」の見出し文字色 */}
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', color: '#374151', borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>回数券</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              {TICKETS.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => applyTicket(ticket)}
                  style={{
                    padding: '10px 12px',
                    /* 【色変更】回数券ボタンの背景色 ＆ 枠線色 */
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  {/* 【色変更】回数券ボタンのタイトル文字色 */}
                  <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#166534' }}>{ticket.name}</div>
                  {/* 【色変更】回数券ボタンの割引額文字色 */}
                  <div style={{ color: '#15803d', fontWeight: 'bold', marginTop: '2px', fontSize: '14px' }}>-¥{ticket.amount.toLocaleString()}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 選択クリア（リセット）ボタン */}
          {(cart.length > 0 || appliedTickets.length > 0 || memberNumber !== '') && (
            <button 
              onClick={clearCart}
              style={{
                marginTop: '8px',
                padding: '8px 12px',
                /* 【色変更】「選択をクリア」ボタンの背景色 ＆ 文字色 */
                backgroundColor: '#ef4444',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                width: '100%',
                fontSize: '14px',
                flexShrink: 0
              }}
            >
              選択をクリア（リセット）
            </button>
          )}
        </div>

        {/* ---------------------------------- */}
        {/* 右側：お客さん確認用ディスプレイ  */}
        {/* ---------------------------------- */}
        <div style={{
          flex: 1,
          /* 【色変更】右側ディスプレイ画面の背景色 ＆ 基本文字色 */
          backgroundColor: '#111827',
          color: '#ffffff',
          padding: '18px 20px',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          boxSizing: 'border-box',
          minWidth: 0
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #374151', paddingBottom: '6px', flexShrink: 0 }}>
              {/* 【色変更】「お会計内容」の文字色 */}
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#9ca3af', margin: 0 }}>お会計内容</h2>
              {/* 【色変更】入力された「会員: M-xxxxx」の文字色 */}
              {memberNumber && (
                <span style={{ fontSize: '14px', color: '#60a5fa', fontWeight: 'bold' }}>会員: {memberNumber}</span>
              )}
            </div>

            {/* 明細リスト表示エリア */}
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '12px', paddingRight: '4px' }}>
              {cart.length === 0 && appliedTickets.length === 0 ? (
                /* 【色変更】未選択時の注意案内文字色 */
                <div style={{ color: '#6b7280', fontSize: '16px' }}>商品または回数券を選択してください</div>
              ) : (
                <>
                  {/* 購入商品リスト */}
                  {cart.map((c) => (
                    <div key={c.item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', marginBottom: '6px' }}>
                      <span>{c.item.name} × {c.quantity}</span>
                      <span>¥{(c.item.price * c.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  {/* 適用された回数券リスト */}
                  {appliedTickets.map((t) => (
                    <div key={t.ticket.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', marginBottom: '6px', color: '#4ade80' }}>
                      {/* 【色変更】適用中の回数券明細文字色 */}
                      <span>【回数券】{t.ticket.name} × {t.quantity}</span>
                      <span>-¥{(t.ticket.amount * t.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* 金額計算表示ボックス */}
          <div style={{
            /* 【色変更】金額計算枠の背景色 ＆ 枠線色 */
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            padding: '14px 16px',
            borderRadius: '8px',
            flexShrink: 0
          }}>
            {/* 回数券利用額の割引表示 */}
            {totalTicketAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '14px', color: '#4ade80' }}>
                {/* 【色変更】回数券控除額の文字色 */}
                <span>（回数券利用額:</span>
                <span>-¥{totalTicketAmount.toLocaleString()}）</span>
              </div>
            )}

            {/* お支払い合計 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              {/* 【色変更】「お支払い合計:」ラベル文字色 */}
              <span style={{ fontSize: '18px', color: '#d1d5db' }}>お支払い合計:</span>
              {/* 【色変更】お支払い合計金額の強調表示色（黄色） */}
              <span style={{ fontSize: '34px', fontWeight: '800', color: '#facc15' }}>
                ¥{totalAmount.toLocaleString()}
              </span>
            </div>

            {/* お預かり（現金）入力欄 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              {/* 【色変更】「お預かり（現金）:」ラベル文字色 */}
              <span style={{ fontSize: '18px', color: '#d1d5db' }}>お預かり（現金）:</span>
              <input
                type="number"
                value={receivedAmount}
                onChange={(e) => setReceivedAmount(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                style={{
                  width: '140px',
                  textAlign: 'right',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  /* 【色変更】お預かり入力欄の背景色 ＆ 文字色 ＆ 枠線色 */
                  backgroundColor: '#111827',
                  color: '#ffffff',
                  border: '1px solid #4b5563',
                  borderRadius: '6px',
                  padding: '2px 8px'
                }}
              />
            </div>

            {/* お釣り表示 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #374151', paddingTop: '8px' }}>
              {/* 【色変更】「お釣り:」ラベル文字色 */}
              <span style={{ fontSize: '18px', color: '#d1d5db' }}>お釣り:</span>
              {/* 【色変更】お釣り金額の強調表示色（緑色） */}
              <span style={{ fontSize: '34px', fontWeight: '800', color: '#4ade80' }}>
                ¥{changeAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* 下部アクションボタン */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexShrink: 0 }}>
            {/* ボタン①「1. 会計を完了する」 */}
            <button
              onClick={handleCheckout}
              disabled={(cart.length === 0 && totalAmount === 0) || numericReceived < totalAmount}
              style={{
                flex: 1.2,
                padding: '12px 8px',
                /* 【色変更】「1. 会計を完了する」ボタン有効時／無効時の背景色 */
                backgroundColor: (cart.length > 0 || totalAmount === 0) && numericReceived >= totalAmount ? '#16a34a' : '#374151',
                color: '#ffffff',
                fontSize: '17px',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '8px',
                cursor: (cart.length > 0 || totalAmount === 0) && numericReceived >= totalAmount ? 'pointer' : 'not-allowed'
              }}
            >
              1. 会計を完了する
            </button>

            {/* ボタン②「2. シートへ送信」 */}
            <button
              onClick={handleSendToSpreadsheet}
              disabled={isSubmitting || (cart.length === 0 && appliedTickets.length === 0)}
              style={{
                flex: 1,
                padding: '12px 8px',
                /* 【色変更】「2. シートへ送信」ボタン有効時／送信中／無効時の背景色 */
                backgroundColor: isSubmitting ? '#4b5563' : (cart.length > 0 || appliedTickets.length > 0) ? '#2563eb' : '#374151',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '8px',
                cursor: isSubmitting ? 'wait' : (cart.length > 0 || appliedTickets.length > 0) ? 'pointer' : 'not-allowed'
              }}
            >
              {isSubmitting ? '送信中...' : '2. シートへ送信'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}