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
// 3. デフォルトの商品・回数券リスト
// ==========================================
const DEFAULT_PRODUCTS: Item[] = [
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

const DEFAULT_TICKETS: Ticket[] = [
  { id: 't1', name: '★大人回数券', amount: 500 },
  { id: 't2', name: '★子供回数券', amount: 300 },
];

export default function App() {
  // 商品リスト・回数券リスト（ローカルストレージ保持）
  const [products, setProducts] = useState<Item[]>(() => {
    const saved = localStorage.getItem('pos_products');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem('pos_tickets');
    return saved ? JSON.parse(saved) : DEFAULT_TICKETS;
  });

  // 設定用メニュー（ドロワー）の開閉フラグ
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // 新規追加用フォームの状態
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState<number | ''>('');
  const [newTicketName, setNewTicketName] = useState('');
  const [newTicketAmount, setNewTicketAmount] = useState<number | ''>('');

  // カート等レジ状態
  const [cart, setCart] = useState<{ item: Item; quantity: number }[]>([]);
  const [appliedTickets, setAppliedTickets] = useState<{ ticket: Ticket; quantity: number }[]>([]);
  const [receivedAmount, setReceivedAmount] = useState<number | ''>('');
  const [memberNumber, setMemberNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // ストレージ保存処理
  useEffect(() => {
    localStorage.setItem('pos_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('pos_tickets', JSON.stringify(tickets));
  }, [tickets]);

  // 時計更新
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
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

  // --- 商品・回数券の追加・削除・並び替え処理 ---
  const handleAddProduct = () => {
    if (!newProdName || newProdPrice === '') return;
    const newItem: Item = {
      id: Date.now().toString(),
      name: newProdName,
      price: Number(newProdPrice),
    };
    setProducts([...products, newItem]);
    setNewProdName('');
    setNewProdPrice('');
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleMoveProduct = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= products.length) return;
    const updated = [...products];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);
    setProducts(updated);
  };

  const handleAddTicket = () => {
    if (!newTicketName || newTicketAmount === '') return;
    const newT: Ticket = {
      id: Date.now().toString(),
      name: newTicketName,
      amount: Number(newTicketAmount),
    };
    setTickets([...tickets, newT]);
    setNewTicketName('');
    setNewTicketAmount('');
  };

  const handleDeleteTicket = (id: string) => {
    setTickets(tickets.filter(t => t.id !== id));
  };

  const handleMoveTicket = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= tickets.length) return;
    const updated = [...tickets];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);
    setTickets(updated);
  };

  const handleResetToDefault = () => {
    if (confirm('商品を初期状態（デフォルト設定）に戻しますか？')) {
      setProducts(DEFAULT_PRODUCTS);
      setTickets(DEFAULT_TICKETS);
      localStorage.removeItem('pos_products');
      localStorage.removeItem('pos_tickets');
    }
  };

  // --- 会計計算 ---
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

    products.forEach((product) => {
      const cartItem = cart.find((c) => c.item.id === product.id);
      payload[product.name] = cartItem ? cartItem.quantity : 0;
    });

    tickets.forEach((ticket) => {
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
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      backgroundColor: '#f3f4f6',
      padding: '12px 16px',
      gap: '12px',
      boxSizing: 'border-box',
    }}>
      
      {/* 最上部：ヘッダー */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '10px 20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        width: '100%',
        boxSizing: 'border-box',
        gap: '12px',
        flexShrink: 0
      }}>
        <button
          onClick={() => setIsMenuOpen(true)}
          title="会計項目を編集"
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#374151',
          }}
        >
          ☰
        </button>

        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
          簡単会計
        </h1>
        
        <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#374151', display: 'flex', gap: '12px', alignItems: 'center', marginLeft: 'auto' }}>
          <span>{formattedDate}</span>
          <span style={{ color: '#2563eb', fontSize: '18px', fontFamily: 'monospace' }}>{formattedTime}</span>
        </div>
      </div>

      {/* メインエリア */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', width: '100%', flex: 1 }}>
        
        {/* 左側：商品・回数券選択 */}
        <div style={{
          flex: '1 1 340px',
          backgroundColor: '#ffffff',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          minWidth: '280px'
        }}>
          <div style={{ flex: 1 }}>
            {/* 会員番号 */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '10px 12px',
              borderRadius: '8px',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <label style={{ fontSize: '15px', fontWeight: 'bold', color: '#334155', whiteSpace: 'nowrap' }}>会員番号:</label>
              <input
                type="text"
                value={memberNumber}
                onChange={(e) => setMemberNumber(e.target.value)}
                placeholder="例: 00123"
                style={{
                  flex: 1,
                  fontSize: '16px',
                  fontWeight: 'bold',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* 商品選択ボタン */}
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', color: '#374151' }}>商品選択</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px', marginBottom: '16px' }}>
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  style={{
                    padding: '10px 12px',
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '8px',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#1f2937' }}>{product.name}</div>
                  <div style={{ color: '#2563eb', fontWeight: 'bold', marginTop: '2px', fontSize: '14px' }}>¥{product.price.toLocaleString()}</div>
                </button>
              ))}
            </div>

            {/* 回数券選択ボタン */}
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', color: '#374151', borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>回数券</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px', marginBottom: '12px' }}>
              {tickets.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => applyTicket(ticket)}
                  style={{
                    padding: '10px 12px',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#166534' }}>{ticket.name}</div>
                  <div style={{ color: '#15803d', fontWeight: 'bold', marginTop: '2px', fontSize: '14px' }}>-¥{ticket.amount.toLocaleString()}</div>
                </button>
              ))}
            </div>
          </div>

          {(cart.length > 0 || appliedTickets.length > 0 || memberNumber !== '') && (
            <button 
              onClick={clearCart}
              style={{
                marginTop: '8px',
                padding: '10px 12px',
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

        {/* 右側：会計内容 */}
        <div style={{
          flex: '1 1 340px',
          backgroundColor: '#111827',
          color: '#ffffff',
          padding: '18px 20px',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
          minWidth: '280px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #374151', paddingBottom: '6px', flexShrink: 0 }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#9ca3af', margin: 0 }}>お会計内容</h2>
              {memberNumber && (
                <span style={{ fontSize: '14px', color: '#60a5fa', fontWeight: 'bold' }}>会員: {memberNumber}</span>
              )}
            </div>

            <div style={{ flex: 1, maxHeight: '200px', overflowY: 'auto', marginBottom: '12px', paddingRight: '4px' }}>
              {cart.length === 0 && appliedTickets.length === 0 ? (
                <div style={{ color: '#6b7280', fontSize: '16px' }}>商品または回数券を選択してください</div>
              ) : (
                <>
                  {cart.map((c) => (
                    <div key={c.item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', marginBottom: '6px' }}>
                      <span>{c.item.name} × {c.quantity}</span>
                      <span>¥{(c.item.price * c.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  {appliedTickets.map((t) => (
                    <div key={t.ticket.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', marginBottom: '6px', color: '#4ade80' }}>
                      <span>【回数券】{t.ticket.name} × {t.quantity}</span>
                      <span>-¥{(t.ticket.amount * t.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div style={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            padding: '14px 16px',
            borderRadius: '8px',
            flexShrink: 0
          }}>
            {totalTicketAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '14px', color: '#4ade80' }}>
                <span>（回数券利用額:</span>
                <span>-¥{totalTicketAmount.toLocaleString()}）</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '18px', color: '#d1d5db' }}>お支払い合計:</span>
              <span style={{ fontSize: '32px', fontWeight: '800', color: '#facc15' }}>
                ¥{totalAmount.toLocaleString()}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '18px', color: '#d1d5db' }}>お預かり（現金）:</span>
              <input
                type="number"
                value={receivedAmount}
                onChange={(e) => setReceivedAmount(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                style={{
                  width: '130px',
                  textAlign: 'right',
                  fontSize: '22px',
                  fontWeight: 'bold',
                  backgroundColor: '#111827',
                  color: '#ffffff',
                  border: '1px solid #4b5563',
                  borderRadius: '6px',
                  padding: '4px 8px'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #374151', paddingTop: '8px' }}>
              <span style={{ fontSize: '18px', color: '#d1d5db' }}>お釣り:</span>
              <span style={{ fontSize: '32px', fontWeight: '800', color: '#4ade80' }}>
                ¥{changeAmount.toLocaleString()}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '12px', flexShrink: 0 }}>
            <button
              onClick={handleCheckout}
              disabled={(cart.length === 0 && totalAmount === 0) || numericReceived < totalAmount}
              style={{
                flex: '1 1 140px',
                padding: '12px 8px',
                backgroundColor: (cart.length > 0 || totalAmount === 0) && numericReceived >= totalAmount ? '#16a34a' : '#374151',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '8px',
                cursor: (cart.length > 0 || totalAmount === 0) && numericReceived >= totalAmount ? 'pointer' : 'not-allowed'
              }}
            >
              1. 会計を完了する
            </button>

            <button
              onClick={handleSendToSpreadsheet}
              disabled={isSubmitting || (cart.length === 0 && appliedTickets.length === 0)}
              style={{
                flex: '1 1 140px',
                padding: '12px 8px',
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

      {/* ========================================== */}
      {/* 左端固定サイドドロワー（両リスト280pxに拡張） */}
      {/* ========================================== */}
      {isMenuOpen && (
        <div 
          onClick={() => setIsMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'flex-start',
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              width: '92%',
              maxWidth: '420px',
              height: '100%',
              boxSizing: 'border-box',
              padding: '20px 16px',
              boxShadow: '4px 0 15px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto'
            }}
          >
            {/* ヘッダー */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', marginBottom: '16px', flexShrink: 0 }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>⚙️ 会計項目の編集</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                style={{ backgroundColor: 'transparent', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#6b7280', padding: '0 4px' }}
              >
                ✕
              </button>
            </div>

            {/* --- 商品一覧の編集 --- */}
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>商品リストの編集</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="商品名 (例: 大人 A)"
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="number"
                  placeholder="価格 (円)"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
                />
                <button
                  onClick={handleAddProduct}
                  style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                >
                  追加
                </button>
              </div>
            </div>

            <div style={{ maxHeight: '280px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '6px', marginBottom: '20px', backgroundColor: '#f8fafc' }}>
              {products.map((p, index) => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff', marginBottom: '4px', borderRadius: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b', flex: 1 }}>{p.name} <span style={{ color: '#2563eb', fontWeight: 'normal' }}>(¥{p.price.toLocaleString()})</span></span>
                  
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <button
                      onClick={() => handleMoveProduct(index, 'up')}
                      disabled={index === 0}
                      style={{ 
                        border: '1px solid #cbd5e1', 
                        backgroundColor: index === 0 ? '#f1f5f9' : '#ffffff', 
                        color: index === 0 ? '#cbd5e1' : '#334155',
                        borderRadius: '4px', 
                        padding: '4px 10px', 
                        cursor: index === 0 ? 'default' : 'pointer', 
                        fontSize: '13px',
                        fontWeight: 'bold',
                      }}
                      title="上へ移動"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => handleMoveProduct(index, 'down')}
                      disabled={index === products.length - 1}
                      style={{ 
                        border: '1px solid #cbd5e1', 
                        backgroundColor: index === products.length - 1 ? '#f1f5f9' : '#ffffff', 
                        color: index === products.length - 1 ? '#cbd5e1' : '#334155',
                        borderRadius: '4px', 
                        padding: '4px 10px', 
                        cursor: index === products.length - 1 ? 'default' : 'pointer', 
                        fontSize: '13px',
                        fontWeight: 'bold',
                      }}
                      title="下へ移動"
                    >
                      ▼
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', padding: '5px 8px', fontSize: '12px', cursor: 'pointer', marginLeft: '4px', fontWeight: 'bold' }}
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* --- 回数券一覧の編集 --- */}
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>値引きリストの編集</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="回数券名 (例: 割引券)"
                value={newTicketName}
                onChange={(e) => setNewTicketName(e.target.value)}
                style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="number"
                  placeholder="割引額 (円)"
                  value={newTicketAmount}
                  onChange={(e) => setNewTicketAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
                />
                <button
                  onClick={handleAddTicket}
                  style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                >
                  追加
                </button>
              </div>
            </div>

            {/* 回数券のスクロールエリアも 280px に拡大 */}
            <div style={{ maxHeight: '280px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '6px', marginBottom: '20px', backgroundColor: '#f8fafc' }}>
              {tickets.map((t, index) => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff', marginBottom: '4px', borderRadius: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#166534', flex: 1 }}>{t.name} <span style={{ color: '#15803d', fontWeight: 'normal' }}>(-¥{t.amount.toLocaleString()})</span></span>
                  
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <button
                      onClick={() => handleMoveTicket(index, 'up')}
                      disabled={index === 0}
                      style={{ 
                        border: '1px solid #cbd5e1', 
                        backgroundColor: index === 0 ? '#f1f5f9' : '#ffffff', 
                        color: index === 0 ? '#cbd5e1' : '#334155',
                        borderRadius: '4px', 
                        padding: '4px 10px', 
                        cursor: index === 0 ? 'default' : 'pointer', 
                        fontSize: '13px',
                        fontWeight: 'bold',
                      }}
                      title="上へ移動"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => handleMoveTicket(index, 'down')}
                      disabled={index === tickets.length - 1}
                      style={{ 
                        border: '1px solid #cbd5e1', 
                        backgroundColor: index === tickets.length - 1 ? '#f1f5f9' : '#ffffff', 
                        color: index === tickets.length - 1 ? '#cbd5e1' : '#334155',
                        borderRadius: '4px', 
                        padding: '4px 10px', 
                        cursor: index === tickets.length - 1 ? 'default' : 'pointer', 
                        fontSize: '13px',
                        fontWeight: 'bold',
                      }}
                      title="下へ移動"
                    >
                      ▼
                    </button>
                    <button
                      onClick={() => handleDeleteTicket(t.id)}
                      style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', padding: '5px 8px', fontSize: '12px', cursor: 'pointer', marginLeft: '4px', fontWeight: 'bold' }}
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* フッター */}
            <div style={{ marginTop: 'auto', borderTop: '1px solid #e5e7eb', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0 }}>
              <button
                onClick={handleResetToDefault}
                style={{ backgroundColor: '#f3f4f6', color: '#4b5563', border: 'none', borderRadius: '6px', padding: '10px', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                初期設定（デフォルト）に戻す
              </button>
              <button
                onClick={() => setIsMenuOpen(false)}
                style={{ backgroundColor: '#1f2937', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
              >
                閉じる
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}