'use client'
import React, { useState , useEffect} from 'react';
import axios from 'axios';
import '../../globals.css'
import '@fontsource/ntr';
import {MdEmail} from 'react-icons/md'
import {PiPencilSimpleFill} from 'react-icons/pi'
import {BsFillPersonFill} from 'react-icons/bs'
import {BsCheckCircle} from 'react-icons/bs'
import '@fontsource/mitr';
import CompNavbar from '../compNavbar/role_1';
import { CompLanguageProvider, useLanguage } from '../compLanguageProvider_role_1';
import { useTranslation } from 'react-i18next';
import { FaPhoneVolume } from "react-icons/fa6";
import { FaLine } from "react-icons/fa";
import Image from 'next/image';

function CompProfile1()  {
  return (
    <CompLanguageProvider>
      <App />
    </CompLanguageProvider>
  );
}

function App() {
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [id, setId] = useState('');
  const [employee, setEmployee] = useState('');
  const [reloadData, setReloadData] = useState(false); // เพิ่ม state นี้

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [profileData, setProfileData] = useState({
    id: '',
    employee: '',
    name: '',
    lastname: '',
    position: '',
    phone: '',
    line: '',
    email: ''
    });
  const [editedProfileData, setEditedProfileData] = useState({ ...profileData });
  const [selectedImage, setSelectedImage] = useState(null);
  const [fileData, setFileData] = useState();
  const [imagedata, setImagedata] = useState();

  useEffect(() => {
    const storedId = localStorage.getItem('id');
    if (storedId) {
      setId(storedId);
    }
    
    const fetchData = async () => {
      try {
        const requestData = {
          storedId,
          profile_role_1 : true
        };

        const response = await axios.post('/api/profile', requestData, {
          headers: { 'Content-Type': 'application/json' },
        });

        const resdata = response.data;

        if (response.status === 200) {
          if (resdata.success === true) {
            setEmployee(resdata.profile[0].employee);
            let newProfile = {
              ...resdata.profile[0]
            }
            if (resdata.profile[0].email === null) {
              newProfile.email = '';
            } if (resdata.profile[0].line === null) {
              newProfile.line = '';
            } if (resdata.profile[0].phone === null) {
              newProfile.phone = '';
            } if (resdata.profile[0].picture === null) {
              newProfile.picture = '';
            }
            setEditedProfileData(newProfile);
            setProfileData(newProfile);
            if (resdata.profile[0].picture.data.length > 0) {
              const byteArray = resdata.profile[0].picture.data; // Replace ... with the full array
              const uint8Array = new Uint8Array(byteArray);
              const blob = new Blob([uint8Array], { type: 'image/jpeg' }); // Change 'image/jpeg' to the appropriate image type
              const url = URL.createObjectURL(blob);
              setFileData(url);
            }
        

            setMessage('');
          } else {
            setMessage(resdata.error);
          }
        } else {
          setMessage(resdata.error);
        }
      } catch (error) {
        console.error('Error Profile2:', error);
        setMessage('');
      }
    };

    fetchData(id);
  }, [id]);

  const handleEditClick = () => {
    setIsEditing(true);
    // คัดลอกข้อมูล profileData เพื่อแก้ไข
    // console.log("editedProfileData: ",editedProfileData)
    setEditedProfileData({ ...editedProfileData });
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    // คัดลอกข้อมูล profileData เพื่อแก้ไข
    // console.log("editedProfileData: ",editedProfileData)
    setEditedProfileData({ ...profileData });
  };
  
  const handleSaveClick = async () => {
    try {
      
      if (selectedImage) {
        // อัปเดตรูปภาพในตัวแปร editedProfileData และ profileData
        editedProfileData.img = selectedImage;
        setProfileData({ ...editedProfileData });
      } else {
        setProfileData({ ...editedProfileData });
      }

      // ทำการบันทึกข้อมูลที่ผู้ใช้แก้ไขลงในฐานข้อมูลหรือระบบของคุณ
      // ตัวอย่างเช่น ส่งข้อมูลไปยังเซิร์ฟเวอร์
      
      // ส่งข้อมูลที่แก้ไขไปยัง API

      console.log("Editprofile: ", editedProfileData)
      const editedData = { ...editedProfileData , edit_role_1: true };
      // formData.append('data', JSON.stringify(editedData));
      // const data = formData.get('data');
      console.log("FormDATA: ", editedData);
      const data = JSON.stringify(editedData)
      console.log("EditDATA: ", data)

      // ส่งข้อมูลไปยัง API
      const response = await axios.post('/api/profile', data, {
        headers: {
          'Content-Type': 'application/json', // ใช้ headers แบบถูกต้อง
        },
      });

      const resdata = response.data;
      console.log("resdata:", resdata);

      if (response.status === 200) {

        if (resdata.success === true) {
          // การบันทึกสำเร็จ ปิดโหมดแก้ไข
          setIsEditing(false);
          setShowSuccessPopup(true);
          setPopupMessage('Update successful');
          setEditedProfileData(resdata.profile)
          // console.log("aaaaa: ",resdata.profile)


          setTimeout(() => {
            setShowSuccessPopup(false);
          }, 1000); // 1000 มิลลิวินาที = 1 วินาที
        } else {
          setMessage(resdata.error);
        }
      } else {
        setMessage(resdata.error);
      }
      setIsEditing(false); // ปิดโหมดแก้ไขเมื่อคลิกที่ปุ่มบันทึก
    } catch (error) {
      console.error('Error Profile1:', error);
      setMessage(error.message || 'An error occurred');
    }
  };


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // console.log("FILE: ",file)
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        setSelectedImage(imageUrl); 

        setEditedProfileData((prevData) => ({
          ...prevData,
          img: file,
        }));

        setImagedata(file)
      };
      reader.readAsDataURL(file);
    }
  };
    
  return (
    <div>
      
      <CompNavbar/>

      <div className=' bg-[url("/bg1.png")]  overflow-auto bg-cover bg-no-repe z-[-1] top-0 left-0 w-full h-full bg-center fixed  '>
        <div>
          <div className='  mx-auto  w-[360px] py-[160px] md:w-[600px]  md:py-[220px] text-black flex flex-col  bg-[#5A985E]/25 text-center rounded-[50px] mt-[180px] '></div>
         
          <div className='absolute inset-[0]'>
            <div>
              <div className='  mx-auto  w-[330px] py-[200px] md:w-[500px]  md:py-[243px] md:mt-[160px]  text-black flex flex-col  bg-[#5A985E]/50 text-center rounded-[50px] mt-[140px] '>
              </div>
            <div>
              <div className='absolute inset-[0] container mx-auto px-4 z-10 items-center   '>
                <div className=' mx-auto md:mt-[200px]  md:w-[700px] md:h-[400px] py-[30px] text-black flex flex-col  bg-[#5A985E] text-center rounded-[50px] mt-[106px]  h-[460px] w-[300px]'>
                <form onSubmit={handleSaveClick} >
                
                <div className=''>
                {!isEditing && (
                 <PiPencilSimpleFill onClick={handleEditClick} className = 'absolute text-[#fff] md:text-[20px] md:ml-[640px]  mt-[-10px] ml-[260px] cursor-pointer'/>
                )}
                  <div className='md:flex  mt-[-20px] md:mt-[0px] ml-[23px] w-[250px]  ' > 
                  <div className={` md:flex md:absolute mx-auto  ${isEditing ? 'mt-[0px] ' : 'mt-[30px] ' } md:w-[200px] md:h-[150px] `}>
                    {/* <div className=' mx-auto md:ml-[50px] w-32 h-32 bg-white rounded-full flex items-center justify-center relative'>  opacity-0  */}
                    {isEditing ? (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute md:ml-[25px] ml-[-65px] ring-2 ring-white ring-offset-2 md:mt-[30px]  ring-offset-[#5A985E] w-32 h-32 mx-auto md:w-[150px] md:h-[150px] rounded-full  opacity-0  object-cover cursor-pointer"
                        onChange={handleImageUpload}
                      />
                      {/* {console.log("IMG: ",selectedImage)} */}
                       <Image
                              src={selectedImage || fileData || "/img/profile.jpg"}
                              alt="Profile Image"
                              width={500}
                              height={500}
                              className="ring-2 ring-white ring-offset-2 md:mt-[30px] mt-[30px] ring-offset-[#5A985E] w-32 h-32 mx-auto md:w-[150px] md:h-[150px] rounded-full object-cover"
                            />
                          </>
                        ) : (
                          <Image
                          src={selectedImage || fileData || "/img/profile.jpg"}
                          alt="Profile Image"
                            width={500}
                            height={500}
                            className="ring-2 ring-white ring-offset-2 ring-offset-[#5A985E] w-32 h-32 mx-auto md:w-[150px] md:h-[150px] rounded-full object-cover"
                          />
                    )}
                  </div>

                  <div className='  md:absolute mx-auto  md:h-[100px] mt-5 md:mt-0 md:ml-[250px] md:w-[300px] md:text-left  '>
                  <div className='flex flex-col  '>
                  {isEditing ? (
                    <div className=' flex mx-auto ml-[15px] md:ml-[0] mt-[6px]'>
                      {/* {console.log("EDITdata: ",editedProfileData)} */}
                      <input
                        type="text"
                        placeholder={editedProfileData.name}
                        onChange={(e) =>
                          setEditedProfileData({ ...editedProfileData, name: e.target.value })
                        }
                        className='  pl-2 w-[103px] text-black mr-2 md:w-[161px] md:text-[24px] md:mt-[10px] mt-[8px] md:ml-[0px] ml-[5px] '
                      />  

                      <input
                        type="text"
                        placeholder={editedProfileData.lastname}
                        onChange={(e) =>
                          setEditedProfileData({ ...editedProfileData, lastname: e.target.value })
                        }
                        className='  pl-2 w-[103px] text-black mr-2 md:w-[161px] md:text-[24px] md:mt-[10px] mt-[8px] md:ml-[0px]'
                      />  
                    </div>
                   
                    
                  ) : (
                    <p className='md:mt-[10px] mt-[8px] text-[#fff] md:text-[24px] md:w-[350px] text-[16px] font-bold overflow-ellipsis' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {editedProfileData.name} {editedProfileData.lastname}
                    </p>
                  )}
                  </div>

                  {/* {isEditing ? (
                    <select 
                      id="dropdown" 
                      placeholder={editedProfileData.position}
                      onChange={(e) =>
                        setEditedProfileData({ ...editedProfileData, position: e.target.value })
                      }
                      className="mx-auto mt-[8px] pl-[5px] items-center w-[208px] h-[25px] text-[14px]  md:text-[17px] md:w-[309px] md:h-[41px]">
                      <option value="Safety Officer Professional level">Professional level</option>
                      <option value="Safety Officer Technical level">Technical level</option>
                      <option value="Safety Officer Supervisory level">Supervisory level</option>
                    </select>
              
                  ) : ( */}
                    <p className="md:mt-[5px] mt-[2px] text-[14px] text-[#fff] md:text-[17px] ">
                      {editedProfileData.position || "-"}
                    </p>
                  {/* )} */}
                  </div>
                  </div>

                  <div className='  text-[14px]  w-[280px] md:w-[520px] md:mt-[110px] md:ml-[150px] mx-auto mt-5'>
                    <div className='flex  text-[#fff] md:text-[20px] md:ml-[100px]'>
                        <BsFillPersonFill className='md:mr-[10px] mr-[5px] mt-[3px]'/> <span className=' text-left w-[80px] md:w-[120px]  '>{t('Employee')}</span>:
                        {/* <div className='md:ml-[20px] ml-[20px]  font-bold '>
                          {editedProfileData.employee || "-"}                        
                        </div>  */}
                        {isEditing ? (
                            <input
                              type="text"
                              placeholder={editedProfileData.employee}
                              onChange={(e) => setEditedProfileData({ ...editedProfileData, employee: e.target.value })}
                              className='pl-2 ml-[19px] w-[130px] md:w-[181px] text-black'
                            />

                          ) : (
                            <div className='md:ml-[20px] ml-[15px]   '>
                              {editedProfileData.employee || "-"}                        
                            </div>                        
                          )}

                    </div>
                    <div className='flex  text-[#fff] md:text-[20px] md:ml-[100px] md:mt-[10px] mt-[5px]'>
                        <FaPhoneVolume className='md:mr-[14px] mr-[5px] mt-[4px] text-[15px]'/><span className=' w-[80px] md:w-[120px]   text-left'>{t('Phone')}</span>:
                        {isEditing ? (
                            <input
                              type="text"
                              placeholder={editedProfileData.phone}
                              onChange={(e) => setEditedProfileData({ ...editedProfileData, phone: e.target.value })}
                              className='pl-2 ml-[19px] w-[130px] md:w-[181px] text-black'
                            />
                          ) : (
                            <div className='md:ml-[20px] ml-[15px]    '>
                                {editedProfileData.phone || "-"}
                            </div>                       
                          )}
                        
                    </div>
                    <div className='flex  text-[#fff] md:text-[20px] md:ml-[100px] md:mt-[10px] mt-[5px]'>
                        <FaLine className='md:mr-[10px] mr-[5px] mt-[3px]'/> <span className=' text-left w-[80px] md:w-[120px]  '>{t('Line')}</span>:
                        {isEditing ? (
                            <input
                              type="text"
                              placeholder={editedProfileData.line}
                              onChange={(e) => setEditedProfileData({ ...editedProfileData, line: e.target.value })}
                              className='pl-2 ml-[19px] w-[130px] md:w-[181px] text-black'
                            />
                          ) : (
                            <div className='md:ml-[20px] ml-[15px]    '>
                              {editedProfileData.line || "-"}
                            </div>                       
                          )}
                        
                    </div>
                    <div className='flex  text-[#fff] md:text-[20px] md:ml-[100px] md:mt-[10px] mt-[5px]'>
                        <MdEmail className='md:mr-[10px] mr-[5px] mt-[2px]'/> <span className=' text-left w-[80px] md:w-[120px]  '>{t('Email')}</span>:
                        {isEditing ? (
                            <input
                              type="email"
                              placeholder={editedProfileData.email}
                              onChange={(e) => setEditedProfileData({ ...editedProfileData, email: e.target.value })}
                              className='pl-2 ml-[19px] w-[130px] md:w-[181px] text-black'
                            />
                          ) : (
                            <div className='md:ml-[20px] ml-[15px]    '>
                              {editedProfileData.email || "-"}
                            </div>                     
                          )}
                        
                    </div>
                    
                  </div>
                  <div className='mx-auto'>
                  {isEditing && (
                    <div className='mt-[10px]'>
                     
                      <button
                        type="button"
                        onClick={handleCancelClick} // Pass a function reference
                        className=" mt-5 w-[100px] text-sm md:text-lg border-[#5A985E] bg-[#fff] px-4 py-1 md:py-2 rounded-[20px] text-[#5A985E] hover:-translate-y-0.5 duration-200"
                      >
                        {t('Cancel')}
                      </button>
                      <button
                        type="submit"
                        onSubmit={handleSaveClick}
                        className="ml-3 mt-5 w-[100px] text-sm md:text-lg border-[#5A985E] bg-[#fff] px-4 py-1 md:py-2 rounded-[20px] text-[#5A985E] hover:-translate-y-0.5 duration-200"
                      >
                        {t('Confirm')}
                      </button>
                    </div>
                  )}


                    </div>
                    {showSuccessPopup && (
                      <div className="bg-white text-[#5A985E] p-8  w-[250px] rounded-lg border-black shadow-lg md:w-[400px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <BsCheckCircle className=' text-[50px] mx-auto mb-[10px]'/>
                        {popupMessage}
                      </div>
                    )}
                    
                  </div>
                  </form>


                </div>
                
              </div>
            
            </div>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  
    )
}
export default  CompProfile1;

