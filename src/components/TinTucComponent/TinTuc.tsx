import React, { useState, useEffect } from "react";
// import { TinTucProps } from "./types"; // Create a separate type file for props if needed
import "./TinTucList.css";
import dayjs from 'dayjs';
import { Link } from "react-router-dom"; // Import Link từ react-router-dom
import { useLocation } from "react-router-dom";
import { toSlug } from "../../Helper/MyHelper"; // hoặc đường dẫn phù hợp với cấu trúc thư mục

// Define the props type for TinTuc component
interface TinTucProps {
  Tin: Array<{
    id_tin: number;
    tieude: string;
    hinhdaidien: string;
    mota: string;
    noidung: string;
    ngaydangtin: string;
    tacgia: string;
    solanxem: number;
    tinhot: boolean;
    id_loaitin: number;
  }>;
  loaiTin: Array<{
    id_loaitin: number;
    ten_loaitin: string;
    id_nhomtin: number;
  }>;
  nhomTin: Array<{
    id_nhomtin: number;
    ten_nhomtin: string;
  }>;
}


const TinTuc: React.FC<TinTucProps> = ({ Tin, loaiTin, nhomTin }) => {
  const [visibleCount, setVisibleCount] = useState(6); // Show 4 items initially
  const [title, setTitle] = useState<string>("");

  const location = useLocation();  // Lấy location từ React Router

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const idLoaiTin = queryParams.get('id_loaitin');
    const idNhomTin = queryParams.get('id_nhomtin');

    if (idLoaiTin) {
      const loai = loaiTin.find((loai) => loai.id_loaitin === Number(idLoaiTin));
      // Tìm tên nhóm tin dựa trên id_nhomtin trong loaiTin
      const nhom = nhomTin.find((nhom) => nhom.id_nhomtin === loai?.id_nhomtin);
      setTitle(nhom && loai ? `${nhom.ten_nhomtin} > ${loai.ten_loaitin}` : "Loại tin không xác định");
    } else if (idNhomTin) {
      const nhom = nhomTin.find((nhom) => nhom.id_nhomtin === Number(idNhomTin));
      setTitle(nhom ? nhom.ten_nhomtin : "Nhóm tin không xác định");
    } else {
      setTitle("Trang Chủ");
    }
  }, [location, loaiTin, nhomTin]);

  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + 18); // Load 6 more items each time
  };

  return (
    <div className="search-result-page">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <div className="news-cards-grid">
        {Tin.slice(0, visibleCount).map((item, index) => {
          // Định dạng ngày giờ ngay tại đây
          const formattedDate = dayjs(item.ngaydangtin).format('DD/MM/YYYY H:m:s');
          // Tìm tên loại tin từ loaiTin dựa trên id_loaitin của bài tin
          const loaiTinName = loaiTin.find(loai => loai.id_loaitin === item.id_loaitin)?.ten_loaitin || "Chưa xác định";
          return (
            <div className="news-card-v2" key={index}>
              <img
                src={`${item.hinhdaidien}`} // Update path if necessary
                alt="ảnh tin"
                className="thumb"
              />
              <div className="info">
                {/* Tên loại tin phía trên ngày đăng tin */}
                <div className="flex justify-between items-center">
                  <span className="text-blue-500 font-semibold">{loaiTinName}</span>
                  {item.tinhot && (
                    <span className={`tag px-2 py-1 rounded-full text-white`}>
                      HOT
                    </span>
                  )}
                </div>
                {/* Thông tin ngày đăng và trạng thái */}
                <div className="flex justify-between items-center text-md text-gray-500">
                  <small>{formattedDate}</small> {/* Hiển thị ngày đã được định dạng */}
                </div>
                <h3 className="text-xl font-semibold">
                  {/* Sử dụng Link để điều hướng tới trang chi tiết và truyền nhomTin, loaiTin */}
                  <Link
                    to={`/${toSlug(item.tieude)}/${item.id_tin}`} // Địa chỉ trang chi tiết
                    state={{ nhomTin, loaiTin }} // Truyền nhomTin và loaiTin qua state
                    className="text-blue-600"
                  >
                    {item.tieude}
                  </Link>
                </h3>
                <p className="mt-2 text-gray-600">{item.mota}</p>

                <div className="mt-3">
                  {/* Cải thiện bố cục của tác giả và lượt xem */}
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-700">tác giả: {item.tacgia}</p>
                    <p className="text-sm text-gray-700">lượt xem: {item.solanxem}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {visibleCount < Tin.length && (
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button className="load-more-btn" onClick={handleLoadMore}>
            Xem thêm
          </button>
        </div>
      )}
    </div>
  );
};

export default TinTuc;
