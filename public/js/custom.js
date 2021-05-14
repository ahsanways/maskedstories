var token = localStorage.getItem('token');
var username = localStorage.getItem('username');
var recent_stories_offset = 0;
var trending_stories_offset = 0;
var your_stories_offset = 0;
var pathname = window.location.pathname;
var users = Math.floor(Math.random() * (800 - 700) + 700);

$(document).ready(function(){
    swal({
        title: "Guess What?",
        text: users+' users are online right now! ☃️',
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
    });

    if(window.matchMedia("(max-width: 767px)").matches){

        $("#logo_svg").attr("height","40%");

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

        $('.footer_link').attr('href', 'fb://page/113317013705121');
    }
    else {
        $('.footer_link').attr('href', 'https://www.facebook.com/MaskedStoriesOfficial');
        $("#logo_svg").attr("height","50%");
    }

    $("#navTab a").click(function(e){
        e.preventDefault();
        $(this).tab('show');
    });

    $('[data-toggle="tooltip"]').tooltip();

    if(token !== null){
        verifyToken();
    }

    recentStories();
    trendingStories();
    yourStories();

    if (pathname === '/edit-profile' && token === null){
        swal({
            title: "Uh-Oh...",
            text: "This link is broken. Let's take you back!",
            timer: 3000,
            type: "info",
            showCancelButton: false,
            showConfirmButton: false
        });

        $('#body-container').hide();
        $('#howItWorks').hide();
        $('.footer-copyright').hide();
        setTimeout(redirectBack, 3000);
    }

    if(pathname !== '/'){

        var slug = pathname.replace(/^\/+/, '');
        $.ajax({
            type: "GET",
            url: base_url+"/get-story",
            data: {
                id:slug
            },
            success: function(data)
            {
                if (data.status === true){
                    var story = '';
                    story = '<div class="modal-header border-0"><div class="modal-title"><h4>'+data.data.title+'</h4><h6 class="muted-text">by <span style="font-size: large">'+data.data.username+'</span> - '+data.data.updated_at+'</h6></div><button onclick="redirectBack()"  type="button" class="close shadow-none" data-dismiss="modal" aria-label="Close"><span id="cross" aria-hidden="true">&times;</span></button></div><div class="modal-body">'+data.data.story+'</div>';
                    $('#storyModal').modal('show');
                    $('#link_story').append(story);
                }
                else{
                    swal({
                        title: "Uh-Oh...",
                        text: "This link is broken. Let's take you back!",
                        timer: 3000,
                        type: "info",
                        showCancelButton: false,
                        showConfirmButton: false
                    });
                    setTimeout(redirectBack, 3000);
                }
            }
        });
    }

    var texts = $('.story_preview');
    texts.hide();

    if(token !== null && username !== null){
        $('#logged_in').html(' <div class="btn-group">\n' +
            '            <button type="button" class="btn btn-custom btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\n' +
            '                '+username+'\n' +
            '            </button>\n' +
            '            <div class="dropdown-menu" style="min-width: 100%;">\n' +
            '                <a data-target="'+base_url_public+'/edit-profile"  target="_self" href="'+base_url_public+'/edit-profile" class="nav-btn dropdown-item">edit profile</a>\n' +
            '                <a href="#" class="nav-btn dropdown-item" onclick="showLogoutModal()" id="logout_button_link">logout</a>\n' +
            '            </div>\n' +
            '        </div>');
        $('#load_more_your_div').show();
        $('#create_story_form').show();
    }else{
        $('#load_more_your_div').hide();
        $('#create_story_form').hide();
    }
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

function redirectBack(){
    window.location.replace(base_url_public);
}

function howItWorks() {
    $('#howItWorksModal').modal('show');
}

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
                    likes += '<div><strong>'+element.username+'</strong>: <span style="font-size: 14px">'+element.updated_at+'</span></div>'
                });

                content = '<div class="modal-header border-0"><div class="modal-title" ><h4> All Likes </h4></div><button type="button" class="close shadow-none" data-dismiss="modal" aria-label="Close"><span id="cross" aria-hidden="true">&times;</span></button></div><div class="modal-body">'+likes+'</div>';
                $('#allLikes').empty();
                $('#allLikes').append(content);
                $('#likesModal').modal('show');
            }
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
                    comments += '<div><strong>'+element.username+'</strong>: <span style="font-size: 14px">'+element.comment+'</span></div>'
                });

                content = '<div class="modal-header border-0"><div class="modal-title"><h4> All Comments </h4></div><button type="button" class="close shadow-none" data-dismiss="modal" aria-label="Close"><span id="cross" aria-hidden="true">&times;</span></button></div><div class="modal-body">'+comments+'</div>';
                $('#allComments').empty();
                $('#allComments').append(content);
                $('#commentsModal').modal('show');
            }
        }
    });
}

function verifyToken(){
    $.ajaxSetup({
        headers: {
            'Authorization': 'Bearer '+token
        }
    });
    $.ajax({
        type: "GET",
        url: base_url+"/get-user",
        error: function(XMLHttpRequest)
        {
            if (XMLHttpRequest.readyState !== 0) {
                token = null;
                username = null;
                unsetUser();
                // localStorage.removeItem('token');
                // localStorage.removeItem('username');
                // $('#load_more_your_div').hide();
                // $('#create_story_form').hide();
            }
        },
    });
}

function showLogoutModal(){
    $('#logoutModal').modal('show');
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
}

$("#login_button_register").click(function(){
    $('#registerModal').modal('hide');
    $('#loginModal').modal('show');
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
});
$("#register_button").click(function(){
    $('#loginModal').modal('hide');
    $('#registerModal').modal('show');
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
});

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
                swal({
                    title: "The Internet?",
                    text: "That thing is still around?",
                    timer: 3000,
                    type: "question",
                    showCancelButton: false,
                    showConfirmButton: false
                });
            }
        });
    }
});

function unsetUser(){
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    $('#logged_in').empty();
    $('#your_stories_card').empty();
    your_stories_offset = 0;
    yourStories();
    redirectBack();
}

function setUser(){
    token = localStorage.getItem('token');
    username = localStorage.getItem('username');
    $('#logged_in').html(' <div class="btn-group">\n' +
        '            <button type="button" class="btn btn-custom btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\n' +
        '                '+username+'\n' +
        '            </button>\n' +
        '            <div class="dropdown-menu" style="min-width: 100%;">\n' +
        '                <a data-target="'+base_url_public+'/edit-profile"  target="_self" href="'+base_url_public+'/edit-profile" class="nav-btn dropdown-item">edit profile</a>\n' +
        '                <a href="#" class="nav-btn dropdown-item" onclick="showLogoutModal()" id="logout_button_link">logout</a>\n' +
        '            </div>\n' +
        '        </div>');
    $('#login_button').hide();
    // $('#your_stories_card').show();
    yourStories();
    $('#create_story_form').show();
    $('#load_more_your_div').show();
}

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
            swal({
                title: "The Internet?",
                text: "That thing is still around?",
                timer: 3000,
                type: "question",
                showCancelButton: false,
                showConfirmButton: false
            });
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
            swal({
                title: "The Internet?",
                text: "That thing is still around?",
                timer: 3000,
                type: "question",
                showCancelButton: false,
                showConfirmButton: false
            });
        }
    });
});

$("#logout_button").click(function(){
    $('#logout_loader').addClass('loader');

    $.ajaxSetup({
        headers: {
            'Authorization': 'Bearer '+token
        }
    });
    $.ajax({
        url: base_url+"/logout",
        method: 'get',
        success: function () {
            $('#logout_loader').removeClass('loader');
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            $('#logoutModal').modal('hide');
            unsetUser();
            // location.reload();
        },
        error: function() {
            $('#logout_loader').removeClass('loader');
            $('#logoutModal').modal('hide');
            swal({
                title: "The Internet?",
                text: "That thing is still around?",
                timer: 3000,
                type: "question",
                showCancelButton: false,
                showConfirmButton: false
            });
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
                preview_length = (story_length%2 === 0) ? story_length/2 : story_length/2 + 1;
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
                    comments += '<div><strong>'+element.username+'</strong>: <span style="font-size: 14px">'+element.comment+'</span></div>'
                });

                recent_stories += '<div class="card-body rounded bg-custom"> <div class="d-flex pt-2"> <div class="mr-auto"> <div class="card-title"> <h4>'+element.title+'</h4> <h6 class="card-subtitle mb-2 text-muted"> by <span style="font-size: large"> '+element.username+' </span> - '+element.updated_at+'</h6> </div> </div> <div id="copy" class="col"> <a href="#" data-toggle="tooltip" title="Copy Link To Clipboard" onClick="generateLink(\'' + element.id + '\')"> <img id="copy_link" src="'+base_url_public+'/copy.svg" height="20px" width="20px"> </a> </div> </div> <p class="preview-'+element.id+'"> '+preview+' <a href="#" onClick="readMore(\'' + element.id + '\')"> <strong> Read More </strong></a></p><p class="story_preview story-'+element.id+'"> '+element.story+' '+redirect_link+ ' </p><div class="d-flex"><div class="mr-auto"><a href="#" ><i data-liked="'+element.is_liked+'" data-story-id="'+element.id+'" onclick="like_toggle(this)" class="fa fa-thumbs-up '+liked_class+' "></i></a><a href="#" onclick="viewLikes(\'' + element.id + '\')" class="likes-'+element.id+'"> '+element.likes_count+' </a></div><div class="col text-muted"> <a data-toggle="collapse" href="#collapseComments-'+element.id+'""> <i class="fa fa-comment"> <span class="comments-'+element.id+'">'+element.comments_count+'</span></i> </a></div></div><div class="p-0 col-12 collapse" id="collapseComments-'+element.id+'"><div class="bg-custom border-0 card card-body"><span id="story-comments-'+element.id+'">'+comments+'</span><form data-story-id="'+element.id+'" onsubmit="return post_comment(this);" id="create_comment_form_'+element.id+'"><div class="card-body"><input type="text" name="story_id" value="' + element.id + '" hidden><div class="form-group"><textarea class="form-control comment-text" name="comment" placeholder="Say something nice..."></textarea></div><button type="submit" class="btn btn-custom btn-block"><div id="create_comment_loader"></div> Post Comment </button></div></form></div></div><div class="mt-2 dot text-center"> </div></div>';
            });
            recent_stories_offset += 3;
            $('#recent_stories_card').append(recent_stories);
        },
        error: function() {
            $('#loader_recent').removeClass('loader');
            swal({
                title: "The Internet?",
                text: "That thing is still around?",
                timer: 3000,
                type: "question",
                showCancelButton: false,
                showConfirmButton: false
            });
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
                preview_length = (story_length%2 === 0) ? story_length/2 : story_length/2 + 1;
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
                    comments += '<div><strong>'+element.username+'</strong>: <span style="font-size: 14px">'+element.comment+'</span></div>'
                });

                trending_stories += '<div class="card-body rounded bg-custom"> <div class="d-flex pt-2"> <div class="mr-auto"> <div class="card-title"> <h4>'+element.title+'</h4> <h6 class="card-subtitle mb-2 text-muted"> by <span style="font-size: large"> '+element.username+' </span> - '+element.updated_at+'</h6> </div> </div> <div id="copy" class="col"> <a href="#" data-toggle="tooltip" title="Copy Link To Clipboard" onClick="generateLink(\'' + element.id + '\')"> <img id="copy_link" src="'+base_url_public+'/copy.svg" height="20px" width="20px"> </a> </div> </div> <p class="preview-'+element.id+'"> '+preview+' <a href="#" onClick="readMore(\'' + element.id + '\')"> <strong> Read More </strong></a></p><p class="story_preview story-'+element.id+'"> '+element.story+' '+redirect_link+ ' </p><div class="d-flex"><div class="mr-auto"><a href="#" ><i data-liked="'+element.is_liked+'" data-story-id="'+element.id+'" onclick="like_toggle(this)" class="fa fa-thumbs-up '+liked_class+' "></i></a><a href="#" onclick="viewLikes(\'' + element.id + '\')" class="likes-'+element.id+'"> '+element.likes_count+' </a></div><div class="col text-muted"> <a data-toggle="collapse" href="#collapseComments-'+element.id+'""> <i class="fa fa-comment"> <span class="comments-'+element.id+'">'+element.comments_count+'</span></i> </a></div></div><div class="p-0 col-12 collapse" id="collapseComments-'+element.id+'"><div class="bg-custom border-0 card card-body"><span id="story-comments-'+element.id+'">'+comments+'</span><form data-story-id="'+element.id+'" onsubmit="return post_comment(this);" id="create_comment_form_'+element.id+'"><div class="card-body"><input type="text" name="story_id" value="' + element.id + '" hidden><div class="form-group"><textarea class="form-control comment-text" name="comment" placeholder="Say something nice..."></textarea></div><button type="submit" class="btn btn-custom btn-block"><div id="create_comment_loader"></div> Post Comment </button></div></form></div></div><div class="mt-2 dot text-center"> </div></div>';
            });
            trending_stories_offset += 3;
            $('#trending_stories_card').append(trending_stories);
        },
        error: function() {
            $('#loader_trending').removeClass('loader');
            swal({
                title: "The Internet?",
                text: "That thing is still around?",
                timer: 3000,
                type: "question",
                showCancelButton: false,
                showConfirmButton: false
            });
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
                        comments += '<div><strong>'+element.username+'</strong>: <span style="font-size: 14px">'+element.comment+'</span></div>'
                    });
                    your_stories += '<div class="card-body rounded bg-custom"><div class="d-flex pt-2"><div class="mr-auto"><div class="card-title"> <h4>'+element.title+'</h4> <h6 class="card-subtitle mb-2 text-muted"> by <span style="font-size: large"> '+element.username+' </span> - '+element.updated_at+'</h6> </div></div><div><div id="delete"> <a href="#" data-toggle="tooltip" title="Delete this story" onClick="confirmDelete(\'' + element.id + '\')"> <img id="delete_link" src="'+base_url_public+'/delete.png" height="20px" width="20px"></a></div></div><div><div id="copy" class="col"> <a href="#" data-toggle="tooltip" title="Copy Link To Clipboard" onClick="generateLink(\'' + element.id + '\')"> <img id="copy_link" src="'+base_url_public+'/copy.svg" height="20px" width="20px"></a></div></div></div></div><p class="story-'+element.id+'"> '+element.story+' '+redirect_link+ ' </p> <div class="d-flex"><div class="mr-auto"><a href="#" ><i data-liked="'+element.is_liked+'" data-story-id="'+element.id+'" onclick="like_toggle(this)" class="fa fa-thumbs-up '+liked_class+' "></i></a><a href="#" onclick="viewLikes(\'' + element.id + '\')" class="likes-'+element.id+'"> '+element.likes_count+' </a></div><div class="col text-muted"> <a data-toggle="collapse" href="#collapseComments-'+element.id+'""> <i class="fa fa-comment"> <span class="comments-'+element.id+'">'+element.comments_count+'</span></i> </a></div></div><div class="p-0 col-12 collapse" id="collapseComments-'+element.id+'"><div class="bg-custom border-0 card card-body"><span id="story-comments-'+element.id+'">'+comments+'</span><form data-story-id="'+element.id+'" onsubmit="return post_comment(this);" id="create_comment_form_'+element.id+'"><div class="card-body"><input type="text" name="story_id" value="' + element.id + '" hidden><div class="form-group"><textarea class="form-control comment-text" name="comment" placeholder="Say something nice..."></textarea></div><button type="submit" class="btn btn-custom btn-block"><div id="create_comment_loader"></div> Post Comment </button></div></form></div></div><div class="mt-2 dot text-center"> </div></div>';
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
                    '                            <button type="button" class="btn btn-custom btn-info btn-round" id="login_button" style="background-color: #054640; color: white; border: none" data-toggle="modal" data-target="#loginModal"> Login / Sign Up </button>\n' +
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
            '                            <button type="button" class="btn btn-custom btn-info btn-round" id="login_button" style="background-color: #054640; color: white; border: none" data-toggle="modal" data-target="#loginModal"> Login / Sign Up </button>\n' +
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

// dark mode //

const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

toggleSwitch.addEventListener('change', switchTheme, false);

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark'); //add this
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light'); //add this
    }
}

const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
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
            if(is_liked === 'false'){
                $(element).removeClass('unliked').addClass('liked');
                $(element).attr('data-liked',true);
                // console.log(data.data.likes_count);
                $('.likes-'+story_id).text(' ' +data.data.likes_count);
            }
            else{
                $(element).removeClass('liked').addClass('unliked');
                $(element).attr('data-liked',false);
                $('.likes-'+story_id).text(' ' +data.data.likes_count);
            }
        },
        error: function()
        {
            $('#loginModal').modal('show');
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
            $('.comments-'+story_id).text(data.data.comments_count);
            var comments = ''

            if(data.data.comments_count > 3){
                comments = '<a href="#" onclick="viewComments(\'' +story_id+ '\')" style="font-size:14px" class="link-custom" id="previous-comments-story-'+story_id+'"> view previous comments  </a> <br>';
            }

            $.each( data.data.comments.reverse(), function( index, element ){
                comments += '<div><strong>'+element.username+'</strong>: <span style="font-size: 14px">'+element.comment+'</span></div>'
            });

            $('#story-comments-'+story_id).empty();
            $('#story-comments-'+story_id).append(comments);

            form.trigger("reset");
            swal({
                type: 'success',
                title: "Comment Posted!",
                timer: 3000,
                showCancelButton: false,
                showConfirmButton: false
            });
        },
        error: function() {
            $('#loginModal').modal('show');
        }
    });
    return false;
}
