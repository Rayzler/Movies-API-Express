# Movies API with Node.js and Express

Puedes elegir entre diferentes formas de almacenar los datos.

### Bases de datos implementadas
* MySQL
* Archivo local JSON

Para instalar las dependencias:

```bash
mpm install
```

Para ejecutar con archivo local JSON:

```bash
npm run dev:local
```

Para ejecutar con MySQL:

```bash
npm run dev:mysql
```

## MySQL

### Creación de la base de datos

```sql
DROP SCHEMA IF EXISTS movies_db;
CREATE SCHEMA movies_db;
USE movies_db;

CREATE TABLE movie
(
    id       BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    title    VARCHAR(255)           NOT NULL,
    year     INT                    NOT NULL,
    director VARCHAR(255)           NOT NULL,
    duration INT                    NOT NULL,
    poster   TEXT,
    rate     DECIMAL(2, 1) UNSIGNED NOT NULL
);

CREATE TABLE genre
(
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE movie_genre
(
    movie_id BINARY(16) REFERENCES movie (id),
    genre_id INT REFERENCES genre (id),
    PRIMARY KEY (movie_id, genre_id)
);

INSERT INTO genre (name)
VALUES ('Action'),
       ('Adventure'),
       ('Animation'),
       ('Biography'),
       ('Comedy'),
       ('Crime'),
       ('Drama'),
       ('Family'),
       ('Fantasy'),
       ('History'),
       ('Horror'),
       ('Music'),
       ('Mystery'),
       ('Romance'),
       ('Sci-Fi'),
       ('Sport'),
       ('Thriller'),
       ('War'),
       ('Western');
```

### Conexión a MySQL
Para conectarse a MySQL, se debe crear un archivo `.env` en la raíz del proyecto con las siguientes variables de entorno:

```bash
MYSQL_HOST
MYSQL_USER
MYSQL_PASSWORD
MYSQL_DATABASE
MYSQL_PORT
```
