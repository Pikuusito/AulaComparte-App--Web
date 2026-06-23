/*
  Script: 001_crear_base_datos.sql
  Propósito: crear la base de datos AulaComparte cuando todavía no existe.
*/

IF DB_ID(N'AulaComparte') IS NULL
BEGIN
    EXEC(N'CREATE DATABASE AulaComparte');
END;
GO
