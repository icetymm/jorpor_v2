'use client'
import React, { useState ,useEffect, useCallback , useRef } from 'react';
import '../../globals.css'
import Link from 'next/link'
// import '@fontsource/ntr'
// import '@fontsource/mitr';
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
    const [nameExamineList , setNameExamineList] = useState([]); // สร้าง state เพื่อเก็บค่าที่เลือก
    const [selectedOption, setSelectedOption] = useState('');
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [deletemessage, setdeleteMessage] = useState(false);
    const [lastname, setlastname] = useState("");
    const [todoList, setTodoList] = useState([]);
    const [employee, setEmployee] = useState(""); 
    const [name, setName] = useState(""); 
    const [file, setFile] = useState(false);
    const [messageAdd, setMessageAdd] = useState('');
    const [erraddmessage, setErraddMessage] = useState(false);
    const [errorAddMessage, setErrorAddMessage] = useState('');
    const [uploadFile, setUploadFile] = useState(false);


    // useEffect(() => {
    //   // ทำให้ selectedOptionRef.current อัปเดตเมื่อ selectedOption เปลี่ยน
    //   selectedOptionRef.current = selectedOption;
    // }, [selectedOption]);

    const myData = JSON.parse(localStorage.getItem('myData'));
    console.log("mee",myData.data.id);
    
    const fetchDataForSelectedOption = useCallback(async () => {
      try {
         console.log('Selected Option88: ', localStorage);
        const storedId = myData.data.id;

        const AddData = { selectedOption,storedId, fetch: true };
        const data = JSON.stringify(AddData);
         console.log('BBkk: ', data);
    
        const response = await axios.post('/api/employee', data, {
          headers: { 'Content-Type': 'application/json' },
        });
    
        const resdata = response.data;
        // console.log('DATA111: ', resdata);
    
        if (response.status === 200) {
          if (resdata.success === true) {
            // console.log('employeeDB: ', resdata.dbemployee_name.employee);
            const dbEmployees = resdata.dbemployee_name || [];
    
            const employeesToAdd = dbEmployees.map((employeeData) => ({
              id: employeeData.id,
              employee: employeeData.employee,
              name: employeeData.name,
              lastname: employeeData.lastname,
            }));
    
            const newTodoList = [...employeesToAdd];
            setTodoList(newTodoList);
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
    }, [selectedOption, setTodoList, setMessage]);
    
    
    useEffect(() => {
      
      const fetchData = async () => {
        try {
          console.log('Storedmmmmm: ');
          const storedId = myData.data.id;
          if (storedId) {
            setId(storedId);
            
          }
    
          const AddData = { storedId , zone: true };
          const data = JSON.stringify(AddData);
           console.log('DDff: ', data);
    
          const response = await axios.post('/api/employee', data, {
            headers: { 'Content-Type': 'application/json' },
          });
    
          const resdata = response.data;
          // console.log('DATAZONEEE: ', resdata,resdata.dbnameExamineList[0]);
    
          if (response.status === 200) {
            if (resdata.success === true) {
                setSelectedOption(resdata.dbnameExamineList[0].id);
                setNameExamineList(resdata.dbnameExamineList);
              
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
    }, [setSelectedOption, setNameExamineList, setMessage]);
    

    // Call the second useEffect function when the selected option changes
    useEffect(() => {
      
      fetchDataForSelectedOption();
    }, [fetchDataForSelectedOption, selectedOption]);
  


  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setErraddMessage(false);
    setShowPopup(false);
  };
  // const [input, setInput] = useState("");

  const clearFields = () => {
    setEmployee('');
    setName('');
    setlastname('');
    setMessageAdd('');
  };

  const addTodo = async () => {
    // console.log("employee: ",employee)  
    // console.log("name: ",name )  
    // console.log("lastname: ",lastname,selectedOption)
    const storedId = localStorage.getItem('id');

    try {
      
    
      if (file) {
       handleFileUpload(file);
       return;
    } else {

      if (!employee || !name || !lastname) {
        setErrorAddMessage('Please fill in all fields');
        setErraddMessage(true);

        return;
      }

    const AddData = { employee, name, lastname ,selectedOption ,id, add: true };
    const data = JSON.stringify(AddData);
    // console.log("777777777777: ",data)
  
    const response = await axios.post('/api/employee', data, {
      headers: { 'Content-Type': 'application/json' },
    });

    const resdata = response.data;
  
      if (response.status === 200) {
        if (resdata.success === true) {
          // console.log("Message: ", resdata);

   
          // Add the new item to the todoList
          setTodoList(resdata.dbemployee); 
          closePopup();
 
          setShowAddSuccessPopup(true);
          setaddMessage(resdata.message);
  
          setTimeout(() => {
            setShowAddSuccessPopup(false);
          }, 1000); // 1000 milliseconds = 1 second

        } else {
         
          // console.log("Messageresdata.error: ", resdata.error);
          setEmployee("");
          setName("");
          setlastname("");
          setErraddMessage(true);
          setErrorAddMessage(resdata.error);

        }
      } else {
        setMessageAdd(resdata.error);
      }
    }
    } catch (error) {
      console.error('Error Examine:', error);
      setMessage('');
    }
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
  
        for (const item of jsonData) {
          const { employee, name, lastname } = item; // ประมวลผลข้อมูลจากแต่ละแถวของ Excel
          const AddData = { employee, name, lastname,selectedOption ,id, add: true };

          const response = await axios.post('/api/employee', AddData, {
            headers: { 'Content-Type': 'application/json' },
          });
  
          const resdata = response.data;
          console.log("DATAAAAA: 11 : ",resdata)

          if (response.status === 200 && resdata.success === true) {
            setTodoList(() => [
              ...resdata.dbemployee.map((employeeData) => ({
                employee: employeeData.employee,
                name: employeeData.name,
                lastname: employeeData.lastname,
              })),
            ]);
            
            

            setUploadFile(true)
            setShowAddSuccessPopup(true);
            setaddMessage(resdata.message);
    
            setTimeout(() => {
              setShowAddSuccessPopup(false);
            }, 1000); 
          } else {
            
            setErraddMessage(true);
            setErrorAddMessage(resdata.error);
          
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
      const editedData = { ...todo, id, selectedOption , edit_role_1: true };
      const data = JSON.stringify(editedData)
      // console.log("datadelete: ",data)

      const response = await axios.post('/api/employee', data,  {
        headers: { 'Content-Type': 'application/json' },
      });

      setShowEditPopup(false)

      const resdata = response.data;
  
      if (response.status === 200) {
        if (resdata.success === true) {
          setReloadData(prev => !prev);

          // console.log("Message: ", resdata.dbemployee_name);
          setdeleteMessage(resdata.message);
          setTodoList(resdata.dbemployee_name);  

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
            <div className='mx-auto  w-[330px] md:w-[800px]  text-black   md:mt-[106px] mt-[80px]  '>
            <h1 className={`text-[25px] text-black md:text-[30px] md:w-[400px] w-[200px]  text-ellipsis whitespace-nowrap overflow-hidden  `}>{t("Employee List")}</h1>
              </div>
                <div className='flex md:mt-[50px]   md:ml-[430px]'>
                   
                    {showPopup && (
                  <div className="text-center absolute z-10 top-0 left-0 w-full h-full flex items-center justify-center">
                  <div className="bg-white md:w-[400px] w-[350px] p-4 py-[20px] rounded-lg border border-grey shadow-lg">
                    <div className="flex items-center">
                     <div className="bg-[#D9D9D9]  w-[90px] rounded-[25px]">
                        <div className="flex  py-1">
                        <button
                          style={{
                            borderRadius: '15px',
                            ...buttonStyle,
                            backgroundColor: isOn ? '#FF6B6B' : '#D9D9D9', // ปรับสีพื้นหลังตามสถานะ
                            width: 'auto', // ปรับให้ขนาดของปุ่มขยายตามขนาดของเนื้อหา
                          }}
                          className={`text-white font-bold ml-[5px] px-[8px] rounded transform  ${
                            !isOn ? 'bg-red-600' : 'bg-gray-300 hover:bg-red-500'
                          }`}
                          onClick={handleOffClick}
                        >
                          <span className={` text-[13px] `}>{t('off')}</span>
                        </button>
                        <button
                          style={{
                            borderRadius: '15px',
                            ...buttonStyle,
                            backgroundColor: !isOn ? '#93DD79' : '#D9D9D9', // ปรับสีพื้นหลังตามสถานะ
                            width: 'auto', // ปรับให้ขนาดของปุ่มขยายตามขนาดของเนื้อหา
                          }}
                          className={`text-white ml-[5px] items-center font-bold px-[10px] rounded transform  ${
                            isOn ? 'bg-green-600' : 'bg-gray-300 hover:bg-green-500'
                          }`}
                          onClick={handleOnClick}
                        >
                          <span className=  {`  text-[13px]`}>{t('on')}</span>
                        </button>
                        

                        </div>
                      </div>


                        <div>
                          <p className="text-[13px] text-[#5A985E] ml-[10px] ">{t("add employee list from file")}</p>
                        </div>
                      </div>
                       <h2 className={`text-[25px] text-[#5A985E] mt-[15px] `}>{t("Add employee list")}</h2>
                       {isOn && (  
                       <div className="mt-[20px]  mx-auto  w-[310px] ">
                         <label htmlFor="name" className="md:text-[14px] block text-[12px] font-medium text-gray-700">{t("fill in information")}</label>
                         <div className="flex">
                                
                         <input
                            className="mt-1 p-2 w-full text-black border border-gray-300 rounded-md"
                            value={employee}
                            onChange={(e) => {setEmployee(e.target.value); setErrorAddMessage(''); setErraddMessage(false);}}
                            placeholder={t('Employee')}
                            />

                           <input
                             className="mt-1 p-2 w-full text-black ml-[10px] border border-gray-300 rounded-md"
                             value={name}
                             onChange={(e) => {setName(e.target.value); setErrorAddMessage(''); setErraddMessage(false);}}
                             placeholder={t('Name')}
                           />
                           <input
                             className="mt-1 p-2 ml-[10px] text-black w-full border border-gray-300 rounded-md"
                             value={lastname}
                             onChange={(e) => {setlastname(e.target.value); setErrorAddMessage(''); setErraddMessage(false);}}
                             placeholder={t('Lastname')}
                           />
                         </div>
                         {erraddmessage && (
                        <p className='mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[300px] mx-auto md:text-[13px] md:mt-[30px]'>
                          {errorAddMessage}
                        </p>
                      )} 
                         <div className="flex  justify-center  mt-[20px]">
                            <button className=" bg-[#93DD79] text-white px-4 py-2 ml-[5px] rounded hover:bg-green-600" onClick={addTodo}>{t('Add')}</button>
                            <button className="  bg-[#FF6B6B] text-white px-4 py-2 ml-[10px] rounded hover:bg-red-600" onClick={() => closePopup()}>{t('Cancel')}</button>
                          </div>
                       </div>
                       
                       )}

                       {!isOn && (  
                        <div className="mt-1 mx-auto  ">
                          <div className="mt-4">
                            
                                <label htmlFor="file" className="md:text-[12px] block text-[11px] mt-2 font-medium text-gray-700 cursor-pointer"> {t("The excel file consists of the columns employee , name , and lastname.")}</label>
                                <input type="file"id="file" className="text-[#000] mt-1 p-2 w-full border border-gray-300 text-[12px] rounded-md" onChange={handleFileChange}/>
                            </div>
                            {erraddmessage && (
                            <p className='mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[300px] mx-auto md:text-[13px] md:mt-[30px]'>
                              {errorAddMessage}
                            </p>
                          )} 
                          <div className="flex justify-center mt-[20px]">
                            <button className="flex justify-center items-center bg-[#93DD79] text-white px-4 py-2 ml-[5px] rounded hover:bg-green-600" onClick={addTodo}>{t('Add')}</button>
                            <button className="flex justify-center items-center bg-[#FF6B6B] text-white px-4 py-2 ml-[10px] rounded hover:bg-red-600" onClick={() => closePopup()}>{t('Cancel')}</button>
                          </div>
                        </div>
                       )}

                     
                     </div>
                     
                   </div>
                  )}               
                  </div>
                  {/* <PiPencilSimpleFill onClick={handleEditClick} className='absolute text-black md:text-[20px] text-[13px] md:ml-[840px] md:mt-[170px] ml-[250px] mt-[10px] cursor-pointer ' /> */}
            </div>
            <div className='flex w-[330px] md:w-[700px] lg:w-[800px]  items-center mx-auto '>
            <div className='  items-center mx-auto w-[330px] md:w-[780px]  '>
              <label className="block  text-gray-700 text-[13px] font-bold mb-2"> {t("Select an option")}:</label>
              <select
                className="left-0 w-[150px] text-[13px] text-black border rounded-md px-4 py-1 outline-none overflow-hidden"
                value={selectedOption ? selectedOption.id : ""}
                onChange={handleDropdownChange}
              >
                {nameExamineList.length > 0 && nameExamineList.map((name, index) => (
                  <option key={index} value={name.id}>
                   {/* {console.log("selectedOption::::11 ",name)} */}

                    {name.name}
                  </option>
                ))}
              </select>
              </div>
              {/* {console.log("selectedOption:::: ",selectedOption ,selectedOption.name ,nameExamineList)} */}

              {selectedOption  && (
              <div className='mt-[20px]'>
                <button
                  onClick={openPopup} 
                  className=" text-[#5A985E]  ml-[-15px] text-4xl md:text-5xl  hover:-translate-y-0.5 duration-200 ">
                  <BsPlusCircleFill/>
                </button>
              </div>
              )}

            </div>
            <div className='mt-[25px] '>
            <div className=  {` font-small text-[14px] md:text-[20px] flex mx-auto items-center  bg-[#5A985E] w-[330px] md:w-[700px] lg:w-[800px] md:mt-[-px] rounded-t-[20px] md:rounded-t-[20px] py-2`}>
              <p className='text-center text-white   md:w-[180px] w-[30px]  md:ml-[43px] ml-[32px]  '>{t('No')}. </p>
              <p className='text-center text-white   md:w-[200px] w-[80px] md:ml-[-68px] ml-[15px] '>{t('Employee')}</p>
              <p className='text-center text-white   md:w-[180px] w-[70px] md:ml-[20px] ml-[35px]  '>{t('Name')}</p>
              {!isEditing && (
              <PiPencilSimpleFill onClick={handleEditClick} className='absolute text-[#FFF] md:text-[20px] text-[13px]  md:ml-[660px] lg:ml-[750px] md:mt-[7px] ml-[300px]  mt-[3px] cursor-pointer ' />
              )}
            </div>

            <div className='mx-auto w-[330px] md:w-[700px] lg:w-[800px] h-[400px]  text-black flex flex-col  bg-[#FFF]  mb-[50px]  rounded-b-[20px] md:rounded-b-[20px]   overflow-auto'>
              <div className='mx-auto w-[330px] md:w-[700px] lg:w-[800px] h-[380px]  text-black flex flex-col bg-[#FFF] mb-[20px]  rounded-b-[20px] md:rounded-b-[20px]   overflow-auto'>
              { todoList.length === 0 && (
                      <div className='  mx-auto justify-center text-center mt-5 text-black'>
                      <div className='p-2 px-6'>
                      <TiWarning className='text-[30px] mx-auto text-[#5A985E]' />

                      <h2 className=' py-1  text-[11px] md:text-[15px]'>{t("No information")}</h2>
                    </div>
                    </div> 
                    )}
                {todoList.map((todo, index) => (
                  <div key={index} className={`text-sm md:text-[20px] w-[290px] rounded-[10px] md:w-[640px] lg:w-[740px] py-2 md:py-4 bg-[#F5F5F5]  mx-auto ${index === 0 ? 'mt-[10px]' : 'mt-[8px]'}`}>
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

               {showEditPopup.isOpen && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center ">
                <div className="bg-white p-4 text-center rounded-lg border shadow-lg   ">
                  <h2 className= {` text-[18px] md:text-[20px] text-[#5A985E] mt-[10px] `}>{t("Do you want to delete")} <span style={{ color: '#FF6B6B' }}> {showEditPopup.todo.employee}</span> {t("?")}</h2>
                  
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

              {/* {ShowPopupDelete && (
              <div className="text-center fixed top-0 left-0 w-full h-full flex items-center justify-center ">
                  <div className="bg-white p-4 rounded-lg border-black shadow-lg md:w-[400px] ">
                  <div className='md:text-[30px] text-[22px] flex justify-center items-center'>
                      <h2 className='text-[#5A985E]  font-bold'>  {`${language === 'EN' ? 'Do you want to ' : 'คุณต้องการที่จะลบ'  }`}</h2>
                      <h2 className=' ml-[8px] text-red-700  font-bold'>  {`${language === 'EN' ? ' Delete ?' : 'ไหม ?'  }`}</h2>
                  </div>
                  <div className="flex justify-center mt-[10px]">
                      <button className="flex justify-center items-center bg-[#93DD79] text-white px-4 py-2 ml-[5px] rounded hover:bg-green-600" onClick={handleDeleteClick} >Yes</button>
                      <button className="flex justify-center items-center bg-[#FF6B6B] text-white px-4 py-2 ml-[10px] rounded hover:bg-red-600" onClick={() => closePopupDelete(false)}>Cancel</button>
                  </div>
                  </div>
              </div>
              )}   */}
              


              </div>
              </div>

            </div>
        </div>
      </div>
   
    
  )
  
}
export default Employee;