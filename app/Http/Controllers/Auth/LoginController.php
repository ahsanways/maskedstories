<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    public function redirectToFacebookProvider()
    {
        return Socialite::driver('facebook')->scopes([
            'pages_manage_ads', 'pages_manage_metadata', 'pages_read_engagement','pages_read_user_content', 'pages_manage_posts','pages_manage_engagement'])->redirect();
    }

    public function handleProviderFacebookCallback()
    {
        $auth_user = Socialite::driver('facebook')->user();

        $user = User::updateOrCreate([
                'username'  =>  $auth_user->name,
                'password' => '',
            ]
        );

        $env_update = changeEnv([
            'FACEBOOK_ACCESS_TOKEN'   => $auth_user->token,
        ]);

        Artisan::call('config:clear');

        Auth::login($user, true);

        return redirect()->to('/'); // Redirect to a secure page
    }
}
