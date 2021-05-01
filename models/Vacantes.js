import mongoose from "mongoose";
import slug from "slug";
import shortid from "shortid";

const { Schema } = mongoose;

const modeloVacantes = new Schema({
  titulo: {
    type: String,
    required: "El nombre del vacante es Obligatorio",
    trim: true,
  },
  empresa: {
    type: String,
    trim: true,
  },
  ubicacion: {
    type: String,
    trim: true,
    required: "La ubicacion es obligatorio",
  },
  salario: {
    type: String,
    default: 0,
    triem: true,
  },
  contrato: {
    type: String,
    triem: true,
  },
  descripcion: {
    type: String,
    trim: true,
  },
  url: {
    type: String,
    lowercase: true,
  },
  skills: [String],
  candidatos: [
    {
      nombre: String,
      email: String,
      cv: String,
    },
  ],
  autor: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: "El autor es obligatorio",
  },
});
modeloVacantes.pre("save", function (next) {
  //crearUrl
  const url = slug(this.titulo);
  this.url = `${url}-${shortid.generate()}`;

  next();
});
//crear un undice
modeloVacantes.index({titulo:'text'});



const Vacantes = mongoose.model("Vacante", modeloVacantes);

export default Vacantes;
