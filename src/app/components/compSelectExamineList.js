'use client'
import React, { useState ,useEffect , useContext } from 'react';
import axios from 'axios';
import '../globals.css'
// import '@fontsource/ntr';
import { BsPlusCircleFill } from 'react-icons/bs';
import {PiPencilSimpleFill} from 'react-icons/pi'
import {RxCross2} from 'react-icons/rx'
import {BsCheckCircle} from 'react-icons/bs'
import {BsFillExclamationTriangleFill} from 'react-icons/bs'
import { useRouter } from 'next/navigation';
import '@fontsource/mitr';
import CompNavbar from './compNavbar/role_1';
import { CompLanguageProvider, useLanguage } from './compLanguageProvider_role_1';
import { useTranslation } from 'react-i18next';
import {BsCalendar2Minus} from 'react-icons/bs';
import {i18n } from '../i18n'; // import i18n instance
import { initReactI18next } from 'react-i18next';
import { TiWarning } from "react-icons/ti";
import io from 'socket.io-client';


function CompSelectExamineList({ onSubmit }) {
  const [message, setMessage] = useState('');

  const handleSubmit = async (checkedItems) => {
    try {
      if (typeof onSubmit === 'function') {
        const isSuccess = await onSubmit(checkedItems);
        if (isSuccess) {
          setMessage('');
        } else {
          setMessage('An error occurred while submitting the data.');
        }
      } else {
        setMessage('onSubmit is not a function.');
      }
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  return (
    <CompLanguageProvider>
      <App onSubmit={handleSubmit} />
    </CompLanguageProvider>
  );
}


function App({ onSubmit }) {
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
  const [useEmployee, setUseEmployee] = useState(false);
  const [User_id, setUser_id] = useState('');
  const [id, setId] = useState('');
  const currentDate = new Date().toLocaleDateString();
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [notification, setNotification] = useState('');

  const router = useRouter();
  

  
  useEffect(() => {
    const storedUser_id = localStorage.getItem('id');

    const fetchData = async () => {
      try {

        const AddData = { storedUser_id, fetch: true};
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
  
  const [examinelist_name, setExaminelist_name] = useState("");
  const [todoList, setTodoList] = useState([]);


  const addTodo = async () => {
    if (examinelist_name.trim() === "") {
      setMessage("Please fill in  fields");
      return;
    }
    
    try {



      const AddData = { examinelist_name , id , add: true};
      const data = JSON.stringify(AddData);

      const response = await axios.post('/api/examinelist', data, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      const resdata = response.data;
  
      if (response.status === 200) {
        if (resdata.success === true) {

          const updatedTodoList = [...todoList, resdata.dbexaminelist_name];
          setTodoList(resdata.dbexaminelist_name);
          
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
    closePopup();
  }

  const handleEditClick = () => {
    setIsEditing(true);
  };


  const handleCheckboxEmployee = () => {
    setUseEmployee(true); 
  }

  const deleteTodo = async (index, todo) => {
    try {
      const storedUser_id = localStorage.getItem('id');

      const editedData = { todo ,storedUser_id, editselect: true };
      const data = JSON.stringify(editedData)

      const response = await axios.post('/api/examinelist', data,  {
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
      const AddData = { id,checkedItems, selected: true};
      const fetchdata = JSON.stringify(AddData);

      const response = await axios.post('/api/examinelist', fetchdata, {
        headers: { 'Content-Type': 'application/json' },
      });   

       const resdata = response.data;
  
      if (response.status === 200) {
        if (resdata.success === true) {

        } else {
          setMessage(resdata.error);
        }
      } else {
        setMessage(resdata.error);
      }
      const isSuccess = await onSubmit(checkedItems);
      if (isSuccess) {
        setMessage('');
      } else {
        setMessage('An error occurred while submitting the data.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while submitting the data.');
    }
  };
  
  const handleCheckboxChange = (index, todoId) => {
  
    if (checkedItems.includes(todoId)) {
      setCheckedItems(checkedItems.filter((item) => item !== todoId).sort((a, b) => a - b));
    } else {
      setCheckedItems([...checkedItems, todoId].sort((a, b) => a - b));
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
      <div className='mx-auto border w-[300px] md:w-[700px] lg:w-[950px] py-[20px] md:h-[600px] h-[550px] text-black flex flex-col   md:rounded-[30px] rounded-[30px] mt-[106px]  bg-[#fff]'>
                
        <h1 className={` ml-[30px] text-[20px] mt-[3px] mb-[5px] md:text-[30px] md:ml-[50px] `}>

          {t("Select checklist")}
        </h1>
        {!isEditing && (
        <PiPencilSimpleFill onClick={handleEditClick} className='absolute text-black md:text-[20px] text-[13px]  md:ml-[500px]  lg:ml-[890px] md:mt-[15px] ml-[270px]  mt-[12px] cursor-pointer ' />
        )}

        <div className="mt-[5px] border-t border-gray-300"></div>
       
        
        <div className='items-center mx-auto w-[250px] md:w-[650px] lg:w-[850px]   h-[400px] text-black bg-[#F5F5F5] text-center mt-[20px] rounded-[20px]'>
      <div className='mt-4 ml-4 flex items-center justify-between'>
        <div className='flex items-center text-center w-[110px] h-[24px] md:w-[140px] md:h-[30px] rounded-[5px] text-[#fff] border-[#000] bg-[#5A985E] md:ml-[5px]'>
          <div className='md:ml-[10px] ml-[10px]'><BsCalendar2Minus /></div>
          <p className="mt-[2px] ml-[8px] md:text-[17px] text-[12px] md:ml-[8px] ">{currentDate}</p>
        </div>
        <p className='text-[14px] mr-4 md:mr-7'>
          {checkedItems.length} {t('Selected')}
        </p>
      </div>

      <div className='items-center  text-[14px]  mx-auto border w-[220px] md:w-[600px] lg:w-[800px]  h-[100px] text-black bg-[#fff] text-center mt-[10px] rounded-[10px] overflow-y-auto'>
  {checkedItems.length > 0 && (
    <div className='p-2 flex flex-col'>
      {checkedItems.map((todoId) => (
        <div key={todoId} className="flex items-center mb-1">
          <div className='border rounded-[10px] p-1 px-4 bg-[#BEE3BA] whitespace-nowrap '>
            {todoList.find((todo) => todo.id === todoId)?.name}
          </div>
        </div>
      ))}
    </div>
  )}
</div>

<div className='items-center mx-auto border w-[220px] md:w-[600px] lg:w-[800px] h-[210px] text-black bg-[#fff] text-center mt-[10px] rounded-[10px] overflow-auto'>

{ todoList.length === 0 && (
    <div className='  mx-auto justify-center text-center mt-5 text-black'>
    <div className='p-2 px-6'>
    <TiWarning className='text-[30px] mx-auto text-[#5A985E]' />

    <h2 className=' py-1  text-[11px] md:text-[15px]'>{t("No information")}</h2>
  </div>
  </div> 
  )}
  
{todoList.map((todo, index) => (
  isEditing ? (
    <div
      key={index}
      className={`
        cursor-pointer 
        pl-2 pt-1
        text-left
        text-black 
        flex 
        items-center
       
      `}
      >
      <div className="flex items-center">
        <p className='text-[#000] flex items-center bg-[#BEE3BA] rounded-[10px] border-[#F5F5F5] py-1 px-2 pl-2 text-[14px] md:text-[18px]  break-words whitespace-pre-wrap'>
          {todo.name} 
          <RxCross2
          onClick={(e) => {
            e.stopPropagation();
            openEditPopup(index, todo);
          }}
          className="text-[#5A985E]  ml-[8px] md:ml-[10px] text-[14px] hover:-translate-y-0.5 duration-200"
        />
        </p>
        
      </div>

      
    </div>
  ) : (
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
        ${checkedItems.includes(todo.id) ? 'checked' : ''}
      `}
      onClick={() => handleCheckboxChange(index, todo.id)}
    >
      <input
        type='checkbox'
        className='mr-2'
        checked={checkedItems.includes(todo.id)}
        onChange={() => handleCheckboxChange(index, todo.id)}
      />
      <p className='text-[#000] bg-[#BEE3BA] rounded-[10px]  border-[#F5F5F5]  py-1 px-4  text-[14px] md:text-[18px]  break-words whitespace-pre-wrap'>
        {todo.name}
      </p>
    </div>
  )
))}



     

              {showDeleteSuccessPopup && (
                <div className="bg-white w-[250px] text-[#5A985E] p-8 text-center rounded-lg border-black shadow-lg  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <BsCheckCircle className=' text-[50px] mx-auto mb-[10px]'/>
                {deletemessage}
                </div>
              )}

              {showAddSuccessPopup && (
                <div className="bg-white text-center text-[#5A985E] p-8  rounded-lg border-black shadow-lg  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <BsCheckCircle className=' text-[50px] mx-auto mb-[10px]'/>
                {addmessage}
                </div>
              )}
            
          </div>
        </div>

        <div className={` text-[15px] md:text-[17px] flex justify-end w-[250px] md:mt-[15px] mx-auto md:w-[700px] lg:w-[940px]  md:px-10 `}>
        {isEditing ? (
          <button  onClick={() => setIsEditing(false)}  className={`mx-auto flex  mt-[20px]   md:mt-[20px] border-[#64CE3F] bg-[#64CE3F] px-10 py-1  rounded-[20px]    text-[#fff] hover:-translate-y-0.5 duration-200 `}>{t('confirm')}</button>
         ) : (
          <button type='submit' onClick={handleSubmit}  className={`flex  mt-[20px]   md:mt-[20px] border-[#64CE3F] bg-[#64CE3F] px-10 py-1  rounded-[20px]    text-[#fff] hover:-translate-y-0.5 duration-200 `}>{t('confirm')}</button>
        )} 
          <div>
           {!isEditing && (
          <div className="flex items-center  ">
              <button
                onClick={openPopup}
                className="item-center text-[#5A985E] ml-[10px] text-4xl mt-[20px] hover:-translate-y-0.5 duration-200"
              >
                <BsPlusCircleFill />
              </button>
            </div>
           )}
            <div className="flex items-center  ">
           
            </div>
           
            {showPopup && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center ">
                <div className="bg-white  p-4 rounded-lg border-black shadow-lg md:w-[300px] ">
                  <h2 className={`text-[18px] text-[#5A985E]  `}>{t("Add list examine")}</h2>
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
                    <button className="flex justify-center items-center bg-[#93DD79] text-white px-4 py-2 ml-[5px] rounded hover:bg-green-600" onClick={addTodo}>{t('Add')}</button>

                    <button className="flex justify-center items-center bg-[#FF6B6B] text-white px-4 py-2 ml-[10px] rounded hover:bg-red-600" onClick={() => closePopup(false)}>{t('Cancel')}</button>
                  </div>

                </div>
              </div>
            )}

            {showEditPopup.isOpen && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center ">
                <div className="bg-white p-4 text-center  rounded-lg border-black shadow-lg ">
                  <h2 className= {` text-[18px] md:text-[20px] text-[#5A985E] mt-[10px] `}>{t("Do you want to delete")} <span style={{ color: '#FF6B6B' }} className='mr-2'>{showEditPopup.todo.name}</span>{t("?")}</h2>
                  
                  {message && (
                    <p className='mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                      {message}
                    </p>
                  )}
                  
                  <div className=   {`text-[16px] flex justify-center mt-[10px]  md:mt-[30px]`}>
                    <button className="flex justify-center items-center bg-[#93DD79] text-white px-4 py-2 ml-[5px] rounded hover:bg-green-600" onClick={() => deleteTodo(showEditPopup.index, showEditPopup.todo)}>{t('Yes')}</button>

                    <button className="flex justify-center items-center bg-[#FF6B6B] text-white px-4 py-2 ml-[10px] rounded hover:bg-red-600" onClick={() => closeEditPopup(false)}>{t('Cancel')}</button>
                  </div>

                </div>
              </div>
            )}

                
                
              
          </div>
        </div>
      </div>
    </div>
  </div>
    )
}  
export default CompSelectExamineList;

