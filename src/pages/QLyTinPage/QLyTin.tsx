import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Box, Button, TextField, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminHeader from '../../components/AdminHeaderComponent/AdminHeader';
import Footer from '../../components/FooterComponent/Footer';
import dayjs from 'dayjs';
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
}

interface LoaiTin {
    id_loaitin: number;
    ten_loaitin: string;
}

const QLTin: React.FC = () => {
    const navigate = useNavigate();
    const [openConfirm, setOpenConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [dsTin, setDsTin] = useState<Tin[]>([]);
    const [dsLoaiTin, setDsLoaiTin] = useState<LoaiTin[]>([]);
    const [filters, setFilters] = useState({
        startDate: null,
        endDate: null,
        id_loaitin: '0',
        id_tin: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [tinRes, loaiTinRes] = await Promise.all([
                axios.get('https://apiwebsitetintuc.onrender.com/api/danhsachtin'),
                axios.get('https://apiwebsitetintuc.onrender.com/api/loaitin')
            ]);
            setDsTin(tinRes.data);
            setDsLoaiTin(loaiTinRes.data);
        } catch (err) {
            console.error('Lỗi khi fetch dữ liệu:', err);
        }
    };

    const fetchTin = async () => {
        try {
            const { startDate, endDate, id_loaitin, id_tin } = filters;
            console.log('Fetching data with id_loaitin:', id_loaitin); // Kiểm tra giá trị của id_loaitin
            const tinRes = await axios.get('https://apiwebsitetintuc.onrender.com/api/danhsachtin', {
                params: {
                    ngaybd: startDate,
                    ngaykt: endDate,
                    id_loaitin: id_loaitin,
                    id_tin: id_tin
                },
            });
            setDsTin(tinRes.data);
        } catch (err) {
            showErrorToast('Lỗi khi tải tin: ' + err); // Lỗi từ server trả về
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        fetchTin(); // Gọi lại fetchTin khi người dùng tìm kiếm
    };

    const handleConfirmDelete = async () => {
        if (deleteId === null) return;

        try {
            const res = await axios.delete(`https://apiwebsitetintuc.onrender.com/api/xoatin/${deleteId}`);
            showSuccessToast(res.data.message);
            fetchTin();
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                showErrorToast(error.response.data.message); // Lỗi từ server trả về
            } else {
                showErrorToast('Đã xảy ra lỗi khi xóa tin.');
            }
        } finally {
            setOpenConfirm(false);
            setDeleteId(null);
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setOpenConfirm(true);
    };

    return (
        <>
            <AdminHeader />
            <div className='mt-24 min-h-screen'>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Box>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>Quản lý tin tức</h1>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/add-edit-tin')}
                    >
                        + Thêm Tin
                    </Button>
                </Box>

                <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
                    <TextField
                        label="Từ ngày"
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: 200 }}
                    />
                    <TextField
                        label="Đến ngày"
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: 200 }}
                    />
                    <TextField
                        select
                        label="Loại tin"
                        name="id_loaitin"
                        value={filters.id_loaitin}
                        onChange={handleChange}
                        sx={{ width: 160 }}
                    >
                        <MenuItem key={0} value={0}>
                            Tất cả
                        </MenuItem>
                        {dsLoaiTin.map(lt => (
                            <MenuItem key={lt.id_loaitin} value={lt.id_loaitin}>
                                {lt.ten_loaitin}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Mã tin"
                        name="id_tin"
                        value={filters.id_tin}
                        onChange={handleChange}
                        sx={{ width: 120 }}
                    />
                    <Button
                        variant="contained"
                        sx={{ height: '56px' }} // Căn chiều cao bằng TextField
                        onClick={handleSearch} // Tìm kiếm khi bấm nút
                    >
                        Tìm kiếm
                    </Button>
                </Box>


                <TableContainer component={Paper} sx={{
                    maxHeight: '460px',
                    overflowY: 'auto',
                    borderRadius: '10px', // Thêm border radius cho bảng
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Thêm bóng đổ nhẹ cho bảng
                    '&::-webkit-scrollbar': {
                        width: '10px', // Đặt chiều rộng thanh cuộn
                    },
                    '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1', // Màu nền của thanh cuộn
                        borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#2563EB', // Màu thanh cuộn
                        borderRadius: '10px',
                        border: '2px solid #f1f1f1', // Đường viền của thanh cuộn
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#1D4ED8', // Màu của thanh cuộn khi hover
                    },
                }}>
                    <Table>
                        <TableHead sx={{
                            backgroundColor: '#2563EB',
                            position: 'sticky', // Giữ TableHead cố định khi cuộn
                            top: 0, // Vị trí cố định của TableHead
                            zIndex: 1, // Đảm bảo TableHead luôn nằm trên các phần tử khác khi cuộn
                        }}>
                            <TableRow>
                                <TableCell style={{ width: '50px', fontWeight: 'bold', color: 'white' }}>ID</TableCell>
                                <TableCell style={{ width: '100px', fontWeight: 'bold', color: 'white' }}>Ảnh</TableCell>
                                <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Tiêu đề</TableCell>
                                <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Tác giả</TableCell>
                                <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Loại tin</TableCell>
                                <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Ngày đăng</TableCell>
                                <TableCell style={{ width: '100px', fontWeight: 'bold', color: 'white' }}>Lượt xem</TableCell>
                                <TableCell style={{ width: '50px' }}></TableCell>
                                <TableCell style={{ width: '50px' }}></TableCell>
                                <TableCell style={{ fontWeight: 'bold', color: 'white' }}>Hành động</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {dsTin.map((tin) => (
                                <TableRow key={tin.id_tin}>
                                    <TableCell>{tin.id_tin}</TableCell>
                                    <TableCell>
                                        <img src={tin.hinhdaidien} alt="Ảnh tin" width={100} />
                                    </TableCell>
                                    <TableCell sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }} style={{ maxWidth: '200px' }}>{tin.tieude}</TableCell>
                                    <TableCell sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }} style={{ maxWidth: '70px' }}>{tin.tacgia}</TableCell>
                                    <TableCell sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }} style={{ maxWidth: '70px' }}>
                                        {
                                            dsLoaiTin.find(lt => lt.id_loaitin === tin.id_loaitin)?.ten_loaitin || 'Không rõ'
                                        }
                                    </TableCell>
                                    <TableCell sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }} style={{ maxWidth: '120px' }}>{dayjs(tin.ngaydangtin).format('DD/MM/YYYY HH:mm:ss')}</TableCell>
                                    <TableCell sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }} style={{ maxWidth: '100px' }}>{tin.solanxem}</TableCell>
                                    <TableCell style={{ minWidth: '60px' }}>
                                        {tin.tinhot ? (
                                            <img src="hot.png" alt="Hot" width={30} height={30} />
                                        ) : null}
                                    </TableCell>
                                    <TableCell style={{ minWidth: '60px' }}>
                                        <img
                                            src={tin.trangthai ? "visibility.png" : "visible.png"}
                                            alt="visibility"
                                            width={30}
                                            height={30}
                                        />
                                    </TableCell>
                                    <TableCell sx={{
                                        textAlign: 'center',  // Căn giữa nội dung
                                    }}>
                                        <div className='flex gap-2 justify-center'>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => navigate(`/add-edit-tin/${tin.id_tin}`)}
                                        >
                                            Sửa
                                        </Button>
                                        <Button variant='contained' size="small" color="error" onClick={() => handleDeleteClick(tin.id_tin)}>Xóa</Button>
                                        </div>
                                        
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <Footer />
            <Dialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
            >
                <DialogTitle>Xóa</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc muốn xóa tin này?
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

export default QLTin;
