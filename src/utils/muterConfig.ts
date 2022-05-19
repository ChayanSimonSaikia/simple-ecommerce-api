import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import moment from "moment";

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "images"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname.slice(0, 6) +
        "-" +
        moment().format("DDMMYYYYhhmmssss") +
        "." +
        file.mimetype.split("/")[1]
    );
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const imageUpload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
});
