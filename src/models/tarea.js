
class Tarea {
  constructor(idTarea, idProyecto, nombreTarea, descripcionTarea) {
    this._idTarea = idTarea;
    this._idProyecto = idProyecto;
    this._nombreTarea = nombreTarea;
    this._descripcionTarea = descripcionTarea;
  }

  get idTarea() {
    return this._idTarea;
  }

  set idTarea(value) {
    this._idTarea = value;
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
