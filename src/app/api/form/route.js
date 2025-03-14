import db from '../../../lib/db';

export async function GET(req) {
  try {
    const query = "SELECT document_name, creator_name, created_at, file_url FROM documents";
    const [rows] = await db.query(query);

    if (rows.length === 0) {
      return new Response("ไม่พบเอกสาร", { status: 404 });
    }

    // แปลง file_url (Buffer) เป็น Base64
    const documents = rows.map(row => ({
      ...row,
      file_url: row.file_url ? row.file_url.toString('base64') : null,
    }));
    console.log("kkkkk",documents);

    return new Response(JSON.stringify(documents), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}  