<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        Role::create([
            'name' => 'User',
            'description' => 'User',
            'slug' => 'user',
        ]);

        $adminRole = Role::create([
            'name' => 'Admin',
            'description' => 'Admin',
            'slug' => 'admin',
        ]);

        $adminRole->permissions()->attach([
            Permission::create([
                'name' => 'List all checks',
                'description' => 'List all checks',
                'slug' => 'check:list-all',
            ])->id,
            Permission::create([
                'name' => 'Approve check',
                'description' => 'Approve a check',
                'slug' => 'check:approve',
            ])->id,
            Permission::create([
                'name' => 'Reject check',
                'description' => 'Reject a check',
                'slug' => 'check:reject',
            ])->id,
        ]);

        $adminUser = User::create([
            'name' => 'Admin',
            'email' => 'admin@banksystem.com',
            'password' => Hash::make('banksystemadmin'),
        ]);

        $adminUser->roles()->attach($adminRole);

        $adminUser->accounts()->create([
            'balance' => 0,
            'currency' => 'USD',
            'number' => rand(100000000000, 999999999999),
        ]);
    }
}
