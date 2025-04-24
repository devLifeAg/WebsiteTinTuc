import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white p-4">
            <div>
                <h3 className="text-center text-3xl font-extrabold mb-4">Website Tin Tức Nhóm 3 - Thực Tập Tốt Nghiệp 2025</h3>
                <div className='ms-4 me-4 flex flex-col md:flex-row gap-6'>
                    <div className='w-full md:w-[25%]'>
                        <div className='flex gap-2'>
                            <div className="font-bold">Giảng viên hướng dẫn: </div>
                            <div>ThS. Trần Văn Hùng</div>
                        </div>
                        <div className="font-bold">Sinh viên thực hiện:</div>
                        <ul className="list-disc ml-5">
                            <li>Đặng Ngọc Hiếu</li>
                            <li>Nguyễn Xuân Long</li>
                            <li>Nguyễn Ái Thiềm Định</li>
                            <li>Mô Ham Mách A Ra Pát</li>
                            <li>Hứa Vinh Thắng (Trưởng Nhóm)</li>
                        </ul>
                    </div>
                    <div className='w-full md:w-[37.5%]'>
                        <p>
                            <span className="font-bold">Link trang chủ: </span>
                            <a
                                className="text-blue-500 hover:underline break-all"
                                href="https://devlifeag.github.io/WebsiteTinTuc/"
                                target="_blank"
                            >
                                https://devlifeag.github.io/WebsiteTinTuc/
                            </a>
                        </p>

                        <p>
                            <span className="font-bold">Link trang admin: </span>
                            <a
                                className="text-blue-500 hover:underline break-all"
                                href="https://devlifeag.github.io/WebsiteTinTuc/admin"
                                target="_blank"
                            >
                                https://devlifeag.github.io/WebsiteTinTuc/admin
                            </a>
                        </p>

                        <p>
                            <span className="font-bold">Link api backend: </span>
                            <a
                                className="text-blue-500 hover:underline break-all"
                                href="https://apiwebsitetintuc-production.up.railway.app/"
                                target="_blank"
                            >
                                https://apiwebsitetintuc-production.up.railway.app/
                            </a>
                        </p>
                        <p>
                            <span className="font-bold">Link mô tả api: </span>
                            <a
                                href="https://docs.google.com/spreadsheets/d/1VAoi7kks5KiNFOKbAI9nL21Q1jR-SgwYNUn1LdhFE5Q/edit?usp=drive_link"
                                className="text-blue-500 hover:underline break-all"
                                target="_blank"
                            >
                                https://docs.google.com/spreadsheets/d/1VAoi7kks5KiNFOKbAI9nL21Q1jR-SgwYNUn1LdhFE5Q/edit?usp=drive_link
                            </a>
                        </p>
                    </div>

                    <div className='w-full md:w-[37.5%]'>
                        <div className="font-bold">Công nghệ sử dụng:</div>
                        <ul className="list-disc ml-5">
                            <li>Frontend: React + Vite + TypeScript</li>
                            <li>Backend: Laravel</li>
                            <li>Database: MySQL</li>
                        </ul>
                        <p>
                            <span className="font-bold">Github frontend: </span>
                            <a
                                className="text-blue-500 hover:underline break-all"
                                href="https://github.com/devLifeAg/WebsiteTinTuc"
                                target="_blank"
                            >
                                https://github.com/devLifeAg/WebsiteTinTuc
                            </a>
                        </p>

                        <p>
                            <span className="font-bold">Github backend: </span>
                            <a
                                className="text-blue-500 hover:underline break-all"
                                href="https://github.com/arapat1412/ApiWebsiteTinTuc"
                                target="_blank"
                            >
                                https://github.com/arapat1412/ApiWebsiteTinTuc
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
