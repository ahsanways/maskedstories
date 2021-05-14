<?php

namespace App\Http\Controllers\API;

use App\Helpers\Helper;
use App\Http\Resources\User as UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\UpdateUserRequest;

class ProfileController extends Controller
{
    public function editProfile(Request $request){
        return view('editProfile');
    }

    public function updateProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' =>  'required',
        ]);

        if($validator->fails()) return sendError($validator->errors()->all(), 200);

        $user = Auth::user();

        if (isset($user)){
            if (User::where('id', '!=', $user->id)->where('username', $request->username)->exists()){
                return sendError(["Username Already Taken!"], 200);
            }
            else{
                $update = Helper::getFilledElementsInArray($request->all());
                if (isset($request->password)) $update['password'] = bcrypt($update['password']);
                $user->update($update);
                return sendResponse(new UserResource($user),200,"User Updated Successfully!");
            }
        }
        else{
            return sendError('Something Went Wrong!', 200);
        }
    }

    public function UploadProfileImage(Request $request)
    {
        if($request->hasFile('file')){
            $allowedfileExtension=['jpg', 'JPG' ,'png', 'PNG'];
            $file = $request->file('file');
            $filename = $file->getClientOriginalName();
            $newname = str_replace(' ', '', $filename);
            $extension = $file->getClientOriginalExtension();
            $check=in_array($extension,$allowedfileExtension);
            if($check)
            {
                $finalname = time().$newname;
                $file->move('uploads/'.'images', $finalname);
                $path = 'uploads/'.'images'."/". $finalname;
            }
        }
        $data = ['profile_image_url'=>$path];
        return sendResponse($data,200,"Image Uploaded Successfully!");
    }
}
