import storage from "./storage.js";
import multer from "multer";

const imageUpload = (imageFolder) => multer({ storage: storage(imageFolder) });

export default imageUpload;
