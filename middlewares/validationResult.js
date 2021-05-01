import { validationResult } from "express-validator";
import Usuarios from "../models/Usuarios.js";
import Vacantes from "../models/Vacantes.js";


const validadorUsuario = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    //si hay errores
    req.flash(
      "error",
      errores.errors.map((error) => error.msg)
    );
    res.render("crear-cuenta", {
      nombrePagina: " Crea Tu cuenta en devJobs",
      tagLine:
        "Comienza  apublicar tus vacantes gratis, solo debes crear una cuenta",
      mensajes: req.flash(),
    });

    return;
  }

  next();
};

const validadorUsuarioPerfil =async (req, res, next) => {

  const usuarios = await Usuarios.find(req.user).lean();
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    //si hay errores
    req.flash(
      "error",
      errores.errors.map((error) => error.msg)
    );
    res.render("editar-perfil", {
      nombrePagina: "Edita tu perfil en devJovs",
      usuarios,
      cerrarSesion: true,
      nombre: req.user.nombre,
    });

    return;
  }

  next();
};

const validadorVacante = (req, res, next) => {
  
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    //si hay errores
    req.flash(
      "error",
      errores.errors.map((error) => error.msg)
    );
    res.render("nueva-vacante", {
      nombrePagina: "Nueva Vacante",
      tagLine: "Llenar el formulario y publicar tu vacante",
      cerrarSesion: true,
      nombre: req.user.nombre,
      mensajes:req.flash()
    });  

    return;
  }

  next();
};

const validadorCandidato =async (req, res, next) => {
   const { url } = req.params;
  const vacante = await Vacantes.findOne({ url }).lean();
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    //si hay errores
    req.flash(
      "error",
      errores.errors.map((error) => error.msg)
    );
    res.render("vacante", {
      vacante,
      nombrePagina: vacante.titulo,
      barra: true,
    });

    return;
  }

  next();
};

export { validadorUsuario, validadorVacante, validadorUsuarioPerfil,validadorCandidato };
