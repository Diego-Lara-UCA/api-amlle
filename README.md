<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# API Endpoints

Esta es la documentación de los endpoints de la API, generada a partir de los controladores proporcionados.

## 🔑 Autenticación (Bearer Token)

Todos los endpoints que no estén marcados como `Público` requieren un token de autenticación.
El token debe ser enviado en el encabezado `Authorization` con el formato `Bearer <JWT>`.

---

## 🔐 Autenticación (`/api/auth`)

Endpoints para el manejo de sesiones de usuario.

---

### `POST /api/auth/login`

* **Descripción:** Inicia sesión de un usuario y devuelve un token JWT.
* **Rol Requerido:** `Público`
* **Body (DTO):** `LoginDto`
    ```json
    {
      "name": "string",
      "password": "string"
    }
    ```

---

## 👤 Usuarios (`/api/users`)

Endpoints para la administración de usuarios.

---

### `POST /api/users/create`

* **Descripción:** Crea un nuevo usuario y le asigna una contraseña temporal.
* **Rol Requerido:** `SUPERADMIN`
* **Body (DTO):** `CreateUserDto`
    ```json
    {
      "nombre": "string (max 255)"
    }
    ```

---

### `GET /api/users/all`

* **Descripción:** Obtiene una lista de todos los usuarios.
* **Rol Requerido:** `SUPERADMIN`
* **Body (DTO):** N/A

---

### `GET /api/users/find/:id`

* **Descripción:** Obtiene un usuario específico por su ID.
* **Rol Requerido:** `SUPERADMIN`
* **Body (DTO):** N/A

---

### `PATCH /api/users/update/profile/:id`

* **Descripción:** Actualiza la información del perfil de un usuario.
* **Rol Requerido:** `SUPERADMIN`
* **Body (DTO):** `UpdateUserDto`
    ```json
    {
      "nombre": "string (opcional)"
    }
    ```

---

### `DELETE /api/users/remove/:id`

* **Descripción:** Elimina un usuario de forma permanente.
* **Rol Requerido:** `SUPERADMIN`
* **Body (DTO):** N/A

---

### `GET /api/users/find-by-name`

* **Descripción:** Devuelve el ID del usuario por su nombre.
* **Rol Requerido:** ``
* **Body (DTO):** `CreateUserDto`
    ```json
    {
      "nombre": "string (max 255)"
    }
    ```

---

### `POST /api/users/set-password/:id`

* **Descripción:** Permite a un usuario establecer su contraseña.
* **Rol Requerido:** `ADMIN`, `REGULAR`
* **Body (DTO):** `SetPasswordDto`
    ```json
    {
      "contrasena": "string (min 8 caracteres)"
    }
    ```

---

### `PATCH /api/users/change-role/:id`

* **Descripción:** Cambia el rol de un usuario específico.
* **Rol Requerido:** `SUPERADMIN`
* **Body (DTO):** `ChangeRoleDto`
    ```json
    {
      "rol": "Role (enum)"
    }
    ```

---

## 📚 Libros (`/api/book`)

Endpoints para la administración de libros.

---

### `POST /api/book/create`

* **Descripción:** Crea un nuevo libro.
* **Rol Requerido:** `ADMIN`
* **Body (DTO):** `CreateBookDto`
    ```json
    {
      "name": "string",
      "status": "BookState (enum, opcional)",
      "authorizationDate": "string (ISO 8601 Date, opcional)"
    }
    ```

---

### `GET /api/book/all`

* **Descripción:** Obtiene una lista de todos los libros.
* **Rol Requerido:** `Usuario Autenticado (JWT)`
* **Body (DTO):** N/A

---

### `GET /api/book/find/:id`

* **Descripción:** Obtiene un libro específico por su ID.
* **Rol Requerido:** `Usuario Autenticado (JWT)`
* **Body (DTO):** N/A

---

### `PATCH /api/book/update/:id`

* **Descripción:** Actualiza la información de un libro.
* **Rol Requerido:** `ADMIN`
* **Body (DTO):** `UpdateBookDto`
    ```json
      {
        "name": "string (opcional)",
        "authorizationDate": "string (ISO 8601 Date, opcional)",
        "closingDate": "string (ISO 8601 Date, opcional)"
      }
    ```

---

### `DELETE /api/book/delete/:id`

* **Descripción:** Elimina un libro de forma permanente.
* **Rol Requerido:** `SUPERADMIN`
* **Body (DTO):** N/A

---

### `PATCH /api/book/update-status/:id`

* **Descripción:** Actualiza el estado de un libro (ej. 'ABIERTO', 'CERRADO').
* **Rol Requerido:** `ADMIN`
* **Body (DTO):** `UpdateBookStatusDto`
    ```json
    {
      "status": "BookState (enum)"
    }
    ```

---

## 📖 Volúmenes (`/api/volume`)

Endpoints para la administración de volúmenes (tomos).

---

### `POST /api/volume/create`

* **Descripción:** Crea un nuevo volumen asociado a un libro.
* **Rol Requerido:** `SUPERADMIN`, `ADMIN`, `REGULAR`
* **Body (DTO):** `CreateVolumeDto`
    ```json
    {
      "number": "number (entero positivo)",
      "bookId": "string (UUID)",
      "name": "string (opcional)",
      "pdfSettings": {
        "pageSize": "string",
        "orientation": "portrait | landscape",
        "margins": {
          "top": "number",
          "bottom": "number",
          "left": "number",
          "right": "number"
        },
        "lineHeight": "number",
        "fontSize": "number",
        "enablePageNumbering": "boolean",
        "pageNumberingOffset": "number",
        "pageNumberingPosition": "center | left | right",
        "pageNumberingFormat": "string"
      },
      "status": "VolumeState (enum, opcional)"
    }
    ```

---

### `GET /api/volume/find-all`

* **Descripción:** Obtiene todos los volúmenes (DTO optimizado).
* **Rol Requerido:** `SUPERADMIN`, `ADMIN`, `REGULAR`
* **Body (DTO):** N/A

---

### `GET /api/volume/find-all-by-book/:bookId`

* **Descripción:** Obtiene todos los volúmenes de un libro específico (DTO optimizado).
* **Rol Requerido:** `SUPERADMIN`, `ADMIN`, `REGULAR`
* **Body (DTO):** N/A

---

### `GET /api/volume/find/:id`

* **Descripción:** Obtiene un volumen específico por su ID.
* **Rol Requerido:** `SUPERADMIN`, `ADMIN`, `REGULAR`
* **Body (DTO):** N/A

---

### `PATCH /api/volume/update/:id`

* **Descripción:** Actualiza la información de un volumen.
* **Rol Requerido:** `SUPERADMIN`, `ADMIN`, `REGULAR`
* **Body (DTO):** `UpdateVolumeDto`
    ```json
    {
      "name": "string (opcional)",
      "pdfSettings": {
        "pageSize": "string",
        "orientation": "portrait | landscape",
        "margins": {
          "top": "number",
          "bottom": "number",
          "left": "number",
          "right": "number"
        },
        "lineHeight": "number",
        "fontSize": "number",
        "enablePageNumbering": "boolean",
        "pageNumberingOffset": "number",
        "pageNumberingPosition": "center | left | right",
        "pageNumberingFormat": "string"
      },
      "number": "number (entero positivo, opcional)",
      "pageCount": "number (entero, opcional)",
      "status": "VolumeState (enum, opcional)",
      "authorizationDate": "string (ISO 8601 Date, opcional)",
      "closingDate": "string (ISO 8601 Date, opcional)"
    }
    ```

---

### `PATCH /api/volume/update-status/:id`

* **Descripción:** Actualiza el estado de un volumen.
* **Rol Requerido:** `SUPERADMIN`, `ADMIN`, `REGULAR`
* **Body (DTO):** `UpdateVolumeStatusDto`
    ```json
    {
      "status": "VolumeState (enum)"
    }
    ```

---

### `DELETE /api/volume/delete/:id`

* **Descripción:** Elimina un volumen de forma permanente.
* **Rol Requerido:** `SUPERADMIN`, `ADMIN`, `REGULAR`
* **Body (DTO):** N/A

---

## 📜 Actas y Participantes (`/api/`)

Endpoints para la administración de actas y la gestión de participantes (Propietarios y Substitutos).

### Endpoints de Actas (Minutes)

---

### `POST /api/minutes/create`

* **Descripción:** Crea una nueva acta, asociándola a un volumen.
* **Rol Requerido:** `SUPERADMIN`, `ADMIN`, `REGULAR`
* **Body (DTO):** `CreateMinutesDto`
    ```json
    {
      "volumeId": "string (UUID)",
      "actNumber": "number",
      "name": "string (opcional)",
      "meetingDate": "string (ISO 8601 Date, opcional)",
      "meetingTime": "string (opcional)",
      "type": "MinutesType (enum, opcional)"
    }
    ```

---

### `GET /api/minutes/find-all-by-volume/:volumeId`

* **Descripción:** Obtiene todas las actas de un volumen específico (DTO optimizado).
* **Rol Requerido:** `SUPERADMIN`, `ADMIN`, `REGULAR`
* **Body (DTO):** N/A

---

### `GET /api/minutes/find/:id`

* **Descripción:** Obtiene un acta específica por su ID.
* **Rol Requerido:** `SUPERADMIN`, `ADMIN`, `REGULAR`
* **Body (DTO):** N/A

---

### `PATCH /api/minutes/update/:id`

* **Descripción:** Actualiza la información de un acta y/o su lista de asistencia.
* **Rol Requerido:** `SUPERADMIN`, `ADMIN`, `REGULAR`
* **Body (DTO):** `UpdateMinutesDto`
    ```json
    {
      "actNumber": "number (opcional)",
      "meetingDate": "string (ISO 8601 Date, opcional)",
      "meetingTime": "string (opcional)",
      "agenda": "string (opcional)",
      "bodyContent": "string (opcional)",
      "status": "MinutesType (enum, opcional)",
      "attendanceList": [
        {
          "syndic": "string",
          "secretary": "string",
          "propietarioConvocadoId": "string (UUID)",
          "asistioPropietario": "boolean",
          "substitutoAsistenteId": "string (UUID, opcional)"
        }
      ]
    }
    ```  
---

### `PATCH /api/agreements/update-name-number/:id`

* **Descripción:** Actualiza el nombre (`name`) y el número (`agreementNumber`) de un acuerdo. Si ya existe un acuerdo con esos datos en la misma acta, los intercambia (swap).
* **Rol Requerido:** `SUPERADMIN`, `ADMIN`, `REGULAR`
* **Body (DTO):** `UpdateAgreementNameNumberDto`
    ```json
    {
      "name": "string",
      "agreementNumber": "number"
    }
    ```

---

### `GET /api/minutes/find-all`

* **Descripción:** Obtiene una lista de todas las actas (minutes) del sistema, formateadas con el DTO de respuesta optimizado.
* **Rol Requerido:** `SUPERADMIN`, `ADMIN`, `REGULAR`
* **Body (DTO):** N/A

---

### `DELETE /api/minutes/delete/:id`

* **Descripción:** Elimina un acta de forma permanente.
* **Rol Requerido:** `SUPERADMIN`, `ADMIN`, `REGULAR`
* **Body (DTO):** N/A

---

### `PATCH /api/update-name-number/:id`

* **Descripción:** Actualiza el nombre y número de un acta. Si ya existe un acta con esos datos, los intercambia.
* **Rol Requerido:** `ADMIN`
* **Body (DTO):** `UpdateMinutesNameNumberDto`
    ```json
    {
      "name": "string",
      "actNumber": "number"
    }
    ```

---

### Endpoints de Participantes

Rutas para gestionar las listas maestras de Propietarios y Substitutos (Suplentes).

---

### `POST /api/participants/propietarios`

* **Descripción:** Crea un nuevo participante "Propietario" en la lista maestra.
* **Rol Requerido:** `SUPERADMIN`, `ADMIN`, `REGULAR`
* **Body (DTO):** `CreatePropietarioDto`
    ```json
    {
      "name": "string"
    }
    ```

---

### `GET /api/participants/propietarios`

* **Descripción:** Obtiene la lista maestra de todos los Propietarios.
* **Rol Requerido:** `SUPERADMIN`, `ADMIN`, `REGULAR`
* **Body (DTO):** N/A

---

### `GET /api/participants/propietarios/:id`

* **Descripción:** Obtiene un Propietario específico por su ID.
* **Rol Requerido:** `SUPERADMIN`, `ADMIN`, `REGULAR`
* **Body (DTO):** N/A

---

### `PATCH /api/participants/propietarios/:id`

* **Descripción:** Actualiza el nombre de un Propietario.
* **Rol Requerido:** `SUPERADMIN`, `ADMIN`, `REGULAR`
* **Body (DTO):** `UpdatePropietarioDto`
    ```json
    {
      "name": "string (opcional)"
    }
    ```

---

### `DELETE /api/participants/propietarios/:id`

* **Descripción:** Elimina un Propietario de la lista maestra.
* **Rol Requerido:** `SUPERADMIN`, `ADMIN`, `REGULAR`
* **Body (DTO):** N/A

---

### `POST /api/participants/substitutos`

* **Descripción:** Crea un nuevo participante "Substituto" en la lista maestra.
* **Rol Requerido:** `SUPERADMIN`, `ADMIN`, `REGULAR`
* **Body (DTO):** `CreateSubstitutoDto`
    ```json
    {
      "name": "string"
    }
    ```

---

### `GET /api/participants/substitutos`

* **Descripción:** Obtiene la lista maestra de todos los Substitutos.
* **Rol Requerido:** `SUPERADMIN`, `ADMIN`, `REGULAR`
* **Body (DTO):** N/A

---

### `GET /api/participants/substitutos/:id`

* **Descripción:** Obtiene un Substituto específico por su ID.
* **Rol Requerido:** `SUPERADMIN`, `ADMIN`, `REGULAR`
* **Body (DTO):** N/A

---

### `PATCH /api/participants/substitutos/:id`

* **Descripción:** Actualiza el nombre de un Substituto.
* **Rol Requerido:** `SUPERADMIN`, `ADMIN`, `REGULAR`
* **Body (DTO):** `UpdateSubstitutoDto`
    ```json
    {
      "name": "string (opcional)"
    }
    ```

---

### `DELETE /api/participants/substitutos/:id`

* **Descripción:** Elimina un Substituto de la lista maestra.
* **Rol Requerido:** `SUPERADMIN`, `ADMIN`, `REGULAR`
* **Body (DTO):** N/A

---

### `POST /api/participants/propietarios/:id/assign-substituto`

* **Descripción:** Asigna un Substituto (habilitado) a un Propietario.
* **Rol Requerido:** `SUPERADMIN`, `ADMIN`, `REGULAR`
* **Body (DTO):** `AssignSubstitutoDto`
    ```json
    {
      "substitutoId": "string (UUID)"
    }
    ```

---

### `DELETE /api/participants/propietarios/:id/remove-substituto/:substitutoId`

* **Descripción:** Desvincula un Substituto de un Propietario.
* **Rol Requerido:** `SUPERADMIN`, `ADMIN`, `REGULAR`
* **Body (DTO):** N/A

---

## 🤝 Acuerdos (`/api/agreements`)

Endpoints para la administración de acuerdos.

---

### `POST /api/agreements/create`

* **Descripción:** Crea un nuevo acuerdo y lo asocia a un acta.
* **Rol Requerido:** `ADMIN`
* **Body (DTO):** `CreateAgreementDto`
    ```json
    {
      "minutesId": "string (UUID)",
      "content": "string (opcional)",
      "name": "string",
      "agreementNumber": "number"
    }
    ```

---

### `GET /api/agreements/get-by-minutes/:minutesId`

* **Descripción:** Obtiene todos los acuerdos de un acta específica.
* **Rol Requerido:** `Usuario Autenticado (JWT)`
* **Body (DTO):** N/A

---

### `GET /api/agreements/get/:id`

* **Descripción:** Obtiene un acuerdo específico por su ID.
* **Rol Requerido:** `Usuario Autenticado (JWT)`
* **Body (DTO):** N/A

---

### `PATCH /api/agreements/update/:id`

* **Descripción:** Actualiza el contenido de un acuerdo.
* **Rol Requerido:** `ADMIN`
* **Body (DTO):** `UpdateAgreementDto`
    ```json
    {
      "content": "string (opcional)"
    }
    ```

---

### `DELETE /api/agreements/delete/:id`

* **Descripción:** Elimina un acuerdo de forma permanente.
* **Rol Requerido:** `ADMIN`
* **Body (DTO):** N/A

---

### `PATCH /api/agreements/update-name-number/:id`

* **Descripción:** Actualiza el nombre y numero de un acuerdo.
* **Rol Requerido:** `ADMIN` 
* **Body (DTO):** `UpdateAgreementNameNumberDto`
    ```json
    {
      "name": "string (opcional)",
      "agreementNumber": "number",
    }
    ```

---

### `GET /agreements/get-all`

* **Descripción:** Obtiene una lista de todos los acuerdos (agreements) del sistema, formateados con el DTO de respuesta optimizado.
* **Rol Requerido:** `SUPERADMIN`, `ADMIN`, `REGULAR`
* **Body (DTO):** N/A

---

## 🔍 Búsqueda (`/api/search`)

Endpoints para la búsqueda unificada a través de todas las entidades.

---

### `GET /api/search`

* **Descripción:** Realiza una búsqueda unificada en Libros, Volúmenes, Actas, Acuerdos y Participantes. Los filtros se aplican como parámetros de consulta (query params).
* **Rol Requerido:** `SUPERADMIN`, `ADMIN`, `REGULAR`
* **Query Params (DTO):** `SearchQueryDto`
    * **Ejemplo de URL:** `/api/search?keyword=Revisión&entityType=minutes&minutesStatus=BORRADOR`
    ```json
    {
      "keyword": "string (opcional)",
      "entityType": "string (opcional: 'books', 'volumes', 'minutes', 'agreements', 'propietarios', 'substitutos')",
      "bookStatus": "BookState (enum, opcional)",
      "volumeStatus": "VolumeState (enum, opcional)",
      "minutesStatus": "MinutesType (enum, opcional)",
      "dateFrom": "string (ISO 8601 Date, opcional)",
      "dateTo": "string (ISO 8601 Date, opcional)"
    }
    ```
* **Body (DTO):** N/A

---