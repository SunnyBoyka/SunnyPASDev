var LogIn = {
    myModal: null,
    callback: null,    
    href_template: "The query could be INSERT INTO all_users (name,email,pwd) VALUES('_NAME_','_EMAIL_','namma@metro')",
    start_action: function (data, tag) {
        $("a[do_click]").hide();
        new TemplateRenderer(data, tag, "~/Scripts/Components/ReUse/LogIn/Login.html", null, false, false).start_action().
            then(jData => {
                //$("#do_click").click(e => {
                //    alert("Project1")
                //})
                $("a[do_click]").click(e => LogIn.click_href(e, $('#user_email').val() , 'register'))
                $("a[login_result]").click(e => LogIn.click_href(e, $('#user_email').val(), 'LoginFailed'))
                LogIn.getLoggedInInfo();    
            });
    },
    getLoggedInInfo: async function () {
        let user_details = await $.ajax({ url: config.contextPath + "Home/GetUserDetails" });
        if (!user_details) return user_details;
        BasicAction.user = JSON.parse(user_details)        
        return BasicAction.user;
    },
    ShowLoginDialog: function (callback) {
        $("#login_body>[login_result]").hide();
        LogIn.callback = callback;
        let options = {}; options.focus = true; options.keyboard = true;
        if (LogIn.myModal === null) LogIn.myModal = new bootstrap.Modal(document.getElementById('LogInModal'), options);
        LogIn.myModal.show();
    },
    LogInUser: async function (e, mail, pwd) {
        debugger;
        LogIn.typed_email = mail;
        //alert("EMail : " + mail + "\nPwd : " + pwd);
        let user_info = await $.ajax({
            url: config.contextPath + "Home/LogInUser",
            method: "POST",
            data: { "user_email": mail, "user_pwd": pwd }
        });
        if (!user_info) {
            $("#login_result").html("Login failed !!! ");
            $("#login_body>[login_result]").show();
            return;
        }
        
        LogIn.myModal.hide();
        //alert(user_info);
        BasicAction.user = JSON.parse(user_info);
        Header.SetUserName(BasicAction.user.name);
        if (LogIn.callback) LogIn.callback(user_info)
        else alert("Try your earlier action once again");
    },
    click_href: function (e, mail, what) {
        let back_fill = LogIn.href_template.replace(/_NAME_/g, mail.split('@')[0]).replace(/_EMAIL_/g, mail)
        let href = null
        switch(what) {
            case 'register':
                href = $(e.target).attr('href');
                href = href.replace(/_QA_/g, back_fill);
                $(e.target).attr({ "href": href });
                break;
            case 'LoginFailed':
                href = $(e.target).attr('href');
                href = href.replace(/_QA_/g, "My Login failed I might have forgotten my password");
                $(e.target).attr({ "href": href });
                break;
        }
    }
};
