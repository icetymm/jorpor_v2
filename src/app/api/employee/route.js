import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();
    try {
      const {data } = res;
      console.log("RES_ROUTE_employee: ", res);

      if (res.edit_role_1) {
        try {
         

          const deleteExamineQuery = "DELETE FROM employee WHERE employee = ?";
          await db.query(deleteExamineQuery, [res.employee]);

          // const getIDExamineListQuery = "SELECT id FROM examinelist WHERE name = ? AND user_id = ?";
          // const [idExamineListResult] = await db.query(getIDExamineListQuery, [ res.selectedOption , res.id ]);

          const getEmployeeQuery = "SELECT * FROM employee WHERE examinelist_id  = ?";
          const [employeeResult] = await db.query(getEmployeeQuery, [ res.selectedOption ]);

          const customSort = (a, b) => {
            const idA = isNaN(a.employee) ? a.employee : parseInt(a.employee, 10);
            const idB = isNaN(b.employee) ? b.employee : parseInt(b.employee, 10);
            return idA - idB;
          };

          const sortedEmployeeResult = employeeResult.sort(customSort);

        
          return NextResponse.json({ success: true , message: 'delete successfully!' ,dbemployee_name: sortedEmployeeResult});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.edit_role_2) {
        try {
         

          const deleteExamineQuery = "DELETE FROM users WHERE employee = ?";
          await db.query(deleteExamineQuery, [res.employee]);

        
          const getEmployeeQuery = "SELECT * FROM users WHERE role_2_id  = ?";
          const [employeeResult] = await db.query(getEmployeeQuery, [ res.id ]);



          const customSort = (a, b) => {
            const idA = isNaN(a.employee) ? a.employee : parseInt(a.employee, 10);
            const idB = isNaN(b.employee) ? b.employee : parseInt(b.employee, 10);
            return idA - idB;
          };

          const sortedEmployeeResult = employeeResult.sort(customSort);
        
          return NextResponse.json({ success: true , message: 'delete successfully!' ,dbemployee_name: sortedEmployeeResult});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.fetch_role_3) {
        try {

          const getEmployeeQuery = "SELECT * FROM users_r2 WHERE users_r3_id  = ?";
          const [employeeResult] = await db.query(getEmployeeQuery, [ res.storedId ]);
          console.log('Employee Result:', employeeResult);


          const customSort = (a, b) => {
            const idA = isNaN(a.employee) ? a.employee : parseInt(a.employee, 10);
            const idB = isNaN(b.employee) ? b.employee : parseInt(b.employee, 10);
            return idA - idB;
          };

          const sortedEmployeeResult = employeeResult.sort(customSort);

         //สร้าง Flex Message จากข้อมูลที่ได้
          const flexMessage_role3 = createEmployeeFlexMessage(sortedEmployeeResult);
          console.log('Flex Message:', flexMessage_role3);
          await sendFlexMessageToLine(flexMessage_role3, res.lineUserId);  // res.lineUserId คือ User ID ของผู้รับใน LINE




          return NextResponse.json({ success: true ,dbemployee_name: sortedEmployeeResult, flexMessage: flexMessage_role3});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.add) {
        try {
          console.log("REA: ",res)

          const checkemployeeQuery1 = "SELECT COUNT(*) AS employeeCount FROM employee WHERE employee = ?";
          const [employeeCountResult1] = await db.query(checkemployeeQuery1, [res.employee]);

          if (employeeCountResult1[0].employeeCount > 0) {
            return NextResponse.json({ success: false, error: `${res.employee} is already in use.` });
          } else {

          // const getIDExamineListQuery = "SELECT id FROM examinelist WHERE name = ?";
          // const [idExamineListResult] = await db.query(getIDExamineListQuery, [ res.selectedOption ]);

          const insertSql = `INSERT INTO employee ( employee, name, lastname ,examinelist_id ,users_id ) VALUES (?,?,?,?,?)`;
          const insertValues = [res.employee ,res.name , res.lastname ,res.selectedOption, res.id];
          await db.query(insertSql, insertValues);


          const getEmployeeQuery = "SELECT * FROM employee WHERE examinelist_id  = ?";
          const [employeeResult] = await db.query(getEmployeeQuery, [res.selectedOption]);

          const customSort = (a, b) => {
            const idA = isNaN(a.employee) ? a.employee : parseInt(a.employee, 10);
            const idB = isNaN(b.employee) ? b.employee : parseInt(b.employee, 10);
            return idA - idB;
          };

          const sortedEmployeeResult = employeeResult.sort(customSort);
        
          return NextResponse.json({ success: true, message: ` employee ${res.employee} created successfully` ,dbemployee: sortedEmployeeResult});
        }} catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message , message: ` employee ${res.employee} created failed`  });
        }
      }

      if (res.fetch_role_3) {
        try {

         

          const getEmployeeQuery = "SELECT * FROM users_r2 WHERE users_r3_id  = ?";
          const [employeeResult] = await db.query(getEmployeeQuery, [ res.storedId ]);


          const customSort = (a, b) => {
            const idA = isNaN(a.employee) ? a.employee : parseInt(a.employee, 10);
            const idB = isNaN(b.employee) ? b.employee : parseInt(b.employee, 10);
            return idA - idB;
          };

          const sortedEmployeeResult = employeeResult.sort(customSort);
        
        
          return NextResponse.json({ success: true ,dbemployee_name: sortedEmployeeResult});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }
//******************************** */
      if (res.fetch_role_2) {
        try {

          const getEmployeeQuery = "SELECT * FROM users WHERE role_2_id  = ?";
          const [employeeResult] = await db.query(getEmployeeQuery, [ res.storedId ]);


          const customSort = (a, b) => {
            const idA = isNaN(a.employee) ? a.employee : parseInt(a.employee, 10);
            const idB = isNaN(b.employee) ? b.employee : parseInt(b.employee, 10);
            return idA - idB;
          };

          const sortedEmployeeResult = employeeResult.sort(customSort);
        
          //*****สร้าง Flex Message จากข้อมูลที่ได้****
          const flexMessage_role2 = createEmployeeFlexMessage(sortedEmployeeResult);
          console.log('Flex Message:', flexMessage_role2);
          await sendFlexMessageToLine(flexMessage_role2, res.lineUserId);  // res.lineUserId คือ User ID ของผู้รับใน LINE


          return NextResponse.json({ success: true ,dbemployee_name: sortedEmployeeResult, flexMessage: flexMessage_role2});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }
//************************ */
      if (res.fetch_role_2) {
        try {

          const getEmployeeQuery = "SELECT * FROM users WHERE role_2_id  = ?";
          const [employeeResult] = await db.query(getEmployeeQuery, [ res.storedId ]);


          const customSort = (a, b) => {
            const idA = isNaN(a.employee) ? a.employee : parseInt(a.employee, 10);
            const idB = isNaN(b.employee) ? b.employee : parseInt(b.employee, 10);
            return idA - idB;
          };

          const sortedEmployeeResult = employeeResult.sort(customSort);
        

          return NextResponse.json({ success: true ,dbemployee_name: sortedEmployeeResult});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }


     if (res.fetch) {
        try {
          // const getIDExamineListQuery = "SELECT id FROM examinelist WHERE id = ?";
          // const [idExamineListResult] = await db.query(getIDExamineListQuery, [res.selectedOption]);

          const getEmployeeQuery = "SELECT * FROM employee WHERE examinelist_id  = ?";
          const [employeeResult] = await db.query(getEmployeeQuery, [res.selectedOption]);

          // Custom sorting function for alphanumeric ids
          const customSort = (a, b) => {
            const idA = isNaN(a.employee) ? a.employee : parseInt(a.employee, 10);
            const idB = isNaN(b.employee) ? b.employee : parseInt(b.employee, 10);
            return idA - idB;
          };

          // Sort the array based on the custom sorting function
          const sortedEmployeeResult = employeeResult.sort(customSort);
          // console.log("sortedEmployeeResult: ",sortedEmployeeResult,res.selectedOption)

          return NextResponse.json({ success: true, dbemployee_name: sortedEmployeeResult });
        } catch (error) {
          // console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.add_role_2) {
        try {
        
          const checkEmailQuery1 = "SELECT COUNT(*) AS emailCount FROM users WHERE email = ?";
          const [emailCountResult1] = await db.query(checkEmailQuery1, [res.email]);
    
          const checkemployeeQuery1 = "SELECT COUNT(*) AS employeeCount FROM users WHERE employee = ?";
          const [employeeCountResult1] = await db.query(checkemployeeQuery1, [res.employee]);
    
          
          const checkEmailQuery2 = "SELECT COUNT(*) AS emailCount FROM users_r2 WHERE email = ?";
          const [emailCountResult2] = await db.query(checkEmailQuery2, [res.email]);
    
          const checkemployeeQuery2 = "SELECT COUNT(*) AS employeeCount FROM users_r2 WHERE employee = ?";
          const [employeeCountResult2] = await db.query(checkemployeeQuery2, [res.employee]);
    
          
          const checkEmailQuery3 = "SELECT COUNT(*) AS emailCount FROM users_r3 WHERE email = ?";
          const [emailCountResult3] = await db.query(checkEmailQuery3, [res.email]);
    
          const checkemployeeQuery3 = "SELECT COUNT(*) AS employeeCount FROM users_r3 WHERE employee = ?";
          const [employeeCountResult3] = await db.query(checkemployeeQuery3, [res.employee]);
    
          let userEmailTable = false;
    
          if (emailCountResult1[0].emailCount > 0) {
              userEmailTable = true;
          } else if (emailCountResult2[0].emailCount > 0) {
              userEmailTable = true;
          } else if (emailCountResult3[0].emailCount > 0) {
              userEmailTable = true;
          }
    
    
        
    
          let userEmployeeTable = false;
    
          if (employeeCountResult1[0].employeeCount > 0) {
            userEmployeeTable = true;
          } else if (employeeCountResult2[0].employeeCount > 0) {
            userEmployeeTable = true;
          } else if (employeeCountResult3[0].employeeCount > 0) {
            userEmployeeTable = true;
          }
    
          // console.log("User comes from table:", userEmployeeTable);
    
        
    
    
          if (userEmailTable) {
            return NextResponse.json({ success: false, error: 'Email is already in use.' }, { res });
          } else if (userEmployeeTable) {
            return NextResponse.json({ success: false, error: 'Employee is already in use.' }, { res });
          }

          const insertSql = `INSERT INTO users ( position ,employee, name ,	lastname ,password, role_2_id ,phone ,line ,picture,email) VALUES ('Safety Officer Supervisory level',?,?,?,?,?,?,?,?,?)`;
          const insertValues = await db.query(insertSql,[res.employee ,res.name , res.lastname , res.password , res.id ,'','','','']);
        

          const getEmployeeQuery = "SELECT * FROM users WHERE role_2_id  = ?";
          const [employeeResult] = await db.query(getEmployeeQuery, [ res.id ]);


          const customSort = (a, b) => {
            const idA = isNaN(a.employee) ? a.employee : parseInt(a.employee, 10);
            const idB = isNaN(b.employee) ? b.employee : parseInt(b.employee, 10);
            return idA - idB;
          };

          const sortedEmployeeResult = employeeResult.sort(customSort);
        

          return NextResponse.json({ success: true, message: ` employee ${res.employee} created successfully` ,dbemployee: sortedEmployeeResult});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.add_role_3) {
        try {
          const checkEmailQuery1 = "SELECT COUNT(*) AS emailCount FROM users WHERE email = ?";
          const [emailCountResult1] = await db.query(checkEmailQuery1, [res.email]);
    
          const checkemployeeQuery1 = "SELECT COUNT(*) AS employeeCount FROM users WHERE employee = ?";
          const [employeeCountResult1] = await db.query(checkemployeeQuery1, [res.employee]);
    
          
          const checkEmailQuery2 = "SELECT COUNT(*) AS emailCount FROM users_r2 WHERE email = ?";
          const [emailCountResult2] = await db.query(checkEmailQuery2, [res.email]);
    
          const checkemployeeQuery2 = "SELECT COUNT(*) AS employeeCount FROM users_r2 WHERE employee = ?";
          const [employeeCountResult2] = await db.query(checkemployeeQuery2, [res.employee]);
    
          
          const checkEmailQuery3 = "SELECT COUNT(*) AS emailCount FROM users_r3 WHERE email = ?";
          const [emailCountResult3] = await db.query(checkEmailQuery3, [res.email]);
    
          const checkemployeeQuery3 = "SELECT COUNT(*) AS employeeCount FROM users_r3 WHERE employee = ?";
          const [employeeCountResult3] = await db.query(checkemployeeQuery3, [res.employee]);
    
          let userEmailTable = false;
    
          if (emailCountResult1[0].emailCount > 0) {
              userEmailTable = true;
          } else if (emailCountResult2[0].emailCount > 0) {
              userEmailTable = true;
          } else if (emailCountResult3[0].emailCount > 0) {
              userEmailTable = true;
          }
    
    
        
    
          let userEmployeeTable = false;
    
          if (employeeCountResult1[0].employeeCount > 0) {
            userEmployeeTable = true;
          } else if (employeeCountResult2[0].employeeCount > 0) {
            userEmployeeTable = true;
          } else if (employeeCountResult3[0].employeeCount > 0) {
            userEmployeeTable = true;
          }
    
    
        
    
    
          if (userEmailTable) {
            return NextResponse.json({ success: false, error: 'Email is already in use.' }, { res });
          } else if (userEmployeeTable) {
            return NextResponse.json({ success: false, error: 'Employee is already in use.' }, { res });
          }

          const insertSql = `INSERT INTO users_r2 ( position , employee, name ,	lastname ,password, users_r3_id  ,phone ,line ,picture,email) VALUES ('Safety Officer Technical level',?,?,?,?,?,?,?,?,?)`;
          const insertValues = await db.query(insertSql,[res.employee ,res.name , res.lastname , res.password , res.id,'','','','']);
        
          const getEmployeeQuery = "SELECT * FROM users_r2 WHERE users_r3_id  = ?";
          const [employeeResult] = await db.query(getEmployeeQuery, [ res.id ]);


          const customSort = (a, b) => {
            const idA = isNaN(a.employee) ? a.employee : parseInt(a.employee, 10);
            const idB = isNaN(b.employee) ? b.employee : parseInt(b.employee, 10);
            return idA - idB;
          };

          const sortedEmployeeResult = employeeResult.sort(customSort);

          return NextResponse.json({ success: true, message: ` employee ${res.employee} created successfully` ,dbemployee: sortedEmployeeResult});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.zone) {
 
      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1; 
      const year = currentDate.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;

      const getIdQuery = "SELECT select_id FROM `select` WHERE date = ? AND user_id = ?";
      const [idResult] = await db.query(getIdQuery, [formattedDate ,res.storedId]);
      const idResultmap = idResult.map(row => row.select_id)[0]; // Extract the string from the array
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
       
        // console.log("RESULTTTT------: ",item_id)
     

        if (idResultmap === undefined){
          const getIdnameQuery = "SELECT id,name FROM examinelist WHERE user_id = ?";
          const [idnameResult] = await db.query(getIdnameQuery, [res.storedId]);
          const idnameResultmap = idnameResult.map(row => ({ id: row.id, name: row.name })); // Extract the string from the array
          return NextResponse.json({ success: true, dbnameExamineList: idnameResultmap});
        } else {
         

      const nameList = [];
      let flattenedNameList = []
    
      for (const item of item_id) {
        // console.log("4444: ",item)
    
        const getNameExamineListQuery = "SELECT id,name FROM examinelist WHERE id = ? AND user_id = ?";
        const [nameExamineListResult] = await db.query(getNameExamineListQuery, [item, res.storedId]);
    
        const nameExamineListResultmap = nameExamineListResult.map(row => ({ id: row.id, name: row.name }));
        nameList.push(nameExamineListResultmap[0]);
        // console.log("nameList: ", nameList);
        // flattenedNameList = nameList.flatMap(zone => zone.map(item => item.name));
      }
        return NextResponse.json({ success: true, dbnameExamineList: nameList});

     
    }
        
      }

      return NextResponse.json({ success: true});

    } catch (error) {
      // console.error('Error:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
    
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}



export async function GET(request) {
  if (request.method === 'GET') {
    try {
  

      const getEmployeeQuery = "SELECT * FROM employee ";
      const [employeeResult] = await db.query(getEmployeeQuery);



      return NextResponse.json({ success: true ,dbemployee_name: employeeResult});
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}
