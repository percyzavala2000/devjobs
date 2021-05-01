import path from "path";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
const __dirname = path.resolve();

class subirImagen {
  storage = multer.StorageEngine;

  constructor(archivo, extensionesPermitidas = [], carpeta = "") {
    this.archivo = archivo;
    this.extensionesPermitidas = extensionesPermitidas;
    this.carpeta = carpeta;
    this.storage = multer.diskStorage({
      destination: (req, archivo, callback) => {
        const extension = archivo.mimetype.split("/")[1];
        if (!this.extensionesPermitidas.includes(extension)) {
          return `La extensio ${extension} no esta permitido ${this.extensionesPermitidas}`;
        }

        callback(null, path.join(__dirname, "./public/uploads/", this.carpeta));
      },

      filename: (req, archivo, callback) => {
        const extension = archivo.mimetype.split("/")[1];
        callback(null, `${uuidv4()}.${extension}`);
      },
    });

    this.fileFilter = (req, archivo, cb) => {
      const extension = archivo.mimetype.split("/")[1];

      if (this.extensionesPermitidas.includes(extension)) {
        cb(null, true);
      } else {
        cb(new Error("Formato no valido!"));
      }
    };
  }
}

export default subirImagen;
