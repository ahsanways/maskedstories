@extends('layouts.master')

@section('content')
    <div id="body-container" class="p-5 bg-custom rounded shadow mb-5 slider-wrapper default">
        <div class="container bootstrap snippet">
            <div class="row">
                <div class="col-lg-3"><!--left col-->
                    <div class="text-center">
                        <img src="{{asset('/uploads/images/default-display.png')}}" id="display_image" class="avatar img-circle img-thumbnail" alt="display">
                        <input type="file" id="update_display"  class="file-upload"><br>
                    </div>
                    <br>
                </div>
                <div class="col-lg-9">
                    <div class="tab-content">
                        <div class="tab-pane active" id="home">
                            <div id="profile_update_alert"></div>
                            <form class="form" action="{{route('update-profile')}}" id="update_profile_form">
                                <div class="form-group">

                                    <div class="col-xs-6">
                                        <label for="username"><h4>Username</h4></label>
                                        <input type="text" class="form-control form-text" name="username" id="username" placeholder="Enter your username" title="Choose a unique username." required>
                                    </div>
                                </div>
                                <div class="form-group">

                                    <div class="col-xs-6">
                                        <label for="last_name"><h4>Password</h4></label>
                                        <input type="password" class="form-control form-text" name="password" id="password" placeholder="Choose a password" title="Enter your password here">
                                        <input type="text" class="form-control" name="display" id="display" hidden>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="col-xs-12">
                                        <br>
                                        <button class="btn btn-custom btn-info btn-round" type="submit"><div id="update_profile_loader"></div>Update</button>
                                        <a href="{{url('/')}}" target="_self" class="btn btn-custom btn-info btn-round" >Take me back!</a>
                                    </div>
                                </div>
                            </form>
                        </div><!--/tab-pane-->
                    </div><!--/tab-pane-->
                </div><!--/tab-content-->
            </div><!--/col-9-->
        </div><!--/row-->
    </div>
@endsection

@section('page_js')
    <script type="text/javascript" src="{{ asset('js/profile.js') }}?version=<?php echo uniqid(); ?>"></script>
@endsection
