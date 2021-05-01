
import Vacantes from "../models/Vacantes.js";

const paginaInicio=async(req,res,next)=>{
    const vacantes = await Vacantes.find().lean();
    if(!vacantes){return next()};

    res.render("inicio", {
      nombrePagina: "devJobs",
      tagLine: "Encuentra y Publica trabajos para desarrolladores web",
      barra: true,
      boton: true,
      vacantes
    });
};
//
const mostrarPaginaPanel =async (req, res) => {
  //consultar usuario autenticado
  const vacantes= await Vacantes.find({autor:req.user._id}).lean();

  
  res.render("administracion", {
    nombrePanel: "Panel de administarcion",
    tagLine: "Crear y Administarr Tus vacantes desde aqui",
    cerrarSesion:true,
    nombre:req.user.nombre,
    imagen:req.user.imagen,
    vacantes
  });
};

const mostrarCandidatos=async (req,res,next)=>{
  const vacante = await Vacantes.findById(req.params.id).lean();
  
  if(!vacante.autor==req.user._id.toString()){
    return next();
    
  }
  if(!vacante){return next()}


  res.render("candidatos", {
    nombrePagina: `Candidatos Vacantes ${vacante.titulo}`,
    cerrarSesion: true,
    nombre: req.user.nombre,
    imagen: req.user.imagen,
    candidatos: vacante.candidatos,
  });
  


}


export { paginaInicio, mostrarPaginaPanel, mostrarCandidatos };  