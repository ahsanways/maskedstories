var token = localStorage.getItem('token');
var username = localStorage.getItem('username');
var display = localStorage.getItem('display');
var popup = localStorage.getItem('popup');
var pathname = window.location.pathname;

$(document).ready(function() {
    if(popup === null){
        localStorage.setItem('popup',1);
        popup = localStorage.getItem('popup');
    }else{
        localStorage.setItem('popup',0);
        popup = 0;
    }
    if (window.matchMedia("(max-width: 767px)").matches) {
        $("#logo_svg").attr("height", "40%");
        $('.footer_link').attr('href', 'fb://page/113317013705121');
    } else {
        $("#logo_svg").attr("height", "50%");
        $('.footer_link').attr('href', 'https://www.facebook.com/MaskedStoriesOfficial');
    }

    if (token !== null) {
        verifyToken();
    }

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
        $('#logged_in').html('<button type="button" class="btn btn-custom btn-info btn-round" id="login_button_nav" style="background-color: #054640; color: white; border: none" data-toggle="modal" data-target="#loginModal"> Login | Sign Up </button>');
        $('#load_more_your_div').hide();
        $('#create_story_form').hide();
    }

    if (pathname !== '/' && pathname !== '/edit-profile') {

        var slug = pathname.replace(/^\/+/, '');
        $.ajax({
            type: "GET",
            url: base_url + "/get-story",
            data: {
                id: slug
            },
            success: function (data) {
                if (data.status === true) {
                    if(data.data.post_link !== null){
                        redirect_link = '<a href="'+data.data.post_link+'"> <img id="redirect_link" src="'+base_url_public+'/link.svg" height="15px" width="15px"></a>';
                    }
                    else{
                        redirect_link = '';
                    }
                    if(data.data.is_liked === true){
                        liked_class = 'liked';
                    }
                    else{
                        liked_class = 'unliked';
                    }
                    var comments='';

                    if(data.data.comments_count > 3){
                        comments = '<a href="#" onclick="viewComments(\'' + data.data.id + '\')" style="font-size:14px" class="link-custom" id="previous-comments-story-'+data.data.id+'"> view previous comments  </a> <br>';
                    }

                    $.each( data.data.comments.reverse(), function( index, element ){
                        comments += '<div class="d-flex pt-2"> <div class="mr-2 circular-small"> <img src="'+base_url_public+ '/' +element.user.display+'"> </div> <div class="mr-auto"> <strong>'+element.user.username+'</strong>: <span style="font-size: 14px">'+element.comment+'</span> </div></div>'
                    });
                    var story = '';
                    story = '<div class="modal-header border-0"><div class="d-flex pt-2"> <div class="mr-2 circular"> <img src="'+base_url_public+ '/' +data.data.user.display+'" class="rounded-circle"> </div> <div class="mr-auto"> <div class="card-title"> <h4>'+data.data.title+'</h4> <h6 class="card-subtitle mb-2 text-muted"> by <span style="font-size: large"> '+data.data.user.username+' </span> - '+data.data.updated_at+'</h6> </div> </div></div> <button onclick="redirectBack()"  type="button" class="close shadow-none" data-dismiss="modal" aria-label="Close"><span id="cross" aria-hidden="true">&times;</span></button></div><div class="modal-body"><p class="story-'+data.data.id+'"> '+data.data.story+' '+redirect_link+ ' </p> <div class="d-flex"><div class="mr-auto"><a href="#" ><i data-liked="'+data.data.is_liked+'" data-story-id="'+data.data.id+'" onclick="like_toggle(this)" class="fa fa-thumbs-up '+liked_class+' is-liked-'+data.data.id+'""></i></a><a href="#" onclick="viewLikes(\'' + data.data.id + '\')" class="likes-'+data.data.id+'"> '+data.data.likes_count+' </a></div><div class="col text-muted"> <a data-toggle="collapse" href="#collapseComments-'+data.data.id+'""> <i class="fa fa-comment"> <span class="comments-'+data.data.id+'">'+data.data.comments_count+'</span></i> </a></div></div><div class="p-0 col-12 collapse" id="collapseComments-'+data.data.id+'"><div class="bg-custom border-0 card card-body"><span class="story-comments-'+data.data.id+'">'+comments+'</span><form data-story-id="'+data.data.id+'" onsubmit="return post_comment(this);"><div class="card-body"><input type="text" name="story_id" value="' + data.data.id + '" hidden><div class="form-group"><textarea class="form-control form-text" name="comment" placeholder="Say something nice..."></textarea></div><button type="submit" class="btn btn-custom btn-block"><div id="create_comment_loader"></div> Post Comment </button></div></form></div></div></div></div>';
                    $('#storyModal').modal('show');
                    $('#link_story').append(story);
                } else {
                    linkBroken();
                    setTimeout(redirectBack, 3000);
                }
            }
        });
    }
});

function redirectBack(){
    window.location.replace(base_url_public);
}

function howItWorks() {
    $('#howItWorksModal').modal('show');
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

function unsetUser(){
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    $('#logged_in').html('<button type="button" class="btn btn-custom btn-info btn-round" id="login_button_nav" style="background-color: #054640; color: white; border: none" data-toggle="modal" data-target="#loginModal"> Login | Sign Up </button>');
    $('#your_stories_card').empty();
    your_stories_offset = 0;
    // yourStories();
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
        },
        error: function() {
            $('#logout_loader').removeClass('loader');
            $('#logoutModal').modal('hide');
            noInternet();
        }
    });
});

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

function noInternet() {
    swal({
        title: "The Internet?",
        text: "That thing is still around?",
        timer: 3000,
        type: "question",
        showCancelButton: false,
        showConfirmButton: false
    });
}

function linkBroken() {
    swal({
        title: "Uh-Oh...",
        text: "This link is broken. Let's take you back!",
        timer: 3000,
        type: "info",
        showCancelButton: false,
        showConfirmButton: false
    });
}
$("#login_button_nav").click(function(){
    $('#loginModal').modal('show');
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
});
