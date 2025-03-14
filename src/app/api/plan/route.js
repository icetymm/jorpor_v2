/*import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();
    try {
      const {data } = res;
      console.log("RES_ROUTE_employee: ", res);

      const originalDate = new Date();

      const day = originalDate.getDate().toString().padStart(2, '0');
      const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
      const year = originalDate.getFullYear();
      
      const formattedDate = `${day}/${month}/${year}`;


      if (res.add_role_1) {
        try {
          // const dateString = res.selectedDate;
          // const inputDate = new Date(dateString);
          // const options = { day: "2-digit", month: "2-digit", year: "numeric" };
          // const formattedDate = inputDate.toLocaleDateString("th-TH", options);
          // console.log("วันที่:", formattedDate);

          const insertSql = `INSERT INTO plan ( date, startTime, endTime ,activity,user_id,meeting) VALUES (?,?,?,?,?,?)`;
          const insertValues = [res.formattedDate ,res.newStartTime , res.newEndTime ,res.newActivity ,res.storedUser_id,res.useMeetingAsString];
          await db.query(insertSql, insertValues);

          const getPlanQuery = "SELECT * FROM plan WHERE user_id = ? AND date >= ?";
          const [planResult] = await db.query(getPlanQuery, [res.storedUser_id , formattedDate]);
        
          return NextResponse.json({ success: true, message: `new activity created successfully` ,dbemployee: res , dbPlan: planResult});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }
      if (res.add_role_2) {
        try {
          // const dateString = res.selectedDate;
          // const inputDate = new Date(dateString);
          // const options = { day: "2-digit", month: "2-digit", year: "numeric" };
          // const formattedDate = inputDate.toLocaleDateString("th-TH", options);
          // console.log("วันที่:", formattedDate);
         
          const insertSql = `INSERT INTO plan_r2 ( date, startTime, endTime ,activity,user_id,meeting) VALUES (?,?,?,?,?,?)`;
          const insertValues = [res.formattedDate ,res.newStartTime , res.newEndTime ,res.newActivity ,res.storedUser_id,res.useMeetingAsString];
          await db.query(insertSql, insertValues);

          const getPlanQuery = "SELECT * FROM plan_r2 WHERE user_id = ? AND date >= ?";
          const [planResult] = await db.query(getPlanQuery, [res.storedUser_id , formattedDate]);
        
          return NextResponse.json({ success: true, message: `new activity created successfully` ,dbemployee: res , dbPlan: planResult});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.add_role_3) {
        try {
          // const dateString = res.selectedDate;
          // const inputDate = new Date(dateString);
          // const options = { day: "2-digit", month: "2-digit", year: "numeric" };
          // const formattedDate = inputDate.toLocaleDateString("th-TH", options);
          // console.log("วันที่:", formattedDate);

          const insertSql = `INSERT INTO plan_r3 ( date, startTime, endTime ,activity,user_id,meeting) VALUES (?,?,?,?,?,?)`;
          const insertValues = [res.formattedDate ,res.newStartTime , res.newEndTime ,res.newActivity ,res.storedUser_id ,res.useMeetingAsString] ;
          await db.query(insertSql, insertValues);

          const getPlanQuery = "SELECT * FROM plan_r3 WHERE user_id = ? AND date >= ?";
          const [planResult] = await db.query(getPlanQuery, [res.storedUser_id , formattedDate]);
        
          return NextResponse.json({ success: true, message: `new activity created successfully` ,dbemployee: res , dbPlan: planResult});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }


      if (res.edit_role_1) {
        try {
          const getExamineEditQuery = "SELECT * FROM plan WHERE id = ?";
          const [ExamineEditResult] = await db.query(getExamineEditQuery, [res.item.id]);
    
          // console.log("Data_examinelistEdit: ",ExamineEditResult)

          const deleteExamineQuery = "DELETE FROM plan WHERE id = ?";
          await db.query(deleteExamineQuery, [res.item.id]);

          return NextResponse.json({ success: true , message: 'delete successfully!'});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }
      if (res.edit_role_2) {
        try {
          const getExamineEditQuery = "SELECT * FROM plan_r2 WHERE id = ?";
          const [ExamineEditResult] = await db.query(getExamineEditQuery, [res.item.id]);
    
          // console.log("Data_examinelistEdit: ",ExamineEditResult)

          const deleteExamineQuery = "DELETE FROM plan_r2 WHERE id = ?";
          await db.query(deleteExamineQuery, [res.item.id]);

          return NextResponse.json({ success: true , message: 'delete successfully!'});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }
      if (res.edit_role_3) {
        try {
          const getExamineEditQuery = "SELECT * FROM plan_r3 WHERE id = ?";
          const [ExamineEditResult] = await db.query(getExamineEditQuery, [res.item.id]);
    
          // console.log("Data_examinelistEdit: ",ExamineEditResult)

          const deleteExamineQuery = "DELETE FROM plan_r3 WHERE id = ?";
          await db.query(deleteExamineQuery, [res.item.id]);

          return NextResponse.json({ success: true , message: 'delete successfully!'});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.fetch) {
      
        try {

          const getIDExamineListQuery = "SELECT id FROM examinelist WHERE name = ?";
          const [idExamineListResult] = await db.query(getIDExamineListQuery, [ res.selectedOption ]);
          // console.log("WWW: ",idExamineListResult)

          const getEmployeeQuery = "SELECT * FROM employee WHERE examinelist_id  = ?";
          const [employeeResult] = await db.query(getEmployeeQuery, [ idExamineListResult[0].id ]);

         
        
          return NextResponse.json({ success: true ,dbemployee_name: employeeResult});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.data_role_1) {
      const originalDate = new Date();

      const day = originalDate.getDate().toString().padStart(2, '0');
      const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
      const year = originalDate.getFullYear();
      
      const formattedDate = `${day}/${month}/${year}`;

      const getPlanQuery = "SELECT * FROM plan WHERE user_id = ? AND date >= ?";
      const [planResult] = await db.query(getPlanQuery, [res.storedId , formattedDate]);
      console.log("planResult: ",planResult)


      return NextResponse.json({ success: true, dbPlan: planResult});

    }

    if (res.data_role_2) {
      const originalDate = new Date();

      const day = originalDate.getDate().toString().padStart(2, '0');
      const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
      const year = originalDate.getFullYear();
      
      const formattedDate = `${day}/${month}/${year}`;

      const getPlanQuery = "SELECT * FROM plan_r2 WHERE user_id = ? AND date >= ? ";
      const [planResult] = await db.query(getPlanQuery, [res.storedId , formattedDate]);


      return NextResponse.json({ success: true, dbPlan: planResult});

    }
    if (res.data_role_3) {
      const originalDate = new Date();

      const day = originalDate.getDate().toString().padStart(2, '0');
      const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
      const year = originalDate.getFullYear();
      
      const formattedDate = `${day}/${month}/${year}`;

      const getPlanQuery = "SELECT * FROM plan_r3 WHERE user_id = ? AND date >= ? ";
      const [planResult] = await db.query(getPlanQuery, [res.storedId , formattedDate]);


      return NextResponse.json({ success: true, dbPlan: planResult});

    }

    if (res.meet_role_1) {
      const originalDate = new Date();

      const day = originalDate.getDate().toString().padStart(2, '0');
      const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
      const year = originalDate.getFullYear();
      
      const formattedDate = `${day}/${month}/${year}`;

      const getPlanQuery = "SELECT * FROM plan WHERE user_id = ? AND date >= ? AND meeting = 'true'";
      const [planResult] = await db.query(getPlanQuery, [res.storedId , formattedDate]);


      return NextResponse.json({ success: true, dbPlan: planResult});

    }

    if (res.meet_role_2) {
      const originalDate = new Date();

      const day = originalDate.getDate().toString().padStart(2, '0');
      const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
      const year = originalDate.getFullYear();
      
      const formattedDate = `${day}/${month}/${year}`;

      const getPlanQuery = "SELECT * FROM plan_r2 WHERE user_id = ? AND date >= ?  AND meeting = 'true'";
      const [planResult] = await db.query(getPlanQuery, [res.storedId , formattedDate]);


      return NextResponse.json({ success: true, dbPlan: planResult});

    }
    if (res.meet_role_3) {
      const originalDate = new Date();

      const day = originalDate.getDate().toString().padStart(2, '0');
      const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
      const year = originalDate.getFullYear();
      
      const formattedDate = `${day}/${month}/${year}`;

      const getPlanQuery = "SELECT * FROM plan_r3 WHERE user_id = ? AND date >= ?  AND meeting = 'true'";
      const [planResult] = await db.query(getPlanQuery, [res.storedId , formattedDate]);


      return NextResponse.json({ success: true, dbPlan: planResult});

    }

    return NextResponse.json({ success: true});

    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
    
  } else {
    return NextResponse.error('Method Not Allowed');
  }

}

export async function GET(request) {
  if (request.method === 'GET') {
    try {
  

      const getEmployeeQuery = "SELECT * FROM employee ";
      const [employeeResult] = await db.query(getEmployeeQuery);

      // console.log("Data_employee_name: ",employeeResult)


      return NextResponse.json({ success: true ,dbemployee_name: employeeResult});
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}*/

import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {

  if (request.method === 'POST') {
    const res = await request.json();
    try {
      const {data } = res;
      console.log("RES_ROUTE_employee: ", res);

      const originalDate = new Date();

      const day = originalDate.getDate().toString().padStart(2, '0');
      const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
      const year = originalDate.getFullYear();
      
      const formattedDate = `${day}/${month}/${year}`;


      if (res.add_role_1) {
        try {
         
          const insertSql = `INSERT INTO plan ( date, startTime, endTime ,activity,user_id,meeting) VALUES (?,?,?,?,?,?)`;
          const insertValues = [res.formattedDate ,res.newStartTime , res.newEndTime ,res.newActivity ,res.storedUser_id,res.useMeetingAsString];
          await db.query(insertSql, insertValues);

          const getPlanQuery = "SELECT * FROM plan WHERE user_id = ? AND date >= ?";
          const [planResult] = await db.query(getPlanQuery, [res.storedUser_id , formattedDate]);
        
          return NextResponse.json({ success: true, message: `new activity created successfully` ,dbemployee: res , dbPlan: planResult});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }
      if (res.add_role_2) {
        try {
          
          const insertSql = `INSERT INTO plan_r2 ( date, startTime, endTime ,activity,user_id,meeting) VALUES (?,?,?,?,?,?)`;
          const insertValues = [res.formattedDate ,res.newStartTime , res.newEndTime ,res.newActivity ,res.storedUser_id,res.useMeetingAsString];
          await db.query(insertSql, insertValues);

          const getPlanQuery = "SELECT * FROM plan_r2 WHERE user_id = ? AND date >= ?";
          const [planResult] = await db.query(getPlanQuery, [res.storedUser_id , formattedDate]);
        
          return NextResponse.json({ success: true, message: `new activity created successfully` ,dbemployee: res , dbPlan: planResult});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.add_role_3) {
        try {
          
          const insertSql = `INSERT INTO plan_r3 ( date, startTime, endTime ,activity,user_id,meeting) VALUES (?,?,?,?,?,?)`;
          const insertValues = [res.formattedDate ,res.newStartTime , res.newEndTime ,res.newActivity ,res.storedUser_id ,res.useMeetingAsString] ;
          await db.query(insertSql, insertValues);

          const getPlanQuery = "SELECT * FROM plan_r3 WHERE user_id = ? AND date >= ?";
          const [planResult] = await db.query(getPlanQuery, [res.storedUser_id , formattedDate]);
        
          return NextResponse.json({ success: true, message: `new activity created successfully` ,dbemployee: res , dbPlan: planResult});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.add_role_admin) {
        try {
          
          const insertSql = `INSERT INTO plan_rad ( date, startTime, endTime ,activity,user_id,meeting) VALUES (?,?,?,?,?,?)`;
          const insertValues = [res.formattedDate ,res.newStartTime , res.newEndTime ,res.newActivity ,res.storedUser_id ,res.useMeetingAsString] ;
          await db.query(insertSql, insertValues);

          const getPlanQuery = "SELECT * FROM plan_rad WHERE user_id = ? AND date >= ?";
          const [planResult] = await db.query(getPlanQuery, [res.storedUser_id , formattedDate]);
        
          return NextResponse.json({ success: true, message: `new activity created successfully` ,dbemployee: res , dbPlan: planResult});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }


      if (res.edit_role_1) {
        try {
          const getExamineEditQuery = "SELECT * FROM plan WHERE id = ?";
          const [ExamineEditResult] = await db.query(getExamineEditQuery, [res.item.id]);
    
          // console.log("Data_examinelistEdit: ",ExamineEditResult)

          const deleteExamineQuery = "DELETE FROM plan WHERE id = ?";
          await db.query(deleteExamineQuery, [res.item.id]);

          return NextResponse.json({ success: true , message: 'delete successfully!'});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }
      if (res.edit_role_2) {
        try {
          const getExamineEditQuery = "SELECT * FROM plan_r2 WHERE id = ?";
          const [ExamineEditResult] = await db.query(getExamineEditQuery, [res.item.id]);
    
          // console.log("Data_examinelistEdit: ",ExamineEditResult)

          const deleteExamineQuery = "DELETE FROM plan_r2 WHERE id = ?";
          await db.query(deleteExamineQuery, [res.item.id]);

          return NextResponse.json({ success: true , message: 'delete successfully!'});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }
      if (res.edit_role_3) {
        try {
          const getExamineEditQuery = "SELECT * FROM plan_r3 WHERE id = ?";
          const [ExamineEditResult] = await db.query(getExamineEditQuery, [res.item.id]);
    
          // console.log("Data_examinelistEdit: ",ExamineEditResult)

          const deleteExamineQuery = "DELETE FROM plan_r3 WHERE id = ?";
          await db.query(deleteExamineQuery, [res.item.id]);

          return NextResponse.json({ success: true , message: 'delete successfully!'});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }
      if (res.edit_role_admin) {
        try {
          const getExamineEditQuery = "SELECT * FROM plan_rad WHERE id = ?";
          const [ExamineEditResult] = await db.query(getExamineEditQuery, [res.item.id]);
    
          // console.log("Data_examinelistEdit: ",ExamineEditResult)

          const deleteExamineQuery = "DELETE FROM plan_rad WHERE id = ?";
          await db.query(deleteExamineQuery, [res.item.id]);

          return NextResponse.json({ success: true , message: 'delete successfully!'});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.fetch) {
      
        try {

          const getIDExamineListQuery = "SELECT id FROM examinelist WHERE name = ?";
          const [idExamineListResult] = await db.query(getIDExamineListQuery, [ res.selectedOption ]);
          // console.log("WWW: ",idExamineListResult)

          const getEmployeeQuery = "SELECT * FROM employee WHERE examinelist_id  = ?";
          const [employeeResult] = await db.query(getEmployeeQuery, [ idExamineListResult[0].id ]);
        
          return NextResponse.json({ success: true ,dbemployee_name: employeeResult});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.data_role_1) {
      const originalDate = new Date();

      const day = originalDate.getDate().toString().padStart(2, '0');
      const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
      const year = originalDate.getFullYear();
      
      const formattedDate = `${day}/${month}/${year}`;

      const getPlanQuery = "SELECT * FROM plan WHERE user_id = ? AND date >= ?";
      const [planResult] = await db.query(getPlanQuery, [res.storedId , formattedDate]);
      console.log("planResult: ",planResult)


      return NextResponse.json({ success: true, dbPlan: planResult});

    }

    if (res.data_role_2) {
      const originalDate = new Date();

      const day = originalDate.getDate().toString().padStart(2, '0');
      const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
      const year = originalDate.getFullYear();
      
      const formattedDate = `${day}/${month}/${year}`;

      const getPlanQuery = "SELECT * FROM plan_r2 WHERE user_id = ? AND date >= ? ";
      const [planResult] = await db.query(getPlanQuery, [res.storedId , formattedDate]);


      return NextResponse.json({ success: true, dbPlan: planResult});

    }
    if (res.data_role_3) {
      const originalDate = new Date();

      const day = originalDate.getDate().toString().padStart(2, '0');
      const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
      const year = originalDate.getFullYear();
      
      const formattedDate = `${day}/${month}/${year}`;

      const getPlanQuery = "SELECT * FROM plan_r3 WHERE user_id = ? AND date >= ? ";
      const [planResult] = await db.query(getPlanQuery, [res.storedId , formattedDate]);


      return NextResponse.json({ success: true, dbPlan: planResult});

    }

    if (res.data_role_admin) {
      const originalDate = new Date();

      const day = originalDate.getDate().toString().padStart(2, '0');
      const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
      const year = originalDate.getFullYear();
      
      const formattedDate = `${day}/${month}/${year}`;

      const getPlanQuery = "SELECT * FROM plan_rad WHERE user_id = ? AND date >= ? ";
      const [planResult] = await db.query(getPlanQuery, [res.storedId , formattedDate]);


      return NextResponse.json({ success: true, dbPlan: planResult});

    }

    if (res.meet_role_1) {
      const originalDate = new Date();

      const day = originalDate.getDate().toString().padStart(2, '0');
      const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
      const year = originalDate.getFullYear();
      
      const formattedDate = `${day}/${month}/${year}`;

      const getPlanQuery = "SELECT * FROM plan WHERE user_id = ? AND date >= ? AND meeting = 'true'";
      const [planResult] = await db.query(getPlanQuery, [res.storedId , formattedDate]);


      return NextResponse.json({ success: true, dbPlan: planResult});

    }

    if (res.meet_role_2) {
      const originalDate = new Date();

      const day = originalDate.getDate().toString().padStart(2, '0');
      const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
      const year = originalDate.getFullYear();
      
      const formattedDate = `${day}/${month}/${year}`;

      const getPlanQuery = "SELECT * FROM plan_r2 WHERE user_id = ? AND date >= ?  AND meeting = 'true'";
      const [planResult] = await db.query(getPlanQuery, [res.storedId , formattedDate]);


      return NextResponse.json({ success: true, dbPlan: planResult});

    }
    if (res.meet_role_3) {
      const originalDate = new Date();

      const day = originalDate.getDate().toString().padStart(2, '0');
      const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
      const year = originalDate.getFullYear();
      
      const formattedDate = `${day}/${month}/${year}`;

      const getPlanQuery = "SELECT * FROM plan_r3 WHERE user_id = ? AND date >= ?  AND meeting = 'true'";
      const [planResult] = await db.query(getPlanQuery, [res.storedId , formattedDate]);


      return NextResponse.json({ success: true, dbPlan: planResult});

    }

    if (res.meet_role_admin) {
      const originalDate = new Date();

      const day = originalDate.getDate().toString().padStart(2, '0');
      const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
      const year = originalDate.getFullYear();
      
      const formattedDate = `${day}/${month}/${year}`;

      const getPlanQuery = "SELECT * FROM plan_rad WHERE user_id = ? AND date >= ?  AND meeting = 'true'";
      const [planResult] = await db.query(getPlanQuery, [res.storedId , formattedDate]);


      return NextResponse.json({ success: true, dbPlan: planResult});

    }

    return NextResponse.json({ success: true});

    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
    
  } else {
    return NextResponse.error('Method Not Allowed');
  }

}

export async function GET(request) {
  if (request.method === 'GET') {
    try {
  

      const getEmployeeQuery = "SELECT * FROM employee ";
      const [employeeResult] = await db.query(getEmployeeQuery);

      // console.log("Data_employee_name: ",employeeResult)


      return NextResponse.json({ success: true ,dbemployee_name: employeeResult});
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}