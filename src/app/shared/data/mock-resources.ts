import { ResourceItem } from '../models/resource.model';

// Base de datos simulada de todos los recursos.
export const MOCK_RESOURCES: ResourceItem[] = [
  {
    id: 1,
    title: 'Attention Is All You Need',
    type: 'Investigación',
    subject: 'Inteligencia Artificial',
    downloads: 25,
    author: 'Sebastian Socualaya',
    publishedAgo: 'Hace 10 días',
    description: 'Este artículo presenta el modelo Transformer, que utiliza mecanismos de atención para lograr mejor rendimiento en tareas de procesamiento del lenguaje natural.',
    level: 'Universidad',
    format: 'PDF',
    isSaved: false,
    fileUrl: '/test_files/Attention is all u need.pdf' 
  },
  {
    id: 2,
    title: 'Guía de Literatura Contemporánea',
    type: 'Guía',
    subject: 'Comunicación',
    downloads: 15,
    author: 'Carlos Ruiz',
    publishedAgo: 'Hace 3 días',
    description: 'Guía completa sobre los principales autores y obras de la literatura contemporánea en habla hispana.',
    level: 'Secundaria',
    format: 'PDF',
    isSaved: true,
    fileUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'
  },
  {
    id: 3,
    title: 'Apuntes de Biología Celular',
    type: 'Apuntes',
    subject: 'Ciencias',
    downloads: 56,
    author: 'Ana Martínez',
    publishedAgo: 'Hace 1 semana',
    description: 'Resumen estructurado de las partes de la célula eucariota y procariota, con esquemas y gráficos.',
    level: 'Universidad',
    format: 'PDF',
    isSaved: false,
    fileUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'
  },
  {
    id: 4,
    title: 'Fórmulas de Física Universitaria',
    type: 'Apuntes',
    subject: 'Física',
    downloads: 120,
    author: 'Jorge Linares',
    publishedAgo: 'Hace 2 semanas',
    description: 'Formulario completo de cinemática, dinámica y electromagnetismo.',
    level: 'Universidad',
    format: 'Imagen',
    isSaved: true,
    fileUrl: '/test_files/formulas_fisica.jpg'
  },
  {
    id: 5,
    title: 'Documento de propuesta',
    type: 'Guía',
    subject: 'Programación Web',
    downloads: 55,
    author: 'Sebastian Socualaya',
    publishedAgo: 'Hace 1 semana',
    description: 'Documento de propuesta para el desarrollo de una aplicación web educativa, con objetivos, metodología y cronograma detallados.',
    level: 'Universidad',
    format: 'PDF',
    isSaved: false,
    fileUrl: '/test_files/Documento de propuesta.pdf'
  }
];
