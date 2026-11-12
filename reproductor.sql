-- Base de práctica. Ejecutar sobre una instalación local.
CREATE DATABASE IF NOT EXISTS reproductor_sql CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE reproductor_sql;

CREATE TABLE IF NOT EXISTS usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS cancion (
  id_cancion INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  artista VARCHAR(100) NOT NULL,
  duracion_seg INT NOT NULL
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS lista (
  id_lista INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  id_usuario INT NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS lista_cancion (
  id_lista INT NOT NULL,
  id_cancion INT NOT NULL,
  PRIMARY KEY (id_lista, id_cancion),
  FOREIGN KEY (id_lista) REFERENCES lista(id_lista),
  FOREIGN KEY (id_cancion) REFERENCES cancion(id_cancion)
) ENGINE=InnoDB;

-- Importar una sola vez en una base vacía. Los IDs de ejemplo son fijos.
INSERT INTO usuario (id_usuario,nombre) VALUES (1,'Ana'),(2,'Luis');
INSERT INTO cancion (id_cancion,titulo,artista,duracion_seg) VALUES
(1,'Olimar','Sur',210),(2,'Camino','Norte',185),(3,'Amanecer','Sur',240),
(4,'Lluvia','Norte',175),(5,'Horizonte','Este',225),(6,'Río','Este',195);
INSERT INTO lista (id_lista,nombre,id_usuario) VALUES (1,'Favoritas',1),(2,'Para estudiar',2),(3,'Pendientes',1);
INSERT INTO lista_cancion (id_lista,id_cancion) VALUES (1,1),(1,3),(1,5),(2,2),(2,3),(2,4);
