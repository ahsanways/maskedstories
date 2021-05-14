<?php

namespace App\Http\Controllers\API;
use App\Helpers\Hasher;
use App\Http\Resources\Like as LikeResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\Story;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\Story as StoryResource;
class LikeController extends Controller
{
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'story_id' =>  'required',
        ]);

        if($validator->fails()) return sendError($validator->errors()->all(), 200);

        $id = Hasher::decode($request->story_id);

        $story = Story::find($id);

        return sendResponse(LikeResource::collection($story->likes),200,"All Likes of the story!");
    }

    public function toggleLike(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'story_id' =>  'required',
        ]);

        if($validator->fails()) return sendError($validator->errors()->all(), 200);

        $id = Hasher::decode($request->story_id);

        $story = Story::find($id);

        if (isset($story)){

            $like = $story->likes()->where('user_id', Auth::id())->first();

            if ($like){

                $like->delete();

                return sendResponse(new StoryResource($story),200,"Story Unliked!");
            }
            else{
                $story->likes()->create([
                    'user_id' =>  Auth::id(),
                ]);

                return sendResponse(new StoryResource($story),200,"Story Liked!");
            }

        }else{
            sendError("Something went wrong!", 200);
        }
    }

//    public function destroy(Request $request)
//    {
//        $validator = Validator::make($request->all(), [
//            'story_id' =>  'required|exists:stories,id',
//        ]);
//
//        if($validator->fails()) return sendError($validator->errors()->all(), 200);
//
//        $story = Story::find($request->id);
//
//        $story->likes()->where('user_id', $request->user()->id)->delete();
//
//        return sendResponse($story,200,"Story Unliked!");
//    }
}
