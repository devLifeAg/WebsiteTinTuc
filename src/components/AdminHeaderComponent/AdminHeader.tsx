import React, { useState } from 'react';
// import { Drawer, TextField, IconButton, MenuItem } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import logo from '/news.png'; // Đường dẫn tuyệt đối từ thư mục public
import { useNavigate } from 'react-router-dom';
import { List, ListItem, ListItemButton, ListItemText, Drawer, Avatar, Typography, Box, IconButton } from '@mui/material';
const Header: React.FC = () => {
    const qtv = JSON.parse(localStorage.getItem("qtv") || "null");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate(); // Khởi tạo useNavigate để điều hướng
    // const qtv = JSON.parse(localStorage.getItem("qtv") || "null");

    const handleNavigate = (path: string) => {
        navigate(path);
        setDrawerOpen(false);
    };

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("qtv");
        navigate("/"); // Điều hướng về trang đăng nhập
    };

    return (
        <header className="bg-blue-600 text-white p-4 fixed top-0 left-0 w-full z-10">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <IconButton edge="start" className="text-white" onClick={handleDrawerToggle}>
                        <MenuIcon sx={{ color: 'white', fontSize: 36 }} />
                    </IconButton>
                    {/* Drawer (Thanh sidebar) */}
                    <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}
                        sx={{ '& .MuiDrawer-paper': { width: 300 } }} // Điều chỉnh chiều rộng
                    >
                        <Box sx={{
                            p: 2,
                            background: '#2563EB', // Gradient nền
                            color: '#FFFFFF'
                        }}>
                                <Avatar
                                    src={logo}
                                    sx={{ width: 60, height: 60 }}
                                />
                            <Typography variant="h6" sx={{ mt: 1 }}>{qtv.ten_qtv}</Typography>
                            <Typography sx={{ mt: 1 }}>quản trị viên</Typography>
                        </Box>

                        <List>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => handleNavigate('/qltin')}>
                                    <ListItemText primary="Quản Lý Tin" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => handleNavigate('/qlbinhluan')}>
                                    <ListItemText primary="Quản Lý Bình Luận" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => handleNavigate('/qlnhomtin')}>
                                    <ListItemText primary="Quản Lý Nhóm Tin" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => handleNavigate('/qlloaitin')}>
                                    <ListItemText primary="Quản Lý Loại Tin" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton onClick={handleLogout}>
                                    <ListItemText primary="Đăng Xuất" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Drawer>
                </div>

                {/* Tiêu đề nằm ở vị trí absolute */}
                <h1
                    className={`text-3xl font-bold text-center text-white transition-all absolute left-1/2 transform -translate-x-1/2`}
                >
                    Quản Lý Tin Tức 24h
                </h1>
            </div>
        </header>
    );
};

export default Header;
