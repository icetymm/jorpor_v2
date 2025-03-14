
import db from '../../../lib/db';
import { NextResponse } from 'next/server';
// import multer from 'multer';

// const storage = multer.memoryStorage(); // ใช้ memory storage สำหรับเก็บไฟล์ในระหว่างการประมวลผล
// const upload = multer({ storage });

export async function POST(request) {
  if (request.method === 'POST') {
      const res = await request.json();
    
    try {
      const {
        employee,
        name,
        lastname,
        position,
        phone,
        line,
        email
      } = res;
      // console.log("RES.Route profile: ", res);

    
      const getUserQuery = "SELECT * FROM users WHERE employee = ?";
      const [userResult] = await db.query(getUserQuery, [employee]);

      // console.log("userResult: ",userResult)
      if (userResult) {
        if (res.edit) {
          const updateQuery = `
            UPDATE users
            SET
              name = ?,
              lastname = ?,
              position = ?,
              phone = ?,
              line = ?,
              email = ?
            WHERE
              employee = ?
          `;
  
          const updatedUserResult = await db.query(updateQuery, [
            name,
            lastname,
            position,
            phone,
            line,
            email,
            employee,
          ]);
  
          if (updatedUserResult.affectedRows > 0) {
            // อัปเดตข้อมูลสำเร็จ
            // ส่งข้อมูลผู้ใช้งานที่อัปเดตแล้วกลับไปยัง client
            const updatedUserQuery = "SELECT * FROM users WHERE employee = ?";
            const [updatedUser] = await db.query(updatedUserQuery, [employee]);
            
            return NextResponse.json({
              success: true,
              message: 'User updated successfully',
              profile: updatedUser,
            });
          } else {
            return NextResponse.json({
              success: false,
              message: 'User update failed',
            });
          }
        } else {
          // ไม่มีการเปลี่ยนแปลง ส่งข้อมูลผู้ใช้งานกลับไปยัง client
          return NextResponse.json({ success: true,  message: 'No changes detected', profile: userResult,
          });
        }
      } else {
        // ถ้าไม่พบข้อมูลผู้ใช้งาน
        return NextResponse.json({ success: false, message: 'User not found' });
      }
    } catch (error) {
      // console.error('Error Profile:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  } 
}