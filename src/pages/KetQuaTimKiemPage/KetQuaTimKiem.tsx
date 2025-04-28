import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
import TinTuc from '../../components/TinTucComponent/TinTuc';
import { useLocation } from 'react-router-dom';
import Header from '../../components/HeaderComponent/Header';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AdvanceSearch from '../../components/AdvanceSearchComponent/AdvanceSearch';
import Footer from '../../components/FooterComponent/Footer';

interface TinTucProps {
    id_tin: number;
    tieude: string;
    hinhdaidien: string;
    mota: string;
    noidung: string;
    ngaydangtin: string;
    tacgia: string;
    solanxem: number;
    tinhot: boolean;
    id_loaitin: number;
}

const KetQuaTimKiem: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [tin, setTin] = useState<TinTucProps[]>([]);
    const { state } = useLocation(); // Lấy state từ location (nhomTin và loaiTin)
    const [nhomTin] = useState(state?.nhomTin || []); // Nhận nhomTin từ state
    const [loaiTin] = useState(state?.loaiTin || []); // Nhận loaiTin từ state
    const queryParams = new URLSearchParams(location.search);
    const [showAdvanceSearch, setShowAdvanceSearch] = useState(window.innerWidth >= 910);

    useEffect(() => {
        const url = new URL('https://apiwebsitetintuc.onrender.com/api/tim-kiem-nang-cao');

        queryParams.forEach((value, key) => {
            url.searchParams.append(key, value);
        });

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(url.toString());
                const data = await response.json();
                setTin(data);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu tìm kiếm:', error);
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
    }, [location.search]);

    return (
        <>
            {loading ? (
                <p className="text-gray-600">Đang tải kết quả tìm kiếm...</p>
            ) : (
                <div className="flex flex-col min-h-screen">
                    <Header nhomTin={nhomTin} loaiTin={loaiTin} />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <main className="flex-grow mt-24 mb-16 flex gap-4">
                            <div className={showAdvanceSearch ? "w-7/10" : "w-full"}>
                                {tin.length === 0 ? (
                                    <div className="flex justify-center items-center text-xl">
                                        Không tìm thấy nội dung bạn muốn tìm
                                    </div>) : (<TinTuc Tin={tin} loaiTin={loaiTin} nhomTin={nhomTin} />)
                                }
                            </div>

                            {showAdvanceSearch && (
                                <div className="w-3/10">
                                    <AdvanceSearch
                                        nhomTin={nhomTin}
                                        loaiTin={loaiTin}
                                    />
                                </div>
                            )}
                        </main>
                    </LocalizationProvider>

                    <Footer />
                </div>
            )}
        </>
    );
};

export default KetQuaTimKiem;
