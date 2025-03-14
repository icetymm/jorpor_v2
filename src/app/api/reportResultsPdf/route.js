import { it } from 'node:test';
import db from '../../../lib/db';
import { NextResponse } from 'next/server';
import { format } from 'date-fns';


export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();

    try {
      const { fetchdata} = res;
      // console.log("RES_ROUTE_examineRe777: ", res);
// 
      if (res.send) {
        
        const currentDateStr = new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' });
        const currentDate = new Date(currentDateStr);
        
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const hours = currentDate.getHours().toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
        const seconds = currentDate.getSeconds().toString().padStart(2, '0');
        
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

       
        
        for (const item of res.nameExamine.items) {
          // console.log("res.items.examine: ", item);

          Object.keys(item.examine).forEach(async (key , index) => {
            const data = item.examine[key][0];
            
            // console.log("res.data.examine: ", key, data.useEmployee);
            if (data.useEmployee === 'false') {

              

              for (const B of data.itemA){
                // console.log("LLLL: ",B)
                const getR2_idQuery = "SELECT role_2_id FROM users WHERE id  = ?";
                const [R2_idResult] = await db.query(getR2_idQuery, [ B.inspector ]);
        
                // console.log("employeeResult: ",R2_idResult[0].role_2_id);

                const insertValueQuery = `
                INSERT INTO checklist_examine_row_2 (date, examinename_id, status, details, inspector, examine_id, examinelist_id ,send_date , r2_id )
                VALUES (?,?,?,?,?,?,?,?,?);
                `;
                const insertValueQueryResult = await db.query(insertValueQuery, [B.date ,	B.examinename_id ,	B.status 	,	B.details 	,	B.inspector 	,	B.examine_id 	,	B.examinelist_id ,formattedDate, R2_idResult[0].role_2_id]);
  
              }

            } else if (data.useEmployee === 'true') {
              // console.log("QQQQฤฤฤฤ: ",data)

              for (const B of data.itemA){
                for (const C of B.itemB){
                  const getR2_idQuery = "SELECT role_2_id FROM users WHERE id  = ?";
                const [R2_idResult] = await db.query(getR2_idQuery, [ C.inspector ]);
        
                // console.log("employeeResult: ",R2_idResult[0].role_2_id);
                //   console.log("QQQQQQQQQQQQQQ: ",B.itemB.length)
                  const insertValueQuery = `
                    INSERT INTO checklist_employee_row_2 (date, employee_name_id, examinename_id, status, details, inspector, examine_id, examinelist_id , users_r2_id)
                    VALUES (?,?,?,?,?,?,?,?,?);
                    `;
                  const insertValueQueryResult = await db.query(insertValueQuery, [C.date ,C.employee_name_id ,	C.examinename_id ,	C.status 	,	C.details 	,	C.inspector 	,	C.examine_id 	,	C.examinelist_id , R2_idResult[0].role_2_id]);
  
                }
              }
         
            }
          })
        }

        
        return NextResponse.json({ success: true , message: 'The information has been sent successfully.' ,redirect: '/examineList' });
        
      }

  
      if (res.fetch) {
        const getdate_R2Query = "SELECT DISTINCT date FROM checklist_examine_row_2 WHERE inspector = ?";
        const [getdate_R2QueryResult] = await db.query(getdate_R2Query, [res.user_IdValue]);
      
        const getIdQuery = "SELECT select_id FROM `select` WHERE user_id = ?";
        const [idResult] = await db.query(getIdQuery, [res.user_IdValue]);
        const idResultmap = idResult.map(row => row.select_id);
        // console.log("4444idResult: ",JSON.parse(idResultmap))
        const selectIdString = idResult[0].select_id;

        const item_id = JSON.parse(selectIdString);

        const nameList = [];
      
        for (const item of item_id) {
          // console.log("4444: ",item)
      
          const getNameExamineListQuery = "SELECT name FROM examinelist WHERE id = ? AND user_id = ?";
          const [nameExamineListResult] = await db.query(getNameExamineListQuery, [item, res.user_IdValue]);
      
          const nameExamineListResultmap = nameExamineListResult.map(row => row.name);
          nameList.push(nameExamineListResultmap);
          // console.log("nameList: ", nameList,nameExamineListResult);
        }
      
  
        return NextResponse.json({ success: true  , dbnameExamineList: nameExamineListResultmap  });
        }


        

        if (res.option) {
          try {
            const currentDate = new Date();
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1; // เพิ่ม 1 เนื่องจากมกราคมเริ่มที่ 0
            const year = currentDate.getFullYear();
            const formattedDateA = `${day}/${month}/${year}`;

            const idList = [];
            const resultDict = {};
            const fullName = [];

           
            const getUserIDQuery = "SELECT * FROM users WHERE id = ?";
            const [UserIDResult] = await db.query(getUserIDQuery, [res.id]);

            if (UserIDResult.length > 0 && UserIDResult[0].name && UserIDResult[0].lastname) {
              fullName.push(`${UserIDResult[0].name} ${UserIDResult[0].lastname}`) ;
              // console.log("USER: ", fullName);
            } else {
              console.error("User not found or missing name/lastname information.");
            }    

            const getIdQuery = "SELECT select_id FROM `select` WHERE date = ? AND user_id = ?";
            const [idResult] = await db.query(getIdQuery, [formattedDateA , res.id]);
            
            const selectIdString = idResult[0].select_id;

            const item_id = JSON.parse(selectIdString);
            
    
            const nameList = [];
            // console.log("item_id: ", item_id);

            for (const item of item_id) {
          
              const getNameExamineListQuery = "SELECT name FROM examinelist WHERE id = ? AND user_id = ?";
              const [nameExamineListResult] = await db.query(getNameExamineListQuery, [item, res.id]);
          
              const nameExamineListResultmap = nameExamineListResult.map(row => row.name);
              if (nameExamineListResultmap.length > 0) {
                nameList.push(nameExamineListResultmap);
              }
              // console.log("nameExamineListResult: ",nameExamineListResult);
            }
            // console.log("nameList: ", nameList);

                  
            for (const name of nameList) {
              // console.log("NAME: ", name);
              const getExamineIDQuery = "SELECT id FROM examinelist WHERE name = ? AND user_id = ?";
              const [examineIDResult] = await db.query(getExamineIDQuery, [name , res.id]);
        

              if (examineIDResult.length > 0) {
                const getIDExamineListQuery = "SELECT * FROM examine WHERE examinelist_id = ? ";
                const [idExamineListResult] = await db.query(getIDExamineListQuery, [examineIDResult[0].id ]);
                // const idExamineListResultmap = idExamineListResult.map((row) => row.name);
                const idExamineListResultmap = idExamineListResult.map((row) => {
                  return {
                      name: row.name,
                      useEmployee: row.useEmployee,
                  };
              });
                const getEmployeeQuery = "SELECT * FROM employee WHERE examinelist_id  = ? ";
                const [employeeResult] = await db.query(getEmployeeQuery, [examineIDResult[0].id ]);
        
                idList.push({ id:examineIDResult[0].id ,name, employee: employeeResult,  examine: idExamineListResultmap });
              } else {
                console.error(`No id found for ${name}`);
              }
              // console.log("idListtt: ", idList);

            }
        
        


            // เพิ่มข้อมูลเวลา
            const options = { timeZone: 'Asia/Bangkok', hour12: false };

            const hours = currentDate.toLocaleString('en-US', options).split(' ')[1].split(':')[0].padStart(2, '0');
            const minutes = currentDate.toLocaleString('en-US', options).split(' ')[1].split(':')[1].padStart(2, '0');

            const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;
            const formattedDate = `${day}/${month}/${year}`;

            // console.log("Date and Time: ", formattedDate);

            // const getQuery = "SELECT send_date FROM checklist_examine_row_2 WHERE date = ? AND r2_id = ?";
            // const [Result] = await db.query(getQuery , [formattedDate , res.storedId]);
            // console.log("datee++++++++++++++++++: ",formattedDate , Result)
           
            // const singleDateObject = Result[0].send_date;

            // // แปลงให้เป็น JavaScript Date Object
            // const dateObject = new Date(singleDateObject);

            // // สร้าง object สำหรับ localization ของภาษาไทย
            // const options = { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Bangkok" };

            // // แปลงเป็นเวลาที่มีรูปแบบ Thai Time
            // const thaiTime = dateObject.toLocaleString("th-TH", options).replace(/(\d+)\/(\d+)\/(\d+),/, '$2/$1/$3,');

            // console.log("Thai Time:", thaiTime);

            const inputDate = new Date();
            const { utcToZonedTime } = require('date-fns-tz');
            const timeZone = 'Asia/Bangkok';
      
            const formattedDatenew = format(utcToZonedTime(inputDate, timeZone), 'dd/MM/yyyy HH:mm', { timeZone });
            // console.log("yyyy-MM-dd HH:mm",formattedDatenew);          
            // console.log("yyyy-MM-dd HH:mm",formattedDatenew);

            const resultList = {
              date: formattedDatenew, // Add the date property
              inspector: fullName[0], // Add the inspector property
              items: []
            };
            // Loop through each item in idList
            for (const data of idList) {
              // console.log("Examinename222: ", data);
              const currentItem = {
                id: data.id,
                name: data.name,
                examine: {}
              };
        
              // Loop through each examine in the examine property of the current item
              for (const examine of data.examine) {
                // console.log("Examine444: ", examine.name);
        
                try {
                  const getExaminelistIDQuery = "SELECT id FROM examinelist WHERE name = ? AND user_id = ?";
                  const [examinelistIDResult] = await db.query(getExaminelistIDQuery, [data.name ,res.id]);
                  // console.log("Examinelist ID: ", examinelistIDResult[0].id);
        
                  const getExamineNameQuery = "SELECT id FROM examine WHERE name = ? AND examinelist_id = ? ";
                  const [examineNameResult] = await db.query(getExamineNameQuery, [examine.name, examinelistIDResult[0].id ]);
                  // console.log("Examine ID: ", examineNameResult[0].id);
        
                  const dataChecklistQuery = `
                  SELECT 
                  checklist_examine.*, 
                  examinelist.name AS examinelist, 
                  examinename.name AS examine_name, 
                  examine.name AS examine,
                  users.name AS inspector_name,
                  users.lastname AS inspector_lastname
              FROM checklist_examine
              JOIN examinelist ON checklist_examine.examinelist_id = examinelist.id
              JOIN examinename ON checklist_examine.examinename_id = examinename.id
              JOIN examine ON checklist_examine.examine_id = examine.id
              JOIN users ON checklist_examine.inspector = users.id
              WHERE checklist_examine.date = ? 
                  AND checklist_examine.examine_id = ?  
                  AND checklist_examine.examinelist_id = ?;
              
                
                `;
                
                const [dataChecklistQueryResult] = await db.query(dataChecklistQuery, [formattedDate, examineNameResult[0].id, examinelistIDResult[0].id]);
               
                  // console.log("dataChecklistQueryResult: ", dataChecklistQueryResult,formattedDate, examineNameResult[0].id, examinelistIDResult[0].id);
        
                  for (const dataA of dataChecklistQueryResult) {
                    // console.log("Data Source: ", data.data_source);
                    // console.log("DATA: ", dataA);
                  
                      if (!currentItem.examine[examine.name]) {
                        currentItem.examine[examine.name] = [{ useEmployee: examine.useEmployee, itemA: [] }];
                      }
                      currentItem.examine[examine.name][0].itemA.push(dataA);
                    }
                    
                    // console.log("currentItem: ",currentItem)

                    // const seenEmployeeNameIds = new Set();

                for (const item of idList) {
                  // console.log("ITEMSSS: ", item.employee);

                  for (const emp of item.employee) {
                    const getExaminelistNameQuery = `
                      SELECT
                        checklist_employee.*,
                        employee.name AS name,
                        employee.lastname AS lastname,
                        employee.employee AS employee,
                        examinename.name AS examinename_name
                      FROM 
                        checklist_employee 
                      JOIN employee ON checklist_employee.employee_name_id = employee.id
                      JOIN examinename ON checklist_employee.examinename_id = examinename.id
                      WHERE 
                        checklist_employee.date = ?
                        AND checklist_employee.examine_id = ?
                        AND checklist_employee.employee_name_id = ? 
                        AND checklist_employee.examinelist_id = ?`;

                       
                      const [examinelistNameResult] = await db.query(getExaminelistNameQuery, [formattedDate,examineNameResult[0].id, emp.id, examinelistIDResult[0].id]);

                    
                    // console.log("examinelistNameResult: ", examinelistNameResult);

                    const employee = []
                    for (const dataB of examinelistNameResult) {
                      // console.log("Data Source: ", data.data_source);
                      // console.log("DATA: ", dataB);
                    
                      if (!currentItem.examine[examine.name]) {
                        currentItem.examine[examine.name] = [{ useEmployee: examine.useEmployee, itemA: [] }];
                      }
                      
                      const key = dataB.name + ' ' + dataB.lastname;
                      
                      if (!currentItem.examine[examine.name][0].itemA.some(item => JSON.stringify(item.key) === JSON.stringify(key))) {
                        currentItem.examine[examine.name][0].itemA.push({ key, itemB: [] });
                      }
                      
                      // Access the last added itemA and push dataB into its itemB array
                      const lastItemAIndex = currentItem.examine[examine.name][0].itemA.length - 1;
                      currentItem.examine[examine.name][0].itemA[lastItemAIndex].itemB.push(dataB);
                        }
                      
                    
                  }}

                
                } catch (error) {
                  console.error('Error executing query:', error);
                }
              }
              resultList.items.push(currentItem);

            }
        
            // Convert the dictionary values into an array
            // const resultList = Object.values(resultDict);
        
            // console.log("ResultList: ", resultList);
        
            return NextResponse.json({ success: true, dbData: resultList });
          } catch (error) {
            console.error('ErrorEditEx:', error);
            return NextResponse.json({ success: false, error: error.message });
          }
        }
        
        

        
        if (res.option_role_2_3) {
          try {
            const currentDate = new Date();
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1; // เพิ่ม 1 เนื่องจากมกราคมเริ่มที่ 0
            const year = currentDate.getFullYear();
            const formattedDateA = `${day}/${month}/${year}`;

            const idList = [];
            const resultDict = {};
            const fullName = [];

           
            const getUserIDQuery = "SELECT * FROM users WHERE id = ?";
            const [UserIDResult] = await db.query(getUserIDQuery, [res.id]);

            if (UserIDResult.length > 0 && UserIDResult[0].name && UserIDResult[0].lastname) {
              fullName.push(`${UserIDResult[0].name} ${UserIDResult[0].lastname}`) ;
              // console.log("USER: ", fullName);
            } else {
              console.error("User not found or missing name/lastname information.");
            }    

            const getIdQuery = "SELECT select_id FROM `select` WHERE date = ? AND user_id = ?";
            const [idResult] = await db.query(getIdQuery, [formattedDateA , res.id]);
            // const idResultmap = idResult.map(row => row.select_id);
            // console.log("4444idResult7: ",idResult)
            const selectIdString = idResult[0].select_id;

            const item_id = JSON.parse(selectIdString);
            
            // console.log("selectIdArray:",item_id);
    
            const nameList = [];
            // console.log("nameList4444: ",nameList)

            for (const item of item_id) {
              // console.log("nameList4444: ",ite)
          
              const getNameExamineListQuery = "SELECT name FROM examinelist WHERE id = ? AND user_id = ?";
              const [nameExamineListResult] = await db.query(getNameExamineListQuery, [item, res.id]);
          
              const nameExamineListResultmap = nameExamineListResult.map(row => row.name);
              nameList.push(nameExamineListResultmap);
              // console.log("nameList: ", nameList,nameExamineListResult);
            }

                  
            for (const name of nameList) {
              // console.log("NAME: ", name);
              const getExamineIDQuery = "SELECT id FROM examinelist WHERE name = ? AND user_id = ?";
              const [examineIDResult] = await db.query(getExamineIDQuery, [name , res.id]);
        

              if (examineIDResult.length > 0) {
                const getIDExamineListQuery = "SELECT * FROM examine WHERE examinelist_id = ? ";
                const [idExamineListResult] = await db.query(getIDExamineListQuery, [examineIDResult[0].id ]);
                // const idExamineListResultmap = idExamineListResult.map((row) => row.name);
                const idExamineListResultmap = idExamineListResult.map((row) => {
                  return {
                      name: row.name,
                      useEmployee: row.useEmployee,
                  };
              });
                const getEmployeeQuery = "SELECT * FROM employee WHERE examinelist_id  = ? ";
                const [employeeResult] = await db.query(getEmployeeQuery, [examineIDResult[0].id ]);
        
                idList.push({ id:examineIDResult[0].id ,name, employee: employeeResult,  examine: idExamineListResultmap });
              } else {
                console.error(`No id found for ${name}`);
              }
              // console.log("idListtt: ", idList);

            }
      
            // เพิ่มข้อมูลเวลา
            const hours = currentDate.getHours().toString().padStart(2, '0');
            const minutes = currentDate.getMinutes().toString().padStart(2, '0');

            const formattedDate= `${day}/${month}/${year}`;

            // console.log("Date and Time: ", formattedDate);

            const getQuery = "SELECT send_date FROM checklist_examine_row_2 WHERE date = ? AND r2_id = ?";
            const [Result] = await db.query(getQuery , [formattedDate , res.storedId]);
            // console.log("datee++++++++++++++++++: ",formattedDate , Result)
           
            const singleDateObject = Result[0].send_date;

            // แปลงให้เป็น JavaScript Date Object
            const options = { timeZone: 'Asia/Bangkok' };

            // ใช้ toLocaleString พร้อมกับ options เพื่อแปลงเวลาไปตามโซนที่กำหนด
            const formattedDateTime = dateObject.toLocaleString('en-US', options);
            

            // แปลงเป็นเวลาที่มีรูปแบบ Thai Time
            // const thaiTime = dateObject.toLocaleString("th-TH", options).replace(/(\d+)\/(\d+)\/(\d+),/, '$2/$1/$3,');

            // console.log("Thai Time:", thaiTime);

            const resultList = {
              date: formattedDateTime, // Add the date property
              inspector: fullName[0], // Add the inspector property
              items: []
            };
            // Loop through each item in idList
            for (const data of idList) {
              // console.log("Examinename222: ", data);
              const currentItem = {
                id: data.id,
                name: data.name,
                examine: {}
              };
        
              // Loop through each examine in the examine property of the current item
              for (const examine of data.examine) {
                // console.log("Examine444: ", examine.name);
        
                try {
                  const getExaminelistIDQuery = "SELECT id FROM examinelist WHERE name = ? AND user_id = ?";
                  const [examinelistIDResult] = await db.query(getExaminelistIDQuery, [data.name ,res.id]);
                  // console.log("Examinelist ID: ", examinelistIDResult[0].id);
        
                  const getExamineNameQuery = "SELECT id FROM examine WHERE name = ? AND examinelist_id = ? ";
                  const [examineNameResult] = await db.query(getExamineNameQuery, [examine.name, examinelistIDResult[0].id ]);
                  // console.log("Examine ID: ", examineNameResult[0].id);
        
                  const dataChecklistQuery = `
                  SELECT 
                  checklist_examine.*, 
                  examinelist.name AS examinelist, 
                  examinename.name AS examine_name, 
                  examine.name AS examine,
                  users.name AS inspector_name,
                  users.lastname AS inspector_lastname
              FROM checklist_examine
              JOIN examinelist ON checklist_examine.examinelist_id = examinelist.id
              JOIN examinename ON checklist_examine.examinename_id = examinename.id
              JOIN examine ON checklist_examine.examine_id = examine.id
              JOIN users ON checklist_examine.inspector = users.id
              WHERE checklist_examine.date = ? 
                  AND checklist_examine.examine_id = ?  
                  AND checklist_examine.examinelist_id = ?;
              
                
                `;
                
                const [dataChecklistQueryResult] = await db.query(dataChecklistQuery, [formattedDate, examineNameResult[0].id, examinelistIDResult[0].id]);
               
                  // console.log("dataChecklistQueryResult: ", dataChecklistQueryResult,formattedDate, examineNameResult[0].id, examinelistIDResult[0].id);
        
                  for (const dataA of dataChecklistQueryResult) {
                    // console.log("Data Source: ", data.data_source);
                    // console.log("DATA: ", dataA);
                  
                      if (!currentItem.examine[examine.name]) {
                        currentItem.examine[examine.name] = [{ useEmployee: examine.useEmployee, itemA: [] }];
                      }
                      currentItem.examine[examine.name][0].itemA.push(dataA);
                    }
                    
                    // console.log("currentItem: ",currentItem)

                    // const seenEmployeeNameIds = new Set();

                for (const item of idList) {
                  // console.log("ITEMSSS: ", item.employee);

                  for (const emp of item.employee) {
                    const getExaminelistNameQuery = `
                      SELECT
                        checklist_employee.*,
                        employee.name AS name,
                        employee.lastname AS lastname,
                        employee.employee AS employee,
                        examinename.name AS examinename_name
                      FROM 
                        checklist_employee 
                      JOIN employee ON checklist_employee.employee_name_id = employee.id
                      JOIN examinename ON checklist_employee.examinename_id = examinename.id
                      WHERE 
                        checklist_employee.date = ?
                        AND checklist_employee.examine_id = ?
                        AND checklist_employee.employee_name_id = ? 
                        AND checklist_employee.examinelist_id = ?`;

                       
                      const [examinelistNameResult] = await db.query(getExaminelistNameQuery, [formattedDate,examineNameResult[0].id, emp.id, examinelistIDResult[0].id]);

                    
                    // console.log("examinelistNameResult: ", examinelistNameResult);

                    const employee = []
                    for (const dataB of examinelistNameResult) {
                      // console.log("Data Source: ", data.data_source);
                      // console.log("DATA: ", dataB);
                    
                      if (!currentItem.examine[examine.name]) {
                        currentItem.examine[examine.name] = [{ useEmployee: examine.useEmployee, itemA: [] }];
                      }
                      
                      const key = dataB.name + ' ' + dataB.lastname;
                      
                      if (!currentItem.examine[examine.name][0].itemA.some(item => JSON.stringify(item.key) === JSON.stringify(key))) {
                        currentItem.examine[examine.name][0].itemA.push({ key, itemB: [] });
                      }
                      
                      // Access the last added itemA and push dataB into its itemB array
                      const lastItemAIndex = currentItem.examine[examine.name][0].itemA.length - 1;
                      currentItem.examine[examine.name][0].itemA[lastItemAIndex].itemB.push(dataB);
                        }
                      
                      // console.log("currentItem: ",currentItem)
  
                    // for (const data of examinelistNameResult) {
                    //   console.log("DATA: ", data);

                    //   if (!seenEmployeeNameIds.has(data.employee_name_id)) {
                    //     if (!currentItem.examine[examine]) {
                    //       currentItem.examine[examine] = [];
                    //     }
                      
                    //     if (!currentItem.examine[examine][data.examine_id]) {
                    //       currentItem.examine[examine][data.examine_id] = { items: [] };
                    //     }
                      
                    //     currentItem.examine[examine][data.examine_id].items.push(data);
                      
                    //     seenEmployeeNameIds.add(data.employee_name_id);
                    //   } else {
                    //     console.log(`employee_name_id ${data.employee_name_id} ซ้ำ`);
                    //   }
                      
                    // }
                //   }
                //   console.log("currentItem: ",currentItem)

                //   console.log("SSSSSSS: ", resultList);
                //   console.log("IDLIST: ",idList)
                // }
                  }}

                
                } catch (error) {
                  console.error('Error executing query:', error);
                }
              }
              resultList.items.push(currentItem);

            }
        
            // Convert the dictionary values into an array
            // const resultList = Object.values(resultDict);
        
            // console.log("ResultList: ", resultList);
        
            return NextResponse.json({ success: true, dbData: resultList });
          } catch (error) {
            console.error('ErrorEditEx:', error);
            return NextResponse.json({ success: false, error: error.message });
          }
        }
        return NextResponse.json({ success: true});
  } 
  catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}