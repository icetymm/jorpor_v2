import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();
    try {
      const { examinelist_name , todo } = res;
      // console.log("RES_ROUTE_examineRes: ", res);

      if (res.add) {
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // Adding 1 because January starts at 0
        const year = currentDate.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        let flattenedNameList = []; // Declare outside of the try block

   
        // if (examineExistsResult.length === 0) {
          const insertSql = "INSERT INTO examinelist (name, user_id) VALUES (?,?)";
          const insertValues = await db.query(insertSql,[res.examinelist_name , res.id]);
          // console.log("rusult55555: ",insertValues[0])

                
  
          if (insertValues[0].affectedRows > 0){
            const getExamineQuery = "SELECT * FROM examinelist WHERE user_id = ? ";
            const [examinelistResult] = await db.query(getExamineQuery , res.id);
      
            // console.log("Data_examine: ",examinelistResult[0])

            const getIdQuery = "SELECT select_id FROM `select` WHERE date = ? AND user_id = ?";
            const [idResult] = await db.query(getIdQuery, [formattedDate, res.id]);
            const idResultmap = idResult.map(row => row.select_id)[0]; // Extract the string from the array
            // console.log("4444idResult: ", idResultmap);
          
            let item_id = [];
          
            // Check if idResultmap is defined before parsing
            if (idResultmap) {
              try {
                item_id = JSON.parse(idResultmap);
                // console.log("Parsed item_id: ", item_id);
              } catch (error) {
                console.error("Error parsing JSON:", error);
                // Handle the error appropriately, e.g., log the error or set a default value
              }
            } else {
              console.warn("idResultmap is undefined or null");
              // Handle the case where idResultmap is undefined or null
            }
          
            const nameList = [];
          
            for (const item of item_id) {
              // console.log("4444: ", item);
          
              const getNameExamineListQuery = "SELECT id ,name FROM examinelist WHERE id = ? AND user_id = ?";
              const [nameExamineListResult] = await db.query(getNameExamineListQuery, [item, res.id]);
          
              nameList.push(nameExamineListResult);
              // console.log("nameList: ", nameList);
            }
          
            flattenedNameList = nameList.flatMap(zone => zone.map(item => item));
            // console.log("Flattened nameList: ", flattenedNameList);
          
            // Filter out elements in examinelistResult[0] where id is in flattenedNameList
            const filteredExamineListResult = examinelistResult.filter(item =>
              !flattenedNameList.some(flattenedItem => flattenedItem.id === item.id)
            );
          
            // console.log("Filtered examinelistResult[0]: ", filteredExamineListResult);

             return NextResponse.json({ success: true, message: ` ${res.examinelist_name} created successfully` ,dbexaminelist_name: examinelistResult,dbexaminelist_nameNew:filteredExamineListResult});
          }
        }

      if (res.notifyfetch) {

        const getExamineQuery = `
        SELECT 
            examinelist.*,
            examinelist.name AS examinelist_name,
            users.id,
            users.employee,
            users.name,
            users.lastname,
            users.position
        FROM examinelist 
        JOIN users ON examinelist.user_id = users.id
        WHERE user_id = ?`;
    

    const [examinelistResult] = await db.query(getExamineQuery, [res.storedUser_id]);
    // const key = examinelistResult.name + ' ' + examinelistResult.lastname;
    // console.log("Data_examineUsersSSSSSexaminelistResult: ", examinelistResult);

    if (examinelistResult.length > 0) {

    const uniqueDataArray = [];

  // Iterate through the examinelistResult array
  examinelistResult.forEach(result => {
  // console.log("Data_examineUsersSSSSS: ", result);

  // Check if the ID is not in the array, add it to the array
  const existingData = uniqueDataArray.find(item => item.id === result.id);
  if (!existingData) {
    uniqueDataArray.push({
      id: result.id,
      name: result.name + ' ' + result.lastname,
      employee: result.employee,
      position:  result.position.replace('Safety Officer', ''),
      examinelist: [result.examinelist_name]  // Start with an array containing the current value
    });
  } else {
    // If the ID already exists, add the current result.examinelist_name to the existing array
    existingData.examinelist.push(result.examinelist_name );
  }
});

// Convert the set back to an array if needed
// console.log("Data_examineUsers: ", uniqueDataArray);
      
  
  
        return NextResponse.json({ success: true ,dbexaminelist_name: uniqueDataArray});
} else {
  const getExamineQuery = `
  SELECT id, employee, name, lastname, position FROM users WHERE id = ?`;

const [examinelistResult] = await db.query(getExamineQuery, [res.storedUser_id]);

const uniqueDataArray = [];

// Iterate through the examinelistResult array
examinelistResult.forEach(result => {
// console.log("Data_examineUsersSSSSS: ", result);

// Check if the ID is not in the array, add it to the array
const existingData = uniqueDataArray.find(item => item.id === result.id);
if (!existingData) {
  uniqueDataArray.push({
    id: result.id,
    name: result.name + ' ' + result.lastname,
    employee: result.employee,
    position:  result.position.replace('Safety Officer', ''),
    examinelist: [result.examinelist_name]  // Start with an array containing the current value
  });
} else {
  // If the ID already exists, add the current result.examinelist_name to the existing array
  existingData.examinelist.push(result.examinelist_name );
}
});

// Convert the set back to an array if needed
// console.log("Data_examineUsers: ", uniqueDataArray);
    


      return NextResponse.json({ success: true ,dbexaminelist_name: uniqueDataArray});
}
        }

        if (res.fetch) {
          const currentDate = new Date();
          const day = currentDate.getDate();
          const month = currentDate.getMonth() + 1; // Adding 1 because January starts at 0
          const year = currentDate.getFullYear();
          const formattedDate = `${day}/${month}/${year}`;
          
          let flattenedNameList = []; // Declare outside of the try block
        
          const getExamineQuery = "SELECT * FROM examinelist WHERE user_id = ? ";
          const [examinelistResult] = await db.query(getExamineQuery, res.storedUser_id);
        
          // console.log("Data_examine44: ", examinelistResult);
        
          const getIdQuery = "SELECT select_id FROM `select` WHERE date = ? AND user_id = ?";
          const [idResult] = await db.query(getIdQuery, [formattedDate, res.storedUser_id]);
          const idResultmap = idResult.map(row => row.select_id)[0]; // Extract the string from the array
          // console.log("4444idResult: ", idResultmap);
        
          let item_id = [];
        
          // Check if idResultmap is defined before parsing
          if (idResultmap) {
            try {
              item_id = JSON.parse(idResultmap);
              // console.log("Parsed item_id: ", item_id);
            } catch (error) {
              console.error("Error parsing JSON:", error);
              // Handle the error appropriately, e.g., log the error or set a default value
            }
          } else {
            console.warn("idResultmap is undefined or null");
            // Handle the case where idResultmap is undefined or null
          }
        
          const nameList = [];
        
          for (const item of item_id) {
            // console.log("4444: ", item);
        
            const getNameExamineListQuery = "SELECT id ,name FROM examinelist WHERE id = ? AND user_id = ?";
            const [nameExamineListResult] = await db.query(getNameExamineListQuery, [item, res.storedUser_id]);
        
            nameList.push(nameExamineListResult);
          }
        
          // flattenedNameList = nameList.flatMap(zone => zone.map(item => item));
          // console.log("Flattened nameList: ", flattenedNameList);
        
          // Filter out elements in examinelistResult[0] where id is in flattenedNameList
          // const filteredExamineListResult = examinelistResult.filter(item =>
          //   !flattenedNameList.some(flattenedItem => flattenedItem.id === item.id)
          // );
        
          // console.log("Filtered examinelistResult[0]: ", filteredExamineListResult);
          // console.log("Flattened nameList: ", flattenedNameList);

          // console.log("nameList: ", nameList);

          return NextResponse.json({ success: true, dbexaminelist_name: examinelistResult });
        }

        if (res.fetchSelect) {
          const currentDate = new Date();
          const day = currentDate.getDate();
          const month = currentDate.getMonth() + 1; // Adding 1 because January starts at 0
          const year = currentDate.getFullYear();
          const formattedDate = `${day}/${month}/${year}`;
          
          let flattenedNameList = []; // Declare outside of the try block
        
          const getExamineQuery = "SELECT * FROM examinelist WHERE user_id = ? ";
          const [examinelistResult] = await db.query(getExamineQuery, res.storedUser_id);
        
          // console.log("Data_examine44: ", examinelistResult);
        // 
          const getIdQuery = "SELECT select_id FROM `select` WHERE date = ? AND user_id = ?";
          const [idResult] = await db.query(getIdQuery, [formattedDate, res.storedUser_id]);
          const idResultmap = idResult.map(row => row.select_id)[0]; // Extract the string from the array
          // console.log("4444idResult: ", idResultmap);
        
          let item_id = [];
        
          // Check if idResultmap is defined before parsing
          if (idResultmap) {
            try {
              item_id = JSON.parse(idResultmap);
              // console.log("Parsed item_id: ", item_id);
            } catch (error) {
              console.error("Error parsing JSON:", error);
              // Handle the error appropriately, e.g., log the error or set a default value
            }
          } else {
            console.warn("idResultmap is undefined or null");
            // Handle the case where idResultmap is undefined or null
          }
        
          const nameList = [];
        
          for (const item of item_id) {
            // console.log("4444: ", item);
        
            const getNameExamineListQuery = "SELECT id ,name FROM examinelist WHERE id = ? AND user_id = ?";
            const [nameExamineListResult] = await db.query(getNameExamineListQuery, [item, res.storedUser_id]);
        
            nameList.push(nameExamineListResult);
          }
        
          flattenedNameList = nameList.flatMap(zone => zone.map(item => item));
          // console.log("Flatte/ned nameList: ", flattenedNameList);
        
          // Filter out elements in examinelistResult[0] where id is in flattenedNameList
          const filteredExamineListResult = examinelistResult.filter(item =>
            !flattenedNameList.some(flattenedItem => flattenedItem.id === item.id)
          );
        
          // console.log("Filtered examinelistResult[0]: ", filteredExamineListResult);
          // console.log("Flattened nameList: ", flattenedNameList);

          // console.log("nameList: ", nameList);

          return NextResponse.json({ success: true, dbexaminelist_name: filteredExamineListResult });
        }
        

      if (res.selectchecklist) {
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // เพิ่ม 1 เนื่องจากมกราคมเริ่มที่ 0
        const year = currentDate.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        let flattenedNameList = []; // Declare outside of the try block

        try {
          // console.log("Data_examinelistEdit888: ",res)

          const getIdQuery = "SELECT select_id FROM `select` WHERE date = ? AND user_id = ?";
          const [idResult] = await db.query(getIdQuery, [formattedDate, res.storedUser_id]);
          const idResultmap = idResult.map(row => row.select_id)[0]; // Extract the string from the array
          // console.log("4444idResult666: ", idResultmap);
  
          let item_id = [];
  
          // Check if idResultmap is defined before parsing
          if (idResultmap) {
            try {
              item_id = JSON.parse(idResultmap);
              // console.log("Parsed item_id: ", item_id);
            } catch (error) {
              console.error("Error parsing JSON:", error);
              // Handle the error appropriately, e.g., log the error or set a default value
            }
          } else {
            console.warn("idResultmap is undefined or null");
            // Handle the case where idResultmap is undefined or null
          }
          
          const nameList = [];
          // const flattenedNameList = [];

          try {
            for (const item of item_id) {
              // console.log("4444: ", item);

              const getNameExamineListQuery = "SELECT id ,name FROM examinelist WHERE id = ? AND user_id = ?";
              const [nameExamineListResult] = await db.query(getNameExamineListQuery, [item, res.storedUser_id]);

              nameList.push(nameExamineListResult);
              // console.log("nameList: ", nameList);
            }

            flattenedNameList = nameList.flatMap(zone => zone.map(item => item));
            // console.log("Flattened nameList: ", flattenedNameList);
          } catch (error) {
            console.error("Error inserting data:", error);
            // Handle the error as needed
          }
          } catch (error) {
            console.error("Error inserting data:", error);
            // Handle the error as needed
          }

        return NextResponse.json({ success: true , dbexaminelist_name: flattenedNameList });
        }

        if (res.selected) {
          // console.log("8888: ", res.checkedItems);
          const currentDate = new Date();
          const day = currentDate.getDate();
          const month = currentDate.getMonth() + 1; // เพิ่ม 1 เนื่องจากมกราคมเริ่มที่ 0
          const year = currentDate.getFullYear();
          const formattedDate = `${day}/${month}/${year}`;

          
          // Check if the data already exists
            const checkSql = "SELECT * FROM `select` WHERE date = ? AND user_id = ?";
            const checkValues = await db.query(checkSql, [formattedDate, res.id]);
            // console.log("resultcheckValues: ", checkValues);

            if (checkValues[0].length === 0) {
              const insertSql = "INSERT INTO `select` (date, select_id, user_id) VALUES (?, ?, ?)";
              
              try {
                const insertValues = await db.query(insertSql, [formattedDate, JSON.stringify(res.checkedItems), res.id]);
                 console.log("result55555: ", insertValues[0]);
                // console.log("Data added successfully.");
              } catch (error) {
                console.error("Error inserting data:", error);
                // Handle the error as needed
              }
            } else {
              // console.log("Data already exists, skipping insertion.");
            }
          return NextResponse.json({ success: true });
        }

        if (res.selectedUpdate) {
          const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // เพิ่ม 1 เนื่องจากมกราคมเริ่มที่ 0
        const year = currentDate.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        let flattenedNameList = []; // Declare outside of the try block

        try {
           console.log("Data_examinelistEdit888: ",res)

          // const getExamineEditQuery = "SELECT * FROM examinelist WHERE name = ? AND id = ?";
          // const [ExamineEditResult] = await db.query(getExamineEditQuery, [res.todo.name , res.todo.id]);
          // const checkedItems = res.checkedItems.filter(item => item !== res.todo.id);
          const checkedItemsdata = JSON.stringify(res.checkedItems);
          
           console.log("124578ssss", checkedItemsdata);
          
          const updateSql = "UPDATE `select` SET select_id = ? WHERE date = ? AND user_id = ? ";
          const updateSqlValues = await db.query(updateSql, [checkedItemsdata, formattedDate, res.id]);
          
           console.log("124578sssscheckValues", updateSqlValues, formattedDate, res.id);

          const getIdQuery = "SELECT select_id FROM `select` WHERE date = ? AND user_id = ?";
          const [idResult] = await db.query(getIdQuery, [formattedDate, res.id]);
          const idResultmap = idResult.map(row => row.select_id)[0]; // Extract the string from the array
           console.log("4444idResult: ", idResultmap);
  
          let item_id = [];
  
          // Check if idResultmap is defined before parsing
          if (idResultmap) {
            try {
              item_id = JSON.parse(idResultmap);
              // console.log("Parsed item_id: ", item_id);
            } catch (error) {
              console.error("Error parsing JSON:", error);
              // Handle the error appropriately, e.g., log the error or set a default value
            }
          } else {
            console.warn("idResultmap is undefined or null");
            // Handle the case where idResultmap is undefined or null
          }
          
          const nameList = [];
          // const flattenedNameList = [];

          try {
            for (const item of item_id) {
              // console.log("4444: ", item);

              const getNameExamineListQuery = "SELECT id ,name FROM examinelist WHERE id = ? AND user_id = ?";
              const [nameExamineListResult] = await db.query(getNameExamineListQuery, [item, res.id]);

              nameList.push(nameExamineListResult);
              // console.log("nameList: ", nameList);
            }

            flattenedNameList = nameList.flatMap(zone => zone.map(item => item));
            // console.log("Flattened nameList: ", flattenedNameList);
          } catch (error) {
            console.error("Error inserting data:", error);
            // Handle the error as needed
          }
          } catch (error) {
            console.error("Error inserting data:", error);
            // Handle the error as needed
          }
        
          return NextResponse.json({ success: true, message: ` add successfully`, data: flattenedNameList });
        
      }

        

      if (res.edit) {
        // console.log("Data_examinelistEdit888+++++: ",res)

        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // เพิ่ม 1 เนื่องจากมกราคมเริ่มที่ 0
        const year = currentDate.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        try {

          // const getExamineEditQuery = "SELECT * FROM examinelist WHERE name = ? AND id = ?";
          // const [ExamineEditResult] = await db.query(getExamineEditQuery, [res.todo.name , res.todo.id]);
          const getIdselectQuery = "SELECT select_id FROM `select` WHERE date = ? AND user_id = ?";
          const [idselectResult] = await db.query(getIdselectQuery, [formattedDate, res.id]);
          const idselectResultmap = idselectResult.map(row => row.select_id)[0]; // Extract the string from the array
          // console.log("4444idResult: ", idselectResultmap);
          const idselectResultmapjson = JSON.parse(idselectResultmap);

          const checkedItems = idselectResultmapjson.filter(item => item !== res.todo.id);
          const checkedItemsdata = JSON.stringify(checkedItems);
          
          // console.log("124578ssss", checkedItemsdata);
          
          const updateSql = "UPDATE `select` SET select_id = ? WHERE date = ? AND user_id = ? ";
          const updateSqlValues = await db.query(updateSql, [checkedItemsdata, formattedDate, res.id]);
          
          // console.log("124578sssscheckValues", updateSqlValues, formattedDate, res.id);

          const getIdQuery = "SELECT select_id FROM `select` WHERE date = ? AND user_id = ?";
          const [idResult] = await db.query(getIdQuery, [formattedDate, res.id]);
          const idResultmap = idResult.map(row => row.select_id)[0]; // Extract the string from the array
          // console.log("88888idResult: ", idResultmap);
          const idResultmapjson = JSON.parse(idResultmap);
          // const deleteExamineQuery = "DELETE FROM examinelist WHERE name = ? AND id = ?";
          // await db.query(deleteExamineQuery, [res.todo.name , res.todo.id]);

          return NextResponse.json({ success: true , message: 'delete successfully!' ,data: idResultmapjson });
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      if (res.editselect) {
        try {
          const getExamineEditQuery = "SELECT * FROM examinelist WHERE name = ? AND id = ? AND user_id = ?";
          const [ExamineEditResult] = await db.query(getExamineEditQuery, [res.todo.name , res.todo.id ,res.storedUser_id]);
    
          // console.log("Data_examineEdit: ",ExamineEditResult , res.todo.name , res.todo.id ,res.storedUser_id)

          const deleteExamineQuery = "DELETE FROM examinelist WHERE name = ? AND id = ? AND user_id = ?";
          await db.query(deleteExamineQuery, [res.todo.name , res.todo.id ,res.storedUser_id]);

        
          return NextResponse.json({ success: true , message: 'delete successfully!'});
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
      }

      
      // if (res.edit) {
      //   try {
      //     console.log("Data_examinelistEdit888: ",res.id)

      //     const getExamineEditQuery = "SELECT * FROM examinelist WHERE name = ? AND id = ?";
      //     const [ExamineEditResult] = await db.query(getExamineEditQuery, [res.todo.name , res.todo.id]);
    

      //     const deleteExamineQuery = "DELETE FROM examinelist WHERE name = ? AND id = ?";
      //     await db.query(deleteExamineQuery, [res.todo.name , res.todo.id]);

      //     return NextResponse.json({ success: true , message: 'delete successfully!' });
      //   } catch (error) {
      //     console.error('ErrorEditEx:', error);
      //     return NextResponse.json({ success: false, error: error.message });
      //   }
      // }



      if (res.submit) {

        return NextResponse.json({ success: true ,redirect: `/reportResults?date=${res.formattedDate}&id=${res.id}`});
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
