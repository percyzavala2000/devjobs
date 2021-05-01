import mongoose from 'mongoose';
import bcrypt from "bcrypt";

const {Schema}=mongoose;;

const modeloUsuarios = new Schema({
  nombre: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    lowecase: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  imagen: String,
  token: String,
  expira: Date,

  confirmar: {
    type: String,
    trim: true,
    required: true,
  }
});
modeloUsuarios.pre('save',async function(next){
    //si el password esta haseado
    if(!this.isModified('password')){
        return next(); //deten la ejecusion
    }
    //si no esta hasheado
    const hash=await bcrypt.hash(this.password,10);
    this.password=hash;
    next();

});
//autenticar Usuarios
modeloUsuarios.methods = {
  compararPassword:function(password){
      return bcrypt.compareSync(password,this.password);
  }
};

const Usuarios=mongoose.model('Usuario',modeloUsuarios);

export default Usuarios;