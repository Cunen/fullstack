import multer from "multer";

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "localimages");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const multerProvider = multer({
  storage: fileStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("image");

export default multerProvider;
