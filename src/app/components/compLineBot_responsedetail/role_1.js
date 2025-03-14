//role 1 responsedetail
'use client'
import React, { useState, useEffect } from 'react';
import '../../globals.css'
// import '@fontsource/ntr'
import '@fontsource/mitr';
import axios from 'axios';
import { CompLanguageProvider, useLanguage } from '../compLanguageProvider_role_1';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { BsCheckCircle } from "react-icons/bs";



function CompLineBotResponsedetail() {
  return (
    <CompLanguageProvider>
      <App />
    </CompLanguageProvider>
  );
}

function App() {
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();
  const [notifyMessage, setnotifyMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [docx, setdocx] = useState(false);
  const [jpg, setjpg] = useState(false);
  const [pdf, setpdf] = useState(false);
  const [xlsx, setxlsx] = useState(false);
  const [fileelse, setelse] = useState(false);
  const [openpopup, setopenpopup] = useState(false);
  const [message, setMessage] = useState('');
  const [addmessage, setAddMessage] = useState('');
  const [reloadData, setReloadData] = useState(false); // เพิ่ม state นี้
  const [todoList, setTodoList] = useState([]);
  const [fileData, setFileData] = useState();

  useEffect(() => {

    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const responseValue = searchParams.get('response');
      const idValue = searchParams.get('id');

      const fetchData = async () => {
        try {

          const AddData = { responseValue, idValue, responseDetail: true };
          const dataDetail = JSON.stringify(AddData);

          const response = await axios.post('/api/response', dataDetail, {
            headers: { 'Content-Type': 'application/json' },
          });

          const data = response.data;

          if (response.status === 200) {
            if (data.success === true) {
              const notifyData = data.responseResult.map(item => ({
                title: item.title,
                employee: item.employee,
                location: item.location,
                work_owner: item.work_owner,
                position: item.status,
                date: item.formattedDate,
                file: item.file,
                detail: item.detail,
                Verification_status: item.Verification_status
              }));

              const byteArray = data.responseResult[0].file.data;
              const uint8Array = new Uint8Array(byteArray);
              const blob = new Blob([uint8Array], { type: 'image/jpeg' });
              const url = URL.createObjectURL(blob);

              setFileData(url);
              setTodoList(notifyData);

            } else {
              setMessage(data.error);
            }
          } else {
            setMessage(data.error);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setMessage('');
        }
      };

      fetchData();
    }
  }, [reloadData]);

  return (
    <div>

        <div className="bg-[#5A985E] h-[60px] flex items-center justify-between px-[20px]">
            <h1 className="text-white text-[24px] font-bold">JorPor</h1>
            <button
                className="text-white text-[15px] font-semibold "
                onClick={toggleLanguage}>{language}</button>
        </div>

        <div className='bg-[url("/bg1.png")] overflow-auto bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center '>
            <div className='md:w-[800px] lg:w-[1000px] mx-auto '>
                <div className='absolute top-[100px] left-1/2 transform -translate-x-1/2 z-0'>
                    <div className='bg-[#5A985E] mx-auto max-w-[500px] sm:max-w-[350px] py-[100px] rounded-[50px]'></div>
                </div>
                {todoList.map((todo, index) => (

                    <div key={index} className='mx-auto w-[300px] md:w-[750px] lg:w-[800px] mb-[50px] py-[30px] text-black flex flex-col bg-[#FFF] text-center md:rounded-[50px] rounded-[30px] mt-[95px]'>

                        <div className='md:mt-[10px]'>

                            {/* Title with Status */}
                            <div className='md:text-[20px] ml-[32px] text-[15px] md:w-[500px] md:ml-[45px] mt-[1px] text-left'>
                                <p>{todo.title}</p>
                                <p className='mt-[5px] md:text-[14px] border-[#64CE3F] bg-[#F5F5F5] px-[8px] py-[1px] rounded-[15px] text-[#808080] inline-block'>
                                    {todo.Verification_status === 1 && t("Approve")}
                                    {todo.Verification_status === 2 && t("Pending approval")}
                                    {todo.Verification_status === 3 && t("Evalution")}
                                    </p>
                            </div>

                            <div className="mt-[10px] border-t border-gray-300"></div>
                        </div>

                        <div className='px-2 flex items-center mx-auto w-[250px] md:w-[600px] lg:w-[700px] py-3 text-black bg-[#F5F5F5] text-center mt-[15px] rounded-[20px]'>
                            <div className='text-[12px] md:text-[18px] rounded-[10px] w-full px-2 py-2 bg-[#F5F5F5]'>

                                <div className='flex px-3 '>
                                    <p className='text-[#000] text-left w-[75px] ml-[-1px] md:w-[130px] md:ml-[-11px]'>{t('Employee')}</p>
                                    <p>:</p>
                                    <p className='md:ml-[15px] ml-[10px] whitespace-nowrap overflow-ellipsis overflow-hidden md:w-[450px] text-left w-[110px]'>{todo.employee}</p>
                                </div>

                                <div className='flex px-3 mt-[5px]'>
                                    <p className='text-[#000] text-left w-[75px] ml-[-1px] md:w-[130px] md:ml-[-11px]'>{t('Location')}</p>
                                    <p>:</p>
                                    <p className='md:ml-[15px] ml-[10px] whitespace-nowrap overflow-ellipsis overflow-hidden md:w-[450px] text-left w-[110px]'>{todo.location}</p>
                                </div>

                                <div className='flex px-3 mt-[5px]'>
                                    <p className='text-[#000] text-left w-[75px] ml-[-1px] md:w-[130px] md:ml-[-11px]'>{t("Work Owner")}</p>
                                    <p>:</p>
                                    <p className='md:ml-[15px] ml-[10px] w-[120px] whitespace-nowrap overflow-ellipsis overflow-hidden md:w-[450px] text-left'>{todo.work_owner}</p>
                                </div>

                                <div className='flex px-3 mt-[5px]'>
                                    <p className='text-[#000] text-left w-[75px] ml-[-1px] md:w-[130px] md:ml-[-11px]'>{t('Position')}</p>
                                    <p>:</p>
                                    <p className='md:ml-[15px] text-left w-[120px] ml-[10px] whitespace-nowrap overflow-ellipsis overflow-hidden md:w-[450px]'>{todo.position}</p>
                                </div>

                                <div className='flex px-3 mt-[5px]'>
                                    <p className='text-[#000] text-left w-[75px] ml-[-1px] md:w-[130px] md:ml-[-11px]'>{t('Date')}</p>
                                    <p>:</p>
                                    <p className='md:ml-[15px] ml-[10px] whitespace-nowrap overflow-ellipsis overflow-hidden md:w-[450px] text-left w-[120px]'>{todo.date} {t('N')}</p>
                                </div>

                            </div>
                        </div>

                        <div className='mx-auto w-[250px] md:w-[670px] lg:w-[720px] '>
                            <p className="text-[#808080] text-[13px] md:text-[16px] md:mt-[20px] text-left mt-[10px]">{t("Uploaded images")}</p>

                            {fileData && (
                                <div className="border mx-auto mt-[20px] border-grey-800 p-2 w-[235px]">
                                    <Image width={150} height={150} src={fileData} alt="รูปภาพ" className="w-full h-full" />
                                </div>
                            )}
                        </div>

                        <div className='mx-auto '>
                            <p className='text-[#808080] text-[13px] md:text-[16px] text-left mt-[20px] md:mt-[16px]'>{t('details')}</p>
                            <textarea
                                type="text"
                                name="detail"
                                placeholder={todo.detail}
                                className='rounded-[10px] mt-[5px] pl-[15px] w-[250px] h-[100px] md:text-[16px] text-[13px] md:w-[670px] lg:w-[720px] md:h-[80px] bg-[#fff] border border-gray-300 p-4'
                                readOnly
                            />
                        </div>

                        {message && (
                            <p className='mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                                {message}
                            </p>
                        )}

                        <div className='flex items-center md:px-10 md:mt-[20px]' />

                        {showSuccessPopup && (
                            <div className="bg-white text-[#5A985E] p-8 rounded-lg border-black shadow-lg md:w-[400px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <BsCheckCircle className='text-[50px] mx-auto mb-[10px]' />
                                {addmessage}
                            </div>
                        )}
                        {notifyMessage && (
                            <p className='mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                                {notifyMessage}
                            </p>
                        )}

                    </div>
                ))}
            </div>
        </div>
    </div>
);
}
export default CompLineBotResponsedetail;

