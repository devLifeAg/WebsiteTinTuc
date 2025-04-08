import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';
import logo from '/news.png'; // Đường dẫn tuyệt đối từ thư mục public
// import { showSuccessToast, showErrorToast } from '../../components/ToastService/ToastService';

type LoginForm = {
  tendangnhap: string;
  matkhau: string;
};

type LoginResponse = {
  message: string;
  qtv: {
    id_qtv: number;
    tendangnhap: string;
    ten_qtv: string;
  };
};

const LoginAdminPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginForm>({
    tendangnhap: '',
    matkhau: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await axios.post<LoginResponse>(
        'https://apiwebsitetintuc-production.up.railway.app/api/dangnhap',
        formData
      );

      setSuccess(res.data.message);
      localStorage.setItem("qtv", JSON.stringify(res.data.qtv)); // Lưu thông tin user vào localStorage
      // console.log('QTV:', res.data.qtv);
      navigate('/qltin');

    } catch (err: any) {
      if (err.response?.status === 401) {
        setError(err.response.data.message);
      } else {
        setError('Lỗi kết nối tới server.');
      }
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <img src={logo} alt="logo" />
        <h2>Đăng nhập Admin</h2>

        <input
          type="text"
          name="tendangnhap"
          placeholder="Tên đăng nhập"
          value={formData.tendangnhap}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="matkhau"
          placeholder="Mật khẩu"
          value={formData.matkhau.toString()}
          onChange={handleChange}
          required
        />

        <button type="submit">Đăng nhập</button>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}
      </form>
    </div>
  );
};

export default LoginAdminPage;
