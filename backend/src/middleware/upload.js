import fs from 'fs';
import multer from 'multer';
import path from 'path';

const ensureDir = (dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };

const rfqStorage = () => {
  const uploadDir = path.join(process.cwd(), 'uploads', 'rfqs');
  ensureDir(uploadDir);
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  });
};

export const rfqUpload = multer({ storage: rfqStorage() });

export default rfqUpload;
