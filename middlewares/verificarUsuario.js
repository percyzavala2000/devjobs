const verificarUsuario = (req, res, netx) => {
   
  if (req.isAuthenticated()) {
    return netx(); //estan autenticados
  }

  res.redirect("/iniciar-sesion");
};

export default verificarUsuario;
