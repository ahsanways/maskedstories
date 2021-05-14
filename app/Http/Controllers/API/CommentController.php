<?php

namespace App\Http\Controllers\API;
use App\Http\Resources\Story as StoryResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\Comment;
use App\Models\Story;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Helpers\Hasher;
use App\Http\Resources\Comment as CommentResource;

class CommentController extends Controller
{
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'story_id' =>  'required',
        ]);

        if($validator->fails()) return sendError($validator->errors()->all(), 200);

        $id = Hasher::decode($request->story_id);

        $story = Story::find($id);

        return sendResponse(CommentResource::collection($story->comments),200,"All Comments of the story!");
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'story_id' =>  'required',
            'comment' => 'required',
        ]);

        if($validator->fails()) return sendError($validator->errors()->all(), 200);

        $id = Hasher::decode($request->story_id);

        $story = Story::find($id);

        $comment = $story->comments()->create([
            'user_id' => Auth::id(),
            'comment' => $request->comment,
        ]);

        return sendResponse(new StoryResource($story),200,"Comment Added!");
    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'story_id' =>  'required|exists:stories,id',
            'comment' => 'required',
        ]);

        if($validator->fails()) return sendError($validator->errors()->all(), 200);

        $comment = Comment::find($request->id);

        if (Auth::user()->can('update', $comment)) {
            $comment->update([
                'user_id' => $request->user()->id,
                'comment' => $request->comment,
            ]);
            return sendResponse($comment,200,"Comment Updated!");
        }
    }

    public function destroy(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' =>  'required|exists:comments,id',
            'comment' => 'required',
        ]);

        if($validator->fails()) return sendError($validator->errors()->all(), 200);

        $comment = Comment::find($request->id);

        if (Auth::user()->can('delete', $comment)) {
            $comment->delete();
            return sendResponse(null,200,"Comment Deleted!");
        }
    }
}
