import { it } from 'node:test';
import db from '../../../lib/db';
import { NextResponse } from 'next/server';
import { format } from 'date-fns';


export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();

    try {
      const { fetchdata} = res;

      if (res.send) {

        for (const item of res.nameExamine.items) {

          Object.keys(item.examine).forEach(async (key , index) => {
            const data = item.examine[key][0];
            
            // console.log("res.data.examine: ", key, data.useEmployee);
            if (data.useEmployee === 'false') {

              for (const B of data.itemA){

                const insertValueQuery = `
                INSERT INTO checklist_examine_row_2 (date, examinename_id, status, details, inspector, examine_id, examinelist_id)
                VALUES (?,?,?,?,?,?,?);
                `;
                const insertValueQueryResult = await db.query(insertValueQuery, [B.date ,	B.examinename_id ,	B.status 	,	B.details 	,	B.inspector 	,	B.examine_id 	,	B.examinelist_id]);
  
              }

            } else if (data.useEmployee === 'true') {

              for (const B of data.itemA){
                for (const C of B.itemB){
                  const insertValueQuery = `
                    INSERT INTO checklist_employee_row_2 (date, employee_name_id, examinename_id, status, details, inspector, examine_id, examinelist_id)
                    VALUES (?,?,?,?,?,?,?,?);
                    `;
                  const insertValueQueryResult = await db.query(insertValueQuery, [C.date ,C.employee_name_id ,	C.examinename_id ,	C.status 	,	C.details 	,	C.inspector 	,	C.examine_id 	,	C.examinelist_id]);
  
                }
              }
         
            }
          })
        }

        
        return NextResponse.json({ success: true , message: 'The information has been sent successfully.' ,redirect: '/examineList' });
        
      }


      if (res.fetch_role_2) {
        try {
          const currentDate = new Date();
          const day = currentDate.getDate();
          const month = currentDate.getMonth() + 1; // Adding 1 because January starts at 0
          const year = currentDate.getFullYear();
          const formattedDate = `${day}/${month}/${year}`;

            const idList = [];
            const resultDict = {};
            const fullName = [];
           
            const getUserIDQuery = "SELECT * FROM users WHERE id = ?";
            const [UserIDResult] = await db.query(getUserIDQuery, [res.user_IdValue]);

            if (UserIDResult.length > 0 && UserIDResult[0].name && UserIDResult[0].lastname) {
              fullName.push(`${UserIDResult[0].name} ${UserIDResult[0].lastname}`) ;
            } else {
              console.error("User not found or missing name/lastname information.");
            }   

            const getdate_R2Query = "SELECT DISTINCT date FROM checklist_examine_row_2 WHERE inspector = ?";
            const [getdate_R2QueryResult] = await db.query(getdate_R2Query, [res.user_IdValue]);
          
            const getIdQuery = "SELECT select_id FROM `select` WHERE user_id = ? AND date = ?";
            const [idResult] = await db.query(getIdQuery, [res.user_IdValue , formattedDate]);
            const idResultmap = idResult.map(row => row.select_id);
            const selectIdString = idResult[0].select_id;

            const item_id = JSON.parse(selectIdString);

            const nameList = [];
          
            for (const item of item_id) {
          
              const getNameExamineListQuery = "SELECT name FROM examinelist WHERE id = ? AND user_id = ?";
              const [nameExamineListResult] = await db.query(getNameExamineListQuery, [item, res.user_IdValue]);
          
              const nameExamineListResultmap = nameExamineListResult.map(row => row.name);
              
              if (nameExamineListResultmap.length > 0) {
                nameList.push(nameExamineListResultmap);
              }
              // console.log("nameList: ", nameList,nameExamineListResult);
            }
          
                  
            for (const name of  nameList) {
              // console.log("NAME: ", name);
              const getExamineIDQuery = "SELECT id FROM examinelist WHERE name = ? AND user_id = ?";
              const [examineIDResult] = await db.query(getExamineIDQuery, [name , res.user_IdValue]);
        

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
        
           
         
        
            // console.log("Date: ", formattedDate);

            const getDateQuery = "SELECT DISTINCT send_date FROM checklist_examine_row_2 WHERE date = ? AND inspector = ?" ;        
            const [dateResult] = await db.query(getDateQuery, [formattedDate,res.user_IdValue]);
        
            
            // const currentDateStr = dateResult[0].send_date.toLocaleString('en-US', {  
            //   year: 'numeric', 
            //   month: '2-digit', 
            //   day: '2-digit', 
            //   hour: '2-digit', 
            //   minute: '2-digit', 
            //   hour12: false,
            //   timeZone: 'Asia/Bangkok'
            // });
            // console.log("Date777777777777777777: ",dateResult);
            const inputDate = new Date(dateResult[0].send_date);
            const formattedDatenew = format(inputDate, 'dd/MM/yyyy HH:mm');

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
                  const [examinelistIDResult] = await db.query(getExaminelistIDQuery, [data.name ,res.user_IdValue]);
                  // console.log("Examinelist ID: ", examinelistIDResult[0].id);
        
                  const getExamineNameQuery = "SELECT id FROM examine WHERE name = ? AND examinelist_id = ? ";
                  const [examineNameResult] = await db.query(getExamineNameQuery, [examine.name, examinelistIDResult[0].id ]);
                  // console.log("Examine ID: ", examineNameResult[0].id);
        
                  const dataChecklistQuery = `
                  SELECT 
                  checklist_examine_row_2.*, 
                  examinelist.name AS examinelist, 
                  examinename.name AS examine_name, 
                  examine.name AS examine,
                  users.name AS inspector_name,
                  users.lastname AS inspector_lastname
              FROM checklist_examine_row_2
              JOIN examinelist ON checklist_examine_row_2.examinelist_id = examinelist.id
              JOIN examinename ON checklist_examine_row_2.examinename_id = examinename.id
              JOIN examine ON checklist_examine_row_2.examine_id = examine.id
              JOIN users ON checklist_examine_row_2.inspector = users.id
              WHERE checklist_examine_row_2.date = ? 
                  AND checklist_examine_row_2.examine_id = ?  
                  AND checklist_examine_row_2.examinelist_id = ?;
              
                
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
                    // 
                    // console.log("currentItem: ",currentItem)

                    // const seenEmployeeNameIds = new Set();

                for (const item of idList) {
                  // console.log("ITEMSSS: ", item.employee);

                  for (const emp of item.employee) {
                    const getExaminelistNameQuery = `
                      SELECT
                        checklist_employee_row_2.*,
                        employee.name AS name,
                        employee.lastname AS lastname,
                        employee.employee AS employee,
                        examinename.name AS examinename_name
                      FROM 
                        checklist_employee_row_2
                      JOIN employee ON checklist_employee_row_2.employee_name_id = employee.id
                      JOIN examinename ON checklist_employee_row_2.examinename_id = examinename.id
                      WHERE 
                        checklist_employee_row_2.date = ?
                        AND checklist_employee_row_2.examine_id = ?
                        AND checklist_employee_row_2.employee_name_id = ? 
                        AND checklist_employee_row_2.examinelist_id = ?`;

                       
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

        if (res.fetch_role_3) {
          try {
            const currentDate = new Date();
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1; // Adding 1 because January starts at 0
            const year = currentDate.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
            // console.log("XXXXXXXXXXXXXXXXx")
  
              const idList = [];
              const resultDict = {};
              const fullName = [];
             
              const getUserIDQuery = "SELECT * FROM users WHERE id = ?";
              const [UserIDResult] = await db.query(getUserIDQuery, [res.user_IdValue]);
  
              
  
              if (UserIDResult.length > 0 && UserIDResult[0].name && UserIDResult[0].lastname) {
                fullName.push(`${UserIDResult[0].name} ${UserIDResult[0].lastname}`) ;
                // console.log("USER: ", fullName);
              } else {
                console.error("User not found or missing name/lastname information.");
              }   
  
              const getdate_R2Query = "SELECT DISTINCT date FROM checklist_examine_row_2 WHERE inspector = ?";
              const [getdate_R2QueryResult] = await db.query(getdate_R2Query, [res.user_IdValue]);
            
              const getIdQuery = "SELECT select_id FROM `select` WHERE user_id = ? AND date = ?";
              const [idResult] = await db.query(getIdQuery, [res.user_IdValue ,formattedDate]);
              // const idResultmap = idResult.map(row => row.select_id);
              const selectIdString = idResult[0].select_id;

              const item_id = JSON.parse(selectIdString);
              // console.log("4444idResult: ",item_id)
  
  
              const nameList = [];
            
              for (const item of item_id) {
                // console.log("4444: ",item)
            
                const getNameExamineListQuery = "SELECT name FROM examinelist WHERE id = ? AND user_id = ?";
                const [nameExamineListResult] = await db.query(getNameExamineListQuery, [item, res.user_IdValue]);
            
                const nameExamineListResultmap = nameExamineListResult.map(row => row.name);
                if (nameExamineListResultmap.length > 0) {
                  nameList.push(nameExamineListResultmap);
                }                
                // console.log("nameList: ", nameList,nameExamineListResult);
              }
            
  
              // console.log("EXAMINELISTTT: ", nameList)
  
                    
              for (const name of  nameList) {
                // console.log("NAME: ", name);
                const getExamineIDQuery = "SELECT id FROM examinelist WHERE name = ? AND user_id = ?";
                const [examineIDResult] = await db.query(getExamineIDQuery, [name , res.user_IdValue]);
          
  
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
          
             

          
              // console.log("Date: ", formattedDate);
  
              const getDateQuery = "SELECT DISTINCT send_date FROM checklist_examine_row_2 WHERE date = ? AND inspector = ?" ;        
              const [dateResult] = await db.query(getDateQuery, [formattedDate,res.user_IdValue]);
              // console.log("Date555555555555: ",dateResult[0].send_date);


              const inputDate = new Date(dateResult[0].send_date);
              const formattedDatenew = format(inputDate, 'dd/MM/yyyy HH:mm');
              // console.log("yyyy-MM-dd HH:mm",formattedDatenew);
          
              // const currentDateStr = dateResult[0].send_date.toLocaleString('en-US', { timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
              // console.log("Date777777777777777777: ",currentDateStr);
  
  
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
                    const [examinelistIDResult] = await db.query(getExaminelistIDQuery, [data.name ,res.user_IdValue]);
                    // console.log("Examinelist ID: ", examinelistIDResult[0].id);
          
                    const getExamineNameQuery = "SELECT id FROM examine WHERE name = ? AND examinelist_id = ? ";
                    const [examineNameResult] = await db.query(getExamineNameQuery, [examine.name, examinelistIDResult[0].id ]);
                    // console.log("Examine ID: ", examineNameResult[0].id);
          
                    const dataChecklistQuery = `
                    SELECT 
                    checklist_examine_row_2.*, 
                    examinelist.name AS examinelist, 
                    examinename.name AS examine_name, 
                    examine.name AS examine,
                    users.name AS inspector_name,
                    users.lastname AS inspector_lastname
                FROM checklist_examine_row_2
                JOIN examinelist ON checklist_examine_row_2.examinelist_id = examinelist.id
                JOIN examinename ON checklist_examine_row_2.examinename_id = examinename.id
                JOIN examine ON checklist_examine_row_2.examine_id = examine.id
                JOIN users ON checklist_examine_row_2.inspector = users.id
                WHERE checklist_examine_row_2.date = ? 
                    AND checklist_examine_row_2.examine_id = ?  
                    AND checklist_examine_row_2.examinelist_id = ?;
                
                  
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
                          checklist_employee_row_2.*,
                          employee.name AS name,
                          employee.lastname AS lastname,
                          employee.employee AS employee,
                          examinename.name AS examinename_name
                        FROM 
                          checklist_employee_row_2
                        JOIN employee ON checklist_employee_row_2.employee_name_id = employee.id
                        JOIN examinename ON checklist_employee_row_2.examinename_id = examinename.id
                        WHERE 
                          checklist_employee_row_2.date = ?
                          AND checklist_employee_row_2.examine_id = ?
                          AND checklist_employee_row_2.employee_name_id = ? 
                          AND checklist_employee_row_2.examinelist_id = ?`;
  
                         
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
        
        

        
    // if (res.selectExamine) {
    //   try {
    //     // หา ID จากตาราง examine โดยใช้ชื่อที่มาจาก selectedOption
        
    //     const currentDate = new Date();
    //     const day = currentDate.getDate();
    //     const month = currentDate.getMonth() + 1; // เพิ่ม 1 เนื่องจากมกราคมเริ่มที่ 0
    //     const year = currentDate.getFullYear();
    //     const formattedDate = `${day}/${month}/${year}`;

    //     console.log("Date: ",formattedDate)

    //     const getExaminelistIDQuery = "SELECT id FROM examinelist WHERE name = ?";
    //     const [examinelistIDResult] = await db.query(getExaminelistIDQuery, [res.selectedOption]);

    //     console.log("000000000000000000: ",examinelistIDResult[0].id)
    
    //     // หาชื่อของ examinelist โดยใช้ ID จาก selectedExamineOption
    //     const getExamineNameQuery = "SELECT id FROM examine WHERE name = ? AND examinelist_id = ?";
    //     const [examineNameResult] = await db.query(getExamineNameQuery, [res.selectedExamineOption , examinelistIDResult[0].id]);
    //     console.log("1111111111111111111: ",examineNameResult[0].id)

    //     if (examineNameResult.length > 0) {
    //       const dataChecklistQuery = `
    //       SELECT 
    //         checklist_examine.*, 
    //         examinename.name AS examinename, 
    //         examine.name AS examine, 
    //         users.name AS name, 
    //         users.lastname AS lastname
    //       FROM checklist_examine
    //       JOIN examinename ON checklist_examine.examinename_id = examinename.id
    //       JOIN examine ON checklist_examine.examine_id = examine.id
    //       JOIN users ON checklist_examine.inspector = users.id
    //       WHERE checklist_examine.date = ? AND checklist_examine.examine_id = ? AND checklist_examine.examinelist_id = ?;
    //     `;

    //     const [dataChecklistQueryResult] = await db.query(dataChecklistQuery ,[formattedDate , examineNameResult[0].id ,examinelistIDResult[0].id])

    //     console.log("listdata: ",dataChecklistQueryResult);
       
    
    //       return NextResponse.json({ success: true, dbData: dataChecklistQueryResult});
    //     } else {
    //       return NextResponse.json({ success: false, error: "Examine not found" });
    //     }
    //    } catch (error) {
    //     console.error('ErrorEditEx:', error);
    //     return NextResponse.json({ success: false, error: error.message });
    //   }
    // }


  } 
  catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}