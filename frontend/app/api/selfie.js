export default async function handler(req, res) {
  if (req.method === "POST") {
    const response = await fetch("http://localhost:4000/selfie", {
      method: "POST",
      body: req.body,
      headers: req.headers,
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
