//role 3 response
'use client'
import React, { useState ,useEffect } from 'react';
import Link from 'next/link'
import '../../globals.css'
// import '@fontsource/ntr'
import '@fontsource/mitr';
import axios from 'axios';
import { CompLanguageProvider, useLanguage } from '../compLanguageProvider_role_3';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { TiWarning } from "react-icons/ti";

function CompResponse() {
  return (
    <CompLanguageProvider>
      <App />
    </CompLanguageProvider>
  );
}

function App() {
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();
  const [toggle, setToggle] = useState(false);
  const [reloadData, setReloadData] = useState(false); // เพิ่ม state นี้
  const [message, setMessage] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [selectedOption, setSelectedOption] = useState('Daily');
  const [todoListNotifyDaily, setTodoListNotifyDaily] = useState([]);
  const [todoListNotifyWeekly, setTodoListNotifyWeekly] = useState([]);
  const [todoListNotifyMonthly, setTodoListNotifyMonthly] = useState([]);


  useEffect(() => {

    const fetchData = async () => {
      try {
        const storedId = localStorage.getItem('id');

        const AddData = { storedId, response_role_3 : true};
        const dataDetail = JSON.stringify(AddData);

        const response = await axios.post('/api/response', dataDetail, {
          headers: { 'Content-Type': 'application/json' },
        });
        const data = response.data;

        if (response.status === 200) {
          if (data.success === true) {

            const notifyData = data.responseResult.map(item => ({
              id: item.id,
              title: item.title,
              date: item.formattedDate,
              Verification_status: item.Verification_status
            }));
            setTodoList(notifyData.reverse());
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
    const fetchDataNotify = async () => {
      try {

        const response = await axios.post('/api/button', { fetchNotify: true }, {
          headers: { 'Content-Type': 'application/json' },
        });

        // const response = await axios.get('/api/notify'); // แทน '/api/examine' ด้วยเส้นทางที่ถูกต้องไปยัง API ของคุณ
        const data = response.data;

        if (response.status === 200) {
          if (data.success === true) {

            console.log("dataNotify: ", data)
            const [dailyData, weeklyData, monthlyData] = data.dataNotify;
            console.log("dailyData: ", dailyData)

            setTodoListNotifyDaily(dailyData);
            setTodoListNotifyWeekly(weeklyData);
            setTodoListNotifyMonthly(monthlyData);

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
    fetchDataNotify();
  }, [reloadData]);

  const formatDateTime = (isoDateTime) => {
    const inputDate = new Date(isoDateTime);
    const formattedDate = format(inputDate, 'dd/MM/yyyy HH:mm');

    return formattedDate;
  };
  
  return (
    <div>
      
    <div className="bg-[#5A985E] h-[60px] flex items-center justify-between px-[20px]">
    <h1 className="text-white text-[24px] font-bold">JorPor</h1>
    <button
        className="text-white text-[15px] font-semibold "
        onClick={toggleLanguage}>{language}</button>
    
  </div>

      <div className=' bg-[url("/bg1.png")] overflow-auto bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center   '>
        <div className='md:w-[800px] lg:w-[1000px] mx-auto '>
          <div className='absolute top-[100px] left-1/2 transform -translate-x-1/2 z-0'>
            <div className='bg-[#5A985E] mx-auto max-w-[500px] sm:max-w-[350px] py-[100px] rounded-[50px]'></div>
          </div>
          <div className=' w-[320px] md:w-[700px] lg:w-[800px] mx-auto mt-[85px]'>
          </div>
          <div className="mx-auto border w-full max-w-[330px] md:max-w-[700px] lg:max-w-[800px] py-[20px] min-h-[80vh] text-black flex flex-col rounded-[30px] mt-[25px] bg-[#fff]">
  
            <h1 className='text-[22px] md:text-[25px]  ml-[30px]'>{t('Response')}</h1>
  
            <div className="mt-[5px] md:mt-[10px] mx-auto  border w-full md:w-[680px] lg:w-[750px] border-gray-300"></div>
  
            <div className='mx-auto w-[290px] md:w-[650px] lg:w-[750px]  py-[20px] md:h-[1200px] h-[680px] text-black flex flex-col  bg-[#D9D9D9] md:rounded-[30px] rounded-[30px] mt-[20px] overflow-auto '>
              {todoList.length === 0 && (
                <div className='  mx-auto justify-center text-center  text-black'>
                  <div className='p-2 px-6'>
                    <TiWarning className='text-[30px] mx-auto text-[#5A985E]' />
                    <h2 className=' py-1  text-[11px] md:text-[15px]'>{t("No information")}</h2>
                  </div>
                </div>)}
              {todoList.map((todo, index) => (
                <Link href={`/linebot_responsedetail_role_3?response=${todo.title}&id=${todo.id}`} key={index}>
                  <div key={index} className={'mx-auto  mt-[8px] w-[255px] p-2 h-[110px] md:h-[105px] md:w-[600px] lg:w-[700px] px-2 text-black flex-col bg-[#FFF] text-center rounded-[15px] '}>
                    <div className='flex justify-center  h-[40px] md:ml-[15px] lg:ml-[20px] mt-[15px]'>
                      <p className='text-[#000]  ml-[5px]  text-[14px] text-left md:text-[18px] w-[250px] md:w-[600px] lg:w-[700px]  break-words whitespace-pre-wrap'>
                        {todo.title}  <span className='text-gray-500 text-[12px] md:text-[15px]'>{todo.date} {t('N')}</span>
                      </p>
                    </div>
                    <div className=" border-t mt-[5px] md:mt-0 border-gray-300"></div>
                    <div className='flex  items-center justify-between'>
                      <div className=' bg-[#F5F5F5] mt-[10px] md:w-[350px] lg:w-[450px] w-[90px] md:ml-[15px] ml-[5px] h-[25px] md:h-[30px] rounded-[10px]'></div>
                      <div className={`items-center mt-[10px] text-[11px] md:text-[14px] md:h-[30px] h-[25px] border-[#64CE3F] bg-[#64CE3F] px-5 md:px-10 rounded-[20px] text-[#fff] flex `}>
                      {todo.Verification_status === 2 && t("Approve")}</div>                  
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
</div>
   
  )
}  
export default CompResponse;