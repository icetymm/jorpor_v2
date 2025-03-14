import db from '../../../lib/db';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();

    try {
      if (res.confirm) {
        // ตรวจสอบรหัสยืนยัน
        const { PIN_confirm, PIN, requestDataUser } = res;

        if (PIN_confirm === PIN) {
          const { name, last_name, email, position, employee, password } = requestDataUser;

          let insertSql;
          let tableName;

          // ตรวจสอบตำแหน่งงานและเลือกตารางที่เหมาะสม
          if (position === 'Safety Officer Supervisory level') {
            tableName = 'users';
          } else if (position === 'Safety Officer Technical level') {
            tableName = 'users_r2';
          } else if (position === 'Safety Officer Management level') {
            tableName = 'users_r3';
          } else if (position === 'Administrator') {
            tableName = 'role_admin';
          } else {
            return NextResponse.json({ success: false, error: 'Invalid position' });
          }

          // เตรียมคำสั่ง SQL
          insertSql = `
            INSERT INTO ${tableName} (name, lastname, email, position, employee, password, phone, line, picture)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          const insertValues = [name, last_name, email, position, employee, password, '', '', ''];

          // บันทึกข้อมูลลงในฐานข้อมูล
          const result = await db.query(insertSql, insertValues);

          if (result[0].affectedRows === 1) {
            const insertedId = result[0].insertId;
            return NextResponse.json({ success: true, id: insertedId, redirect: '/register' });
          } else {
            return NextResponse.json({ success: false, error: 'Failed to insert user data' });
          }
        } else {
          return NextResponse.json({ success: false, error: "Verification PIN doesn't match" });
        }
      } else {
        // ตรวจสอบอีเมลและพนักงานในทุกตาราง
        const { name, last_name, email, position, employee, password } = res;

        const checkQueries = [
          { query: 'SELECT COUNT(*) AS count FROM users WHERE email = ? OR employee = ?', table: 'users' },
          { query: 'SELECT COUNT(*) AS count FROM users_r2 WHERE email = ? OR employee = ?', table: 'users_r2' },
          { query: 'SELECT COUNT(*) AS count FROM users_r3 WHERE email = ? OR employee = ?', table: 'users_r3' },
          { query: 'SELECT COUNT(*) AS count FROM role_admin WHERE email = ? OR employee = ?', table: 'role_admin' },
        ];

        for (const check of checkQueries) {
          const [result] = await db.query(check.query, [email, employee]);
          if (result[0].count > 0) {
            return NextResponse.json({ success: false, error: `${check.table} already contains this email or employee` });
          }
        }

        // ส่งรหัสยืนยัน
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const confirmationCode = Math.floor(100000 + Math.random() * 900000);
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Confirmation Code for JorPor',
          html: `
            <p>สวัสดี ${name},</p>
            <p>โปรดยืนยันบัญชีของคุณ:</p>
            <p>รหัสยืนยัน: <strong>${confirmationCode}</strong></p>
            <p>ขอบคุณที่ใช้บริการ JorPor!</p>
          `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({
          success: true,
          message: 'Confirmation code sent. Please check your email.',
          PINconfirm: confirmationCode,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.json({ success: false, error: 'Invalid request method' });
  }
}

/*import db from '../../../lib/db';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request)  {
  if (request.method === 'POST') {
    const res = await request.json();

    if (res.confirm) {
      try {
        const {
          PIN_confirm,
          PIN,
        } = res;
  

      // console.log("JSON.DATA route: ", res);
      
      if (res.requestData.PIN_confirm === res.requestData.PIN) {
        // console.log("/////////////////////////////////");


        const insertSql = "INSERT INTO users_r3 (name, lastname, email, position, employee, password ,phone ,line ,picture) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const insertValues = [res.requestDataUser.name, res.requestDataUser.last_name, res.requestDataUser.email, res.requestDataUser.position, res.requestDataUser.employee, res.requestDataUser.password,'','',''];
        const result = await db.query(insertSql, insertValues);

        // console.log("result :",result);
        // console.log("result.affectedRows :",result[0].affectedRows);


        if (result[0].affectedRows === 1) {
          const insertedId = result.insertId;
          return NextResponse.json({ success: true, id: insertedId ,redirect: '/login'}, { res });

        } else {
          return NextResponse.json({ success: false, error: 'Failed to insert user data' }, { res });
        }
      } else {
        return NextResponse.json({ success: false, error: "verification don't match" });
      }
    }
  catch (error) {
      console.error('Error registering:', error);
      return NextResponse.json({ success: false, error: error.message }, { res });
    }
  } 

    try {
      const data = JSON.parse(res.data); 

      const {
        name,
        last_name,
        email,
        position,
        employee,
        password,
      } = data;

      // console.log("ress: ",data)

      const checkEmailQuery1 = "SELECT COUNT(*) AS emailCount FROM users WHERE email = ?";
      const [emailCountResult1] = await db.query(checkEmailQuery1, [data.email]);
      // console.log("emailCountResult1: ", emailCountResult1[0].emailCount);

      const checkemployeeQuery1 = "SELECT COUNT(*) AS employeeCount FROM users WHERE employee = ?";
      const [employeeCountResult1] = await db.query(checkemployeeQuery1, [data.employee]);
      // console.log("employeeCountResult1: ", employeeCountResult1[0].employeeCount);

      
      const checkEmailQuery2 = "SELECT COUNT(*) AS emailCount FROM users_r2 WHERE email = ?";
      const [emailCountResult2] = await db.query(checkEmailQuery2, [data.email]);
      // console.log("emailCountResult2: ", emailCountResult2[0].emailCount);

      const checkemployeeQuery2 = "SELECT COUNT(*) AS employeeCount FROM users_r2 WHERE employee = ?";
      const [employeeCountResult2] = await db.query(checkemployeeQuery2, [data.employee]);
      // console.log("employeeCountResult2: ", employeeCountResult2[0].employeeCount);

      
      const checkEmailQuery3 = "SELECT COUNT(*) AS emailCount FROM users_r3 WHERE email = ?";
      const [emailCountResult3] = await db.query(checkEmailQuery3, [data.email]);
      // console.log("emailCountResult3: ", emailCountResult3[0].emailCount);

      const checkemployeeQuery3 = "SELECT COUNT(*) AS employeeCount FROM users_r3 WHERE employee = ?";
      const [employeeCountResult3] = await db.query(checkemployeeQuery3, [data.employee]);
      // console.log("employeeCountResult3: ", employeeCountResult3[0].employeeCount);

      let userEmailTable = false;

      if (emailCountResult1[0].emailCount > 0) {
          userEmailTable = true;
      } else if (emailCountResult2[0].emailCount > 0) {
          userEmailTable = true;
      } else if (emailCountResult3[0].emailCount > 0) {
          userEmailTable = true;
      }

      // console.log("User comes from table:", userEmailTable);
// 
    

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


      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // สร้างรหัสยืนยันแบบสุ่ม 6 ตัว
      const confirmationCode = Math.floor(100000 + Math.random() * 900000);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: data.email,
        subject: 'ยืนยันการเปลี่ยนรหัสผ่าน',
        html: `
          <p>สวัสดี ${data.email},</p>
          <p>โปรดยืนยันบัญชี JorPor ของคุณ</p>
          <p>รหัสยืนยัน: ${confirmationCode}</p>
          <p>ขอบคุณที่ใช้บริการ JorPor!</p>
        `,
      };
      
      
      

      await transporter.sendMail(mailOptions);
      // console.log("EMAIL: ",data.email)
      // บันทึกรหัสยืนยันลงในฐานข้อมูล หรือส่งไปยังส่วนที่เกี่ยวข้องกับการยืนยัน

      return NextResponse.json({ success: true, message: 'The password has been sent to your email. Please confirm your password.', email: data.email ,PINconfirm: confirmationCode });
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการส่งอีเมล์:', error);
      return NextResponse.json({ success: false, error: 'Error sending email' }, { res });
    }

     
    } 

}*/