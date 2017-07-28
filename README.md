## picturemyworld-server

Framework: Node.js

### How to start the server

Execute:

```
npm install
npm run createDB
npm start
```

### Postgres

Open Postgres in terminal:
```
psql -U postgres
```

Connect to database:
```
\c picturemyworld;
```

To list all databases:
```
\list
```

To list all tables:
```
\dt
```

### List of dependencies

| Name        | Version     | Summary |
|:------------|:------------|:---------|
| bcryptjs    | 2.4.3       | To encrypt/decrypt the user password |
| body-parser | 1.17.2      | Parse incoming request bodies |
| pg          | 7.0.2       | To interact with PostgreSQL |
| connect-pg-simple | 4.2.0 | To easy connect to PostgreSQL |
| express     | 4.15.3      | Minimalist web framework |
| express-handlebars | 3.0.0 | View engine for Express |
| express-session | 1.15.3  | Session middleware |
| passport    | 0.3.2       | For the login authentification |
| passport-local | 1.0.0    | Local username and password authentication strategy for Passport |
| sanitizer   | 0.1.3       | To sanitize user input |
| multer      | 1.3.0       | Middleware for handling multipart/form-data | 

### To check and update dependencies

Run `ncu` to check the outdated dependencies:
```
$> ncu

 pg  ^6.2.3  →  ^7.0.2
```

Run ncu with -u to upgrade package.json

```
ncu -u
```
