import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from '../../components/AdminHeaderComponent/AdminHeader';
import Footer from '../../components/FooterComponent/Footer';
import dayjs from 'dayjs';
import { showSuccessToast, showErrorToast } from '../../components/ToastService/ToastService';

interface BinhLuan {
  id_binhluan: number;
  email: string;
  thoigian: string;
  noidung: string;
  trangthai: number;
  id_tin: number;
  tieuDeTin?: string;
}

const QuanLyBinhLuan: React.FC = () => {
  const [dsBinhLuan, setDsBinhLuan] = useState<BinhLuan[]>([]);
  const [trangThaiLoc, setTrangThaiLoc] = useState("-1");
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
      if (trangThaiLoc != "-1") {
        data = data.filter((bl: BinhLuan) => String(bl.trangthai) == trangThaiLoc);
      }

      setDsBinhLuan(data);
    } catch (error) {
      showErrorToast('Lỗi khi lấy dữ liệu bình luận');
      console.error("Lỗi khi lấy dữ liệu bình luận:", error);
    }
  };

  useEffect(() => {
    fetchBinhLuan();
  }, []);

  const handleTrangThaiLocChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTrangThaiLoc(e.target.value);
  };

  const handleTimKiem = () => {
    fetchBinhLuan();
  };

  const moDialogCapNhat = (bl: BinhLuan) => {
    setBinhLuanDangChon(bl);
    setXemDialog(true);
  };

  const xacNhanCapNhat = async () => {
    // console.log(binhLuanDangChon?.id_binhluan);
    if (binhLuanDangChon) {
      try {
        const res = await axios.post(`https://apiwebsitetintuc-production.up.railway.app/api/binhluan/${binhLuanDangChon.id_binhluan}`, {
          _method: "PUT",
        });
        const message = res.data.message;
        showSuccessToast(message);
        fetchBinhLuan();
      } catch {
        showErrorToast('Có lỗi khi cập nhật bình luận');
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
            <option value="-1">Tất cả</option>
            <option value="true">Đã duyệt</option>
            <option value="false">Chưa duyệt</option>
          </select>
          <button
            onClick={handleTimKiem}
            className="cursor-pointer bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 font-semibold w-full"
          >
            Tìm
          </button>
        </div>

        <div className="overflow-x-auto max-h-[600px] overflow-y-auto border border-gray-300 rounded">
          <table className="w-full text-base text-center">
            <thead className="bg-slate-100 text-gray-700 font-semibold">
              <tr>
                <th className="border px-4 py-3">Email</th>
                <th className="border px-4 py-3">Thời gian</th>
                <th className="border px-4 py-3">Nội dung</th>
                <th className="border px-4 py-3">Trạng thái</th>
                <th className="border px-4 py-3">ID tin</th>
                <th className="border px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {dsBinhLuan.map((bl) => (
                <tr key={bl.id_binhluan} className="hover:bg-gray-50">
                  <td className="border px-4 py-3 align-top">{bl.email}</td>
                  <td className="border px-4 py-3 align-top">{dayjs(bl.thoigian).format('DD/MM/YYYY HH:mm:ss')}</td>
                  <td className="border px-4 py-3 text-left align-top">{bl.noidung}</td>
                  <td className="border px-4 py-3 align-top">
                    <span
                      className={`inline-block min-w-[120px] text-center px-3 py-1 rounded-full text-white font-semibold ${bl.trangthai ? "bg-green-500" : "bg-gray-500"
                        }`}
                    >
                      {bl.trangthai ? "Đã duyệt" : "Chưa duyệt"}
                    </span>
                  </td>
                  <td className="border px-4 py-3 align-top">{bl.id_tin}</td>
                  <td className="border px-4 py-3 align-top">
                    <button
                      onClick={() => moDialogCapNhat(bl)}
                      className={`text-white whitespace-nowrap px-5 py-1 rounded text-sm font-semibold ${bl.trangthai ? "!bg-red-500" : "!bg-blue-500"}`}
                    >
                      {bl.trangthai ? "Bỏ duyệt" : "Duyệt"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Dialog xác nhận */}
        {xemDialog && binhLuanDangChon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-md shadow-md p-6 w-full max-w-xs">
              <h2 className="text-lg font-semibold text-gray-900 mb-2 text-center">Xác nhận</h2>
              <p className="text-sm text-gray-700 text-center mb-6">
                {!binhLuanDangChon.trangthai
                  ? "Bạn có chắc muốn duyệt bình luận này?"
                  : "Bạn có chắc muốn bỏ duyệt bình luận này?"}
              </p>
              <div className="flex justify-center gap-6 text-sm font-medium">
                <button
                  onClick={huyDialog}
                  className="text-blue-600 hover:underline"
                >
                  HỦY
                </button>
                <button
                  onClick={xacNhanCapNhat}
                  className="text-red-600 hover:underline"
                >
                  XÁC NHẬN
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
