import db from '../../../lib/db';
import { NextResponse } from 'next/server';
import { format } from 'date-fns';

export async function POST(request) {
  const fs = require('fs');
  if (request.method === 'POST') {
    
    const res = await request.json();
    try {
    console.log("RESS: ",res )

    if (res.fetch){
      const getQuery = "SELECT * FROM notify WHERE user_id = ?";
      const [Result] = await db.query(getQuery , [res.storedId]);

      for (const item of Result) {
        const inputDate = new Date(item.date);
        const formattedDate = format(inputDate, 'dd/MM/yyyy HH:mm');
        // console.log("Formatted Date:", formattedDate);
      
        item.formattedDate = formattedDate;
      }
      // console.log("Data_examine: ",Result)
      return NextResponse.json({ success: true ,dbnotify_name: Result});
    }

    if (res.edit) {
      try {
        const {data } = res;
  
        // console.log("RES_ROUTE_: ", res);
          const deleteExamineQuery = "DELETE FROM notify WHERE id = ?";
          await db.query(deleteExamineQuery, [res.todo.id]);
  
          const getQuery = "SELECT * FROM notify WHERE user_id = ?";
          const [Result] = await db.query(getQuery , [res.storedId]);
  
        for (const item of Result) {
          const inputDate = new Date(item.date);
          const formattedDate = format(inputDate, 'dd/MM/yyyy HH:mm');
        
          item.formattedDate = formattedDate;
        }
  
          return NextResponse.json({ success: true , message: 'delete successfully!' ,dbnotify_name: Result });
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
     }

    if (res.responseDetail) {
      try {

        const getQuery = 'SELECT * FROM notify WHERE id = ?';
        const [responseResult] = await db.query(getQuery ,[res.idValue]);

        for (const item of responseResult) {
          const inputDate = new Date(item.date);
          const formattedDate = format(inputDate, 'dd/MM/yyyy HH:mm');
          // console.log("Formatted Date:", formattedDate);
        
          // เพิ่มค่าที่ได้มาไว้ในค่าเดิม ตามที่ต้องการ
          item.formattedDate = formattedDate;
        }

        // console.log("rusultRoot: ",responseResult)
        return NextResponse.json({ success: true , message: 'successfully!' , responseResult: responseResult});
      } catch (error) {
        console.error('ErrorEditEx:', error);
        return NextResponse.json({ success: false, error: error.message });
      }
    }

    if (res.responseDetail_role_3) {
      try {

        const getQuery = "SELECT * FROM notify WHERE id = ?";
        const [responseResult] = await db.query(getQuery , [res.idValue]);

        for (const item of responseResult) {
          const inputDate = new Date(item.date);
          const formattedDate = format(inputDate, 'dd/MM/yyyy HH:mm');
          // console.log("Formatted Date:", formattedDate);
        
          // เพิ่มค่าที่ได้มาไว้ในค่าเดิม ตามที่ต้องการ
          item.formattedDate = formattedDate;
        }

        // console.log("rusultRoot: ",responseResult)

        return NextResponse.json({ success: true , message: 'successfully!' , responseResult: responseResult});
      } catch (error) {
        console.error('ErrorEditEx:', error);
        return NextResponse.json({ success: false, error: error.message });
      }
    }
    
    if (res.response_role_2) {
      try {
        const getQuery = "SELECT * FROM notify WHERE Verification_status = 1 AND role_2_id = ?";
        const [responseResult] = await db.query(getQuery,[res.storedId]);
    
        // ใช้ Promise.all ในการรอทุก Promise ในอาร์เรย์
        await Promise.all(responseResult.map(async (item) => {
          const inputDate = new Date(item.date);
          const formattedDate = format(inputDate, 'dd/MM/yyyy HH:mm');
          item.formattedDate = formattedDate;
        }));
    
        return NextResponse.json({ success: true, message: 'successfully!', responseResult: responseResult });
      } catch (error) {
        console.error('ErrorEditEx:', error);
        return NextResponse.json({ success: false, error: error.message });
      }
    }
    
    if (res.response_role_3) {
      try {
        const getQuery = "SELECT * FROM notify WHERE Verification_status = 2 AND role_3_id = ?";
        const [responseResult] = await db.query(getQuery ,[res.storedId]);
    
        // ใช้ Promise.all ในการรอทุก Promise ในอาร์เรย์
        await Promise.all(responseResult.map(async (item) => {
          const inputDate = new Date(item.date);
          const formattedDate = format(inputDate, 'dd/MM/yyyy HH:mm');
          item.formattedDate = formattedDate;
        }));
    
        return NextResponse.json({ success: true, message: 'successfully!', responseResult: responseResult });
      } catch (error) {
        console.error('ErrorEditEx:', error);
        return NextResponse.json({ success: false, error: error.message });
      }
    }    
    } catch (error) {
      console.error('Error notify:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}