import React, { useState } from 'react';
import { Drawer, TextField, IconButton, MenuItem } from '@mui/material';
import { Search, Menu as MenuIcon, ArrowDropDown, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

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
    const handleSearchClick = () => {
        setOpenSearch(!openSearch);
    };

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleGroupToggle = (index: number) => {
        setExpandedGroup(expandedGroup === index ? null : index);
    };

    // Hàm chuyển hướng khi chọn nhóm tin hoặc loại tin
    const handleFilterSelect = (type: string, id: number | null) => {
        // setFilter({ type, id });
        if (type === 'nhomtin') {
            navigate(`/tintuc?id_nhomtin=${id}`, { state: { nhomTin, loaiTin } });
        } else if (type === 'loaitin') {
            navigate(`/tintuc?id_loaitin=${id}`, { state: { nhomTin, loaiTin } });
        }else{
            navigate(`/tintuc`, { state: { nhomTin, loaiTin } });
        }
    };

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
                        PaperProps={{ style: { width: '300px' } }}
                    >

                        <div className="p-7 bg-blue-600 text-white flex justify-center items-center">
                            <h3 className="text-lg font-bold">CHUYÊN MỤC</h3>
                        </div>
                        <div className="p-4">
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

                            {/* Duyệt qua nhomTin */}
                            {nhomTin.map((group, index) => (
                                <div key={group.id_nhomtin}>
                                    <div className="flex items-center justify-between cursor-pointer font-bold" onClick={() => handleGroupToggle(index)}>
                                        <div
                                            className="font-bold cursor-pointer"
                                            onClick={() => handleFilterSelect('nhomtin', group.id_nhomtin)} // Sử dụng hàm handleFilterSelect
                                        >
                                            {group.ten_nhomtin}
                                        </div>
                                        <IconButton>
                                            <ArrowDropDown sx={{
                                                transform: expandedGroup === index ? 'rotate(180deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.3s'
                                            }} />
                                        </IconButton>
                                    </div>
                                    {expandedGroup === index && (
                                        <div className="pl-4 mt-2">
                                            {/* Lọc ra loaiTin theo id_nhomtin */}
                                            {loaiTin.filter(subGroup => subGroup.id_nhomtin === group.id_nhomtin).map((subGroup) => (
                                                <MenuItem
                                                    key={subGroup.id_loaitin}
                                                    onClick={() => handleFilterSelect('loaitin', subGroup.id_loaitin)} // Sử dụng hàm handleFilterSelect
                                                >
                                                    {subGroup.ten_loaitin}
                                                </MenuItem>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Drawer>
                </div>

                {/* Tiêu đề nằm ở vị trí absolute */}
                <h1
                    className={`text-3xl font-bold text-center text-white transition-all absolute left-1/2 transform -translate-x-1/2 ${openSearch && window.innerWidth <= 768 ? 'hidden' : ''}`}
                    style={{ zIndex: openSearch ? 0 : 10 }}
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
                                className="bg-white w-[300px]"
                            />
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
