'use client'
import React, { useState ,useEffect} from 'react';
import '../../globals.css'
import Link from 'next/link'
import '@fontsource/mitr';

import { BsPlusCircleFill } from 'react-icons/bs';
import CompNavbar from '../compNavbar/role_admin';
import {BsCalendar2Minus} from 'react-icons/bs';
import { BsTrash } from 'react-icons/bs'; // Add this import for the trash can icon
import { BsPencilSquare } from 'react-icons/bs'; // Add this import for the edit button
import { PiPencilSimpleFill } from 'react-icons/pi';
import {BsCheckCircle} from 'react-icons/bs';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { CompLanguageProvider, useLanguage } from '../compLanguageProvider_role_admin';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n'; 
import { initReactI18next } from 'react-i18next';
import bcrypt from 'bcryptjs'; 
import {RxCross2} from 'react-icons/rx'
import { TiWarning } from "react-icons/ti";



function Employee() {
  return (
    <CompLanguageProvider>
      <App />
    </CompLanguageProvider>
  );
}

function App() {
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

    const [showPopup, setShowPopup] = useState(false); // if using React state
    const [isEditing, setIsEditing] = useState(false);
    const [ShowPopupDelete, setShowPopupDelete] = useState(false);
    const [showAddSuccessPopup, setShowAddSuccessPopup] = useState(false);
    const [message, setMessage] = useState('');
    const [addmessage, setaddMessage] = useState(false);
    const [reloadData, setReloadData] = useState(false); // เพิ่ม state นี้
    const [isPassSelected, setIsPassSelected] = useState(false);
    const [isOn, setIsOn] = useState(false);
    const [id, setId] = useState('');
    const [nameExamineList , setNameExamineList] = useState(''); // สร้าง state เพื่อเก็บค่าที่เลือก
    const [selectedOption, setSelectedOption] = useState('');
    const [formData, setFormData] = useState({
      employee: '',
      name: '',
      lastname: '',
      password: '',
    });
    const [todoList, setTodoList] = useState([]);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [deletemessage, setdeleteMessage] = useState(false);
    const [erraddmessage, setErraddMessage] = useState(false);
    const [errorAddMessage, setErrorAddMessage] = useState('');

    const myData = JSON.parse(localStorage.getItem('myData'));
    console.log("mee",myData.data.id);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const storedId = myData.data.id;
          if (storedId) {
            setId(storedId);
            // console.log('Stored: ', storedId);
          }
  
          const AddData = { storedId ,fetch_role_2: true};
          const data = JSON.stringify(AddData);
          // console.log('DD: ', data);
  
          const response = await axios.post('/api/employee', data, {
            headers: { 'Content-Type': 'application/json' },
          });
  
          const resdata = response.data;
          // console.log('DATA: ', resdata);
  
          if (response.status === 200) {
            if (resdata.success === true) {
              // console.log("55555555555555",resdata.dbemployee_name              );

              // setSelectedOption(resdata.dbnameExamineList[0]);
              setTodoList(resdata.dbemployee_name);
            } else {
              setMessage(resdata.error);
            }
          } else {
            setMessage(resdata.error);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setMessage('');
        }
      };
  
      fetchData();
    }, [reloadData]);
  
    // const fetchDataForSelectedOption = async () => {
    //   try {
    //     console.log('Selected Option: ', selectedOption);
  
    //     const AddData = { selectedOption, fetch: true };
    //     const data = JSON.stringify(AddData);
    //     console.log('BB: ', data);
  
    //     const response = await axios.post('/api/employee', data, {
    //       headers: { 'Content-Type': 'application/json' },
    //     });
  
    //     const resdata = response.data;
    //     console.log('DATA111: ', resdata);
  
    //     if (response.status === 200) {
    //       if (resdata.success === true) {
    //         console.log('employeeDB: ', resdata.dbemployee_name.employee);
    //         const dbEmployees = resdata.dbemployee_name || [];
  
    //         const employeesToAdd = dbEmployees.map((employeeData) => ({
    //           employee: employeeData.employee,
    //           name: employeeData.name,
    //           lastname: employeeData.lastname,
    //           password: employeeData.password
    //         }));
  
    //         const newTodoList = [...employeesToAdd];
    //         setTodoList(newTodoList);
    //       } else {
    //         setMessage(resdata.error);
    //       }
    //     } else {
    //       setMessage(resdata.error);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching data:', error);
    //     setMessage('');
    //   }
    // };
  
    // Call the second useEffect function when the selected option changes
    useEffect(() => {
      if (selectedOption) {
        fetchDataForSelectedOption();
      }
    }, [selectedOption]);


  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setErraddMessage(false);
    setErrorAddMessage('');
    setShowPopup(false);
    setFormData({
      employee: '',
      name: '',
      lastname: '',
      password: '',
    });
    setMessage('')
  
  // Additional logic for closing the popup
};
  // const [input, setInput] = useState("");
  const [lastname, setlastname] = useState("");
  const [employee, setEmployee] = useState(""); 
  const [name, setName] = useState(""); 
  const [file, setFile] = useState(false);

  const hashPassword = async (password) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  };

  const addTodo = async () => {
    // console.log("employee: ",employee)  
    // console.log("name: ",name )  
    // console.log("lastname: ",lastname)

    try {
      if (!formData.employee || !formData.name || !formData.lastname) {
        setErrorAddMessage('Please fill in all fields');
        setErraddMessage(true);

        return;
      }

      if (!formData.password || formData.password.length < 6) {
        // Handle the case where the password is too short
            console.error("Password must be at least 6 characters long");
            setErrorAddMessage("Password must be at least 6 characters long")
            setErraddMessage(true);

            return;
        }
        const hashedPassword = await hashPassword(formData.password);
        const requestData = {
          ...formData,
          password: hashedPassword,
          id: id,
          add_role_2: true
        };
    
        // console.log('Submitted Data:', requestData);
        
        const data = JSON.stringify(requestData);
        
        // console.log('Submitted1111:', data);

        const response = await axios.post('/api/employee', {
          ...requestData
        }, {
          headers: { 'Content-Type': 'application/json' }
        });
        
        const resdata = response.data; 
  
        // console.log("RESDATA: ",resdata)
        // console.log("response.status: ",response.status);
        // console.log("response.error: ",resdata.error);
  
      if (response.status === 200) {
        if (resdata.success === true) {
          // console.log("Message: ", resdata);

   
          // Add the new item to the todoList
          setTodoList(resdata.dbemployee);  
          closePopup()

          setShowAddSuccessPopup(true);
          setaddMessage(resdata.message);
  
          setTimeout(() => {
            setShowAddSuccessPopup(false);
          }, 1000); // 1000 milliseconds = 1 second
        } else {
          setFormData({
            employee: '',
            name: '',
            lastname: '',
            password: '',
          });
          // console.log("Messageresdata.error: ", resdata.error);

          setErraddMessage(true);
          setErrorAddMessage(resdata.error);

        }
      } else {
        setMessage(resdata.error);
      }
    
    } catch (error) {
      console.error('Error Examine:', error);
      setMessage('');
    }
    setMessage('');
    setEmployee("");
    setName("");
    setlastname("");
  
  };


    

  const openPopupDelete = () => {
    setShowPopupDelete(true);
  };
  const closePopupDelete = () => {
    setShowPopupDelete(false);
  };

  function handleDeleteClick(id) {
    
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]; // ดึงไฟล์ที่เลือกมา
  
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleFileUpload = async (file) => {
    
    if (!file) {
      return;
    }
  
    const reader = new FileReader();
  
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0]; // เลือกชีทแรกในไฟล์ Excel
  
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
  
        // ลูปผ่านข้อมูลที่ได้จาก Excel และส่งไปยัง API
        for (const item of jsonData) {
          const { employee, name, lastname } = item; // ประมวลผลข้อมูลจากแต่ละแถวของ Excel
          const AddData = { employee, name, lastname,selectedOption ,id,add: true };
          // console.log("Excel: ",AddData)

          const response = await axios.post('/api/employee', AddData, {
            headers: { 'Content-Type': 'application/json' },
          });
  
          const resdata = response.data;
  
          if (response.status === 200 && resdata.success === true) {
            setTodoList((prevTodoList) => [
              ...prevTodoList,
              {
                employee: resdata.dbemployee.employee,
                name: resdata.dbemployee.name,
                lastname: resdata.dbemployee.lastname,
              },
            ]);  
            setShowAddSuccessPopup(true);
            setaddMessage(resdata.message);
    
            setTimeout(() => {
              setShowAddSuccessPopup(false);
            }, 1000); // 1000 milliseconds = 1 second
          }
        }
      } catch (error) {
        console.error('Error reading Excel file:', error);
      }
      setMessage('');
      setEmployee("");
      setName("");
      setlastname("");
      setFile(false);
      closePopup();
    };
  
    reader.readAsArrayBuffer(file);
  };

  const handleOnClick = () => {
    setIsOn(true);
  };
  
  const handleOffClick = () => {
    setIsOn(false);
  };

  const handleDropdownChange = (event) => {
    // console.log("event.target.value: ",event.target.value)
    setSelectedOption(event.target.value); // เมื่อเลือกตัวเลือกใน Dropdown ให้อัปเดต state
  };

  const buttonWidth = '60px'; // Set a common width for both buttons

  

  const buttonStyle = {
    width: buttonWidth,
    transition: 'width 0.3s ease',
  };

  const updateFormData = (fieldName, value) => {
    setErraddMessage(false);
    setErrorAddMessage('');
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const openEditPopup = async (index, todo ) => {
    // console.log("TODOO: ",todo)
    setMessage('');
    setShowEditPopup({ isOpen: true, index, todo  }); 
  };

  const deleteTodo = async (index, todo) => {
    try {
      // ตรงนี้คุณใช้ตัวแปร id ที่ไม่ได้ถูกกำหนดค่า
      const editedData = { ...todo, id,  edit_role_2: true };
      const data = JSON.stringify(editedData)
      // console.log("datadelete: ",data)

      const response = await axios.post('/api/employee', data,  {
        headers: { 'Content-Type': 'application/json' },
      });

      setShowEditPopup(false)

      const resdata = response.data;
  
      if (response.status === 200) {
        if (resdata.success === true) {
          setTodoList(resdata.dbemployee_name);  

          // setReloadData(prev => !prev);

          // console.log("Message: ", resdata.dbemployee_name);
          setdeleteMessage(resdata.message);

          setTimeout(() => {
            setdeleteMessage(false);
          }, 1000); 
          // console.log("UPDATE: ",todoList)

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

  return (
    <div>
      
      <CompNavbar/>

        <div className=' bg-[url("/bg1.png")]  bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center overflow-auto  '>
          <div className='md:w-[700px] lg:w-[1000px] mx-auto  '>
            <div className='flex  w-[330px] mx-auto  md:w-[800px]'>
            <div className='mx-auto flex justify-between w-[330px] md:w-[800px]  text-black  md:mt-[106px] mt-[80px]  '>
                  <h1 className={`text-[25px] text-black md:text-[30px]  md:w-[400px] w-[200px]  text-ellipsis whitespace-nowrap overflow-hidden  `}>{t("Employee List")}</h1>
                  <button
                  onClick={openPopup} 
                  className="  text-[#5A985E] md:absolute  md:ml-[650px] lg:ml-[750px] text-4xl ml-[100px] md:text-5xl  hover:-translate-y-0.5 duration-200 ">
                  <BsPlusCircleFill/>
                </button>
              </div>
                <div className='flex md:mt-[50px]   md:ml-[430px] '>
                   
                    
                   
                {showPopup && (
                      <div className="text-center absolute z-10 top-0 left-0 w-full h-full flex items-center justify-center">
                        <div className="bg-white md:w-[400px] w-[350px] p-4 py-[20px] rounded-lg border border-grey shadow-lg">
                          <div className="">
                            <h2 className={`text-[25px] text-[#5A985E] `}>{t("Add employee list")}</h2>
                              <div className='mt-[20px]'>
                              <label htmlFor="name" className="md:text-[14px] block text-sm font-medium text-gray-700">
                              {t("fill in information")}
                              </label>
                                <div className="flex mt-1">
                                  <input
                                    className="mt-1 p-2 w-full text-black border border-gray-300 rounded-md"
                                    value={formData.employee}
                                    onChange={(e) => updateFormData('employee', e.target.value)}
                                    placeholder={t('Employee')}
                                  />
                                  <input
                                    className="mt-1 p-2 w-full text-black ml-[10px] border border-gray-300 rounded-md"
                                    value={formData.name}
                                    onChange={(e) => updateFormData('name', e.target.value)}
                                    placeholder={t('Name')}
                                  />
                                  <input
                                    className="mt-1 p-2 ml-[10px] text-black w-full border border-gray-300 rounded-md"
                                    value={formData.lastname}
                                    onChange={(e) => updateFormData('lastname', e.target.value)}
                                    placeholder={t('Lastname')}
                                  />
                                </div>
                                <input
                                  className="mt-3 p-2 text-black w-full border border-gray-300 rounded-md"
                                  type="password"
                                  value={formData.password}
                                  onChange={(e) => updateFormData('password', e.target.value)}
                                  placeholder={t('Password')}
                                />
                                {erraddmessage && (
                                  <p className='mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                                    {errorAddMessage}
                                  </p>
                                )} 

                                <div className="flex justify-center mt-[20px] ">
                                  <button className="bg-[#93DD79] text-white px-4 py-2 ml-[5px] rounded hover:bg-green-600" onClick={addTodo}>
                                    {t('Add')}
                                  </button>
                                  <button className="bg-[#FF6B6B] text-white px-4 py-2 ml-[10px] rounded hover:bg-red-600" onClick={() => closePopup()}>
                                    {t('Cancel')}
                                  </button>
                                </div>
                              </div>
                            </div>
                            </div>

                          </div>
                    )}
              
                  </div>
            </div>
           
            <div className='mt-[15px]  '>
            <div className=  {` font-small text-[14px] md:text-[20px] flex mx-auto items-center  bg-[#5A985E] w-[330px] md:w-[700px] lg:w-[800px] md:mt-[-px] rounded-t-[20px] md:rounded-t-[20px] py-2`}>
              <p className='text-center text-white   md:w-[180px] w-[30px]  md:ml-[43px] ml-[32px]  '>{t('No')}. </p>
              <p className='text-center text-white   md:w-[200px] w-[80px] md:ml-[-68px] ml-[15px] '>{t('Employee')}</p>
              <p className='text-center text-white   md:w-[180px] w-[70px] md:ml-[20px] ml-[35px]  '>{t('Name')}</p>
              {!isEditing && (
              <PiPencilSimpleFill onClick={handleEditClick} className='absolute text-[#FFF] md:text-[20px] text-[13px]  md:ml-[660px] lg:ml-[750px] md:mt-[7px] ml-[300px]  mt-[3px] cursor-pointer ' />
              )}
            </div>

            <div className='mx-auto w-[330px] md:w-[700px] lg:w-[800px] h-[400px]  text-black flex flex-col  bg-[#FFF] mb-[50px] rounded-b-[20px] md:rounded-b-[20px]   overflow-auto'>
              <div className='mx-auto w-[330px] md:w-[700px] lg:w-[800px] h-[380px]  text-black flex flex-col bg-[#FFF] mb-[20px] rounded-b-[20px] md:rounded-b-[20px]   overflow-auto'>

                    {/* {console.log("todo: ",todoList)} */}
                    { todoList.length === 0 && (
                      <div className='  mx-auto justify-center text-center mt-5 text-black'>
                      <div className='p-2 px-6'>
                      <TiWarning className='text-[30px] mx-auto text-[#5A985E]' />

                      <h2 className=' py-1  text-[11px] md:text-[15px]'>{t("No information")}</h2>
                    </div>
                    </div> 
                    )}
                    {todoList.map((todo, index) => (
                  <div key={index} className={`text-sm md:text-[20px] w-[290px] rounded-[10px] md:w-[640px] lg:w-[740px] py-2 md:py-4 bg-[#F5F5F5] mx-auto ${index === 0 ? 'mt-[10px]' : 'mt-[8px]'}`}>
                  <div className='flex '>
                    <div className='flex flex-col w-full   '>
                      <div className=' flex text-[#000] '>
                      {isEditing ? (
                      <div>
                       
                        <div className='flex'>
                      <div className='md:w-[100px] w-[50px] md:ml-[38px]'>
                        <div style={{ flex: 1, textAlign: 'center' }}>{index + 1}</div>
                      </div> 
                      <div className='md:w-[180px] w-[80px]  ml-[15px] md:ml-[40px]'>
                        <div style={{ flex: 1 }}>{todo.employee}</div>
                      </div>
                      <div className='md:w-[300px] w-[120px]  text-ellipsis whitespace-nowrap overflow-hidden'>
                        <div style={{ flex: 1 }}>{todo.name} {todo.lastname}</div>
                      </div>
                      <RxCross2
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditPopup(index,todo, todo.id ,todo.employee);
                          }}
                          className="text-[#5A985E] inline-block ml-[5px] md:ml-[50px] mt-[4px] md:mt-[1px] text-[12px] md:text-[16px] hover:-translate-y-0.5 duration-200"
                        />
                      </div>
                      </div>
                    ) : (
                      <div className='flex'>
                      <div className='md:w-[100px] w-[50px] md:ml-[38px]'>
                        <div style={{ flex: 1, textAlign: 'center' }}>{index + 1}</div>
                      </div> 
                      <div className='md:w-[180px] w-[80px]  ml-[15px] md:ml-[40px]'>
                        <div style={{ flex: 1 }}>{todo.employee}</div>
                      </div>
                      <div className='md:w-[300px] w-[120px] text-ellipsis whitespace-nowrap overflow-hidden'>
                        <div style={{ flex: 1 }}>{todo.name} {todo.lastname}</div>
                      </div>
                      </div>
                    )}


                      </div>
                    </div>
                    {/* <div className='flex items-center justify-end space-x-2 w-[50px] md:w-[50px] ml-[1px] md:ml-[60px] mt-20px'>
                      
                    </div> */}
                  </div>
                </div>
              ))}
              </div>

              {isEditing && (
                <div className='items-center mb-[20px]' >
                  <button onClick={() => setIsEditing(false)}  className={`flex mx-auto  border-[#64CE3F] bg-[#64CE3F] px-10 py-1  rounded-[20px]    text-[#fff] hover:-translate-y-0.5 duration-200 `}>{t('confirm')}</button>
                </div>
                )}
              {deletemessage && (
                <div className="bg-white text-[#5A985E] p-8  rounded-lg border shadow-lg md:w-[400px] w-[250px] text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <BsCheckCircle className=' text-[50px] mx-auto mb-[10px]'/>
                {deletemessage}
                </div>
              )}
              {showAddSuccessPopup && (
                <div className="text-center  bg-white text-[#5A985E] p-8  rounded-lg border shadow-lg md:w-[400px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <BsCheckCircle className=' text-[50px] mx-auto mb-[10px]'/>
                {addmessage}
                </div>
              )}

            {showEditPopup.isOpen && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center ">
                <div className="bg-white p-4 text-center rounded-lg border shadow-lg  ">
                  <h2 className= {` text-[18px] md:text-[20px] text-[#5A985E] mt-[10px] `}>{t("Do you want to delete")}<span style={{ color: '#FF6B6B' }}> {showEditPopup.todo.employee}</span> {t("?")}</h2>
                  
                  {message && (
                    <p className='mt-3 text-red-500 text-[12px] py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-[13px] md:mt-[30px]'>
                    {message}
                    </p>
                  )}
                  <div className=   {`text-[16px] flex justify-center mt-[10px]  md:mt-[30px]`}>
                    <button className="flex justify-center items-center bg-[#93DD79] text-white px-4 py-2 ml-[5px] rounded hover:bg-green-600" onClick={() => deleteTodo(showEditPopup.index, showEditPopup.todo)}>{t('Yes')}</button>

                    <button className="flex justify-center items-center bg-[#FF6B6B] text-white px-4 py-2 ml-[10px] rounded hover:bg-red-600" onClick={() => setShowEditPopup(false)}>{t('Cancel')}</button>
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
export default Employee;