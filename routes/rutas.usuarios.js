import { Router, request } from "express";
import flash from "connect-flash";
import {
  agregarCuenta,
  formCrearCuenta,
  formEditarPerfil,
  editarPerfil,
} from "../controllers/controller.usuarios.js";
import { check } from "express-validator";

import {
  verificaConfirmar,
  verificarEmail,
} from "../validadores/validadoresControl.js";
import {
  validadorUsuario,
  validadorUsuarioPerfil,
} from "../middlewares/validationResult.js";
import verificarUsuario from "../middlewares/verificarUsuario.js";
import multer from "multer";
import subirImagen from "../helpers/subeArchivo.js";

let upload = multer({
  limits: { fileSize: 100000 },
  storage: new subirImagen(request.files, ["jpg", "jpeg",'png'], "perfiles").storage,
  fileFilter: new subirImagen(null, ["jpg", "jpeg",'png'], null).fileFilter,
}).single("imagen");

const rutas = Router();
//crear cuenta
const rutasUsuarios = () => {
  rutas.get("/crear-cuenta", formCrearCuenta);
  rutas.post(
    "/crear-cuenta",
    [
      check("nombre", "El Nombre es obligatorio").not().isEmpty().escape(),
      check("email", "El correo es obligatorio").isEmail(),
      check("email").custom(verificarEmail),
      check("password", "La contraseña es obligatorio").not().isEmpty(),
      check("confirmar", "Es diferente al pasword").custom(verificaConfirmar),
      validadorUsuario,
    ],
    agregarCuenta
  );
  rutas.get("/editar-perfil", verificarUsuario, formEditarPerfil);

  rutas.post(
    "/editar-perfil",
    [
      verificarUsuario,
      check("nombre", "El Nombre es obligatorio").not().isEmpty().escape(),
      check("email", "El correo es obligatorio").isEmail(),
      validadorUsuarioPerfil,
      (req, res, next) => {
        upload(req, res, function (error) {
          if (error) {
            if (error instanceof multer.MulterError) {
              // A Multer error occurred when uploading
              if (error.code === "LIMIT_FILE_SIZE") {
                req.flash("error", "El archivo es muy grande: Maximo 100kb");
              }
            } else {
              // An unknown error occurred when uploadin
              req.flash("error", error.message);
              res.redirect("/administracion");
              return;
            }
          } else {
            next();
          }
          next();
        });
        next();
      },
    ],
    editarPerfil
  );

  return rutas;
};

export default rutasUsuarios;
