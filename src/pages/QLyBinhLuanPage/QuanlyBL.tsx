import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from '../../components/AdminHeaderComponent/AdminHeader';
import Footer from '../../components/FooterComponent/Footer';
import dayjs from 'dayjs';
// import { showErrorToast } from '../../components/ToastService/ToastService';

interface BinhLuan {
  id: number;
  email: string;
  thoigian: string;
  noidung: string;
  trangthai: number;
  id_tin: number;
  tieuDeTin?: string;
}

const QuanLyBinhLuan = () => {
  const [dsBinhLuan, setDsBinhLuan] = useState<BinhLuan[]>([]);
  const [trangThaiLoc, setTrangThaiLoc] = useState("tatca");
  const [ngayBatDau, setNgayBatDau] = useState("");
  const [ngayKetThuc, setNgayKetThuc] = useState("");
  const [xemDialog, setXemDialog] = useState(false);
  const [binhLuanDangChon, setBinhLuanDangChon] = useState<BinhLuan | null>(null);

  const fetchBinhLuan = async () => {
    try {
      const response = await axios.get("https://apiwebsitetintuc-production.up.railway.app/api/binhluan", {
        params: {
          start_date: ngayBatDau,
          end_date: ngayKetThuc,
        },
      });

      let data = response.data.data;

      if (trangThaiLoc !== "tatca") {
        data = data.filter((bl: BinhLuan) => String(bl.trangthai) === trangThaiLoc);
      }

      setDsBinhLuan(data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu bình luận:", error);
    }
  };

  useEffect(() => {
    // if (ngayBatDau && ngayKetThuc) {
    //   fetchBinhLuan();
    // }
    fetchBinhLuan();
  }, [ngayBatDau, ngayKetThuc, trangThaiLoc]);

  const handleTrangThaiLocChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTrangThaiLoc(e.target.value);
  };

  const handleTimKiem = () => {
    if (ngayBatDau && ngayKetThuc) {
      fetchBinhLuan();
    }
  };

  const moDialogCapNhat = (bl: BinhLuan) => {
    setBinhLuanDangChon(bl);
    setXemDialog(true);
  };

  const xacNhanCapNhat = async () => {
    if (binhLuanDangChon) {
      try {
        const newStatus = binhLuanDangChon.trangthai === 0 ? 1 : 0;
        await axios.put(`http://localhost:8000/api/binhluan/${binhLuanDangChon.id}`, {
          trangthai: newStatus,
        });
        fetchBinhLuan();
      } catch (err) {
        console.error("Lỗi khi cập nhật bình luận:", err);
      }
    }
    setXemDialog(false);
    setBinhLuanDangChon(null);
  };

  const huyDialog = () => {
    setXemDialog(false);
    setBinhLuanDangChon(null);
  };

  return (
    <>
      <AdminHeader />
      <div className="p-10 max-w-7xl mx-auto bg-white shadow-lg rounded-lg mt-24 min-h-screen mb-16">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
          💬 Quản lý bình luận
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <input
            type="date"
            value={ngayBatDau}
            onChange={(e) => setNgayBatDau(e.target.value)}
            className="border border-gray-300 p-3 rounded w-full"
          />
          <input
            type="date"
            value={ngayKetThuc}
            onChange={(e) => setNgayKetThuc(e.target.value)}
            className="border border-gray-300 p-3 rounded w-full"
          />
          <select
            value={trangThaiLoc}
            onChange={handleTrangThaiLocChange}
            className="border border-gray-300 p-3 rounded w-full"
          >
            <option value="tatca">Tất cả</option>
            <option value="1">Đã duyệt</option>
            <option value="0">Chưa duyệt</option>
          </select>
          <button
            onClick={handleTimKiem}
            className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 font-semibold w-full"
          >
            Tìm
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-base text-center shadow-sm">
            <thead className="bg-slate-100 text-gray-700 font-semibold">
              <tr>
                <th className="border px-4 py-3">Email</th>
                <th className="border px-4 py-3">Thời gian</th>
                <th className="border px-4 py-3">Nội dung</th>
                <th className="border px-4 py-3">Trạng thái</th>
                <th className="border px-4 py-3">ID tin</th>
                <th className="border px-4 py-3">Tiêu đề tin</th>
                <th className="border px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {dsBinhLuan.map((bl) => (
                <tr key={bl.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-3 align-top">{bl.email}</td>
                  <td className="border px-4 py-3 align-top">{dayjs(bl.thoigian).format('DD/MM/YYYY HH:mm:ss')}</td>
                  <td className="border px-4 py-3 text-left align-top">{bl.noidung}</td>
                  <td className="border px-4 py-3 align-top">
                    <span
                      className={`inline-block min-w-[120px] text-center px-3 py-1 rounded-full text-white font-semibold ${bl.trangthai == 1 ? "bg-green-500" : "bg-gray-500"
                        }`}
                    >
                      {bl.trangthai == 1 ? "Đã duyệt" : "Chưa duyệt"}
                    </span>
                  </td>
                  <td className="border px-4 py-3 align-top">{bl.id_tin}</td>
                  <td className="border px-4 py-3 text-left align-top">{bl.tieuDeTin || '-'}</td>
                  <td className="border px-4 py-3 align-top">
                    <button
                      onClick={() => moDialogCapNhat(bl)}
                      className="bg-yellow-400 hover:bg-yellow-500 px-5 py-1 rounded text-sm font-semibold"
                    >
                      Cập nhật
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {xemDialog && binhLuanDangChon && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-8 rounded shadow-xl max-w-md w-full">
              <p className="text-xl font-medium mb-6">
                {binhLuanDangChon.trangthai === 0
                  ? "Bạn có muốn duyệt bình luận này?"
                  : "Bạn có muốn bỏ duyệt bình luận này?"}
              </p>
              <div className="flex justify-end gap-6">
                <button
                  onClick={xacNhanCapNhat}
                  className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
                >
                  Xác nhận
                </button>
                <button
                  onClick={huyDialog}
                  className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default QuanLyBinhLuan;
