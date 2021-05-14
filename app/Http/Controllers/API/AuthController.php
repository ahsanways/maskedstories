<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller as Controller;
use App\Http\Requests\UserLoginRequest;
use App\Http\Resources\User as UserResource;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\UserStoreRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\User;

class AuthController extends Controller
{
    public function register(UserStoreRequest $request)
    {
        $input = $request->all();
        $input['password'] = bcrypt($input['password']);
        $input['display'] = "uploads/images/default-display.png";
        $user = User::create($input);

        if(isset($user)){

            $response = [
                'status' => TRUE,
                'message' => ['User Registered successfully!'],
                'token' => $user->createToken('token')->accessToken,
                'data' => new UserResource($user),
            ];

            return response()->json($response);
        }
        else{
            return sendError(["Sorry... Registration failed!"], 200);
        }
    }

    public function login(UserLoginRequest $request)
    {
        if(!Auth::attempt(request(['username', 'password']))) return sendError(["Invalid Credentials!"], 200);

        $user = $request->user();

        if(isset($user)){

            $response = [
                'status' => TRUE,
                'message' => 'Login Successful!',
                'token' => $user->createToken('token')->accessToken,
                'data' => new UserResource($user),
            ];

            return response()->json($response);
        }
        else{
            return sendError(["Something Went Wrong!"], 200);
        }
    }

    public function logout(Request $request)
    {
        $user = Auth::user()->token()->revoke();

        return isset($user) ? sendResponse(null, 200, "Successfully logged out!") : sendError("Something went wrong...", 400);
    }

    public function getUser(Request $request)
    {
        $user = Auth::user();

        return isset($user) ? sendResponse(new UserResource($user),200,"User found!") : sendError("User not found!", 400);
    }

    public function fallback()
    {
        $response = [
            'status' => FALSE,
            'message' => 'Page Not Found. If error persists, contact maskedstoriesofficial@gmail.com',
        ];
        return response()->json($response, 404);
    }
}
