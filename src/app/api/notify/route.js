import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  if (request.method === 'POST') {
    const formData = await request.formData();

    try {


      const file = formData.get('file');
      const fileBuffer = await file.arrayBuffer();
      // console.log("buffer: ",fileBuffer)
      // console.log("bufferfile: ",file)



      const {
        title,
        employee,
        location,
        work_owner,
        position,
        dateTime,
        detail,
        id,
      } = Object.fromEntries(formData);

      // console.log("Test: ",formData)

      const getQuery = "SELECT role_2_id FROM users WHERE employee = ? ";
      const [Result] = await db.query(getQuery , [employee]);

      const getRole3Query = "SELECT users_r3_id FROM users_r2 WHERE id = ? ";
      const [ResultRole3] = await db.query(getRole3Query , [Result[0].role_2_id]);

      // console.log

      const insertSql =
        "INSERT INTO notify (title, employee, location, work_owner, status, date, file, file_name, detail,user_id, Verification_status ,role_2_id,role_3_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const insertValues = [title, employee, location, work_owner, position, dateTime, fileBuffer, file.name, detail,id, 1 , Result[0].role_2_id ,ResultRole3[0].users_r3_id];
      const result = await db.execute(insertSql, insertValues);

      if (result[0].affectedRows === 1) {
        const insertedId = result[0].insertId;
        return NextResponse.json({ success: true, id: insertedId, message: 'Notification has been sent successfully.', redirect: '/response_role_1' });
      } else {
        return NextResponse.json({ success: false, error: 'Failed to insert notify data' });
      }
    } catch (error) {
      console.error('Error notify:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}



export async function GET(request) {
  if (request.method === 'GET') {
    try {
  
      const getQuery = "SELECT * FROM notify ";
      const [Result] = await db.query(getQuery);

      // console.log("Data_examine: ",Result)
      return NextResponse.json({ success: true ,dbnotify_name: Result});
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}
