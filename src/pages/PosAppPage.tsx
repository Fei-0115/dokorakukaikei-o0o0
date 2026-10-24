import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

// ==========================================
// 1. データ型 ＆ テーマの定義
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

type HistoryRecord = {
  id: string;
  dateTime: string;
  memberNumber: string;
  cartItems: { name: string; price: number; quantity: number }[];
  ticketItems: { name: string; amount: number; quantity: number }[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  receivedAmount: number;
  changeAmount: number;
  isEdited?: boolean;
  editedAt?: string;
  oldSummary?: string;
  sentToSheet?: boolean;
};

type NewsItem = {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string[];
};

type ThemeMode = 'light' | 'dark' | 'custom';

type ThemeConfig = {
  name: string;
  bg: string;
  cardBg: string;
  text: string;
  subText: string;
  border: string;
  headerBg: string;
  headerText: string;
  headerTimeColor: string;
  productBg: string;
  productBorder: string;
  productText: string;
  productPrice: string;
  ticketBg: string;
  ticketBorder: string;
  ticketText: string;
  ticketAmount: string;
  cartBg: string;
  cartText: string;
  cartItemBg: string;
  summaryBg: string;
  accentTotal: string;
  accentChange: string;
  quickBtnBg: string;
  quickBtnText: string;
  drawerBg: string;
  drawerText: string;
};

const DEFAULT_THEMES: Record<Exclude<ThemeMode, 'custom'>, ThemeConfig> = {
  light: {
    name: '☀️ ライト（デフォルト）',
    bg: '#f3f4f6',
    cardBg: '#ffffff',
    text: '#1f2937',
    subText: '#4b5563',
    border: '#e5e7eb',
    headerBg: '#ffffff',
    headerText: '#1f2937',
    headerTimeColor: '#2563eb',
    productBg: '#eff6ff',
    productBorder: '#bfdbfe',
    productText: '#1f2937',
    productPrice: '#2563eb',
    ticketBg: '#f0fdf4',
    ticketBorder: '#bbf7d0',
    ticketText: '#166534',
    ticketAmount: '#15803d',
    cartBg: '#111827',
    cartText: '#ffffff',
    cartItemBg: '#1f2937',
    summaryBg: '#1f2937',
    accentTotal: '#facc15',
    accentChange: '#4ade80',
    quickBtnBg: '#374151',
    quickBtnText: '#e5e7eb',
    drawerBg: '#ffffff',
    drawerText: '#1f2937',
  },
  dark: {
    name: '🌙 ダーク',
    bg: '#0f172a',
    cardBg: '#1e293b',
    text: '#f8fafc',
    subText: '#94a3b8',
    border: '#334155',
    headerBg: '#1e293b',
    headerText: '#f8fafc',
    headerTimeColor: '#38bdf8',
    productBg: '#334155',
    productBorder: '#475569',
    productText: '#f8fafc',
    productPrice: '#38bdf8',
    ticketBg: '#064e3b',
    ticketBorder: '#047857',
    ticketText: '#a7f3d0',
    ticketAmount: '#34d399',
    cartBg: '#020617',
    cartText: '#f8fafc',
    cartItemBg: '#0f172a',
    summaryBg: '#0f172a',
    accentTotal: '#fde047',
    accentChange: '#4ade80',
    quickBtnBg: '#1e293b',
    quickBtnText: '#f8fafc',
    drawerBg: '#1e293b',
    drawerText: '#f8fafc',
  },
};

const NEWS_LIST: NewsItem[] = [
  {
    id: 'news-1',
    title: '🚀 POSheep テスト版リリースのお知らせ (v1.0.0-beta)',
    date: '2026/10/11',
    summary: 'Web POSレジアプリ「POSheep（ポシップ）」のテスト版をオープンいたしました。主な新機能や今後の展開についてご覧いただけます。',
    content: [
      'POSheepをご利用いただき誠にありがとうございます。',
      'このたび、個人イベントで気軽に利用できるWeb POSレジアプリ「POSheep（ポシップ）」のテスト版（v1.0.0-beta）をリリースいたしました！',
      '■ 主な実装機能のご案内：',
      '・【会計計算＆クイック入力】手軽に商品を登録し、お釣り計算やクイック現金入力に対応。',
      '・【スプレッドシートリアルタイム連携】Google Apps Script（GAS）を利用した売上データの全自動スプレッドシート記録。',
      '・【会計履歴の確認＆修正】不正防止の観点から打ち消し線（二重線）付きで修正内容を見やすく修正履歴保存が可能、未送信データのまとめ一括送信機能。',
      '・【スマートカスタムテーマ】メインカラーとアクセントカラーを選ぶだけで自動でおしゃれなテーマを作成。',
      '・【デザイン】PCからスマホまで、全画面吸着フィットUIや可愛い羊アニメーション演出。',
      '■ 今後のアップデート予定：',
      'ご不具合のご報告や「こんな機能が欲しい」といったご要望は、メニューの「お問い合わせ」タブよりお気軽にお寄せください。'
    ]
  }
];

function getContrastingTextColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#0f172a' : '#ffffff';
}

function generateSmartCustomTheme(primary: string, secondary: string, customBgColor?: string): ThemeConfig {
  const headerText = getContrastingTextColor(primary);
  const cartText = getContrastingTextColor(secondary);
  const isSecondaryLight = cartText === '#0f172a';

  const backgroundColor = customBgColor || '#ffffff';

  return {
    name: '🎨 オリジナル',
    bg: backgroundColor,
    cardBg: '#ffffff',
    text: '#1f2937',
    subText: '#4b5563',
    border: `${primary}30`,
    headerBg: primary,
    headerText: headerText,
    headerTimeColor: headerText,
    productBg: `${primary}15`,
    productBorder: `${primary}40`,
    productText: '#1f2937',
    productPrice: primary,
    ticketBg: '#ecfdf5',
    ticketBorder: '#6ee7b7',
    ticketText: '#065f46',
    ticketAmount: '#059669',
    cartBg: secondary,
    cartText: cartText,
    cartItemBg: isSecondaryLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.15)',
    summaryBg: isSecondaryLight ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.25)',
    accentTotal: isSecondaryLight ? '#d97706' : '#fde047',
    accentChange: isSecondaryLight ? '#047857' : '#4ade80',
    quickBtnBg: primary,
    quickBtnText: getContrastingTextColor(primary),
    drawerBg: '#ffffff',
    drawerText: '#1f2937',
  };
}

const OctagonSheepLogo = ({ color = '#ffffff', isEating = false, isHappy = false }: { color?: string; isEating?: boolean; isHappy?: boolean }) => (
  <svg
    width="34"
    height="34"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0, display: 'block' }}
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

    {isHappy ? (
      <g>
        <path d="M39,52 Q43,46 47,52" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M53,52 Q57,46 61,52" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>
    ) : (
      <g>
        <circle cx="43" cy="51" r="2.5" fill={color} />
        <circle cx="57" cy="51" r="2.5" fill={color} />
      </g>
    )}

    {isHappy ? (
      <path d="M50,56 L50,59 M44,61 C47,67 53,67 56,61" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />
    ) : (
      <path d="M50,56 L50,60 M46,63 C48,65 52,65 54,63" stroke={color} strokeWidth="3" strokeLinecap="round" />
    )}

    {isEating && (
      <g>
        <path d="M52,62 Q62,64 68,58 M52,62 Q66,68 74,66 M52,62 Q60,72 66,74" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M68,58 Q72,54 70,60 Z" fill="#22c55e" />
        <path d="M74,66 Q78,62 76,68 Z" fill="#22c55e" />
        <path d="M66,74 Q70,72 68,78 Z" fill="#22c55e" />
      </g>
    )}

    {isHappy && (
      <g fill="#facc15">
        <path d="M22,22 L24,27 L29,29 L24,31 L22,36 L20,31 L15,29 L20,27 Z" />
        <path d="M78,22 L80,27 L85,29 L80,31 L78,36 L76,31 L71,29 L76,27 Z" />
      </g>
    )}
  </svg>
);

const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbwyLOy2SO5X9bvR8SBc_uPy1ICbw6D3u_ABkQYRHAEJgNMK3LeNl7EAsvassfClx26CQA/exec';
const CONTACT_GAS_URL = 'https://script.google.com/macros/s/AKfycby-K4JPPfPLIFzO0wJmv53JV-7G6uSKUaWQEQlVFpNem7ZuucK8Q88464cOc8QyGPMwaw/exec';

const SAMPLE_GAS_CODE = `function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  if (sheet.getLastRow() === 0) {
    var headers = Object.keys(data);
    sheet.appendRow(headers);
  }
  
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var row = headers.map(function(header) {
    return data[header] !== undefined ? data[header] : "";
  });
  
  sheet.appendRow(row);
  return ContentService.createTextOutput("Success");
}`;

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

export default function PosAppPage() {
  const [appName, setAppName] = useState<string>(() => {
    return localStorage.getItem('pos_app_name') || 'POSheep';
  });

  const [productSectionTitle, setProductSectionTitle] = useState<string>(() => {
    return localStorage.getItem('pos_prod_section_title') || '商品選択';
  });

  const [ticketSectionTitle, setTicketSectionTitle] = useState<string>(() => {
    return localStorage.getItem('pos_ticket_section_title') || '回数券';
  });

  const [useMemberNumber, setUseMemberNumber] = useState<boolean>(() => {
    const saved = localStorage.getItem('pos_use_member_number');
    return saved ? JSON.parse(saved) : true;
  });

  const [useTickets, setUseTickets] = useState<boolean>(() => {
    const saved = localStorage.getItem('pos_use_tickets');
    return saved ? JSON.parse(saved) : true;
  });

  const [useTax, setUseTax] = useState<boolean>(() => {
    const saved = localStorage.getItem('pos_use_tax');
    return saved ? JSON.parse(saved) : false;
  });

  const [taxRate, setTaxRate] = useState<number>(() => {
    const saved = localStorage.getItem('pos_tax_rate');
    return saved ? Number(saved) : 10;
  });

  const [useSpreadsheet, setUseSpreadsheet] = useState<boolean>(() => {
    const saved = localStorage.getItem('pos_use_spreadsheet');
    return saved ? JSON.parse(saved) : false;
  });

  const [gasUrl, setGasUrl] = useState<string>(() => {
    return localStorage.getItem('pos_gas_url') || DEFAULT_GAS_URL;
  });

  const [showGasGuide, setShowGasGuide] = useState<boolean>(false);

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('pos_theme');
    return (saved as ThemeMode) || 'light';
  });

  const [customPrimary, setCustomPrimary] = useState<string>(() => {
    return localStorage.getItem('pos_custom_primary') || '#27925c';
  });

  const [customSecondary, setCustomSecondary] = useState<string>(() => {
    return localStorage.getItem('pos_custom_secondary') || '#1f2937';
  });

  const [customBgColor, setCustomBgColor] = useState<string>(() => {
    return localStorage.getItem('pos_custom_bg_color') || '#ffffff';
  });

  const t = themeMode === 'custom' 
    ? generateSmartCustomTheme(customPrimary, customSecondary, customBgColor) 
    : DEFAULT_THEMES[themeMode];

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editingInlineItem, setEditingInlineItem] = useState<{ id: string; name: string; price: number; type: 'product' | 'ticket' } | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragType, setDragType] = useState<'product' | 'ticket' | null>(null);

  const [activeTab, setActiveTab] = useState<'items' | 'history' | 'guide' | 'settings' | 'theme' | 'faq' | 'contact' | 'news'>('items');

  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);

  const [showGuidePopup, setShowGuidePopup] = useState<boolean>(true);

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const [expandModalType, setExpandModalType] = useState<'products' | 'tickets' | null>(null);

  const [products, setProducts] = useState<Item[]>(() => {
    const saved = localStorage.getItem('pos_products');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem('pos_tickets');
    return saved ? JSON.parse(saved) : DEFAULT_TICKETS;
  });

  const [historyList, setHistoryList] = useState<HistoryRecord[]>(() => {
    const saved = localStorage.getItem('pos_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [editingRecord, setEditingRecord] = useState<HistoryRecord | null>(null);

  const [showMemberKeypad, setShowMemberKeypad] = useState<boolean>(false);
  const [showCashKeypad, setShowCashKeypad] = useState<boolean>(false);

  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState<number | ''>('');
  const [newTicketName, setNewTicketName] = useState('');
  const [newTicketAmount, setNewTicketAmount] = useState<number | ''>('');

  const [cart, setCart] = useState<{ item: Item; quantity: number }[]>([]);
  const [appliedTickets, setAppliedTickets] = useState<{ ticket: Ticket; quantity: number }[]>([]);
  const [receivedAmount, setReceivedAmount] = useState<number | ''>('');
  const [memberNumber, setMemberNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  const [isDesktop, setIsDesktop] = useState<boolean>(window.innerWidth >= 768);

  useEffect(() => {
    localStorage.setItem('pos_history', JSON.stringify(historyList));
  }, [historyList]);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 両サイドの黒い余白を無くすためのスタイル制御
  useEffect(() => {
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.documentElement.style.width = '100%';

    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.maxWidth = 'none';
    document.body.style.width = '100%';
    document.body.style.overflowX = 'hidden';

    const rootEl = document.getElementById('root');
    if (rootEl) {
      rootEl.style.margin = '0';
      rootEl.style.padding = '0';
      rootEl.style.maxWidth = 'none';
      rootEl.style.width = '100%';
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pos_app_name', appName);
  }, [appName]);

  useEffect(() => {
    localStorage.setItem('pos_prod_section_title', productSectionTitle);
  }, [productSectionTitle]);

  useEffect(() => {
    localStorage.setItem('pos_ticket_section_title', ticketSectionTitle);
  }, [ticketSectionTitle]);

  useEffect(() => {
    localStorage.setItem('pos_use_member_number', JSON.stringify(useMemberNumber));
  }, [useMemberNumber]);

  useEffect(() => {
    localStorage.setItem('pos_use_tickets', JSON.stringify(useTickets));
  }, [useTickets]);

  useEffect(() => {
    localStorage.setItem('pos_use_tax', JSON.stringify(useTax));
  }, [useTax]);

  useEffect(() => {
    localStorage.setItem('pos_tax_rate', taxRate.toString());
  }, [taxRate]);

  useEffect(() => {
    localStorage.setItem('pos_use_spreadsheet', JSON.stringify(useSpreadsheet));
  }, [useSpreadsheet]);

  useEffect(() => {
    localStorage.setItem('pos_gas_url', gasUrl);
  }, [gasUrl]);

  useEffect(() => {
    localStorage.setItem('pos_theme', themeMode);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('pos_custom_primary', customPrimary);
  }, [customPrimary]);

  useEffect(() => {
    localStorage.setItem('pos_custom_secondary', customSecondary);
  }, [customSecondary]);

  useEffect(() => {
    localStorage.setItem('pos_custom_bg_color', customBgColor);
  }, [customBgColor]);

  useEffect(() => {
    localStorage.setItem('pos_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('pos_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('ja-JP', {
    year: isDesktop ? 'numeric' : undefined,
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
  });
  const formattedTime = currentTime.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const saveToHistory = (sentDirectly = false): HistoryRecord => {
    const record: HistoryRecord = {
      id: Date.now().toString(),
      dateTime: `${formattedDate} ${formattedTime}`,
      memberNumber: useMemberNumber ? (memberNumber || 'なし') : '非使用',
      cartItems: cart.map(c => ({ name: c.item.name, price: c.item.price, quantity: c.quantity })),
      ticketItems: appliedTickets.map(t => ({ name: t.ticket.name, amount: t.ticket.amount, quantity: t.quantity })),
      subtotal,
      taxAmount,
      totalAmount,
      receivedAmount: numericReceived,
      changeAmount,
      sentToSheet: sentDirectly,
    };

    setHistoryList((prev) => [record, ...prev]);
    return record;
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactMessage) {
      alert('お名前とお問い合わせ内容を入力してください。');
      return;
    }

    if (!CONTACT_GAS_URL || CONTACT_GAS_URL.trim() === '') {
      alert('お問い合わせ受信用スプレッドシートのURLが未設定です。');
      return;
    }

    setIsContactSubmitting(true);

    const payload = {
      '日時': `${formattedDate} ${formattedTime}`,
      'お名前': contactName,
      'メールアドレス': contactEmail || 'なし',
      '件名': contactSubject || 'なし',
      'お問い合わせ内容': contactMessage,
    };

    try {
      await fetch(CONTACT_GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });

      setSuccessMessage('お問い合わせの送信が完了いたしました！');
      setShowSuccessModal(true);

      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactMessage('');
    } catch (error) {
      alert('お問い合わせの送信中にエラーが発生しました。設定をご確認ください。');
    } finally {
      setIsContactSubmitting(false);
    }
  };

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

  const handleResetAllSettings = () => {
    if (confirm('⚠️ アプリ全体のすべての設定（商品・連携URL・消費税・アプリ名・テーマ・履歴等）を初期化しますか？')) {
      setProducts(DEFAULT_PRODUCTS);
      setTickets(DEFAULT_TICKETS);
      setHistoryList([]);
      setAppName('POSheep');
      setProductSectionTitle('商品選択');
      setTicketSectionTitle('回数券');
      setUseMemberNumber(true);
      setUseTickets(true);
      setUseTax(false);
      setTaxRate(10);
      setUseSpreadsheet(false);
      setGasUrl(DEFAULT_GAS_URL);
      setThemeMode('light');
      setCustomPrimary('#27925c');
      setCustomSecondary('#1f2937');
      setCustomBgColor('#ffffff');

      localStorage.removeItem('pos_products');
      localStorage.removeItem('pos_tickets');
      localStorage.removeItem('pos_history');
      localStorage.removeItem('pos_app_name');
      localStorage.removeItem('pos_prod_section_title');
      localStorage.removeItem('pos_ticket_section_title');
      localStorage.removeItem('pos_use_member_number');
      localStorage.removeItem('pos_use_tickets');
      localStorage.removeItem('pos_use_tax');
      localStorage.removeItem('pos_tax_rate');
      localStorage.removeItem('pos_use_spreadsheet');
      localStorage.removeItem('pos_gas_url');
      localStorage.removeItem('pos_theme');
      localStorage.removeItem('pos_custom_primary');
      localStorage.removeItem('pos_custom_secondary');
      localStorage.removeItem('pos_custom_bg_color');

      alert('すべての設定を初期化しました。');
    }
  };

  const addReceivedAmount = (amount: number) => {
    setReceivedAmount((prev) => (typeof prev === 'number' ? prev + amount : amount));
  };

  const handleMemberKeypadPress = (val: string) => setMemberNumber((prev) => prev + val);
  const handleMemberKeypadBackspace = () => setMemberNumber((prev) => prev.slice(0, -1));
  const handleMemberKeypadClear = () => setMemberNumber('');

  const handleCashKeypadPress = (val: string) => {
    setReceivedAmount((prev) => {
      const currentStr = prev === '' ? '' : prev.toString();
      return Number(currentStr + val);
    });
  };

  const handleCashKeypadBackspace = () => {
    setReceivedAmount((prev) => {
      if (prev === '' || prev === 0) return '';
      const currentStr = prev.toString();
      const newStr = currentStr.slice(0, -1);
      return newStr === '' ? '' : Number(newStr);
    });
  };

  const handleCashKeypadClear = () => setReceivedAmount('');

  const addToCart = (product: Item) => {
    if (isEditMode) return;
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

  const updateCartQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.item.id === id) {
            const newQty = c.quantity + delta;
            return newQty > 0 ? { ...c, quantity: newQty } : null;
          }
          return c;
        })
        .filter(Boolean) as { item: Item; quantity: number }[]
    );
  };

  const removeCartItem = (id: string) => {
    setCart((prev) => prev.filter((c) => c.item.id !== id));
  };

  const applyTicket = (ticket: Ticket) => {
    if (isEditMode) return;
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

  const updateTicketQuantity = (id: string, delta: number) => {
    setAppliedTickets((prev) =>
      prev
        .map((t) => {
          if (t.ticket.id === id) {
            const newQty = t.quantity + delta;
            return newQty > 0 ? { ...t, quantity: newQty } : null;
          }
          return t;
        })
        .filter(Boolean) as { ticket: Ticket; quantity: number }[]
    );
  };

  const removeTicketItem = (id: string) => {
    setAppliedTickets((prev) => prev.filter((t) => t.ticket.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedTickets([]);
    setReceivedAmount('');
    setMemberNumber('');
  };

  const handleSaveInlineEdit = () => {
    if (!editingInlineItem) return;
    if (editingInlineItem.type === 'product') {
      setProducts(prev => prev.map(p => p.id === editingInlineItem.id ? { ...p, name: editingInlineItem.name, price: editingInlineItem.price } : p));
    } else {
      setTickets(prev => prev.map(t => t.id === editingInlineItem.id ? { ...t, name: editingInlineItem.name, amount: editingInlineItem.price } : t));
    }
    setEditingInlineItem(null);
  };

  const handleDragStart = (index: number, type: 'product' | 'ticket') => {
    if (!isEditMode) return;
    setDraggedIndex(index);
    setDragType(type);
  };

  const handleDragOver = (e: React.DragEvent, index: number, type: 'product' | 'ticket') => {
    if (!isEditMode || draggedIndex === null || dragType !== type) return;
    e.preventDefault();
    if (draggedIndex === index) return;

    if (type === 'product') {
      const updated = [...products];
      const [moved] = updated.splice(draggedIndex, 1);
      updated.splice(index, 0, moved);
      setProducts(updated);
    } else {
      const updated = [...tickets];
      const [moved] = updated.splice(draggedIndex, 1);
      updated.splice(index, 0, moved);
      setTickets(updated);
    }
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragType(null);
  };

  const subtotal = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const totalTicketAmount = appliedTickets.reduce((sum, t) => sum + t.ticket.amount * t.quantity, 0);
  
  const rawTotal = Math.max(0, subtotal - totalTicketAmount);
  const taxAmount = useTax ? Math.round(rawTotal * (taxRate / 100)) : 0;
  const totalAmount = useTax ? rawTotal + taxAmount : rawTotal;

  const numericReceived = Number(receivedAmount) || 0;
  const changeAmount = numericReceived >= totalAmount ? numericReceived - totalAmount : 0;

  const handleCheckoutOnly = () => {
    if (numericReceived < totalAmount) {
      alert('お預かり金額が不足しています');
      return;
    }
    saveToHistory(false);
    setSuccessMessage(`お会計が完了いたしました！\nお釣り: ¥${changeAmount.toLocaleString()}\n（会計履歴へ保存されました）`);
    setShowSuccessModal(true);
    clearCart();
  };

  const handleCheckoutStep1 = () => {
    if (numericReceived < totalAmount) {
      alert('お預かり金額が不足しています');
      return;
    }
    saveToHistory(false);
    setSuccessMessage(`お会計のお渡し確認完了いたしました！\nお釣り: ¥${changeAmount.toLocaleString()}\n\n※続けて「2. シートへ送信」を押してください。`);
    setShowSuccessModal(true);
  };

  const sendSingleRecordToSheet = async (record: HistoryRecord) => {
    if (!gasUrl || gasUrl.trim() === '') {
      throw new Error('スプレッドシートURLが未設定です。');
    }

    const payload: Record<string, any> = {
      '日時': record.dateTime,
      '会員番号': record.memberNumber,
      '小計': record.subtotal,
      [`消費税(${taxRate}%)`]: record.taxAmount,
      'お支払い合計': record.totalAmount,
      'お預かり': record.receivedAmount,
      'お釣り': record.changeAmount,
      '備考': record.isEdited ? `修正済(${record.editedAt})` : '新規',
    };

    products.forEach((product) => {
      const cartItem = record.cartItems.find((c) => c.name === product.name);
      payload[product.name] = cartItem ? cartItem.quantity : 0;
    });

    if (useTickets) {
      tickets.forEach((ticket) => {
        const ticketItem = record.ticketItems.find((t) => t.name === ticket.name);
        payload[ticket.name] = ticketItem ? ticketItem.quantity : 0;
      });
    }

    await fetch(gasUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload),
    });
  };

  const handleSendToSpreadsheet = async () => {
    if (cart.length === 0 && appliedTickets.length === 0) {
      alert('送信するデータ（商品または回数券）を選択してください');
      return;
    }

    if (!gasUrl || gasUrl.trim() === '') {
      alert('送信先のスプレッドシートURL（GAS URL）が設定されていません。アプリ設定から設定してください。');
      return;
    }

    setIsSubmitting(true);
    const newRecord = saveToHistory(true);

    try {
      await sendSingleRecordToSheet(newRecord);
      setSuccessMessage('スプレッドシートへの記録が正常に完了いたしました！');
      setShowSuccessModal(true);
      clearCart();
    } catch (error) {
      alert('スプレッドシートへの送信中にエラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkSendToSpreadsheet = async () => {
    if (historyList.length === 0) {
      alert('送信対象の履歴が存在しません。');
      return;
    }

    if (!gasUrl || gasUrl.trim() === '') {
      alert('送信先のスプレッドシートURLが未設定です。');
      return;
    }

    setIsSubmitting(true);

    try {
      for (const rec of historyList) {
        await sendSingleRecordToSheet(rec);
      }

      setHistoryList((prev) => prev.map(rec => ({ ...rec, sentToSheet: true })));
      setSuccessMessage(`${historyList.length}件の履歴データをまとめてスプレッドシートへ送信完了いたしました！`);
      setShowSuccessModal(true);
    } catch (error) {
      alert('まとめて送信中にエラーが発生いたしました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEditedHistory = (updatedRec: HistoryRecord) => {
    const nowStr = `${formattedDate} ${formattedTime}`;
    const oldRec = historyList.find(h => h.id === updatedRec.id);

    const oldSummaryText = oldRec 
      ? `[旧内容] 会員:${oldRec.memberNumber} / 合計:¥${oldRec.totalAmount.toLocaleString()} (${oldRec.cartItems.map(i=>`${i.name}x${i.quantity}`).join(', ')})`
      : '';

    setHistoryList((prev) => prev.map(rec => {
      if (rec.id === updatedRec.id) {
        return {
          ...updatedRec,
          isEdited: true,
          editedAt: nowStr,
          oldSummary: oldSummaryText,
          sentToSheet: false,
        };
      }
      return rec;
    }));

    setEditingRecord(null);
    setSuccessMessage('履歴データを修正いたしました。（打ち消し線にて履歴を記録しました）');
    setShowSuccessModal(true);
  };

  const handleBackToNewsList = () => {
    setSelectedNews(null);
    setActiveTab('news');
    setIsMenuOpen(true);
  };

  const openDrawerTab = (tabName: 'guide' | 'faq' | 'contact') => {
    setActiveTab(tabName);
    setIsMenuOpen(true);
  };

  if (selectedNews) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: t.bg,
        color: t.text,
        zIndex: 3000,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'sans-serif'
      }}>
        <div style={{
          position: 'sticky',
          top: 0,
          backgroundColor: t.headerBg,
          color: t.headerText,
          padding: '14px 20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10
        }}>
          <button
            onClick={handleBackToNewsList}
            style={{
              backgroundColor: t.productBg,
              color: t.productPrice,
              border: `1px solid ${t.productBorder}`,
              borderRadius: '6px',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            ← お知らせ一覧に戻る
          </button>
          <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{appName} お知らせ</div>
        </div>

        <div style={{
          maxWidth: '720px',
          width: '100%',
          margin: '0 auto',
          padding: '24px 16px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            backgroundColor: t.cardBg,
            border: `1px solid ${t.border}`,
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            textAlign: 'left'
          }}>
            <div style={{ fontSize: '13px', color: t.subText, marginBottom: '8px', fontWeight: 'bold', textAlign: 'left' }}>
              📅 配信日: {selectedNews.date}
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: t.text, marginTop: 0, marginBottom: '16px', lineHeight: '1.4', borderBottom: `2px solid ${t.productPrice}`, paddingBottom: '10px', textAlign: 'left' }}>
              {selectedNews.title}
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', lineHeight: '1.7', color: t.text, textAlign: 'left' }}>
              {selectedNews.content.map((paragraph, idx) => (
                <p key={idx} style={{ margin: 0, whiteSpace: 'pre-wrap', textAlign: 'left' }}>
                  {paragraph}
                </p>
              ))}
            </div>

            <div style={{ marginTop: '32px', borderTop: `1px solid ${t.border}`, paddingTop: '16px', textAlign: 'left' }}>
              <button
                onClick={handleBackToNewsList}
                style={{
                  backgroundColor: t.productPrice,
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                お知らせ一覧へ戻る
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      backgroundColor: t.bg,
      padding: '0',
      gap: '12px',
      boxSizing: 'border-box',
      transition: 'background-color 0.3s ease',
      margin: 0,
      position: 'relative'
    }}>
      
      {/* 固定ヘッダー */}
      <div style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: t.headerBg,
        padding: '12px 20px',
        borderRadius: '0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        boxSizing: 'border-box',
        gap: '8px',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <button
            onClick={() => setIsMenuOpen(true)}
            title="設定メニューを開く"
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '22px',
              cursor: 'pointer',
              padding: '2px 4px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: t.headerText,
              flexShrink: 0
            }}
          >
            ☰
          </button>

          {/* 羊アイコン ＋ アプリ名をタップするとトップページ（/）へ戻る */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              cursor: 'pointer',
              minWidth: 0
            }}
            title="トップページへ戻る"
          >
            <OctagonSheepLogo color={t.headerText} />

            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: t.headerText, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {appName}
            </h1>
          </Link>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            style={{
              backgroundColor: isEditMode ? '#dc2626' : t.productBg,
              color: isEditMode ? '#ffffff' : t.productPrice,
              border: `1px solid ${isEditMode ? '#dc2626' : t.productBorder}`,
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: isEditMode ? '0 0 10px rgba(220, 38, 38, 0.4)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            {isEditMode ? '✓ 編集終了' : '✏️ 編集モード'}
          </button>

          <div style={{ fontSize: '14px', fontWeight: 'bold', color: t.headerTimeColor, display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0, whiteSpace: 'nowrap' }}>
            <span>{formattedDate}</span>
            <span style={{ fontSize: '16px', fontFamily: 'monospace' }}>{formattedTime}</span>
          </div>
        </div>
      </div>

      {/* メイン会計エリア */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        width: '100%',
        minHeight: 'calc(100vh - 120px)',
        boxSizing: 'border-box',
        padding: '0 16px',
        alignItems: 'stretch'
      }}>
        
        {/* 左側：商品・回数券選択 */}
        <div style={{
          flex: '1 1 55%',
          backgroundColor: t.cardBg,
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          minWidth: '280px'
        }}>
          <div style={{ flex: 1 }}>
            {/* 会員番号 */}
            {useMemberNumber && (
              <div style={{
                backgroundColor: t.bg,
                border: `1px solid ${t.border}`,
                padding: '10px 12px',
                borderRadius: '8px',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <label style={{ fontSize: '15px', fontWeight: 'bold', color: t.text, whiteSpace: 'nowrap' }}>会員番号:</label>
                <input
                  type="text"
                  readOnly
                  value={memberNumber}
                  onClick={() => setShowMemberKeypad(true)}
                  onFocus={() => setShowMemberKeypad(true)}
                  placeholder="タップして番号入力"
                  style={{
                    flex: 1,
                    fontSize: '16px',
                    fontWeight: 'bold',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    backgroundColor: t.cardBg,
                    border: `1px solid ${t.border}`,
                    color: t.text,
                    width: '100%',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                />
              </div>
            )}

            {/* 商品選択ヘッダー */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: t.text, textAlign: 'left', margin: 0 }}>{productSectionTitle}</h2>
            </div>

            {/* 商品ボタンリスト */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px', marginBottom: '16px' }}>
              {products.map((product, index) => (
                <div
                  key={product.id}
                  draggable={isEditMode}
                  onDragStart={() => handleDragStart(index, 'product')}
                  onDragOver={(e) => handleDragOver(e, index, 'product')}
                  onDragEnd={handleDragEnd}
                  onClick={() => {
                    if (isEditMode) {
                      setEditingInlineItem({ id: product.id, name: product.name, price: product.price, type: 'product' });
                    } else {
                      addToCart(product);
                    }
                  }}
                  style={{
                    padding: '12px 10px',
                    backgroundColor: isEditMode ? '#fffbebf0' : t.productBg,
                    border: `1px solid ${isEditMode ? '#f59e0b' : t.productBorder}`,
                    borderRadius: '8px',
                    textAlign: 'left',
                    cursor: isEditMode ? 'grab' : 'pointer',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    position: 'relative',
                    userSelect: 'none',
                    opacity: draggedIndex === index && dragType === 'product' ? 0.4 : 1
                  }}
                >
                  {isEditMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProduct(product.id);
                      }}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2
                      }}
                      title="削除"
                    >
                      ✕
                    </button>
                  )}

                  <div style={{ 
                    fontWeight: 'bold', 
                    fontSize: '14px', 
                    color: t.productText, 
                    wordBreak: 'break-all', 
                    whiteSpace: 'normal', 
                    lineHeight: '1.3',
                    paddingRight: isEditMode ? '16px' : '0'
                  }}>
                    {product.name}
                  </div>
                  <div style={{ color: t.productPrice, fontWeight: 'bold', marginTop: '4px', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>¥{product.price.toLocaleString()}</span>
                    {isEditMode && (
                      <span style={{ fontSize: '10px', backgroundColor: '#f59e0b', color: '#ffffff', borderRadius: '4px', padding: '2px 4px' }}>✏️ 変更</span>
                    )}
                  </div>
                </div>
              ))}

              {isEditMode && (
                <button
                  onClick={() => setExpandModalType('products')}
                  style={{
                    padding: '12px 10px',
                    backgroundColor: t.cardBg,
                    border: `2px dashed ${t.productPrice}`,
                    borderRadius: '8px',
                    color: t.productPrice,
                    fontWeight: 'bold',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    minHeight: '65px'
                  }}
                >
                  <span>＋ 新規商品追加</span>
                </button>
              )}
            </div>

            {/* 回数券 */}
            {useTickets && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderTop: `1px solid ${t.border}`, paddingTop: '12px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: t.text, textAlign: 'left', margin: 0 }}>{ticketSectionTitle}</h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px', marginBottom: '12px' }}>
                  {tickets.map((ticket, index) => (
                    <div
                      key={ticket.id}
                      draggable={isEditMode}
                      onDragStart={() => handleDragStart(index, 'ticket')}
                      onDragOver={(e) => handleDragOver(e, index, 'ticket')}
                      onDragEnd={handleDragEnd}
                      onClick={() => {
                        if (isEditMode) {
                          setEditingInlineItem({ id: ticket.id, name: ticket.name, price: ticket.amount, type: 'ticket' });
                        } else {
                          applyTicket(ticket);
                        }
                      }}
                      style={{
                        padding: '12px 10px',
                        backgroundColor: isEditMode ? '#fffbebf0' : t.ticketBg,
                        border: `1px solid ${isEditMode ? '#f59e0b' : t.ticketBorder}`,
                        borderRadius: '8px',
                        textAlign: 'left',
                        cursor: isEditMode ? 'grab' : 'pointer',
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                        position: 'relative',
                        userSelect: 'none',
                        opacity: draggedIndex === index && dragType === 'ticket' ? 0.4 : 1
                      }}
                    >
                      {isEditMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTicket(ticket.id);
                          }}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            border: 'none',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 2
                          }}
                          title="削除"
                        >
                          ✕
                        </button>
                      )}

                      <div style={{ 
                        fontWeight: 'bold', 
                        fontSize: '14px', 
                        color: t.ticketText, 
                        wordBreak: 'break-all', 
                        whiteSpace: 'normal', 
                        lineHeight: '1.3',
                        paddingRight: isEditMode ? '16px' : '0'
                      }}>
                        {ticket.name}
                      </div>
                      <div style={{ color: t.ticketAmount, fontWeight: 'bold', marginTop: '4px', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>-¥{ticket.amount.toLocaleString()}</span>
                        {isEditMode && (
                          <span style={{ fontSize: '10px', backgroundColor: '#f59e0b', color: '#ffffff', borderRadius: '4px', padding: '2px 4px' }}>✏️ 変更</span>
                        )}
                      </div>
                    </div>
                  ))}

                  {isEditMode && (
                    <button
                      onClick={() => setExpandModalType('tickets')}
                      style={{
                        padding: '12px 10px',
                        backgroundColor: t.cardBg,
                        border: `2px dashed #16a34a`,
                        borderRadius: '8px',
                        color: '#16a34a',
                        fontWeight: 'bold',
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        minHeight: '65px'
                      }}
                    >
                      <span>＋ 新規回数券追加</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {(cart.length > 0 || appliedTickets.length > 0 || memberNumber !== '') && (
            <button 
              onClick={clearCart}
              style={{
                marginTop: '8px',
                padding: '12px',
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
          flex: '1 1 350px',
          backgroundColor: t.cartBg,
          color: t.cartText,
          padding: '18px 20px',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
          minWidth: '280px',
          transition: 'background-color 0.3s ease'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: `1px solid ${t.border}`, paddingBottom: '6px', flexShrink: 0 }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: t.cartText, margin: 0 }}>お会計内容</h2>
              {useMemberNumber && memberNumber && (
                <span style={{ fontSize: '14px', color: t.cartText, fontWeight: 'bold' }}>会員: {memberNumber}</span>
              )}
            </div>

            <div style={{ flex: 1, minHeight: '180px', maxHeight: '420px', overflowY: 'auto', marginBottom: '12px', paddingRight: '4px' }}>
              {cart.length === 0 && appliedTickets.length === 0 ? (
                <div style={{ color: t.cartText, fontSize: '16px', textAlign: 'left', opacity: 0.8 }}>商品または回数券を選択してください</div>
              ) : (
                <>
                  {cart.map((c) => (
                    <div key={c.item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '15px', marginBottom: '8px', backgroundColor: t.cartItemBg, padding: '8px 12px', borderRadius: '6px', textAlign: 'left' }}>
                      <div style={{ flex: 1, minWidth: 0, paddingRight: '6px', textAlign: 'left' }}>
                        <div style={{ fontWeight: 'bold', color: t.cartText, wordBreak: 'break-all', whiteSpace: 'normal', textAlign: 'left' }}>{c.item.name}</div>
                        <div style={{ fontSize: '13px', color: t.cartText, opacity: 0.8, textAlign: 'left' }}>¥{(c.item.price * c.quantity).toLocaleString()}</div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        <button
                          onClick={() => updateCartQuantity(c.item.id, -1)}
                          style={{ backgroundColor: 'rgba(0,0,0,0.15)', color: t.cartText, border: '1px solid rgba(128,128,128,0.3)', borderRadius: '4px', width: '28px', height: '28px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '15px', fontWeight: 'bold', color: t.cartText, minWidth: '18px', textAlign: 'center' }}>{c.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(c.item.id, 1)}
                          style={{ backgroundColor: 'rgba(0,0,0,0.15)', color: t.cartText, border: '1px solid rgba(128,128,128,0.3)', borderRadius: '4px', width: '28px', height: '28px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeCartItem(c.item.id)}
                          style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', width: '28px', height: '28px', fontSize: '12px', cursor: 'pointer', marginLeft: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
                          title="削除"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}

                  {appliedTickets.map((tItem) => (
                    <div key={tItem.ticket.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '15px', marginBottom: '8px', backgroundColor: t.ticketBg, padding: '8px 12px', borderRadius: '6px', textAlign: 'left', border: `1px solid ${t.ticketBorder}` }}>
                      <div style={{ flex: 1, minWidth: 0, paddingRight: '6px', textAlign: 'left' }}>
                        <div style={{ fontWeight: 'bold', color: t.ticketText, wordBreak: 'break-all', whiteSpace: 'normal', textAlign: 'left' }}>【回数券】{tItem.ticket.name}</div>
                        <div style={{ fontSize: '13px', color: t.ticketAmount, textAlign: 'left' }}>-¥{(tItem.ticket.amount * tItem.quantity).toLocaleString()}</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        <button
                          onClick={() => updateTicketQuantity(tItem.ticket.id, -1)}
                          style={{ backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '4px', width: '28px', height: '28px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '15px', fontWeight: 'bold', color: t.ticketText, minWidth: '18px', textAlign: 'center' }}>{tItem.quantity}</span>
                        <button
                          onClick={() => updateTicketQuantity(tItem.ticket.id, 1)}
                          style={{ backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '4px', width: '28px', height: '28px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeTicketItem(tItem.ticket.id)}
                          style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', width: '28px', height: '28px', fontSize: '12px', cursor: 'pointer', marginLeft: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
                          title="削除"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div style={{
            backgroundColor: t.summaryBg,
            border: `1px solid rgba(128,128,128,0.2)`,
            padding: '14px 16px',
            borderRadius: '8px',
            flexShrink: 0
          }}>
            {totalTicketAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', fontSize: '13px', color: t.accentChange }}>
                <span>（回数券利用額:</span>
                <span>-¥{totalTicketAmount.toLocaleString()}）</span>
              </div>
            )}

            {useTax && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '13px', color: t.cartText, opacity: 0.9 }}>
                <span>（消費税 {taxRate}%:</span>
                <span>+¥{taxAmount.toLocaleString()}）</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '18px', color: t.cartText }}>お支払い合計:</span>
              <span style={{ fontSize: '32px', fontWeight: '800', color: t.accentTotal }}>
                ¥{totalAmount.toLocaleString()}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', marginBottom: '10px' }}>
              <button
                onClick={() => setReceivedAmount(totalAmount)}
                style={{
                  backgroundColor: t.quickBtnBg,
                  color: t.quickBtnText,
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 0px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                ぴったり
              </button>
              <button
                onClick={() => addReceivedAmount(500)}
                style={{
                  backgroundColor: t.quickBtnBg,
                  color: t.quickBtnText,
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 0px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                +¥500
              </button>
              <button
                onClick={() => addReceivedAmount(1000)}
                style={{
                  backgroundColor: t.quickBtnBg,
                  color: t.quickBtnText,
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 0px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                +¥1000
              </button>
              <button
                onClick={() => addReceivedAmount(5000)}
                style={{
                  backgroundColor: t.quickBtnBg,
                  color: t.quickBtnText,
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 0px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                +¥5000
              </button>
              <button
                onClick={() => addReceivedAmount(10000)}
                style={{
                  backgroundColor: t.quickBtnBg,
                  color: t.quickBtnText,
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 0px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                +¥10000
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '18px', color: t.cartText }}>お預かり:</span>
              <input
                type="text"
                readOnly
                value={receivedAmount === '' ? '' : receivedAmount}
                onClick={() => setShowCashKeypad(true)}
                onFocus={() => setShowCashKeypad(true)}
                placeholder="0"
                style={{
                  width: '130px',
                  textAlign: 'right',
                  fontSize: '22px',
                  fontWeight: 'bold',
                  backgroundColor: getContrastingTextColor(t.summaryBg) === '#0f172a' ? '#ffffff' : 'rgba(0,0,0,0.3)',
                  color: getContrastingTextColor(t.summaryBg) === '#0f172a' ? '#0f172a' : '#ffffff',
                  border: '1px solid rgba(128,128,128,0.4)',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  cursor: 'pointer'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid rgba(128,128,128,0.2)`, paddingTop: '8px' }}>
              <span style={{ fontSize: '18px', color: t.cartText }}>お釣り:</span>
              <span style={{ fontSize: '32px', fontWeight: '800', color: t.accentChange }}>
                ¥{changeAmount.toLocaleString()}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '12px', flexShrink: 0 }}>
            {!useSpreadsheet ? (
              <button
                onClick={handleCheckoutOnly}
                disabled={(cart.length === 0 && totalAmount === 0) || numericReceived < totalAmount}
                style={{
                  width: '100%',
                  padding: '14px 8px',
                  backgroundColor: (cart.length > 0 || totalAmount === 0) && numericReceived >= totalAmount ? '#16a34a' : 'rgba(0,0,0,0.15)',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: (cart.length > 0 || totalAmount === 0) && numericReceived >= totalAmount ? 'pointer' : 'not-allowed'
                }}
              >
                会計を完了する（リセット）
              </button>
            ) : (
              <>
                <button
                  onClick={handleCheckoutStep1}
                  disabled={(cart.length === 0 && totalAmount === 0) || numericReceived < totalAmount}
                  style={{
                    flex: '1 1 120px',
                    padding: '12px 6px',
                    backgroundColor: (cart.length > 0 || totalAmount === 0) && numericReceived >= totalAmount ? '#16a34a' : 'rgba(0,0,0,0.15)',
                    color: '#ffffff',
                    fontSize: '15px',
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
                    flex: '1 1 120px',
                    padding: '12px 6px',
                    backgroundColor: isSubmitting ? '#9ca3af' : (cart.length > 0 || appliedTickets.length > 0) ? '#2563eb' : 'rgba(0,0,0,0.15)',
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
              </>
            )}
          </div>

        </div>
      </div>

      {/* フッター */}
      <footer style={{
        marginTop: '20px',
        padding: '20px',
        borderTop: `1px solid ${t.border}`,
        backgroundColor: t.cardBg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        boxSizing: 'border-box',
        width: '100%',
        flexShrink: 0
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '8px',
          maxWidth: '800px',
          width: '100%'
        }}>
          <button
            onClick={() => setShowAboutModal(true)}
            style={{
              backgroundColor: t.productBg,
              color: t.productPrice,
              border: `1px solid ${t.productBorder}`,
              borderRadius: '6px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🐑 サイトのご紹介
          </button>
          <button
            onClick={() => openDrawerTab('faq')}
            style={{
              backgroundColor: t.bg,
              color: t.text,
              border: `1px solid ${t.border}`,
              borderRadius: '6px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🔒 プライバシーポリシー
          </button>
          <button
            onClick={() => openDrawerTab('faq')}
            style={{
              backgroundColor: t.bg,
              color: t.text,
              border: `1px solid ${t.border}`,
              borderRadius: '6px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ❓ FAQ
          </button>
          <button
            onClick={() => openDrawerTab('contact')}
            style={{
              backgroundColor: t.bg,
              color: t.text,
              border: `1px solid ${t.border}`,
              borderRadius: '6px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ✉️ お問い合わせ
          </button>
        </div>
        <div style={{ fontSize: '11px', color: t.subText }}>
          © POSheep - Web POS Application
        </div>
      </footer>

      {/* メイン画面ダイレクトインライン編集用モーダル */}
      {editingInlineItem && (
        <div
          onClick={() => setEditingInlineItem(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 2600,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: t.cardBg,
              color: t.text,
              borderRadius: '16px',
              padding: '20px',
              width: '100%',
              maxWidth: '360px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
              border: `1px solid ${t.border}`,
              textAlign: 'left'
            }}
          >
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold', borderBottom: `1px solid ${t.border}`, paddingBottom: '8px' }}>
              ✏️ {editingInlineItem.type === 'product' ? productSectionTitle : ticketSectionTitle}の変更
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>名称</label>
                <input
                  type="text"
                  value={editingInlineItem.name}
                  onChange={(e) => setEditingInlineItem({ ...editingInlineItem, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                  {editingInlineItem.type === 'product' ? '価格 (円)' : '割引額 (円)'}
                </label>
                <input
                  type="number"
                  value={editingInlineItem.price}
                  onChange={(e) => setEditingInlineItem({ ...editingInlineItem, price: Number(e.target.value) })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, boxSizing: 'border-box', fontWeight: 'bold' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  onClick={() => setEditingInlineItem(null)}
                  style={{ flex: 1, padding: '10px', backgroundColor: t.bg, color: t.subText, border: `1px solid ${t.border}`, borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  キャンセル
                </button>
                <button
                  onClick={handleSaveInlineEdit}
                  style={{ flex: 1, padding: '10px', backgroundColor: t.productPrice, color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  保存する
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 「サイトのご紹介」中央モーダル */}
      {showAboutModal && (
        <div
          onClick={() => setShowAboutModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 2500,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px',
            boxSizing: 'border-box'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: t.cardBg,
              color: t.text,
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '520px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
              border: `1px solid ${t.border}`,
              textAlign: 'left',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: `2px solid ${t.productPrice}`, paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <OctagonSheepLogo color={t.productPrice} />
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: t.text }}>POSheep（ポシップ）のご紹介</h2>
              </div>
              <button onClick={() => setShowAboutModal(false)} style={{ border: 'none', backgroundColor: 'transparent', fontSize: '22px', cursor: 'pointer', color: t.subText }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px', lineHeight: '1.7', color: t.text }}>
              <div style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '14px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px', color: t.productPrice, marginBottom: '6px' }}>🐑 どんなアプリ？</div>
                <b>POSheep（ポシップ）</b>は、小規模店舗・POP UPショップ・フリマ・イベント出店者様向けに開発された、ブラウザでスグに使える<b>完全無料の軽量Web POSレジアプリ</b>です。専用機器の購入は一切不要で、スマホ・タブレット・パソコンからアクセスするだけで即座にレジ業務を起動できます。
              </div>

              <div style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '14px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px', color: t.productPrice, marginBottom: '6px' }}>✨ 主な機能・こだわり</div>
                <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li><b>即座に使える</b>: 会員番号や回数券割引、内税・外税設定を柔軟にカスタマイズ。</li>
                  <li><b>スプレッドシート全自動連携</b>: Apps Script（GAS）で売上データを一瞬で記録。</li>
                  <li><b>安心の履歴保存</b>: レジ締め時のミスをなくす打ち消し線付き修正機能 ＆ 一括送信。</li>
                  <li><b>自由なデザイン</b>: 2色を選ぶだけで自分好みの配色が完成するスマートカラーテーマ。</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowAboutModal(false)}
              style={{
                marginTop: '20px',
                width: '100%',
                padding: '12px',
                backgroundColor: t.productPrice,
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* 右下使い方ガイドポップアップ */}
      {showGuidePopup && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1500,
          backgroundColor: t.cardBg,
          color: t.text,
          border: `2px solid ${t.productPrice}`,
          borderRadius: '12px',
          padding: '12px 16px',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          maxWidth: '320px',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontWeight: 'bold', fontSize: '13px', color: t.productPrice, marginBottom: '2px' }}>
              POSheepへようこそ！🐑
            </div>
            <div style={{ fontSize: '12px', color: t.subText }}>
              レジの使い方や解説をご確認いただけます。
            </div>
          </div>
          <button
            onClick={() => {
              setShowAboutModal(true);
              setShowGuidePopup(false);
            }}
            style={{
              backgroundColor: t.productPrice,
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            サイトのご紹介 🐑
          </button>
          <button
            onClick={() => setShowGuidePopup(false)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '18px',
              color: t.subText,
              cursor: 'pointer',
              padding: '0 2px'
            }}
            title="消す"
          >
            ✕
          </button>
        </div>
      )}

      {/* ローディング画面 */}
      {(isSubmitting || isContactSubmitting) && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#ffffff',
          gap: '12px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '24px 32px',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
          }}>
            <OctagonSheepLogo color="#1f2937" isEating={true} />
            <div style={{ color: '#1f2937', fontWeight: 'bold', fontSize: '16px', marginTop: '12px' }}>
              データ送信中...
            </div>
          </div>
        </div>
      )}

      {/* 完了通知ポップアップ */}
      {showSuccessModal && (
        <div 
          onClick={() => setShowSuccessModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              padding: '24px 32px',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
              maxWidth: '340px',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            <OctagonSheepLogo color="#16a34a" isHappy={true} />
            <div style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '18px', marginTop: '12px', marginBottom: '8px' }}>
              完了いたしました！
            </div>
            <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.5', whiteSpace: 'pre-wrap', textAlign: 'center', marginBottom: '20px' }}>
              {successMessage}
            </div>
            <button
              onClick={() => setShowSuccessModal(false)}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#16a34a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '15px',
                cursor: 'pointer'
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* 会員番号テンキー */}
      {showMemberKeypad && (
        <div onClick={() => setShowMemberKeypad(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '20px', width: '100%', maxWidth: '300px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#1f2937' }}>会員番号入力</span>
              <button onClick={() => setShowMemberKeypad(false)} style={{ border: 'none', backgroundColor: 'transparent', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>✕</button>
            </div>
            <div style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 14px', fontSize: '22px', fontWeight: 'bold', textAlign: 'right', color: '#0f172a', marginBottom: '14px', minHeight: '48px', boxSizing: 'border-box', wordBreak: 'break-all' }}>
              {memberNumber || <span style={{ color: '#94a3b8' }}>未入力</span>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '8px' }}>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button key={num} onClick={() => handleMemberKeypadPress(num)} style={{ padding: '14px 0', fontSize: '20px', fontWeight: 'bold', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1e293b', cursor: 'pointer' }}>{num}</button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
              <button onClick={handleMemberKeypadClear} style={{ padding: '14px 0', fontSize: '14px', fontWeight: 'bold', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: '8px', cursor: 'pointer' }}>クリア</button>
              <button onClick={() => handleMemberKeypadPress('0')} style={{ padding: '14px 0', fontSize: '20px', fontWeight: 'bold', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1e293b', cursor: 'pointer' }}>0</button>
              <button onClick={handleMemberKeypadBackspace} style={{ padding: '14px 0', fontSize: '18px', fontWeight: 'bold', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', cursor: 'pointer' }}>⌫</button>
            </div>
            <button onClick={() => setShowMemberKeypad(false)} style={{ width: '100%', padding: '12px', backgroundColor: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>決定</button>
          </div>
        </div>
      )}

      {/* 現金テンキー */}
      {showCashKeypad && (
        <div onClick={() => setShowCashKeypad(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '20px', width: '100%', maxWidth: '320px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#1f2937' }}>お預かり金額入力</span>
              <button onClick={() => setShowCashKeypad(false)} style={{ border: 'none', backgroundColor: 'transparent', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>✕</button>
            </div>
            <div style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 14px', fontSize: '24px', fontWeight: 'bold', textAlign: 'right', color: '#0f172a', marginBottom: '12px', minHeight: '48px', boxSizing: 'border-box' }}>
              ¥{receivedAmount === '' ? '0' : Number(receivedAmount).toLocaleString()}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', marginBottom: '12px' }}>
              <button onClick={() => setReceivedAmount(totalAmount)} style={{ backgroundColor: '#e2e8f0', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 0', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>ぴったり</button>
              <button onClick={() => addReceivedAmount(500)} style={{ backgroundColor: '#e2e8f0', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 0', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>+500</button>
              <button onClick={() => addReceivedAmount(1000)} style={{ backgroundColor: '#e2e8f0', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 0', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>+1000</button>
              <button onClick={() => addReceivedAmount(5000)} style={{ backgroundColor: '#e2e8f0', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 0', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>+5000</button>
              <button onClick={() => addReceivedAmount(10000)} style={{ backgroundColor: '#fef08a', border: '1px solid #fde047', borderRadius: '6px', padding: '6px 0', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>+10000</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '8px' }}>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button key={num} onClick={() => handleCashKeypadPress(num)} style={{ padding: '12px 0', fontSize: '20px', fontWeight: 'bold', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1e293b', cursor: 'pointer' }}>{num}</button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '14px' }}>
              <button onClick={handleCashKeypadClear} style={{ padding: '12px 0', fontSize: '12px', fontWeight: 'bold', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: '8px', cursor: 'pointer' }}>クリア</button>
              <button onClick={() => handleCashKeypadPress('0')} style={{ padding: '12px 0', fontSize: '20px', fontWeight: 'bold', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1e293b', cursor: 'pointer' }}>0</button>
              <button onClick={() => handleCashKeypadPress('00')} style={{ padding: '12px 0', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1e293b', cursor: 'pointer' }}>00</button>
              <button onClick={handleCashKeypadBackspace} style={{ padding: '12px 0', fontSize: '18px', fontWeight: 'bold', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', cursor: 'pointer' }}>⌫</button>
            </div>
            <button onClick={() => setShowCashKeypad(false)} style={{ width: '100%', padding: '12px', backgroundColor: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>決定</button>
          </div>
        </div>
      )}

      {/* 履歴修正ダイアログ */}
      {editingRecord && (
        <div onClick={() => setEditingRecord(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1200, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: t.drawerBg, color: t.drawerText, borderRadius: '16px', padding: '20px', width: '100%', maxWidth: '440px', maxHeight: '85vh', overflowY: 'auto', border: `1px solid ${t.border}`, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)', boxSizing: 'border-box' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold', borderBottom: `1px solid ${t.border}`, paddingBottom: '8px' }}>✏️ 会計履歴の修正</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>会員番号</label>
                <input
                  type="text"
                  value={editingRecord.memberNumber}
                  onChange={(e) => setEditingRecord({ ...editingRecord, memberNumber: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>修正後の合計金額 (円)</label>
                <input
                  type="number"
                  value={editingRecord.totalAmount}
                  onChange={(e) => setEditingRecord({ ...editingRecord, totalAmount: Number(e.target.value) })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, boxSizing: 'border-box', fontWeight: 'bold' }}
                />
              </div>

              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>購入商品内訳</label>
                {editingRecord.cartItems.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                    <span>個数:</span>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const newCart = [...editingRecord.cartItems];
                        newCart[idx].quantity = Number(e.target.value);
                        setEditingRecord({ ...editingRecord, cartItems: newCart });
                      }}
                      style={{ width: '60px', padding: '4px 6px', borderRadius: '4px', border: `1px solid ${t.border}`, textAlign: 'center' }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button
                  onClick={() => setEditingRecord(null)}
                  style={{ flex: 1, padding: '10px', backgroundColor: t.bg, color: t.subText, border: `1px solid ${t.border}`, borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  キャンセル
                </button>
                <button
                  onClick={() => handleSaveEditedHistory(editingRecord)}
                  style={{ flex: 1, padding: '10px', backgroundColor: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  修正を確定保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 新規追加モーダル */}
      {expandModalType && (
        <div 
          onClick={() => setExpandModalType(null)} 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{ backgroundColor: t.drawerBg, color: t.drawerText, borderRadius: '16px', padding: '20px', width: '100%', maxWidth: '480px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', boxSizing: 'border-box', border: `1px solid ${t.border}` }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: `1px solid ${t.border}`, paddingBottom: '10px', flexShrink: 0 }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 'bold', color: t.drawerText }}>
                {expandModalType === 'products' ? (
                  <>📦 {productSectionTitle}一覧・新規追加</>
                ) : (
                  <>🎟️ {ticketSectionTitle}一覧・新規追加</>
                )}
              </h3>
              <button onClick={() => setExpandModalType(null)} style={{ border: 'none', backgroundColor: 'transparent', fontSize: '22px', cursor: 'pointer', color: t.subText }}>✕</button>
            </div>

            <div style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '12px', marginBottom: '12px', flexShrink: 0 }}>
              <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px', color: t.text }}>
                ＋ 新しい{expandModalType === 'products' ? productSectionTitle : ticketSectionTitle}を追加
              </div>
              {expandModalType === 'products' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="商品名 (例: 大人 E)"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    style={{ padding: '8px 10px', borderRadius: '6px', border: `1px solid ${t.border}`, fontSize: '13px', backgroundColor: t.cardBg, color: t.text }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="number"
                      placeholder="価格 (円)"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', border: `1px solid ${t.border}`, fontSize: '13px', backgroundColor: t.cardBg, color: t.text }}
                    />
                    <button
                      onClick={handleAddProduct}
                      style={{ backgroundColor: t.productPrice, color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                    >
                      追加
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="回数券名 (例: ★特別券)"
                    value={newTicketName}
                    onChange={(e) => setNewTicketName(e.target.value)}
                    style={{ padding: '8px 10px', borderRadius: '6px', border: `1px solid ${t.border}`, fontSize: '13px', backgroundColor: t.cardBg, color: t.text }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="number"
                      placeholder="割引額 (円)"
                      value={newTicketAmount}
                      onChange={(e) => setNewTicketAmount(e.target.value === '' ? '' : Number(e.target.value))}
                      style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', border: `1px solid ${t.border}`, fontSize: '13px', backgroundColor: t.cardBg, color: t.text }}
                    />
                    <button
                      onClick={handleAddTicket}
                      style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                    >
                      追加
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
              {expandModalType === 'products' ? (
                products.map((p, index) => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderBottom: `1px solid ${t.border}`, backgroundColor: t.bg, marginBottom: '6px', borderRadius: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 'bold', color: t.text, flex: 1, textAlign: 'left', wordBreak: 'break-all' }}>{p.name} <span style={{ color: t.productPrice, fontWeight: 'bold' }}>(¥{p.price.toLocaleString()})</span></span>
                    
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                      <button onClick={() => handleMoveProduct(index, 'up')} disabled={index === 0} style={{ border: `1px solid ${t.border}`, backgroundColor: t.cardBg, color: t.text, borderRadius: '4px', padding: '6px 12px', cursor: index === 0 ? 'default' : 'pointer', fontSize: '13px', fontWeight: 'bold' }}>▲</button>
                      <button onClick={() => handleMoveProduct(index, 'down')} disabled={index === products.length - 1} style={{ border: `1px solid ${t.border}`, backgroundColor: t.cardBg, color: t.text, borderRadius: '4px', padding: '6px 12px', cursor: index === products.length - 1 ? 'default' : 'pointer', fontSize: '13px', fontWeight: 'bold' }}>▼</button>
                      <button onClick={() => handleDeleteProduct(p.id)} style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '13px', cursor: 'pointer', marginLeft: '4px', fontWeight: 'bold' }}>削除</button>
                    </div>
                  </div>
                ))
              ) : (
                tickets.map((tItem, index) => (
                  <div key={tItem.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderBottom: `1px solid ${t.border}`, backgroundColor: t.bg, marginBottom: '6px', borderRadius: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 'bold', color: t.ticketText, flex: 1, textAlign: 'left', wordBreak: 'break-all' }}>{tItem.name} <span style={{ color: t.ticketAmount, fontWeight: 'bold' }}>(-¥{tItem.amount.toLocaleString()})</span></span>
                    
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                      <button onClick={() => handleMoveTicket(index, 'up')} disabled={index === 0} style={{ border: `1px solid ${t.border}`, backgroundColor: t.cardBg, color: t.text, borderRadius: '4px', padding: '6px 12px', cursor: index === 0 ? 'default' : 'pointer', fontSize: '13px', fontWeight: 'bold' }}>▲</button>
                      <button onClick={() => handleMoveTicket(index, 'down')} disabled={index === tickets.length - 1} style={{ border: `1px solid ${t.border}`, backgroundColor: t.cardBg, color: t.text, borderRadius: '4px', padding: '6px 12px', cursor: index === tickets.length - 1 ? 'default' : 'pointer', fontSize: '13px', fontWeight: 'bold' }}>▼</button>
                      <button onClick={() => handleDeleteTicket(tItem.id)} style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '13px', cursor: 'pointer', marginLeft: '4px', fontWeight: 'bold' }}>削除</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button onClick={() => setExpandModalType(null)} style={{ marginTop: '16px', width: '100%', padding: '12px', backgroundColor: t.headerBg, color: t.headerText, border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', flexShrink: 0 }}>
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* ドロワーメニュー */}
      {isMenuOpen && (
        <div 
          onClick={() => setIsMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'flex-start',
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: t.drawerBg,
              color: t.drawerText,
              width: '92%',
              maxWidth: '460px',
              height: '100%',
              boxSizing: 'border-box',
              padding: '20px 16px',
              boxShadow: '4px 0 15px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              textAlign: 'left',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${t.border}`, marginBottom: '16px', flexShrink: 0 }}>
              <div style={{ display: 'flex', flex: 1, gap: '2px', overflowX: 'auto', paddingBottom: '4px' }}>
                <button
                  onClick={() => setActiveTab('items')}
                  style={{
                    padding: '8px 6px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    borderBottom: activeTab === 'items' ? `3px solid ${t.productPrice}` : 'none',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    color: activeTab === 'items' ? t.productPrice : t.subText,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  ✏️ 会計項目
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  style={{
                    padding: '8px 6px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    borderBottom: activeTab === 'history' ? `3px solid ${t.productPrice}` : 'none',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    color: activeTab === 'history' ? t.productPrice : t.subText,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  📜 会計履歴
                </button>
                <button
                  onClick={() => setActiveTab('guide')}
                  style={{
                    padding: '8px 6px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    borderBottom: activeTab === 'guide' ? `3px solid ${t.productPrice}` : 'none',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    color: activeTab === 'guide' ? t.productPrice : t.subText,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  📖 使い方
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  style={{
                    padding: '8px 6px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    borderBottom: activeTab === 'settings' ? `3px solid ${t.productPrice}` : 'none',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    color: activeTab === 'settings' ? t.productPrice : t.subText,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  ⚙️ アプリ設定
                </button>
                <button
                  onClick={() => setActiveTab('theme')}
                  style={{
                    padding: '8px 6px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    borderBottom: activeTab === 'theme' ? `3px solid ${t.productPrice}` : 'none',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    color: activeTab === 'theme' ? t.productPrice : t.subText,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  🎨 カラー
                </button>
                <button
                  onClick={() => setActiveTab('faq')}
                  style={{
                    padding: '8px 6px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    borderBottom: activeTab === 'faq' ? `3px solid ${t.productPrice}` : 'none',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    color: activeTab === 'faq' ? t.productPrice : t.subText,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  ❓ FAQ・規約
                </button>
                <button
                  onClick={() => setActiveTab('contact')}
                  style={{
                    padding: '8px 6px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    borderBottom: activeTab === 'contact' ? `3px solid ${t.productPrice}` : 'none',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    color: activeTab === 'contact' ? t.productPrice : t.subText,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  ✉️ お問い合わせ
                </button>
                <button
                  onClick={() => setActiveTab('news')}
                  style={{
                    padding: '8px 6px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    borderBottom: activeTab === 'news' ? `3px solid ${t.productPrice}` : 'none',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    color: activeTab === 'news' ? t.productPrice : t.subText,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  📢 お知らせ
                </button>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                style={{ backgroundColor: 'transparent', border: 'none', fontSize: '22px', cursor: 'pointer', color: t.subText, padding: '0 4px', flexShrink: 0 }}
              >
                ✕
              </button>
            </div>

            {/* TAB 1: 会計項目の編集 */}
            {activeTab === 'items' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px', textAlign: 'left' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: t.drawerText, margin: 0, textAlign: 'left' }}>✏️ {productSectionTitle}リストの編集</h3>
                    <button
                      onClick={() => setExpandModalType('products')}
                      style={{ backgroundColor: t.productBg, color: t.productPrice, border: `1px solid ${t.productBorder}`, borderRadius: '4px', padding: '3px 8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      全表示
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
                    <input
                      type="text"
                      placeholder="商品名 (例: 大人 E)"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      style={{ padding: '8px 10px', borderRadius: '6px', border: `1px solid ${t.border}`, fontSize: '14px', backgroundColor: t.bg, color: t.text }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="number"
                        placeholder="価格 (円)"
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', border: `1px solid ${t.border}`, fontSize: '14px', backgroundColor: t.bg, color: t.text }}
                      />
                      <button
                        onClick={handleAddProduct}
                        style={{ backgroundColor: t.productPrice, color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                      >
                        追加
                      </button>
                    </div>
                  </div>

                  <div style={{ maxHeight: '180px', overflowY: 'auto', border: `1px solid ${t.border}`, borderRadius: '6px', padding: '6px', backgroundColor: t.bg }}>
                    {products.map((p, index) => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', borderBottom: `1px solid ${t.border}`, backgroundColor: t.cardBg, marginBottom: '4px', borderRadius: '6px', textAlign: 'left' }}>
                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: t.text, flex: 1, textAlign: 'left', wordBreak: 'break-all' }}>{p.name} <span style={{ color: t.productPrice, fontWeight: 'normal' }}>(¥{p.price.toLocaleString()})</span></span>
                        
                        <div style={{ display: 'flex', gap: '3px', alignItems: 'center', flexShrink: 0 }}>
                          <button onClick={() => handleMoveProduct(index, 'up')} disabled={index === 0} style={{ border: `1px solid ${t.border}`, backgroundColor: t.bg, color: index === 0 ? t.subText : t.text, borderRadius: '4px', padding: '3px 8px', cursor: index === 0 ? 'default' : 'pointer', fontSize: '11px', fontWeight: 'bold' }}>▲</button>
                          <button onClick={() => handleMoveProduct(index, 'down')} disabled={index === products.length - 1} style={{ border: `1px solid ${t.border}`, backgroundColor: t.bg, color: index === products.length - 1 ? t.subText : t.text, borderRadius: '4px', padding: '3px 8px', cursor: index === products.length - 1 ? 'default' : 'pointer', fontSize: '11px', fontWeight: 'bold' }}>▼</button>
                          <button onClick={() => handleDeleteProduct(p.id)} style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', padding: '4px 6px', fontSize: '11px', cursor: 'pointer', marginLeft: '2px', fontWeight: 'bold' }}>削除</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {useTickets && (
                  <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: t.drawerText, margin: 0, textAlign: 'left' }}>{ticketSectionTitle}リストの編集</h3>
                      <button
                        onClick={() => setExpandModalType('tickets')}
                        style={{ backgroundColor: t.ticketBg, color: t.ticketText, border: `1px solid ${t.ticketBorder}`, borderRadius: '4px', padding: '3px 8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        全表示
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
                      <input
                        type="text"
                        placeholder="回数券名 (例: ★特別券)"
                        value={newTicketName}
                        onChange={(e) => setNewTicketName(e.target.value)}
                        style={{ padding: '8px 10px', borderRadius: '6px', border: `1px solid ${t.border}`, fontSize: '14px', backgroundColor: t.bg, color: t.text }}
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="number"
                          placeholder="割引額 (円)"
                          value={newTicketAmount}
                          onChange={(e) => setNewTicketAmount(e.target.value === '' ? '' : Number(e.target.value))}
                          style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', border: `1px solid ${t.border}`, fontSize: '14px', backgroundColor: t.bg, color: t.text }}
                        />
                        <button
                          onClick={handleAddTicket}
                          style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                        >
                          追加
                        </button>
                      </div>
                    </div>

                    <div style={{ maxHeight: '180px', overflowY: 'auto', border: `1px solid ${t.border}`, borderRadius: '6px', padding: '6px', backgroundColor: t.bg }}>
                      {tickets.map((tItem, index) => (
                        <div key={tItem.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', borderBottom: `1px solid ${t.border}`, backgroundColor: t.cardBg, marginBottom: '4px', borderRadius: '6px', textAlign: 'left' }}>
                          <span style={{ fontSize: '13px', fontWeight: 'bold', color: t.ticketText, flex: 1, textAlign: 'left', wordBreak: 'break-all' }}>{tItem.name} <span style={{ color: t.ticketAmount, fontWeight: 'normal' }}>(-¥{tItem.amount.toLocaleString()})</span></span>
                          
                          <div style={{ display: 'flex', gap: '3px', alignItems: 'center', flexShrink: 0 }}>
                            <button onClick={() => handleMoveTicket(index, 'up')} disabled={index === 0} style={{ border: `1px solid ${t.border}`, backgroundColor: t.bg, color: index === 0 ? t.subText : t.text, borderRadius: '4px', padding: '3px 8px', cursor: index === 0 ? 'default' : 'pointer', fontSize: '11px', fontWeight: 'bold' }}>▲</button>
                            <button onClick={() => handleMoveTicket(index, 'down')} disabled={index === tickets.length - 1} style={{ border: `1px solid ${t.border}`, backgroundColor: t.bg, color: index === tickets.length - 1 ? t.subText : t.text, borderRadius: '4px', padding: '3px 8px', cursor: index === tickets.length - 1 ? 'default' : 'pointer', fontSize: '11px', fontWeight: 'bold' }}>▼</button>
                            <button onClick={() => handleDeleteTicket(tItem.id)} style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', padding: '4px 6px', fontSize: '11px', cursor: 'pointer', marginLeft: '2px', fontWeight: 'bold' }}>削除</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleResetToDefault}
                  style={{ backgroundColor: t.bg, color: t.subText, border: `1px solid ${t.border}`, borderRadius: '6px', padding: '10px', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  商品・回数券のみ初期状態に戻す
                </button>
              </div>
            )}

            {/* TAB 2: 📜 会計履歴 */}
            {activeTab === 'history' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>📜 会計履歴（修正・一括送信）</h3>
                  <button
                    onClick={handleBulkSendToSpreadsheet}
                    disabled={historyList.length === 0}
                    style={{
                      backgroundColor: historyList.length > 0 ? '#2563eb' : t.border,
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: historyList.length > 0 ? 'pointer' : 'not-allowed'
                    }}
                  >
                    📊 まとめてシート送信
                  </button>
                </div>

                <p style={{ fontSize: '12px', color: t.subText, margin: 0 }}>
                  過去の会計内容を確認・修正できます。修正された記録は打ち消し線（横線）付きで残ります。
                </p>

                {historyList.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px 0', color: t.subText, fontSize: '14px' }}>
                    会計履歴はまだありません。
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
                    {historyList.map((rec) => (
                      <div key={rec.id} style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '10px 12px', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: t.subText, marginBottom: '4px' }}>
                          <span>{rec.dateTime}</span>
                          <span>会員: {rec.memberNumber}</span>
                        </div>

                        {rec.isEdited && rec.oldSummary && (
                          <div style={{ fontSize: '11px', color: '#ef4444', textDecoration: 'line-through', marginBottom: '4px', opacity: 0.8 }}>
                            {rec.oldSummary}
                          </div>
                        )}

                        <div style={{ fontWeight: 'bold', fontSize: '14px', color: t.text, marginBottom: '4px' }}>
                          お支払い合計: ¥{rec.totalAmount.toLocaleString()}
                        </div>

                        <div style={{ fontSize: '12px', color: t.subText, marginBottom: '6px' }}>
                          注文: {rec.cartItems.map(i => `${i.name}×${i.quantity}`).join(', ') || 'なし'}
                          {rec.ticketItems.length > 0 && ` (${rec.ticketItems.map(t => `${t.name}×${t.quantity}`).join(', ')})`}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${t.border}`, paddingTop: '6px', marginTop: '4px' }}>
                          <span style={{ fontSize: '11px', color: rec.sentToSheet ? '#16a34a' : '#f59e0b', fontWeight: 'bold' }}>
                            {rec.sentToSheet ? '✓ シート送信済' : '未送信'} {rec.isEdited && '(修正済)'}
                          </span>
                          <button
                            onClick={() => setEditingRecord(rec)}
                            style={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}`, color: t.text, borderRadius: '4px', padding: '4px 8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                          >
                            ✏️ 修正
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: 📖 使い方 */}
            {activeTab === 'guide' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px', textAlign: 'left', fontSize: '13px', color: t.text, lineHeight: '1.6' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: t.drawerText, margin: 0, textAlign: 'left', borderBottom: `2px solid ${t.productPrice}`, paddingBottom: '4px' }}>📖 レジの使い方ガイド</h3>

                <div style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontWeight: 'bold', color: t.drawerText, fontSize: '14px', marginBottom: '4px' }}>1. 商品・回数券の選択</div>
                  画面左側のリストから、注文された商品や利用する回数券をタップします。カート内の数量変更（＋/－）や1部削除も画面上で簡単に行えます。
                </div>

                <div style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontWeight: 'bold', color: t.drawerText, fontSize: '14px', marginBottom: '4px' }}>2. 会員番号の入力（任意）</div>
                  「会員番号」機能がONの場合、番号欄をタップすると専用テンキーが表示されます。番号を入力して「決定」を押すとカートに保持されます。
                </div>

                <div style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontWeight: 'bold', color: t.drawerText, fontSize: '14px', marginBottom: '4px' }}>3. お預かり金額とお釣り</div>
                  「ぴったり」や「+1000」などのクイックボタン、または金額欄をタップして表示されるテンキーから預かり現金を自動計算できます。
                </div>

                <div style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontWeight: 'bold', color: t.drawerText, fontSize: '14px', marginBottom: '4px' }}>4. 会計完了とスプレッドシート送信</div>
                  「1. 会計を完了する」でお渡し確認を行い、「2. シートへ送信」を押すことで外部スプレッドシートへ記録が行われます。
                </div>
              </div>
            )}

            {/* TAB 4: ⚙️ アプリ設定 */}
            {activeTab === 'settings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px', textAlign: 'left' }}>
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: t.drawerText, marginBottom: '6px', textAlign: 'left' }}>⚙️ タイトル名の変更</h3>
                    <input
                      type="text"
                      value={appName}
                      onChange={(e) => setAppName(e.target.value)}
                      placeholder="例: POSheep"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${t.border}`, fontSize: '14px', fontWeight: 'bold', boxSizing: 'border-box', backgroundColor: t.bg, color: t.text }}
                    />
                  </div>

                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: t.drawerText, marginBottom: '6px', textAlign: 'left' }}>商品エリアの表示名</h3>
                    <input
                      type="text"
                      value={productSectionTitle}
                      onChange={(e) => setProductSectionTitle(e.target.value)}
                      placeholder="例: 商品選択"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${t.border}`, fontSize: '14px', fontWeight: 'bold', boxSizing: 'border-box', backgroundColor: t.bg, color: t.text }}
                    />
                  </div>

                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: t.drawerText, marginBottom: '6px', textAlign: 'left' }}>回数券エリアの表示名</h3>
                    <input
                      type="text"
                      value={ticketSectionTitle}
                      onChange={(e) => setTicketSectionTitle(e.target.value)}
                      placeholder="例: 回数券"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${t.border}`, fontSize: '14px', fontWeight: 'bold', boxSizing: 'border-box', backgroundColor: t.bg, color: t.text }}
                    />
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: '16px', textAlign: 'left' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: t.drawerText, marginBottom: '6px', textAlign: 'left' }}>会員番号入力機能</h3>
                  <p style={{ fontSize: '12px', color: t.subText, marginBottom: '10px', textAlign: 'left' }}>メイン画面の「会員番号」入力欄を表示するか設定します。</p>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => setUseMemberNumber(true)}
                      style={{
                        flex: 1,
                        padding: '10px 0',
                        borderRadius: '8px',
                        border: useMemberNumber ? `2px solid ${t.productPrice}` : `1px solid ${t.border}`,
                        backgroundColor: useMemberNumber ? t.productBg : t.cardBg,
                        color: useMemberNumber ? t.productPrice : t.subText,
                        fontWeight: 'bold',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      ON (表示する)
                    </button>
                    <button
                      onClick={() => setUseMemberNumber(false)}
                      style={{
                        flex: 1,
                        padding: '10px 0',
                        borderRadius: '8px',
                        border: !useMemberNumber ? `2px solid ${t.productPrice}` : `1px solid ${t.border}`,
                        backgroundColor: !useMemberNumber ? t.productBg : t.cardBg,
                        color: !useMemberNumber ? t.productPrice : t.subText,
                        fontWeight: 'bold',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      OFF (表示しない)
                    </button>
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: '16px', textAlign: 'left' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: t.drawerText, marginBottom: '6px', textAlign: 'left' }}>回数券エリア機能</h3>
                  <p style={{ fontSize: '12px', color: t.subText, marginBottom: '10px', textAlign: 'left' }}>メイン画面の「回数券」選択エリアを表示するか設定します。</p>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => setUseTickets(true)}
                      style={{
                        flex: 1,
                        padding: '10px 0',
                        borderRadius: '8px',
                        border: useTickets ? `2px solid ${t.productPrice}` : `1px solid ${t.border}`,
                        backgroundColor: useTickets ? t.productBg : t.cardBg,
                        color: useTickets ? t.productPrice : t.subText,
                        fontWeight: 'bold',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      ON (表示する)
                    </button>
                    <button
                      onClick={() => setUseTickets(false)}
                      style={{
                        flex: 1,
                        padding: '10px 0',
                        borderRadius: '8px',
                        border: !useTickets ? `2px solid ${t.productPrice}` : `1px solid ${t.border}`,
                        backgroundColor: !useTickets ? t.productBg : t.cardBg,
                        color: !useTickets ? t.productPrice : t.subText,
                        fontWeight: 'bold',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      OFF (表示しない)
                    </button>
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: '16px', textAlign: 'left' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: t.drawerText, marginBottom: '6px', textAlign: 'left' }}>消費税設定</h3>
                  <p style={{ fontSize: '12px', color: t.subText, marginBottom: '12px', textAlign: 'left' }}>お会計に消費税を自動加算するか設定します。</p>

                  <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                    <button
                      onClick={() => setUseTax(false)}
                      style={{
                        flex: 1,
                        padding: '10px 0',
                        borderRadius: '8px',
                        border: !useTax ? `2px solid ${t.productPrice}` : `1px solid ${t.border}`,
                        backgroundColor: !useTax ? t.productBg : t.cardBg,
                        color: !useTax ? t.productPrice : t.subText,
                        fontWeight: 'bold',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      OFF (内税/非課税)
                    </button>
                    <button
                      onClick={() => setUseTax(true)}
                      style={{
                        flex: 1,
                        padding: '10px 0',
                        borderRadius: '8px',
                        border: useTax ? `2px solid ${t.productPrice}` : `1px solid ${t.border}`,
                        backgroundColor: useTax ? t.productBg : t.cardBg,
                        color: useTax ? t.productPrice : t.subText,
                        fontWeight: 'bold',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      ON (外税計算)
                    </button>
                  </div>

                  {useTax && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: t.bg, padding: '10px 12px', borderRadius: '6px', border: `1px solid ${t.border}` }}>
                      <label style={{ fontSize: '14px', fontWeight: 'bold', color: t.text }}>適用税率:</label>
                      <input
                        type="number"
                        value={taxRate}
                        onChange={(e) => setTaxRate(Number(e.target.value))}
                        style={{ width: '70px', padding: '6px 8px', borderRadius: '4px', border: `1px solid ${t.border}`, fontSize: '15px', fontWeight: 'bold', textAlign: 'right', backgroundColor: t.cardBg, color: t.text }}
                      />
                      <span style={{ fontSize: '15px', fontWeight: 'bold', color: t.text }}>%</span>
                    </div>
                  )}
                </div>

                <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: '16px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: t.drawerText, margin: 0, textAlign: 'left' }}>📊 レジ用スプレッドシート連携</h3>
                    <button
                      onClick={() => setShowGasGuide(!showGasGuide)}
                      style={{
                        backgroundColor: t.productBg,
                        color: t.productPrice,
                        border: `1px solid ${t.productBorder}`,
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      {showGasGuide ? 'ガイドを閉じる' : '❓ 設定方法・解説'}
                    </button>
                  </div>
                  <p style={{ fontSize: '12px', color: t.subText, marginBottom: '10px', textAlign: 'left' }}>会計データをスプレッドシートへ送信・記録するか設定します。</p>

                  <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                    <button
                      onClick={() => setUseSpreadsheet(true)}
                      style={{
                        flex: 1,
                        padding: '10px 0',
                        borderRadius: '8px',
                        border: useSpreadsheet ? `2px solid ${t.productPrice}` : `1px solid ${t.border}`,
                        backgroundColor: useSpreadsheet ? t.productBg : t.cardBg,
                        color: useSpreadsheet ? t.productPrice : t.subText,
                        fontWeight: 'bold',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      ON (記録する)
                    </button>
                    <button
                      onClick={() => setUseSpreadsheet(false)}
                      style={{
                        flex: 1,
                        padding: '10px 0',
                        borderRadius: '8px',
                        border: !useSpreadsheet ? `2px solid ${t.productPrice}` : `1px solid ${t.border}`,
                        backgroundColor: !useSpreadsheet ? t.productBg : t.cardBg,
                        color: !useSpreadsheet ? t.productPrice : t.subText,
                        fontWeight: 'bold',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      OFF (記録しない)
                    </button>
                  </div>

                  {useSpreadsheet && (
                    <>
                      <input
                        type="text"
                        value={gasUrl}
                        onChange={(e) => setGasUrl(e.target.value)}
                        placeholder="https://script.google.com/macros/s/.../exec"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${t.border}`, fontSize: '13px', boxSizing: 'border-box', marginBottom: '8px', backgroundColor: t.bg, color: t.text }}
                      />

                      {gasUrl !== DEFAULT_GAS_URL && (
                        <button
                          onClick={() => setGasUrl(DEFAULT_GAS_URL)}
                          style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: '4px', padding: '6px 10px', fontSize: '12px', fontWeight: 'bold', color: t.subText, cursor: 'pointer', marginBottom: '8px' }}
                        >
                          デフォルトURLに戻す
                        </button>
                      )}
                    </>
                  )}

                  {showGasGuide && (
                    <div style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '12px 14px', fontSize: '13px', color: t.text, marginTop: '10px', lineHeight: '1.6', textAlign: 'left' }}>
                      <div style={{ fontWeight: 'bold', color: t.drawerText, marginBottom: '6px', borderBottom: `1px solid ${t.border}`, paddingBottom: '4px', fontSize: '14px', textAlign: 'left' }}>
                        📋 スプレッドシートの事前準備項目
                      </div>
                      <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: t.subText, textAlign: 'left' }}>
                        ※以下のプログラム（`SAMPLE_GAS_CODE`）を設定した場合、送信時に<b>1行目の見出し（ヘッダー）が自動作成</b>されます。手動で準備する場合は、スプレッドシートの1行目に以下の項目名を左右に並べて記載してください：
                      </p>
                      
                      <div style={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}`, borderRadius: '6px', padding: '8px 10px', fontSize: '12px', color: t.text, marginBottom: '14px', textAlign: 'left' }}>
                        <b>[ 基本データ列 ]</b><br />
                        `日時` / `会員番号` / `小計` / `消費税` / `お支払い合計` / `お預かり` / `お釣り`<br /><br />
                        <b>[ 商品・回数券数量列 ]</b><br />
                        `大人 A` / `子供 A` / `★大人回数券` ... （※登録している商品名・回数券名と同名の列）
                      </div>

                      <div style={{ fontWeight: 'bold', color: t.drawerText, marginBottom: '6px', borderBottom: `1px solid ${t.border}`, paddingBottom: '4px', fontSize: '14px', textAlign: 'left' }}>
                        📖 新しいスプレッドシートの作成手順
                      </div>
                      <ol style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                        <li style={{ textAlign: 'left' }}>連携したい<b>Googleスプレッドシート</b>を新規作成して開きます。</li>
                        <li style={{ textAlign: 'left' }}>画面上部メニューの<b>「拡張機能」➔「Apps Script」</b>をクリックします。</li>
                        <li style={{ textAlign: 'left' }}>表示されたエディタ内のコードを全消去し、以下のプログラムを貼り付けて保存（Ctrl+S）します：
                          <div style={{ backgroundColor: '#0f172a', color: '#38bdf8', padding: '6px 8px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '11px', marginTop: '4px', overflowX: 'auto', whiteSpace: 'pre', textAlign: 'left' }}>
                            {SAMPLE_GAS_CODE}
                          </div>
                        </li>
                        <li style={{ textAlign: 'left' }}>右上の<b>「デプロイ」➔「新しいデプロイ」</b>をクリックします。</li>
                        <li style={{ textAlign: 'left' }}>歯車アイコンで種類を<b>「ウェブアプリ」</b>に指定し、以下の通り設定します：
                          <ul style={{ paddingLeft: '16px', marginTop: '4px', textAlign: 'left' }}>
                            <li style={{ textAlign: 'left' }}><b>実行するユーザー:</b> 自分</li>
                            <li style={{ textAlign: 'left' }}><b>アクセスできるユーザー:</b> 全員（Anonymouse含む）</li>
                          </ul>
                        </li>
                        <li style={{ textAlign: 'left' }}><b>「デプロイ」</b>を押し、アクセス許可の承認を完了すると発行される<b>「ウェブアプリURL」</b>をコピーして上の入力欄に貼り付けます。</li>
                      </ol>
                    </div>
                  )}
                </div>

                <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: '16px', textAlign: 'left' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#dc2626', marginBottom: '6px', textAlign: 'left' }}>⚠️ 全体データのリセット</h3>
                  <p style={{ fontSize: '12px', color: t.subText, marginBottom: '10px', textAlign: 'left' }}>商品・連携URL・消費税・アプリ名等すべての設定を初期化します。</p>

                  <button
                    onClick={handleResetAllSettings}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#fee2e2',
                      color: '#dc2626',
                      border: '1px solid #fca5a5',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    ⚠️ アプリ全体の設定を初期化する
                  </button>
                </div>

              </div>
            )}

            {/* TAB 5: 🎨 カラーモード */}
            {activeTab === 'theme' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', textAlign: 'left' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: t.drawerText, margin: 0, textAlign: 'left' }}>テーマカラーの選択</h3>
                <p style={{ fontSize: '13px', color: t.subText, margin: 0, textAlign: 'left' }}>画面全体の配色プリセットを選択できます。</p>

                {(['light', 'dark'] as const).map((mode) => {
                  const themeItem = DEFAULT_THEMES[mode];
                  const isSelected = themeMode === mode;
                  return (
                    <button
                      key={mode}
                      onClick={() => setThemeMode(mode)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 16px',
                        borderRadius: '10px',
                        border: isSelected ? `2px solid ${t.productPrice}` : `1px solid ${t.border}`,
                        backgroundColor: themeItem.bg,
                        color: themeItem.text,
                        cursor: 'pointer',
                        boxShadow: isSelected ? '0 4px 6px -1px rgba(37, 99, 235, 0.2)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{themeItem.name}</span>
                      {isSelected && <span style={{ color: t.productPrice, fontWeight: 'bold', fontSize: '18px' }}>✓</span>}
                    </button>
                  );
                })}

                <button
                  onClick={() => setThemeMode('custom')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderRadius: '10px',
                    border: themeMode === 'custom' ? `2px solid ${t.productPrice}` : `1px solid ${t.border}`,
                    backgroundColor: t.cardBg,
                    color: t.text,
                    cursor: 'pointer',
                    boxShadow: themeMode === 'custom' ? '0 4px 6px -1px rgba(37, 99, 235, 0.2)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontWeight: 'bold', fontSize: '15px' }}>🎨 オリジナル</span>
                  {themeMode === 'custom' && <span style={{ color: t.productPrice, fontWeight: 'bold', fontSize: '18px' }}>✓</span>}
                </button>

                {themeMode === 'custom' && (
                  <div style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '16px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '14px', color: t.text, marginBottom: '2px' }}>✨ 好きな2色を選ぶだけで自動配色！</div>
                      <div style={{ fontSize: '12px', color: t.subText }}>メイン色とサブ色の2色から、おしゃれなテーマを全自動生成します。</div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ backgroundColor: t.cardBg, padding: '10px', borderRadius: '8px', border: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: t.text }}>① メインカラー</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="color"
                            value={customPrimary}
                            onChange={(e) => setCustomPrimary(e.target.value)}
                            style={{ border: 'none', width: '38px', height: '38px', cursor: 'pointer', borderRadius: '6px', backgroundColor: 'transparent' }}
                          />
                          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: t.subText }}>{customPrimary}</span>
                        </div>
                      </div>

                      <div style={{ backgroundColor: t.cardBg, padding: '10px', borderRadius: '8px', border: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: t.text }}>② サブカラー</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="color"
                            value={customSecondary}
                            onChange={(e) => setCustomSecondary(e.target.value)}
                            style={{ border: 'none', width: '38px', height: '38px', cursor: 'pointer', borderRadius: '6px', backgroundColor: 'transparent' }}
                          />
                          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: t.subText }}>{customSecondary}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: t.text, marginBottom: '8px' }}>💡 ワンタップおすすめ配色セット:</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {[
                          { name: 'ミント🌿', p: '#10b981', s: '#064e3b', bg: '#ffffff' },
                          { name: 'サクラ🌸', p: '#ec4899', s: '#831843', bg: '#ffffff' },
                          { name: 'オーシャン🌊', p: '#0284c7', s: '#0f172a', bg: '#ffffff' },
                          { name: 'サンセット🌅', p: '#f97316', s: '#7c2d12', bg: '#ffffff' },
                          { name: 'シック🖤', p: '#4b5563', s: '#111827', bg: '#1f2937' }
                        ].map(preset => (
                          <button
                            key={preset.name}
                            onClick={() => {
                              setCustomPrimary(preset.p);
                              setCustomSecondary(preset.s);
                              setCustomBgColor(preset.bg);
                            }}
                            style={{
                              backgroundColor: t.cardBg,
                              border: `1px solid ${t.border}`,
                              borderRadius: '6px',
                              padding: '6px 10px',
                              fontSize: '11px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              color: t.text
                            }}
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 6: ❓ FAQ ＆ 免責事項 */}
            {activeTab === 'faq' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '20px', textAlign: 'left', fontSize: '13px', color: t.text, lineHeight: '1.6' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: t.drawerText, margin: '0 0 10px 0', textAlign: 'left', borderBottom: `2px solid ${t.productPrice}`, paddingBottom: '4px' }}>❓ よくある質問（FAQ）</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '10px 12px' }}>
                      <div style={{ fontWeight: 'bold', color: t.drawerText, fontSize: '13px', marginBottom: '2px' }}>Q. インターネット接続がなくても使えますか？</div>
                      <div style={{ color: t.subText, fontSize: '12px' }}>A. はい、ブラウザ上で動作するため会計計算自体はオフラインでも可能です。スプレッドシートへの記録時のみオンライン接続が必要です。</div>
                    </div>

                    <div style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '10px 12px' }}>
                      <div style={{ fontWeight: 'bold', color: t.drawerText, fontSize: '13px', marginBottom: '2px' }}>Q. 設定した商品やカラーテーマは消えますか？</div>
                      <div style={{ color: t.subText, fontSize: '12px' }}>A. ブラウザの内部ストレージ（localStorage）に自動記憶されますので、ページを閉じても次回そのまま利用可能です。</div>
                    </div>

                    <div style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '10px 12px' }}>
                      <div style={{ fontWeight: 'bold', color: t.drawerText, fontSize: '13px', marginBottom: '2px' }}>Q. シートにデータが記録されません。</div>
                      <div style={{ color: t.subText, fontSize: '12px' }}>A. 「アプリ設定」タブでスプレッドシート連携が「ON」になっており、GASのウェブアプリURLが正しく設定されているかご確認ください。</div>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: '14px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: t.drawerText, margin: '0 0 8px 0', textAlign: 'left' }}>⚠️ 免責事項・注意事項</h3>
                  <div style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '12px', fontSize: '12px', color: t.text, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#dc2626', marginBottom: '2px' }}>【免責事項】</div>
                      本アプリの利用により生じたデータの消失・損失・不一致等の一切の損害について、開発者は責任を負いません。
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', color: t.drawerText, marginBottom: '2px' }}>【データ保存についての注意】</div>
                      本アプリはブラウザの `localStorage` を使用しています。シークレットモードやキャッシュ削除で履歴が消える点にご注意ください。
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', color: t.drawerText, marginBottom: '2px' }}>【GAS連携についての注意】</div>
                      GAS連携はGoogleアカウントの利用制限を受ける場合があります。重要な会計は念のため手元でもメモを推奨します。
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: '14px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: t.drawerText, margin: '0 0 8px 0', textAlign: 'left' }}>🔒 プライバシーポリシー（個人情報保護方針）</h3>
                  <div style={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '10px 12px', fontSize: '11px', color: t.subText }}>
                    本アプリ（以下「当サービス」）は、ユーザーのプライバシー保護を最優先に考えております。<br /><br />
                    <b>1. 収集する情報</b><br />
                    入力された会員番号、商品選択データおよび会計設定（テーマ色・店舗名等）は、ユーザーの端末（ローカルストレージ）および指定されたGoogleスプレッドシートに送信・保持されます。<br /><br />
                    <b>2. 利用目的</b><br />
                    収集したデータは、レジ会計の記録・売上集計およびアプリの設定保持のみに使用し、第三者へ無断で提供・販売することは一切ありません。
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: ✉️ お問い合わせ */}
            {activeTab === 'contact' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px', textAlign: 'left' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: t.drawerText, margin: 0, textAlign: 'left', borderBottom: `2px solid ${t.productPrice}`, paddingBottom: '4px' }}>✉️ お問い合わせ</h3>
                <p style={{ fontSize: '12px', color: t.subText, margin: 0 }}>ご意見・ご要望・不具合のご報告は以下のフォームより送信してください。</p>

                <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: t.text }}>お名前 <span style={{ color: '#dc2626' }}>*</span></label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="山田 太郎"
                      required
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: `1px solid ${t.border}`, fontSize: '13px', boxSizing: 'border-box', backgroundColor: t.bg, color: t.text }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: t.text }}>メールアドレス</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="example@email.com"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: `1px solid ${t.border}`, fontSize: '13px', boxSizing: 'border-box', backgroundColor: t.bg, color: t.text }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: t.text }}>件名</label>
                    <input
                      type="text"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      placeholder="機能の要望について"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: `1px solid ${t.border}`, fontSize: '13px', boxSizing: 'border-box', backgroundColor: t.bg, color: t.text }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: t.text }}>お問い合わせ内容 <span style={{ color: '#dc2626' }}>*</span></label>
                    <textarea
                      rows={5}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="お問い合わせ内容をご記入ください..."
                      required
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: `1px solid ${t.border}`, fontSize: '13px', boxSizing: 'border-box', fontFamily: 'sans-serif', backgroundColor: t.bg, color: t.text }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isContactSubmitting}
                    style={{ backgroundColor: isContactSubmitting ? t.subText : t.productPrice, color: '#ffffff', border: 'none', borderRadius: '6px', padding: '12px', fontWeight: 'bold', fontSize: '14px', cursor: isContactSubmitting ? 'wait' : 'pointer', marginTop: '6px' }}
                  >
                    {isContactSubmitting ? '送信中...' : '送信する'}
                  </button>
                </form>
              </div>
            )}

            {/* TAB 8: 📢 お知らせ */}
            {activeTab === 'news' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px', textAlign: 'left', fontSize: '13px', color: t.text, lineHeight: '1.6' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: t.drawerText, margin: 0, textAlign: 'left', borderBottom: `2px solid ${t.productPrice}`, paddingBottom: '4px' }}>📢 お知らせ一覧</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {NEWS_LIST.map((news) => (
                    <div
                      key={news.id}
                      onClick={() => {
                        setIsMenuOpen(false);
                        setSelectedNews(news);
                      }}
                      style={{
                        backgroundColor: t.bg,
                        border: `1px solid ${t.border}`,
                        borderRadius: '10px',
                        padding: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxSizing: 'border-box'
                      }}
                    >
                      <div style={{ fontSize: '11px', color: t.productPrice, fontWeight: 'bold', marginBottom: '4px' }}>
                        📅 {news.date}
                      </div>
                      <div style={{ fontWeight: 'bold', fontSize: '14px', color: t.text, marginBottom: '6px', lineHeight: '1.4' }}>
                        {news.title}
                      </div>
                      <div style={{ fontSize: '12px', color: t.subText, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {news.summary}
                      </div>
                      <div style={{ marginTop: '8px', fontSize: '12px', color: t.productPrice, fontWeight: 'bold', textAlign: 'right' }}>
                        記事を読む ➔
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 'auto', borderTop: `1px solid ${t.border}`, paddingTop: '16px', flexShrink: 0 }}>
              <button
                onClick={() => setIsMenuOpen(false)}
                style={{ width: '100%', backgroundColor: t.headerBg, color: t.headerText, border: 'none', borderRadius: '6px', padding: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
              >
                閉じる
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Vercel Analytics コンポーネント */}
      <Analytics />

    </div>
  );
}