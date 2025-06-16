
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
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
            activeFilter === category.id
              ? 'bg-accent text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
