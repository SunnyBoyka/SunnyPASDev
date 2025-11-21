var Header = {
    to_show_side_bar: true,
    myModal: null,
    TheIcon: null,
    log_off: `<div class="m-1">
                <button class="me-auto btn btn-outline-info btn-sm rounded-pill mt-1" data-bs-toggle="modal" data-bs-target="#LogInModal"
                    style="padding-right:0px; padding-top:0px;padding-bottom:0px;">
                   <small class="text-white fw-bold fs-small" id="welcome_message"></small>
                   <span class="badge text-dark border border-3 rounded-circle p-0">
                    <img src='_VD_Content/images/18.png' class='rounded-circle border border-3 border-light' style='width:30px;'>                    
                   </span>                   
                </button>                
              </div>`,
    log_in: '<a class="btn btn-light m-2" href="_VD_Home/Login#log_me_in" >Sign in</a>',
    start_action: function (jData, tag) {
        return (new TemplateRenderer(jData, tag, "~/Scripts/Components/Header/Header.html", null, false, true).start_action()).
            then(async (value) => {
                //Header.ObserverURlChange();
                Header.HighlightNavigationMenu(null);
                $("#welcome_message").html("");
                try {
                    if (LoggedInUser.id <= 0) {
                        $("#login_status").html(Header.log_in.replace(/_VD_/g, config.contextPath));
                        //theApp.RedirectIfUserSessionExpired();
                        return "From header";
                    }
                    let val = await $.ajax({ url: config.contextPath + "Home/GetUserInfo" });
                    if (!val) return;
                    let jData = JSON.parse(val)[0];
                    LoggedInUser.id = jData.id;
                    LoggedInUser.name = jData.name;
                    $("#acc_user_name").html(jData.name);
                    $("#acc_user_mail").html(jData.mail)
                    LoggedInUser.mail = jData.mail;
                    $("#acc_user_role").html(jData.roles);
                    LoggedInUser.roles = jData.roles.split(',');
                    if (!LoggedInUser.roles.find(x => x === 'admin')) $("#truststore-link").hide();
                    if (!LoggedInUser.roles.find(x => x === 'admin')) $("#user-link").hide();
                    if (!LoggedInUser.roles.find(x => x === 'admin')) $("#syslog-link").hide();
                    if (!LoggedInUser.roles.find(x => x === 'admin')) $("#admin-link").hide();
                    //if (!LoggedInUser.roles.find(x => x === 'user')) $("#publish-link").hide();
                    if (!LoggedInUser.roles.find(x => x === 'admin')) $("#truststore-link").hide();
                    if (!LoggedInUser.roles.find(x => x === 'admin')) $("#onetimesetup-link").hide();
                    $("#login_status").html(Header.log_off.replace(/_VD_/g, config.contextPath));//.replace(/_USER.IDENTITY.NAME_/g, jData.name));
                    if (jData.profileImagePath) $("#prof_img").attr({ "src": jData.profileImagePath });
                    $("#welcome_message").html("Welcome " + jData.name);
                } catch (xhr) {
                    //alert("xhr : " + JSON.stringify(xhr, null, ' '));
                    $("#login_status").html(Header.log_in.replace(/_VD_/g, config.contextPath));
                    return "From header";
                }
            });
    },
    ObserverURlChange: function () {
        let previousUrl = '';
        const observer = new MutationObserver((mutationList, observer) => {
            if (location.href !== previousUrl) {
                previousUrl = location.href;
                // alert(`URL changed to `+ document.location.href);
                Header.HighlightNavigationMenu();
            }
        });
        const mutation_config = { subtree: true, childList: true };
        observer.observe(document, mutation_config);
    },
    TakeNavLinkAction: function (link) {
        $("a[zora]").removeClass("active");
        link.addClass("active");
    },
    ShowHideSideBar: function (e, JID_Beer_bar) {
        if (!Header.to_show_side_bar)return;
        //if (e && e.target === $(JID_Beer_bar)[0]) return;        
        $("ul[beer_bar]").not(JID_Beer_bar).hide(1000, function () {
            if (JID_Beer_bar !== "#undefined") $(JID_Beer_bar).show(1000);
        });
        //$("ul[beer_bar]").find("a[class='nav-link']").removeClass("active");
    },
    ActiveInactive: function (e) {
        $('a[pichi]').removeClass('bar-active');
        $(e.target).addClass('bar-active');
    },
    HighlightNavigationMenu: function (e, jid) {
        if (!e) { //this is on page load
            let url = window.location.pathname; // Returns path only (/path/example.html)
            let current_link = $("a[class*='nav-link'][href='_URL_']".replace(/_URL_/, url));
            let par_li = current_link.closest("li");
            let bar_ul = par_li.find("ul[beer_bar]");
            
            let full_url = window.location.href; // Returns full URL (https://example.com/path/example.html#updatePassword)
            let hash = full_url.split("#")[1];
            let bone_anchor_element = par_li.find("a[href='#" + hash + "']");

            Header.TakeNavLinkAction(current_link);
            if (!Header.to_show_side_bar) return;
            Header.ActiveInactive({ target: $(bone_anchor_element)[0] });
            bar_ul.show(1000);
        } else {
            $('a[pichi]').removeClass('bar-active');
            Header.TakeNavLinkAction($(e.target));
            Header.ShowHideSideBar(null, jid);
        }
    },
    SetUserName: function (user_name) {
        Header.TheIcon.SetUserDetails();
    },
    handleFileSelect: async function (e) {
        Header.selectedFile = e.target.files[0];
        var fd = new FormData();
        fd.append("question_file", Header.selectedFile);
        let sumbit_ans_result = await $.ajax({
            url: config.contextPath + "Home/SubmitProfileImage",
            type: "POST",
            contentType: 'multipart/form-data',
            data: fd,
            contentType: false,
            processData: false,
        });
        if (sumbit_ans_result) $("#prof_img").attr({ "src": sumbit_ans_result });
    }
}
