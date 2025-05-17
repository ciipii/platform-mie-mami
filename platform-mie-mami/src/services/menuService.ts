import { Product, fetchProducts, fetchCategories } from './api';

// Menu item interface that maps to the API's Product interface
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  popular?: boolean;
}

// Default menu categories (will be updated from API)
export let menuCategories: string[] = [
  'Makanan',
  'Minuman',
  'Snack',
  'Dessert',
  'Topping'
];

// Category mapping cache with the exact IDs from the database
// Makanan id:1, Minuman id:2, Snack id:3, Dessert id:4, and Topping id:9
const categoryMapCache: Record<number, string> = {
  1: 'Makanan',
  2: 'Minuman',
  3: 'Snack',
  4: 'Dessert',
  9: 'Topping'
};

// Function to load categories from API
export const loadCategories = async (): Promise<string[]> => {
  try {
    const categories = await fetchCategories();
    console.log('Fetched categories from API:', categories);

    // We'll keep our hardcoded mappings and just update with any new ones from the API
    // No need to clear the cache since we want to preserve our known mappings

    // Update the category map cache
    categories.forEach(category => {
      categoryMapCache[category.id] = category.name;
      console.log(`Cached category ID ${category.id} with name: ${category.name}`);
    });

    // Update the menu categories
    menuCategories = categories.map(category => category.name);
    console.log('Updated menu categories:', menuCategories);

    return menuCategories;
  } catch (error) {
    console.error('Error loading categories:', error);
    return menuCategories; // Return default categories on error
  }
};

// Function to convert API Product to MenuItem
export const mapProductToMenuItem = (product: Product): MenuItem => {
  const categoryName = getCategoryNameById(product.category_id) || 'Other';
  console.log(`Mapping product ${product.id} (${product.name}) with category_id ${product.category_id} to category name: ${categoryName}`);

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    // Get category name from the cache or use 'Other'
    category: categoryName,
    // For now, we'll mark some items as popular based on criteria
    // In a real app, this would come from the API
    popular: product.id % 4 === 0 // Just a simple way to mark some items as popular
  };
};

// Helper function to get category name by ID
export const getCategoryNameById = (categoryId: number): string => {
  // Use our hardcoded mapping for the known category IDs
  // Makanan id:1, Minuman id:2, Snack id:3, Dessert id:4, and Topping id:9
  const categoryName = categoryMapCache[categoryId] || 'Other';
  console.log(`Getting category name for ID ${categoryId}: ${categoryName}`);

  // Map specific IDs to their known categories if not found in cache
  if (categoryName === 'Other') {
    if (categoryId === 1) return 'Makanan';
    if (categoryId === 2) return 'Minuman';
    if (categoryId === 3) return 'Snack';
    if (categoryId === 4) return 'Dessert';
    if (categoryId === 9) return 'Topping';
  }

  return categoryName;
};

// Function to get menu items by category
export const getMenuItemsByCategory = async (category: string): Promise<MenuItem[]> => {
  console.log(`Getting menu items for category: ${category}`);

  // Load categories first if needed
  await loadCategories();

  const products = await fetchProducts();
  console.log(`Fetched ${products.length} products from API`);

  const menuItems = products.map(mapProductToMenuItem);

  // Use case-insensitive comparison for category filtering
  const filteredItems = menuItems.filter(item => {
    const itemCategory = item.category.toLowerCase().trim();
    const targetCategory = category.toLowerCase().trim();
    console.log(`Comparing item category "${itemCategory}" with target "${targetCategory}"`);
    return itemCategory === targetCategory;
  });

  console.log(`Found ${filteredItems.length} items in category ${category}`);
  console.log('All category names in items:', [...new Set(menuItems.map(item => item.category))]);

  return filteredItems;
};

// Function to get popular menu items
export const getPopularMenuItems = async (): Promise<MenuItem[]> => {
  // Load categories first if needed
  await loadCategories();

  const products = await fetchProducts();
  const menuItems = products.map(mapProductToMenuItem);
  return menuItems.filter(item => item.popular);
};

// Function to get all menu items
export const getAllMenuItems = async (): Promise<MenuItem[]> => {
  // Load categories first if needed
  await loadCategories();

  const products = await fetchProducts();
  return products.map(mapProductToMenuItem);
};
