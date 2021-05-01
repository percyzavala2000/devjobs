
import {Router} from 'express';
import {
  mostrarPaginaPanel,
  paginaInicio,
  mostrarCandidatos,
} from "../controllers/controller.paginas.js";
import verificarUsuario from '../middlewares/verificarUsuario.js';
const rutas=Router();

const rutasPaginas=()=>{
    rutas.get('/',paginaInicio);
    rutas.get("/administracion",verificarUsuario,mostrarPaginaPanel);
    rutas.get("/candidatos/:id",verificarUsuario, mostrarCandidatos);

    return rutas;
};


export default rutasPaginas;