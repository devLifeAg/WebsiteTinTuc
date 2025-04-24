import React, { useState } from 'react';
import { Drawer, TextField, IconButton, MenuItem } from '@mui/material';
import { Search, Menu as MenuIcon, ArrowDropDown, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AdvanceSearch from '../../components/AdvanceSearchComponent/AdvanceSearch';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import "./Header.css";
import { useEffect } from 'react';
import { showErrorToast } from '../../components/ToastService/ToastService';
// Nhận prop nhomTin từ TrangChu.tsx
interface HeaderProps {
    nhomTin: Array<{ id_nhomtin: number; ten_nhomtin: string; }>;
    loaiTin: Array<{ id_loaitin: number; ten_loaitin: string; id_nhomtin: number; }>;
    // setFilter: (filter: { type: string; id: number | null }) => void;
}

const Header: React.FC<HeaderProps> = ({ nhomTin, loaiTin }) => {
    const [openSearch, setOpenSearch] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [expandedGroup, setExpandedGroup] = useState<number | null>(null);
    const navigate = useNavigate(); // Khởi tạo useNavigate để điều hướng
    const [hideTitle, setHideTitle] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 910);
    const [titleOrContent, setTitleOrContent] = useState('');

    const handleSearchSubmit = () => {
        if (!titleOrContent) {
            showErrorToast('Chưa có nội dung tìm kiếm!');
            return;
        }
        const params = new URLSearchParams();
        if (titleOrContent) params.append('titleOrContent', titleOrContent);

        navigate(`/tim-kiem?${params.toString()}`, { state: { nhomTin, loaiTin } });
    };

    const handleSearchClick = () => {
        const shouldHideTitle = !openSearch && window.innerWidth < 930;
        setOpenSearch(!openSearch);
        setHideTitle(shouldHideTitle);
    };

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleGroupToggle = (index: number) => {
        setExpandedGroup(expandedGroup === index ? null : index);
    };

    // Hàm chuyển hướng khi chọn nhóm tin hoặc loại tin
    const handleFilterSelect = (type: string, id: number | null) => {
        if (type === 'nhomtin') {
            navigate(`/tintuc?id_nhomtin=${id}`, { state: { nhomTin, loaiTin } });
        } else if (type === 'loaitin') {
            navigate(`/tintuc?id_loaitin=${id}`, { state: { nhomTin, loaiTin } });
        } else {
            navigate(`/`, { state: { nhomTin, loaiTin } });
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 910);
            // Nếu openSearch đang mở và kích thước màn hình < 930, ẩn title
            if (openSearch && window.innerWidth < 930) {
                setHideTitle(true);
            } else {
                setHideTitle(false);
            }
        };

        window.addEventListener('resize', handleResize);
        // Kiểm tra kích thước màn hình khi component mount
        if (openSearch && window.innerWidth < 930) {
            setHideTitle(true);
        }
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [openSearch]);

    return (
        <header className="bg-blue-600 text-white p-4 fixed top-0 left-0 w-full z-10">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <IconButton edge="start" className="text-white" onClick={handleDrawerToggle}>
                        <MenuIcon sx={{ color: 'white', fontSize: 36 }} />
                    </IconButton>
                    <Drawer
                        anchor="left"
                        open={drawerOpen}
                        onClose={handleDrawerToggle}
                        PaperProps={{
                            style: {
                                width: '300px',
                                backgroundColor: '#f9f9f9',
                            },
                        }}
                    >
                        <div className="h-full overflow-y-auto custom-scrollbar flex flex-col">
                            <div className="p-7 bg-blue-600 text-white flex justify-center items-center">
                                <h3 className="text-lg font-bold">CHUYÊN MỤC</h3>
                            </div>

                            <div className="p-4 flex-1">
                                <div key={-1}>
                                    <div className="flex items-center justify-between cursor-pointer font-bold mb-1">
                                        <span
                                            className="text-lg cursor-pointer"
                                            onClick={() => handleFilterSelect('trangchu', null)}
                                        >
                                            Trang Chủ
                                        </span>
                                    </div>
                                </div>

                                {nhomTin.map((group, index) => (
                                    <div key={group.id_nhomtin}>
                                        <div
                                            className="flex items-center justify-between cursor-pointer font-bold"
                                            onClick={() => handleGroupToggle(index)}
                                        >
                                            <div
                                                className="font-bold cursor-pointer"
                                                onClick={() => handleFilterSelect('nhomtin', group.id_nhomtin)}
                                            >
                                                {group.ten_nhomtin}
                                            </div>
                                            <IconButton>
                                                <ArrowDropDown
                                                    sx={{
                                                        transform: expandedGroup === index ? 'rotate(180deg)' : 'rotate(0deg)',
                                                        transition: 'transform 0.3s',
                                                    }}
                                                />
                                            </IconButton>
                                        </div>
                                        {expandedGroup === index && (
                                            <div className="pl-4 mt-2">
                                                {loaiTin
                                                    .filter(sub => sub.id_nhomtin === group.id_nhomtin)
                                                    .map(sub => (
                                                        <MenuItem key={sub.id_loaitin} onClick={() => handleFilterSelect('loaitin', sub.id_loaitin)}>
                                                            {sub.ten_loaitin}
                                                        </MenuItem>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {isMobile && (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <div className='p-3'>
                                        <AdvanceSearch nhomTin={nhomTin} loaiTin={loaiTin} />
                                    </div>
                                </LocalizationProvider>
                            )}
                        </div>
                    </Drawer>

                </div>

                {/* Tiêu đề nằm ở vị trí absolute */}
                <h1
                    className={`text-3xl font-bold text-center text-white transition-all absolute left-1/2 transform -translate-x-1/2 ${hideTitle ? 'hidden' : ''}`}
                >
                    Tin Tức 24h
                </h1>

                {/* Icon Search / SearchBar */}
                <div className="flex items-center space-x-2">
                    {openSearch ? (
                        <div className="flex items-center space-x-2 sm:w-auto">
                            <TextField
                                autoFocus
                                variant="outlined"
                                size="small"
                                placeholder="Tìm kiếm..."
                                value={titleOrContent}
                                onChange={(e) => setTitleOrContent(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px', // Bo tròn input
                                        backgroundColor: 'white',
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'transparent', // Loại bỏ viền xanh gây gấp khúc
                                    },
                                    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#ccc', // Hoặc màu xám nhẹ khi focus
                                    },
                                }}
                            />

                            {/* Nút tìm có cùng chiều cao và màu nổi bật hơn */}
                            <button
                                onClick={handleSearchSubmit}
                                className="ms-3 h-[40px] px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md transition duration-200"
                            >
                                Tìm
                            </button>

                            <IconButton onClick={handleSearchClick} className="text-white">
                                <Close sx={{ color: 'white', fontSize: 36 }} />
                            </IconButton>
                        </div>
                    ) : (
                        <IconButton onClick={handleSearchClick} className="text-white">
                            <Search sx={{ color: 'white', fontSize: 36 }} />
                        </IconButton>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
