import Usuarios from "../models/Usuarios.js";
import flash from "connect-flash";
import bcrypt from "bcrypt";

const formCrearCuenta = (req, res) => {
  res.render("crear-cuenta", {
    nombrePagina: " Crea Tu cuenta en devJobs",
    tagLine:
      "Comienza  apublicar tus vacantes gratis, solo debes crear una cuenta",
  });
};

const agregarCuenta = async (req, res) => {
  const { ...resto } = req.body;
  /*  const saltoRondas=10;
  const pass=resto.password;
  const salt = bcrypt.genSaltSync(saltoRondas);
  const hash = bcrypt.hashSync(pass,salt);
  resto.password=hash;
  resto.confirmar=hash  */
  const usuarios = new Usuarios(resto);
  const usuarioGuardado = await usuarios.save();

  if (!usuarioGuardado) {
    return next();
  }

  res.redirect("iniciar-sesion");
};

const formEditarPerfil = async (req, res) => {
  const usuario = req.user;

  const usuarios = await Usuarios.find(usuario).lean();

  res.render("editar-perfil", {
    nombrePagina: "Edita tu perfil en devJovs",
    usuarios,
    cerrarSesion: true,
    nombre: req.user.nombre,
    imagen: req.user.imagen,
  });
};
//
const editarPerfil = async (req, res) => {
  const { password, ...resto } = req.body;

  if (password) {
    const saltoRondas = 10;
    const pass = password;
    const salt = bcrypt.genSaltSync(saltoRondas);
    const hash = bcrypt.hashSync(pass, salt);
    resto.password = hash;
    resto.confirmar = hash;
  }
  
  if (req.file) {
    resto.imagen = req.file.filename;
  }

  console.log(req.body);
  console.log(req.file);
  
  

   await Usuarios.findOneAndUpdate(
    { _id: req.user._id },
    resto,
    { new: true }
  );

  req.flash("correcto", "Cambios guardados correctamente");

  res.redirect("administracion");
};

export { formCrearCuenta, agregarCuenta, formEditarPerfil, editarPerfil };
