'use client'
import React, { useState, useEffect } from 'react';
// import '@fontsource/ntr';
import '../globals.css';
// import '@fontsource/mitr';
import CompNavbar from './compNavbar/role_1';
import axios from 'axios';
import CompExamineList from './compExamineList';
import CompSelectExamineList from './compSelectExamineList'
import { CompLanguageProvider, useLanguage } from './compLanguageProvider_role_1';


function CompSelect() {
  return (
    <CompLanguageProvider>
      <App />
    </CompLanguageProvider>
  );
}

function App() {
  const { language, toggleLanguage } = useLanguage();
  const [confirmedData, setConfirmedData] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({});
  const [checkedItems, setCheckedItems] = useState([]);
  const [message, setMessage] = useState('');


  useEffect(() => {
    const storedUser_id = localStorage.getItem('id');
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // เพิ่ม 1 เนื่องจากมกราคมเริ่มที่ 0
    const year = currentDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const fetchData = async () => {
      try {

        const AddData = { storedUser_id, formattedDate, fetch: true};
        const fetchdata = JSON.stringify(AddData);

        const response = await axios.post('/api/select', fetchdata, {
          headers: { 'Content-Type': 'application/json' },
        });        
        
        const data = response.data;

        if (response.status === 200) {
          if (data.success === true) {

              if (data.idResultmap){
                setIsSubmitted(true);
              } else {
                setIsSubmitted(false);
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
    };
    fetchData();
  
    const storedIsSubmitted = localStorage.getItem('isSubmitted');
    if (storedIsSubmitted) {
      setIsSubmitted(JSON.parse(storedIsSubmitted));
    } else {
      setIsSubmitted(false);
    }
  }, []);

  const handleFormSubmit = (checkedItems) => {
    localStorage.setItem('checkedItems', JSON.stringify(checkedItems));


    setCheckedItems(checkedItems)
   
    localStorage.setItem('isSubmitted', JSON.stringify(true));
    setIsSubmitted(true);
  };



   return (
    <div className=' bg-[url("/bg1.png")]  overflow-auto bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center '>
      <div className='md:w-[1000px] mx-auto '>
        <div className='absolute top-[100px] left-1/2 transform -translate-x-1/2 z-0'>
          <div className='bg-[#5A985E] mx-auto max-w-[500px] sm:max-w-[350px] py-[100px] rounded-[50px]'></div>
        </div>
        <CompSelectExamineList onSubmit={handleFormSubmit} />

        
        {isSubmitted && (
          <div>
            <CompExamineList checkedItems={checkedItems} />
          </div>
        )}
      </div>
    </div>
  );
}
export default CompSelect;