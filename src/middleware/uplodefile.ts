import multer from "multer";
import { v4 as uuidv4 } from "uuid";
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public');
    }
    ,
    filename: (req, file, cb) => {

        const fileName = file.originalname.toLowerCase();
        cb(null, uuidv4() + '-' + Date.now() + '-' + fileName)
    }
});
let upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 10 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false,);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
}).array('profileImg', 8);
export { upload };

