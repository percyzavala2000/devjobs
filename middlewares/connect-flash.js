
import flash from 'connect-flash';

const conectarFlash=(req,res,next)=>{
    res.locals.mensajes = req.flash();
    next();
};

export default conectarFlash;