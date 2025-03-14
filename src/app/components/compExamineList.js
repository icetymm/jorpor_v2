'use client'
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import '../globals.css'
// import '@fontsource/ntr';
import { BsPlusCircleFill } from 'react-icons/bs';
import { PiPencilSimpleFill } from 'react-icons/pi'
import { RxCross2 } from 'react-icons/rx'
import { BsCheckCircle } from 'react-icons/bs'
import { BsFillExclamationTriangleFill } from 'react-icons/bs'
import { useRouter } from 'next/navigation';
import '@fontsource/mitr';
import CompNavbar from './compNavbar/role_1';
import { CompLanguageProvider, useLanguage } from './compLanguageProvider_role_1';
import { useTranslation } from 'react-i18next';
import { BsCalendar2Minus } from 'react-icons/bs';

import { i18n } from '../i18n'; // import i18n instance
import { initReactI18next } from 'react-i18next';

function CompExamineList({ checkedItems, onSubmit }) {

  return (
    <CompLanguageProvider>
      <App checkedItems={checkedItems} />
    </CompLanguageProvider>
  );
}


function App({ checkedItems: initialCheckedItems, onSubmit }) {
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  const [message, setMessage] = useState('');
  const [showDeleteSuccessPopup, setShowDeleteSuccessPopup] = useState(false);
  const [showAddSuccessPopup, setShowAddSuccessPopup] = useState(false);
  const [deletemessage, setdeleteMessage] = useState(false);
  const [addmessage, setaddMessage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [reloadData, setReloadData] = useState(false);
  const [showPopupAddnew, setShowPopupAddnew] = useState(false);

  const [useEmployee, setUseEmployee] = useState(false);
  const [User_id, setUser_id] = useState('');
  const [id, setId] = useState('');
  const [selected, setSelected] = useState(false);

  const currentDate = new Date().toLocaleDateString();
  const [selectedItems, setSelectedItems] = useState([]);
  const [todoListSelected, setTodoListSelected] = useState([]);
  const [checkedItems, setCheckedItems] = useState(initialCheckedItems);
  const [todoListadd, setTodoListadd] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 

  const router = useRouter();

  useEffect(() => {


    const storedUser_id = localStorage.getItem('id');

    const fetchData = async () => {
      try {

        const AddData = { storedUser_id, selectchecklist: true };
        const fetchdata = JSON.stringify(AddData);

        const response = await axios.post('/api/examinelist', fetchdata, {
          headers: { 'Content-Type': 'application/json' },
        });

        const data = response.data;

        if (response.status === 200) {
          
          if (data.success === true) {
            const examinelistNames = data.dbexaminelist_name.map(item => ({ id: item.id, name: item.name }));

            setTodoList(examinelistNames);
            setUser_id(storedUser_id);
            const examinelistId = data.dbexaminelist_name.map(item => item.id);

            setCheckedItems(examinelistId);

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
    setId(storedUser_id)
    fetchData();
  }, [reloadData]);


  const openPopup = async () => {
    try {
      const storedUser_id = id
      const AddData = { storedUser_id, fetchSelect: true };
      const data = JSON.stringify(AddData);

      const response = await axios.post('/api/examinelist', data, {
        headers: { 'Content-Type': 'application/json' },
      });

      const resdata = response.data;

      if (response.status === 200) {
        if (resdata.success === true) {


          const examinelistNames = resdata.dbexaminelist_name.map(item => ({ id: item.id, name: item.name }));


          setTodoListadd(examinelistNames)


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

  const [examinelist_name, setExaminelist_name] = useState("");
  const [todoList, setTodoList] = useState([]);


  const addTodoAddnew = async () => {
    if (examinelist_name.trim() === "") {
      setMessage("Please fill in  fields");
      return;
    }

    try {

      const AddData = { examinelist_name, id, add: true };
      const data = JSON.stringify(AddData);

      const response = await axios.post('/api/examinelist', data, {
        headers: { 'Content-Type': 'application/json' },
      });

      const resdata = response.data;

      if (response.status === 200) {
        if (resdata.success === true) {

          setTodoListadd(resdata.dbexaminelist_nameNew)

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

    setExaminelist_name("");
    setShowPopupAddnew(false);
  }

  const handleEditClick = () => {
    setIsEditing(true);
  };


  const handleCheckboxEmployee = () => {
    setUseEmployee(true);
  }

  const deleteTodo = async (index, todo) => {
    try {
      const editedData = { todo, id, checkedItems, edit: true };
      const data = JSON.stringify(editedData)

      const response = await axios.post('/api/examinelist', data, {
        headers: { 'Content-Type': 'application/json' },
      });

      closeEditPopup();

      const resdata = response.data;

      if (response.status === 200) {
        if (resdata.success === true) {
          setReloadData(prev => !prev);

          setShowDeleteSuccessPopup(true);
          setCheckedItems(resdata.data);
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


      const response = await axios.post('/api/examinelist', data, {
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

  const handleCheckboxChange = (index, todoId) => {

    if (checkedItems && checkedItems.includes(todoId)) {
      setCheckedItems(checkedItems.filter((item) => item !== todoId).sort((a, b) => a - b));
    } else {
      setCheckedItems([...(checkedItems || []), todoId].sort((a, b) => a - b));
    }

  };


  const handleCheckboxAdd = async () => {
    try {
      const AddData = { id, checkedItems, selectedUpdate: true };
      const fetchdata = JSON.stringify(AddData);

      const response = await axios.post('/api/examinelist', fetchdata, {
        headers: { 'Content-Type': 'application/json' },
      });

      const resdata = response.data;

      if (response.status === 200) {
        if (resdata.success === true) {

          setTodoList(resdata.data)
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
      console.error('Error:', error);
      setMessage('An error occurred while submitting the data.');
    }

    setShowPopup(false);
  };


  const resetCheckboxes = () => {
    setCheckedItems([]);
  };

  const openPopupAddnew = () => {
    setMessage('');
    setShowPopupAddnew(true);
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

        {/* {selected ? ( */}

        <div className='mx-auto border w-[300px] md:w-[750px] lg:w-[950px]  py-[20px] md:h-[600px] h-[550px] text-black flex flex-col   md:rounded-[30px] rounded-[30px] mt-[106px]  bg-[#fff]'>

          <h1 className={` ml-[30px] text-[25px] mt-[3px] mb-[5px] md:text-[30px] md:ml-[50px] `}>
            {t("Examine List")}
          </h1>

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
                      router.push(`/examine?examinelist_name=${todo.name}&id=${todo.id}&index=${index}`);
                    }
                  }}
                >
                  {isEditing ? (
                    <div>
                      <RxCross2
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditPopup(index, todo);
                        }}
                        className="text-[#5A985E] inline-block ml-[55px] md:ml-[115px] mt-[-65px] text-[12px] hover:-translate-y-0.5 duration-200"
                      />
                      <div className='flex justify-center '>
                        <p className='text-[#000] text-[14px] md:text-[18px]  mt-[-20px] w-[60px] md:w-[100px] break-words whitespace-pre-wrap'>{todo.name}</p>
                      </div>
                    </div>
                  ) : (
                    <div className='flex justify-center '>
                      <p className='text-[#000]  text-[14px]  md:text-[18px] md:w-[100px] w-[60px] break-words whitespace-pre-wrap'>{todo.name}</p>
                    </div>
                  )}
                </div>
              ))}

              {showDeleteSuccessPopup && (
                <div className="  z-50  bg-white w-[250px] text-[#5A985E] p-8 text-center rounded-lg border-black shadow-lg  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <BsCheckCircle className=' text-[50px] mx-auto mb-[10px]' />
                  {deletemessage}
                </div>
              )}

              {showAddSuccessPopup && (
                <div className="  z-50  bg-white text-center text-[#5A985E] p-8  rounded-lg border-black shadow-lg  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <BsCheckCircle className=' text-[50px] mx-auto mb-[10px]' />
                  {addmessage}
                </div>
              )}

            </div>
          </div>

          <div className={` text-[15px] md:text-[17px]  flex justify-end w-[250px] md:mt-[15px] mx-auto md:w-[750px] lg:w-[940px]  md:px-10 `}>
            {isEditing ? (
              <button onClick={() => setIsEditing(false)} className={`flex mx-auto mt-[20px]   md:mt-[20px] border-[#64CE3F] bg-[#64CE3F] px-10 py-1  rounded-[20px]    text-[#fff] hover:-translate-y-0.5 duration-200 `}>{t('confirm')}</button>
            ) : (
              <button onClick={handleSubmit} className={`mt-[20px]   md:mt-[20px]  border-[#64CE3F] bg-[#64CE3F] px-10 py-1 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200 `}>{t('submit')}</button>
            )}
           

            <div>
              <div className="flex items-center  ">
                {!isEditing && (
                  <button
                    onClick={openPopup}
                    className="item-center text-[#5A985E] ml-[10px] text-4xl mt-[20px] hover:-translate-y-0.5 duration-200"
                  >
                    <BsPlusCircleFill />
                  </button>
                )}
              </div>

              {showPopup && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center ">
                  <div className="bg-white  p-4 rounded-lg border shadow-lg md:w-[300px] w-[250px]  ">
                    <div className='flex items-center justify-between'>
                      <h2 className={`text-[18px] text-[#5A985E]  `}>{t("Add list examine")}</h2>
                      <button
                        onClick={openPopupAddnew}
                        className="item-center text-[#5A985E]  text-xl mt-[5px] hover:-translate-y-0.5 duration-200"
                      >
                        <BsPlusCircleFill />
                      </button>
                    </div>
                    <div className="mt-4 border  rounded-lg h-[200px] overflow-auto ">
                      {/* <input className={`text-[14px]  w-[268px] mt-1 p-2  border border-gray-300 rounded-md`}
                      value={examinelist_name}
                      onChange={(e) => setExaminelist_name(e.target.value)}
                      placeholder={language === 'EN' ? "add list examine" : 'เพิ่มรายการตรวจสอบ' }
                    /> */}
                      {console.log("todolist: ", todoListadd)}
                      {todoListadd.map((todo, index) => (
                        <div
                          key={index}
                          className={`
                        cursor-pointer 
                        pl-2 pt-1
                        text-left
                        text-black 
                        flex 
                        items-center
                        ${index % 2 === 0 ? 'clear-left' : ''} 
                        ${checkedItems && checkedItems.includes(todo.id) ? 'checked' : ''}
                        `}
                          onClick={() => handleCheckboxChange(index, todo.id)}
                        >
                          <input
                            type='checkbox'
                            className='mr-2'
                            checked={checkedItems && checkedItems.includes(todo.id)}
                            onChange={() => handleCheckboxChange(index, todo.id)}
                          />
                          <p className='text-[#000] bg-[#BEE3BA] rounded-[10px]  border-[#F5F5F5]  py-1 px-4  text-[14px] md:text-[18px]   break-words whitespace-pre-wrap'>
                            {todo.name}
                          </p>
                        </div>
                      ))}
                    </div>

                    {message && (
                      <p className='mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                        {message}
                      </p>
                    )}

                    <div className="flex justify-center mt-[20px]">
                      <button className="flex justify-center items-center bg-[#93DD79] text-white px-4 py-2 ml-[5px] rounded hover:bg-green-600" onClick={handleCheckboxAdd}>{t('Add')}</button>

                      <button className="flex justify-center items-center bg-[#FF6B6B] text-white px-4 py-2 ml-[10px] rounded hover:bg-red-600" onClick={() => { closePopup(false); resetCheckboxes(); }}>{t('Cancel')}</button>
                    </div>

                  </div>
                </div>
              )}

              {showPopupAddnew && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center ">
                  <div className="bg-white  p-4 rounded-lg border-black shadow-lg md:w-[300px] ">
                    <h2 className='text-[18px]'>{t("Add list examine")}</h2>
                    <div className="mt-4 ">
                      <input className={`text-[14px]  w-[268px] mt-1 p-2  border border-gray-300 rounded-md`}
                        value={examinelist_name}
                        onChange={(e) => setExaminelist_name(e.target.value)}
                        placeholder={t("add list examine")}
                      />
                    </div>

                    {message && (
                      <p className='mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                        {message}
                      </p>
                    )}

                    <div className="flex justify-center mt-[20px]">
                      <button className="flex justify-center items-center bg-[#93DD79] text-white px-4 py-2 ml-[5px] rounded hover:bg-green-600" onClick={addTodoAddnew}>{t('Add')}</button>

                      <button className="flex justify-center items-center bg-[#FF6B6B] text-white px-4 py-2 ml-[10px] rounded hover:bg-red-600" onClick={() => { setShowPopupAddnew(false); setExaminelist_name('') }}>{t('Cancel')}</button>
                    </div>

                  </div>
                </div>
              )}

              {showEditPopup.isOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center ">
                  <div className="bg-white p-4 text-center  rounded-lg border-black shadow-lg ">
                    <h2 className={` text-[18px] md:text-[20px] text-[#5A985E] mt-[10px] `}>{t("Do you want to delete")} <span style={{ color: '#FF6B6B' }} className='mr-2'>{showEditPopup.todo.name}</span>{t("?")}</h2>

                    {message && (
                      <p className='mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                        {message}
                      </p>
                    )}

                    <div className={`text-[16px] flex justify-center mt-[10px]  md:mt-[30px]`}>
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
} export default CompExamineList;



