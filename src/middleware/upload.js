const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// Multer disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/images');
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext)
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase()
      .slice(0, 40);
    const unique = `${base}-${Date.now()}${ext}`;
    cb(null, unique);
  },
});

// File filter — images only
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowed.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, png, webp, gif) are allowed.'), false);
  }
};

const maxSize = parseInt(process.env.MAX_FILE_SIZE_MB || '10') * 1024 * 1024;

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxSize },
});

module.exports = upload;
