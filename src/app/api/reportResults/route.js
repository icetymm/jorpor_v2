import db from '../../../lib/db';
import { NextResponse } from 'next/server';


export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();

    try {
      const { fetchdata} = res;
      console.log("RES_ROUTE_examineRe88--------------: ", res);

  
      if (res.fetch) {



        const getdate_R2Query = "SELECT DISTINCT date FROM checklist_examine_row_2 WHERE inspector = ?";
        const [getdate_R2QueryResult] = await db.query(getdate_R2Query, [res.user_IdValue]);
      
        const getIdQuery = "SELECT select_id FROM `select` WHERE date = ? AND user_id = ?";
        const [idResult] = await db.query(getIdQuery, [res.dateValue , res.user_IdValue]);
        // const idResultmap = idResult.map(row => row.select_id);
        // console.log("4444idResult: ",idResultmap)
        const selectIdString = idResult[0].select_id;

        const item_id = JSON.parse(selectIdString);

        const nameList = [];
      
        for (const item of item_id) {
          // console.log("4444: ",item)
      
          const getNameExamineListQuery = "SELECT id,name FROM examinelist WHERE id = ? AND user_id = ?";
          const [nameExamineListResult] = await db.query(getNameExamineListQuery, [item, res.user_IdValue]);
      
          const nameExamineListResultmap = nameExamineListResult.map(row => row.name);
          nameList.push(...nameExamineListResult);
          console.log("nameList: ", nameList,nameExamineListResult);
        }
      
        return NextResponse.json({ success: true, dbnameExamineList: nameList, dbsentdate: getdate_R2QueryResult });
      }
      


        

    if (res.option) {
      try {

        // const getExamineIDQuery = "SELECT id FROM examinelist WHERE id = ? AND user_id = ?";
        // const [examineIDResult] = await db.query(getExamineIDQuery, [res.selectedOption , res.id]);

        // console.log("111: ",examineIDResult)
    
        const getIDExamineListQuery = "SELECT id,name FROM examine WHERE examinelist_id = ?";
        const [idExamineListResult] = await db.query(getIDExamineListQuery, [ res.selectedOption ]);

        // const idExamineListResultmap = idExamineListResult.map(row => row.name);

        // console.log("WWW: ",idExamineListResultmap)

        const getEmployeeQuery = "SELECT * FROM employee WHERE examinelist_id  = ?";
        const [employeeResult] = await db.query(getEmployeeQuery, [ idExamineListResult[0].id ]);

       
      
        return NextResponse.json({ success: true ,dbemployee_name: employeeResult ,dbExamine: idExamineListResult });
      } catch (error) {
        console.error('ErrorEditEx:', error);
        return NextResponse.json({ success: false, error: error.message });
      }

    }

    if (res.selectExamine) {
      const resultList = []

      try {
        // หา ID จากตาราง examine โดยใช้ชื่อที่มาจาก selectedOption
        
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // เพิ่ม 1 เนื่องจากมกราคมเริ่มที่ 0
        const year = currentDate.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        // console.log("Date: ",formattedDate)

        // const getExaminelistIDQuery = "SELECT id FROM examinelist WHERE name = ? AND user_id = ?";
        // const [examinelistIDResult] = await db.query(getExaminelistIDQuery, [res.selectedOption , res.id]);

        // console.log("000000000000000000: ",examinelistIDResult[0].id)
    
        // หาชื่อของ examinelist โดยใช้ ID จาก selectedExamineOption
        const getExamineNameQuery = "SELECT * FROM examine WHERE id = ? AND examinelist_id = ?";
        const [examineNameResult] = await db.query(getExamineNameQuery, [res.selectedExamineOption , res.selectedOption]);
        // console.log("1111111111111111111a: ",examineNameResult[0])

        if (examineNameResult[0].useEmployee === 'false') {
        if (examineNameResult.length > 0) {

          const dataChecklistQuery = `
          SELECT 
            checklist_examine.*, 
            examinename.name AS examinename, 
            examine.name AS examine, 
            users.name AS name, 
            users.lastname AS lastname
          FROM checklist_examine
          JOIN examinename ON checklist_examine.examinename_id = examinename.id
          JOIN examine ON checklist_examine.examine_id = examine.id
          JOIN users ON checklist_examine.inspector = users.id
          WHERE checklist_examine.date = ? AND checklist_examine.examine_id = ? AND checklist_examine.examinelist_id = ?;
        `;

        const [dataChecklistQueryResult] = await db.query(dataChecklistQuery ,[formattedDate , examineNameResult[0].id ,res.selectedOption])

        // console.log("listdata: ",dataChecklistQueryResult);
       
    
          return NextResponse.json({ success: true, dbData: dataChecklistQueryResult ,useEmployee: false});
        } else {
          return NextResponse.json({ success: false, error: "Examine not found" });
        } }
        if (examineNameResult[0].useEmployee === 'true') {
          const fullName = [];
           
            
          // console.log("examineNameResult.length: ",examineNameResult.length)
          if (examineNameResult.length > 0) {
            // const getZoneIDQuery = "SELECT id FROM examinelist WHERE id = ?";
            // const [ZoneIDResult] = await db.query(getZoneIDQuery, [res.selectedOption]);
            // console.log("Zone: ",ZoneIDResult[0].id);

            const getUserIDQuery = "SELECT * FROM employee WHERE users_id = ? AND examinelist_id = ?";
            const [UserIDResult] = await db.query(getUserIDQuery, [res.id , res.selectedOption]);
            // console.log("USER: ", UserIDResult);

            for (const user of UserIDResult) {
            const getUserNameQuery = "SELECT * FROM employee WHERE id = ?";
            const [UserNameResult] = await db.query(getUserNameQuery, [ user.id]);

            if (UserNameResult.length > 0 && UserNameResult[0].name && UserNameResult[0].lastname) {
              fullName.push(`${UserNameResult[0].name} ${UserNameResult[0].lastname}`) ;
              // console.log("USER1: ", fullName);
            } else {
              console.error("User not found or missing name/lastname information.");
            }  
          }

            // const getexamineIDQuery = "SELECT id FROM examine WHERE id = ? AND examinelist_id = ? ";
            // const [examineIDResult] = await db.query(getexamineIDQuery, [res.selectedExamineOption , res.selectedOption]);
            // console.log("examine: ", examineIDResult);
            
            // const getexaminenameIDQuery = "SELECT * FROM examinename WHERE examine_id = ?  ";
            // const [examinenameIDResult] = await db.query(getexaminenameIDQuery, [res.selectedExamineOption]);
            // console.log("examinename: ", examinenameIDResult);
           
            // examinenameIDResult.forEach(examinename => {
            //   idList.push({ id: examinename.id, name: examinename.name });
            // })
            // console.log("OORE: ",idList)
            let inspector = []
            const resultList = [];

            const seenEmployeeNameIds = new Set();


            for (const user of UserIDResult) {
              const getDATAIDQuery = `
              SELECT 
                  checklist_employee.*, 
                  e1.employee AS employee, 
                  e1.name AS employee_name, 
                  e1.lastname AS employee_lastname, 
                  examinename.name AS examinename_name
              FROM 
                  checklist_employee
                  INNER JOIN employee AS e1 ON checklist_employee.employee_name_id = e1.id
                  JOIN employee AS e2 ON checklist_employee.employee_name_id = e2.id
                  JOIN examinename ON checklist_employee.examinename_id = examinename.id
              WHERE 
                  checklist_employee.employee_name_id = ? AND checklist_employee.date = ?;
            `;
            
            const [DATAIDResult] = await db.query(getDATAIDQuery, [user.id, formattedDate]);
            
            // ดึง user id ที่ไม่ซ้ำ
            const uniqueUserIds = [...new Set(DATAIDResult.map(item => item.inspector))];

// ตรวจสอบว่า uniqueUserIds มีค่า
if (uniqueUserIds.length > 0) {
  // สร้างคำสั่ง SQL โดยใช้ IN
  const getinspectorIDQuery = `SELECT name, lastname FROM users WHERE id IN (${uniqueUserIds.map(() => '?').join(',')})`;
  
  // รัน query และส่ง uniqueUserIds เป็นพารามิเตอร์
  const [inspectorIDResult] = await db.query(getinspectorIDQuery, uniqueUserIds);

  // กำหนดผลลัพธ์ให้กับ inspector
  inspector = inspectorIDResult;
  console.log("Inspector Data: ", inspectorIDResult);
} else {
  console.log("No unique user IDs found.");
}

// ประมวลผล DATAIDResult
for (const data of DATAIDResult) {
  if (!seenEmployeeNameIds.has(data.employee_name_id)) {
    resultList.push({
      id_employee: data.employee_name_id,
      name: `${data.employee_name} ${data.employee_lastname}`,
      employee: data.employee,
      items: [DATAIDResult],
    });
    seenEmployeeNameIds.add(data.employee_name_id);
  } else {
    console.log(`employee_name_id ${data.employee_name_id} ซ้ำ`);
  }
}

              
            }

            // console.log("SSSSSSS: ", resultList);
            



//             const combinedQuery = `
//   SELECT
//     employee.*, 
//     checklist_employee.*, 
//     examinename.* 
//   FROM
//     employee
//     JOIN checklist_employee ON employee.id = checklist_employee.employee_name_id
//     JOIN examinelist ON employee.examinelist_id = examinelist.id
//     JOIN examine ON examinelist.id = examine.examinelist_id
//     JOIN examinename ON examine.id = examinename.examine_id
//   WHERE
//     employee.users_id = ? 
//     AND examinelist.name = ?
//     AND examine.name = ?
//     AND checklist_employee.date = ?;
// `;

// const [combinedResult] = await db.query(combinedQuery, [res.id, res.selectedOption, res.selectedExamineOption, formattedDate]);

// console.log("Combined Result: ", combinedResult);
           

            // if (UserIDResult.length > 0 && UserIDResult[0].name && UserIDResult[0].lastname) {
            //   fullName.push(`${UserIDResult[0].name} ${UserIDResult[0].lastname}`) ;
            //   console.log("USER: ", fullName);
            // } else {
            //   console.error("User not found or missing name/lastname information.");
            // }    
            

          //   const dataChecklistQuery = `
          //   SELECT 
          //     checklist_employee.*, 
          //     CONCAT(employee.name, ' ', employee.lastname) AS employee_name,           
          //     examinename.name AS examinename, 
          //     examine.name AS examine, 
          //     users.name AS name, 
          //     users.lastname AS lastname
          //   FROM checklist_employee
          //   JOIN employee ON checklist_employee.employee_name_id = employee.id
          //   JOIN examinename ON checklist_employee.examinename_id = examinename.id
          //   JOIN examine ON checklist_employee.examine_id = examine.id
          //   JOIN users ON checklist_employee.inspector = users.id
          //   WHERE checklist_employee.date = ? AND checklist_employee.examine_id = ? AND checklist_employee.examinelist_id = ?;
          // `;
  
          // const [dataChecklistQueryResult] = await db.query(dataChecklistQuery ,[formattedDate , examineNameResult[0].id ,examinelistIDResult[0].id])
  
          // // console.log("listdata: ",dataChecklistQueryResult);

          // // Loop ผลลัพธ์ที่ได้จากคำสั่ง SQL และเพิ่มเข้าไปใน array
          // dataChecklistQueryResult.forEach(result => {
          //   // เพิ่ม result ใน array
          //   resultList.push(result);
          // });
        
          // console.log("listdata: ", resultList);
        

            return NextResponse.json({ success: true, dbData: resultList ,useEmployee: true ,inspector: inspector});
          } else {
            return NextResponse.json({ success: false, error: "Examine not found" });
          }
        }
       } catch (error) {
        console.error('ErrorEditEx:', error);
        return NextResponse.json({ success: false, error: error.message });
      }
    }


  } 
  catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}