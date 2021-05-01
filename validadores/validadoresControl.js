import Usuarios from "../models/Usuarios.js";

//verificar si la contraseña si es igual
const verificaConfirmar = async (confirmar,{req}) => {
  if (confirmar!== req.body.password) {
    throw new Error(`El reconfirmar ${confirmar} No coincide con el pasword`);
  }
};

const verificarEmail=async(email)=>{
    
     const existeEmail = await Usuarios.findOne({ email });
     if (existeEmail) {
       throw new Error(`El correo ${email} Este correo ya esta registrado`);
     }
}

const verificarExisteEmail = async (email) => {
  const existeEmail = await Usuarios.findOne({ email });
  if (!existeEmail) {
    throw new Error(`El correo ${email} no existe`);
  }
};

export { verificaConfirmar, verificarEmail, verificarExisteEmail };