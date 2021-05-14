<div class="modal fade" id="likesModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content" id="allLikes">

        </div>
    </div>
</div>
<div class="modal fade" id="commentsModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content" id="allComments">

        </div>
    </div>
</div>
<div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header border-0">
                <button type="button" class="close shadow-none" data-dismiss="modal" aria-label="Close">
                    <span id="cross" aria-hidden="true">&times;</span>
                </button>
            </div>

            <div class="modal-body">
                <div class="form-title text-center">
                    <h4>Login</h4>
                </div>
                <br>
                <div id="login_errors"></div>
                <div class="d-flex flex-column text-center">
                    <form id="login_form">
                        <div class="form-group">
                            <input type="text" class="form-control" name="username" placeholder="Username" required>
                        </div>
                        <div class="form-group">
                            <input type="password" class="form-control" name="password" placeholder="Password" required>
                        </div>
                        <button type="submit" class="btn btn-custom btn-info btn-block btn-round"><div id="login_loader"></div>Login</button>
                    </form>
                </div>
                <div class="modal-footer border-0 d-flex justify-content-center">
                    <div class="signup-section">Not a member yet? <a href="#" id="register_button" class="text-info">Sign Up</a></div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="registerModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header border-0">
                <button type="button" class="close shadow-none" data-dismiss="modal" aria-label="Close">
                    <span id="cross" aria-hidden="true">&times;</span>
                </button>
            </div>

            <div class="modal-body">
                <div class="form-title text-center">
                    <h4>Sign Up</h4>
                </div>
                <br>
                <div id="register_errors"></div>
                <div class="d-flex flex-column text-center">
                    <form id="register_form">
                        <div class="form-group">
                            <input type="text" class="form-control" name="username" placeholder="Username" required>
                        </div>
                        <div class="form-group">
                            <input type="password" class="form-control" name="password" placeholder="Password" minlength="8" required>
                        </div>
                        <button type="submit" class="btn btn-custom btn-info btn-block btn-round"><div id="register_loader"></div>Sign Up</button>
                    </form>
                </div>
                <div class="modal-footer border-0 d-flex justify-content-center">
                    <div class="signup-section">Already a member? <a href="#" id="login_button_register" class="text-info"> Login</a></div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header border-0">
                <button type="button" class="close shadow-none" data-dismiss="modal" aria-label="Close">
                    <span id="cross" aria-hidden="true">&times;</span>
                </button>
            </div>

            <div class="modal-body">
                <div class="d-flex flex-column text-center">
                    <h5>Are you sure you want to logout?</h5>
                    <div class="modal-footer border-0 d-flex justify-content-center">
                        <button id="logout_button" class="btn btn-custom btn-info btn-block btn-round"><div id="logout_loader"></div>Logout</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="storyModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content" id="link_story">

        </div>
    </div>
</div>
<div class="modal fade" id="howItWorksModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header border-0">
                <button type="button" class="close shadow-none" data-dismiss="modal" aria-label="Close">
                    <span id="cross" aria-hidden="true">&times;</span>
                </button>
            </div>

            <div class="modal-body">
                <div class="d-flex flex-column">
                    <div class="text-center mb-2 mt-2">
                        <h4>Want to tell a story without being judged?</h4>
                    </div>
                    <p> You can do that here on <b>Masked Stories</b>. Create an account with any username of your choice. Write the story you're dying to tell the world and see it come to life as you let it go 😉 </p>
                    <p> <b>How? </b> Masked Stories Application is integrated with our facebook page <a class="footer_link" target="_blank" title="Masked Stories Facebook"> Masked Stories </a> and all the stories posted here and are directly posted to the page<a class="footer_link" target="_blank" title="Masked Stories Facebook"> <img alt="Masked Stories Facebook" width="25px" height="25px" src="{{asset('/facebook.png')}}"> </a></p>
                    <p class="text-muted"> This application is work in progress, so please feel free to share your ideas and opinions on how we can make it better! 💌 </p>
                    <b>Disclaimer:</b>
                    <ul>
                        <li>
                            All the stories posted are prone to all sorts of reactions and usage so please avoid using real / full names and contact information(s).
                        </li>
                        <li>
                            If the story is posted to facebook as well, deleting it in the app will not delete it from facebook page.
                        </li>
                        <li>
                            <b>Masked Stories</b> has the right to delete any story that is flagged inappropriate in any way.
                        </li>
                        <li>
                            As per our <b>complete anonymity</b> policy, we can not help you locate any identity even your own in case you forget your username/password.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
