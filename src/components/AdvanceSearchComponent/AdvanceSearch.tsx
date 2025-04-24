import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, Button, InputLabel, FormControl, Box, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';
import { showErrorToast } from '../../components/ToastService/ToastService';
import { useNavigate } from 'react-router-dom';

// Nhận prop nhomTin từ TrangChu.tsx
interface NhomTinProps {
    nhomTin: Array<{
        id_nhomtin: number;
        ten_nhomtin: string;
    }>;
    loaiTin: Array<{
        id_loaitin: number;
        ten_loaitin: string;
        id_nhomtin: number;
    }>;
}

const AdvanceSearch: React.FC<NhomTinProps> = ({ nhomTin, loaiTin }) => {
    const [titleOrContent, setTitleOrContent] = useState('');
    const [newsGroup, setNewsGroup] = useState('');
    const [newsType, setNewsType] = useState('');
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [filteredNewsTypes, setFilteredNewsTypes] = useState<any[]>([]);
    const navigate = useNavigate();

    // Lọc loại tin khi chọn nhóm tin
    useEffect(() => {
        if (newsGroup) {
            const filteredTypes = loaiTin.filter(type => type.id_nhomtin === Number(newsGroup));
            setFilteredNewsTypes(filteredTypes);
            setNewsType(''); // Reset loại tin khi đổi nhóm tin
        } else {
            setFilteredNewsTypes([]);
        }
    }, [newsGroup, loaiTin]);

    const handleSearch = () => {
        const formattedStartDate = startDate ? startDate.format('YYYY-MM-DD') : '';
        const formattedEndDate = endDate ? endDate.format('YYYY-MM-DD') : '';

        if (!titleOrContent && !newsGroup && !newsType && !formattedStartDate && !formattedEndDate) {
            showErrorToast('Phải có ít nhất một tiêu chí tìm kiếm!');
            return;
        }

        const params = new URLSearchParams();
        if (titleOrContent) params.append('titleOrContent', titleOrContent);
        if (newsGroup) params.append('newsGroup', newsGroup);
        if (newsType) params.append('newsType', newsType);
        if (formattedStartDate) params.append('startDate', formattedStartDate);
        if (formattedEndDate) params.append('endDate', formattedEndDate);

        navigate(`/tim-kiem?${params.toString()}`, { state: { nhomTin, loaiTin } });
    };

    return (
        <Box className="p-4 bg-white rounded-2xl shadow-2xl flex flex-col gap-6 border border-gray-100" style={{ padding: '1rem', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}>
            <Typography variant="h5" className="text-3xl font-bold mb-2">Tìm Kiếm Nâng Cao</Typography>
            <TextField
                fullWidth
                label="Tên tiêu đề hoặc nội dung bài báo"
                value={titleOrContent}
                onChange={(e) => setTitleOrContent(e.target.value)}
            />

            <FormControl fullWidth>
                <InputLabel>Nhóm tin</InputLabel>
                <Select
                    value={newsGroup}
                    label="Nhóm tin"
                    onChange={(e) => setNewsGroup(e.target.value)}
                >
                    <MenuItem value="">Chọn nhóm tin</MenuItem>
                    {nhomTin.map((group) => (
                        <MenuItem key={group.id_nhomtin} value={group.id_nhomtin}>
                            {group.ten_nhomtin}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth disabled={!newsGroup}>
                <InputLabel>Loại tin</InputLabel>
                <Select
                    value={newsType}
                    label="Loại tin"
                    onChange={(e) => setNewsType(e.target.value)}
                >
                    <MenuItem value="">Chọn loại tin</MenuItem>
                    {filteredNewsTypes.map((subGroup) => (
                        <MenuItem key={subGroup.id_loaitin} value={subGroup.id_loaitin}>
                            {subGroup.ten_loaitin}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <DatePicker
                label="Ngày bắt đầu"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
            />

            <DatePicker
                label="Ngày kết thúc"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
            />

            <Button variant="contained" onClick={handleSearch} style={{ marginTop: '0.5rem' }}>
                Tìm kiếm
            </Button>
        </Box>
    );
};

export default AdvanceSearch;
