import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const fs = require('fs');
  if (request.method === 'POST') {
    
    const res = await request.json();
    try {
// console.log("RESS11: ",res)

if (res.submit_role_3) {
  try {
    const updateQuery = `
      UPDATE notify
      SET Verification_status = 3
      WHERE id = ?`;

    const [responseResult] = await db.query(updateQuery, [res.id]);

    // console.log("Result: ", responseResult);

    if (responseResult.affectedRows > 0) {
      // console.log("Update pass");
// 
      // อัปเดตข้อมูลสำเร็จ
      return NextResponse.json({ success: true, message: 'Successfully updated!', redirect: '/response_role_3' });
    } else {
      return NextResponse.json({ success: false, message: 'Update failed - No rows affected' });
    }
  } catch (error) {
    console.error('Error during update:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

    if (res.submit_role_2) {
      try {
        const updateQuery = `
          UPDATE notify
          SET Verification_status = 2
          WHERE id = ?`;
    
        const [responseResult] = await db.query(updateQuery, [res.id]);
    
        // console.log("Result: ", responseResult);
    
        if (responseResult.affectedRows > 0) {
          // console.log("Update pass");
    
          // อัปเดตข้อมูลสำเร็จ
          return NextResponse.json({ success: true, message: 'Successfully updated!', redirect: '/response_role_2' });
        } else {
          return NextResponse.json({ success: false, message: 'Update failed - No rows affected' });
        }
      } catch (error) {
        console.error('Error during update:', error);
        return NextResponse.json({ success: false, error: error.message });
      }
    }
    

    return NextResponse.json({ success: true });

    } catch (error) {
      console.error('Error notify:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}


