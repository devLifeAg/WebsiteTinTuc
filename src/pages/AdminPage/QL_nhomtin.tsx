import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './QL_nhomtin.css';
import AdminHeader from '../../components/AdminHeaderComponent/AdminHeader';
import Footer from '../../components/FooterComponent/Footer';
import { showErrorToast } from '../../components/ToastService/ToastService';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions, Button
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

interface NhomTin {
  id_nhomtin: number;
  ten_nhomtin: string;
  trangthai: number;
}

const QL_nhomtin: React.FC = () => {
  const [nhomTins, setNhomTins] = useState<NhomTin[]>([]);
  const [form, setForm] = useState({ ten_nhomtin: '', trangthai: 1 });
  const [editId, setEditId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get('https://apiwebsitetintuc.onrender.com/api/nhomtin');
      setNhomTins(res.data.data);
    } catch (err) {
      showErrorToast('Lỗi khi tải nhóm tin: ' + err); // Lỗi từ server trả về
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.ten_nhomtin.trim() == '') {
      showErrorToast('Tên nhóm tin không được bỏ trống!');
      return;
    }
    try {
      setIsSubmitted(true);
      if (editId) {
        await axios.put(`https://apiwebsitetintuc.onrender.com/api/suanhomtin/${editId}`, form);
        setMessage('✔️ Cập nhật thành công');
      } else {
        await axios.post('https://apiwebsitetintuc.onrender.com/api/themnhomtin', form);
        setMessage('✔️ Thêm thành công');
      }
      setForm({ ten_nhomtin: '', trangthai: 1 });
      setEditId(null);
      fetchData();
    } catch (err: any) {
      setMessage('❌ Lỗi khi lưu dữ liệu');
    } finally {
      setIsSubmitted(false);
    }
  };

  const handleEdit = (nt: NhomTin) => {
    setForm({ ten_nhomtin: nt.ten_nhomtin, trangthai: nt.trangthai });
    setEditId(nt.id_nhomtin);
  };

  const handleConfirmDelete = async () => {
    if (deleteId === null) return;
    setIsDeleting(true);
    try {
      const res = await axios.delete(`https://apiwebsitetintuc.onrender.com/api/xoanhomtin/${deleteId}`);
      setMessage(res.data.message);
      fetchData();
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Đã xảy ra lỗi khi xóa nhóm tin.');
      }
    } finally {
      setOpenConfirm(false);
      setDeleteId(null);
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setOpenConfirm(true);
  };

  const handleToggleTrangThai = async (nt: NhomTin) => {
    try {
      const updatedTrangThai = nt.trangthai === 1 ? 0 : 1;

      await axios.put(`https://apiwebsitetintuc.onrender.com/api/suanhomtin/${nt.id_nhomtin}`, {
        ten_nhomtin: nt.ten_nhomtin,
        trangthai: updatedTrangThai,
      });

      setMessage('✔️ Đã cập nhật trạng thái');
      fetchData();
    } catch (err) {
      setMessage('❌ Lỗi khi cập nhật trạng thái');
    }
  };

  return (
    <>
      <AdminHeader />
      <div className='mt-12'></div>
      <div className="ql-nhomtin-container min-h-screen">
        <h2 className="text-4xl font-bold text-center my-6">Quản lý nhóm tin</h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center flex-grow text-center">
            <CircularProgress />
            <p className="mt-4 text-gray-600 text-2xl">Đang tải nhóm tin...</p>
            <p className="mt-4 text-gray-600 text-2xl">Quá trình này có thể mất ít thời gian để khởi động api từ server do nó tự động ngủ khi không có hoạt động, mong thầy thông cảm ạ!</p>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="ten_nhomtin"
                placeholder="Tên nhóm tin"
                value={form.ten_nhomtin}
                onChange={handleChange}
              />
              <button
                type="submit"
                disabled={isSubmitted}
                style={{
                  backgroundColor: isSubmitted ? '#9ca3af' : '#2563eb', // Tailwind: gray-400 or blue-600
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  cursor: isSubmitted ? 'not-allowed' : 'pointer',
                  opacity: isSubmitted ? 0.7 : 1,
                  transition: 'background-color 0.3s ease',
                }}
              >
                {isSubmitted
                  ? (editId ? 'Đang cập nhật...' : 'Đang thêm...')
                  : (editId ? 'Cập nhật' : 'Thêm')}
              </button>
            </form>

            {message && <p className="message">{message}</p>}

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên nhóm tin</th>
                  <th>Hành động</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {nhomTins.map(nt => (
                  <tr key={nt.id_nhomtin}>
                    <td>{nt.id_nhomtin}</td>
                    <td>{nt.ten_nhomtin}</td>
                    <td>
                      <button className="btn-edit" onClick={() => handleEdit(nt)}>Sửa</button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteClick(nt.id_nhomtin)}
                        disabled={isDeleting && deleteId === nt.id_nhomtin}
                        style={{
                          backgroundColor: isDeleting && deleteId === nt.id_nhomtin ? '#9ca3af' : '#dc2626', // Tailwind: gray-400 or red-600
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem',
                          cursor: isDeleting && deleteId === nt.id_nhomtin ? 'not-allowed' : 'pointer',
                          opacity: isDeleting && deleteId === nt.id_nhomtin ? 0.7 : 1,
                          transition: 'background-color 0.3s ease',
                        }}
                      >
                        {isDeleting && deleteId === nt.id_nhomtin ? 'Đang xóa...' : 'Xóa'}
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleTrangThai(nt)}
                        className={nt.trangthai === 1 ? 'btn-on' : 'btn-off'}
                      >
                        {nt.trangthai === 1 ? 'Bật' : 'Tắt'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

      </div>
      <Footer />
      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
      >
        <DialogTitle>Xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc muốn xóa nhóm tin này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="primary">
            Hủy
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default QL_nhomtin;
