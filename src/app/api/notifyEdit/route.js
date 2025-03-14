import db from '../../../lib/db';
import { NextResponse } from 'next/server';
import { format } from 'date-fns';

export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();
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
   
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}


