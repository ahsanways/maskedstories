<?php

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = array(
            array(
                'username' => 'ahsanhere',
                'password' => bcrypt('12345678'),
                'display' => "uploads/images/default-display.png",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ),
            array(
                'username' => 'zmjafary',
                'password' => bcrypt('12345678'),
                'display' => "uploads/images/default-display.png",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            )
        );

        DB::table('users')->insert($data);

        $faker = \Faker\Factory::create();

        for($i=0; $i<=50; $i++):
            DB::table('stories')
                ->insert([
                    'user_id' => rand(1,2),
                    'title' => $faker->sentence($nbWords = 6, $variableNbWords = true),
                    'view_count' => rand(0,99),
                    'story' => $faker->text($maxNbChars = 1000),
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]);
        endfor;
    }
}
