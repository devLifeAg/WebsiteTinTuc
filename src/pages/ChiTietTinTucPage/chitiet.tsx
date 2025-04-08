import { useEffect, useState } from "react";
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
  const { slug, id_tin } = useParams<{ slug: string; id_tin: string }>();
  const { state } = useLocation(); // Lấy state từ location (nhomTin và loaiTin)
  const [news, setNews] = useState<TinTuc | null>(null);
  const [nhomTin] = useState(state?.nhomTin || []); // Nhận nhomTin từ state
  const [loaiTin] = useState(state?.loaiTin || []); // Nhận loaiTin từ state

  const [comments, setComments] = useState<any[]>([]);
  const [commentLimit, setCommentLimit] = useState(4);
  const [showForm, setShowForm] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [formData, setFormData] = useState({ email: "", noidung: "", maXacNhan: "" });

  const generateCaptcha = () => {
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();
    setCaptcha(code);
  };

  useEffect(() => {
    console.log("ID TIN:", id_tin); // <- Kiểm tra có giá trị không
    // Fetch dữ liệu từ API dựa trên id_tin
    const fetchData = async () => {
      try {
        if (slug && id_tin) {
          const response = await fetch(`https://apiwebsitetintuc-production.up.railway.app/api/chitiettin/${id_tin}`);
          const result = await response.json();
          if (result.success) {
            setNews(result.data); // Lưu dữ liệu vào state
          } else {
            console.error("Không thể tải tin tức.");
          }
        }

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchData();
  }, [id_tin]); // Chạy lại khi id_tin thay đổi

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/binhluan/${id_tin}?limit=${commentLimit}`);
        const data = await res.json();
        if (data.success) setComments(data.comments);
      } catch (err) {
        console.error("Lỗi khi tải bình luận:", err);
      }
    };

    if (id_tin) {
      fetchComments();
      generateCaptcha();
    }
  }, [id_tin, commentLimit]);

  const handleSubmitComment = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email || !formData.noidung || formData.maXacNhan !== captcha) {
      alert("Vui lòng điền đầy đủ và đúng mã xác nhận!");
      return;
    }

    if (!emailRegex.test(formData.email)) {
      alert("Email không đúng định dạng!");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/binhluan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          noidung: formData.noidung,
          id_tin: id_tin,
        }),
      });

      const data = await res.json();

      if (res.status === 201) {
        alert("Bình luận đã được gửi và đang chờ quản trị viên duyệt!");
        // Sau khi người dùng bấm OK -> reload lại trang
        window.location.reload();
      } else {
        alert(data.message || "Đã có lỗi xảy ra khi gửi bình luận.");
      }
    } catch (err) {
      console.error("Lỗi gửi bình luận:", err);
      alert("Không thể kết nối đến máy chủ.");
    }
  };



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
                src={`${news.hinhdaidien}`}
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

              {/* BÌNH LUẬN */}
              <div className="mt-12 p-4 bg-gray-50 rounded">
                <h2 className="text-xl font-bold mb-4">Bình luận</h2>

                {comments.map((bl, index) => (
                  <div key={index} className="mb-4 border-b pb-2">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">{bl.email}</p>
                      <p className="text-sm text-gray-500">
                        {dayjs(bl.thoigian).format("DD/MM/YYYY HH:mm")}
                      </p>
                    </div>
                    <p>{bl.noidung}</p>
                  </div>
                ))}

                {comments.length >= commentLimit && (
                  <button
                    onClick={() => setCommentLimit(commentLimit + 4)}
                    className="text-blue-600 hover:underline mt-2"
                  >
                    Xem thêm bình luận
                  </button>
                )}

                {!showForm && (
                  <button
                    className="mt-4 text-blue-600 hover:underline"
                    onClick={() => setShowForm(true)}
                  >
                    Viết bình luận
                  </button>
                )}

                {showForm && (
                  <div className="mt-4 bg-white p-4 shadow rounded border">
                    <div className="mb-2">
                      <label className="block font-medium">Email</label>
                      <input
                        type="text"
                        className="w-full border px-2 py-1"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block font-medium">Nội dung</label>
                      <textarea
                        className="w-full border px-2 py-1"
                        rows={3}
                        value={formData.noidung}
                        onChange={(e) => setFormData({ ...formData, noidung: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block font-medium">
                        Mã xác nhận: <span className="font-mono bg-gray-200 px-2">{captcha}</span>
                      </label>
                      <input
                        type="text"
                        className="w-full border px-2 py-1"
                        value={formData.maXacNhan}
                        onChange={(e) => setFormData({ ...formData, maXacNhan: e.target.value })}
                      />
                    </div>
                    <button
                      onClick={handleSubmitComment}
                      className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
                    >
                      Gửi bình luận
                    </button>
                  </div>
                )}
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
