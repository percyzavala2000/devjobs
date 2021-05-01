
import passport from 'passport';
import {Strategy} from 'passport-local';
import Usuarios from '../models/Usuarios.js';

passport.use(new Strategy(
    {
    usernameField:'email',
    passwordField:'password'

},
async(email,password,done)=>{
    const usuario=await Usuarios.findOne({email});
    if(!usuario){ return done(null,false,{message:'usuario no existente'})}

    //si el usuario existe
    const verificarPass=usuario.compararPassword(password);
    if(!verificarPass){return done(null,false,{message:'Password Incorrecto'})}

    //usuario existe y password es correcto
    return done(null,usuario);

}
));

passport.serializeUser((usuario,done)=>{return done(null,usuario._id)})
passport.deserializeUser(async(id,done)=>{
    const usuario=await Usuarios.findById(id).exec();
    return done(null,usuario);
});

export default passport;

