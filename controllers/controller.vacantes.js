import Vacantes from "../models/Vacantes.js";
import flash from "connect-flash";

const formNuevoVacante = (req, res) => {
  res.render("nueva-vacante", {
    nombrePagina: "Nueva Vacante",
    tagLine: "Llenar el formulario y publicar tu vacante",
    cerrarSesion: true,
    nombre: req.user.nombre,
    imagen: req.user.imagen,
  });
};

const agregarVacante = async (req, res) => {
  const vacante = new Vacantes(req.body);

  //usuario autor vacante
  vacante.autor = req.user._id;
  //crear arreglo de habilidades (skills)
  vacante.skills = req.body.skills.split(",");

  //almaenar en la base de datos
  const nuevoVacante = await vacante.save();
  //redireccionar
  res.redirect(`/vacantes/${nuevoVacante.url}`);
};

const mostrarUnaVacante = async (req, res, next) => {
  const { url } = req.params;
  const vacante = await Vacantes.findOne({ url }).populate("autor").lean();

  //si no hay resultados
  if (!vacante) {
    return next();
  }

  res.render("vacante", {
    vacante,
    nombrePagina: vacante.titulo,
    barra: true,
  });
};

const formEditarVacante = async (req, res, next) => {
  const { url } = req.params;
  const vacante = await Vacantes.findOne({ url }).lean();
  //si no hay resultados
  if (!vacante) {
    return next();
  }
  res.render("editar-vacante", {
    vacante,
    nombrePagina: `Editar - ${vacante.titulo}`,
    cerrarSesion: true,
    nombre: req.user.nombre,
  });
};

const guardarVacanteEditado = async (req, res) => {
  const { ...resto } = req.body;
  resto.skills = req.body.skills.split(",");

  const vacante = await Vacantes.findOneAndUpdate(
    { url: req.params.url },
    resto,
    { new: true }
  );
  res.redirect(`/vacantes/${vacante.url}`);
};

const eliminarVacante = async (req, res) => {
  const { id } = req.params;
  const vacante = await Vacantes.findById(id);

  if (vacante.autor.equals(req.user._id)) {
    vacante.remove();
    res.status(200).send("Vacante Eliminada Correctamente");
  } else {
    res.status(403).send("Error");
  }
};

const contactarVacantes = async (req, res, next) => {
  const vacante = await Vacantes.findOne({ url: req.params.url });
  console.log(vacante);
  // si existe la vacante
  if (!vacante) return next();
  // si es todo bien construi el objeto

  const nuevoCandidato = {
    nombre: req.body.nombre,
    email: req.body.email,
    cv: req.file.filename,
  };
  vacante.candidatos.push(nuevoCandidato);
  await vacante.save();

  //mensaje y redireccion
  req.flash("correcto", "Se envio tu curriculum correctamente");
  res.redirect("/");
};

const buscarVacantes = async (req, res) => {
  const vacantes = await Vacantes.find({ $text: { $search: req.body.q } });

  //mostrar las vacantes
  res.render("inicio", {
    nombrePagina: `Resultado para la busqueda:${req.body.q}`,
    barra: true,
    vacantes,
  });
};

export {
  formNuevoVacante,
  agregarVacante,
  mostrarUnaVacante,
  formEditarVacante,
  guardarVacanteEditado,
  eliminarVacante,
  contactarVacantes,
  buscarVacantes,
};
