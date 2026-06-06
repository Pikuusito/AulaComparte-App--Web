import { Component, signal } from '@angular/core';

interface Category {
  label: string;
  active?: boolean;
}

@Component({
  selector: 'app-resource-search',
  standalone: true,
  templateUrl: './resource-search.html',
  styleUrl: './resource-search.css',
})
export class ResourceSearchComponent {
  categories = signal<Category[]>([
    { label: 'Todos', active: true },
    { label: 'Libros' },
    { label: 'Apuntes' },
    { label: 'Guías' },
    { label: 'Diapositivas' },
    { label: 'Ejercicios' },
    { label: 'Exámenes' },
  ]);

  selectedCategory = signal<string>('Todos');

  selectCategory(label: string): void {
    this.selectedCategory.set(label);
    this.categories.update((cats) =>
      cats.map((cat) => ({ ...cat, active: cat.label === label }))
    );
  }
}
