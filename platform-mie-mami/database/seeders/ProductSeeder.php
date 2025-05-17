<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Mie Ayam',
                'description' => 'Mie ayam dengan topping ayam yang lezat',
                'price' => 15000,
                'stock' => 100,
                'category_id' => 1,
            ],
            [
                'name' => 'Mie Goreng',
                'description' => 'Mie goreng dengan bumbu khas',
                'price' => 12000,
                'stock' => 100,
                'category_id' => 1,
            ],
            [
                'name' => 'Es Teh',
                'description' => 'Es teh manis segar',
                'price' => 5000,
                'stock' => 200,
                'category_id' => 2,
            ],
            [
                'name' => 'Es Jeruk',
                'description' => 'Es jeruk segar',
                'price' => 6000,
                'stock' => 200,
                'category_id' => 2,
            ],
            [
                'name' => 'Kerupuk',
                'description' => 'Kerupuk renyah',
                'price' => 2000,
                'stock' => 300,
                'category_id' => 3,
            ],
            [
                'name' => 'Pudding',
                'description' => 'Pudding lembut dan manis',
                'price' => 8000,
                'stock' => 50,
                'category_id' => 4,
            ],
            [
                'name' => 'Bakso',
                'description' => 'Bakso sebagai topping tambahan',
                'price' => 5000,
                'stock' => 150,
                'category_id' => 5, // Assuming Topping is category_id 5
            ],
            [
                'name' => 'Pangsit',
                'description' => 'Pangsit goreng renyah',
                'price' => 3000,
                'stock' => 200,
                'category_id' => 5, // Assuming Topping is category_id 5
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
