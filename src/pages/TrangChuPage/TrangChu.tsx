import React, { useEffect, useState } from 'react';
import Header from '../../components/HeaderComponent/Header';
import Footer from '../../components/FooterComponent/Footer';
import AdvanceSearch from '../../components/AdvanceSearchComponent/AdvanceSearch';
import TinTuc from '../../components/TinTucComponent/TinTuc';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const TrangChu: React.FC = () => {
    const [nhomTin, setNhomTin] = useState([]);
    const [loaiTin, setLoaiTin] = useState([]);
    const [Tin, setTin] = useState([]);
    // const [filter, setFilter] = useState<{ type: string; id: number | null }>({ type: '', id: null });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://apiwebsitetintuc-production.up.railway.app/api/trangchu');

                if (!response.ok) {
                    throw new Error(`Lỗi mạng: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                setNhomTin(data.nhomtin);
                setLoaiTin(data.loaitin);
                setTin(data.tin);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu từ API:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Header nhomTin={nhomTin} loaiTin={loaiTin} />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <main className="flex-grow mt-24 mb-16 flex gap-4">
                    <div className="w-7/10">
                        <TinTuc Tin={Tin} loaiTin={loaiTin} nhomTin={nhomTin} />
                    </div>
                    <div className="w-3/10">
                    <AdvanceSearch nhomTin={nhomTin} loaiTin={loaiTin} />
                    </div>
                </main>
            </LocalizationProvider>

            <Footer />
        </div>
    );
};

export default TrangChu;
