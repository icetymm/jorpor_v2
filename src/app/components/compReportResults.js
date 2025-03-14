'use client'
import React, { useState, useEffect } from 'react';
// import '@fontsource/ntr';
import '../globals.css';
// import '@fontsource/mitr';
// import CompNavbar from './compNavbar/role_1';
// import axios from 'axios';
import CompReportResultsForm from './compReportResultsForm';
import CompReportResultsDisplay from './CompReportResultsDisplay';
import { CompLanguageProvider, useLanguage } from './compLanguageProvider_role_1';
import { useTranslation } from 'react-i18next';
// import i18n from '../i18n'; 
// import { initReactI18next } from 'react-i18next';


function compReportResults() {
  return (
    <CompLanguageProvider>
      <App />
    </CompLanguageProvider>
  );
}

function App() {
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();
  
  const [confirmedData, setConfirmedData] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({});


  useEffect(() => {
    localStorage.removeItem('recheck');
    localStorage.removeItem('isSubmitted', JSON.stringify(true));

    const storedIsSubmitted = localStorage.getItem('isSubmitted');
    if (storedIsSubmitted) {
      setIsSubmitted(JSON.parse(storedIsSubmitted));
    } else {
      setIsSubmitted(false);
    }
  }, []);

  const handleFormSubmit = (data) => {
    setFormData(data);
  
    localStorage.setItem('isSubmitted', JSON.stringify(true));
    setIsSubmitted(true);
  };
  
  return (
    <div className=' bg-[url("/bg1.png")]  overflow-auto bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center '>
    <div className='md:w-[1000px] mx-auto '>
      <div className='absolute top-[100px] left-1/2 transform -translate-x-1/2 z-0'>
        <div className='bg-[#5A985E] mx-auto max-w-[500px] sm:max-w-[350px] py-[100px] rounded-[50px]'></div>
      </div>
  
      <CompReportResultsForm onSubmit={handleFormSubmit} />
      {Object.keys(formData).length > 0 && (
        <CompReportResultsDisplay data={formData}  />
        )} 
    </div>
  </div>
  

);
}
export default compReportResults;

