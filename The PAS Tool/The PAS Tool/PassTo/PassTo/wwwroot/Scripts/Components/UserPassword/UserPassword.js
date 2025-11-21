var UserPassword = {
    start_action: function (tag, data, EditCallBack) {        
        return new TemplateRenderer(data, tag, "~/Scripts/Components/UserPassword/UserPassword.html", null, false, true).start_action().then(async (jData) => {
            UserPassword.SetCurrentUser();
            return "Done from User";
        });
    },
    GetCurrentUser: function () { return $.ajax({ url: config.contextPath + 'Home/GetCurrentUser' }); },
    SetCurrentUser: async function () {
        let jData = await UserPassword.GetCurrentUser();
        let user = JSON.parse(jData);
        $("#user_name").val(user.name);
        $("#user_mail").val(user.mail);
        $("#user_role").val(user.role);
        //$("#last_update").val(user.last_update);
    },

    //ValidateUserInfo: function () {
    //    let user_password_confirm = $('#user_password_confirm').val();
    //    var user = {
    //        password: $('#user_password').val(),
    //        user_name: $('#user_name').val(),
    //        user_mail: $('#user_mail').val(),
    //    };
    //    if (user.password !== user_password_confirm) {
    //        alert("Passwords do not match");
    //        return false;
    //    }
    //    if (!user.password) {
    //        alert("Password cannot be empty");
    //        return flase;
    //    }
    //    if (!user.user_name) {
    //        alert("User Name cannot be empty");
    //        return false;
    //    }
    //    if (!user.user_mail) {
    //        alert("User Mail cannot be empty");
    //        return false;
    //    }
    //    return true;
    //},
    //--- add function


    //-------update
    //-- add function 
    updateUser: function () {
        var user = {
            //role: $('#role').val(),
            //projectaccess: $('#projectaccess').val(),
            //userName: $('#userName').val(),
            userid: $('#userid').val(),
            password: $('#password').val(),
            confirmpassword: $('#confirmpassword').val(),
            //downloadPeriod: $('#downloadPeriod').val(),
            //crlPEMconversion: $('#crlPEMconversion').val(),
            //multiPEMaggregation: $('#multiPEMaggregation').val()
        };
        if (user.password !== user.confirmpassword) {
            alert("Passwords do not match");
            return;
        }
        $.ajax({
            url: config.contextPath + 'Home/UpdatePassword',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(user),
            dataType: 'json',
            success: function (response) {
                alert('User updated successfully', response.message);
                // User.loadAdminTable();
                //User.loadOperatorTable();

                //$('#role').val('');
                //$('#projectaccess').val('');
                //$('#userName').val('');

                $('#password').val('');
                $('#confirmpassword').val('');
                //$('#crlSize').val('');
                //$('#downloadPeriod').val('');
                //$('#crlPEMconversion').val('');
                //$('#multiPEMaggregation').val('');
            },
            error: function (xhr, status, error) {
                console.error('Error occurred when trying to update the User Password:', error);
                alert('Error occurred when trying to update the User Password.');
            }
        });
    },
};