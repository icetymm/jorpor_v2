import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();
    try {
      const {data } = res;
      // console.log("RES_ROUTE_employee22222: ", res);
      // console.log("RES_ROUTE_employeeinput: ", res.input);


      if (res.fetch_role_2) {
        try {

         

          const getEmployeeQuery = "SELECT * FROM users WHERE role_2_id  = ?";
          const [employeeResult] = await db.query(getEmployeeQuery, [ res.storedId ]);

          // console.log("employeeResult: ",employeeResult);

        
          return NextResponse.json({ success: true ,dbemployee_name: employeeResult});
        } catch (error) {
          // console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.add) {
        try {
          // console.log("22222555555")

          const insertSql = `INSERT INTO users ( employee, name ,	lastname ,password, role_2_id ) VALUES (?,?,?,?,?)`;
          const insertValues = await db.query(insertSql,[res.employee ,res.name , res.lastname , res.password , res.id]);
        
          // console.log("22222: ",insertValues)

          return NextResponse.json({ success: true, message: ` employee ${res.employee} created successfully` ,dbemployee: res});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

    
      return NextResponse.json({ success: true});

    } catch (error) {
      // console.error('Error:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
    
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}


