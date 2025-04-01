import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom"; // Import useParams để lấy tham số từ URL
import "./chitiet.css";
import Header from "../../components/HeaderComponent/Header";
import Footer from "../../components/FooterComponent/Footer";
import AdvanceSearch from "../../components/AdvanceSearchComponent/AdvanceSearch";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from 'dayjs';

interface TinTuc {
  id_tin: number;
  tieude: string;
  hinhdaidien: string;
  mota: string;
  noidung: string;
  ngaydangtin: string;
  tacgia: string;
  solanxem: number;
  tinhot: boolean;
  trangthai: boolean;
  id_loaitin: number;
}

const ChiTietTinTuc = () => {
  const { id_tin } = useParams<{ id_tin: string }>(); // Lấy ID từ URL
  const { state } = useLocation(); // Lấy state từ location (nhomTin và loaiTin)
  const [news, setNews] = useState<TinTuc | null>(null);
  const [nhomTin] = useState(state?.nhomTin || []); // Nhận nhomTin từ state
  const [loaiTin] = useState(state?.loaiTin || []); // Nhận loaiTin từ state
  // const [filter, setFilter] = useState<{ type: string; id: number | null }>({ type: '', id: null });
  
  useEffect(() => {
    // Fetch dữ liệu từ API dựa trên id_tin
    const fetchData = async () => {
      try {
        const response = await fetch(`https://apiwebsitetintuc-production.up.railway.app/api/chitiettin/${id_tin}`);
        const result = await response.json();
        if (result.success) {
          setNews(result.data); // Lưu dữ liệu vào state
        } else {
          console.error("Không thể tải tin tức.");
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchData();
  }, [id_tin]); // Chạy lại khi id_tin thay đổi

  if (!news) return <div>Đang tải...</div>;
  // Tìm tên loại tin từ loaiTin
  const loaiTinName = loaiTin.find((loai: any) => loai.id_loaitin === news.id_loaitin)?.ten_loaitin || "Chưa xác định";
  const nhomTinId = loaiTin.find((loai: any) => loai.id_loaitin === news.id_loaitin)?.id_nhomtin;
  // Tìm tên nhóm tin từ nhomTin
  const nhomTinName = nhomTin.find((nhom: any) => nhom.id_nhomtin === nhomTinId)?.ten_nhomtin || "Chưa xác định";
  return (
    <div className="flex flex-col min-h-screen">
      <Header nhomTin={nhomTin} loaiTin={loaiTin} />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <main className="flex-grow mt-12 mb-8 flex gap-4">
          <div className="w-7/10">
            <div className="news-container">
              {/* Hiển thị tên loại tin và nhóm tin */}
              <div className="news-category">
                <span className="category-name"><span className="category-group">{nhomTinName} &gt; {loaiTinName}</span></span>
              </div>
              <h1 className="news-title">{news.tieude}</h1>
              <div className="flex justify-between items-center">
                {news.tinhot && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">HOT</span>
                )}
                <p className="text-gray-600 ml-auto">Lượt xem: {news.solanxem}</p>
              </div>
              <p className="news-description">{news.mota}</p>
              <img
                src={`https://apiwebsitetintuc-production.up.railway.app/hinhbao/${news.hinhdaidien}`}
                alt="Ảnh minh họa"
                className="news-image"
              />
              <div className="news-content">
                <p>{news.noidung}</p>
              </div>
              <div className="news-footer">
                <span>
                  Tác giả: <strong>{news.tacgia}</strong>
                </span>
                <span>Ngày đăng: {dayjs(news.ngaydangtin).format('DD/MM/YYYY H:mm:ss')}</span>
              </div>
            </div>
          </div>
          <div className="w-3/10 mt-12">
            <AdvanceSearch nhomTin={nhomTin} loaiTin={loaiTin} />
          </div>
        </main>
      </LocalizationProvider>

      <Footer />
    </div>
  );
};

export default ChiTietTinTuc;
