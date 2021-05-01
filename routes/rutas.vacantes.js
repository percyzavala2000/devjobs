import { Router,request } from "express";
import { check } from "express-validator";
import flash from "connect-flash";
import {
  formNuevoVacante,
  agregarVacante,
  mostrarUnaVacante,
  formEditarVacante,
  guardarVacanteEditado,
  eliminarVacante,
  contactarVacantes,
  buscarVacantes,
} from "../controllers/controller.vacantes.js";
import {
  validadorVacante,
  validadorCandidato,
} from "../middlewares/validationResult.js";
import verificarUsuario from "../middlewares/verificarUsuario.js";

import multer from "multer";
import subirImagen from "../helpers/subeArchivo.js";

let upload = multer({
  limits: { fileSize: 100000 },
  storage: new subirImagen(request.files, ["pdf"], "cv").storage,
  fileFilter: new subirImagen(null, ["pdf"], null).fileFilter,
}).single("cv");

const rutas = Router();
const rutasVacantes = () => {
  //crear Vacantes
  rutas.get("/vacantes/nueva", verificarUsuario, formNuevoVacante);
  rutas.post(
    "/vacantes/nueva",
    [
      verificarUsuario,
      check("titulo", "El titulo es obligatorio").not().isEmpty().escape(),
      check("empresa", "La empresa es obligatorio").not().isEmpty().escape(),
      check("ubicacion", "La Ubicacion es obligatorio")
        .not()
        .isEmpty()
        .escape(),
      check("ubicacion", "La Ubicacion es obligatorio")
        .not()
        .isEmpty()
        .escape(),
      check("salario", "El salario es obligatorio").not().isEmpty().escape(),
      check("contrato", "El contrato es obligatorio").not().isEmpty().escape(),
      check("descripcion", "La descripcion es obligatorio")
        .not()
        .isEmpty()
        .escape(),
      validadorVacante,
    ],
    agregarVacante
  );
  //mostrar vacante por singular
  rutas.get("/vacantes/:url", mostrarUnaVacante);
  //editar vacante
  rutas.get("/vacantes/editar/:url", verificarUsuario, formEditarVacante);
  rutas.post("/vacantes/editar/:url", verificarUsuario, guardarVacanteEditado);
  rutas.delete("/vacantes/eliminar/:id", [verificarUsuario], eliminarVacante);

  rutas.post(
    "/vacantes/:url",
    [
      //check("nombre", "El Nombre es obligatorio").not().isEmpty().escape(),
      //check("email", "El correo es obligatorio").isEmail(),
      //check('cv','El curriculun es obligatorio').not().isEmpty(),
      //validadorCandidato,
      (req, res, next) => {
        upload(req, res, function (error) {
          if (error) {
            if (error instanceof multer.MulterError) {
              // A Multer error occurred when uploading
              if (error.code === "LIMIT_FILE_SIZE") {
                req.flash("error", "El archivo es muy grande: Maximo 100kb");
              }else{
                req.flash('error','Errores en multer')
              }
              
            } else {
              // An unknown error occurred when uploadin
              req.flash("error", 'error.message');

            }
            res.redirect("back");
            return;
          } else {
            next();
          }
          next();
        });
       // next();
      },
    ],
    contactarVacantes
  );
  rutas.post('/buscador',buscarVacantes)

  return rutas;
};

export default rutasVacantes;
