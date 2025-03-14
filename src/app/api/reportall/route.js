import axios from 'axios';
import db from '../../../lib/db';
import { NextResponse } from 'next/server';
import { format } from 'date-fns';

export async function POST(request) {
  const fs = require('fs');
  if (request.method === 'POST') {
    
    const res = await request.json();
    try {

    if (res.fetch_role_2){
      const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; 
        const year = currentDate.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

      const getQuery = "SELECT * FROM checklist_examine_row_2 WHERE date = ? AND r2_id = ?";
      const [Result] = await db.query(getQuery , [formattedDate , res.storedId]);

      const groupedData = {
        key: []
      };
     
      for (const data of Result) {
        
        const { utcToZonedTime } = require('date-fns-tz');
        const timeZone = 'Asia/Bangkok';
  
        const inspector  = data.inspector;
        const inputDate = new Date(data.send_date);
        // const formattedDatenew = format(utcToZonedTime(inputDate, timeZone), 'dd/MM/yyyy HH:mm', { timeZone });
        // console.log("yyyy-MM-dd HH:mm",formattedDatenew);


      const formattedDatenew = format(inputDate, 'dd/MM/yyyy HH:mm');
      // data.formattedDate = formattedDateA;
      // console.log("Formatted Date", formattedDatenew);

        // const dateTime = `${day}/${month}/${year} ${hours}:${minutes}`;
        // const dateTime = inputDate.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' , year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });

        // console.log("Formatted Date: ", dateTime);
        // groupedData[inspector].date = dateTime;
        // groupedData[key].items.push(data);


        const nameInspector = "SELECT * FROM users WHERE id = ?";
        const [nameInspectorResult] = await db.query(nameInspector, [data.inspector]);
        
        // console.log("nameResult4444: ", nameInspectorResult);
        const name = nameInspectorResult[0].name + ' ' + nameInspectorResult[0].lastname;
        // console.log("NAMEEENAMEEE",name);
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; 
        const year = currentDate.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;
  
        const getIdQuery = "SELECT select_id FROM `select` WHERE date = ? AND user_id = ?";
        const [idResult] = await db.query(getIdQuery, [formattedDate ,data.inspector]);
        const idResultmap = idResult.map(row => row.select_id)[0]; // Extract the string from the array
        console.log("4444idResult: ", idResultmap);
  
        let item_id = [];
  
        // Check if idResultmap is defined before parsing
        if (idResultmap) {
          try {
            item_id = JSON.parse(idResultmap);
            // console.log("Parsed item_id: ", item_id);
          } catch (error) {
            console.error("Error parsing JSON:", error);
            // Handle the error appropriately, e.g., log the error or set a default value
          }
        } else {
          console.warn("idResultmap is undefined or null");
          // Handle the case where idResultmap is undefined or null
        }
        
        const nameList = [];
        let flattenedNameList = []
      
        for (const item of item_id) {
         console.log("4444: ",item)
      
          const getNameExamineListQuery = "SELECT name FROM examinelist WHERE id = ? AND user_id = ?";
          const [nameExamineListResult] = await db.query(getNameExamineListQuery, [item, data.inspector]);
      
          // const nameExamineListResultmap = nameExamineListResult.map(row => row.name);
          nameList.push(nameExamineListResult);
         console.log("nameList: ", nameList);
          flattenedNameList = nameList.flatMap(zone => zone.map(item => item.name));
           console.log("Flattened nameList: ", flattenedNameList);
          // const uniqueFlattenedNameList = [...new Set(flattenedNameList)];
          // console.log("Unique flattened nameList: ", uniqueFlattenedNameList);
          
        }

        const dataitem = {
          date: formattedDatenew,
          id: data.inspector,
          name: name,
          zone: flattenedNameList

        };
        
        if (!groupedData.key.some(item => item.id === data.inspector)) {
          dataitem[inspector] = [];
          dataitem[inspector].push();
          groupedData.key.push(dataitem);
          
        } else {
          const existingItem = groupedData.key.find(item => item.id === data.inspector);
          existingItem[inspector].push(data);
        }      
      };

   

      const calPercent = []
      let reversedCalPercentCopy = []
      const getChecklist_R2Query = "SELECT DISTINCT date FROM checklist_examine_row_2 WHERE r2_id = ?";
        const [getChecklist_R2QueryResult] = await db.query(getChecklist_R2Query, [res.storedId]);
   
        const dateArray = getChecklist_R2QueryResult.map(result => result.date);

        const hasMatchingDate = dateArray.includes(formattedDate);
         if (!hasMatchingDate) {
            dateArray.push(formattedDate);
            // console.log("Reversed Distinct Dates22222:", dateArray);
            dateArray.reverse();

            dateArray.splice(5);
          } else {
            dateArray.splice(5);
          }
          // dateArray.reverse();

        // console.log(`Does the checklist have a date matching ${formattedDate}? ${hasMatchingDate}`);
        // console.log("DATEE-------------------: ",dateArray)
        // let recentDates = getChecklist_R2QueryResult.map(result => result.date);
        // const currentDate = new Date();
        // const formattedCurrentDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
        let formattedDateA; // Declare outside the if-else block
        // const day = currentDate.getDate() ;
        // const month = currentDate.getMonth() + 1; 
        // const year = currentDate.getFullYear();
        // let Date = `${day}/${month}/${year}`;
        // const dateArray = [formattedDate];

        
        // console.log("DATEE1111-------------------: ",getChecklist_R2QueryResult.length , getChecklist_R2QueryResult)
        // If there are more than 5 dates, take the most recent 5
        if (dateArray.length >= 5) {
          // const day = currentDate.getDate() - 5;
          // const month = currentDate.getMonth() + 1; 
          // const year = currentDate.getFullYear();
          // formattedDateA = `${day}/${month}/${year}`;
          if (!dateArray.includes(formattedDate)) {
            dateArray.push(formattedDate);
            dateArray.reverse();
            dateArray.splice(5);
            dateArray.reverse();

           
          } else if (dateArray.includes(formattedDate)) {
            while (dateArray.length < 5) {
              // console.log("CHECKKKKK///////////////////2222: ",dateArray)

              currentDate.setDate(currentDate.getDate() - 1);
            
              const day = currentDate.getDate();
              const month = currentDate.getMonth() + 1; 
              const year = currentDate.getFullYear();
              const formattedDateI = `${day}/${month}/${year}`;
            
              if (!dateArray.includes(formattedDateI)) {
                dateArray.unshift(formattedDateI);
              }            
            }
          } 
          else {
          while (dateArray.length < 5) {
            currentDate.setDate(currentDate.getDate() - 1);
          
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1; 
            const year = currentDate.getFullYear();
            const formattedDateI = `${day}/${month}/${year}`;

            if (!dateArray.includes(formattedDateI)) {
              dateArray.unshift(formattedDateI);
            }
          }
            // Add the formatted date to the beginning of the array only if it's not already present
            
          }
          
          
          } else if ( getChecklist_R2QueryResult.length < 5){
            while (dateArray.length <= (getChecklist_R2QueryResult.length - 1)) {

            currentDate.setDate(currentDate.getDate() - 1);
          
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1; 
            const year = currentDate.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
            
            // Add the formatted date to the beginning of the array only if it's not already present
            if (!dateArray.includes(formattedDate)) {
              dateArray.unshift(formattedDate);
            }
          }
          // If less than 5 days, adjust day calculation
          // const day = currentDate.getDate() - (getChecklist_R2QueryResult.length - 1);
          // const month = currentDate.getMonth() + 1; 
          // const year = currentDate.getFullYear();
          // formattedDateA = `${day}/${month}/${year}`;
        }
        // console.log("Date Array*********************************:", dateArray);

        // console.log("Recent Dates:", formattedDateA );

        // Subtract one day at a time until dateArray has 5 elements
        const currentDatenew = new Date();
        const dayN = currentDatenew.getDate();
        const monthN = currentDatenew.getMonth() + 1; 
        const yearN = currentDatenew.getFullYear();
        const formattedDateNew = `${dayN}/${monthN}/${yearN}`;
     
        for (const currentDateA of dateArray) {
        console.log("currentDate :", currentDateA );

      const getId_r1Query = "SELECT id FROM users WHERE role_2_id = ?";
      const [getId_r1QueryResult] = await db.query(getId_r1Query, [res.storedId]);
      const getId_r1QueryResultMap = getId_r1QueryResult.map(item => item.id);

      const dataAll = {currentDateA}
      const dataPercent = {};
      for (const user_r1 of getId_r1QueryResultMap) {
        const nameList = [];
        let flattenedNameList = []

        
        const getCheckUser_R2Query = `
        SELECT DISTINCT inspector FROM (
          SELECT inspector FROM checklist_examine_row_2 WHERE r2_id = ? AND date = ?
          UNION
          SELECT inspector FROM checklist_employee_row_2 WHERE users_r2_id = ? AND date = ?
      ) AS combinedResult;`;
  
        const [getCheckUser_R2QueryResult] = await db.query(getCheckUser_R2Query, [res.storedId  , formattedDateNew,res.storedId,formattedDateNew ]);
  
        // The result is an array of distinct inspector values
        const distinctInspectors = getCheckUser_R2QueryResult.map(result => result.inspector);
  
        // console.log("distinctInspectors: ",user_r1,distinctInspectors,res.storedId ,formattedDateNew)

        if (distinctInspectors.includes(user_r1)) {
          // console.log("NOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOONNNN  ",user_r1)
        
        const getIdQuery = "SELECT select_id FROM `select` WHERE date = ? AND user_id = ?";
        const [idResult] = await db.query(getIdQuery, [currentDateA,user_r1]);
        const idResultmap = idResult.map(row => row.select_id)[0]; // Extract the string from the array
        console.log("4444idResult: ", idResultmap);

        let item_id = [];

        // Check if idResultmap is defined before parsing
        if (idResultmap) {
          try {
            item_id = JSON.parse(idResultmap);
            // console.log("Parsed item_id: ", item_id);
          } catch (error) {
            console.error("Error parsing JSON:", error);
            // Handle the error appropriately, e.g., log the error or set a default value
          }
        } else {
          console.warn("idResultmap is undefined or null");
          // Handle the case where idResultmap is undefined or null
        }
        

      
        for (const item of item_id) {
          // console.log("4444: ",item)
      
          const getNameExamineListQuery = "SELECT id ,name FROM examinelist WHERE id = ? AND user_id = ?";
          const [nameExamineListResult] = await db.query(getNameExamineListQuery, [item, user_r1]);
      
          // const nameExamineListResultmap = nameExamineListResult.map(row => row.name);
          nameList.push(nameExamineListResult);
          // console.log("nameExamineListResult: ", nameExamineListResult);
          flattenedNameList = nameList.flatMap(zone => zone.map(item => item));
          // console.log("Flattened nameList: ", flattenedNameList);
          // const uniqueFlattenedNameList = [...new Set(flattenedNameList)];
          // console.log("Unique flattened nameList: ", uniqueFlattenedNameList);
          
        }
      }

        if (!dataPercent[user_r1]) {
          dataPercent[user_r1] = [];
        }
      
        for (const idResult of flattenedNameList ) {
          // console.log("idResult: ",idResult)
          const examineObject = {
            [idResult.id]: {
              examine_id: [],
              examine_count: flattenedNameList.length
            }
            ,name: idResult.name,

          };
          // console.log("id:: ",idResult.id , examineObject)

          dataPercent[user_r1].push(examineObject);
        }

      }
      
      for (const userId in dataPercent) {
        const idArray = dataPercent[userId];
      
        for (const idObject of idArray) {
          const idValue = Object.keys(idObject)[0];
          const getExamineQuery = "SELECT id, useEmployee FROM examine WHERE examinelist_id = ?";
          const [getExamineQueryResult] = await db.query(getExamineQuery, [idValue]);
      
          const examine_idArray = idObject[idValue].examine_id;
          let totalPercentage = 0;

          for (const examineInfo of getExamineQueryResult) {
            const currentDate = new Date();
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1; 
            const year = currentDate.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
            


              if ( examineInfo.useEmployee === 'false' ){
                
                const getexaminenameQuery = "SELECT 	id FROM examinename WHERE  examine_id = ? ";
                const [getexaminenameQueryResult] = await db.query(getexaminenameQuery, [examineInfo.id]);
                // console.log("getChecklist_R2QueryResult: ", examineInfo.id,getexaminenameQueryResult);

                const getexaminenameQueryResultMap = getexaminenameQueryResult.map(item => item.id);
                // console.log("getChecklist_R2QueryResultMap: ", getexaminenameQueryResultMap);
                examine_idArray.push({ examineInfo });

                examineInfo.name_id = getexaminenameQueryResultMap
                const getChecklist_R2Query = "SELECT date , examinename_id ,	status FROM checklist_examine_row_2 WHERE  examine_id = ? AND date = ? ";
                const [getChecklist_R2QueryResult] = await db.query(getChecklist_R2Query, [examineInfo.id ,  currentDateA]);
                // console.log("11111111111111111111111111111: ", getChecklist_R2QueryResult ,  currentDateA);
                
                const passCount = getChecklist_R2QueryResult.filter(item => item.status === 'pass').length;


                // console.log("getexaminenameQueryResultMap.length:", examineInfo.id);
                // console.log("Percentage:", Math.floor(percentage), examineInfo.id);
                if (getexaminenameQueryResultMap.length > 0) {
                  const percentage = (passCount / getexaminenameQueryResultMap.length) * 100;
                  examineInfo.percentage = Math.floor(percentage);
                  totalPercentage += percentage;
                } else {
                  examineInfo.percentage = 0;
                  totalPercentage += 0;
                }
               
            } else if ( examineInfo.useEmployee === 'true' ){
              let totalPassCount = 0;


                examine_idArray.push({ examineInfo });

                const getexaminenameQuery = "SELECT id FROM examinename WHERE  examine_id = ? ";
                const [getexaminenameQueryResult] = await db.query(getexaminenameQuery, [examineInfo.id]);
                // console.log("getChecklist_R2QueryResult: ", examineInfo.id, getexaminenameQueryResult);

                const getexaminenameQueryResultMap = getexaminenameQueryResult.map(item => item.id);
                // console.log("getChecklist_R2QueryResultMap: ", examineInfo, getexaminenameQueryResultMap);
                // examine_idArray.push({ examineInfo, id: getexaminenameQueryResultMap });
                examineInfo.examinename = getexaminenameQueryResultMap
                const getemployeeQuery = "SELECT 	id FROM employee WHERE examinelist_id = ? ";
                const [getemployeeQueryResult] = await db.query(getemployeeQuery, [idValue]);
                const getemployeeQueryResultMap = getemployeeQueryResult.map(item => item.id);
                // console.log("8888888888: ", getemployeeQueryResultMap, idValue );

                for (const employee of getemployeeQueryResultMap){
                  // console.log("99999: ",employee,examineInfo.id)
                const getChecklist_R2Query = "SELECT  examinename_id ,	status FROM checklist_employee_row_2 WHERE  examine_id = ? AND employee_name_id = ? AND date = ?";
                const [getChecklist_R2QueryResult] = await db.query(getChecklist_R2Query, [examineInfo.id , employee ,  currentDateA]);
                // console.log("getChecklist_R2QueryResult888: ", getChecklist_R2QueryResult,getexaminenameQueryResult,employee);
                // const examinenameIds = getChecklist_R2QueryResult.map(item => item.examinename_id);

                // const isAnyIdInQueryResult = examinenameIds.some(id =>
                //   getexaminenameQueryResult.some(item => item.id === id)
                // );
                
                // console.log("**-*---***---***-*-",isAnyIdInQueryResult,examinenameIds);
                // let passCount = 0;
                // if (getexaminenameQueryResult.some(item => item.id === getChecklist_R2QueryResult.examinename_id)) {
                  const passCount = getChecklist_R2QueryResult.filter(item => item.status === 'pass').length;
                  // console.log("Pass count:", passCount, examineInfo.id);
                  totalPassCount += passCount;
                  // มีค่า
              //     console.log("มีค่าใน getexaminenameQueryResult: ",getChecklist_R2QueryResult.examinename_id);
              // } else {
              //     // ไม่มีค่า
              //     console.log("ไม่มีค่าใน getexaminenameQueryResult: ",getChecklist_R2QueryResult.examinename_id);
              // }


               
                // if (getexaminenameQueryResultMap.length > 0) {

                  const percentage = Math.floor((passCount / getChecklist_R2QueryResult.length) * 100);
                  examineInfo[employee] = {employee , passCount , percentage }
                // } else {
                //   const percentage = 0;
                //   examineInfo[employee] = {employee , passCount , percentage }
                // }

                // console.log("totalPassCount:",totalPassCount,'employee: ',employee,'passCount: ',passCount, 'getChecklist_R2QueryResult: ' ,getChecklist_R2QueryResult ,'getexaminenameQueryResultMap: ',getexaminenameQueryResultMap,'getexaminenameQueryResultMap.length: ',getexaminenameQueryResultMap.length,'percentage; ',percentage);

                // console.log("getexaminenameQueryResultMap.length:", getexaminenameQueryResultMap.length);
                // console.log("Percentage:", Math.floor(percentage), examineInfo.id);
                // examineInfo.percentage = Math.floor(percentage);
          }
          examineInfo.totalPassCount = totalPassCount;

          const percentageAll = Math.floor((totalPassCount / (getexaminenameQueryResultMap.length * getemployeeQueryResultMap.length)) * 100);
          examineInfo.percentageAll = percentageAll;
          totalPercentage += percentageAll;
          // console.log("percentageAll,: ",percentageAll,totalPassCount,getexaminenameQueryResultMap.length, getemployeeQueryResultMap.length)

        }
          // console.log("percentageAllidObject[idValue].examine_id.length:",  totalPercentage, idObject[idValue].examine_id.length );

        }
        const percentageZone = Math.floor((totalPercentage / (idObject[idValue].examine_id.length * 100)) * 100);
        // console.log("percentageZone:", percentageZone );
        idObject.percentageZone = percentageZone;
        
        // console.log("8888888888888888888:", totalPercentage, idValue);
        

      }
      
      }

      dataAll.data = dataPercent
 

      calPercent.push(dataAll)
      reversedCalPercentCopy = [...calPercent].reverse();
      // console.log("CalPercentCopy----------------:", calPercent);
      // console.log("reversedCalPercentCopy----------------:", reversedCalPercentCopy);
      groupedData.key.reverse();



    }
      return NextResponse.json({ success: true ,dbnotify_name: groupedData ,percent: reversedCalPercentCopy});
    }



    if (res.fetch_role_3){

      const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; 
        const year = currentDate.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        console.log("Date: ",formattedDate)

      const getQuery = "SELECT * FROM checklist_examine_row_2 WHERE date = ?  ";
      const [Result] = await db.query(getQuery , [formattedDate ]);

      // console.log("++++++++++++++++++++, ",Result)
      // console.log("Data_examineWWWWWW: ",Result)
      const groupedData = {
        key: []}
        ;
     

      // วนลูป Array เพื่อจัดกลุ่ม
      for (const data of Result) {
        
        // console.log("ITEMMM",item.inspector);

        // console.log("ITEMMM//////////////////////////",data);
        const { utcToZonedTime } = require('date-fns-tz');
        const timeZone = 'Asia/Bangkok';
  
        const inspector  = data.inspector;
        const inputDate = new Date(data.send_date);
        // const formattedDatenew = format(utcToZonedTime(inputDate, timeZone), 'dd/MM/yyyy HH:mm', { timeZone });
        // console.log("yyyy-MM-dd HH:mm",formattedDatenew);

       

    // ในที่นี้, คุณไม่ได้ใช้ inspector หรือ inputDate ซ้ำ
    // และไม่จำเป็นต้องใช้ Promise.all
      const formattedDatenew = format(inputDate, 'dd/MM/yyyy HH:mm');
      // console.log("Formatted Date", formattedDatenew);
        // const dateTime = `${day}/${month}/${year} ${hours}:${minutes}`;
        // const dateTime = inputDate.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' , year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });

        // console.log("Formatted Date: ", dateTime);


        const nameInspector = "SELECT * FROM users WHERE id = ?";
        const [nameInspectorResult] = await db.query(nameInspector, [data.inspector]);
        
        // console.log("nameResult4444: ", nameInspectorResult);
        const name = nameInspectorResult[0].name + ' ' + nameInspectorResult[0].lastname;
        // console.log("NAMEEENAMEEE",name);
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; 
        const year = currentDate.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;
  
        const getIdQuery = "SELECT select_id FROM `select` WHERE date = ? AND user_id = ?";
        const [idResult] = await db.query(getIdQuery, [formattedDate ,data.inspector]);
        const idResultmap = idResult.map(row => row.select_id)[0]; // Extract the string from the array
        // console.log("4444idResult: ", idResultmap);
  
        let item_id = [];
  
        // Check if idResultmap is defined before parsing
        if (idResultmap) {
          try {
            item_id = JSON.parse(idResultmap);
            // console.log("Parsed item_id: ", item_id);
          } catch (error) {
            console.error("Error parsing JSON:", error);
            // Handle the error appropriately, e.g., log the error or set a default value
          }
        } else {
          console.warn("idResultmap is undefined or null");
          // Handle the case where idResultmap is undefined or null
        }
        
        const nameList = [];
        let flattenedNameList = []
      
        for (const item of item_id) {
          // console.log("4444: ",item)
      
          const getNameExamineListQuery = "SELECT name FROM examinelist WHERE id = ? AND user_id = ?";
          const [nameExamineListResult] = await db.query(getNameExamineListQuery, [item, data.inspector]);
      
          // const nameExamineListResultmap = nameExamineListResult.map(row => row.name);
          nameList.push(nameExamineListResult);
          // console.log("nameList: ", nameList);
          flattenedNameList = nameList.flatMap(zone => zone.map(item => item.name));
          // console.log("Flattened nameList: ", flattenedNameList);
          // const uniqueFlattenedNameList = [...new Set(flattenedNameList)];
          // console.log("Unique flattened nameList: ", uniqueFlattenedNameList);
          
        }

        const dataitem = {
          date: formattedDatenew,
          id: data.inspector,
          name: name,
          zone: flattenedNameList

        };
        
        if (!groupedData.key.some(item => item.id === data.inspector)) {
          dataitem[inspector] = [];
          dataitem[inspector].push();
          groupedData.key.push(dataitem);
        } else {
          const existingItem = groupedData.key.find(item => item.id === data.inspector);
          existingItem[inspector].push(data);
        }
      

        // เพิ่มข้อมูลลงในกลุ่มที่เป็น key เดียวกัน
        // console.log("resultGroup", groupedData);

        
      };

      // แสดงผลลัพธ์
      // console.log("resultGroup",res.storedId);
      const calPercent = []
      let reversedCalPercentCopy = []
      let item_id = [];

      const getChecklist_R2Query = "SELECT DISTINCT date FROM checklist_examine_row_2 ";
        const [getChecklist_R2QueryResult] = await db.query(getChecklist_R2Query);
   
        // console.log("Distinct Dates:", getChecklist_R2QueryResult.map(result => result.date));
        // console.log("Number of Dates:", getChecklist_R2QueryResult.length);
        
        // for (const i in getChecklist_R2QueryResult.map(result => result.date)) {
        //   if ( i === formattedDate) {
        //   } 
        // }
        const dateArray = getChecklist_R2QueryResult.map(result => result.date);

        
        // console.log("Reversed Distinct Dates:", dateArray);

        const hasMatchingDate = dateArray.includes(formattedDate);
         if (!hasMatchingDate) {
            dateArray.push(formattedDate);
            // console.log("Reversed Distinct Dates22222:", dateArray);
            dateArray.reverse();

            dateArray.splice(5);
          } else {
            dateArray.splice(5);
          }
          // dateArray.reverse();

        // console.log(`Does the checklist have a date matching ${formattedDate}? ${hasMatchingDate}`);
        // console.log("DATEE-------------------: ",dateArray)
        // let recentDates = getChecklist_R2QueryResult.map(result => result.date);
        // const currentDate = new Date();
        // const formattedCurrentDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
        let formattedDateA; // Declare outside the if-else block
        // const day = currentDate.getDate() ;
        // const month = currentDate.getMonth() + 1; 
        // const year = currentDate.getFullYear();
        // let Date = `${day}/${month}/${year}`;
        // const dateArray = [formattedDate];

        
        // console.log("DATEE1111-------------------: ",getChecklist_R2QueryResult.length , getChecklist_R2QueryResult)
        // If there are more than 5 dates, take the most recent 5
        if (dateArray.length >= 5) {
          // const day = currentDate.getDate() - 5;
          // const month = currentDate.getMonth() + 1; 
          // const year = currentDate.getFullYear();
          // formattedDateA = `${day}/${month}/${year}`;
          if (!dateArray.includes(formattedDate)) {
            dateArray.push(formattedDate);
            dateArray.reverse();
            dateArray.splice(5);
            dateArray.reverse();

           
          } else if (dateArray.includes(formattedDate)) {
            while (dateArray.length < 5) {
              // console.log("CHECKKKKK///////////////////2222: ",dateArray)

              currentDate.setDate(currentDate.getDate() - 1);
            
              const day = currentDate.getDate();
              const month = currentDate.getMonth() + 1; 
              const year = currentDate.getFullYear();
              const formattedDateI = `${day}/${month}/${year}`;
            
              if (!dateArray.includes(formattedDateI)) {
                dateArray.unshift(formattedDateI);
              }            
            }
          } 
          else {
          while (dateArray.length < 5) {
            currentDate.setDate(currentDate.getDate() - 1);
          
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1; 
            const year = currentDate.getFullYear();
            const formattedDateI = `${day}/${month}/${year}`;

            if (!dateArray.includes(formattedDateI)) {
              dateArray.unshift(formattedDateI);
            }
          }
            // Add the formatted date to the beginning of the array only if it's not already present
            
          }
          
          
          } else if ( getChecklist_R2QueryResult.length < 5){
            while (dateArray.length <= (getChecklist_R2QueryResult.length - 1)) {

            currentDate.setDate(currentDate.getDate() - 1);
          
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1; 
            const year = currentDate.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
            
            // Add the formatted date to the beginning of the array only if it's not already present
            if (!dateArray.includes(formattedDate)) {
              dateArray.unshift(formattedDate);
            }
          }
          // If less than 5 days, adjust day calculation
          // const day = currentDate.getDate() - (getChecklist_R2QueryResult.length - 1);
          // const month = currentDate.getMonth() + 1; 
          // const year = currentDate.getFullYear();
          // formattedDateA = `${day}/${month}/${year}`;
        }
        // console.log("Date Array:", dateArray);

        // console.log("Recent Dates:", formattedDateA );

        // Subtract one day at a time until dateArray has 5 elements
     
        const currentDatenew = new Date();
        const dayN = currentDatenew.getDate();
        const monthN = currentDatenew.getMonth() + 1; 
        const yearN = currentDatenew.getFullYear();
        const formattedDateNew = `${dayN}/${monthN}/${yearN}`;
     
        for (const currentDateA of dateArray) {
          // console.log("currentDate :", currentDateA );

      const getId_r1Query = "SELECT id FROM users ";
      const [getId_r1QueryResult] = await db.query(getId_r1Query);
      const getId_r1QueryResultMap = getId_r1QueryResult.map(item => item.id);

      const dataAll = {currentDateA}
      const dataPercent = {};
      for (const user_r1 of getId_r1QueryResultMap) {
        const nameList = [];
        let flattenedNameList = []

        
        const getCheckUser_R2Query = `
        SELECT DISTINCT inspector FROM (
          SELECT inspector FROM checklist_examine_row_2 WHERE  date = ?
          UNION
          SELECT inspector FROM checklist_employee_row_2 WHERE  date = ?
      ) AS combinedResult;`;
  
        const [getCheckUser_R2QueryResult] = await db.query(getCheckUser_R2Query, [formattedDateNew,formattedDateNew ]);
  
        // The result is an array of distinct inspector values
        const distinctInspectors = getCheckUser_R2QueryResult.map(result => result.inspector);
  
        // console.log("distinctInspectors: ",user_r1,distinctInspectors,res.storedId ,formattedDateNew)

        if (distinctInspectors.includes(user_r1)) {
          // console.log("NOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOONNNN  ",user_r1)
        
        const getIdQuery = "SELECT select_id FROM `select` WHERE date = ? AND user_id = ?";
        const [idResult] = await db.query(getIdQuery, [currentDateA,user_r1]);
        const idResultmap = idResult.map(row => row.select_id)[0]; // Extract the string from the array
        // console.log("4444idResult: ", idResultmap);

        let item_id = [];

        // Check if idResultmap is defined before parsing
        if (idResultmap) {
          try {
            item_id = JSON.parse(idResultmap);
            // console.log("Parsed item_id: ", item_id);
          } catch (error) {
            console.error("Error parsing JSON:", error);
            // Handle the error appropriately, e.g., log the error or set a default value
          }
        } else {
          console.warn("idResultmap is undefined or null");
          // Handle the case where idResultmap is undefined or null
        }
        

      
        for (const item of item_id) {
          // console.log("4444: ",item)
      
          const getNameExamineListQuery = "SELECT id ,name FROM examinelist WHERE id = ? AND user_id = ?";
          const [nameExamineListResult] = await db.query(getNameExamineListQuery, [item, user_r1]);
      
          // const nameExamineListResultmap = nameExamineListResult.map(row => row.name);
          nameList.push(nameExamineListResult);
          // console.log("nameExamineListResult: ", nameExamineListResult);
          flattenedNameList = nameList.flatMap(zone => zone.map(item => item));
          // console.log("Flattened nameList: ", flattenedNameList);
          // const uniqueFlattenedNameList = [...new Set(flattenedNameList)];
          // console.log("Unique flattened nameList: ", uniqueFlattenedNameList);
          
        }
      }

        if (!dataPercent[user_r1]) {
          dataPercent[user_r1] = [];
        }

        
      
        for (const idResult of flattenedNameList ) {
          // console.log("idResult: ",idResult)
          const examineObject = {
            [idResult.id]: {
              examine_id: [],
              examine_count: flattenedNameList.length
            }
            ,name: idResult.name,

          };
          // console.log("id:: ",idResult.id , examineObject)

          dataPercent[user_r1].push(examineObject);
        }

      }
      
      for (const userId in dataPercent) {
        const idArray = dataPercent[userId];
      
        for (const idObject of idArray) {
          const idValue = Object.keys(idObject)[0];
          const getExamineQuery = "SELECT id, useEmployee FROM examine WHERE examinelist_id = ?";
          const [getExamineQueryResult] = await db.query(getExamineQuery, [idValue]);
      
          const examine_idArray = idObject[idValue].examine_id;
          let totalPercentage = 0;

          for (const examineInfo of getExamineQueryResult) {
            const currentDate = new Date();
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1; 
            const year = currentDate.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
            


              if ( examineInfo.useEmployee === 'false' ){
                
                const getexaminenameQuery = "SELECT 	id FROM examinename WHERE  examine_id = ? ";
                const [getexaminenameQueryResult] = await db.query(getexaminenameQuery, [examineInfo.id]);
                // console.log("getChecklist_R2QueryResult: ", examineInfo.id,getexaminenameQueryResult);

                const getexaminenameQueryResultMap = getexaminenameQueryResult.map(item => item.id);
                // console.log("getChecklist_R2QueryResultMap: ", getexaminenameQueryResultMap);
                examine_idArray.push({ examineInfo });

                examineInfo.name_id = getexaminenameQueryResultMap
                const getChecklist_R2Query = "SELECT date , examinename_id ,	status FROM checklist_examine_row_2 WHERE  examine_id = ? AND date = ? ";
                const [getChecklist_R2QueryResult] = await db.query(getChecklist_R2Query, [examineInfo.id ,  currentDateA]);
                // console.log("11111111111111111111111111111: ", getChecklist_R2QueryResult ,  currentDateA);
                
                const passCount = getChecklist_R2QueryResult.filter(item => item.status === 'pass').length;


                // console.log("getexaminenameQueryResultMap.length:", examineInfo.id);
                // console.log("Percentage:", Math.floor(percentage), examineInfo.id);
                if (getexaminenameQueryResultMap.length > 0) {
                  const percentage = (passCount / getexaminenameQueryResultMap.length) * 100;
                  examineInfo.percentage = Math.floor(percentage);
                  totalPercentage += percentage;
                } else {
                  examineInfo.percentage = 0;
                  totalPercentage += 0;
                }
               
            } else if ( examineInfo.useEmployee === 'true' ){
              let totalPassCount = 0;


                examine_idArray.push({ examineInfo });

                const getexaminenameQuery = "SELECT id FROM examinename WHERE  examine_id = ? ";
                const [getexaminenameQueryResult] = await db.query(getexaminenameQuery, [examineInfo.id]);
                // console.log("getChecklist_R2QueryResult: ", examineInfo.id, getexaminenameQueryResult);

                const getexaminenameQueryResultMap = getexaminenameQueryResult.map(item => item.id);
                // console.log("getChecklist_R2QueryResultMap: ", examineInfo, getexaminenameQueryResultMap);
                // examine_idArray.push({ examineInfo, id: getexaminenameQueryResultMap });
                examineInfo.examinename = getexaminenameQueryResultMap
                const getemployeeQuery = "SELECT 	id FROM employee WHERE examinelist_id = ? ";
                const [getemployeeQueryResult] = await db.query(getemployeeQuery, [idValue]);
                const getemployeeQueryResultMap = getemployeeQueryResult.map(item => item.id);
                // console.log("8888888888: ", getemployeeQueryResultMap, idValue );

                for (const employee of getemployeeQueryResultMap){
                  // console.log("99999: ",employee,examineInfo.id)
                const getChecklist_R2Query = "SELECT  examinename_id ,	status FROM checklist_employee_row_2 WHERE  examine_id = ? AND employee_name_id = ? AND date = ?";
                const [getChecklist_R2QueryResult] = await db.query(getChecklist_R2Query, [examineInfo.id , employee ,  currentDateA]);
                // console.log("getChecklist_R2QueryResult888: ", getChecklist_R2QueryResult,getexaminenameQueryResult,employee);
                // const examinenameIds = getChecklist_R2QueryResult.map(item => item.examinename_id);

                // const isAnyIdInQueryResult = examinenameIds.some(id =>
                //   getexaminenameQueryResult.some(item => item.id === id)
                // );
                
                // console.log("**-*---***---***-*-",isAnyIdInQueryResult,examinenameIds);
                // let passCount = 0;
                // if (getexaminenameQueryResult.some(item => item.id === getChecklist_R2QueryResult.examinename_id)) {
                  const passCount = getChecklist_R2QueryResult.filter(item => item.status === 'pass').length;
                  // console.log("Pass count:", passCount, examineInfo.id);
                  totalPassCount += passCount;
                  // มีค่า
              //     console.log("มีค่าใน getexaminenameQueryResult: ",getChecklist_R2QueryResult.examinename_id);
              // } else {
              //     // ไม่มีค่า
              //     console.log("ไม่มีค่าใน getexaminenameQueryResult: ",getChecklist_R2QueryResult.examinename_id);
              // }


               
                // if (getexaminenameQueryResultMap.length > 0) {

                  const percentage = Math.floor((passCount / getChecklist_R2QueryResult.length) * 100);
                  examineInfo[employee] = {employee , passCount , percentage }
                // } else {
                //   const percentage = 0;
                //   examineInfo[employee] = {employee , passCount , percentage }
                // }

                // console.log("totalPassCount:",totalPassCount,'employee: ',employee,'passCount: ',passCount, 'getChecklist_R2QueryResult: ' ,getChecklist_R2QueryResult ,'getexaminenameQueryResultMap: ',getexaminenameQueryResultMap,'getexaminenameQueryResultMap.length: ',getexaminenameQueryResultMap.length,'percentage; ',percentage);

                // console.log("getexaminenameQueryResultMap.length:", getexaminenameQueryResultMap.length);
                // console.log("Percentage:", Math.floor(percentage), examineInfo.id);
                // examineInfo.percentage = Math.floor(percentage);
          }
          examineInfo.totalPassCount = totalPassCount;

          const percentageAll = Math.floor((totalPassCount / (getexaminenameQueryResultMap.length * getemployeeQueryResultMap.length)) * 100);
          examineInfo.percentageAll = percentageAll;
          totalPercentage += percentageAll;
          // console.log("percentageAll,: ",percentageAll,totalPassCount,getexaminenameQueryResultMap.length, getemployeeQueryResultMap.length)

        }
          // console.log("percentageAllidObject[idValue].examine_id.length:",  totalPercentage, idObject[idValue].examine_id.length );

        }
        const percentageZone = Math.floor((totalPercentage / (idObject[idValue].examine_id.length * 100)) * 100);
        // console.log("percentageZone:", percentageZone );
        idObject.percentageZone = percentageZone;
        
        // console.log("8888888888888888888:", totalPercentage, idValue);
        

      }
      
      }
      dataAll.data = dataPercent
      // console.log(dataAll. currentDateA); // แสดงค่า currentDate ที่อยู่ในอ็อบเจ็กต์ dataAll

      // console.log("Final dataPercent:", dataPercent);
      // console.log("Final dataPercent dataAll ------------------------:",  dataAll);
      calPercent.push(dataAll)
      reversedCalPercentCopy = [...calPercent].reverse();
      // console.log("CalPercentCopy----------------:", calPercent);
      // console.log("reversedCalPercentCopy----------------:", reversedCalPercentCopy);
      groupedData.key.reverse();


    }
      return NextResponse.json({ success: true ,dbnotify_name: groupedData ,percent: reversedCalPercentCopy});
    }

    if (res.responseDetail) {
      try {

        // const getfileQuery = 'SELECT file FROM notify WHERE title = ?';
        // const [fileResult] = await db.query(getfileQuery,[res.responseValue]);
      
        // console.log("file: ",fileResult[0].file)



        const getQuery = 'SELECT * FROM notify WHERE id = ?';
        const [responseResult] = await db.query(getQuery ,[res.id]);

        // console.log("rusultRoot: ",responseResult)

        return NextResponse.json({ success: true , message: 'successfully!' , responseResult: responseResult});
      } catch (error) {
        console.error('ErrorEditEx:', error);
        return NextResponse.json({ success: false, error: error.message });
      }
    }

    if (res.responseDetail_role_3) {
      try {


        const getQuery = "SELECT * FROM notify WHERE id = ?";
        const [responseResult] = await db.query(getQuery , [res.idValue]);


        // console.log("rusultRoot: ",responseResult)

        return NextResponse.json({ success: true , message: 'successfully!' , responseResult: responseResult});
      } catch (error) {
        console.error('ErrorEditEx:', error);
        return NextResponse.json({ success: false, error: error.message });
      }
    }


    
    if (res.response_role_2) {
      try {


        const getQuery = "SELECT * FROM notify WHERE Verification_status = 'Pending approval'";
        const [responseResult] = await db.query(getQuery);


        // console.log("rusultRoot: ",responseResult)

        return NextResponse.json({ success: true , message: 'successfully!' , responseResult: responseResult});
      } catch (error) {
        console.error('ErrorEditEx:', error);
        return NextResponse.json({ success: false, error: error.message });
      }
    }

    if (res.response_role_3) {
      try {


        const getQuery = "SELECT * FROM notify WHERE Verification_status = 'Approve'";
        const [responseResult] = await db.query(getQuery);


        // console.log("rusultRoot: ",responseResult)

        return NextResponse.json({ success: true , message: 'successfully!' , responseResult: responseResult});
      } catch (error) {
        console.error('ErrorEditEx:', error);
        return NextResponse.json({ success: false, error: error.message });
      }
    }



    
    } catch (error) {
      console.error('Error notify:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}
