'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../globals.css'
// import '@fontsource/ntr';
import Link from 'next/link';
import { FiMenu } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';
import { BsPlusCircleFill } from 'react-icons/bs';
import { MdSystemSecurityUpdateGood } from 'react-icons/md'
import { GiClothes } from 'react-icons/gi'
import { BsTextarea } from 'react-icons/bs'
import { PiPencilSimpleFill } from 'react-icons/pi'
import { RxCross2 } from 'react-icons/rx'
import { BsCheckCircle } from 'react-icons/bs'
import { BsFillExclamationTriangleFill } from 'react-icons/bs'
import { useRouter } from 'next/navigation';
import '@fontsource/mitr';
import CompNavbar from './compNavbar/role_1';
import { CompLanguageProvider, useLanguage } from './compLanguageProvider_role_1';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { initReactI18next } from 'react-i18next';


function CompExamine() {
  return (
    <CompLanguageProvider>
      <App />
    </CompLanguageProvider>
  );
}

function App() {
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  const router = useRouter();

  const [message, setMessage] = useState('');
  const [showDeleteSuccessPopup, setShowDeleteSuccessPopup] = useState(false);
  const [showAddSuccessPopup, setShowAddSuccessPopup] = useState(false);
  const [deletemessage, setdeleteMessage] = useState(false);
  const [addmessage, setaddMessage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // เพิ่ม state เพื่อควบคุมการแสดง/ซ่อน popup
  const [showEditPopup, setShowEditPopup] = useState(false); // เพิ่ม state เพื่อควบคุมการแสดง/ซ่อน popup
  const [reloadData, setReloadData] = useState(false); // เพิ่ม state นี้
  const [showPopupUseEmployee, setShowPopupUseEmployee] = useState(false); // เพิ่ม state เพื่อควบคุมการแสดง/ซ่อน popup
  const [useEmployee, setUseEmployee] = useState(false);
  const [examinelist_name, setexaminelist_name] = useState('');
  const [examinelist_Id, setexaminelist_Id] = useState('');
  const [examine_Id, setexamine_Id] = useState('');
  const [id, setId] = useState('');
  const [isLoading, setIsLoading] = useState(false);





  useEffect(() => {
    const storedId = localStorage.getItem('id');
    if (storedId) {
      setId(storedId);
    }
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const examinelist_nameValue = searchParams.get('examinelist_name'); // กำหนดค่าเริ่มต้นว่างไว้ถ้าไม่มีค่า
      const examinelist_idValue = searchParams.get('id'); // กำหนดค่าเริ่มต้นว่างไว้ถ้าไม่มีค่า


      const fetchData = async () => {
        try {
          const AddData = { examinelist_nameValue, examinelist_idValue, storedId, fetch: true };
          const fetchdata = JSON.stringify(AddData);

          const response = await axios.post('/api/examine', fetchdata, {
            headers: { 'Content-Type': 'application/json' },
          });
          const data = response.data;

          if (response.status === 200) {
            if (data.success === true) {
              console.log('data:', data);
              setTodoList(data.dbexamine_name);

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
      setexaminelist_Id(examinelist_idValue)
      setexaminelist_name(examinelist_nameValue);
      fetchData();
    }
  }, [reloadData, useEmployee]);


  const openPopup = () => {
    setMessage('');
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const openEditPopup = async (index, todo) => {
    setMessage('');
    setShowEditPopup({ isOpen: true, index, todo });
  };

  const closeEditPopup = () => {
    setShowEditPopup(false);
  };

  const [examine_name, setExamine_name] = useState("");
  const [todoList, setTodoList] = useState([]);


  const addTodo = async () => {
    if (examine_name.trim() === "") {
      setMessage("Please fill in  fields");
      return;
    }

    try {


      const useEmployeeAsString = useEmployee.toString(); // แปลงค่า useEmployee เป็น string

      const AddData = { examine_name, useEmployeeAsString, examinelist_Id, examinelist_name, id, add: true };
      const data = JSON.stringify(AddData);

      const response = await axios.post('/api/examine', data, {
        headers: { 'Content-Type': 'application/json' },
      });

      const resdata = response.data;

      if (response.status === 200) {
        if (resdata.success === true) {

          setTodoList(resdata.dbexamine_name);

          setShowAddSuccessPopup(true);
          setaddMessage(resdata.message);


          setTimeout(() => {
            setShowAddSuccessPopup(false);
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

    setUseEmployee(false)
    setExamine_name("");
    closePopup();
  }

  const handleEditClick = (index) => {
    setIsEditing(true);
  };


  const handleCheckboxEmployee = () => {
    setUseEmployee(true);
  }

  const deleteTodo = async (index, todo) => {
    try {
      const editedData = { todo, examinelist_name, id, examinelist_Id, edit: true };
      const data = JSON.stringify(editedData)

      const response = await axios.post('/api/examine', data, {
        headers: { 'Content-Type': 'application/json' },
      });

      closeEditPopup();

      const resdata = response.data;

      if (response.status === 200) {
        if (resdata.success === true) {
          setReloadData(prev => !prev);

          setShowDeleteSuccessPopup(true);
          setdeleteMessage(resdata.message);


          setTimeout(() => {
            setShowDeleteSuccessPopup(false);
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

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;



      const editedData = { formattedDate, id, submit: true };
      const data = JSON.stringify(editedData)


      const response = await axios.post('/api/examine', data, {
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

      <div className='bg-[url("/bg1.png")] overflow-auto bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center '>
        <div className='relative'>
          <div className='absolute top-[100px] left-1/2 transform -translate-x-1/2 z-0'>
            <div className='bg-[#5A985E] mx-auto max-w-[500px] sm:max-w-[350px] py-[100px] rounded-[50px]'></div>
          </div>
        </div>
        <div className='mx-auto border w-[300px] md:w-[750px] lg:w-[950px] py-[20px] md:h-[600px] h-[550px] text-black flex flex-col   md:rounded-[30px] rounded-[30px] mt-[106px]  bg-[#fff]'>

          <div className='flex items-center'>
            <h1 className={`md:ml-[50px] ml-[30px] text-[25px] md:text-[30px]   `}>{t('Examine')}</h1>
            <p className='text-black text-[13px] md:text-[18px] mt-[5px] ml-[8px] w-[130px]  md:w-[500px] whitespace-nowrap overflow-hidden overflow-ellipsis '>( {examinelist_name} )</p>
          </div>

          <div className="mt-[5px] border-t border-gray-300"></div>
          {!isEditing && (
            <PiPencilSimpleFill onClick={handleEditClick} className='absolute text-black md:text-[20px] text-[13px]  md:ml-[910px] md:mt-[15px] ml-[270px]  mt-[12px] cursor-pointer ' />
          )}

          <div className='  items-center mx-auto w-[250px] md:w-[680px] lg:w-[850px] h-[380px] text-black bg-[#F5F5F5] text-center mt-[20px] rounded-[20px] overflow-auto'>
            <div className='mx-auto mt-[15px]  flex flex-row justify-center md:justify-normal md:ml-[20px] flex-wrap'>

              {todoList.map((todo, index) => (

                <div
                  key={index}
                  className={`cursor-pointer border-[#F5F5F5] border-[5px] w-[90px] md:w-[150px] py-[30px] px-2 text-black flex-col bg-[#BEE3BA] text-center rounded-[15px] ${index % 2 === 0 ? 'clear-left' : ''}`}
                  onClick={() => {
                    if (!isEditing) {
                      router.push(`/checklistExamine?checklistname=${todo.name}&examinelistId=${examinelist_Id}&examinelist_name=${examinelist_name}&examineId=${todo.id}&index=${index}&useEmployee=${useEmployee ? 'true' : 'false'}`);
                    }
                  }}
                >
                  {isEditing ? (
                    <div>
                      <RxCross2
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditPopup(index, todo.name);
                        }}
                        className="text-[#5A985E] inline-block ml-[55px] md:ml-[115px] mt-[-65px] text-[12px] hover:-translate-y-0.5 duration-200"
                      />
                      <div className='flex justify-center'>
                        <p className='text-[#000] text-[14px] md:text-[18px] mt-[-20px] w-[60px] md:w-[100px] break-words whitespace-pre-wrap'>{todo.name}</p>
                      </div>
                    </div>
                  ) : (
                    <div className='flex justify-center'>
                      <p className='text-[#000]  text-[14px] md:text-[18px] md:w-[100px] w-[60px] break-words whitespace-pre-wrap'>{todo.name}</p>
                    </div>
                  )}
                </div>
              ))}



              {showDeleteSuccessPopup && (
                <div className="bg-white w-[250px] text-[#5A985E] p-8 text-center rounded-lg border-black shadow-lg  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <BsCheckCircle className=' text-[50px] mx-auto mb-[10px]' />
                  {deletemessage}
                </div>
              )}

              {showAddSuccessPopup && (
                <div className="bg-white text-center text-[#5A985E] p-8  rounded-lg border-black shadow-lg  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <BsCheckCircle className=' text-[50px] mx-auto mb-[10px]' />
                  {addmessage}
                </div>
              )}

            </div>
          </div>

          <div className={`text-[15px] md:text-[17px] flex justify-end w-[250px] md:mt-[15px] mx-auto md:w-[750px] lg:w-[940px]  md:px-10 `}>
            {isEditing ? (
              <button onClick={() => setIsEditing(false)} className='flex mx-auto mt-[20px]   md:mt-[20px] border-[#64CE3F] bg-[#64CE3F] px-10 py-1  rounded-[20px]   text-[#fff] hover:-translate-y-0.5 duration-200 '>{t('confirm')}</button>
            ) : (
              <button onClick={handleSubmit} className='mt-[20px]   md:mt-[20px]  border-[#64CE3F] bg-[#64CE3F] px-10 py-1 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200  '>{t('submit')}</button>
            )}
            <div>
              <div className="flex items-center ml-[0px] ">
                {!isEditing && (
                  <button
                    onClick={openPopup}
                    className="item-center text-[#5A985E] ml-[10px] text-4xl mt-[20px] hover:-translate-y-0.5 duration-200"
                  >
                    <BsPlusCircleFill />
                  </button>
                )}
              </div>
              {showPopupUseEmployee && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-[9999]">
                  <div className="bg-white p-4 rounded-lg border-black shadow-lg md:w-[400px] text-center">
                    <BsFillExclamationTriangleFill className=' text-[50px] text-[#5A985E] mx-auto mb-[10px]' />
                    <p className='md:text-[18px] '>{t("Do you want to retrieve employee names?")}</p>
                    <div className={`  text-[16px]  flex justify-center mt-[20px]`}>
                      <button className="flex justify-center items-center bg-[#93DD79] text-white px-4 py-2 ml-[5px] rounded hover:bg-green-600" onClick={() => { handleCheckboxEmployee(), setShowPopupUseEmployee(false) }}>{t('Yes')}</button>

                      <button className="flex justify-center items-center bg-[#FF6B6B] text-white px-4 py-2 ml-[10px] rounded hover:bg-red-600" onClick={() => setShowPopupUseEmployee(false)}>{t('Cancel')}</button>
                    </div>
                  </div>
                </div>
              )}
              {showPopup && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center ">
                  <div className={` text-[20px] bg-white p-4 rounded-lg border-black shadow-lg md:w-[400px] `}>
                    <h2 className=' text-[#5A985E]'>{t("Add Examine")}</h2>
                    <div className="mt-4">
                      <input className='mt-1 p-2 w-full border text-[20px] border-gray-300 rounded-md'
                        value={examine_name}
                        onChange={(e) => setExamine_name(e.target.value)}
                        placeholder={t("add examine")}
                        style={{ fontSize: language === 'EN' ? '18px' : '16px' }}
                      />
                    </div>
                    <div className='flex mx-auto mt-[10px]'>
                      <input type='checkbox' onChange={(e) => setShowPopupUseEmployee(true)} className='text-[15px] mr-[5px]'></input>

                      <p className='text-[12px]'>{t("Use employee list information")}</p>
                    </div>
                    {message && (
                      <p className='mt-3 text-red-500 text-[11px] py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                        {message}
                      </p>
                    )}
                    <div className={` text-[16px] flex justify-center mt-[10px] `}>
                      <button className="flex justify-center items-center bg-[#93DD79] text-white px-4 py-2 ml-[5px] rounded hover:bg-green-600" onClick={addTodo}>{t('Add')}</button>

                      <button className="flex justify-center items-center bg-[#FF6B6B] text-white px-4 py-2 ml-[10px] rounded hover:bg-red-600" onClick={() => closePopup(false)}>{t('Cancel')}</button>
                    </div>

                  </div>
                </div>
              )}

              {showEditPopup.isOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center ">
                  <div className="bg-white p-4 rounded-lg border-black shadow-lg  text-center ">
                    <h2 className={` text-[18px] md:text-[20px] text-[#5A985E] mt-[10px] `}> {t("Do you want to delete")}<span style={{ color: '#FF6B6B' }}> {showEditPopup.todo}</span> ?</h2>

                    {message && (
                      <p className={` mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]`}>
                        {message}
                      </p>
                    )}
                    <div className={` flex justify-center mt-[10px]  md:mt-[30px]`}>
                      <button className="flex justify-center items-center bg-[#93DD79] text-white px-4 py-2 ml-[5px] rounded hover:bg-green-600" onClick={() => deleteTodo(showEditPopup.index, showEditPopup.todo)}>{t('Yes')}</button>

                      <button className="flex justify-center items-center bg-[#FF6B6B] text-white px-4 py-2 ml-[10px] rounded hover:bg-red-600" onClick={() => closeEditPopup(false)}>{t('Cancel')}</button>
                    </div>

                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
                {isLoading && (
                  <div className='flex mx-auto items-center mt-1' >
                    <div className="mx-auto   mr-[3px] inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                    </div>
                    <p className="mx-auto  ml-[3px] md:ml-[5px] text-[12px] md:text-[16px] ">{t('Loading')}...</p>
                  </div>
                 )} 
              </div>
        </div>
      </div>
    </div>
  )
}
export default CompExamine;
