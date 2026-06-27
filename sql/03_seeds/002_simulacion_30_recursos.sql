/*
  Datos académicos de demostración para AulaComparte.

  Requisito previo:
  - Ejecutar 001_simulacion_50_usuarios.sql.

  Los 30 recursos usan enlaces de ejemplo o referencias de material físico para
  no crear rutas hacia archivos inexistentes en el almacenamiento local.
*/

USE AulaComparte;
GO

SET NOCOUNT ON;

IF (
    SELECT COUNT(*)
    FROM dbo.users
    WHERE email LIKE N'usuario%@example.com'
) < 30
BEGIN
    THROW 50001, 'Primero ejecute 001_simulacion_50_usuarios.sql.', 1;
END;

DECLARE @SeedResources TABLE (
    owner_email NVARCHAR(255) NOT NULL,
    title NVARCHAR(200) NOT NULL,
    description NVARCHAR(1000) NOT NULL,
    resource_type NVARCHAR(30) NOT NULL,
    subject NVARCHAR(100) NOT NULL,
    education_level NVARCHAR(30) NOT NULL,
    format NVARCHAR(30) NOT NULL,
    author NVARCHAR(120) NOT NULL,
    external_url NVARCHAR(1000) NULL,
    material_reference NVARCHAR(500) NULL,
    status NVARCHAR(20) NOT NULL,
    downloads INT NOT NULL
);

INSERT INTO @SeedResources (
    owner_email, title, description, resource_type, subject,
    education_level, format, author, external_url, material_reference,
    status, downloads
)
VALUES
    (N'usuario01@example.com', N'Demo 01 - Introducción al álgebra', N'Guía de conceptos y ejercicios iniciales de expresiones algebraicas.', N'guide', N'Matemática', N'secondary', N'link', N'Andrea Morales', N'https://example.com/aulacomparte/algebra', NULL, N'approved', 34),
    (N'usuario02@example.com', N'Demo 02 - Lecturas de comunicación', N'Selección de lecturas breves para practicar comprensión y vocabulario.', N'book', N'Comunicación', N'primary', N'physical', N'Bruno Castillo', NULL, N'Préstamo coordinado en la biblioteca escolar.', N'approved', 12),
    (N'usuario03@example.com', N'Demo 03 - Apuntes de biología celular', N'Resumen de célula, organelos y funciones para repaso universitario.', N'notes', N'Biología', N'university', N'link', N'Camila Rojas', N'https://example.com/aulacomparte/biologia-celular', NULL, N'approved', 27),
    (N'usuario04@example.com', N'Demo 04 - Problemas de geometría', N'Colección física de problemas resueltos sobre áreas y perímetros.', N'exercises', N'Matemática', N'secondary', N'physical', N'Diego Mendoza', NULL, N'Entrega los viernes en el aula de segundo grado.', N'approved', 19),
    (N'usuario05@example.com', N'Demo 05 - Historia del Perú republicano', N'Material de repaso con hechos principales de la etapa republicana.', N'slides', N'Historia', N'preuniversity', N'link', N'Elena Vargas', N'https://example.com/aulacomparte/historia-peru', NULL, N'approved', 41),
    (N'usuario06@example.com', N'Demo 06 - Banco de preguntas de química', N'Cuestionario impreso de estructura atómica y tabla periódica.', N'exam', N'Química', N'preuniversity', N'physical', N'Fabio Torres', NULL, N'Disponible para fotocopia previa coordinación.', N'approved', 22),
    (N'usuario07@example.com', N'Demo 07 - Fundamentos de programación', N'Guía introductoria sobre variables, condicionales y ciclos.', N'guide', N'Programación', N'university', N'link', N'Gabriela Flores', N'https://example.com/aulacomparte/programacion', NULL, N'approved', 56),
    (N'usuario08@example.com', N'Demo 08 - Libro de cuentos andinos', N'Compilación física de cuentos tradicionales para lectura escolar.', N'book', N'Literatura', N'primary', N'physical', N'Hugo Medina', NULL, N'Préstamo por una semana con registro en biblioteca.', N'approved', 16),
    (N'usuario09@example.com', N'Demo 09 - Apuntes de economía básica', N'Resumen de oferta, demanda, mercado y conceptos económicos básicos.', N'notes', N'Economía', N'preuniversity', N'link', N'Inés Salazar', N'https://example.com/aulacomparte/economia', NULL, N'approved', 31),
    (N'usuario10@example.com', N'Demo 10 - Práctica de fracciones', N'Fichas impresas con ejercicios de suma y resta de fracciones.', N'exercises', N'Matemática', N'primary', N'physical', N'Javier Paredes', NULL, N'Recojo en secretaría durante el horario escolar.', N'approved', 25),
    (N'usuario11@example.com', N'Demo 11 - Presentación del sistema solar', N'Diapositivas de planetas, satélites y movimientos del sistema solar.', N'slides', N'Ciencia y Tecnología', N'primary', N'link', N'Karen Navarro', N'https://example.com/aulacomparte/sistema-solar', NULL, N'approved', 38),
    (N'usuario12@example.com', N'Demo 12 - Examen de razonamiento verbal', N'Examen físico con analogías, conectores y comprensión de textos.', N'exam', N'Razonamiento verbal', N'preuniversity', N'physical', N'Luis Herrera', NULL, N'Copia disponible para préstamo en la sala de estudios.', N'approved', 18),
    (N'usuario13@example.com', N'Demo 13 - Guía de inglés inicial', N'Vocabulario y actividades para presentaciones personales en inglés.', N'guide', N'Inglés', N'secondary', N'link', N'Mariana Cabrera', N'https://example.com/aulacomparte/ingles-inicial', NULL, N'approved', 29),
    (N'usuario14@example.com', N'Demo 14 - Manual de física escolar', N'Libro físico con temas de movimiento, fuerza, trabajo y energía.', N'book', N'Física', N'secondary', N'physical', N'Nicolás Fuentes', NULL, N'Préstamo coordinado en el laboratorio de ciencias.', N'approved', 14),
    (N'usuario15@example.com', N'Demo 15 - Apuntes de estadística', N'Resumen de medidas de tendencia central y representación de datos.', N'notes', N'Estadística', N'university', N'link', N'Olivia Ramírez', N'https://example.com/aulacomparte/estadistica', NULL, N'approved', 44),
    (N'usuario16@example.com', N'Demo 16 - Ejercicios de lógica', N'Cuadernillo físico de proposiciones, conectores y tablas de verdad.', N'exercises', N'Lógica', N'university', N'physical', N'Pablo Guerrero', NULL, N'Consulta y préstamo en el centro de estudiantes.', N'approved', 21),
    (N'usuario17@example.com', N'Demo 17 - Diapositivas de ciudadanía', N'Presentación sobre derechos, deberes y convivencia democrática.', N'slides', N'Desarrollo personal', N'secondary', N'link', N'Rosa Espinoza', N'https://example.com/aulacomparte/ciudadania', NULL, N'approved', 33),
    (N'usuario18@example.com', N'Demo 18 - Simulacro de admisión', N'Simulacro impreso con preguntas de ciencias, letras y aptitud.', N'exam', N'Preparación académica', N'preuniversity', N'physical', N'Sergio Valdez', NULL, N'Entrega presencial previa coordinación por la plataforma.', N'approved', 47),
    (N'usuario19@example.com', N'Demo 19 - Guía de redacción académica', N'Orientaciones para estructurar párrafos, citas y conclusiones.', N'guide', N'Comunicación', N'university', N'link', N'Tatiana Acosta', N'https://example.com/aulacomparte/redaccion', NULL, N'approved', 24),
    (N'usuario20@example.com', N'Demo 20 - Atlas geográfico escolar', N'Atlas físico con mapas políticos y geográficos para consulta.', N'book', N'Geografía', N'secondary', N'physical', N'Uriel Peña', NULL, N'Consulta presencial en biblioteca; no disponible para venta.', N'approved', 11),
    (N'usuario21@example.com', N'Demo 21 - Apuntes de cálculo diferencial', N'Notas sobre límites, continuidad y derivadas con ejemplos.', N'notes', N'Cálculo', N'university', N'link', N'Valeria Campos', N'https://example.com/aulacomparte/calculo', NULL, N'pending', 0),
    (N'usuario22@example.com', N'Demo 22 - Práctica de ortografía', N'Fichas físicas para reforzar tildación y uso de letras.', N'exercises', N'Comunicación', N'primary', N'physical', N'Walter Miranda', NULL, N'Entrega en aula con devolución al finalizar la práctica.', N'pending', 0),
    (N'usuario23@example.com', N'Demo 23 - Diapositivas de anatomía', N'Presentación introductoria de sistemas y órganos del cuerpo humano.', N'slides', N'Anatomía', N'university', N'link', N'Ximena Lozano', N'https://example.com/aulacomparte/anatomia', NULL, N'pending', 0),
    (N'usuario24@example.com', N'Demo 24 - Evaluación de ciencias', N'Prueba impresa sobre materia, energía y ecosistemas.', N'exam', N'Ciencia y Tecnología', N'primary', N'physical', N'Yahir Chávez', NULL, N'Solicitar copia al responsable del laboratorio.', N'pending', 0),
    (N'usuario25@example.com', N'Demo 25 - Guía de trigonometría', N'Identidades y ejercicios introductorios de trigonometría.', N'guide', N'Matemática', N'preuniversity', N'link', N'Zoe Aguilar', N'https://example.com/aulacomparte/trigonometria', NULL, N'pending', 0),
    (N'usuario26@example.com', N'Demo 26 - Antología de poesía peruana', N'Libro físico con una selección de autores peruanos.', N'book', N'Literatura', N'secondary', N'physical', N'Adrián Soto', NULL, N'Préstamo disponible por cinco días calendario.', N'pending', 0),
    (N'usuario27@example.com', N'Demo 27 - Apuntes de contabilidad', N'Notas sobre activos, pasivos y registro de operaciones básicas.', N'notes', N'Contabilidad', N'university', N'link', N'Bianca Núñez', N'https://example.com/aulacomparte/contabilidad', NULL, N'pending', 0),
    (N'usuario28@example.com', N'Demo 28 - Ejercicios sin autor identificado', N'Cuadernillo físico de procedencia no confirmada para revisión.', N'exercises', N'Matemática', N'secondary', N'physical', N'César Villegas', NULL, N'Material pendiente de verificar antes de cualquier préstamo.', N'rejected', 0),
    (N'usuario29@example.com', N'Demo 29 - Presentación con enlace incompleto', N'Diapositivas cuyo origen debe verificarse antes de publicarse.', N'slides', N'Informática', N'secondary', N'link', N'Daniela León', N'https://example.com/aulacomparte/enlace-revision', NULL, N'rejected', 0),
    (N'usuario30@example.com', N'Demo 30 - Examen recopilado', N'Evaluación física que requiere confirmar autorización del autor.', N'exam', N'Química', N'preuniversity', N'physical', N'Esteban Meza', NULL, N'No distribuir hasta contar con permiso del autor.', N'rejected', 0);

MERGE dbo.resources AS target
USING (
    SELECT
        users.id AS owner_id,
        seed.title,
        seed.description,
        seed.resource_type,
        seed.subject,
        seed.education_level,
        seed.format,
        seed.author,
        seed.external_url,
        seed.material_reference,
        seed.status,
        seed.downloads
    FROM @SeedResources AS seed
    INNER JOIN dbo.users AS users ON users.email = seed.owner_email
) AS source
ON target.owner_id = source.owner_id AND target.title = source.title
WHEN NOT MATCHED BY TARGET THEN
    INSERT (
        owner_id, title, description, resource_type, subject,
        education_level, format, author, file_path, external_url,
        material_reference, page_count, image_count, permission_declared,
        status, downloads
    )
    VALUES (
        source.owner_id, source.title, source.description, source.resource_type,
        source.subject, source.education_level, source.format, source.author,
        NULL, source.external_url, source.material_reference, NULL, NULL, 1,
        source.status, source.downloads
    );
GO

SELECT
    resources.id,
    users.email AS owner_email,
    resources.title,
    resources.resource_type,
    resources.format,
    resources.status,
    resources.downloads
FROM dbo.resources AS resources
INNER JOIN dbo.users AS users ON users.id = resources.owner_id
WHERE resources.title LIKE N'Demo %'
ORDER BY resources.title;
GO
