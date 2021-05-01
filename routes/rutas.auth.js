import {Router} from 'express';
import { check } from 'express-validator';
import {
  fromIniciarSesion,
  autenticarUsuario,
  cerrarSesion,
  formRestablecerPassword,
  enviarToken,
  restablecerPassword,
  guardarPassword
} from "../controllers/controller.auth.js";
import { validadorUsuario } from '../middlewares/validationResult.js';
import verificarUsuario from '../middlewares/verificarUsuario.js';
import { verificarExisteEmail } from "../validadores/validadoresControl.js";

const rutas=Router();

const rutasAuth=()=>{
    rutas.get('/iniciar-sesion',fromIniciarSesion);
    rutas.post('/iniciar-sesion',autenticarUsuario);
    rutas.get('/cerrar-sesion',verificarUsuario,cerrarSesion);
    rutas.get("/restablecer-password",formRestablecerPassword);
    rutas.post(
      "/restablecer-password",
      [
        check("email", "El correo es obligatorio").isEmail(),
        check("email").custom(verificarExisteEmail),
        validadorUsuario,
      ],
      enviarToken
    );
    rutas.get("/restablecer-password/:token",restablecerPassword);
    rutas.post("/restablecer-password/:token",guardarPassword);

    return rutas;
};



export default rutasAuth;