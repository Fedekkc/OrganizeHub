// Middleware de sesión mejorado
function sessionMiddleware(req, res, next) {
  if (req.session && req.session.user) {
    // Si hay una sesión y un usuario en la sesión, continúa con la solicitud
    res.locals.user = req.session.user;
    next(req.session.user);
  } else {
    // Si no hay sesión o usuario en la sesión, redirige a la página de inicio de sesión
    res.redirect('/login'); // Ajusta la ruta según tu estructura de rutas
  }
}

module.exports = sessionMiddleware;

