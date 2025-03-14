import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  if (request.method === 'GET') {
    try {

      const getExaminelistQuery = "SELECT * FROM examinelist ";
      const [examinelistResult] = await db.query(getExaminelistQuery);

      console.log("Data_examine: ", examinelistResult)

      return NextResponse.json({ success: true, dbexaminelist_name: examinelistResult });
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}

export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();
    try {
      // const { examinelist_name, todo } = res;
      console.log("RES_ROUTE_SELECTTTTT: ", res);

      // สมมติว่า res คือ object ที่มี fetchNotify property
      if (res.fetchNotify) {
        const dailyQuery = "SELECT * FROM emergency_notify WHERE STR_TO_DATE(date, '%d/%m/%Y') = CURDATE()";
        // ดึงข้อมูลจากตาราง emergency_notify แบบรายอาทิตย์
        const weeklyQuery = "SELECT * FROM emergency_notify WHERE YEARWEEK(STR_TO_DATE(date, '%d/%m/%Y')) = YEARWEEK(CURDATE())";
        // ดึงข้อมูลจากตาราง emergency_notify แบบรายเดือน
        const monthlyQuery = "SELECT * FROM emergency_notify WHERE MONTH(STR_TO_DATE(date, '%d/%m/%Y')) = MONTH(CURDATE()) AND YEAR(STR_TO_DATE(date, '%d/%m/%Y')) = YEAR(CURDATE())";

        const percentagesdaily = { percentage: {} };
        const percentagesWeekly = { percentage: {} };
        const percentagesmonthly = { percentage: {} };

        const [dailyResults] = await db.query(dailyQuery);
        console.log("Daily Results: ", dailyResults);
        
        if (dailyResults.length > 0) {
          for (let i = 1; i <= 5; i++) {
            const countLocation = dailyResults.filter(result => result.location === i.toString()).length;
            const percentage = ((countLocation * 100) / dailyResults.length).toFixed(0);
            percentagesdaily.percentage[`location_${i}`] = {
              percentage: percentage,
              count: countLocation
            };
          }
          console.log("Percentages: ", percentagesdaily);
        } else {
          for (let i = 1; i <= 5; i++) {
            const countLocation = dailyResults.filter(result => result.location === i.toString()).length;
            percentagesdaily.percentage[`location_${i}`] = {
              percentage: 0,
              count: countLocation
            };
          }
        }

        const [weeklyResults] = await db.query(weeklyQuery);
        console.log("Weekly Results: ", weeklyResults, weeklyResults.length);

        if (weeklyResults.length > 0) {
          for (let i = 1; i <= 5; i++) {
            const countLocation = weeklyResults.filter(result => result.location === i.toString()).length;
            const percentage = ((countLocation * 100) / weeklyResults.length).toFixed(0);
            percentagesWeekly.percentage[`location_${i}`] = {
              percentage: percentage,
              count: countLocation
            };
          }
        } else {
          for (let i = 1; i <= 5; i++) {
            const countLocation = weeklyResults.filter(result => result.location === i.toString()).length;
            percentagesWeekly.percentage[`location_${i}`] = {
              percentage: 0,
              count: countLocation
            };
          }
        }
        const [monthlyResults] = await db.query(monthlyQuery);
        console.log("Monthly Results: ", monthlyResults);
        if (monthlyResults.length > 0) {

          for (let i = 1; i <= 5; i++) {

            const countLocation = monthlyResults.filter(result => result.location === i.toString()).length;
            const percentage = ((countLocation * 100) / monthlyResults.length).toFixed(0);
            percentagesmonthly.percentage[`location_${i}`] = {
              percentage: percentage,
              count: countLocation
            };
          }
        } else {
          for (let i = 1; i <= 5; i++) {
            const countLocation = monthlyResults.filter(result => result.location === i.toString()).length;
            percentagesmonthly.percentage[`location_${i}`] = {
              percentage: 0,
              count: countLocation
            };
          }
        }
        console.log("percentagesdaily: ", percentagesdaily);
        console.log("percentagesWeekly: ", percentagesWeekly);
        console.log("percentagesmonthly: ", percentagesmonthly);

        const dataNotify = [percentagesdaily, percentagesWeekly, percentagesmonthly]
        console.log("aa: ", dataNotify)
        return NextResponse.json({ success: true, dataNotify: dataNotify });
      }

      if (res.button) {
        const getNumAllQuery = "SELECT number FROM button_box";
        const [NumAllResult] = await db.query(getNumAllQuery);

        const getNumQuery = "SELECT number FROM button_box WHERE user_id = ?";
        const [NumResult] = await db.query(getNumQuery, [res.storedId]);
        let NumResultmap = [];
        let ListNumAll = [];

        if (NumResult.length > 0) {
          NumResultmap = NumResult.map(row => row.number)[0]; // Extract the string from the array
          console.log("12212: ", NumResultmap);
        } else {
          console.log("12212: Null");
        }

        let NumAllResultmap = [];
        let uniqueValues = [];
        for (let i = 1; i <= 5; i++) {
          ListNumAll.push(i);
        }
        if (NumAllResult.length > 0) {

          console.log("ListNumAll: ", ListNumAll);
          NumAllResultmap = NumAllResult.map(row => row.number);
          uniqueValues = ListNumAll.filter(value => !NumAllResultmap.includes(value));
          console.log("ค่าที่ไม่ซ้ำ:", uniqueValues);

        } else {
          console.log("NumAllResult is empty");
          uniqueValues.push(...ListNumAll);
        }
        return NextResponse.json({ success: true, NumAllResult: uniqueValues, NumResult: NumResultmap });
      }

      if (res.button_change) {
        try {
          const checkQuery = "SELECT * FROM button_box WHERE user_id = ?";
          const [checkResult] = await db.query(checkQuery, [res.storedId]);
          let [updateResult] = ''
          if (checkResult.length === 0) {
            // ถ้าไม่มี user_id ในฐานข้อมูล ให้ทำการ Insert
            const insertQuery = "INSERT INTO button_box (user_id, number) VALUES (?, ?)";
            [updateResult] = await db.query(insertQuery, [res.storedId, res.Num]);
          } else {
            // ถ้ามี user_id ในฐานข้อมูล ให้ทำการ Update
            const updateQuery = "UPDATE button_box SET number = ? WHERE user_id = ?";
            [updateResult] = await db.query(updateQuery, [res.Num, res.storedId]);
          }

          // const updateQuery = "UPDATE button_box SET number = ? WHERE user_id = ?";
          // const [updateResult] = await db.query(updateQuery, [res.Num, res.storedId]);

          console.log("2222: ", updateResult)
          // Check if the update was successful
          if (updateResult.affectedRows > 0) {
            const getNumAllQuery = "SELECT number FROM button_box";
            const [NumAllResult] = await db.query(getNumAllQuery);

            const getNumQuery = "SELECT number FROM button_box WHERE user_id = ?";
            const [NumResult] = await db.query(getNumQuery, [res.storedId]);
            let NumResultmap = [];
            let ListNumAll = [];

            if (NumResult.length > 0) {
              NumResultmap = NumResult.map(row => row.number)[0]; // Extract the string from the array
              console.log("12212: ", NumResultmap);
            } else {
              console.log("12212: Null");
            }

            let NumAllResultmap = [];
            let uniqueValues = [];
            if (NumAllResult.length > 0) {
              for (let i = 1; i <= 5; i++) {
                ListNumAll.push(i);
              }
              console.log("ListNumAll: ", ListNumAll);

              NumAllResultmap = NumAllResult.map(row => row.number);

              uniqueValues = ListNumAll.filter(value => !NumAllResultmap.includes(value));

              console.log("ค่าที่ไม่ซ้ำ:", uniqueValues);
            } else {
              console.log("NumAllResult is empty");
            }



            return NextResponse.json({ success: true, NumAllResult: uniqueValues, NumResult: NumResultmap });
          } else {
            return NextResponse.json({ success: false, error: 'No rows were affected during the update.' });
          }
        } catch (error) {
          console.error('ErrorEditEx:', error);
          return NextResponse.json({ success: false, error: error.message });
        }
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