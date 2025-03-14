import db from '../../../lib/db';
import { NextResponse } from 'next/server';


export async function POST(request) {
    if (request.method === 'POST') {
      const res = await request.json();
      try {
        
        console.log("RES_ROUTE_employee williamEat: ", res.position);

        const checkemployeeQuery1 = "SELECT * FROM users WHERE position = ? AND employee = ?";
      const [employeeResult1] = await db.query(checkemployeeQuery1, [res.position, res.employee]);

      const checkemployeeQuery2 = "SELECT * FROM users_r2 WHERE position = ? AND employee = ?";
      const [employeeResult2] = await db.query(checkemployeeQuery2, [res.position, res.employee]);

      const checkemployeeQuery3 = "SELECT * FROM users_r3 WHERE position = ? AND employee = ?";
      const [employeeResult3] = await db.query(checkemployeeQuery3, [res.position, res.employee]);

      let userEmployeeTable = false;
      let foundInTable = '';
      let Est = null;

      // ตรวจสอบว่าพบข้อมูลในตารางไหน และเลือกเฉพาะคอลัมน์ที่ต้องการ
      if (employeeResult1.length > 0) {
        foundInTable = 'users';
        userEmployeeTable = true;
        Est = employeeResult1[0];
      } else if (employeeResult2.length > 0) {
        foundInTable = 'users_r2';
        userEmployeeTable = true;
        Est = employeeResult2[0];
      } else if (employeeResult3.length > 0) {
        foundInTable = 'users_r3';
        userEmployeeTable = true;
        Est = employeeResult3[0];
      }
        console.log('Employee result from users table:', employeeResult1);
        console.log('Employee result from users_r2 table:', employeeResult2);
        console.log('Employee result from users_r3 table:', employeeResult3);

      const data = Est

      //ส่งข้อมูลเฉพาะคอลัมน์ที่เลือกกลับไปยัง Frontend
      if (employeeResult1.length > 0) {
        return NextResponse.json({
          success: true,
          message: 'success',
          data,
          redirect:  '/employee_role_1_copy', // ส่ง URL ให้ client
          
        });
      } else if (employeeResult2.length > 0) {
        return NextResponse.json({
          success: true,
          message: 'success',
          data,
          redirect: '/employee_role_2_copy', // ส่ง URL ให้ client
         
        });
      } else if (employeeResult3.length > 0) {
        return NextResponse.json({
          success: true,
          message: 'success',
          data,
          redirect: '/employee_role_3_copy', // ส่ง URL ให้ client
         
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "No matching employee found."
        });
      }

    } catch (error) {
        // console.error('Error:', error);
        return NextResponse.json({ success: false, error: error.message });
      }
      
    } else {
      return NextResponse.error('Method Not Allowed');
    }
  }