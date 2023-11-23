CREATE SCHEMA IF NOT EXISTS `schemaOH`;

use `schemaOH`;



CREATE TABLE IF NOT EXISTS Usuarios (
    idUsuario INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    admin BOOLEAN NOT NULL,
    registerDate DATETIME,
    lastLogin DATETIME
);



-- Creación de la tabla de proyectos
CREATE TABLE IF NOT EXISTS Proyectos (
    idProyecto INT AUTO_INCREMENT PRIMARY KEY,
    idCreador INT,
    nombreProyecto VARCHAR(255) NOT NULL,
    cantidadMiembros INT,
    fechaCreacion DATETIME,
    descripcionProyecto TEXT,
    fechaUltModificacion DATETIME,
    foreign key(idCreador) REFERENCES Usuarios(idUsuario));
    



-- Creación de la tabla de tareas
CREATE TABLE IF NOT EXISTS Tareas (
    idTarea INT AUTO_INCREMENT PRIMARY KEY,
    idProyecto INT,
    nombreTarea VARCHAR(255) NOT NULL,
    descripcionTarea TEXT,
    fechaEntrega DATE,
    fechaCreacion DATE,
    foreign key (idProyecto) REFERENCES Proyectos(idProyecto));


-- Creación de la tabla de subtareas
CREATE TABLE IF NOT EXISTS Subtareas (
    idSubtarea INT AUTO_INCREMENT PRIMARY KEY,
    idTarea INT,
    nombreSubtarea VARCHAR(255) NOT NULL,
    descripcionSubtarea TEXT,
    foreign key(idTarea) REFERENCES Tareas(idTarea));
    
CREATE TABLE IF NOT EXISTS GrupoDeTrabajo (
	idGrupo INT AUTO_INCREMENT PRIMARY KEY,
    idProyecto INT NOT NULL,
    nombreGrupo VARCHAR(30),
    descripcionGrupo VARCHAR(255),
    fechaCreacion date,
    foreign key(idProyecto) REFERENCES Proyectos(idProyecto));
    
    
CREATE TABLE IF NOT EXISTS Usuario_Grupo (
	idGrupo INT NOT NULL primary key,
    idUsuario INT NOT NULL,
    fechaIngreso date not null,
    foreign key(idGrupo) REFERENCES GrupoDeTrabajo(idGrupo));

CREATE TABLE IF NOT EXISTS Usuario_Proyecto (
idProyecto INT NOT NULL,
idUsuario INT NOT NULL,
fechaIngreso DATE NOT NULL,
rol VARCHAR(30),
foreign key(idProyecto) REFERENCES Proyectos(idProyecto));

CREATE TABLE IF NOT EXISTS Registro_Mensual(
idProyecto INT NOT NULL,
cambio TEXT NOT NULL,
fechaCambio DATE NOT NULL,
FOREIGN KEY(idProyecto) REFERENCES Proyectos(idProyecto));






SELECT * FROM Usuarios;
SELECT * FROM Usuario_Proyecto;
SELECT * FROM Usuarios INNER JOIN Usuario_Proyecto ON Usuarios.idUsuario = Usuario_Proyecto.idUsuario;
SELECT * FROM Proyectos;
SELECT * FROM Tareas;
SELECT * FROM GrupoDeTrabajo;
SELECT * FROM Registro_Mensual;
SELECT * FROM Proyectos INNER JOIN Registro_Mensual ON Proyectos.idProyecto = Registro_Mensual.idProyecto;
SELECT * FROM Proyectos INNER JOIN Usuarios ON Usuarios.idUsuario = Proyectos.idCreador;

    


