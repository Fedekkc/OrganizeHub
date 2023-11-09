
class Tarea {
  constructor(idSubtarea, idTarea, nombreSubtarea, descripcionSubtarea) {
    this._idSubtarea = idSubtarea;
    this._idTarea = idTarea;
    this._nombreSubtarea = nombreSubtarea;
    this._descripcionSubtarea = descripcionSubtarea;
  }

  get idTarea() {
    return this._idTarea;
  }

  set idTarea(value) {
    this._idTarea = value;
  }

  get nombreSubtarea() {
    return this._nombreSubtarea;
  }

  set nombreSubtarea(value) {
    this._nombreSubtarea = value;
  }

  get descripcionSubtarea() {
    return this._descripcionSubtarea;
  }

  set descripcionSubtarea(value) {
    this._descripcionSubtarea = value;
  }
}
