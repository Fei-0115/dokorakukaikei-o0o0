export type BlogPost = {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  content: {
    heading?: string;
    text: string;
    image?: string;
    imageCaption?: string;
  }[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'pos-setup-guide',
    title: '【完全ガイド】POSheepの使い方：初期設定から会計入力・スプレッドシート連携まで',
    date: '2026-10-19',
    category: '使い方ガイド',
    summary: '初めてPOSheepを使う方向けに、商品の追加方法、日常の会計操作、売上データの自動記録設定までを実際の操作画面付きで分かりやすく解説します。',
    content: [
      {
        heading: 'ステップ1：メイン画面と基本会計操作',
        text: 'POSheepを起動すると、左側に「商品選択」「回数券」リスト、右側に「お会計内容」が表示されます。\n購入される商品をタップするだけで右側のカートに商品が追加され、お預かり金額を入力するとお釣りまでリアルタイムで自動計算されます。',
        image: '/images/pos-main.png',
        imageCaption: '▲ 直感的で分かりやすいPOSheepのメイン会計画面'
      },
      {
        heading: 'ステップ2：商品・回数券リストの追加と編集',
        text: '画面右上の「編集モード」ボタン、または左上メニューの「会計項目」を開くことで、商品名や価格、割引額を自由に設定できます。\n項目の順序入れ替え（▲/▼）や削除もワンタップで行えます。',
        image: '/images/pos-items-edit.png',
        imageCaption: '▲ 商品や回数券の追加・並び替えが簡単に行える編集メニュー'
      },
      {
        heading: 'ステップ3：アプリ設定とGoogleスプレッドシート連携',
        text: '左上メニューの「アプリ設定」から、店舗タイトルの変更や会員番号入力機能のON/OFF、外税・内税の切り替えを設定できます。\n「スプレッドシート連携」をONにし、GASのウェブアプリURLを登録することで、会計データが全自動でGoogleスプレッドシートへ記録されます。',
        image: '/images/pos-settings.png',
        imageCaption: '▲ スプレッドシート連携や税率設定を行うアプリ設定画面'
      }
    ]
  },
  {
    id: 'spreadsheet-gas-tutorial',
    title: 'Googleスプレッドシート連携手順：GAS（Apps Script）の5分簡単設定',
    date: '2026-10-18',
    category: '連携設定',
    summary: 'POSheepの売上データを自動集計するためのGoogleスプレッドシートおよびApps Scriptのデプロイ手順を解説します。',
    content: [
      {
        heading: '1. アプリ設定からスプレッドシート連携を有効化する',
        text: 'POSheepメニューの「アプリ設定」を開き、スプレッドシート連携を「ON (記録する)」に切り替えます。発行されたウェブアプリURLをフォームに入力するだけで自動連携が完了します。',
        image: '/images/pos-settings.png',
        imageCaption: '▲ アプリ設定画面からURLを入力して連携完了'
      }
    ]
  },
  {
    id: 'history-edit-guide',
    title: '会計履歴の確認と修正方法：打刻ミスやキャンセル時の対応手順',
    date: '2026-10-17',
    category: '運用ノウハウ',
    summary: '誤って入力した会計の二重線修正や、後からのまとめてデータ送信機能の使い方を詳しく解説します。',
    content: [
      {
        heading: 'メイン操作画面と履歴データの安全管理',
        text: 'メイン画面の「1. 会計を完了する」ボタンを押すと会計データが保存されます。万が一誤入力があった場合でも、メニュー内の「会計履歴」から修正を行うことができ、打ち消し線付きで変更履歴が安全に残ります。',
        image: '/images/pos-main.png',
        imageCaption: '▲ 会計完了後も安全に履歴を管理・修正可能です'
      }
    ]
  },
  {
    id: 'theme-custom-guide',
    title: '店舗カラーに合わせたスマートテーマ・デザインの切り替え手順',
    date: '2026-10-16',
    category: 'カスタマイズ',
    summary: 'イベントの雰囲気や自店のブランドカラーに合わせてレジ画面の色をワンタップで変更する方法を案内します。',
    content: [
      {
        heading: '直感的な画面UIとカラーカスタム',
        text: 'POSheepはパソコン・タブレット・スマホ全対応のレスポンシブデザインです。お店のイメージに合わせたカラーテーマの変更に対応しています。',
        image: '/images/pos-main.png',
        imageCaption: '▲ 店舗や環境に合わせて見やすい画面カラーへ変更可能'
      }
    ]
  },
  {
    id: 'tax-member-setting',
    title: '会員番号入力・内税外税計算・チケット割引の設定と活用方法',
    date: '2026-10-15',
    category: '機能設定',
    summary: 'POSheepで提供している各種便利機能（会員番号テンキー、外税計算、回数券割引）のON/OFF切り替えガイドです。',
    content: [
      {
        heading: '店舗運用に合わせた設定変更',
        text: '「アプリ設定」画面から会員番号入力機能のON/OFFや消費税（外税・内税）計算の切り替えが可能です。不要な機能をオフにすることで、最小限のシンプルなレジ画面にカスタマイズできます。',
        image: '/images/pos-settings.png',
        imageCaption: '▲ 会員番号表示や消費税設定を切り替えられる設定パネル'
      }
    ]
  }
];