import { useState, useEffect } from 'react';
import { menuCategories, MenuItem, getMenuItemsByCategory, loadCategories } from '../services/menuService';
import MenuCard from './MenuCard';

function FeaturedMenu() {
  const [activeCategory, setActiveCategory] = useState<string>('Makanan');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [allCategories, setAllCategories] = useState<string[]>(menuCategories);

  // Load categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await loadCategories();
        console.log('Setting all categories in component:', fetchedCategories);
        setAllCategories(fetchedCategories);

        // Set the first category as active if it exists
        if (fetchedCategories.length > 0) {
          setActiveCategory(fetchedCategories[0]);
        }
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);

        console.log(`Fetching menu items for active category: ${activeCategory}`);
        const items = await getMenuItemsByCategory(activeCategory);

        console.log(`Fetched ${items.length} items for category ${activeCategory}`);
        setMenuItems(items);
        setError(null);
      } catch (err) {
        console.error('Error fetching menu items:', err);
        setError('Failed to load menu items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [activeCategory]);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#441E1B] mb-2">Our Menu</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our delicious selection of authentic Indonesian noodles and dishes
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          <div className="flex overflow-x-auto pb-2 max-w-full">
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 mx-1 rounded-full whitespace-nowrap ${
                  activeCategory === category
                    ? 'bg-[#E64516] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                } transition-colors`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E64516]"></div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => setActiveCategory(activeCategory)}
              className="mt-4 px-4 py-2 bg-[#441E1B] text-white rounded-md hover:bg-[#5a2826]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Menu items grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>

            {menuItems.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No menu items found in this category.</p>
              </div>
            )}
          </>
        )}

        {/* View full menu button */}
        <div className="text-center mt-10">
          <button
            onClick={() => {
              const menuSection = document.getElementById('menu');
              if (menuSection) {
                menuSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-block px-6 py-3 bg-[#441E1B] text-white rounded-md hover:bg-[#5a2826] transition-colors"
          >
            View Full Menu
          </button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedMenu;
