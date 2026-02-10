<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'karem.metrial@hotmail.com',
            'password' => Hash::make('karem.sabry.metrial'),
            'is_admin' => true,
        ]);

        $this->call([
            PortfolioSeeder::class,
        ]);
    }
}
