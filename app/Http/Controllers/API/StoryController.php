<?php

namespace App\Http\Controllers\API;
use App\Helpers\Hasher;
use App\Http\Resources\Story as StoryResource;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Validator;
use App\Models\Story;
use Illuminate\Http\Request;
use App\Http\Controllers\API\GraphController;
use Illuminate\Support\Facades\Auth;

class StoryController extends GraphController
{
    public function index(Request $request)
    {
        $offset = (int)$request->your_stories_offset;

        if($offset){
            return sendResponse(StoryResource::collection(Auth::user()->stories()->offset(@$offset)->limit(3)->latest()->get()),200,"All Stories by User.");
        }
        else{
            return sendResponse(StoryResource::collection(Auth::user()->stories()->offset(0)->limit(3)->latest()->get()),200,"All Stories by User.");
        }
    }

    public function recentStories(Request $request)
    {
        $offset = (int)$request->recent_stories_offset;

        if($offset){
            return sendResponse(StoryResource::collection(Story::latest()->offset(@$offset)->limit(3)->get()),200,"Recent Stories.");
        }
        else{
            return sendResponse(StoryResource::collection(Story::latest()->offset(0)->limit(3)->get()),200,"Recent Stories.");
        }
    }

    public function trendingStories(Request $request)
    {
        $offset = (int)$request->trending_stories_offset;

        if($offset){
            return sendResponse(StoryResource::collection(Story::orderBy('view_count', 'DESC')->offset(@$offset)->limit(3)->get()),200,"Trending Stories.");
        }
        else{
            return sendResponse(StoryResource::collection(Story::orderBy('view_count', 'DESC')->offset(0)->limit(3)->get()),200,"Trending Stories.");
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'story' => 'required',
        ]);

        if($validator->fails()) return sendError($validator->errors()->all(), 200);

        $input = $request->all();

        $story = Auth::user()->stories()->create($input);

        if (isset($story->title)){
            $post = $story->title . " \n \n" . $story->story;
        }
        else{
            $post = $story->story;
        }

        $encrypted_id = Crypt::encrypt($story->id);

        slackNotification($encrypted_id,$post,Auth::user());

        return sendResponse(new StoryResource($story), 200, "Story Added Successfully!");
    }

    public function show(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' =>  'required',
        ]);

        if($validator->fails()) return sendError($validator->errors()->all(), 200);

        $id = Hasher::decode($request->id);

        $story = Story::find($id);

        if (isset($story)){

            $story->timestamps = false;
            $story->increment('view_count');
            $story->save();

            return sendResponse(new StoryResource(Story::find($id)),200,"Story Found!");
        }
        else{
            return sendError("Something went wrong");
        }
    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' =>  'required|exists:stories,id',
            'story' => 'required',
        ]);

        if($validator->fails()) return sendError($validator->errors()->all(), 200);

        $story = Story::find($request->id);

        if (Auth::user()->can('update', $story)) {
            $story->update($request->all());
            return sendResponse(new StoryResource($story),200,"Story Updated Successfully!");
        }
    }

    public function destroy(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' =>  'required',
        ]);

        if($validator->fails()) return sendError($validator->errors()->all(), 200);

        $id = Hasher::decode($request->id);

        $story = Story::find($id);

        if (Auth::user()->can('delete', $story)) {
            $story->delete();
            return sendResponse(null,200,"Story Deleted Successfully!");
        }
    }


    public function upStory(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' =>  'required',
        ]);

        if($validator->fails()) return sendError($validator->errors()->all(), 200);

        $id = Hasher::decode($request->id);

        $story = Story::find($id);

        if(isset($story)){
            $story->timestamps = false;
            $story->increment('view_count');
            $story->save();
            return sendResponse(null,200,"Story Views Updated!");
        }
        else{
            return sendError('Something Went Wrong!', 200);
        }
    }
}
