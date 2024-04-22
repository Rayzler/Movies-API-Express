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

## Conexión a MySQL
Para conectarse a MySQL, se debe crear un archivo `.env` en la raíz del proyecto con las siguientes variables de entorno:

```bash
MYSQL_HOST
MYSQL_USER
MYSQL_PASSWORD
MYSQL_DATABASE
MYSQL_PORT
```
