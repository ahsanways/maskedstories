<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

//Route::get('/login/facebook', 'Auth\LoginController@redirectToFacebookProvider');
//Route::get('login/facebook/callback', 'Auth\LoginController@handleProviderFacebookCallback');

Route::group(['middleware' => ['auth']], function(){
    Route::get('/user', 'GraphController@retrieveUserProfile');
    Route::post('/user', 'GraphController@publishToProfile');
    Route::post('/page', 'GraphController@publishToPage');
});
//Route::get('edit-profile', 'API\ProfileController@editProfile');
Route::get('edit-profile', 'API\ProfileController@editProfile');

//Route::get('edit-profile', 'API\ProfileController@editProfile');
//Route::middleware('cache.headers:public;max_age=31536000;etag')->group(function () {

//    Auth::routes(['register' => false]);

    Route::get('/', 'DashboardController@index')->name('index');
//    Route::get('/home', 'HomeController@index')->name('home');
    Route::get('post-story/{encrypted_id}', 'DashboardController@postStory');
    Route::get('delete-story/{encrypted_id}', 'DashboardController@deleteStory');
    Route::get('remove-user/{encrypted_id}', 'DashboardController@removeUser');

    Route::fallback('DashboardController@index');
//});

//Route::fallback(function(){
//    return view('index');
//});

Route::get('/privacy-policy', 'DashboardController@privacyPolicy')->name('privacyPolicy');
Route::get('/terms-and-conditions', 'DashboardController@termsAndConditions')->name('termsAndConditions');
