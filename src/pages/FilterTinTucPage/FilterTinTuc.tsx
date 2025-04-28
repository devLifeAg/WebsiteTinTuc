import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/HeaderComponent/Header';
import Footer from '../../components/FooterComponent/Footer';
import AdvanceSearch from '../../components/AdvanceSearchComponent/AdvanceSearch';
import TinTuc from '../../components/TinTucComponent/TinTuc';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

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

const Filter: React.FC = () => {
    const [tinTuc, setTinTuc] = useState<TinTucProps[]>([]);
    // const [loading, setLoading] = useState<boolean>(true);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const idNhomTin = queryParams.get('id_nhomtin');
    const idLoaiTin = queryParams.get('id_loaitin');
    const { state } = useLocation(); // Lấy state từ location (nhomTin và loaiTin)
    const [nhomTin] = useState(state?.nhomTin || []); // Nhận nhomTin từ state
    const [loaiTin] = useState(state?.loaiTin || []); // Nhận loaiTin từ state
    const [showAdvanceSearch, setShowAdvanceSearch] = useState(window.innerWidth >= 910);

    useEffect(() => {
        const fetchTinTuc = async () => {
            // setLoading(true);
            try {
                let url = 'https://apiwebsitetintuc.onrender.com/api/tintuc?';
                if (idNhomTin) {
                    url += `id_nhomtin=${idNhomTin}`;
                } else if (idLoaiTin) {
                    url += `id_loaitin=${idLoaiTin}`;
                }

                const response = await fetch(url);
                const data = await response.json();
                setTinTuc(data);
            } catch (error) {
                console.error('Error fetching tin tuc:', error);
            } finally {
                // setLoading(false);
            }
        };

        fetchTinTuc();
        const handleResize = () => {
            setShowAdvanceSearch(window.innerWidth >= 910);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [idNhomTin, idLoaiTin]);

    return (
        <div className="flex flex-col min-h-screen">
            <Header nhomTin={nhomTin} loaiTin={loaiTin} />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <main className="flex-grow mt-24 mb-16 flex gap-4">
                <div className={showAdvanceSearch ? "w-7/10" : "w-full"}>
                        <TinTuc Tin={tinTuc} loaiTin={loaiTin} nhomTin={nhomTin} />
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
    );
};

export default Filter;
