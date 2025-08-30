export default async function handler(req, res) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:5000';
  
  try {
    const response = await fetch(`${BACKEND_URL}/admin/export`);
    const arrayBuffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=registrations.xlsx");
    res.status(response.status).send(Buffer.from(arrayBuffer));
  } catch (error) {
    res.status(500).json({ error: 'Export failed' });
  }
}
