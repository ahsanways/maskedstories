<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//Route::middleware('auth:api')->get('/user', function (Request $request) {
//    return $request->user();
//});

Route::post('login', 'API\AuthController@login')->name('login');
Route::post('register', 'API\AuthController@register');
Route::get('up-story', 'API\StoryController@upStory');
Route::get('get-story', 'API\StoryController@show');
Route::get('recent-stories', 'API\StoryController@recentStories');
Route::get('trending-stories', 'API\StoryController@trendingStories');
Route::get('all-likes', 'API\LikeController@index');
Route::get('all-comments', 'API\CommentController@index');

Route::group(['middleware' => 'auth:api'], function() {

    Route::get('logout', 'API\AuthController@logout');
    Route::get('get-user', 'API\AuthController@getUser');

    Route::get('your-stories', 'API\StoryController@index');
    Route::post('create-story', 'API\StoryController@store');
    Route::post('delete-story', 'API\StoryController@destroy');

    // to be added //

    Route::get('update-story', 'API\StoryController@update');

    Route::get('like-unlike-story', 'API\LikeController@toggleLike');

    Route::post('add-comment', 'API\CommentController@store');
    Route::get('update-comment', 'API\CommentController@update');
    Route::get('delete-comment', 'API\CommentController@destroy');

    Route::post('update-profile', 'API\ProfileController@updateProfile')->name('update-profile');
    Route::post('upload-profile-image', 'API\ProfileController@UploadProfileImage');
});

//Route::fallback('API\AuthController@fallback');


//Route::get('get-group-posts', 'API\TempController@getFacebookGroupPosts');
//Route::fallback(function(){
//    $response = [
//        'status' => FALSE,
//        'message' => 'Page Not Found. If error persists, contact maskedstoriesofficial@gmail.com',
//    ];
//    return response()->json($response, 404);
//});
