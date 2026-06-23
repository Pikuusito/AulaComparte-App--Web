/*
  Script: 001_crear_tabla_usuarios.sql
  Propósito: documentar la estructura de la tabla de usuarios.
*/

USE AulaComparte;
GO

IF OBJECT_ID(N'dbo.users', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.users
    (
        id            INT IDENTITY(1,1) NOT NULL,
        name          VARCHAR(120) NOT NULL,
        email         VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role          VARCHAR(20) NOT NULL,
        created_at    DATETIME NOT NULL
            CONSTRAINT DF_users_created_at DEFAULT SYSDATETIME(),

        CONSTRAINT PK_users PRIMARY KEY (id),
        CONSTRAINT CK_users_role CHECK (role IN ('user', 'moderator'))
    );

    CREATE UNIQUE INDEX ix_users_email ON dbo.users (email);
END;
GO
