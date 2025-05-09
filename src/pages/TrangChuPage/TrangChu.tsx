import React, { useEffect, useState } from 'react';
import Header from '../../components/HeaderComponent/Header';
import Footer from '../../components/FooterComponent/Footer';
import AdvanceSearch from '../../components/AdvanceSearchComponent/AdvanceSearch';
import TinTuc from '../../components/TinTucComponent/TinTuc';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CircularProgress from '@mui/material/CircularProgress';

const TrangChu: React.FC = () => {
    const [nhomTin, setNhomTin] = useState([]);
    const [loaiTin, setLoaiTin] = useState([]);
    const [Tin, setTin] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdvanceSearch, setShowAdvanceSearch] = useState(window.innerWidth >= 910);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://apiwebsitetintuc.onrender.com/api/trangchu');

                if (!response.ok) {
                    throw new Error(`Lỗi mạng: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                setNhomTin(data.nhomtin);
                setLoaiTin(data.loaitin);
                setTin(data.tin);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu từ API:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const handleResize = () => {
            setShowAdvanceSearch(window.innerWidth >= 910);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Header nhomTin={nhomTin} loaiTin={loaiTin} />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                {loading ? (
                    <div className="flex flex-col items-center justify-center flex-grow text-center mt-24 mb-16">
                        <CircularProgress />
                        <p className="mt-4 text-gray-600 text-2xl">Đang tải tin tức...</p>
                        <p className="mt-4 text-gray-600 text-2xl">Quá trình có thể mất ít phút để khởi api từ server do nó tự động ngủ khi không có hoạt động, mong thầy thông cảm ạ!</p>
                    </div>
                ) : (
                    <main className="flex-grow mt-24 mb-16 flex gap-4">
                        <div className={showAdvanceSearch ? "w-7/10" : "w-full"}>
                            <TinTuc Tin={Tin} loaiTin={loaiTin} nhomTin={nhomTin} />
                        </div>

                        {showAdvanceSearch && (
                            <div className="w-3/10">
                                <div className="sticky top-28">
                                    <AdvanceSearch nhomTin={nhomTin} loaiTin={loaiTin} />
                                </div>
                            </div>
                        )}
                    </main>
                )}
            </LocalizationProvider>

            <Footer />
        </div>
    );
};

export default TrangChu;
