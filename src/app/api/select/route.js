import db from '../../../lib/db';
import { NextResponse } from 'next/server';


export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();
    try {
      const { examinelist_name, todo } = res;
      // console.log("RES_ROUTE_SELECTTTTT: ", res);

      if (res.fetch) {
        const getIdQuery = "SELECT select_id FROM `select` WHERE date = ? AND user_id = ?";
        const [idResult] = await db.query(getIdQuery, [res.formattedDate, res.storedUser_id]);
        const idResultmap = idResult.map(row => row.select_id)[0]; // Extract the string from the array

        return NextResponse.json({ success: true, idResultmap: idResultmap });
      }

      return NextResponse.json({ success: true });

    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}