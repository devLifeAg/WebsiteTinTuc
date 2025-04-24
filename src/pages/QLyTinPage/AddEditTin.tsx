import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminHeader from '../../components/AdminHeaderComponent/AdminHeader';
import Footer from '../../components/FooterComponent/Footer';
import { Button, Typography, Box } from '@mui/material';
import { showSuccessToast, showErrorToast } from '../../components/ToastService/ToastService';

interface Tin {
    id_tin: number;
    tieude: string;
    hinhdaidien: string;
    tacgia: string;
    tinhot: boolean;
    trangthai: boolean;
    ngaydangtin: string;
    solanxem: number;
    id_loaitin: number;
    mota: string;
    noidung: string;
}

interface LoaiTin {
    id_loaitin: number;
    ten_loaitin: string;
}

const ThemSuaTin: React.FC = () => {
    const { id_tin } = useParams<{ id_tin: string }>();
    const navigate = useNavigate();

    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState<Omit<Tin, 'id_tin' | 'solanxem'> & { hinhdaidien?: string }>({
        tieude: '',
        tacgia: '',
        tinhot: false,
        trangthai: true,
        ngaydangtin: '',
        id_loaitin: 0,
        hinhdaidien: '',
        mota: '',
        noidung: ''
    });
    const [loaiTinList, setLoaiTinList] = useState<LoaiTin[]>([]);

    useEffect(() => {
        // Fetch loại tin
        fetch('https://apiwebsitetintuc-production.up.railway.app/api/loaitin')
            .then(res => res.json())
            .then((data: LoaiTin[]) => setLoaiTinList(data))
            .catch(console.error);

        // Nếu có id_tin, fetch dữ liệu tin
        if (id_tin) {
            fetch(`https://apiwebsitetintuc-production.up.railway.app/api/chitiettin/${id_tin}`)
                .then(res => res.json())
                .then(json => {
                    const tin: Tin = json.data;
                    setFormData({
                        tieude: tin.tieude,
                        tacgia: tin.tacgia,
                        tinhot: tin.tinhot,
                        trangthai: tin.trangthai,
                        ngaydangtin: tin.ngaydangtin.slice(0, 16), // convert to 'YYYY-MM-DDTHH:mm'
                        id_loaitin: tin.id_loaitin,
                        hinhdaidien: tin.hinhdaidien,
                        mota: tin.mota,
                        noidung: tin.noidung
                    });
                    setPreviewUrl(`${tin.hinhdaidien}`);
                })
                .catch(console.error);
        }
    }, [id_tin]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const formatNgayDangTin = (input: string) => {
        return input.replace('T', ' ') + ':00'; // "2025-04-08T12:42" → "2025-04-08 12:42:00"
    };

    const isFormValid = () => {
        let flag = false;
        if (!id_tin && !file) {
            showErrorToast('bạn chưa tải ảnh lên');
        } else if (formData.tieude.trim() == '') {
            showErrorToast('Tiêu đề không được bỏ trống')
        } else if (formData.mota.trim() == '') {
            showErrorToast('Mô tả không được bỏ trống')
        } else if (formData.tacgia.trim() == '') {
            showErrorToast('Tác giả không được bỏ trống')
        } else if (formData.id_loaitin == 0) {
            showErrorToast('Bạn chưa chọn loại tin');
        } else if (formData.ngaydangtin == null) {
            showErrorToast('Bạn chưa chọn ngày giờ đăng tin');
        } else if (formData.noidung.trim() == '') {
            showErrorToast('Nội dung tin không được bỏ trống')
        } else {
            flag = true;
        }
        return flag;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid()) {
            return;
        }
        const form = new FormData();
        form.append('tieude', formData.tieude);
        if (file) {
            form.append('hinhdaidien', file!);
        }
        form.append('mota', formData.mota);
        form.append('noidung', formData.noidung);
        form.append('ngaydangtin', formatNgayDangTin(formData.ngaydangtin));
        form.append('tacgia', formData.tacgia);
        form.append('tinhot', String(formData.tinhot ? 1 : 0));
        form.append('trangthai', String(formData.trangthai ? 1 : 0));
        form.append('id_loaitin', String(formData.id_loaitin));


        const isEdit = !!id_tin;

        // Nếu là chỉnh sửa, thêm _method = PUT
        if (isEdit) {
            form.append('_method', 'PUT');
        }

        const url = isEdit
            ? `https://apiwebsitetintuc-production.up.railway.app/api/suatin/${id_tin}`
            : 'https://apiwebsitetintuc-production.up.railway.app/api/themtin';

        const res = await fetch(url, {
            method: 'POST',
            body: form,
        });

        if (res.ok) {
            showSuccessToast((isEdit ? 'Cập nhật ' : 'Thêm mới ') + 'thành công!');
            navigate('/qltin');
        } else {
            showErrorToast((isEdit ? 'Cập nhật ' : 'Thêm mới ') + 'thất bại!');
        }
    };



    return (
        <>
            <AdminHeader />
            <div className="mx-auto p-6 bg-white rounded shadow mt-24 min-h-screen mb-16">
                <h2 className="text-2xl font-bold text-center mb-6">
                    {id_tin ? 'Sửa Tin Tức' : 'Thêm Tin Tức'}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col" encType="multipart/form-data">
                    {/* Khu vực tải ảnh (đưa ra giữa) */}
                    <div className="flex flex-col items-center justify-center w-full gap-4 mb-6">
                        <Box
                            component="div"
                            sx={{
                                width: 200,
                                height: 200,
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#E3F2FD',
                                border: '2px solid #1976d2',
                                overflow: 'hidden'
                            }}
                        >
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            ) : (
                                <Typography variant="body2" color="textSecondary">
                                    Chưa có ảnh
                                </Typography>
                            )}
                        </Box>

                        <Button
                            variant="contained"
                            component="label"
                            sx={{
                                backgroundColor: '#1976d2',
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: '#115293'
                                }
                            }}
                        >
                            Tải ảnh lên
                            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                        </Button>
                    </div>
                    {/* Tiêu đề + checkbox trên cùng hàng, responsive xuống hàng khi màn hình nhỏ */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                        {/* Tiêu đề */}
                        <div className="flex-1">
                            <label className="block font-medium mb-1">Tiêu đề</label>
                            <input
                                type="text"
                                name="tieude"
                                value={formData.tieude}
                                onChange={handleChange}
                                className="border px-3 py-2 rounded w-full"
                            />
                        </div>

                        {/* Checkbox Tin hot + Hiển thị */}
                        <div className="flex gap-4 mt-2 md:mt-7">
                            <label>
                                <input
                                    type="checkbox"
                                    name="tinhot"
                                    checked={formData.tinhot}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                Tin hot
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="trangthai"
                                    checked={formData.trangthai}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                Hiển thị
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Mô tả</label>
                        <textarea
                            name="mota"
                            value={formData.mota}
                            onChange={handleChange}
                            className="border border-gray-300 px-3 py-2 rounded w-full h-36 resize-none"
                        />
                    </div>
                    <div className="flex flex-col md:flex-row md:space-x-4 w-full">
                        {/* Tác giả */}
                        <div className="flex-1 mb-4 md:mb-0">
                            <label className="block font-medium mb-1">Tác giả</label>
                            <input
                                type="text"
                                name="tacgia"
                                value={formData.tacgia}
                                onChange={handleChange}
                                className="border border-gray-300 px-3 py-2 rounded w-full"
                            />
                        </div>

                        {/* Loại tin */}
                        <div className="flex-1 mb-4 md:mb-0">
                            <label className="block font-medium mb-1">Loại tin</label>
                            <select
                                name="id_loaitin"
                                value={formData.id_loaitin}
                                onChange={handleChange}
                                className="border border-gray-300 px-3 py-2 rounded w-full"
                            >
                                <option value="">-- Chọn loại tin --</option>
                                {loaiTinList.map((loai) => (
                                    <option key={loai.id_loaitin} value={loai.id_loaitin}>
                                        {loai.ten_loaitin}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Ngày đăng tin */}
                        <div className="flex-1">
                            <label className="block font-medium mb-1">Ngày đăng tin</label>
                            <input
                                type="datetime-local"
                                name="ngaydangtin"
                                value={formData.ngaydangtin}
                                onChange={handleChange}
                                className="border border-gray-300 px-3 py-2 rounded w-full"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Nội dung</label>
                        <textarea
                            name="noidung"
                            value={formData.noidung}
                            onChange={handleChange}
                            className="border border-gray-300 px-3 py-2 rounded w-full h-108 resize-none"
                        />
                    </div>

                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="!bg-red-500 hover:!bg-red-600 text-white px-4 py-2 rounded"
                        >
                            Quay lại
                        </button>

                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                            {id_tin ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default ThemSuaTin;
