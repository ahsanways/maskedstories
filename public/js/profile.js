$(document).ready(function() {

    if (token === null){
        $('#body-container').hide();
        $('#howItWorks').hide();
        $('.footer-copyright').hide();
        linkBroken();
        setTimeout(redirectBack, 3000);
    }

    $('#username').attr('value',username);
    if(display !== null){
        $('#display_image').attr('src',base_url_public+'/'+display);
    }

    var readURL = function(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('.avatar').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }


    $(".file-upload").on('change', function(){
        readURL(this);
    });
});

$("#update_profile_form").submit(function(e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.
    $('#update_profile_loader').addClass('loader');

    var form = $(this);

    $.ajax({
        type: "POST",
        url: base_url + "/update-profile",
        data: form.serialize(), // serializes the form's elements.
        success: function (data) {
            var update_errors='';
            $('#update_profile_loader').removeClass('loader');
            if (data.status === true) {
                $('#profile_update_alert').html('<div class="alert alert-success">Your profile has been updated successfully!</div>');
                localStorage.setItem('username',data.data.username);
                localStorage.setItem('display',data.data.display);
                setTimeout(function () {
                    location.reload();
                }, 3000);

            }
            if (data.status === false) {
                $.each( data.error, function( index, element ){
                    update_errors += ''+element+'\n';
                });
                $('#profile_update_alert').html('<div class="alert alert-danger">'+update_errors+'</div>')
            }
        },
        error: function () {
            $('#update_profile_loader').removeClass('loader');
        }
    });
});

$(document).on('change', '#update_display', function(){
    var fd = new FormData();
    var files = $('#update_display')[0].files[0];
    fd.append('file',files);

    $.ajax({
        url: base_url + "/upload-profile-image",
        type: 'post',
        data: fd,
        contentType: false,
        processData: false,
        success: function(response){
            $('#display').attr('value',response.data.profile_image_url);
        },
    });
});
