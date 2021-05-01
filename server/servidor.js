import express from "express";
import rutasPaginas from "../routes/rutas.paginas.js";
import exphbs from "express-handlebars";
import conexionDB from "../database/conexiondb.js";
import rutasVacantes from "../routes/rutas.vacantes.js";
import skills from "../helpers/handlebars.js";
import rutasUsuarios from "../routes/rutas.usuarios.js";
import flash from 'connect-flash';
import createError from 'http-errors';
import conectarFlash from "../middlewares/connect-flash.js";
import cookieParser from 'cookie-parser';
import session from 'express-session';
import rutasAuth from "../routes/rutas.auth.js";
import passport from "../database/passport.js";
import dotenv from 'dotenv';
dotenv.config();

class Servidor {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 4000;
    this.host = process.env.HOST || "0.0.0.0";
    this.connectarBD();
    this.middlewares();
    this.vistaHbs();
    this.configure();
    this.app.use(conectarFlash);
    this.routes();
    this.errores();
    this.listen();
  }
  connectarBD() {
    conexionDB();
  }

  middlewares() {
    this.app.use(express.static("public"));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }

  configure() {
    this.app.use(flash());
    this.app.use(cookieParser());
    this.app.use(
      session({
        secret: process.env.SECRETO,
        resave: true,
        saveUninitialized: true,
      })
    );
    this.passportInicio();
  }; 
  passportInicio(){
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }
  vistaHbs() {
    this.app.engine(
      "handlebars",
      exphbs({ defaultLayout: "layout", helpers: skills })
    );
    this.app.set("view engine", "handlebars");
  }

  routes() {
    this.app.use("/", rutasPaginas());
    this.app.use("/", rutasVacantes());
    this.app.use("/", rutasUsuarios());
    this.app.use('/',rutasAuth());
  }
  errores(){
    //404 pagina no existe
    this.app.use((req,res,next)=>{
      next(createError(404, "No Encontrado"));
    })
    //administracion de errores
    this.app.use((error,req,res,next)=>{
      res.locals.mensaje=error.message;
      const status=error.status || 500;
      res.locals.status=status;
      res.status(status);
      res.render('error')
    })
  }

  listen() {
    this.app.listen(this.port, this.host, () => {
      console.log("Servidor conectado", this.port);
    });
  }
}

export default Servidor;
