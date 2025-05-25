const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

const PORT = 3000;
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const METADATA_FILE = path.join(__dirname, 'documents.json');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// Ensure metadata file exists
if (!fs.existsSync(METADATA_FILE)) {
  fs.writeFileSync(METADATA_FILE, JSON.stringify([]));
}

const readMetadata = () => {
  try {
    const data = fs.readFileSync(METADATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const writeMetadata = (data) => {
  fs.writeFileSync(METADATA_FILE, JSON.stringify(data, null, 2));
};

const safeValue = (val) => Array.isArray(val) ? val[0] : val;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (req.method === 'GET' && pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Server is running');

  } else if (req.method === 'GET' && pathname === '/documents') {
    let metadata = readMetadata();

    const { type, department, search, status } = parsedUrl.query;

    if (type) {
      metadata = metadata.filter(doc => doc.type.toLowerCase() === type.toLowerCase());
    }

    if (department) {
      metadata = metadata.filter(doc => doc.department.toLowerCase() === department.toLowerCase());
    }

    if (search) {
      const searchLower = search.toLowerCase();
      metadata = metadata.filter(doc => doc.name.toLowerCase().includes(searchLower));
    }

    if (status) {
      const now = new Date();
      if (status.toLowerCase() === 'upcoming') {
        const threeMonthsLater = new Date();
        threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
        metadata = metadata.filter(doc => {
          const nextReviewDate = new Date(doc.nextReview);
          return nextReviewDate >= now && nextReviewDate <= threeMonthsLater;
        });
      } else if (status.toLowerCase() === 'overdue') {
        metadata = metadata.filter(doc => {
          const nextReviewDate = new Date(doc.nextReview);
          return nextReviewDate < now;
        });
      }
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(metadata));

  } else if (req.method === 'POST' && pathname === '/upload') {
    const form = new formidable.IncomingForm({ uploadDir: UPLOAD_DIR, keepExtensions: true });

    form.parse(req, (err, fields, files) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error parsing the files' }));
        return;
      }

      const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;

      const metadata = readMetadata();

      metadata.push({
        id: Date.now(),
        name: safeValue(fields.name) || 'Unnamed Document',
        type: safeValue(fields.type) || 'Unknown',
        department: safeValue(fields.department) || 'General',
        lastReview: safeValue(fields.lastReview) || null,
        nextReview: safeValue(fields.nextReview) || null,
        status: safeValue(fields.status) || 'Active',
        filename: uploadedFile.newFilename || uploadedFile.originalFilename,
        originalFilename: uploadedFile.originalFilename,
        uploadDate: new Date().toISOString()
      });

      writeMetadata(metadata);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        message: 'File uploaded successfully',
        document: metadata[metadata.length - 1]
      }));
    });

  } else if (req.method === 'GET' && pathname.startsWith('/files/')) {
    const filename = pathname.split('/files/')[1];
    const filepath = path.join(UPLOAD_DIR, filename);

    fs.stat(filepath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'File not found' }));
        return;
      }

      const fileStream = fs.createReadStream(filepath);
      const ext = path.extname(filename).toLowerCase();

      const mimeTypes = {
        '.pdf': 'application/pdf',
        '.txt': 'text/plain',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg'
      };

      res.writeHead(200, {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${encodeURIComponent(filename)}"`
      });

      fileStream.on('error', () => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error streaming file' }));
      });

      fileStream.pipe(res);
    });

  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  }
});

server.listen(PORT);
