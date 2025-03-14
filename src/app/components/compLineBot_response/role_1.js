//role 1 response
'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import '../../globals.css'
// import '@fontsource/ntr'
import '@fontsource/mitr';
import axios from 'axios';
import { CompLanguageProvider, useLanguage } from '../compLanguageProvider_role_1';
import { useTranslation } from 'react-i18next';
import { TiWarning } from "react-icons/ti";
import { PiPencilSimpleFill } from 'react-icons/pi';
import { RxCross2 } from 'react-icons/rx'
import { BsCheckCircle } from 'react-icons/bs';

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
  const [id, setId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [deletemessage, setdeleteMessage] = useState(false);
  const [todoListNotify, setTodoListNotify] = useState([]);
  const [selectedOption, setSelectedOption] = useState('Daily');
  const [todoListNotifyDaily, setTodoListNotifyDaily] = useState([]);
  const [todoListNotifyWeekly, setTodoListNotifyWeekly] = useState([]);
  const [todoListNotifyMonthly, setTodoListNotifyMonthly] = useState([]);



  useEffect(() => {
    const storedId = localStorage.getItem('id');
    if (storedId) {
      setId(storedId);
    }

    const fetchData = async () => {
      try {

        const AddData = { storedId, fetch: true };
        const dataDetail = JSON.stringify(AddData);

        const response = await axios.post('/api/response', dataDetail, {
          headers: { 'Content-Type': 'application/json' },
        });

        // const response = await axios.get('/api/notify'); // แทน '/api/examine' ด้วยเส้นทางที่ถูกต้องไปยัง API ของคุณ
        const data = response.data;

        if (response.status === 200) {
          if (data.success === true) {

            const notifyData = data.dbnotify_name.map(item => ({
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

  const handleEditClick = (index) => {
    setIsEditing(true);
  };


  const deleteTodo = async (index, todo) => {
    try {
      const storedId = localStorage.getItem('id');

      const editedData = { todo, storedId, edit: true };
      const data = JSON.stringify(editedData)


      const response = await axios.post('/api/response', data, {
        headers: { 'Content-Type': 'application/json' },
      });

      setShowEditPopup(false)

      const resdata = response.data;

      if (response.status === 200) {
        if (resdata.success === true) {
          setReloadData(prev => !prev);

          setdeleteMessage(resdata.message);
          const notifyData = resdata.dbnotify_name.map(item => ({
            id: item.id,
            title: item.title,
            date: item.formattedDate,
            Verification_status: item.Verification_status
          }));
          setTodoList(notifyData.reverse());

          setTimeout(() => {
            setdeleteMessage(false);
          }, 1000);

        } else {
          setMessage(resdata.error);
        }
      } else {
        setMessage(resdata.error);
      }
    } catch (error) {
      console.error('Error Examine:', error);
      setMessage('');
    }
  }

  const openEditPopup = async (index, todo) => {
    setMessage('');
    setShowEditPopup({ isOpen: true, index, todo });
  };

  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
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
          <div className=' w-[320px] md:w-[700px] lg:w-[700px] mx-auto mt-[80px]'>
          </div>
          <div className="mx-auto border w-full max-w-[330px] md:max-w-[600px] lg:max-w-[600px] py-[20px] min-h-[30vh] text-black flex flex-col rounded-[30px] mt-[25px] bg-[#fff]">
            <h1 className='text-[22px] md:text-[25px]  ml-[30px]'>{t('Response')}</h1>
            <PiPencilSimpleFill onClick={handleEditClick} className='absolute text-black md:text-[20px] text-[13px]  md:ml-[650px] lg:ml-[750px] md:mt-[15px] ml-[280px]  mt-[12px] cursor-pointer ' />

            <div className="mt-[5px] md:mt-[10px] mx-auto  border w-full md:w-[680px] lg:w-[750px] border-gray-300"></div>

            <div className='mx-auto w-[290px] md:w-[250px] lg:w-[550px]  py-[20px] md:h-[800px] h-[600px] text-black flex flex-col  bg-[#D9D9D9] md:rounded-[30px] rounded-[30px] mt-[20px] overflow-auto '>
              {todoList.length === 0 && (
                <div className='  mx-auto justify-center text-center  text-black'>
                  <div className='p-2 px-6'>
                    <TiWarning className='text-[30px] mx-auto text-[#5A985E]' />

                    <h2 className=' py-1  text-[11px] md:text-[15px]'>{t("No information")}</h2>
                  </div>
                </div>)}
              {todoList.length > 0 && (
                <>
                  {todoList.map((todo, index) => (
                    <div key={index} className={'mx-auto  mt-[8px] w-[250px] p-2 h-[100px] md:h-[105px] md:w-[600px] lg:w-[700px] px-2 text-black flex-col bg-[#FFF] text-center rounded-[15px] '}>
                      <div className='flex justify-center  h-[40px] md:ml-[15px] lg:ml-[20px] mt-[5px]'>
                        {isEditing ? (
                          <div className='flex  '>
                            <p className='text-[#000]   text-[14px] text-left md:text-[18px] w-[210px] md:w-[500px] lg:w-[598px]  break-words whitespace-pre-wrap'>
                              {todo.title}  <span className='text-gray-500 text-[12px] md:text-[15px]'>{todo.date} {t('N')}</span>
                            </p>
                            <RxCross2
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditPopup(index, todo, todo.id, todo.title);
                              }}
                              className="text-[#5A985E] inline-block  md:ml-[50px] mt-[-4px] md:mt-[1px] text-[12px] md:text-[16px] hover:-translate-y-0.5 duration-200"
                            />
                          </div>
                        ) : (
                          <Link href={`/linebot_responsedetail_role_1?response=${todo.title}&id=${todo.id}`} key={index}>
                            <p className='text-[#000] relative z-50 ml-[5px] text-[14px] md:h-[90px] h-[80px]   text-left md:text-[18px] w-[230px] md:w-[580px] lg:w-[670px]  break-words whitespace-pre-wrap'>
                              {todo.title}  <span className='text-gray-500  text-[12px] md:text-[15px]'>{todo.date} {t('N')}</span>
                            </p>
                          </Link>
                        )}
                      </div>
                      <div className=" border-t mt-[5px] md:mt-0 border-gray-300"></div>
                      <div className='flex  items-center justify-between'>
                        <div className=' bg-[#F5F5F5] mt-[10px] md:w-[350px] lg:w-[450px] w-[90px] md:ml-[15px] ml-[5px] h-[25px] md:h-[30px] rounded-[10px]'></div>
                        <div className='items-center mt-[5px] text-[11px] md:text-[14px] md:h-[30px] h-[25px] border-[#64CE3F] bg-[#64CE3F] px-5 md:px-10 rounded-[20px] text-[#fff] flex'>
                          {todo.Verification_status === 1 && t("Approve")}
                          {todo.Verification_status === 2 && t("Pending approval")}
                          {todo.Verification_status === 3 && t("Evalution")}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {showEditPopup.isOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center ">
                  <div className="bg-white p-4 text-center rounded-lg border shadow-lg ">
                    <h2 className={` text-[18px] md:text-[20px] text-[#5A985E] mt-[10px] `}>{t("Do you want to delete")} <span style={{ color: '#FF6B6B' }}>{showEditPopup.todo.title}</span> {t("?")}</h2>

                    {message && (
                      <p className='mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-[13px] md:mt-[30px]'>
                        {message}
                      </p>
                    )}
                    <div className={`text-[16px] flex justify-center mt-[10px]  md:mt-[30px]`}>
                      <button className="flex justify-center items-center bg-[#93DD79] text-white px-4 py-2 ml-[5px] rounded hover:bg-green-600" onClick={() => deleteTodo(showEditPopup.index, showEditPopup.todo)}>{t('Yes')}</button>

                      <button className="flex justify-center items-center bg-[#FF6B6B] text-white px-4 py-2 ml-[10px] rounded hover:bg-red-600" onClick={() => setShowEditPopup(false)}>{t('Cancel')}</button>
                    </div>

                  </div>
                </div>
              )}
              {deletemessage && (
                <div className="bg-white text-[#5A985E] p-8  rounded-lg border-black shadow-lg md:w-[400px] w-[250px] text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <BsCheckCircle className=' text-[50px] mx-auto mb-[10px]' />
                  {deletemessage}
                </div>
              )}
            </div>
            {isEditing && (
              <div className='items-center mt-[20px]' >
                <button onClick={() => setIsEditing(false)} className={`flex mx-auto  border-[#64CE3F] bg-[#64CE3F] px-10 py-1  rounded-[20px]    text-[#fff] hover:-translate-y-0.5 duration-200 `}>{t('confirm')}</button>
              </div>
            )}
          </div>

        </div>
      </div>
      </div>
  )
}
export default CompResponse;

