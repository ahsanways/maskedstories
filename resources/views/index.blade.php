@extends('layouts.master')

@section('content')
    <audio id="audio" src="{{asset('/click.mp3')}}"></audio>
    <div id="body-container" class="p-5 bg-custom rounded shadow mb-5 slider-wrapper default">
        <ul id="navTab"  class="d-flex nav nav-tabs nav-pills text-center bg-nav-custom border-0 rounded-nav">
            <li class="flex-fill nav-item">
                <a id="recent_stories_button" href="#recent_stories" class="nav-link border-0 text-uppercase active">Recent</a>
            </li>
            <li class="flex-fill nav-item">
                <a id="trending_stories_button" href="#trending_stories" class="nav-link border-0 text-uppercase">Trending</a>
            </li>
            <li class="flex-fill nav-item">
                <a id="your_stories_button" href="#your_stories" class="nav-link border-0 text-uppercase">Your Stories</a>
            </li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane fade show active" id="recent_stories">
                <div class="card-body" id="recent_stories_card">

                </div>
                <div class="card-footer bg-transparent border-0 text-center">
                    <button class="btn btn-secondary btn-custom" id="load_more_recent"><div id="loader_recent"></div>Load More</button>
                </div>
            </div>
            <div class="tab-pane fade" id="trending_stories">
                <div class="card-body" id="trending_stories_card">

                </div>
                <div class="card-footer bg-transparent border-0 text-center">
                    <button class="btn btn-secondary btn-custom" id="load_more_trending"><div id="loader_trending"></div>Load More</button>
                </div>
            </div>
            <div class="tab-pane fade" id="your_stories">

                <form id="create_story_form">
                    <div class="card-body">
                        <div class="form-group">
                            <input type="text" autofocus name="title" id="story-title" class="form-control bg-custom" placeholder="Title - doesn't have one? doesn't need one! ;)">
                        </div>
                        <div class="form-group">
                            <textarea class="bg-custom form-control" name="story" id="story-text" placeholder="And your story goes here..."></textarea>
                        </div>
                        <button type="submit" class="btn btn-custom btn-block"><div id="create_post_loader"></div>Let it Go!</button>
                    </div>
                </form>

                <div class="card-body" id="your_stories_card">

                </div>
                <div class="card-footer bg-transparent border-0 text-center" id="load_more_your_div">
                    <button class="btn btn-secondary btn-custom" id="load_more_your"><div id="loader_your"></div>Load More</button>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('page_js')
    <script type="text/javascript" src="{{ asset('js/index.js') }}?version=<?php echo uniqid(); ?>"></script>
@endsection
