import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TrangChu from "./pages/TrangChuPage/TrangChu";
import FilterTinTuc from "./pages/FilterTinTucPage/FilterTinTuc";
import ChiTietTinTuc from "./pages/ChiTietTinTucPage/chitiet";
import LoginAdminPage from './pages/AdminPage/login';
import QL_nhomtin from './pages/AdminPage/QL_nhomtin';
import QLTin from './pages/QLyTinPage/QLyTin';
import AddEditTin from './pages/QLyTinPage/AddEditTin';
import QLBL from './pages/QLyBinhLuanPage/QuanlyBL';
import QLLT from './pages/QLyLoaiTinPage/quanlitin';
import { ToastContainer } from 'react-toastify';
function App() {

  return (
    <>
      <ToastContainer />
      <BrowserRouter basename='/WebsiteTinTuc/'>
        <Routes>
          <Route path="/" element={<TrangChu />} />
          {/* Đường dẫn cho trang chi tiết tin tức */}
          <Route path="/:slug/:id_tin" element={<ChiTietTinTuc />} />
          <Route path="/tintuc" element={<FilterTinTuc />} />
          <Route path="/admin" element={<LoginAdminPage />} />
          <Route path="/qltin" element={<QLTin />} />
          <Route path="/add-edit-tin" element={<AddEditTin />} />
          <Route path="/add-edit-tin/:id_tin" element={<AddEditTin />} />
          <Route path="/qlnhomtin" element={<QL_nhomtin />} />
          <Route path="/qlbinhluan" element={<QLBL />} />
          <Route path="/qlloaitin" element={<QLLT />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
