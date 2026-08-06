
import { Category } from '@/types/service';

interface CategoryFilterProps {
  categories: Category[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}

const CategoryFilter = ({ categories, activeFilter, onFilterChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onFilterChange(category.id)}
          className={`px-3.5 sm:px-6 py-2 sm:py-3 text-xs sm:text-base rounded-lg font-semibold transition-all duration-200 ${
            activeFilter === category.id
              ? 'bg-accent text-accent-foreground shadow-lg'
              : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
