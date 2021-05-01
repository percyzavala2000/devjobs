import passport from 'passport';
import Usuarios from '../models/Usuarios.js';
 import crypto from 'crypto';
 import flash from 'connect-flash';
import enviarEmail from '../handlers/email.js';

const fromIniciarSesion=(req,res)=>{
    res.render('iniciar-sesion',{
        nombrePagina:'Iniciar Sesion devJobs'
    })
};

const autenticarUsuario=passport.authenticate('local',{
    successRedirect:'/administracion',
    failureRedirect:'/iniciar-sesion',
    failureFlash:true,
    badRequestMessage:'Ambos campos son obligatorios'

});

const cerrarSesion=(req,res)=>{
    req.logout();
    req.flash('correcto','Se cerro la sesion correctamente');

    return res.redirect('/iniciar-sesion');

}

const formRestablecerPassword=(req,res,next)=>{

    res.render("restablecer-password",{
        nombrePagina:'restablecer tu contraseña',
        tagLine:'Si ya tienes una cuenta pero olvidaste tu contraseña coloca tu email'

    });

};

const enviarToken=async (req,res)=>{
    const usuario= await Usuarios.findOne({email:req.body.email});
    usuario.token=crypto.randomBytes(20).toString('hex');
    usuario.expira=Date.now()+ 360000059;
    await usuario.save();

    const resetUrl=`http://${req.headers.host}/restablecer-password/${usuario.token}`;

     enviarEmail({
        usuario,
        subject:'Password Reset',
        resetUrl,
        archivo:'reset'
    })

    req.flash('correcto','Revisa tu email para las indicaciones');
    res.redirect('/iniciar-sesion');
    
    

}
//valida si el token es valido y el usuario existe
const restablecerPassword=async (req,res)=>{
    const usuario=await Usuarios.findOne({
        token:req.params.token,
        expira:{
            $gt:Date.now()
        }
    });

    if(!usuario){
        req.flash("error", "El formulario ya no es valido intente de nuevo");
       return res.redirect("/restablecer-password");
    }

    //todo bien mostrar el formulario
    res.render('nuevo-password',{
        nombrePagina:'Nuevo password',

    })
}
//almacena el nuevo password en la based de datos
const guardarPassword=async (req,res)=>{
    const usuario = await Usuarios.findOne({
      token: req.params.token,
      expira: {
        $gt: Date.now(),
      },
    });
    if (!usuario) {
      req.flash("error", "El formulario ya no es valido intente de nuevo");
      return res.redirect("/restablecer-password");
    }

   usuario.password=req.body.password;
    usuario.token=undefined;
    usuario.expira=undefined;

    await usuario.save();

    //redirigir
   req.flash("correcto", "Passwor modificado correctamente");
   res.redirect("/iniciar-sesion");


}



export {
  fromIniciarSesion,
  autenticarUsuario,
  cerrarSesion,
  formRestablecerPassword,
  enviarToken,
  restablecerPassword,
  guardarPassword
};