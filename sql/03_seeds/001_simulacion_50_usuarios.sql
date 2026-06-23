/*
  Datos académicos de demostración para AulaComparte.
  Contraseña de los 50 usuarios: Usuario123!
*/

USE AulaComparte;
GO

SET NOCOUNT ON;

MERGE dbo.users AS target
USING (
    VALUES
        (N'Andrea Morales',   N'usuario01@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Bruno Castillo',   N'usuario02@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Camila Rojas',     N'usuario03@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Diego Mendoza',    N'usuario04@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Elena Vargas',     N'usuario05@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Fabio Torres',     N'usuario06@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Gabriela Flores',  N'usuario07@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Hugo Medina',      N'usuario08@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Inés Salazar',     N'usuario09@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Javier Paredes',   N'usuario10@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Karen Navarro',    N'usuario11@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Luis Herrera',     N'usuario12@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Mariana Cabrera',  N'usuario13@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Nicolás Fuentes',  N'usuario14@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Olivia Ramírez',   N'usuario15@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Pablo Guerrero',   N'usuario16@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Rosa Espinoza',    N'usuario17@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Sergio Valdez',    N'usuario18@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Tatiana Acosta',   N'usuario19@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Uriel Peña',       N'usuario20@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Valeria Campos',   N'usuario21@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Walter Miranda',   N'usuario22@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Ximena Lozano',    N'usuario23@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Yahir Chávez',     N'usuario24@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Zoe Aguilar',      N'usuario25@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Adrián Soto',      N'usuario26@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Bianca Núñez',     N'usuario27@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'César Villegas',   N'usuario28@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Daniela León',     N'usuario29@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Esteban Meza',     N'usuario30@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Fernanda Silva',   N'usuario31@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Gonzalo Tapia',    N'usuario32@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Helena Arias',     N'usuario33@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Iván Palacios',    N'usuario34@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Jimena Cárdenas',  N'usuario35@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Kevin Delgado',    N'usuario36@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Luciana Ortiz',    N'usuario37@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Mateo Benítez',    N'usuario38@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Natalia Correa',   N'usuario39@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Óscar Luna',       N'usuario40@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Paola Serrano',    N'usuario41@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Ricardo Zamora',   N'usuario42@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Sofía Carrillo',   N'usuario43@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Tomás Reyes',      N'usuario44@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Úrsula Vega',      N'usuario45@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Vicente Bravo',    N'usuario46@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Wendy Rosales',    N'usuario47@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Xavier Montoya',   N'usuario48@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Yolanda Bustos',   N'usuario49@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user'),
        (N'Zacarías Prieto',  N'usuario50@example.com', N'$argon2id$v=19$m=65536,t=3,p=4$O50VM5lKmxnKnfUxqkwE+g$Y5MRqroMAW98nisL1FUPkW8FMfVymoUjqLu0QC/RDDs', N'user')
) AS source (name, email, password_hash, role)
ON target.email = source.email
WHEN NOT MATCHED BY TARGET THEN
    INSERT (name, email, password_hash, role)
    VALUES (source.name, source.email, source.password_hash, source.role);
GO

SELECT id, name, email, role, created_at
FROM dbo.users
WHERE email LIKE N'usuario%@example.com'
ORDER BY email;
GO
