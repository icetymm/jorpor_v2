

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import i18n from '../i18n'

const LanguageContext = createContext();

export const CompLanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('');
  const [shouldCallEditLanguage, setShouldCallEditLanguage] = useState(false);
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      const storedId = localStorage.getItem('id');
      if (storedId) {
      }

      const AddData = { storedId, lang_role_2: true };
      const data = JSON.stringify(AddData);

      const response = await axios.post('/api/lang', data, {
        headers: { 'Content-Type': 'application/json' },
      });

      const resdata = response.data;

      if (response.status === 200) {
        if (resdata.success === true) {
          setLanguage(response.data.dbLang[0]);
          i18n.changeLanguage(response.data.dbLang[0]);
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
  }, [language]);

  const toggleLanguage = async () => {
    setLanguage((prevLanguage) => {
      const newLanguage = prevLanguage === 'EN' ? 'TH' : 'EN';
      i18n.changeLanguage(newLanguage);
      setShouldCallEditLanguage(true);
      return newLanguage;
    });
  };

  useEffect(() => {
    const editLanguage = async () => {

      try {
        const storedId = localStorage.getItem('id');
        if (storedId) {
        }
        localStorage.setItem("language", language);

        const AddData = { storedId, language, edit_lang_role_2: true };
        const data = JSON.stringify(AddData);

        const response = await axios.post('/api/lang', data, {
          headers: { 'Content-Type': 'application/json' },
        });

        const resdata = response.data;

        if (response.status === 200) {
          if (resdata.success === true) {
            setLanguage(response.data.dbLang[0]);
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

    if (shouldCallEditLanguage) {
      editLanguage();
      setShouldCallEditLanguage(false);
    }
  }, [language, shouldCallEditLanguage]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};


export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a CompLanguageProvider');
  }
  return context;
};