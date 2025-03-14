'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import '../globals.css'
// import '@fontsource/ntr'
import '@fontsource/mitr';
import { BsPlusCircleFill } from 'react-icons/bs';
import CompNavbar from './compNavbar/role_1';
import { BsCalendar2Minus } from 'react-icons/bs';
import { BsTrash } from 'react-icons/bs'; // Add this import for the trash can icon
import { BsPencilSquare } from 'react-icons/bs'; // Add this import for the edit button
import { PiPencilSimpleFill } from 'react-icons/pi';
import { BsCheckCircle } from 'react-icons/bs';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { RxCross2 } from 'react-icons/rx'
import { BsFillCheckCircleFill } from 'react-icons/bs'
import { CompLanguageProvider, useLanguage } from './compLanguageProvider_role_1';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { initReactI18next } from 'react-i18next';


function CompChecklistExamine() {
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


  const [id, setId] = useState('');
  const [message, setMessage] = useState('');
  const currentDate = new Date().toLocaleDateString();
  const [showPopup, setShowPopup] = useState(false); // if using React state
  const [isEditing, setIsEditing] = useState(false);
  const [ShowPopupDelete, setShowPopupDelete] = useState(false);
  const [checklistname, setChecklistname] = useState(''); // เพิ่ม state สำหรับ todo
  const [index, setIndex] = useState(''); // เพิ่ม state สำหรับ index
  const [input, setInput] = useState("");
  const [details, setDetails] = useState("");
  const [lastname, setlastname] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [reloadData, setReloadData] = useState(false); // เพิ่ม state นี้
  const [deletemessage, setdeleteMessage] = useState(false);
  const [addmessage, setaddMessage] = useState(false);
  const [showAddSuccessPopup, setShowAddSuccessPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false); // เพิ่ม state เพื่อควบคุมการแสดง/ซ่อน popup
  const [showDeleteSuccessPopup, setShowDeleteSuccessPopup] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [useEmployee, setUseEmployee] = useState(false);
  const [selectedOption, setSelectedOption] = useState('User'); // สร้าง state เพื่อเก็บค่าที่เลือก
  const [employee, setEmployee] = useState(''); // สร้าง state เพื่อเก็บค่าที่เลือก
  const [checked, setchecked] = useState(false);
  const [idemployee, setidEmployee] = useState(''); // สร้าง state เพื่อเก็บค่าที่เลือก
  const [dbidemployee, setdbidEmployee] = useState(''); // สร้าง state เพื่อเก็บค่าที่เลือก
  const [examinelist_Id, setexaminelist_Id] = useState('');
  const [examine_Id, setexamine_Id] = useState('');
  const [todoStatus, setTodoStatus] = useState({});
  const [examinelist_name, setexaminelist_name] = useState('');
  const [isLoading, setIsLoading] = useState(false);



  useEffect(() => {
    const storedId = localStorage.getItem('id');
    if (storedId) {
      setId(storedId);
    }
  }, []);

  useEffect(() => {


    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const checklistnameValue = searchParams.get('checklistname'); // กำหนดค่าเริ่มต้นว่างไว้ถ้าไม่มีค่า
      const indexValue = searchParams.get('index'); // กำหนดค่าเริ่มต้นว่างไว้ถ้าไม่มีค่า
      const checkedValue = searchParams.get('Checked'); // กำหนดค่าเริ่มต้นว่างไว้ถ้าไม่มีค่า
      const idemployeeValue = searchParams.get('idemployee'); // กำหนดค่าเริ่มต้นว่างไว้ถ้าไม่มีค่า
      const examinelist_IdValue = searchParams.get('examinelistId'); // กำหนดค่าเริ่มต้นว่างไว้ถ้าไม่มีค่า
      const examine_IdValue = searchParams.get('examineId'); // กำหนดค่าเริ่มต้นว่างไว้ถ้าไม่มีค่า
      const examinelist_nameValue = searchParams.get('examinelist_name'); // กำหนดค่าเริ่มต้นว่างไว้ถ้าไม่มีค่า


      const fetchData = async () => {
        try {


          fetchEmployeeData();


          if (useEmployee === false) {
            const AddData = { examine_IdValue };
            const datacheck = JSON.stringify(AddData);

            const response = await axios.post('/api/checklistexamine', datacheck, {


              headers: { 'Content-Type': 'application/json' },
            });

            const data = response.data;

            if (response.status === 200) {
              if (data.success === true) {

                setTodoList(data.dbchecklist);
              } else {
                setMessage(data.error);
              }
            } else {
              setMessage(data.error);
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setMessage('');
        }

      };
      setexamine_Id(examine_IdValue)
      setexaminelist_Id(examinelist_IdValue);
      setChecklistname(checklistnameValue);
      const checkedValueBool = JSON.parse(checkedValue);
      setchecked(checkedValueBool);
      setexaminelist_name(examinelist_nameValue)


      const fetchEmployeeData = async () => {
        try {
          const AddData = { checklistnameValue, check: true };
          const datacheck = JSON.stringify(AddData);

          const checkUseEmployee = await axios.post('/api/checklistexamine', datacheck, {
            headers: { 'Content-Type': 'application/json' },
          });

          const data = checkUseEmployee.data;

          if (checkUseEmployee.status === 200) {
            if (data.success === true) {

              setUseEmployee(data.ResultUseEmployee[0].useEmployee);


              if (data.ResultUseEmployee[0].useEmployee === "true") {


                if (selectedOption === "User") {

                  try {

                    const AddData = { examinelist_Id, User: true };
                    const datacheck = JSON.stringify(AddData);

                    const response = await axios.post('/api/checklistexamine', datacheck, {
                      headers: { 'Content-Type': 'application/json' },
                    });

                    const data = response.data;

                    if (response.status === 200) {
                      if (data.success === true) {
                        let employeesToAdd = [];
                        let employeeToSend = [];
                        let idemployeeToSend = [];



                        const dbEmployees = data.dbemployee_name || [];
                        dbEmployees.forEach((employeeData) => {
                          const combinedData = `${employeeData.employee} ${employeeData.name} ${employeeData.lastname}`;
                          employeesToAdd.push(combinedData);
                          const Employeetest = (`${employeeData.employee}`);
                          employeeToSend.push(Employeetest);
                          const idEmployeetest = (`${employeeData.id}`);
                          idemployeeToSend.push(idEmployeetest);



                        });

                        fetchidEmployeeData();

                        setchecked(true);
                        setTodoList(employeesToAdd);
                        setEmployee(employeeToSend);
                        setidEmployee(idemployeeToSend);

                      } else {
                        setMessage(data.error);
                      }
                    } else {
                      setMessage(data.error);
                    }
                  } catch (error) {
                    console.error('Error fetching employee data:', error);
                    setMessage('');
                  }

                } else if (selectedOption === "Checklist") {

                  try {

                    const editedData = { checklistnameValue, examine_Id, selectchecklist: true };
                    const dataAdd = JSON.stringify(editedData)

                    const response = await axios.post('/api/checklistexamine', dataAdd, {
                      headers: { 'Content-Type': 'application/json' },
                    });

                    const data = response.data;

                    if (response.status === 200) {
                      if (data.success === true) {

                        setTodoList(data.dbchecklist);
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
                }
              } else {
              }
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
      }

      fetchData();
    }
    const fetchidEmployeeData = async () => {
      try {
        const Checkid = { checklistname, checkid: true };
        const datacheckid = JSON.stringify(Checkid);

        const response = await axios.post('/api/checklistexamine', datacheckid, {
          headers: { 'Content-Type': 'application/json' },
        });

        const data = response.data;

        if (response.status === 200) {
          if (data.success === true) {
            const resultString = data.ResultidEmployee.toString();

            setdbidEmployee(resultString);

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
    }
  }, [reloadData, checklistname, examine_Id, examinelist_Id, selectedOption, useEmployee]);





  const handleEditClick = () => {
    setIsEditing(true);
  };

  const openPopup = () => {
    setShowPopup(true);
    setMessage('')
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleCheckboxChange = (todo, passChecked, failChecked, details) => {
    const updatedTodoStatus = { ...todoStatus };

    if (passChecked) {
      updatedTodoStatus[todo] = { name: todo, pass: true, status: "pass", details: details || "-" };
    } else if (failChecked) {
      updatedTodoStatus[todo] = { name: todo, fail: true, status: "fail", details: details || "-" };
    } else {
      updatedTodoStatus[todo] = {}; // ล้างสถานะถ้าไม่เลือกใดๆ และตั้ง details เป็น ' ' หรือค่าที่ถูกส่งมา
    }

    setTodoStatus(updatedTodoStatus);
  };


  const addTodo = async () => {
    if (input.trim() === "") {
      setMessage("Please fill in the checklist field");
      return;
    }

    try {
      const AddData = { input, checklistname, examinelist_Id, add: true };
      const data = JSON.stringify(AddData);

      const response = await axios.post('/api/checklistexamine', data, {
        headers: { 'Content-Type': 'application/json' },
      });

      const resdata = response.data;

      if (response.status === 200) {
        if (resdata.success === true) {
          setMessage('');
          setTodoList((prevTodoList) => [...prevTodoList, resdata.dbchecklist]);

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

    setInput("");
    closePopup();
  };


  const openEditPopup = async (todo, checklistname) => {
    setMessage('');
    setShowEditPopup({ isOpen: true, todo, checklistname }); // ส่งค่า isOpen, index, และ todo ไปยัง setShowEditPopup
  };

  const closeEditPopup = () => {
    setShowEditPopup(false);
  };


  const deleteChecklist = async (todo, checklistname) => {
    try {
      const editedData = { todo, checklistname, examine_Id, id, edit_role_1: true };
      const data = JSON.stringify(editedData)

      const response = await axios.post('/api/checklistexamine', data, {
        headers: { 'Content-Type': 'application/json' },
      });

      closeEditPopup();

      const resdata = response.data;

      if (response.status === 200) {
        if (resdata.success === true) {
          setTodoList(resdata.dbchecklist);


          setShowDeleteSuccessPopup(true);
          setdeleteMessage(resdata.message);


          setTimeout(() => {
            setShowDeleteSuccessPopup(false);
          }, 1000); // 1000 มิลลิวินาที = 1 วินาที
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

      setIsLoading(true);
      if (useEmployee === "false") {
        console.log("SSS: ",todoStatus.legth)
        const editedData = { todoStatus, examine_Id, examinelist_Id, id, checkbox: true };

        const response = await axios.post('/api/checklistexamine', editedData, {
          headers: { 'Content-Type': 'application/json' },
        });

        const resdata = response.data;

        if (response.status === 200) {
          if (resdata.success === true) {

            setShowDeleteSuccessPopup(true);
            setdeleteMessage(resdata.message);

            setTimeout(() => {
              setIsLoading(true);
              router.push(resdata.redirect);
            }, 1000);
          } else {
            setMessage(resdata.error);
          }
        } else {
          setMessage(resdata.error);
        }
        setSelectedItems({});


      } else {
        router.push(`/examine?examinelist_name=${examinelist_name}&id=${examinelist_Id}`)
      }


    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
  };




  return (
    <div>

      <CompNavbar />

      <div className=' bg-[url("/bg1.png")] overflow-auto bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center   '>
        <div className='md:w-[800px] lg:w-[1000px] mx-auto '>
          <div className=' w-[280px] mx-auto md:w-[963px]  '>
            <div className={` text-[21px] md:text-[35px]   md:w-[700px] lg:w-[800px] w-[300px] left-0 md:ml-[70px] lg:ml-[90px]  flex items-center md:mt-[100px] mt-[90px] `}>
              <h1 className=' text-[#5A985E]    mr-[10px] '>{t('Examine')}</h1>
              <p className='text-black  w-[170px] md:w-[400px] text-sm md:text-[20px]  text-ellipsis whitespace-nowrap overflow-hidden'>({checklistname})</p>
            </div>
            <div className='flex items-center text-center  w-[110px] h-[24px] md:w-[140px] md:h-[30px] rounded-[5px] text-[#fff] border-[#000] bg-[#000] md:ml-[70px] lg:ml-[90px] '>
              <div className=' md:ml-[10px] ml-[10px] '><BsCalendar2Minus /></div>
              <p className="  mt-[2px] ml-[8px]  md:text-[17px] text-[12px] md:ml-[8px] ">{currentDate}</p>
            </div>
            {useEmployee === "false" && !isEditing && (
              <PiPencilSimpleFill onClick={handleEditClick} className='absolute text-black md:text-[18px] text-[13px] md:ml-[700px] lg:ml-[840px] md:mt-[28px] ml-[265px] mt-[25px] cursor-pointer ' />
            )}
            {selectedOption === 'Checklist' && !isEditing && (
              <PiPencilSimpleFill onClick={handleEditClick} className='absolute text-black md:text-[20px] text-[13px] md:ml-[700px] lg:ml-[840px] md:mt-[95px] ml-[265px] mt-[90px] cursor-pointer ' />
            )}
            {useEmployee === "true" && (
              <div className='md:ml-[70px] lg:ml-[90px]'>
                <label className="block mt-[10px] text-gray-700 text-[15px] font-bold mb-2">{t("Select an option")}:</label>
                <select
                  className="w-[120px] text-[13px] text-black border rounded-md px-4 py-1 outline-none"
                  value={selectedOption}
                  onChange={handleDropdownChange}
                >
                  <option value="User">{t('User')}</option>
                  <option value="Checklist">{t('Checklist')}</option>
                </select>
              </div>
            )}
          </div>

          <div className={`mx-auto w-[300px]   font-blod md:w-[700px] lg:w-[800px] h-[480px] mb-[50px] text-black flex flex-col md:rounded-[50px] bg-[#FFF] ${isEditing ? 'rounded-[30px]' : 'rounded-[30px] md:rounded-[50px]'} mt-[10px]`}>
            <div className='mx-auto md:w-[650px]  lg:w-[750px] w-[250px] h-[900px] text-black flex flex-col bg-[#FFF]  rounded-[30px] md:rounded-[50px] mt-[30px] overflow-auto'>

              {todoList.map((todo, index) => (
                <div key={index}>
                  {useEmployee === "false" ? (
                    <div className='  text-sm  md:text-[18px] mt-[10px] w-[250px] rounded-[10px] md:w-[340px] py-2 md:py-4 border bg-[#F5F5F5] mx-auto'>
                      <div className='flex px-3'>
                        <div >
                          <p className='text-[#000] md:ml-[10px] md:w-[280px] w-[220px]  break-words whitespace-pre-wrap'>{todo}</p>
                          <div className="mt-[8px] md:w-[310px]  border-t border-gray-300"></div>
                          <div className='flex items-center mt-[8px] '>
                            <div className={` flex items-center `}>
                              <input
                                type="checkbox"
                                className='mr-[8px] md:ml-[15px] items-center'
                                checked={todoStatus[todo]?.pass || false}
                                onChange={(e) => handleCheckboxChange(todo, e.target.checked, !e.target.checked ? todoStatus[todo]?.fail : false)}
                              /><span className='text-[13px] md:text-[15px] '>{t('pass')}</span>
                            </div>
                            <div className='flex items-center'>
                              <input
                                type="checkbox"
                                className='mr-[8px] ml-[10px] md:ml-[20px] items-center'
                                checked={todoStatus[todo]?.fail || false}
                                onChange={(e) => handleCheckboxChange(todo, !e.target.checked ? todoStatus[todo]?.pass : false, e.target.checked)}
                              /><span className='text-[13px] md:text-[15px] '>{t('fail')}</span>
                            </div>
                          </div>
                          <input
                            type='text'
                            className='md:ml-[13px] rounded-md mt-[8px] p-2 border text-[13px] w-[225px] md:w-[285px] h-[30px]'
                            placeholder={t('details')}
                            onChange={(e) => {
                              handleCheckboxChange(todo, todoStatus[todo]?.pass, todoStatus[todo]?.fail, e.target.value);
                            }}
                          />
                        </div>


                        {isEditing && (
                          <div className='flex   items-center text-[13px] md:text-[18px] justify-end space-x-2 w-[50px] md:w-[50px] ml-[-15px]  md:ml-[-20px] h-[15px]  '>
                            <RxCross2
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditPopup(todo, checklistname);
                              }}
                              className='text-[#5A985E] hover:text-[#64CE3F]'
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    selectedOption === 'Checklist' ? (
                      <div className=' justify-center mx-auto items-center   flex'>
                        <div className=' text-sm md:text-[20px] mt-[10px] w-[250px] rounded-[10px] md:w-[340px] py-2 md:py-4 bg-[#F5F5F5] mx-auto'>
                          <div className='flex items-center px-3 '>


                            <p className=' text-[#000] ml-[10px] text-[14px] w-[200px]  whitespace-nowrap overflow-hidden overflow-ellipsis'>{todo} </p>
                          </div>
                        </div>

                        {isEditing && (
                          <div className='flex absolute items-center text-[13px] md:text-[18px] justify-end  space-x-2 w-[20px] md:w-[50px]  ml-[215px] mt-[8px]  md:ml-[270px] h-[15px]  '>
                            <RxCross2
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditPopup(todo, checklistname);
                              }}
                              className='text-[#5A985E] hover:text-[#64CE3F]'
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className=' justify-center items-center   flex'>
                        <Link href={`/checklistEmployee?checklistname=${todo}&examine_Id=${examine_Id}&examinelist_Id=${examinelist_Id}&examinelist_name=${examinelist_name}&examinename=${checklistname}&employee_Id=${employee[index]}&idemployee=${idemployee[index]}`} key={idemployee[index]}>
                          <div className=' text-sm md:text-[20px] mt-[10px] w-[250px] rounded-[10px] md:w-[340px] py-2 md:py-4 bg-[#F5F5F5] mx-auto'>
                            <div className='flex items-center px-3'>
                              {checked && (
                                <>

                                  {dbidemployee.includes(idemployee[index]) && (
                                    <>
                                      <BsFillCheckCircleFill className='text-[#5A985E] w-[13px]  ' />
                                    </>
                                  )}
                                </>
                              )}

                              <p className={`text-[#000] ${dbidemployee.includes(idemployee[index]) ? 'ml-[13px]' : 'ml-[26px]'} text-[14px] w-[200px]  whitespace-nowrap overflow-hidden overflow-ellipsis`}>{todo}</p>
                            </div>
                          </div>
                        </Link>

                        {isEditing && (
                          <div className='flex  items-center text-[13px] md:text-[18px] justify-end space-x-2 w-[50px] md:w-[50px] ml-[-60px]  md:ml-[-85px] mt-[10px] '>
                            <RxCross2
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditPopup(todo, checklistname);
                              }}
                              className='text-[#5A985E] hover:text-[#64CE3F]'
                            />
                          </div>
                        )}
                      </div>
                    )
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

              {showEditPopup.isOpen && (
                <div className="text-center fixed top-0 left-0 w-full h-full flex items-center justify-center ">
                  <div className="bg-white p-4 rounded-lg border-black shadow-lg md:w-[380px] md:h-[150px]  ">
                    <div className='md:text-[30px]  text-[22px] flex justify-center items-center'>
                      <h2 className={`font-mitr  text-[18px] md:text-[20px] text-[#5A985E] mt-[10px] `}>{t("Do you want to delete")} <span style={{ color: '#FF6B6B' }} className='mr-2'>{showEditPopup.todo}</span> {t("?")}</h2>
                    </div>
                    <div className="flex justify-center mt-[10px] md:mt-[30px]">
                      <button className="flex justify-center items-center bg-[#93DD79] text-white px-4 py-2 ml-[5px] rounded hover:bg-green-600" onClick={() => deleteChecklist(showEditPopup.todo, showEditPopup.checklistname)} >{t('Yes')}</button>
                      <button className="flex justify-center items-center bg-[#FF6B6B] text-white px-4 py-2 ml-[10px] rounded hover:bg-red-600" onClick={() => closeEditPopup(false)}>{t('Cancel')}</button>
                    </div>
                  </div>
                </div>
              )}

            </div>


            {showPopup && (
              <div className="text-center fixed top-0 left-0 w-full h-full flex items-center justify-center ">
                <div className="bg-white p-4 rounded-lg py-[30px] shadow-lg border border-gray-200 md:w-[400px] ">
                  <h2 className='text-[25px] text-[#5A985E]  font-bold'>{t('Add checklist')}</h2>
                  <div className="mt-1">
                    <input className='mt-1 p-2 w-full border border-gray-300 rounded-md' value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("add checklist")} />
                  </div>

                  <div className="flex justify-center mt-[20px]">
                    <button className="flex justify-center items-center bg-[#93DD79] text-white px-4 py-2 ml-[5px] rounded hover:bg-green-600" onClick={addTodo}>{t('Add')}</button>
                    <button className="flex justify-center items-center bg-[#FF6B6B] text-white px-4 py-2 ml-[10px] rounded hover:bg-red-600" onClick={() => closePopup(false)}>{t('Cancel')}</button>
                  </div>
                  {message && (
                    <p className='mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                      {message}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className='h-[300px] '>

              <div className={` items-center text-[15px] md:text-[17px] flex ${!isEditing && 'justify-end'}  w-[250px] md:mt-[40px] mt-[60px]  mx-auto md:w-[700px] lg:w-[800px]  md:px-10 `} >
                {isEditing ? (
                  <button onClick={() => setIsEditing(false)} className={`flex mx-auto   border-[#64CE3F] bg-[#64CE3F] px-10 py-1  rounded-[20px]   text-[#fff] hover:-translate-y-0.5 duration-200  `}>{t('confirm')}</button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className={`
                            ${useEmployee === "true" && selectedOption !== "User" ? 'ml-[-12px]' : ''}
                            ${useEmployee === "true" && selectedOption === "User" ? 'mx-auto' : ''}
                            border-[#64CE3F] bg-[#64CE3F] px-10 py-1 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200
                          `}
                  >
                    {t('submit')}
                  </button>
                )}
                <div>
                  <div className="flex items-center ml-[0px] ">
                    {useEmployee === "false" && isEditing === false && (
                      <button
                        onClick={openPopup}
                        className=" text-[#5A985E] ml-[10px] text-4xl  hover:-translate-y-0.5 duration-200"
                      >
                        <BsPlusCircleFill />
                      </button>
                    )}

                    {useEmployee === "true" && selectedOption === "Checklist" && isEditing === false && (
                      <button
                        onClick={openPopup}
                        className="item-center text-[#5A985E] md:mt-[-3px] ml-[10px] text-4xl hover:-translate-y-0.5 duration-200"
                      >
                        <BsPlusCircleFill />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                {isLoading && (
                  <div className='flex mx-auto items-center mb-2 mt-1' >
                    <div className="mx-auto   mr-[3px] inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                    </div>
                    <p className="mx-auto  ml-[3px] md:ml-[5px] text-[12px] md:text-[16px] ">{t('Loading')}...</p>
                  </div>
                 )} 
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>


  )

}
export default CompChecklistExamine;
