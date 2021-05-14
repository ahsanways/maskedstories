var recent_stories_offset = 0;
var trending_stories_offset = 0;
var your_stories_offset = 0;
var users = Math.floor(Math.random() * (1200 - 700) + 700);

$(document).ready(function(){
    if(popup == 1){
        swal({
            title: "Guess What?",
            text: users+' users are online right now! ☃️',
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
        });
    }

    if(window.matchMedia("(max-width: 767px)").matches){
        $("#recent_stories").on( "swipeleft", function( event ){
            event.stopPropagation();
            event.preventDefault();
            $("#navTab #trending_stories_button").tab('show');
        });

        $("#trending_stories").on( "swipeleft", function( event ){
            event.stopPropagation();
            event.preventDefault();
            $("#navTab #your_stories_button").tab('show');
        });

        $("#trending_stories").on( "swiperight", function( event ){
            event.stopPropagation();
            event.preventDefault();
            $("#navTab #recent_stories_button").tab('show');
        });

        $("#your_stories").on( "swiperight", function( event ){
            event.stopPropagation();
            event.preventDefault();
            $("#navTab #trending_stories_button").tab('show');
        });

        $("#recent_stories_button").on( "swiperight", function( event ){
            event.stopPropagation();
            event.preventDefault();
            $("#navTab #trending_stories_button").tab('show');
        });

        $("#trending_stories_button").on( "swiperight", function( event ){
            event.stopPropagation();
            event.preventDefault();
            $("#navTab #your_stories_button").tab('show');
        });

        $("#trending_stories_button").on( "swipeleft", function( event ){
            event.stopPropagation();
            event.preventDefault();
            $("#navTab #recent_stories_button").tab('show');
        });

        $("#your_stories_button").on( "swipeleft", function( event ){
            event.stopPropagation();
            event.preventDefault();
            $("#navTab #trending_stories_button").tab('show');
        });
    }

    $("#navTab a").click(function(e){
        e.preventDefault();
        $(this).tab('show');
    });

    recentStories();
    trendingStories();
    yourStories();

    var texts = $('.story_preview');
    texts.hide();
});

$(window).on('load', function() {
    var texts = $('.story_preview');
    texts.hide();
});

$("#login_button").click(function(){
    $('#loginModal').modal('show');
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
});
$("#load_more_recent").click(function(){
    $('#loader_recent').addClass('loader');
    recentStories();
});
$("#load_more_trending").click(function(){
    $('#loader_trending').addClass('loader');
    trendingStories();
});
$("#load_more_your").click(function(){
    $('#loader_your').addClass('loader');
    yourStories();
});

function viewLikes(id) {
    $.ajax({
        type: "GET",
        url: base_url+"/all-likes",
        data: {
            story_id:id
        },
        success: function(data)
        {
            if (data.status === true && data.data.length > 0){
                var likes = '';
                var content = '';

                $.each( data.data.reverse(), function( index, element ){
                    likes += '<div class="d-flex pt-2"> <div class="mr-2 circular-small"> <img src="'+base_url_public+ '/' +element.user.display+'"> </div> <div class="mr-auto"> <strong>'+element.user.username+'</strong>: <span style="font-size: 14px">'+element.updated_at+'</span> </div></div>'
                });

                content = '<div class="modal-header border-0"><div class="modal-title" ><h4> People who like this </h4></div><button type="button" class="close shadow-none" data-dismiss="modal" aria-label="Close"><span id="cross" aria-hidden="true">&times;</span></button></div><div class="modal-body">'+likes+'</div>';
                $('#allLikes').empty();
                $('#allLikes').append(content);

                if ($('#storyModal').is(':visible')){
                    $('#likesModal').attr('style', 'background:rgba(1,1,1,0.5);');
                }

                $('#likesModal').modal('show');
            }
        },
        error: function() {
            noInternet();
        }
    });
}

function viewComments(id) {
    $.ajax({
        type: "GET",
        url: base_url+"/all-comments",
        data: {
            story_id:id
        },
        success: function(data)
        {
            if (data.status === true){

                var comments = '';
                var content = '';

                $.each( data.data.reverse(), function( index, element ){
                    comments += '<div class="d-flex pt-2"> <div class="mr-2 circular-small"> <img src="'+base_url_public+ '/' +element.user.display+'"> </div> <div class="mr-auto"> <strong>'+element.user.username+'</strong>: <span style="font-size: 14px">'+element.comment+'</span> </div></div>'
                });

                content = '<div class="modal-header border-0"><div class="modal-title"><h4> People who shared their thoughts </h4></div><button type="button" class="close shadow-none" data-dismiss="modal" aria-label="Close"><span id="cross" aria-hidden="true">&times;</span></button></div><div class="modal-body">'+comments+'</div>';

                $('#allComments').empty();
                $('#allComments').append(content);

                if ($('#storyModal').is(':visible')){
                    $('#commentsModal').attr('style', 'background:rgba(1,1,1,0.5);');
                }

                $('#commentsModal').modal('show');
            }
        },
        error: function() {
            noInternet();
        }
    });
}

$("#create_story_form").submit(function(e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.
    $('#create_post_loader').addClass('loader');

    var form = $(this);

    if(token !== null){
        $.ajaxSetup({
            headers: {
                'Authorization': 'Bearer '+token
            }
        });
        $.ajax({
            type: "POST",
            url: base_url+"/create-story",
            data: form.serialize(), // serializes the form's elements.
            success: function(data)
            {
                if(data.status === true) {
                    swal({
                        type: 'success',
                        title: "WoHoo.. it's live!",
                        text: "Your story has been posted!",
                        timer: 3000,
                        showCancelButton: false,
                        showConfirmButton: false
                    });
                    $('#create_post_loader').removeClass('loader');
                    your_stories_offset = 0;
                    recent_stories_offset = 0;
                    trending_stories_offset = 0;
                    $("#create_story_form").trigger("reset");
                    $('#your_stories_card').empty();
                    $('#recent_stories_card').empty();
                    $('#trending_stories_card').empty();
                    yourStories();
                    recentStories();
                    trendingStories();
                }
                else{
                    swal({
                        title: "Error...",
                        text: "Story field is required!",
                        timer: 3000,
                        type: "error",
                        showCancelButton: false,
                        showConfirmButton: false
                    });
                    $('#create_post_loader').removeClass('loader');
                }
            },
            error: function() {
                $('#create_post_loader').removeClass('loader');
                noInternet();
            }
        });
    }
});

$("#login_form").submit(function(e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.
    $('#login_loader').addClass('loader');

    var form = $(this);

    $.ajax({
        type: "POST",
        url: base_url+"/login",
        data: form.serialize(), // serializes the form's elements.
        success: function(data)
        {
            if(data.status === true){
                $('#login_loader').removeClass('loader');
                localStorage.setItem('username',data.data.username);
                localStorage.setItem('display',data.data.display);
                localStorage.setItem('token',data.token);
                $('#loginModal').modal('hide');
                setUser();
//                location.reload();
            }
            if(data.status === false){
                var login_errors = '';
                $('#login_loader').removeClass('loader');
                $.each( data.error, function( index, element ){
                    login_errors += ''+element+'\n';
                });
                login_errors = '<div class="alert alert-danger">'+login_errors+'</div>';
                $('#login_errors').html(login_errors);
            }
        },
        error: function() {
            $('#login_loader').removeClass('loader');
            $('#loginModal').modal('hide');
            noInternet();
        }
    });
});

$("#register_form").submit(function(e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.
    $('#register_loader').addClass('loader');

    var form = $(this);

    $.ajax({
        type: "POST",
        url: base_url+"/register",
        data: form.serialize(), // serializes the form's elements.
        success: function(data)
        {
            if(data.status === true){
                $('#register_loader').removeClass('loader');
                localStorage.setItem('token',data.token);
                localStorage.setItem('username',data.data.username);
                localStorage.setItem('display',data.data.display);
                $('#registerModal').modal('hide');
                setUser();
//                location.reload();
            }
            if(data.status === false){
                var register_errors = '';
                $('#register_loader').removeClass('loader');
                $.each( data.error, function( index, element ){
                    register_errors += ''+element+'\n';
                });
                var register_alert = '<div class="alert alert-danger">'+register_errors+'</div>';
                $('#register_errors').html(register_alert);
            }
        },
        error: function() {
            $('#register_loader').removeClass('loader');
            $('#registerModal').modal('hide');
            noInternet();
        }
    });
});

function recentStories(){
    $.ajax({
        url: base_url+"/recent-stories",
        method: 'get',
        data: {
            recent_stories_offset: recent_stories_offset
        },
        success: function (response) {
            $('#loader_recent').removeClass('loader');
            var recent_stories = '';
            var story_length = 0;
            var preview_length = 0;
            var preview = '';
            var redirect_link = '';
            $.each( response.data, function( index, element ){
                story_length = (element.story).length;
                preview_length = (story_length%2 === 0) ? story_length/2 : story_length/2 + 0.5;
                preview = (element.story).substring(0, preview_length) + "...";
                if(element.post_link !== null){
                    redirect_link = '<a href="'+element.post_link+'"> <img id="redirect_link" src="'+base_url_public+'/link.svg" height="15px" width="15px"></a>';
                }
                else{
                    redirect_link = '';
                }
                if(element.is_liked === true){
                    liked_class = 'liked';
                }
                else{
                    liked_class = 'unliked';
                }
                var comments='';

                if(element.comments_count > 3){
                    comments = '<a href="#" onclick="viewComments(\'' + element.id + '\')" style="font-size:14px" class="link-custom" id="previous-comments-story-'+element.id+'"> view previous comments  </a> <br>';
                }

                $.each( element.comments.reverse(), function( index, element ){
                    comments += '<div class="d-flex pt-2"> <div class="mr-2 circular-small"> <img src="'+base_url_public+ '/' +element.user.display+'"> </div> <div class="mr-auto"> <strong>'+element.user.username+'</strong>: <span style="font-size: 14px">'+element.comment+'</span> </div></div>'
                });

                recent_stories += '<div class="card-body rounded bg-custom"> <div class="d-flex pt-2"> <div class="mr-2 circular"> <img src="'+base_url_public+ '/' +element.user.display+'" class="rounded-circle"> </div> <div class="mr-auto"> <div class="card-title"> <h4>'+element.title+'</h4> <h6 class="card-subtitle mb-2 text-muted"> by <span style="font-size: large"> '+element.user.username+' </span> - '+element.updated_at+'</h6> </div> </div> <div id="copy" class="ml-2"> <a href="#" data-toggle="tooltip" title="Copy Link To Clipboard" onClick="generateLink(\'' + element.id + '\')"> <img id="copy_link" src="'+base_url_public+'/copy.svg" height="20px" width="20px"> </a> </div> </div> <p class="preview-'+element.id+'"> '+preview+' <a href="#" onClick="readMore(\'' + element.id + '\')"> <strong> Read More </strong></a></p><p class="story_preview story-'+element.id+'"> '+element.story+' '+redirect_link+ ' </p><div class="d-flex"><div class="mr-auto"><a href="#" ><i data-liked="'+element.is_liked+'" data-story-id="'+element.id+'" onclick="like_toggle(this)" class="fa fa-thumbs-up '+liked_class+' is-liked-'+element.id+'"></i></a><a href="#" onclick="viewLikes(\'' + element.id + '\')" class="likes-'+element.id+'"> '+element.likes_count+' </a></div><div class="col text-muted"> <a data-toggle="collapse" href="#collapseComments-'+element.id+'""> <i class="fa fa-comment"> <span class="comments-'+element.id+'">'+element.comments_count+'</span></i> </a></div></div><div class="p-0 col-12 collapse" id="collapseComments-'+element.id+'"><div class="bg-custom border-0 card card-body"><span class="story-comments-'+element.id+'">'+comments+'</span><form data-story-id="'+element.id+'" onsubmit="return post_comment(this);"><div class="card-body"><input type="text" name="story_id" value="' + element.id + '" hidden><div class="form-group"><textarea class="form-control form-text" name="comment" placeholder="Say something nice..."></textarea></div><button type="submit" class="btn btn-custom btn-block"><div id="create_comment_loader"></div> Post Comment </button></div></form></div></div><div class="mt-2 dot text-center"> </div></div>';
            });
            recent_stories_offset += 3;
            $('#recent_stories_card').append(recent_stories);
        },
        error: function() {
            $('#loader_recent').removeClass('loader');
            noInternet();
        }
    });
}

function trendingStories(){
    $.ajax({
        url: base_url+"/trending-stories",
        method: 'get',
        data: {
            trending_stories_offset:trending_stories_offset
        },
        success: function (response) {
            $('#loader_trending').removeClass('loader');
            var trending_stories = '';
            var story_length = 0;
            var preview_length = 0;
            var preview = '';
            var redirect_link = '';
            $.each( response.data, function( index, element ){
                story_length = (element.story).length;
                preview_length = (story_length%2 === 0) ? story_length/2 : story_length/2 + 0.5;
                preview = (element.story).substring(0, preview_length) + "...";
                if(element.post_link !== null){
                    redirect_link = '<a href="'+element.post_link+'"> <img id="redirect_link" src="'+base_url_public+'/link.svg" height="15px" width="15px"></a>';
                }
                else{
                    redirect_link = '';
                }
                if(element.is_liked === true){
                    liked_class = 'liked';
                }
                else{
                    liked_class = 'unliked';
                }
                var comments='';

                if(element.comments_count > 3){
                    comments = '<a href="#" onclick="viewComments(\'' + element.id + '\')" style="font-size:14px" class="link-custom" id="previous-comments-story-'+element.id+'"> view previous comments  </a> <br>';
                }

                $.each( element.comments.reverse(), function( index, element ){
                    comments += '<div class="d-flex pt-2"> <div class="mr-2 circular-small"> <img src="'+base_url_public+ '/' +element.user.display+'"> </div> <div class="mr-auto"> <strong>'+element.user.username+'</strong>: <span style="font-size: 14px">'+element.comment+'</span> </div></div>'
                });

                trending_stories += '<div class="card-body rounded bg-custom"> <div class="d-flex pt-2"> <div class="mr-2 circular"> <img src="'+base_url_public+ '/' +element.user.display+'" class="rounded-circle"> </div> <div class="mr-auto"> <div class="card-title"> <h4>'+element.title+'</h4> <h6 class="card-subtitle mb-2 text-muted"> by <span style="font-size: large"> '+element.user.username+' </span> - '+element.updated_at+'</h6> </div> </div> <div id="copy" class="ml-2"> <a href="#" data-toggle="tooltip" title="Copy Link To Clipboard" onClick="generateLink(\'' + element.id + '\')"> <img id="copy_link" src="'+base_url_public+'/copy.svg" height="20px" width="20px"> </a> </div> </div> <p class="preview-'+element.id+'"> '+preview+' <a href="#" onClick="readMore(\'' + element.id + '\')"> <strong> Read More </strong></a></p><p class="story_preview story-'+element.id+'"> '+element.story+' '+redirect_link+ ' </p><div class="d-flex"><div class="mr-auto"><a href="#" ><i data-liked="'+element.is_liked+'" data-story-id="'+element.id+'" onclick="like_toggle(this)" class="fa fa-thumbs-up '+liked_class+' is-liked-'+element.id+'""></i></a><a href="#" onclick="viewLikes(\'' + element.id + '\')" class="likes-'+element.id+'"> '+element.likes_count+' </a></div><div class="col text-muted"> <a data-toggle="collapse" href="#collapseComments-'+element.id+'""> <i class="fa fa-comment"> <span class="comments-'+element.id+'">'+element.comments_count+'</span></i> </a></div></div><div class="p-0 col-12 collapse" id="collapseComments-'+element.id+'"><div class="bg-custom border-0 card card-body"><span class="story-comments-'+element.id+'">'+comments+'</span><form data-story-id="'+element.id+'" onsubmit="return post_comment(this);"><div class="card-body"><input type="text" name="story_id" value="' + element.id + '" hidden><div class="form-group"><textarea class="form-control form-text" name="comment" placeholder="Say something nice..."></textarea></div><button type="submit" class="btn btn-custom btn-block"><div id="create_comment_loader"></div> Post Comment </button></div></form></div></div><div class="mt-2 dot text-center"> </div></div>';
            });
            trending_stories_offset += 3;
            $('#trending_stories_card').append(trending_stories);
        },
        error: function() {
            $('#loader_trending').removeClass('loader');
            noInternet();
        }
    });
}

function yourStories() {
    if(token !== null){
        $.ajaxSetup({
            headers: {
                'Authorization': 'Bearer '+token
            }
        });
        $.ajax({
            url: base_url+"/your-stories",
            method: 'get',
            data: {
                your_stories_offset:your_stories_offset
            },
            success: function (response) {
                $('#loader_your').removeClass('loader');
                var your_stories = '';
                var redirect_link = '';
                $.each( response.data, function( index, element ){
                    if(element.post_link !== null){
                        redirect_link = '<a href="'+element.post_link+'"> <img id="redirect_link" src="'+base_url_public+'/link.svg" height="15px" width="15px"></a>';
                    }
                    else{
                        redirect_link = '';
                    }
                    if(element.is_liked === true){
                        liked_class = 'liked';
                    }
                    else{
                        liked_class = 'unliked';
                    }
                    var comments='';

                    if(element.comments_count > 3){
                        comments = '<a href="#" onclick="viewComments(\'' + element.id + '\')" style="font-size:14px" class="link-custom" id="previous-comments-story-'+element.id+'"> view previous comments  </a> <br>';
                    }

                    $.each( element.comments.reverse(), function( index, element ){
                        comments += '<div class="d-flex pt-2"> <div class="mr-2 circular-small"> <img src="'+base_url_public+ '/' +element.user.display+'"> </div> <div class="mr-auto"> <strong>'+element.user.username+'</strong>: <span style="font-size: 14px">'+element.comment+'</span> </div></div>'
                    });
                    your_stories += '<div class="card-body rounded bg-custom"><div class="d-flex pt-2"> <div class="mr-2 circular"> <img src="'+base_url_public+ '/' +element.user.display+'" class="rounded-circle"> </div> <div class="mr-auto"> <div class="card-title"> <h4>'+element.title+'</h4> <h6 class="card-subtitle mb-2 text-muted"> by <span style="font-size: large"> '+element.user.username+' </span> - '+element.updated_at+'</h6> </div></div><div><div id="delete" class="ml-2"> <a href="#" data-toggle="tooltip" title="Delete this story" onClick="confirmDelete(\'' + element.id + '\')"> <img id="delete_link" src="'+base_url_public+'/delete.png" height="20px" width="20px"></a></div></div><div><div id="copy" class="col"> <a href="#" data-toggle="tooltip" title="Copy Link To Clipboard" onClick="generateLink(\'' + element.id + '\')"> <img id="copy_link" src="'+base_url_public+'/copy.svg" height="20px" width="20px"></a></div></div></div></div><p class="story-'+element.id+'"> '+element.story+' '+redirect_link+ ' </p> <div class="d-flex"><div class="mr-auto"><a href="#" ><i data-liked="'+element.is_liked+'" data-story-id="'+element.id+'" onclick="like_toggle(this)" class="fa fa-thumbs-up '+liked_class+' is-liked-'+element.id+'""></i></a><a href="#" onclick="viewLikes(\'' + element.id + '\')" class="likes-'+element.id+'"> '+element.likes_count+' </a></div><div class="col text-muted"> <a data-toggle="collapse" href="#collapseComments-'+element.id+'""> <i class="fa fa-comment"> <span class="comments-'+element.id+'">'+element.comments_count+'</span></i> </a></div></div><div class="p-0 col-12 collapse" id="collapseComments-'+element.id+'"><div class="bg-custom border-0 card card-body"><span class="story-comments-'+element.id+'">'+comments+'</span><form data-story-id="'+element.id+'" onsubmit="return post_comment(this);"><div class="card-body"><input type="text" name="story_id" value="' + element.id + '" hidden><div class="form-group"><textarea class="form-control form-text" name="comment" placeholder="Say something nice..."></textarea></div><button type="submit" class="btn btn-custom btn-block"><div id="create_comment_loader"></div> Post Comment </button></div></form></div></div><div class="mt-2 dot text-center"> </div></div>';
                });
                your_stories_offset += 3;
                $('#your_stories_card').append(your_stories);
            },
            error: function () {
                $('#load_more_your_div').hide();
                $('#create_story_form').hide();
                login_button = '<div class="container">\n' +
                    '                    <div class="row">\n' +
                    '                        <div class="col text-center">\n' +
                    '                            <button type="button" class="btn btn-custom btn-info btn-round" id="login_button" style="background-color: #054640; color: white; border: none" data-toggle="modal" data-target="#loginModal"> Login | Sign Up </button>\n' +
                    '                        </div>\n' +
                    '                    </div>\n' +
                    '                </div>';
                $('#your_stories').append(login_button);
            }
        });
    }
    else{
        login_button = '<div class="container">\n' +
            '                    <div class="row">\n' +
            '                        <div class="col text-center">\n' +
            '                            <button type="button" class="btn btn-custom btn-info btn-round" id="login_button" style="background-color: #054640; color: white; border: none" data-toggle="modal" data-target="#loginModal"> Login | Sign Up </button>\n' +
            '                        </div>\n' +
            '                    </div>\n' +
            '                </div>';
        $('#your_stories').append(login_button);
    }
}

function readMore(id) {
    $('.preview-' + id).hide();
    $('.story-'+id).show();

    $.ajax({
        url: base_url+"/up-story",
        method: 'get',
        data: {
            id:  id
        },
    });
}

function generateLink(id) {
    var story_url =  base_url_public + "/" + id;
    copyToClipboard(story_url);
}

function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);

    swal({
        text: "Link Copied to Clipboard!",
        timer: 2000,
        showCancelButton: false,
        showConfirmButton: false,
        buttonsStyling: false,
        toast: true,
        position: 'center',
    });
}

function confirmDelete(id) {
    swal({
        title: "Are You Sure?",
        text: "You won't be able to recover this story!",
        type: "warning",
        showCancelButton: true,
        cancelButtonText: "No!",
        confirmButtonColor: "#c93939",
        confirmButtonText: "Yes!",
        focusConfirm: false
    }).then(function(isConfirm) {
        if(isConfirm.value){
            $.ajaxSetup({
                headers: {
                    'Authorization': 'Bearer '+token
                }
            });
            $.ajax({
                url: base_url+"/delete-story",
                type: "POST",
                data: {
                    id: id
                },
                dataType: "json",
                success: function (data) {
                    if(data.status === true){
                        swal({
                            type: 'success',
                            title: "Deleted!",
                            text: "Your story has been deleted!",
                            timer: 2000,
                            showCancelButton: false,
                            showConfirmButton: false,
                            buttonsStyling: false,
                        });
                        your_stories_offset =0;
                        recent_stories_offset =0;
                        trending_stories_offset =0;
                        $('#your_stories_card').empty();
                        $('#recent_stories_card').empty();
                        $('#trending_stories_card').empty();
                        yourStories();
                        recentStories();
                        trendingStories();
                    }
                    else{
                        swal("Error deleting...", "Something Went Wrong!", "error");
                    }
                },
                error: function () {
                    swal("Error deleting...", "Please try again!", "error");
                }
            });
        }
    });
}

function like_toggle(element) {
    var audio = document.getElementById("audio");
    var is_liked = element.getAttribute('data-liked');
    var story_id = element.getAttribute('data-story-id');
    $.ajaxSetup({
        headers: {
            'Authorization': 'Bearer '+token
        }
    });
    $.ajax({
        type: "GET",
        url: base_url+"/like-unlike-story",
        data: {
            story_id:story_id
        },
        success: function(data)
        {
            audio.play();

            if(is_liked === 'false'){
                $('.is-liked-'+story_id).attr('data-liked',true).removeClass('unliked').addClass('liked');
                $('.likes-'+story_id).text(' ' +data.data.likes_count);
            }
            else{
                $('.is-liked-'+story_id).attr('data-liked',false).removeClass('liked').addClass('unliked');
                $('.likes-'+story_id).text(' ' +data.data.likes_count);
            }
        },
        error: function()
        {
            if (token !== null){
                noInternet();
            }
            else {

                if ($('#storyModal').is(':visible')){
                    $('#loginModal').attr('style', 'background:rgba(1,1,1,0.5);');
                    $('#registerModal').attr('style', 'background:rgba(1,1,1,0.5);');
                }

                $('#loginModal').modal('show');
            }
        }
    });
}

function post_comment(element){
    var form = $(element);
    var story_id = element.getAttribute('data-story-id');

    $.ajax({
        type: "POST",
        url: base_url+"/add-comment",
        data: form.serialize(), // serializes the form's elements.
        success: function(data)
        {
            if (data.status === true){
                $('.comments-'+story_id).text(data.data.comments_count);
                var comments = ''

                if(data.data.comments_count > 3){
                    comments = '<a href="#" onclick="viewComments(\'' +story_id+ '\')" style="font-size:14px" class="link-custom" id="previous-comments-story-'+story_id+'"> view previous comments  </a> <br>';
                }

                $.each( data.data.comments.reverse(), function( index, element ){
                    comments += '<div class="d-flex pt-2"> <div class="mr-2 circular-small"> <img src="'+base_url_public+ '/' +element.user.display+'"> </div> <div class="mr-auto"> <strong>'+element.user.username+'</strong>: <span style="font-size: 14px">'+element.comment+'</span> </div></div>'
                });

                $('#storyModal').modal('hide');
                $('.story-comments-'+story_id).empty();
                $('.story-comments-'+story_id).append(comments);

                form.trigger("reset");
                swal({
                    type: 'success',
                    title: "Comment Posted!",
                    timer: 3000,
                    showCancelButton: false,
                    showConfirmButton: false
                });
            }
            else{
                swal({
                    title: "Error...",
                    text: "Comment field is required!",
                    timer: 3000,
                    type: "error",
                    showCancelButton: false,
                    showConfirmButton: false
                });
            }
        },
        error: function() {
            if (token !== null){
                noInternet();
            }
            else {

                if ($('#storyModal').is(':visible')){
                    $('#loginModal').attr('style', 'background:rgba(1,1,1,0.5);');
                    $('#registerModal').attr('style', 'background:rgba(1,1,1,0.5);');
                }

                $('#loginModal').modal('show');
            }
        }
    });
    return false;
}
