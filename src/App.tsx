import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';
import PosAppPage from './pages/PosAppPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ① トップページ（説明・使い方ガイド・開発ストーリー） */}
        <Route path="/" element={<LandingPage />} />

        {/* ② ブログ・コラム一覧 */}
        <Route path="/blog" element={<BlogListPage />} />

        {/* ③ ブログ・コラム詳細 */}
        <Route path="/blog/:id" element={<BlogPostPage />} />

        {/* ④ POSレジツール本体（AdSenseタグなし） */}
        <Route path="/app" element={<PosAppPage />} />
      </Routes>
    </BrowserRouter>
  );
}