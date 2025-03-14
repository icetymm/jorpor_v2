/*import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();
    try {
      const {data } = res;
      console.log("RES_ROUTE_employee: ", res);
      console.log("RES_ROUTE_employeeinput: ", res.employee);

      if (res.lang_role_1) {
        try {
          const updateLangQuery = "INSERT INTO language_role_1 (user_id, language) VALUES (?, ?)";
          await db.query(updateLangQuery, [res.storedId, "EN"]);
      

      
          const removeDuplicateQuery = `
            DELETE n1 FROM language_role_1 n1, language_role_1 n2 
            WHERE n1.id > n2.id AND n1.user_id = n2.user_id
          `;
          await db.query(removeDuplicateQuery);

          const getLangQuery = "SELECT language FROM language_role_1 WHERE user_id = ?";
          const [LangResult] = await db.query(getLangQuery, [res.storedId]);
      
          const LangResultmap = LangResult.map(row => row.language); // Extract the string from the array
      
          console.log("LangResultmap: ", LangResultmap);
      
          return NextResponse.json({ success: true, message: 'successfully!', dbLang: LangResultmap });
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.edit_lang_role_1) {
        try {
          const updateLangQuery = "UPDATE language_role_1 SET language = ? WHERE user_id = ?";
          const [updateLangResult] = await db.query(updateLangQuery, [res.language, res.storedId]);
      
          console.log("2222: ",updateLangResult)
          // Check if the update was successful
          if (updateLangResult.affectedRows > 0) {
            const getLangQuery = "SELECT language FROM language_role_1 WHERE user_id = ?";
            const [LangResult] = await db.query(getLangQuery, [res.storedId]);
      
            const LangResultmap = LangResult.map(row => row.language); 
      
            console.log("LangResultmap: ", LangResultmap);
      
            return NextResponse.json({ success: true, message: 'successfully!', dbLang: LangResultmap });
          } else {
            return NextResponse.json({ success: false, error: 'No rows were affected during the update.' });
          }
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.lang_role_2) {
        try {
          const updateLangQuery = "INSERT INTO language_role_2 (user_id, language) VALUES (?, ?)";
          await db.query(updateLangQuery, [res.storedId, "EN"]);
      

      
          const removeDuplicateQuery = `
            DELETE n1 FROM language_role_2 n1, language_role_2 n2 
            WHERE n1.id > n2.id AND n1.user_id = n2.user_id
          `;
          await db.query(removeDuplicateQuery);

          const getLangQuery = "SELECT language FROM language_role_2 WHERE user_id = ?";
          const [LangResult] = await db.query(getLangQuery, [res.storedId]);
      
          const LangResultmap = LangResult.map(row => row.language); // Extract the string from the array
      
          console.log("LangResultmap: ", LangResultmap);
      
          return NextResponse.json({ success: true, message: 'successfully!', dbLang: LangResultmap });
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.edit_lang_role_2) {
        try {
          const updateLangQuery = "UPDATE language_role_2 SET language = ? WHERE user_id = ?";
          const [updateLangResult] = await db.query(updateLangQuery, [res.language, res.storedId]);
      
          // Check if the update was successful
          if (updateLangResult.affectedRows > 0) {
            const getLangQuery = "SELECT language FROM language_role_2 WHERE user_id = ?";
            const [LangResult] = await db.query(getLangQuery, [res.storedId]);
      
            const LangResultmap = LangResult.map(row => row.language); 
      
            console.log("LangResultmap: ", LangResultmap);
      
            return NextResponse.json({ success: true, message: 'successfully!', dbLang: LangResultmap });
          } else {
            return NextResponse.json({ success: false, error: 'No rows were affected during the update.' });
          }
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }


      if (res.lang_role_3) {
        try {
          const updateLangQuery = "INSERT INTO language_role_3 (user_id, language) VALUES (?, ?)";
          await db.query(updateLangQuery, [res.storedId, "EN"]);
      

      
          const removeDuplicateQuery = `
            DELETE n1 FROM language_role_3 n1, language_role_3 n2 
            WHERE n1.id > n2.id AND n1.user_id = n2.user_id
          `;
          await db.query(removeDuplicateQuery);

          const getLangQuery = "SELECT language FROM language_role_3 WHERE user_id = ?";
          const [LangResult] = await db.query(getLangQuery, [res.storedId]);
      
          const LangResultmap = LangResult.map(row => row.language); // Extract the string from the array
      
          console.log("LangResultmap: ", LangResultmap);
      
          return NextResponse.json({ success: true, message: 'successfully!', dbLang: LangResultmap });
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.edit_lang_role_3) {
        try {
          const updateLangQuery = "UPDATE language_role_3 SET language = ? WHERE user_id = ?";
          const [updateLangResult] = await db.query(updateLangQuery, [res.language, res.storedId]);
      
          // Check if the update was successful
          if (updateLangResult.affectedRows > 0) {
            const getLangQuery = "SELECT language FROM language_role_3 WHERE user_id = ?";
            const [LangResult] = await db.query(getLangQuery, [res.storedId]);
      
            const LangResultmap = LangResult.map(row => row.language); 
      
            console.log("LangResultmap: ", LangResultmap);
      
            return NextResponse.json({ success: true, message: 'successfully!', dbLang: LangResultmap });
          } else {
            return NextResponse.json({ success: false, error: 'No rows were affected during the update.' });
          }
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }
      
      

     

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
    console.log("list ID3: ", res);
    try {
      const {data } = res;
      console.log("RES_ROUTE_employee: ", res);
      console.log("RES_ROUTE_employeeinput: ", res.employee);

      if (res.lang_role_1) {
        try {
          const updateLangQuery = "INSERT INTO language_role_1 (user_id, language) VALUES (?, ?)";
          await db.query(updateLangQuery, [res.storedId, "EN"]);
          const removeDuplicateQuery = `
            DELETE n1 FROM language_role_1 n1, language_role_1 n2 
            WHERE n1.id > n2.id AND n1.user_id = n2.user_id
          `;
          await db.query(removeDuplicateQuery);

          const getLangQuery = "SELECT language FROM language_role_1 WHERE user_id = ?";
          const [LangResult] = await db.query(getLangQuery, [res.storedId]);
      
          const LangResultmap = LangResult.map(row => row.language); // Extract the string from the array
      
          console.log("LangResultmap: ", LangResultmap);
      
          return NextResponse.json({ success: true, message: 'successfully!', dbLang: LangResultmap });
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.edit_lang_role_1) {
        try {
          const updateLangQuery = "UPDATE language_role_1 SET language = ? WHERE user_id = ?";
          const [updateLangResult] = await db.query(updateLangQuery, [res.language, res.storedId]);
      
          console.log("2222: ",updateLangResult)
          // Check if the update was successful
          if (updateLangResult.affectedRows > 0) {
            const getLangQuery = "SELECT language FROM language_role_1 WHERE user_id = ?";
            const [LangResult] = await db.query(getLangQuery, [res.storedId]);
      
            const LangResultmap = LangResult.map(row => row.language); 
      
            console.log("LangResultmap: ", LangResultmap);
      
            return NextResponse.json({ success: true, message: 'successfully!', dbLang: LangResultmap });
          } else {
            return NextResponse.json({ success: false, error: 'No rows were affected during the update.' });
          }
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.lang_role_2) {
        try {
          const updateLangQuery = "INSERT INTO language_role_2 (user_id, language) VALUES (?, ?)";
          await db.query(updateLangQuery, [res.storedId, "EN"]);
      

      
          const removeDuplicateQuery = `
            DELETE n1 FROM language_role_2 n1, language_role_2 n2 
            WHERE n1.id > n2.id AND n1.user_id = n2.user_id
          `;
          await db.query(removeDuplicateQuery);

          const getLangQuery = "SELECT language FROM language_role_2 WHERE user_id = ?";
          const [LangResult] = await db.query(getLangQuery, [res.storedId]);
      
          const LangResultmap = LangResult.map(row => row.language); // Extract the string from the array
      
          console.log("LangResultmap: ", LangResultmap);
      
          return NextResponse.json({ success: true, message: 'successfully!', dbLang: LangResultmap });
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.edit_lang_role_2) {
        try {
          const updateLangQuery = "UPDATE language_role_2 SET language = ? WHERE user_id = ?";
          const [updateLangResult] = await db.query(updateLangQuery, [res.language, res.storedId]);
      
          // Check if the update was successful
          if (updateLangResult.affectedRows > 0) {
            const getLangQuery = "SELECT language FROM language_role_2 WHERE user_id = ?";
            const [LangResult] = await db.query(getLangQuery, [res.storedId]);
      
            const LangResultmap = LangResult.map(row => row.language); 
      
            console.log("LangResultmap: ", LangResultmap);
      
            return NextResponse.json({ success: true, message: 'successfully!', dbLang: LangResultmap });
          } else {
            return NextResponse.json({ success: false, error: 'No rows were affected during the update.' });
          }
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }


      if (res.lang_role_3) {
        try {
          const updateLangQuery = "INSERT INTO language_role_3 (user_id, language) VALUES (?, ?)";
          await db.query(updateLangQuery, [res.storedId, "EN"]);
          
          const removeDuplicateQuery = `
            DELETE n1 FROM language_role_3 n1, language_role_3 n2 
            WHERE n1.id > n2.id AND n1.user_id = n2.user_id
          `;
          await db.query(removeDuplicateQuery);

          const getLangQuery = "SELECT language FROM language_role_3 WHERE user_id = ?";
          const [LangResult] = await db.query(getLangQuery, [res.storedId]);
          
          const LangResultmap = LangResult.map(row => row.language); // Extract the string from the array
      
          console.log("LangResultmap: ", LangResultmap);
      
          return NextResponse.json({ success: true, message: 'successfully!', dbLang: LangResultmap });
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.edit_lang_role_3) {
        try {
          const updateLangQuery = "UPDATE language_role_3 SET language = ? WHERE user_id = ?";
          const [updateLangResult] = await db.query(updateLangQuery, [res.language, res.storedId]);
      
          // Check if the update was successful
          if (updateLangResult.affectedRows > 0) {
            const getLangQuery = "SELECT language FROM language_role_3 WHERE user_id = ?";
            const [LangResult] = await db.query(getLangQuery, [res.storedId]);
      
            const LangResultmap = LangResult.map(row => row.language); 
      
            console.log("LangResultmap: ", LangResultmap);
      
            return NextResponse.json({ success: true, message: 'successfully!', dbLang: LangResultmap });
          } else {
            return NextResponse.json({ success: false, error: 'No rows were affected during the update.' });
          }
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.lang_role_admin) {
        try {
          const updateLangQuery = "INSERT INTO language_role_admin (user_id, language) VALUES (?, ?)";
          await db.query(updateLangQuery, [res.storedId, "EN"]);
      
      
          const removeDuplicateQuery = `
            DELETE n1 FROM language_role_admin n1, language_role_admin n2 
            WHERE n1.id > n2.id AND n1.user_id = n2.user_id
          `;
          await db.query(removeDuplicateQuery);

          const getLangQuery = "SELECT language FROM language_role_admin WHERE user_id = ?";
          const [LangResult] = await db.query(getLangQuery, [res.storedId]);
      
          const LangResultmap = LangResult.map(row => row.language); // Extract the string from the array
      
          console.log("LangResultmap: ", LangResultmap);
      
          return NextResponse.json({ success: true, message: 'successfully!', dbLang: LangResultmap });
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.edit_lang_role_admin) {
        try {
          const updateLangQuery = "UPDATE language_role_admin SET language = ? WHERE user_id = ?";
          const [updateLangResult] = await db.query(updateLangQuery, [res.language, res.storedId]);
      
          // Check if the update was successful
          if (updateLangResult.affectedRows > 0) {
            const getLangQuery = "SELECT language FROM language_role_admin WHERE user_id = ?";
            const [LangResult] = await db.query(getLangQuery, [res.storedId]);
      
            const LangResultmap = LangResult.map(row => row.language); 
      
            console.log("LangResultmap: ", LangResultmap);
      
            return NextResponse.json({ success: true, message: 'successfully!', dbLang: LangResultmap });
          } else {
            return NextResponse.json({ success: false, error: 'No rows were affected during the update.' });
          }
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }
    

      return NextResponse.json({ success: true ,dbemployee_name: employeeResult});
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}