
class Tarea {
  constructor(idProyecto, nombreTarea, descripcionTarea, fechaEntrega, fechaCreacion) {

    this._idProyecto = idProyecto;
    this._nombreTarea = nombreTarea;
    this._descripcionTarea = descripcionTarea;
    this._fechaEntrega = fechaEntrega;
    this._fechaCreacion = fechaCreacion;
  }

  get fechaCreacion() {
    return this._fechaCreacion;
  }

  set fechaCreacion(value) {
    this._fechaCreacion = value;
  }

  get fechaEntrega() {
    return this._fechaEntrega;
  }

  set fechaEntrega(value) {
    this._fechaEntrega = value;
  }



  get idProyecto() {
    return this._idProyecto;
  }

  set idProyecto(value) {
    this._idProyecto = value;
  }

  get nombreTarea() {
    return this._nombreTarea;
  }

  set nombreTarea(value) {
    this._nombreTarea = value;
  }

  get descripcionTarea() {
    return this._descripcionTarea;
  }

  set descripcionTarea(value) {
    this._descripcionTarea = value;
  }
}

module.exports = Tarea;