import { NavLink, useSearchParams } from 'react-router-dom';

const categories = [
  { id: 'sushi', name: 'Sushi' },
  { id: 'ramen', name: 'Ramen' },
  { id: 'entradas', name: 'Entradas' },
  { id: 'bebidas', name: 'Bebidas' },
  { id: 'postres', name: 'Postres' },
  { id: 'combos', name: 'Combos' }
];

const CategoryFilter = () => {
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category');

  return (
    <div className="d-flex flex-wrap gap-2">
      <NavLink
        to="/products"
        className={`btn btn-sm ${
          !currentCategory ? 'btn-primary' : 'btn-outline-primary'
        }`}
      >
        Todos
      </NavLink>
      {categories.map(category => (
        <NavLink
          key={category.id}
          to={`/products?category=${category.id}`}
          className={`btn btn-sm ${
            currentCategory === category.id ? 'btn-primary' : 'btn-outline-primary'
          }`}
        >
          {category.name}
        </NavLink>
      ))}
    </div>
  );
};

export default CategoryFilter;