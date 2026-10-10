import { useState, useEffect } from 'react';

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

type ThemeMode = 'light' | 'dark' | 'vivid' | 'pastel' | 'custom';

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
  vivid: {
    name: '⚡ ビタミン',
    bg: '#fff7ed',
    cardBg: '#ffffff',
    text: '#7c2d12',
    subText: '#9a3412',
    border: '#fed7aa',
    headerBg: '#ff6b00',
    headerText: '#ffffff',
    headerTimeColor: '#ffffff',
    productBg: '#ffedd5',
    productBorder: '#fdba74',
    productText: '#9a3412',
    productPrice: '#ea580c',
    ticketBg: '#ecfdf5',
    ticketBorder: '#6ee7b7',
    ticketText: '#065f46',
    ticketAmount: '#059669',
    cartBg: '#ffecd1',
    cartText: '#7c2d12',
    cartItemBg: '#fed7aa',
    summaryBg: '#fdba74',
    accentTotal: '#c2410c',
    accentChange: '#047857',
    quickBtnBg: '#f97316',
    quickBtnText: '#ffffff',
    drawerBg: '#ffffff',
    drawerText: '#7c2d12',
  },
  pastel: {
    name: '🌸 パステル',
    bg: '#fff5f7',
    cardBg: '#ffffff',
    text: '#831843',
    subText: '#9d174d',
    border: '#fbcfe8',
    headerBg: '#fce7f3',
    headerText: '#831843',
    headerTimeColor: '#db2777',
    productBg: '#fdf2f8',
    productBorder: '#fbcfe8',
    productText: '#831843',
    productPrice: '#db2777',
    ticketBg: '#f0fdf4',
    ticketBorder: '#bbf7d0',
    ticketText: '#166534',
    ticketAmount: '#16a34a',
    cartBg: '#fce7f3',
    cartText: '#831843',
    cartItemBg: '#fbcfe8',
    summaryBg: '#fbcfe8',
    accentTotal: '#be185d',
    accentChange: '#15803d',
    quickBtnBg: '#f472b6',
    quickBtnText: '#ffffff',
    drawerBg: '#ffffff',
    drawerText: '#831843',
  },
};

// 色の明暗判定
function getContrastingTextColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#0f172a' : '#ffffff';
}

function getContrastingSubTextColor(hexColor: string): string {
  const isLightBg = getContrastingTextColor(hexColor) === '#0f172a';
  return isLightBg ? '#475569' : '#e2e8f0';
}

// カスタムテーマ生成関数
function generateCustomTheme(primary: string, secondary: string, customBg: string, cardBg: string): ThemeConfig {
  const headerText = getContrastingTextColor(primary);
  const cartText = getContrastingTextColor(secondary);
  const cardText = getContrastingTextColor(cardBg);
  const cardSubText = getContrastingSubTextColor(cardBg);

  const isCartLight = cartText === '#0f172a';

  return {
    name: '🎨 カスタム（オリジナル）',
    bg: customBg,
    cardBg: cardBg,
    text: cardText,
    subText: cardSubText,
    border: cardText === '#ffffff' ? 'rgba(255,255,255,0.2)' : '#cbd5e1',
    headerBg: primary,
    headerText: headerText,
    headerTimeColor: headerText,
    productBg: `${primary}18`,
    productBorder: `${primary}50`,
    productText: cardText,
    productPrice: primary,
    ticketBg: '#ecfdf5',
    ticketBorder: '#6ee7b7',
    ticketText: '#065f46',
    ticketAmount: '#059669',
    cartBg: secondary,
    cartText: cartText,
    cartItemBg: isCartLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.15)',
    summaryBg: isCartLight ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.25)',
    accentTotal: isCartLight ? '#f59e0b' : '#fde047',
    accentChange: isCartLight ? '#047857' : '#4ade80',
    quickBtnBg: primary,
    quickBtnText: getContrastingTextColor(primary),
    drawerBg: cardBg,
    drawerText: cardText,
  };
}

// 羊ロゴSVG
const OctagonSheepLogo = ({ color = '#ffffff' }: { color?: string }) => (
  <svg
    width="32"
    height="32"
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
    <path
      d="M38,91 C38,97 44,97 44,91 Z"
      stroke={color}
      strokeWidth="3.5"
      fill={color}
    />
    <path
      d="M56,91 C56,97 62,97 62,91 Z"
      stroke={color}
      strokeWidth="3.5"
      fill={color}
    />
    <path
      d="M38,40 C32,40 28,46 30,52 C26,56 28,64 34,66 C38,74 62,74 66,66 C72,64 74,56 70,52 C72,46 68,40 62,40 C58,34 42,34 38,40 Z"
      stroke={color}
      strokeWidth="3.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M34,42 C20,32 10,46 18,58 C24,66 34,60 30,50 C28,44 22,46 22,50"
      stroke={color}
      strokeWidth="3.5"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M66,42 C80,32 90,46 82,58 C76,66 66,60 70,50 C72,44 78,46 78,50"
      stroke={color}
      strokeWidth="3.5"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="43" cy="51" r="2.5" fill={color} />
    <circle cx="57" cy="51" r="2.5" fill={color} />
    <path
      d="M50,56 L50,60 M46,63 C48,65 52,65 54,63"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

// ==========================================
// 2. Google Apps Script（GAS）URL
// ==========================================
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
  // アプリ設定（初期名を「どこレジ」に変更）
  const [appName, setAppName] = useState<string>(() => {
    return localStorage.getItem('pos_app_name') || 'どこレジ';
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
    return saved ? JSON.parse(saved) : true;
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
    return localStorage.getItem('pos_custom_secondary') || '#5f8263';
  });

  const [customBg, setCustomBg] = useState<string>(() => {
    return localStorage.getItem('pos_custom_bg') || '#7ec994';
  });

  const [customCardBg, setCustomCardBg] = useState<string>(() => {
    return localStorage.getItem('pos_custom_card_bg') || '#f0fbf4';
  });

  const t = themeMode === 'custom' 
    ? generateCustomTheme(customPrimary, customSecondary, customBg, customCardBg) 
    : DEFAULT_THEMES[themeMode];

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'items' | 'theme' | 'settings' | 'guide' | 'faq' | 'contact'>('items');

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);

  const [expandModalType, setExpandModalType] = useState<'products' | 'tickets' | null>(null);

  const [products, setProducts] = useState<Item[]>(() => {
    const saved = localStorage.getItem('pos_products');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem('pos_tickets');
    return saved ? JSON.parse(saved) : DEFAULT_TICKETS;
  });

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
    localStorage.setItem('pos_custom_bg', customBg);
  }, [customBg]);

  useEffect(() => {
    localStorage.setItem('pos_custom_card_bg', customCardBg);
  }, [customCardBg]);

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
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
  });
  const formattedTime = currentTime.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

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

      alert(`お問い合わせを受け付けました。\nご送信ありがとうございました。`);
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
    if (confirm('⚠️ アプリ全体のすべての設定（商品・連携URL・消費税・アプリ名・テーマ等）を初期化しますか？')) {
      setProducts(DEFAULT_PRODUCTS);
      setTickets(DEFAULT_TICKETS);
      setAppName('どこレジ');
      setProductSectionTitle('商品選択');
      setTicketSectionTitle('回数券');
      setUseMemberNumber(true);
      setUseTickets(true);
      setUseTax(false);
      setTaxRate(10);
      setUseSpreadsheet(true);
      setGasUrl(DEFAULT_GAS_URL);
      setThemeMode('light');
      setCustomPrimary('#27925c');
      setCustomSecondary('#5f8263');
      setCustomBg('#7ec994');
      setCustomCardBg('#f0fbf4');

      localStorage.removeItem('pos_products');
      localStorage.removeItem('pos_tickets');
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
      localStorage.removeItem('pos_custom_bg');
      localStorage.removeItem('pos_custom_card_bg');

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
    alert(`お会計完了！\n\nお釣り: ¥${changeAmount.toLocaleString()}`);
    clearCart();
  };

  const handleCheckoutStep1 = () => {
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

    if (!gasUrl || gasUrl.trim() === '') {
      alert('送信先のスプレッドシートURL（GAS URL）が設定されていません。アプリ設定から設定してください。');
      return;
    }

    setIsSubmitting(true);

    const payload: Record<string, any> = {
      '日時': `${formattedDate} ${formattedTime}`,
      '会員番号': useMemberNumber ? (memberNumber || 'なし') : '非使用',
      '小計': subtotal,
      [`消費税(${taxRate}%)`]: taxAmount,
      'お支払い合計': totalAmount,
      'お預かり': numericReceived,
      'お釣り': changeAmount,
    };

    products.forEach((product) => {
      const cartItem = cart.find((c) => c.item.id === product.id);
      payload[product.name] = cartItem ? cartItem.quantity : 0;
    });

    if (useTickets) {
      tickets.forEach((ticket) => {
        const ticketItem = appliedTickets.find((t) => t.ticket.id === ticket.id);
        payload[ticket.name] = ticketItem ? ticketItem.quantity : 0;
      });
    }

    try {
      await fetch(gasUrl, {
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
      backgroundColor: t.bg,
      padding: '12px 16px',
      gap: '12px',
      boxSizing: 'border-box',
      transition: 'background-color 0.3s ease',
      overflowX: 'hidden'
    }}>
      
      {/* 1. ヘッダー（中央寄りずれ防止＆左右フィット） */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: t.headerBg,
        padding: '10px 16px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
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

          <OctagonSheepLogo color={t.headerText} />

          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: t.headerText, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {appName}
          </h1>
        </div>
        
        <div style={{ fontSize: '13px', fontWeight: 'bold', color: t.headerTimeColor, display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0, whiteSpace: 'nowrap' }}>
          <span>{formattedDate}</span>
          <span style={{ fontSize: '15px', fontFamily: 'monospace' }}>{formattedTime}</span>
        </div>
      </div>

      {/* メインエリア（右寄り防止・レスポンシブ整列） */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', width: '100%', flex: 1, boxSizing: 'border-box' }}>
        
        {/* 左側：商品・回数券選択 */}
        <div style={{
          flex: '1 1 500px',
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
            {/* 会員番号（ONの時のみ表示） */}
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

            {/* カスタマイズ可能な商品選択セクション見出し */}
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', color: t.text, textAlign: 'left' }}>{productSectionTitle}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px', marginBottom: '16px' }}>
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  style={{
                    padding: '12px 14px',
                    backgroundColor: t.productBg,
                    border: `1px solid ${t.productBorder}`,
                    borderRadius: '8px',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '15px', color: t.productText }}>{product.name}</div>
                  <div style={{ color: t.productPrice, fontWeight: 'bold', marginTop: '4px', fontSize: '14px' }}>¥{product.price.toLocaleString()}</div>
                </button>
              ))}
            </div>

            {/* 回数券（ONの時のみ表示） */}
            {useTickets && (
              <>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', color: t.text, borderTop: `1px solid ${t.border}`, paddingTop: '12px', textAlign: 'left' }}>{ticketSectionTitle}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px', marginBottom: '12px' }}>
                  {tickets.map((ticket) => (
                    <button
                      key={ticket.id}
                      onClick={() => applyTicket(ticket)}
                      style={{
                        padding: '12px 14px',
                        backgroundColor: t.ticketBg,
                        border: `1px solid ${t.ticketBorder}`,
                        borderRadius: '8px',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: 'bold', fontSize: '15px', color: t.ticketText }}>{ticket.name}</div>
                      <div style={{ color: t.ticketAmount, fontWeight: 'bold', marginTop: '4px', fontSize: '14px' }}>-¥{ticket.amount.toLocaleString()}</div>
                    </button>
                  ))}
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

        {/* 右側：会計内容（右端見切れ防止） */}
        <div style={{
          flex: '1 1 360px',
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: `1px solid ${themeMode === 'pastel' || themeMode === 'vivid' ? t.border : 'rgba(255,255,255,0.15)'}`, paddingBottom: '6px', flexShrink: 0 }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: t.cartText, margin: 0 }}>お会計内容</h2>
              {useMemberNumber && memberNumber && (
                <span style={{ fontSize: '14px', color: t.cartText, fontWeight: 'bold' }}>会員: {memberNumber}</span>
              )}
            </div>

            {/* カート明細リスト */}
            <div style={{ flex: 1, maxHeight: '280px', overflowY: 'auto', marginBottom: '12px', paddingRight: '4px' }}>
              {cart.length === 0 && appliedTickets.length === 0 ? (
                <div style={{ color: t.cartText, fontSize: '16px', textAlign: 'left', opacity: 0.8 }}>商品または回数券を選択してください</div>
              ) : (
                <>
                  {cart.map((c) => (
                    <div key={c.item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '15px', marginBottom: '8px', backgroundColor: t.cartItemBg, padding: '8px 12px', borderRadius: '6px', textAlign: 'left' }}>
                      <div style={{ flex: 1, minWidth: 0, paddingRight: '6px', textAlign: 'left' }}>
                        <div style={{ fontWeight: 'bold', color: t.cartText, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', textAlign: 'left' }}>{c.item.name}</div>
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
                        <div style={{ fontWeight: 'bold', color: t.ticketText, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', textAlign: 'left' }}>【回数券】{tItem.ticket.name}</div>
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
            border: `1px solid ${themeMode === 'vivid' ? '#f97316' : themeMode === 'pastel' ? '#f472b6' : 'rgba(128,128,128,0.2)'}`,
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

            {/* クイックお預かりボタン */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', marginBottom: '10px' }}>
              <button
                onClick={() => setReceivedAmount(totalAmount)}
                style={{
                  backgroundColor: t.quickBtnBg,
                  color: t.quickBtnText,
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 0px',
                  fontSize: '11px',
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
                  fontSize: '11px',
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
                  fontSize: '11px',
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
                  fontSize: '11px',
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
                  fontSize: '11px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                +¥10000
              </button>
            </div>

            {/* お預かり入力欄 */}
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
                  backgroundColor: themeMode === 'vivid' || themeMode === 'pastel' || getContrastingTextColor(t.summaryBg) === '#0f172a' ? '#ffffff' : 'rgba(0,0,0,0.3)',
                  color: getContrastingTextColor(t.summaryBg) === '#0f172a' ? '#0f172a' : '#ffffff',
                  border: '1px solid rgba(128,128,128,0.4)',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  cursor: 'pointer'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${themeMode === 'vivid' ? '#f97316' : themeMode === 'pastel' ? '#f472b6' : 'rgba(128,128,128,0.2)'}`, paddingTop: '8px' }}>
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
                    flex: '1 1 130px',
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
                    flex: '1 1 130px',
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

      {/* お預かり現金テンキー */}
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

      {/* ========================================== */}
      {/* 項目一覧 全画面表示モーダル */}
      {/* ========================================== */}
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
                {expandModalType === 'products' ? `📦 ${productSectionTitle}一覧` : `🎟️ ${ticketSectionTitle}一覧`}
              </h3>
              <button onClick={() => setExpandModalType(null)} style={{ border: 'none', backgroundColor: 'transparent', fontSize: '22px', cursor: 'pointer', color: t.subText }}>✕</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
              {expandModalType === 'products' ? (
                products.map((p, index) => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderBottom: `1px solid ${t.border}`, backgroundColor: t.bg, marginBottom: '6px', borderRadius: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 'bold', color: t.text, flex: 1, textAlign: 'left' }}>{p.name} <span style={{ color: t.productPrice, fontWeight: 'bold' }}>(¥{p.price.toLocaleString()})</span></span>
                    
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <button onClick={() => handleMoveProduct(index, 'up')} disabled={index === 0} style={{ border: `1px solid ${t.border}`, backgroundColor: t.cardBg, color: t.text, borderRadius: '4px', padding: '6px 12px', cursor: index === 0 ? 'default' : 'pointer', fontSize: '13px', fontWeight: 'bold' }}>▲</button>
                      <button onClick={() => handleMoveProduct(index, 'down')} disabled={index === products.length - 1} style={{ border: `1px solid ${t.border}`, backgroundColor: t.cardBg, color: t.text, borderRadius: '4px', padding: '6px 12px', cursor: index === products.length - 1 ? 'default' : 'pointer', fontSize: '13px', fontWeight: 'bold' }}>▼</button>
                      <button onClick={() => handleDeleteProduct(p.id)} style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '13px', cursor: 'pointer', marginLeft: '4px', fontWeight: 'bold' }}>削除</button>
                    </div>
                  </div>
                ))
              ) : (
                tickets.map((tItem, index) => (
                  <div key={tItem.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderBottom: `1px solid ${t.border}`, backgroundColor: t.bg, marginBottom: '6px', borderRadius: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 'bold', color: t.ticketText, flex: 1, textAlign: 'left' }}>{tItem.name} <span style={{ color: t.ticketAmount, fontWeight: 'bold' }}>(-¥{tItem.amount.toLocaleString()})</span></span>
                    
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
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

      {/* ========================================== */}
      {/* 5. カラーテーマ連動 ドロワーメニュー */}
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
              maxWidth: '440px',
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
            {/* 6つのタブ切替バー ＆ 閉じるボタン */}
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
                    fontSize: '12px',
                    color: activeTab === 'items' ? t.productPrice : t.subText,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  ⚙️ 会計項目
                </button>
                <button
                  onClick={() => setActiveTab('theme')}
                  style={{
                    padding: '8px 6px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    borderBottom: activeTab === 'theme' ? `3px solid ${t.productPrice}` : 'none',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    color: activeTab === 'theme' ? t.productPrice : t.subText,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  🎨 カラー
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  style={{
                    padding: '8px 6px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    borderBottom: activeTab === 'settings' ? `3px solid ${t.productPrice}` : 'none',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    color: activeTab === 'settings' ? t.productPrice : t.subText,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  ✏️ アプリ設定
                </button>
                <button
                  onClick={() => setActiveTab('guide')}
                  style={{
                    padding: '8px 6px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    borderBottom: activeTab === 'guide' ? `3px solid ${t.productPrice}` : 'none',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    color: activeTab === 'guide' ? t.productPrice : t.subText,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  📖 使い方
                </button>
                <button
                  onClick={() => setActiveTab('faq')}
                  style={{
                    padding: '8px 6px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    borderBottom: activeTab === 'faq' ? `3px solid ${t.productPrice}` : 'none',
                    fontWeight: 'bold',
                    fontSize: '12px',
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
                    fontSize: '12px',
                    color: activeTab === 'contact' ? t.productPrice : t.subText,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  ✉️ お問い合わせ
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
                    <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: t.drawerText, margin: 0, textAlign: 'left' }}>{productSectionTitle}リストの編集</h3>
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
                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: t.text, flex: 1, textAlign: 'left' }}>{p.name} <span style={{ color: t.productPrice, fontWeight: 'normal' }}>(¥{p.price.toLocaleString()})</span></span>
                        
                        <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
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
                          <span style={{ fontSize: '13px', fontWeight: 'bold', color: t.ticketText, flex: 1, textAlign: 'left' }}>{tItem.name} <span style={{ color: t.ticketAmount, fontWeight: 'normal' }}>(-¥{tItem.amount.toLocaleString()})</span></span>
                          
                          <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
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

            {/* TAB 2: カラーモードの編集 */}
            {activeTab === 'theme' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', textAlign: 'left' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: t.drawerText, margin: 0, textAlign: 'left' }}>テーマカラーの選択</h3>
                <p style={{ fontSize: '13px', color: t.subText, margin: 0, textAlign: 'left' }}>画面全体の配色を切り替えます。</p>

                {(['light', 'dark', 'vivid', 'pastel'] as const).map((mode) => {
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
                  <span style={{ fontWeight: 'bold', fontSize: '15px' }}>🎨 カスタム（オリジナル）</span>
                  {themeMode === 'custom' && <span style={{ color: t.productPrice, fontWeight: 'bold', fontSize: '18px' }}>✓</span>}
                </button>

                {themeMode === 'custom' && (
                  <div style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '14px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px', color: t.text }}>オリジナル配色の自由作成</div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 'bold', color: t.text }}>メインカラー</div>
                        <div style={{ fontSize: '11px', color: t.subText }}>ヘッダー・ボタン・アクセント</div>
                      </div>
                      <input
                        type="color"
                        value={customPrimary}
                        onChange={(e) => setCustomPrimary(e.target.value)}
                        style={{ border: 'none', width: '36px', height: '36px', cursor: 'pointer', borderRadius: '6px', backgroundColor: 'transparent' }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 'bold', color: t.text }}>サブカラー</div>
                        <div style={{ fontSize: '11px', color: t.subText }}>右側お会計内容エリア</div>
                      </div>
                      <input
                        type="color"
                        value={customSecondary}
                        onChange={(e) => setCustomSecondary(e.target.value)}
                        style={{ border: 'none', width: '36px', height: '36px', cursor: 'pointer', borderRadius: '6px', backgroundColor: 'transparent' }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 'bold', color: t.text }}>商品エリア背景カラー</div>
                        <div style={{ fontSize: '11px', color: t.subText }}>左側商品選択カード背景</div>
                      </div>
                      <input
                        type="color"
                        value={customCardBg}
                        onChange={(e) => setCustomCardBg(e.target.value)}
                        style={{ border: 'none', width: '36px', height: '36px', cursor: 'pointer', borderRadius: '6px', backgroundColor: 'transparent' }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 'bold', color: t.text }}>全体画面背景カラー</div>
                        <div style={{ fontSize: '11px', color: t.subText }}>アプリ全体のバックグラウンド</div>
                      </div>
                      <input
                        type="color"
                        value={customBg}
                        onChange={(e) => setCustomBg(e.target.value)}
                        style={{ border: 'none', width: '36px', height: '36px', cursor: 'pointer', borderRadius: '6px', backgroundColor: 'transparent' }}
                      />
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 3: アプリ設定 */}
            {activeTab === 'settings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px', textAlign: 'left' }}>
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: t.drawerText, marginBottom: '6px', textAlign: 'left' }}>アプリ名の変更</h3>
                    <input
                      type="text"
                      value={appName}
                      onChange={(e) => setAppName(e.target.value)}
                      placeholder="例: どこレジ"
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
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#dc2626', marginBottom: '6px', textAlign: 'left' }}>全体データのリセット</h3>
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

            {/* TAB 4: 📖 使い方 */}
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

            {/* TAB 5: ❓ FAQ ＆ プライバシーポリシー */}
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

            {/* TAB 6: ✉️ お問い合わせ */}
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

            {/* フッター */}
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

    </div>
  );
}