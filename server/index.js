const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;
const DATA_DIR = path.join(__dirname, "data");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");
const REGISTRATIONS_FILE = path.join(DATA_DIR, "registrations.json");
const REGISTRATIONS_CSV_FILE = path.join(DATA_DIR, "registrations.csv");

app.use(cors());
app.use(express.json());

const ensureDataStore = async () => {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const files = [INQUIRIES_FILE, REGISTRATIONS_FILE];
  await Promise.all(
    files.map(async (file) => {
      try {
        await fs.access(file);
      } catch {
        await fs.writeFile(file, "[]", "utf8");
      }
    })
  );

  // ensure CSV exists with header
  try {
    await fs.access(REGISTRATIONS_CSV_FILE);
  } catch {
    const header = [
      'id',
      'name',
      'email',
      'mobile',
      'organization',
      'inquiry',
      'requestedFile',
      'requestedName',
      'createdAt'
    ].join(',') + '\n';
    await fs.writeFile(REGISTRATIONS_CSV_FILE, header, 'utf8');
  }
};

const readItems = async (filePath) => {
  await ensureDataStore();
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
};

const writeItems = async (filePath, items) => {
  await fs.writeFile(filePath, JSON.stringify(items, null, 2), "utf8");
};

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/inquiries", async (req, res) => {
  const { name, mobile, email, message } = req.body || {};

  if (!name || !mobile || !email || !message) {
    return res.status(400).json({
      ok: false,
      message: "name, mobile, email and message are required",
    });
  }

  try {
    const inquiries = await readItems(INQUIRIES_FILE);
    const newInquiry = {
      id: Date.now().toString(),
      name: String(name).trim(),
      mobile: String(mobile).trim(),
      email: String(email).trim().toLowerCase(),
      message: String(message).trim(),
      createdAt: new Date().toISOString(),
    };

    inquiries.push(newInquiry);
    await writeItems(INQUIRIES_FILE, inquiries);

    return res.status(201).json({ ok: true, inquiry: newInquiry });
  } catch (error) {
    console.error("Failed to save inquiry:", error);
    return res.status(500).json({ ok: false, message: "failed to save inquiry" });
  }
});

app.get("/api/inquiries", async (_req, res) => {
  try {
    const inquiries = await readItems(INQUIRIES_FILE);
    return res.json({ ok: true, inquiries });
  } catch (error) {
    console.error("Failed to read inquiries:", error);
    return res.status(500).json({ ok: false, message: "failed to read inquiries" });
  }
});

app.post("/api/registrations", async (req, res) => {
  const { name, email, mobile, organization, inquiry, requestedFile, requestedName } = req.body || {};

  console.log('Received /api/registrations from', req.ip, 'origin:', req.headers.origin || '-', 'body keys:', Object.keys(req.body || {}));

  if (!name || !email || !mobile || !organization || !requestedFile) {
    return res.status(400).json({
      ok: false,
      message: "name, email, mobile, organization and requestedFile are required",
    });
  }

  try {
    const registrations = await readItems(REGISTRATIONS_FILE);
    const newRegistration = {
      id: Date.now().toString(),
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      mobile: String(mobile).trim(),
      organization: String(organization).trim(),
      inquiry: String(inquiry || '').trim(),
      requestedFile: String(requestedFile).trim(),
      requestedName: String(requestedName || requestedFile).trim(),
      createdAt: new Date().toISOString(),
    };

    registrations.push(newRegistration);
    await writeItems(REGISTRATIONS_FILE, registrations);

    // append to CSV for easy Excel import
    try {
      const csvLine = [
        newRegistration.id,
        escapeCsv(newRegistration.name),
        escapeCsv(newRegistration.email),
        escapeCsv(newRegistration.mobile),
        escapeCsv(newRegistration.organization),
        escapeCsv(newRegistration.inquiry),
        escapeCsv(newRegistration.requestedFile),
        escapeCsv(newRegistration.requestedName),
        newRegistration.createdAt
      ].join(',') + '\n';
      await fs.appendFile(REGISTRATIONS_CSV_FILE, csvLine, 'utf8');
    } catch (csvErr) {
      console.error('Failed to append CSV registration:', csvErr);
    }

    return res.status(201).json({ ok: true, registration: newRegistration });
  } catch (error) {
    console.error("Failed to save registration:", error);
    return res.status(500).json({ ok: false, message: "failed to save registration" });
  }
});

// helper to escape CSV fields (wrap in quotes if needed)
function escapeCsv(value) {
  if (value == null) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

app.get("/api/registrations", async (_req, res) => {
  try {
    const registrations = await readItems(REGISTRATIONS_FILE);
    return res.json({ ok: true, registrations });
  } catch (error) {
    console.error("Failed to read registrations:", error);
    return res.status(500).json({ ok: false, message: "failed to read registrations" });
  }
});

app.listen(PORT, () => {
  console.log(`Inquiry API running on http://localhost:${PORT}`);
});
