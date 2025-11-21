var UpdatePassword = {
    user_id: -1,
    start_action: async function (tag, data) {
        if (data.user_info) UpdatePassword.user_id = data.user_info.id;
        else {
            let user_info = await UpdatePassword.GetCurrentUser()
            data.user_info = JSON.parse(user_info);
            UpdatePassword.user_id = data.user_info.id;
        }
        return new TemplateRenderer(data, tag, "~/Scripts/Components/UpdatePassword/UpdatePassword.html", null, false, true).start_action()
            .then(async (jData) => {
                $("#user_name").val(data.user_info.name);
                $("#user_mail").val(data.user_info.mail);
                $("#user_role").val(data.user_info.role);
                return "Done from UpdatePassword";
            });
    },
    GetCurrentUser: function () { return $.ajax({ url: config.contextPath + 'Home/GetCurrentUser' }); },
    updateUser: function (e) {
        let name = $("#user_name").val();
        let mail = $("#user_mail").val();
        let role = $("#user_role").val();
        let pwd = $("#user_password").val();
        let conf_pwd = $("#user_confirm_password").val();

        if (!pwd) {
            alert('Please enter the Password.');
            return;
        }
        if (pwd !== conf_pwd) {
            alert('Password and Confirm Password do not match.');
            return;
        }
        var data = {};
        data.name = name; data.mail = mail; data.role = role;
        data.pwd = pwd; data.id = UpdatePassword.user_id;
        $.ajax({
            url: config.contextPath + 'Home/UpdateUserInfo', data: data,
            success: function (jData) {
                let ret_val = parseInt(jData)
                switch (ret_val) {
                    case -100:
                        $("#success_msg").text("Unauthorized access").show();
                        setTimeout(() => { window.location = config.contextPath + "Home/LogOff"; }, 1000);
                        break;
                    case -2:
                        $("#success_msg").text("Unindentified user").show();
                        setTimeout(() => { window.location = config.contextPath + "Home/LogOff"; }, 1000);
                        break;
                    case -3:
                        $("#success_msg").text("Password found empty").show();
                        setTimeout(() => { window.location = config.contextPath + "Home/LogOff"; }, 1000);
                        break;
                    case 1:
                        //password updated successfully, enjoy CRL Manager   
                        $("#success_msg").text("Update Password is a success").show();
                        setTimeout(() => {
                            $("#update_success_img").animate({
                                opacity: 0.25,
                                width: "+=450",
                                height: "+=450",
                                left: 450 / 4,
                                top: -450 / 4
                            }, 1000, function () {
                                // Animation complete.
                                window.location = config.contextPath + "Home/LogOff";
                            });
                        }, 1000);
                        break;
                }

            },
            error: function (xhr, status, error) {
                console.error('Error occurred when trying to update the User Password:', error);
                alert('Error occurred when trying to update the User Password.');
            }
        });
    }
};
