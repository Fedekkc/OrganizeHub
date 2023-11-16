class Proyecto {
  constructor(idCreador, nombreProyecto, cantidadMiembros, fechaCreacion, descripcionProyecto, fechaUltModificacion) {
    
    this._idCreador = idCreador;
    this._nombreProyecto = nombreProyecto;
    this._cantidadMiembros = cantidadMiembros;
    this._fechaCreacion = fechaCreacion;
    this._descripcionProyecto = descripcionProyecto;
    this._fechaUltModificacion = fechaUltModificacion;
  }



  get idCreador() {
    return this._idCreador;
  }

  set idCreador(value) {
    this._idCreador = value;
  }

  get nombreProyecto() {
    return this._nombreProyecto;
  }

  set nombreProyecto(value) {
    this._nombreProyecto = value;
  }

  get cantidadMiembros() {
    return this._cantidadMiembros;
  }

  set cantidadMiembros(value) {
    this._cantidadMiembros = value;
  }

  get fechaCreacion() {
    return this._fechaCreacion;
  }

  set fechaCreacion(value) {
    this._fechaCreacion = value;
  }

  get descripcionProyecto() {
    return this._descripcionProyecto;
  }

  set descripcionProyecto(value) {
    this._descripcionProyecto = value;
  }

  get fechaUltModificacion() {
    return this._fechaUltModificacion;
  }

  set fechaUltModificacion(value) {
    this._fechaUltModificacion = value;
  }
}

module.exports = Proyecto;