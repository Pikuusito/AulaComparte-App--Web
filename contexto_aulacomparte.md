# Contexto de la aplicación: AulaComparte

## 1. Nombre del proyecto

**AulaComparte**

## 2. ¿Qué es AulaComparte?

AulaComparte es una plataforma web de impacto social orientada a facilitar el acceso a recursos educativos para estudiantes de bajos recursos de Huancayo. La aplicación permite que estudiantes, docentes y administradores puedan compartir, donar, solicitar, organizar, buscar y consultar materiales de estudio en un solo lugar.

La plataforma está pensada como una comunidad digital de apoyo educativo, donde los materiales que una persona ya no usa pueden beneficiar a otros estudiantes que los necesitan.

## 3. ¿Para qué sirve?

AulaComparte sirve para reducir las dificultades económicas y de organización que enfrentan algunos estudiantes al buscar materiales educativos. En lugar de depender únicamente de compras, fotocopias, grupos de WhatsApp o búsquedas desordenadas en internet, la plataforma centraliza los recursos educativos y los organiza por categorías.

Su finalidad principal es ayudar a que los estudiantes encuentren materiales de estudio de manera más rápida, sencilla, gratuita o accesible.

## 4. Problema que busca resolver

En Huancayo, algunos estudiantes tienen dificultades para acceder a materiales educativos complementarios debido a factores como:

- Costo de libros, separatas, copias y materiales académicos.
- Falta de organización para encontrar recursos útiles.
- Información dispersa en grupos de WhatsApp o internet.
- Materiales incompletos, poco confiables o difíciles de encontrar.
- Recursos educativos que quedan guardados en casa y podrían ser reutilizados por otros estudiantes.

AulaComparte busca resolver este problema mediante una plataforma web organizada, segura y fácil de usar.

## 5. Objetivo general

Desarrollar una plataforma web que facilite el intercambio, donación y solicitud de recursos educativos para estudiantes de bajos recursos en Huancayo.

## 6. Objetivos específicos

- Identificar las principales necesidades de acceso a materiales educativos en estudiantes de la comunidad.
- Diseñar una plataforma web accesible, clara y fácil de usar.
- Implementar módulos de registro, inicio de sesión, publicación, búsqueda, descarga y solicitud de recursos educativos.
- Promover la participación de estudiantes, docentes y donantes en el intercambio de materiales.
- Contribuir a la reducción de la brecha educativa mediante el uso responsable de la tecnología.
- Respetar la privacidad de los usuarios y la propiedad intelectual de los materiales compartidos.

## 7. Usuarios principales

### Estudiante

Usuario que necesita encontrar recursos educativos para estudiar. Puede registrarse, iniciar sesión, buscar materiales, descargar recursos disponibles, guardar materiales de interés y solicitar recursos que necesita.

### Docente

Usuario que puede compartir materiales educativos propios o permitidos, como guías, separatas, diapositivas, ejercicios, apuntes o recursos complementarios.

### Administrador

Usuario encargado de revisar publicaciones, gestionar usuarios, moderar contenidos y verificar que los materiales compartidos sean adecuados y respeten la propiedad intelectual.

### Colaborador

Persona que desea compartir, donar o publicar recursos educativos físicos o digitales para apoyar a estudiantes.

## 8. Beneficiarios

### Beneficiarios directos

- Estudiantes de bajos recursos.
- Escolares o estudiantes de educación superior que necesitan materiales de estudio.
- Docentes que desean compartir recursos educativos.

### Beneficiarios indirectos

- Padres de familia.
- Instituciones educativas.
- Comunidad local de Huancayo.

## 9. Tipos de recursos educativos

La plataforma debe permitir trabajar con materiales como:

- Libros digitales.
- Separatas.
- Apuntes de clase.
- Guías académicas.
- Guías de práctica.
- Diapositivas.
- Recursos digitales.
- Ejercicios resueltos.
- Exámenes o prácticas anteriores, siempre que su uso sea permitido.
- Materiales de reforzamiento académico.
- Materiales físicos disponibles para donación o intercambio.

## 10. Funcionalidades principales

### Autenticación y usuarios

- Registro de usuarios.
- Inicio de sesión.
- Cierre de sesión.
- Roles de usuario: estudiante, docente y administrador.
- Control de acceso según el rol.

### Recursos educativos

- Publicar recursos educativos.
- Buscar recursos.
- Filtrar por nivel educativo, curso, categoría o tipo de material.
- Ver detalle de un recurso.
- Descargar recursos digitales disponibles.
- Guardar recursos de interés.
- Solicitar recursos educativos.
- Indicar si un material es donado, prestado o para intercambio.

### Administración

- Revisar publicaciones.
- Aprobar o rechazar recursos.
- Gestionar usuarios.
- Moderar contenidos.
- Verificar que los materiales tengan fines educativos.
- Evitar publicaciones incorrectas, engañosas o que vulneren derechos de autor.

## 11. Pantallas principales del prototipo

El prototipo debe considerar las siguientes pantallas:

1. **Pantalla de inicio**
   - Presentación breve de AulaComparte.
   - Botones principales: explorar recursos, publicar material, iniciar sesión.
   - Categorías principales de recursos.
   - Explicación simple de cómo funciona.

2. **Pantalla de registro**
   - Formulario para crear cuenta.
   - Datos básicos: nombre, correo, contraseña y tipo de usuario.
   - Aceptación de términos y condiciones.

3. **Pantalla de inicio de sesión**
   - Formulario con correo y contraseña.
   - Acceso para usuarios registrados.

4. **Panel principal del estudiante**
   - Bienvenida al usuario.
   - Buscador de recursos.
   - Categorías disponibles.
   - Recursos recientes.
   - Solicitudes activas.
   - Materiales guardados.
   - Descargas realizadas.

5. **Formulario de publicación de material**
   - Título del recurso.
   - Descripción.
   - Tipo de material.
   - Nivel educativo.
   - Curso o área.
   - Archivo o información del material físico.
   - Condición: donación, préstamo o intercambio.

6. **Panel de administración**
   - Lista de publicaciones pendientes.
   - Gestión de usuarios.
   - Moderación de recursos.
   - Revisión de reportes o contenido inadecuado.

## 12. Reglas importantes para el prototipo

- No incluir filtro de ubicación en el prototipo.
- Mantener la interfaz simple y fácil de implementar en frontend.
- Priorizar un diseño limpio, educativo y moderno.
- El sistema debe funcionar correctamente en computadora, tablet y celular.
- Evitar funcionalidades demasiado complejas que dificulten el desarrollo del MVP.
- El proyecto debe tener enfoque social, no comercial.
- La plataforma debe comunicar colaboración, solidaridad y apoyo educativo.
- No estigmatizar a los estudiantes de bajos recursos.
- No promover venta abusiva de materiales.

## 13. Arquitectura técnica

La aplicación debe usar arquitectura **MVC** para separar responsabilidades:

### Modelo

Gestiona los datos principales del sistema:

- Usuarios.
- Roles.
- Recursos educativos.
- Categorías.
- Solicitudes.
- Descargas.
- Publicaciones.
- Estados de moderación.

### Vista

Representa la interfaz web que usan estudiantes, docentes y administradores. Debe ser clara, responsive y fácil de entender.

### Controlador

Procesa las acciones del usuario, valida información, coordina la comunicación entre la interfaz y la base de datos, y ejecuta la lógica principal del sistema.

## 14. Tecnologías sugeridas

### Frontend

**Angular**

Se usará para construir la interfaz de usuario de AulaComparte. Debe permitir crear pantallas ordenadas, componentes reutilizables y diseño responsive.

### No contaremos con backend por ahora, nos enfocamos en el fronted con Angular

### Control de versiones

**GitHub**

Se usará para registrar avances, commits y contribuciones del equipo.

## 15. Requisitos técnicos mínimos

La aplicación debe cumplir con:

- Arquitectura MVC con framework.
- Operaciones CRUD completas.
- Autenticación y autorización de usuarios.
- Diseño responsive.
- Seguridad web básica.
- Prevención de inyección SQL.
- Prevención de XSS.
- Documentación técnica del código.
- Registro de avances mediante GitHub.

## 16. Seguridad y ética

AulaComparte debe desarrollarse considerando responsabilidad social, privacidad y propiedad intelectual.

Reglas clave:

- Solicitar solo los datos necesarios.
- Proteger la información personal de los usuarios.
- Usar control de acceso por roles.
- Moderar los contenidos publicados.
- No permitir materiales ilegales o sin autorización.
- Priorizar recursos propios, recursos libres, apuntes compartidos voluntariamente o documentos con permiso de uso.
- Evitar plagio.
- Usar la plataforma únicamente con fines educativos y de apoyo.
- No exponer información personal innecesaria.
- Evitar que cualquier persona publique contenido incorrecto, engañoso o no educativo.



## 17. Flujo general del usuario estudiante

1. El estudiante entra a AulaComparte.
2. Se registra o inicia sesión.
3. Accede a su panel principal.
4. Busca recursos por categoría, nivel, curso o tipo de material.
5. Revisa el detalle del recurso.
6. Descarga el material si está disponible.
7. Guarda recursos de interés.
8. Solicita materiales que no encuentra o que requieren coordinación.
9. Puede publicar materiales que desea compartir, donar o intercambiar.

## 18. Flujo general del docente o donante

1. Inicia sesión.
2. Publica un recurso educativo.
3. Completa título, descripción, tipo, nivel, curso y archivo o información del material.
4. Envía la publicación para revisión.
5. El administrador revisa y aprueba si cumple las reglas.
6. El recurso queda disponible para los estudiantes.

## 19. Flujo general del administrador

1. Inicia sesión con rol de administrador.
2. Revisa publicaciones pendientes.
3. Aprueba o rechaza recursos.
4. Gestiona usuarios.
5. Supervisa que el contenido sea educativo y respete la propiedad intelectual.
6. Atiende reportes o publicaciones inadecuadas.

## 20. Enfoque visual y tono de la aplicación

La aplicación debe transmitir:

- Confianza.
- Solidaridad.
- Educación.
- Accesibilidad.
- Orden.
- Comunidad.

El lenguaje debe ser claro, directo y amigable. Se debe evitar un tono asistencialista o que haga sentir menos a los beneficiarios.

Ejemplos de mensajes adecuados:

- "Comparte recursos educativos y aprende en comunidad."
- "Encuentra materiales de estudio de forma sencilla."
- "Publica un recurso para ayudar a otros estudiantes."
- "AulaComparte conecta estudiantes, docentes y recursos educativos."

## 22. Alcance del MVP

Para una primera versión funcional, se debe priorizar:

- Registro e inicio de sesión.
- Roles básicos: estudiante, docente y administrador.
- Publicación de recursos.
- Búsqueda de recursos.
- Vista de detalle del recurso.
- Descarga de archivos.
- Solicitud de recursos.
- Panel básico del estudiante.
- Moderación básica por administrador.
- Diseño responsive.

## 23. Criterios de éxito

AulaComparte será exitosa si:

- Los estudiantes pueden encontrar recursos educativos de forma sencilla.
- Los usuarios pueden publicar materiales sin dificultad.
- La plataforma organiza los recursos por categorías claras.
- Los administradores pueden moderar contenidos.
- El sistema protege la privacidad de los usuarios.
- Los materiales compartidos respetan la propiedad intelectual.
- La aplicación funciona correctamente desde celulares.
- El prototipo demuestra impacto social en la comunidad de Huancayo.

## 24. Instrucciones para un agente de IA que use este contexto

Cuando generes código, diseños, textos o propuestas para AulaComparte, debes respetar este contexto:

- El proyecto se llama AulaComparte.
- Es una plataforma web de intercambio, donación y solicitud de recursos educativos.
- Está dirigida principalmente a estudiantes de bajos recursos de Huancayo.
- Debe tener enfoque social, educativo y ético.
- Debe ser simple, responsive y fácil de usar.
- Debe contemplar roles de estudiante, docente y administrador.
- Debe usar arquitectura MVC.
- El frontend se plantea con Angular.
- El backend se plantea con FastAPI.
- Debe incluir CRUD, autenticación, autorización y seguridad básica.
- Debe evitar plagio, proteger datos personales y respetar propiedad intelectual.
- No agregues funcionalidades complejas si no son necesarias para el MVP.
- No incluyas filtro de ubicación en el prototipo.
- Prioriza claridad, orden y facilidad de implementación.
