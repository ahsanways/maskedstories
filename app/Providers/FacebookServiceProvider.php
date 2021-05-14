<?php

namespace App\Providers;

use Facebook\Facebook;
use Illuminate\Support\ServiceProvider;

class FacebookServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(Facebook::class, function ($app) {
            $config = config('services.facebook');
            return new Facebook([
                'app_id' => env('FACEBOOK_CLIENT_ID'),
                'app_secret' => env('FACEBOOK_ACCESS_TOKEN'),
                'default_graph_version' => 'v2.6',
            ]);
        });
    }
}
