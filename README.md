## picturemyworld-server

Framework: Node.js

### How to initialize and start the server

One script to rule them all! `setup.py`

```
usage: setup.py [-h] -e ENV [-i] [-d] [-c] [-r] [-t]

Initialize the NodeJS server for PictureMyWorld

optional arguments:
  -h, --help         show this help message and exit
  -e ENV, --env ENV  Configure the deployment environment.
  -i, --install      Install all node dependencies.
  -d, --delete       Delete the database for the given deployment environment.
  -c, --create       Create a new database for the given deployment
                     environment.
  -r, --run          Run the server.
  -t, --test         Run the Unit-Tests.
```

On first install execute:
```
./setup.py --env development --install --create
```

To delete the corresponding database execute:
```
./setup.py --env development --delete
```

And finally to run the NodeJs server, execute:
```
./setup.py --env development --run
```

Obviously you can use all arguments at once :]

### Unit Tests

To setup (and reset) the test environment:
```
./setup.py --env development --install --delete --create
```

Add the `--test` argument to run the tests.

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
| config      | 1.26.1      | Configurations for app deployments |

### To check and update dependencies

Run `ncu` to check the outdated dependencies:
```
$> ncu

 pg  ^6.2.3  →  ^7.0.2
```

Run `ncu` with `-u` to upgrade package.json

```
ncu -u
```

## External links:

- https://www.adminer.org/
- https://www.postgresql.org/ftp/pgadmin/pgadmin4/v1.5/macos/
- http://docs.python-requests.org/en/latest/user/quickstart/#post-a-multipart-encoded-file
