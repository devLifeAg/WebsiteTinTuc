import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from '../../components/AdminHeaderComponent/AdminHeader';
import Footer from '../../components/FooterComponent/Footer';

const API_BASE = "https://apiwebsitetintuc-production.up.railway.app/api";

interface LoaiTin {
  id_loaitin: number;
  ten_loaitin: string;
  trangthai: boolean;
  id_nhomtin: number;
}

interface NhomTin {
  id_nhomtin: number;
  ten_nhomtin: string;
}

const QuanlyTin = () => {
  const [dsLoaiTin, setDsLoaiTin] = useState<LoaiTin[]>([]);
  const [dsNhomTin, setDsNhomTin] = useState<NhomTin[]>([]);
  const [form, setForm] = useState({
    ten_loaitin: "",
    trangthai: true,
    id_nhomtin: 0,
  });
  const [dangSua, setDangSua] = useState<number | null>(null);
  const [hienDialog, setHienDialog] = useState(false);
  const [xoaId, setXoaId] = useState<number | null>(null);

  useEffect(() => {
    fetchLoaiTin();
    fetchNhomTin();
  }, []);

  const fetchLoaiTin = async () => {
    try {
      const res = await axios.get(`${API_BASE}/loaitin`);
      setDsLoaiTin(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi lấy loại tin:", err);
    }
  };

  const fetchNhomTin = async () => {
    // Nếu có API nhóm tin thì fetch, còn không dùng dữ liệu cứng
    setDsNhomTin([
      { id_nhomtin: 1, ten_nhomtin: "Thể thao" },
      { id_nhomtin: 2, ten_nhomtin: "Giải trí" },
      { id_nhomtin: 3, ten_nhomtin: "Thời sự" },
      { id_nhomtin: 4, ten_nhomtin: "Kinh tế" },
      { id_nhomtin: 5, ten_nhomtin: "Giáo dục" },
    ]);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    const newValue =
      type === "checkbox" && e.target instanceof HTMLInputElement
        ? e.target.checked
        : value;

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleThemOrCapNhat = async () => {
    const payload = {
      ten_loaitin: form.ten_loaitin,
      id_nhomtin: Number(form.id_nhomtin),
      trangthai: Boolean(form.trangthai),
    };

    try {
      if (dangSua !== null) {
        // ✅ Fix lỗi URL: không có dấu `/` sau id
        await axios.put(`${API_BASE}/sualoaitin/${dangSua}`, payload);
        alert("✅ Cập nhật thành công!");
      } else {
        await axios.post(`${API_BASE}/themloaitin`, payload);
        alert("✅ Thêm loại tin thành công!");
      }

      setForm({ ten_loaitin: "", trangthai: true, id_nhomtin: 0 });
      setDangSua(null);
      await fetchLoaiTin();
    } catch (error: any) {
      console.error("❌ Lỗi:", error.response?.data || error.message);
      if (error.response?.data?.errors) {
        alert("❌ " + Object.values(error.response.data.errors).join("\n"));
      } else {
        alert("❌ Có lỗi xảy ra khi thêm/cập nhật!");
      }
    }
  };

  const handleSua = (loaiTin: LoaiTin) => {
    setForm({
      ten_loaitin: loaiTin.ten_loaitin,
      trangthai: loaiTin.trangthai,
      id_nhomtin: loaiTin.id_nhomtin,
    });
    setDangSua(loaiTin.id_loaitin);
  };

  const handleXoa = (id: number) => {
    setXoaId(id);
    setHienDialog(true);
  };

  const xacNhanXoa = async () => {
    if (xoaId !== null) {
      try {
        await axios.delete(`${API_BASE}/xoaloaitin/${xoaId}`);
        alert("🗑️ Xóa thành công!");
        await fetchLoaiTin();
      } catch (error: any) {
        if (error.response?.status === 400) {
          alert("❌ " + error.response.data.message);
        } else {
          alert("❌ Lỗi khi xóa loại tin!");
        }
      }
      setHienDialog(false);
      setXoaId(null);
    }
  };

  const huyXoa = () => {
    setHienDialog(false);
    setXoaId(null);
  };

  const handleXoaInput = () => {
    setForm({ ten_loaitin: "", trangthai: true, id_nhomtin: 0 });
    setDangSua(null);
  };

  return (
    <>
      <AdminHeader />
      <div className="min-h-screen p-10 max-w-6xl mt-24 mb-16 mx-auto bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">🗂️ Quản lý loại tin</h1>

        {/* Form nhập liệu */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <input
            name="ten_loaitin"
            value={form.ten_loaitin}
            onChange={handleInputChange}
            placeholder="Tên loại tin"
            className="border border-gray-300 p-3 rounded w-full"
          />

          <select
            name="id_nhomtin"
            value={form.id_nhomtin}
            onChange={handleInputChange}
            className="border border-gray-300 p-3 rounded w-full"
          >
            <option value={0}>-- Chọn nhóm tin --</option>
            {dsNhomTin.map((nt) => (
              <option key={nt.id_nhomtin} value={nt.id_nhomtin}>
                {nt.ten_nhomtin}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="trangthai"
              checked={form.trangthai}
              onChange={handleInputChange}
              className="scale-125"
            />
            <span className="text-base font-medium">Bật</span>
          </div>

          <button
            onClick={handleThemOrCapNhat}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full font-semibold"
          >
            {dangSua !== null ? "Cập nhật" : "Thêm"}
          </button>
        </div>

        {/* Xóa nội dung form */}
        <div className="mb-6">
          <button
            onClick={handleXoaInput}
            className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700"
          >
            Xóa nội dung
          </button>
        </div>

        {/* Bảng loại tin */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-300 text-base text-center shadow-md">
            <thead className="bg-slate-100">
              <tr>
                <th className="border px-4 py-3">Tên loại tin</th>
                <th className="border px-4 py-3">Trạng thái</th>
                <th className="border px-4 py-3">Nhóm tin</th>
                <th className="border px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {dsLoaiTin.map((lt) => (
                <tr key={lt.id_loaitin} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-left">{lt.ten_loaitin}</td>
                  <td className="border px-4 py-2">
                    <span
                      className={`inline-block min-w-[80px] px-3 py-1 rounded-full text-white text-sm font-medium ${lt.trangthai ? "bg-green-500" : "bg-gray-500"
                        }`}
                    >
                      {lt.trangthai ? "Bật" : "Tắt"}
                    </span>
                  </td>
                  <td className="border px-4 py-2">
                    {dsNhomTin.find((nt) => nt.id_nhomtin === lt.id_nhomtin)?.ten_nhomtin ||
                      "Không rõ"}
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleSua(lt)}
                      className="bg-yellow-400 text-black px-4 py-1 rounded hover:bg-yellow-500 font-semibold"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleXoa(lt.id_loaitin)}
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 font-semibold"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Dialog xác nhận xóa */}
        {hienDialog && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded shadow-xl max-w-sm w-full">
              <p className="text-lg font-semibold mb-4">
                Bạn có chắc chắn muốn xóa không?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={xacNhanXoa}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Xóa
                </button>
                <button
                  onClick={huyXoa}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
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

export default QuanlyTin;
