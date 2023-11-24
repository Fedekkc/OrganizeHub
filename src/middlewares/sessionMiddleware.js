// Middleware de sesión mejorado
function sessionMiddleware(req, res, next) {
  if (req.session && req.session.user) {
    // Si hay una sesión y un usuario en la sesión, continúa con la solicitud
    res.locals.user = req.session.user;
    res.locals.projects = req.session.projects;
    console.log("[+] Authenticated user: " + res.locals.user.username);
    console.log("[+] Projects: " + res.locals.projects);
    next(req.session.user);
  } else {
    res.redirect('/login'); // Ajusta la ruta según tu estructura de rutas
  }
}

module.exports = sessionMiddleware;

