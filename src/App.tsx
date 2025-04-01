import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TrangChu from "./pages/TrangChuPage/TrangChu";
import FilterTinTuc from "./pages/FilterTinTucPage/FilterTinTuc";
import ChiTietTinTuc from "./pages/ChiTietTinTucPage/chitiet"
function App() {

  return (

    <BrowserRouter basename='/WebsiteTinTuc/'>
      <Routes>
        <Route path="/" element={<TrangChu />} />
        {/* Đường dẫn cho trang chi tiết tin tức */}
        <Route path="/chitiet/:id_tin" element={<ChiTietTinTuc />} />
        <Route path="/tintuc" element={<FilterTinTuc />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
