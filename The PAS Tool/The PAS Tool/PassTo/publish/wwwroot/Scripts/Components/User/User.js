var User = {
    selected_user_id: -1,
    selectedProjectId: null,
    role_for_table: `<select  class="form-select fs-small p-3" style=" ">
                        <option value="admin" _SEL_ADMIN_ >Admin</option>
                        <option value="operator" _SEL_OPERATOR_>Operator</option>
                    </select>`,
    gen_input: "<input _TPE_ type='text' class='ph-small fs-small p-3 single-line w-100' placeholder='_PLACE_HOLDER_' value='_VAL_' >",
    pwd_html: '<input type="password" class="ph-small fs-small p-3 single-line w-100" placeholder="set new pwd ..." >',
    edit_delete_html: `<button onclick="User.ModifyUser(event,true)" type="button" dat='_DAT_' class="btn btn-sm btn-outline-primary"><i style="pointer-events:none" class="bi bi-pen fs-very-small"></i></button>
                       <button onclick="User.ModifyUser(event,false)" type="button" dat='_DAT_' class="btn btn-sm btn-outline-primary"><i style="pointer-events:none" class="bi bi-trash fs-very-small"></i></button>`,
    header_mapping: {
        id: "#",
        name: "Name",
        mail: "Mail",
        pwd: "Password",
        roles: "Roles",
        is_default: "Password Type",
        ins_upd_time: '<i class="bi bi-clock"></i>',
        edit: '<i class="bi bi-car-front"></i><i class="bi bi-car-front ms-1"></i><i class="bi bi-car-front ms-1"></i>'
    },
    start_action: function (tag, data) {
        return new TemplateRenderer(data, tag, "~/Scripts/Components/User/User.html", null, false, true).start_action().then(async (jData) => {
            User.ShowAllUsers();
            return "Done from User";
        });
    },
    AddUser: function (e) {
        let name = $('#username').val();
        let mail = $('#usermail').val();
        let pwd = $('#user_password').val();
        let confirm_pwd = $('#user_confirm_password').val();
        let role = $('#roles').val();
        if (!name) {
            $("#status").text("Please enter the User Name.");
            return;
        }
        if (!mail) {
            $("#status").text("Please enter the User Mail.");
            return;
        }
        if (!pwd) {
            $("#status").text("Please enter the User Password.");
            return;
        }
        if (pwd !== confirm_pwd) {
            $("#status").text("Password and Confirm Password are not matching.");
            return;
        }
        Alertify.ShowAlertDialog({
            "title": "Please check the information one last time",
            "body": "Are you sure a 100% sure you want to add this user <div class='badge text-bg-info p-2 mt-2'> We won't ask again and agaian</div>",
            "buttons": ["Ok Fine I got it", "Yes I want to Add"],
            "foot_note": "Welcome to CRL Manager"
        }, async (action) => {
            if (!action) return;
            let retval = await $.majax({
                url: config.contextPath + "home/AddUser",
                data: { mail: mail.trim(), name: name.trim(), role: role.trim(), pwd: pwd.trim() }
            });
            retval = parseInt(retval);
            if (retval === -1) $("#status").text("Cannot add user, Validation failed");
            else if (retval === -2) $("#status").text("User already exists");
            else if (retval === 1) $("#status").text("User added successfully");
            else $("#status").text("Error occurred when trying to add User.");

        });
    },
    ModifyUser: function (event, isUpdateOrdelete) {
        let jELe = $(event.target); let tr = jELe.closest('tr');
        let data = jELe.attr('dat');
        if (isUpdateOrdelete) {
            //get al values and update
            let name = tr.find('input[shila]').val();
            let mail = tr.find('input[mail]').val();
            let pwd = tr.find('input[type="password"]').val();
            let role = tr.find('select').val();
            let is_default = tr.find('span[is_default]').attr('is_default');            
            let orig_data = JSON.parse(data);
            //if (name === orig_data.name && mail === orig_data.mail && role === orig_data.roles) return;
            Alertify.ShowAlertDialog({
                "title": "Please check the information one last time",
                "body": "Are you sure a 100% sure you want to update this user <div class='badge text-bg-info p-2 mt-2'> We won't ask again and agaian</div>",
                "buttons": ["Ok Fine I got it", "Yes I want to Update"],
                "foot_note": "Welcome to CRL Manager"
            }, async (action) => {
                if (!action) return;
                let retval = await $.ajax({
                    url: config.contextPath + "home/UpdateUserInfobyAdmin",
                    data: { mail: mail.trim(), name: name.trim(), role: role.trim(), pwd: pwd.trim(), id: orig_data.id, is_default: is_default }
                });
                retval = parseInt(retval);
                if (retval === -1) $("#status").text("Cannot update user, Validation failed");
                else if (retval === 1) {
                    $("#status").text("User info Updated");
                    //User.ShowAllUsers();
                    let user_info = {};
                    user_info.id = orig_data.id;
                    user_info.name = name;
                    user_info.mail = mail;
                    user_info.pwd = pwd;
                    user_info.roles = role;
                    user_info.is_default = is_default;
                    user_info.edit = "";
                    jELe.attr('dat', JSON.stringify(user_info));
                }
            });
            //alert("Name = " + name + "\nMail = " + mail + "\nPwd = " + pwd + "\nRole = " + role+"\n\n" + data);
        }
    },
    ShowAllUsers: function () {
        $.ajax({
            url: config.contextPath + 'Home/GetAllUsers',
            type: 'GET',
            success: function (jData) {
                let jd = JSON.parse(jData);
                jd.forEach(d => d.edit = "");
                let html_table = $.makeTable(jd, null, User.header_mapping, (key, val, value) => {
                    switch (key) {
                        case "name":
                            return User.gen_input.replace('_PLACE_HOLDER_', "Enter New Name").replace('_VAL_', val).replace(/_TPE_/g, 'shila');
                        case "mail":
                            return User.gen_input.replace('_PLACE_HOLDER_', "Enter New mail").replace('_VAL_', val).replace(/_TPE_/g, 'mail');
                        case "pwd":
                            return User.pwd_html;
                        case "roles":
                            let html = User.role_for_table;
                            if (val === "admin") html = html.replace('_SEL_ADMIN_', 'selected').replace('_SEL_OPERATOR_', '');
                            else html = html.replace('_SEL_OPERATOR_', 'selected').replace('_SEL_ADMIN_', '');
                            return html;
                        case "ins_upd_time":
                            return "<span class=' fs-small'>" + moment(val).format('ddd, ll') + "</span>";
                        case "edit":
                            return User.edit_delete_html.replace(/_DAT_/g, JSON.stringify(value));
                        case "is_default":
                            if (val === 1) return "<span is_default='1' class='fs-small'>Default</span>";
                            else return "<span is_default='0' class=' fs-small'>Custom</span>";
                        default:
                            return val;
                    }
                });
                $("#UserTable").html(html_table);
            },
            error: function (xhr, status, error) {
                console.error('Error occurred when trying to load the User Details:', error);
            }
        });
    },

    //deleteUser: function () {
    //    var user = { userid: $('#userid').val() }
    //    if (!userid) {
    //        alert('Please enter the User ID.');
    //        return;
    //    }
    //    $.ajax({
    //        url: config.contextPath + 'Home/DeleteUser',
    //        type: 'DELETE',
    //        contentType: 'application/json',
    //        data: JSON.stringify(user),
    //        success: function (response) {
    //            alert('User deleted successfully', response);
    //            User.loaduserTable();
    //           // User.loadOperatorTable();
    //            $('#userId').val('');
    //        },
    //        error: function (xhr, status, error) {
    //            console.error('Error occurred when trying to delete User:', error);
    //            alert('Error occurred when trying to delete User.');
    //        }
    //    });
    //},

    //loaduserTable: function () {
    //    // Function to fetch and load user data
    //    var fetchUserData = function () {
    //        $.ajax({
    //            url: config.contextPath + 'Home/GetUser',
    //            type: 'GET',
    //            success: function (data) {
    //                var table = $('#UserTable').DataTable();
    //                table.clear().draw();
    //                data.forEach(function (user) {
    //                    table.row.add([
    //                        user.user_role,
    //                        user.project_access,
    //                        user.user_mail,
    //                        user.user_id
    //                    ]).draw(false);
    //                });
    //            },
    //            error: function (xhr, status, error) {
    //                console.error('Error occurred when trying to load the User Details:', error);
    //            }
    //        });
    //    };

    //    // Initial data load
    //    fetchUserData();

    //    // Set interval to reload the user table every 30 seconds (30000 milliseconds)
    //    setInterval(fetchUserData, 1000);
    //},
    // working nov 13
    //loaduserTable: function () {
    //    $.ajax({
    //        url: config.contextPath + 'Home/GetUser',
    //        type: 'GET',
    //        success: function (data) {
    //            var table = $('#UserTable').DataTable();
    //            table.clear().draw();
    //            data.forEach(function (user) {
    //                table.row.add([
    //                    user.user_role,
    //                    user.project_access,
    //                    user.user_name,
    //                    user.user_id

    //                ]).draw(false);
    //            });
    //        },
    //        error: function (xhr, status, error) {
    //            console.error('Error occurred when trying to load the User Details:', error);
    //        }
    //    });
    //},
    //loadOperatorTable: function () {
    //    $.ajax({
    //        url: config.contextPath + 'Home/GetOperatorDetails',
    //        type: 'GET',
    //        success: function (data) {
    //            var table = $('#operatorTable').DataTable();
    //            table.clear();
    //            data.forEach(function (user) {
    //                table.row.add([
    //                    //user.role,
    //                    user.projectaccess,
    //                    user.userName,
    //                    user.userId
    //                    //user.password,
    //                    //user.confirmpassword

    //                ]).draw(false);
    //            });
    //        },
    //        error: function (xhr, status, error) {
    //            console.error('Error occurred when trying to load the User Details:', error);
    //        }
    //    });
    //},
};
