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

// Simulación de las etiquetas de categorías para el filtro de búsqueda, que tendra cada material que se suba a la plataforma
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
  searchQuery = signal<string>('');
  hasSearched = signal<boolean>(false);

  selectCategory(label: string): void {
    this.selectedCategory.set(label);
    this.categories.update((cats) =>
      cats.map((cat) => ({ ...cat, active: cat.label === label }))
    );
  }

  onSearch(event: any): void {
    const value = event.target.value.trim();
    if (value.length > 0) {
      this.searchQuery.set(value);
      this.hasSearched.set(true);
    } else {
      this.searchQuery.set('');
      this.hasSearched.set(false);
    }
  }

  onInputChange(event: any): void {
    // Si borra todo el texto, limpiamos el estado de búsqueda
    if (event.target.value.trim() === '') {
      this.searchQuery.set('');
      this.hasSearched.set(false);
      this.selectedCategory.set('Todos'); // Resetea filtro
    }
  }

  // Animación de los badges de categoría, con diferentes colores segun la categoría y un estilo diferente
  getCategoryClasses(label: string, active: boolean): string {
    const base = 'rounded-xl px-5 py-2.5 text-sm font-bold cursor-pointer transition-all duration-300 border flex items-center gap-2 shadow-sm ';

    if (!active) {
      const inactiveMap: Record<string, string> = {
        'Todos': 'bg-white text-slate-600 border-slate-200 hover:border-main-300 hover:text-main-600 hover:bg-main-50',
        'Libros': 'bg-white text-slate-600 border-slate-200 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50',
        'Apuntes': 'bg-white text-slate-600 border-slate-200 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50',
        'Guías': 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50',
        'Diapositivas': 'bg-white text-slate-600 border-slate-200 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50',
        'Ejercicios': 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50',
        'Exámenes': 'bg-white text-slate-600 border-slate-200 hover:border-red-300 hover:text-red-600 hover:bg-red-50',
      };
      return base + (inactiveMap[label] || inactiveMap['Todos']);
    } else {
      const activeMap: Record<string, string> = {
        'Todos': 'bg-main-600 text-white border-main-600 shadow-main-600/30 scale-105',
        'Libros': 'bg-rose-500 text-white border-rose-500 shadow-rose-500/30 scale-105',
        'Apuntes': 'bg-amber-500 text-white border-amber-500 shadow-amber-500/30 scale-105',
        'Guías': 'bg-blue-500 text-white border-blue-500 shadow-blue-500/30 scale-105',
        'Diapositivas': 'bg-purple-500 text-white border-purple-500 shadow-purple-500/30 scale-105',
        'Ejercicios': 'bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/30 scale-105',
        'Exámenes': 'bg-red-500 text-white border-red-500 shadow-red-500/30 scale-105',
      };
      return base + (activeMap[label] || activeMap['Todos']);
    }
  }
}
