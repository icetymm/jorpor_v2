import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();
    try {
      const {datasend } = res;
     
      if (res.checkbox) {
        try {
          const getnameQuery = "SELECT * FROM examinename WHERE examine_id = ?";
          const [nameResult] = await db.query(getnameQuery, [res.examine_Id]);
          const names = nameResult.map(item => item.name);
          
          const currentDate = new Date();
          const day = currentDate.getDate();
          const month = currentDate.getMonth() + 1; 
          const year = currentDate.getFullYear();
          const formattedDate = `${day}/${month}/${year}`;

          const IdChecklistname = [];

          for (const name of names) {
            const nameData = res.todoStatus[name];

            const getname_idQuery = "SELECT id FROM examinename WHERE name = ?";
            const [name_idResult] = await db.query(getname_idQuery, [nameData.name]);

            IdChecklistname.push(name_idResult[0].id);
          }


          const getuser_idQuery = "SELECT id FROM users WHERE id = ?";
          const [user_idResult] = await db.query(getuser_idQuery, [res.id]);

          const getemployeeQuery = "SELECT id FROM employee WHERE employee = ?";
          const [employeeResult] = await db.query(getemployeeQuery, [res.employee_Id]);



          for (const examinename_id of IdChecklistname) {
            const name = names[IdChecklistname.indexOf(examinename_id)]; 
            const nameData = res.todoStatus[name];
           
            const existingRecordQuery = "SELECT id FROM checklist_employee WHERE employee_name_id = ? AND examinename_id = ? AND date = ?";
            const [existingRecordResult] = await db.query(existingRecordQuery, [employeeResult[0].id, examinename_id, formattedDate]);

            if (existingRecordResult.length > 0) {
              for (const record of existingRecordResult) {
                const deleteSql = 'DELETE FROM checklist_employee WHERE id = ?';
                await db.query(deleteSql, [record.id]);
              }
            }

            const insertSql = 'INSERT INTO checklist_employee ( date, employee_name_id, examinename_id, status, details, inspector, examine_id, examinelist_id ) VALUES (?,?,?,?,?,?,?,?)';
            const insertValues = [formattedDate,employeeResult[0].id, examinename_id, nameData.status, nameData.details, user_idResult[0].id, res.examine_Id, res.examinelist_Id];
            await db.query(insertSql, insertValues);
          }
          
          const getexamine_IdQuery = "SELECT name FROM examine WHERE id = ?";
          const [examine_IdResult] = await db.query(getexamine_IdQuery, [res.examine_Id]);

          return NextResponse.json({ success: true , message: "successfully!" ,redirect: `/checklistExamine?checklistname=${examine_IdResult[0].name}&examinelistId=${res.examinelist_Id}&examineId=${res.examine_Id}&examinelist_name=${res.examinelist_name}`});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }
      
      const checkExamineQuery =  `SELECT name FROM examinename WHERE  examine_id  = ?  `;
      const [examineResult] = await db.query(checkExamineQuery ,[res.examine_IdValue]);

      const examineResultmap = examineResult.map(row => row.name);
      return NextResponse.json({ success: true, message: "successfully" ,dbchecklist: examineResultmap});
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
    
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}



