// authenticationMiddleware.js

function authMiddleware(req, res, next) {
    // Verifica si el usuario está autenticado
    if (req.session && req.session.user) {
      // Si el usuario está autenticado, continúa con la solicitud
      res.locals.user = req.session.user;
      res.locals.projects = req.session.projects;      
      console.log("[+] Authenticated user: " + res.locals.user.username);
      console.log("[+] Projects: " + res.locals.projects);
      



      next();
    } else {
      // Si el usuario no está autenticado, redirige a la página de inicio de sesión
      res.redirect('/login'); // Ajusta la ruta según tu estructura de rutas
    }
  }
  
  module.exports = authMiddleware;
  