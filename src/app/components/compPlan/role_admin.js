'use client'
import React, { useState ,useEffect} from 'react';
import { registerLocale, setDefaultLocale } from "react-datepicker";
import DatePicker from 'react-datepicker';
import '@fontsource/mitr';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import CompNavbar from '../compNavbar/role_admin';
import { CompLanguageProvider, useLanguage } from '../compLanguageProvider_role_admin';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n'; // import i18n instance
import { initReactI18next } from 'react-i18next';
import axios from 'axios';
import {BsCheckCircle} from 'react-icons/bs'
import { BsTrash } from 'react-icons/bs'; // Add this import for the trash can icon
import { BiError } from "react-icons/bi";
import enGB from "date-fns/locale/en-GB";


function CompPlan() {
  return (
    <CompLanguageProvider>
      <App />
    </CompLanguageProvider>
  );
}

function App() {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const [selectedDate, setSelectedDate] = useState('');
  const [schedule, setSchedule] = useState([]);

  const [newDate, setNewDate] = useState('');
  const [newActivity, setNewActivity] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState('');
  const [showDeleteSuccessPopup, setShowDeleteSuccessPopup] = useState(false);
  const [showAddSuccessPopup, setShowAddSuccessPopup] = useState(false);
  const [deletemessage, setdeleteMessage] = useState(false);
  const [addmessage, setaddMessage] = useState(false);
  const [message, setMessage] = useState(false);
  const [selectedDateForHighlight, setSelectedDateForHighlight] = useState(null);
  const [NamePlanToAdd, setNamePlanToAdd] = useState({}); // Define NamePlanToAdd state
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [errmessage, seterrMessage] = useState(false);
  const [useMeeting, setUseMeeting] = useState(false);

  const fetchData = async () => {
    try {
      const storedId = localStorage.getItem('id');
      if (storedId) {
        setId(storedId);
        // console.log('Stored: ', storedId);
      }
  
      const AddData = { storedId ,data_role_admin:true};
      const data = JSON.stringify(AddData);
      // console.log('DD: ', data);
  
      const response = await axios.post('/api/plan', data, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      const resdata = response.data;
      // console.log('DATA: ', resdata);
  
      if (response.status === 200) {
        if (resdata.success === true) {
          let PlanToAdd = [];
          const currentDate = new Date();

          const day = currentDate.getDate().toString().padStart(2, '0');
          const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
          const year = currentDate.getFullYear();
          
          const formattedDate = `${day}/${month}/${year}`;
          const dbData = resdata.dbPlan || [];
  
          dbData.sort((a, b) => {
            const dateA = new Date(a.date.split('/').reverse().join('-') + ' ' + a.endTime);
            const dateB = new Date(b.date.split('/').reverse().join('-') + ' ' + b.endTime);
            return dateA - dateB;
          });
          
          dbData.forEach((item) => {
            let closestPlan = null;
  
            const Plan = {
              id: item.id,
              date: item.date,
              startTime: `${item.startTime.substring(0, 5).replace(':', '.')} น.`,
              endTime: `${item.endTime.substring(0, 5).replace(':', '.')} น.`,
              activity: item.activity,
            };
  

            const itemDate = new Date(item.date.split('/').reverse().join('-'));
  
            const isTomorrow =
              itemDate.getDate() === currentDate.getDate() + 1 &&
              itemDate.getMonth() === currentDate.getMonth() &&
              itemDate.getFullYear() === currentDate.getFullYear();
  
            const isCurrentDate =
              itemDate.getDate() === currentDate.getDate() &&
              itemDate.getMonth() === currentDate.getMonth() &&
              itemDate.getFullYear() === currentDate.getFullYear();
  
            const convertedDate1 = new Date(formattedDate.split('/').reverse().join('-'));
            const convertedDate2 = new Date(item.date.split('/').reverse().join('-'));

              if (isCurrentDate) {
                let isCurrentTime = `${new Date().getHours().toString().padStart(2, '0')}.${new Date().getMinutes().toString().padStart(2, '0')} `
                let isTime = `${item.endTime.substring(0, 5).replace(':', '.')}`
                // console.log("Time: ", isCurrentTime,isTime);
              
                if (isCurrentTime < isTime) {
                  // console.log("End",item.endTime)
                

                const highlightedPlan = {
                  ...Plan,
                  isTomorrow: isTomorrow,
                  isCurrentDate: isCurrentDate,
                  closestPlan: closestPlan,
                };
              
              
                PlanToAdd.push(highlightedPlan);
              }
              } else if ( convertedDate1.getTime() < convertedDate2.getTime())  {
                

                // console.log("DATee: ", formattedDate , item.date);


                const highlightedPlan = {
                  ...Plan,
                  isTomorrow: isTomorrow,
                  isCurrentDate: isCurrentDate,
                  closestPlan: closestPlan,
                };
              
              
                PlanToAdd.push(highlightedPlan);

              }

          });
  
          setSchedule(PlanToAdd);
          // console.log("Testt: ", PlanToAdd);
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
  
  useEffect(() => {
    fetchData();
  }, []);

  const addActivity = async () => {

    
    if (newStartTime !== '' && newEndTime !== '' && newActivity !== '' && selectedDate !== null) {
      const originalDate = new Date();

      const day = originalDate.getDate().toString().padStart(2, '0');
      const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
      const year = originalDate.getFullYear();
      
      const formattedDate = `${day}/${month}/${year}`;

      const selectDate = new Date(selectedDate);

      const dayselected = selectDate.getDate().toString().padStart(2, '0');
      const monthselected = (selectDate.getMonth() + 1).toString().padStart(2, '0');
      const yearselected = selectDate.getFullYear();
      
      const selectedformattedDate = `${dayselected}/${monthselected}/${yearselected}`;

      let isCurrentTime = parseFloat(`${new Date().getHours().toString().padStart(2, '0')}.${new Date().getMinutes().toString().padStart(2, '0')} `)
      let isTime = parseFloat(`${newEndTime.substring(0, 5).replace(':', '.')}`)
      // console.log("DATEEEE: ", formattedDate,selectedformattedDate);
      const date1 = new Date(formattedDate.split("/").reverse().join("-"));
      const date2 = new Date(selectedformattedDate.split("/").reverse().join("-"));
      // console.log("DATEEEE777: ", date1,date2);


      if (date1.toDateString() === date2.toDateString() && isCurrentTime > isTime) {
        seterrMessage(`Time has passed. It's now ${isCurrentTime}`)
        setTimeout(() => {
          seterrMessage('');
        }, 2000); 
      } else if (date1 > date2) {
        seterrMessage(`That day has passed and now it's ${formattedDate}`)
        setTimeout(() => {
          seterrMessage('');
        }, 2000); 
      } else {

      const storedUser_id = localStorage.getItem('id');
      // console.log("user_id: ",storedUser_id);
      setId(storedUser_id);

      const originalDate = new Date(selectedDate);

      const day = originalDate.getDate().toString().padStart(2, '0');
      const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
      const year = originalDate.getFullYear();
      
      const formattedDate = `${day}/${month}/${year}`;
      
      const useMeetingAsString = useMeeting.toString(); // แปลงค่า useEmployee เป็น string

      const AddData = {useMeetingAsString,newStartTime, newEndTime, newActivity ,formattedDate ,storedUser_id, add_role_admin: true };
      const data = JSON.stringify(AddData);
    
      const response = await axios.post('/api/plan', data, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      const resdata = response.data;
    
        if (response.status === 200) {
          if (resdata.success === true) {
            // console.log("Message: ", resdata);
           
            let PlanToAdd = [];

            
          const currentDate = new Date();

          const day = currentDate.getDate().toString().padStart(2, '0');
          const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
          const year = currentDate.getFullYear();
          
          const formattedDate = `${day}/${month}/${year}`;
          const dbData = resdata.dbPlan || [];

           dbData.sort((a, b) => {
                const dateA = new Date(a.date.split('/').reverse().join('-') + ' ' + a.endTime);
                const dateB = new Date(b.date.split('/').reverse().join('-') + ' ' + b.endTime);
                return dateA - dateB;
              });
  
          dbData.forEach((item) => {
            let closestPlan = null;
  
            const Plan = {
              id: item.id,
              date: item.date,
              startTime: `${item.startTime.substring(0, 5).replace(':', '.')} น.`,
              endTime: `${item.endTime.substring(0, 5).replace(':', '.')} น.`,
              activity: item.activity,
            };
  
            const itemDate = new Date(item.date.split('/').reverse().join('-'));
  
            const isTomorrow =
              itemDate.getDate() === currentDate.getDate() + 1 &&
              itemDate.getMonth() === currentDate.getMonth() &&
              itemDate.getFullYear() === currentDate.getFullYear();
  
            const isCurrentDate =
              itemDate.getDate() === currentDate.getDate() &&
              itemDate.getMonth() === currentDate.getMonth() &&
              itemDate.getFullYear() === currentDate.getFullYear();
  
            const convertedDate1 = new Date(formattedDate.split('/').reverse().join('-'));
            const convertedDate2 = new Date(item.date.split('/').reverse().join('-'));

              if (isCurrentDate) {
                let isCurrentTime = parseFloat(`${new Date().getHours().toString().padStart(2, '0')}.${new Date().getMinutes().toString().padStart(2, '0')} `)
                let isTime = parseFloat(`${item.endTime.substring(0, 5).replace(':', '.')}`)
                // console.log("Time: ", isCurrentTime,isTime);
              
                if (isCurrentTime < isTime) {
                  // console.log("ITEm",item)

                  // console.log("End",item.endTime)
                

                const highlightedPlan = {
                  ...Plan,
                  isTomorrow: isTomorrow,
                  isCurrentDate: isCurrentDate,
                  closestPlan: closestPlan,
                };
              
              
                PlanToAdd.push(highlightedPlan);
                // console.log("highlightedPlan: ", highlightedPlan);

              } 
              } else if ( convertedDate1.getTime() < convertedDate2.getTime())  {
                

                // console.log("DATee: ", formattedDate , item.date);


                const highlightedPlan = {
                  ...Plan,
                  isTomorrow: isTomorrow,
                  isCurrentDate: isCurrentDate,
                  closestPlan: closestPlan,
                };
              
              
                PlanToAdd.push(highlightedPlan);
                // console.log("highlightedPlan: ", highlightedPlan);

              }

          });
  
            setSchedule(PlanToAdd);
            // console.log("Testt2: ", PlanToAdd);

            setUseMeeting(false)
            setSelectedDate('');
            setNewStartTime('');
            setNewEndTime('');
            setNewActivity('');

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
      }}
      setSelectedDate('');
      setNewStartTime('');
      setNewEndTime('');
      setNewActivity('');
      setIsEditing(false);
      
  };

  const editField = (id) => {
    setIsEditing(id);
    const itemToEdit = schedule.find(item => item.id === id);
    setNewDate(itemToEdit.date);
    setNewStartTime(itemToEdit.startTime);
    setNewEndTime(itemToEdit.endTime);
    setNewActivity(itemToEdit.activity);

    setNamePlanToAdd(itemToEdit);
  };

  const updateActivity = (id) => {
    const updatedSchedule = schedule.map(item => {
      if (item.id === id) {
        return {
          ...item,
          date: newDate,
          startTime: newStartTime,
          endTime: newEndTime,
          activity: newActivity
        };
      }
      return item;
    });
  
    // Update the schedule state with the modified data
    setSchedule(updatedSchedule);
  
    // Reset the input fields and editing state
    setSelectedDate('');
    setNewStartTime('');
    setNewEndTime('');
    setNewActivity('');
    setIsEditing(false);
  };

 

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  
  
  
  const openEditPopup = async (item) => {
    // console.log("22345: ",item)

    setMessage('');
    setShowEditPopup({ isOpen: true, item });
    // console.log("edit: ",showEditPopup)
  };

  const closeEditPopup = () => {
    setShowEditPopup(false);
  };
  
  const deleteTodo = async (item) => {
    try {
      // console.log("22345: ",item)

      const editedData = { item , id, edit_role_admin: true };
      const data = JSON.stringify(editedData)
      // console.log("delete data: ",data)


      const response = await axios.post('/api/plan', data,  {
        headers: { 'Content-Type': 'application/json' },
      });

      closeEditPopup();

       const resdata = response.data;
  
      if (response.status === 200) {
        if (resdata.success === true) {
          // setReloadData(prev => !prev);

          // console.log("Message: ", resdata);
          setShowDeleteSuccessPopup(true);
          setdeleteMessage(resdata.message);
          fetchData();


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

  

  return (
    <div>
      <CompNavbar />
      <div className=' bg-[url("/bg1.png")] overflow-auto bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center  '>
        <div className='relative mx-auto'>
        <div className='absolute mx-auto top-1/2 h-[550px] overflow-auto shadow bg-[#FFF]  mb-[50px] left-1/2 transform -translate-x-1/2 z-0 md:w-[700px] lg:w-[1000px] md:h-[545px] md:mt-[100px] w-[350px] mt-[80px] rounded-[10px] border-[10px] border-solid border-[colorCode]'>
          <div className='w-full h-[450px] '>

          <div className='mx-auto mt-[20px] md:h-[510px] md:w-[950px] w-[950px] bg-[#F5F5F5]   '>
            <div className='mx-auto   md:h-[450px] md:w-[950px]  '>
              <table className='tracking-wider mx-auto px-4 w-[950px]  text-center table-auto shadow '>
                <thead>
                <tr className={`  text-[15px] bg-[#5A985E] text-white    uppercase`}>
                  <th                   
                  style={{ whiteSpace: 'nowrap' }} className='border py-2 w-[40px] '>{t('No')}</th>
                    <th                   
                    style={{ whiteSpace: 'nowrap' }} className='border py-2 w-[130px]'>{t('Date')}</th>
                    <th                   
                    style={{ whiteSpace: 'nowrap' }} className='border py-2 w-[130px]'>{t("Start Time")}</th>
                    <th                   
                    style={{ whiteSpace: 'nowrap' }} className='border py-2 w-[130px]'>{t("End Time")}</th>
                    <th                   
                    style={{ whiteSpace: 'nowrap' }} className='border py-2 w-[160px]'>{t('Activity')}</th>
                    <th                   
                    style={{ whiteSpace: 'nowrap' }} className='border py-2 w-[51px]'>{t('Edit')}</th>
                  </tr>
                  
                </thead>
                </table>

                <div className='w-[945px] mx-auto h-[420px] overflow-auto  '>
                <table className=' mx-auto  w-[945px]  border  text-center table-auto shadow '>

                <tbody className=''> 
                
                  {schedule.map((item,index) => (
                     <tr
                     key={item.id}
                     className={`h-[55px] text-black ${
                       item.id % 2 === 0 ? 'bg-gray-200' : 'bg-gray-100'
                     } ${item.isTomorrow ? 'bg-yellow-500 text-black' : ''} ${item.isCurrentDate ? 'bg-red-500 text-white' : ''}`}
                   >       
                    <td className='py-2  border  w-[40px]'>
                        {index + 1}
                      </td>
                      <td className='border w-[130px]'>
                          {isEditing === item.id ? (
                          <DatePicker
                          className={`border  rounded-[10px] py-1 w-[95px] text-center ${
                            item.date === selectedDateForHighlight ? 'bg-red-500 text-white' : ''
                          }`}
                          value={newDate}
                          onChange={handleDateChange}
                          dateFormat="dd/MM/yyyy"
                          locale={enGB}                        />
                      ) : (item.date)
                      }
                        </td>
                      <td className='py-2 border  w-[130px]'>
                        {isEditing === item.id ? (
                          <input
                            type='time'
                            value={newStartTime}
                            onChange={(e) => setNewStartTime(e.target.value)}
                            className='border rounded-[10px] py-1 w-[120px]  pl-2 pr-2'
                          />
                        ) : item.startTime}
                      </td>
                      <td className='py-2 border  w-[130px]'>
                        {isEditing === item.id ? (
                          <input
                            type='time'
                            value={newEndTime}
                            onChange={(e) => setNewEndTime(e.target.value)}
                            className='border rounded-[10px] py-1 w-[120px]  pl-2 pr-2 '
                          />
                        ) : item.endTime}
                      </td>
                      <td className='py-2 border  w-[160px]  '>
                        {isEditing === item.id ? (
                          <input
                            type='text'
                            value={newActivity}
                            onChange={(e) => setNewActivity(e.target.value)}
                            className='border rounded-[10px]  py-1 w-[150px]  pl-2'
                          />
                        ) : item.activity}
                      </td>
                      <td className='py-2 border  w-[50px]'>
                        {isEditing === item.id ? (
                          <button onClick={() => updateActivity(item.id)} className='bg-[#5A985E] text-white p-2 text-sm rounded-md'>
                            {t('Save')}
                          </button>
                        ) : (
                          <div className='flex items-center justify-center'>
                          {/* <div>
                          <FontAwesomeIcon
                          className='  cursor-pointer w-[15px] '
                            icon={faPencilAlt}
                            onClick={() => editField(item.id)}
                          />
                          </div> */}
                          {/* <div className='ml-[10px] cursor-pointer w-[15px]'> */}
                          <BsTrash className='cursor-pointer' onClick={(e) => {
                          e.stopPropagation();
                          openEditPopup(item) }}  />
                          
                          </div>
                          // </div>
                        )}
                      </td>
                    </tr>
                  ))}

                  </tbody>
                  </table>
                  </div>
                  
                <div className='border-t border-gray-200  w-full'></div>
                 <div className='md:w-[950px]   '>
                  <table className='mx-auto mt-[-1px] w-[950px]  text-center table-auto  '>
                  <tbody className=''>
                  <tr className='text-black  h-[50px]   ' >
                  <td className='py-2  w-[40px] border '>
                  <input
                    type='checkbox'
                    checked={useMeeting}
                    onChange={(e) => setUseMeeting(e.target.checked)}
                    className='text-[12px]'
                  />                  
                  <p className='text-[11px] mt-[-8px]'>{t('meeting')}</p>
                  </td>
                    <td className=' w-[130px] border '>
                    <DatePicker
                      className='border rounded-[10px] text-[14px] py-1 pl-2 pr-2 w-[105px] text-center'
                      selected={selectedDate}
                      onChange={date => setSelectedDate(date)}
                      dateFormat="dd/MM/yyyy"
                      locale={enGB}                      
                      placeholderText={t("dd/mm/yyyy")}
                    />
                
                    </td>
                    <td className=' w-[130px] border '>
                      <input
                        type='time'
                        value={newStartTime}
                        onChange={(e) => setNewStartTime(e.target.value)}
                        className='border rounded-[10px] py-1 w-[120px] text-[14px] pl-2 pr-2'
                      />
                    </td>
                    <td className=' w-[130px] border '>
                      <input
                        type='time'
                        value={newEndTime}
                        onChange={(e) => setNewEndTime(e.target.value)}
                        className=' border rounded-[10px] py-1 w-[120px] text-[14px] pl-2 pr-2'
                      />
                    </td >
                    <td className=' w-[130px] border '>
                      <input
                        type='text'
                        value={newActivity}
                        onChange={(e) => setNewActivity(e.target.value)}
                        placeholder={t("Add Activity")}
                        className='border rounded-[10px]  py-1 w-[150px] text-[14px] pl-2'
                      />
                    </td>
                    <td className=' w-[50px] border '>
                      <button onClick={addActivity} className='text-[14px] bg-[#5A985E] text-white p-2 rounded-[10px]'>
                      {t('Add')}
                      </button>
                    </td>
                  </tr>
                  
                </tbody>
              </table>
             
              </div>
              
              </div> 
              
              </div> 
              
            </div>
            
            </div>
          </div>
        </div>
         
              {showDeleteSuccessPopup && (
                <div className="mx-auto bg-white text-[#5A985E] p-8 text-center rounded-lg border-black shadow-lg md:w-[300px] w-[200px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <BsCheckCircle className=' text-[50px] text-center mx-auto mb-[10px]'/>
                {deletemessage}
                </div>
              )}
              {showAddSuccessPopup && (
                <div className="mx-auto bg-white text-center text-[#5A985E] p-8  rounded-lg border-black shadow-lg md:w-[350px] w-[300px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <BsCheckCircle className=' text-[50px] mx-auto text-center mb-[10px]'/>
                {addmessage}
                </div>
              )}
              {errmessage && (
                <div className="mx-auto bg-white text-center text-[#5A985E] p-8  rounded-lg border-black shadow-lg md:w-[330px] w-[300px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <BiError className=' text-[50px] mx-auto text-center mb-[10px]'/>
                {errmessage}
                </div>
              )}
               {showEditPopup.isOpen && (
                
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center ">
                <div className="bg-white p-4 rounded-lg border-black shadow-lg md:w-[320px] text-center md:h-[150px] w-[260px] ">
                <h2 className=  {` text-[16px] md:text-[18px] text-[#5A985E] mt-[10px] `}>{t("Do you want to delete")}<span style={{ color: '#FF6B6B' }} className='mr-2'>{showEditPopup.item.activity}</span>{t("?")}</h2>
                  
                  {message && (
                    <p className='mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                      {message}
                    </p>
                  )}
                  <div className=  {` flex justify-center mt-[10px]  md:mt-[30px]`}>
                    <button className="flex justify-center items-center bg-[#93DD79] text-white px-4 py-2 ml-[5px] rounded hover:bg-green-600" onClick={() => deleteTodo(showEditPopup.item)}>{t('Yes')}</button>

                    <button className="flex justify-center items-center bg-[#FF6B6B] text-white px-4 py-2 ml-[10px] rounded hover:bg-red-600" onClick={() => closeEditPopup(false)}>{t('Cancel')}</button>
                  </div>

                </div>
              </div>
            )}
    </div>
  );
}
export default  CompPlan;