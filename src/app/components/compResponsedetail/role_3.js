'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import '../../globals.css'
// import '@fontsource/ntr'
import '@fontsource/mitr';
import axios from 'axios';
import CompNavbar from '../compNavbar/role_3';
import { CompLanguageProvider, useLanguage } from '../compLanguageProvider_role_3';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { initReactI18next } from 'react-i18next';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BsCheckCircle } from "react-icons/bs";
import { format } from 'date-fns';


function CompResponsedetail() {
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
  const [id, setId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();



  useEffect(() => {

    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const responseValue = searchParams.get('response');
      const idValue = searchParams.get('id');



      const fetchData = async () => {
        try {

          const AddData = { responseValue, idValue, responseDetail_role_3: true };
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
              setId(idValue)


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



  const handleSubmit = async () => {
    try {

      setIsLoading(true);

      const editedData = { id, submit_role_3: true };
      const data = JSON.stringify(editedData)


      const response = await axios.post('/api/responsedetail', data, {
        headers: { 'Content-Type': 'application/json' },
      });

      const resdata = response.data;

      if (response.status === 200) {
        if (resdata.success === true) {


          setTimeout(() => {
            router.push(resdata.redirect);
          }, 1000);
        } else {
          setMessage(resdata.error);
        }
      } else {
        setMessage(resdata.error);
      }


    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <div>

      <CompNavbar />

      <div className=' bg-[url("/bg1.png")]  overflow-auto bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center '>
        <div className='md:w-[800px] lg:w-[1000px] mx-auto '>
          <div className='absolute top-[100px] left-1/2 transform -translate-x-1/2 z-0'>
            <div className='bg-[#5A985E] mx-auto max-w-[500px] sm:max-w-[350px] py-[100px] rounded-[50px]'></div>
          </div>
          {todoList.map((todo, index) => (

            <div key={index} className='mx-auto w-[300px] md:w-[750px] lg:w-[800px] mb-[50px]  py-[30px] text-black flex flex-col  bg-[#FFF] text-center md:rounded-[50px] rounded-[30px] mt-[106px]  '>

              <div className='md:mt-[30px]'>

                <div className=' md:text-[20px] ml-[32px] text-[15px] md:w-[500px] md:ml-[45px] text-left '>
                  <p>{todo.title}</p>
                </div>


                <div className="mt-[10px] border-t border-gray-300"></div>
              </div>

              <div className=' px-2 flex items-center mx-auto w-[250px]  md:ml-[40px] md:w-[670px]  lg:w-[720px]  py-[20px] text-black bg-[#F5F5F5] text-center mt-[15px] rounded-[20px]'>
                <div className='  text-[12px] md:text-[18px]  rounded-[10px] w-[235px] md:w-[600px] py-2 md:py-4  bg-[#F5F5F5] ml-[5px] md:ml-[40px]'>

                  <div className='flex px-3 '>
                    <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[130px] md:ml-[-11px]'>{t('Employee')}</p>
                    <p>:</p>
                    <p className='md:ml-[15px] ml-[10px] whitespace-nowrap overflow-ellipsis overflow-hidden md:w-[450px]  text-left w-[110px]'>{todo.employee}</p>
                  </div>


                  <div className='flex px-3  mt-[5px]'>
                    <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[130px] md:ml-[-11px]'>{t('Location')}</p>
                    <p>:</p>
                    <p className='md:ml-[15px] ml-[10px] whitespace-nowrap overflow-ellipsis overflow-hidden md:w-[450px]  text-left w-[110px]'>{todo.location}</p>
                  </div>

                  <div className='flex px-3  mt-[5px]'>
                    <p className='text-[#000] text-left  w-[75px]  ml-[-1px] md:w-[130px] md:ml-[-11px]'>{t("Work Owner")} </p>
                    <p>:</p>
                    <p className='md:ml-[15px] ml-[10px] w-[120px] whitespace-nowrap overflow-ellipsis overflow-hidden md:w-[450px]  text-left'>{todo.work_owner}</p>
                  </div>


                  <div className='flex px-3 mt-[5px]'>
                    <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[130px] md:ml-[-11px]'>{t('Position')}</p>
                    <p>:</p>
                    <p className='md:ml-[15px] text-left  w-[120px] ml-[10px] whitespace-nowrap overflow-ellipsis overflow-hidden md:w-[450px]  '>{todo.position}</p>
                  </div>


                  <div className='flex px-3  mt-[5px]'>
                    <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[130px] md:ml-[-11px]'>{t('Date')}</p>
                    <p>:</p>
                    <p className='md:ml-[15px] ml-[10px] whitespace-nowrap overflow-ellipsis overflow-hidden md:w-[450px]  text-left w-[120px]'>{todo.date} {t('N')}</p>
                  </div>

                </div>
              </div>

              <div className='mx-auto  w-[250px]  md:w-[670px] lg:w-[720px] '>
                <p className="text-[#808080]  text-[13px] md:text-[16px] md:mt-[20px] text-left mt-[10px]">{t("Uploaded images")}</p>


                {fileData && (
                  <div className="border mt-[20px] border-grey-800 p-2 w-[235px] mx-auto">
                    <Image width={150} height={150} src={fileData} alt="รูปภาพ" className="w-full h-full" />
                  </div>
                )}
              </div>




              <div className='mx-auto '>
                <p className='  text-[#808080] text-[13px] md:text-[16px] text-left mt-[20px]  md:mt-[16px]'>{t('details')}</p>
                <textarea
                  type="text"
                  name="detail"
                  placeholder={todo.detail}
                  className='rounded-[10px] mt-[5px] pl-[15px] w-[250px]  h-[100px]  md:text-[16px] text-[13px] md:w-[670px] lg:w-[720px] md:h-[80px] bg-[#fff] border border-gray-300 p-4'
                  readOnly
                />
              </div>


              {message && (
                <p className='mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                  {message}
                </p>
              )}

              <div className='flex items-center md:px-10  md:mt-[20px] mx-auto' >
                <button type="submit" onClick={handleSubmit} className=' mt-[20px] text-md md:text-[20px]  border-[#64CE3F] bg-[#64CE3F] px-10  py-1 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200'>{t('Evalution')}</button>
              </div>

              {showSuccessPopup && (
                <div className="bg-white text-[#5A985E] p-8  rounded-lg border-black shadow-lg md:w-[400px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <BsCheckCircle className=' text-[50px] mx-auto mb-[10px]' />
                  {addmessage}
                </div>
              )}
              {notifyMessage && (
                <p className=' mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                  {notifyMessage}
                </p>
              )}
              <div>
                {isLoading && (
                  <div className='flex mx-auto items-center mt-4' >
                    <div className="mx-auto   mr-[3px] inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                    </div>
                    <p className="mx-auto  ml-[3px] md:ml-[5px] text-[12px] md:text-[16px] ">{t('Loading')}...</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default CompResponsedetail;

