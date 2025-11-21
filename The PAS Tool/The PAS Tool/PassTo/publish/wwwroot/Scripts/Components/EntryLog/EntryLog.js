var EntryLog = {
    selected_user_id: -1,
    headermapping: {
        SNo: "#",
        id: "ID",
        filed_by_user_id: "Filed by ID",
        candidate_name: "Name",
        reporting_manager_name: "Manager",
        current_position: "Current",
        proposed_position: "Proposed",
        dept_head_name: "Dept. Head",
        sponsor_mail: "Sponsor",
        filed_by_user_name: "Filed by",
        candidate_mail: "Mail",
        file_name: "File",
        extra_info: "unwanted",
        the_time: "its not my time"
    },
    DataTableInstance: null,
    start_action: function (tag, data, EditCallBack, isall) {
        EntryLog.EditCallBack = EditCallBack;
        return new TemplateRenderer(data, tag, "~/Scripts/Components/EntryLog/EntryLog.html", null, false).start_action().
            then(async (jData) => {
                //EntryLog.ShowDefaultTable();     
                EntryLog.doTheServerSidePaging();
                return "Done from Entry Log";
            });
    },
    EditCurrentRow: function (e, val) {
        let txt = $(e.target).attr("the_obj");
        let obj = JSON.parse(txt);
        obj.candidate_mail = obj.candidate_mail.substring(0, obj.candidate_mail.indexOf("span") - 1);
        obj.sponsor_mail = obj.sponsor_mail.substring(0, obj.sponsor_mail.indexOf("span") - 1);
        if (EntryLog.EditCallBack) EntryLog.EditCallBack(obj);
    },
    ShowDefaultTable: function () {
        let lengthMenu = [5, 10, 20, 50, 100, 200];
        let pageLength = lengthMenu[0];
        let hide_all = [1, 2, 3, 4, 5]
        EntryLog.doTheDataTablesThing(lengthMenu, pageLength, hide_all);
        return "Your EntryLog (0)";
    },
    doTheDataTablesThing: function (lengthMenu, pageLength, hide_all) {
        $('#EntryLog').DataTable({
            pageLength: pageLength,
            lengthMenu: lengthMenu,//[5, 10, 20, 50, 100, 200, 500], 
            dom: 'Bflrtip',
            buttons: [
                {
                    extend: 'copyHtml5',
                    exportOptions: {
                        columns: [0, ':visible']
                    }
                },
                {
                    extend: 'excelHtml5',
                    exportOptions: {
                        columns: ':visible'
                    }
                },
                {
                    extend: 'pdfHtml5',
                    exportOptions: {
                        columns: ':visible'
                        //columns: [0, 1, 2, 5]
                    }
                },
                {
                    extend: 'colvisGroup',
                    text: 'Show all',
                    show: ':hidden'
                },
                {
                    extend: 'colvisGroup',
                    text: 'Hide all',
                    hide: hide_all,
                    show: [1]
                },
                'colvis'
            ]
        });
    },
    doTheServerSidePaging: function () {
        //$("#example").dataTable().fnDestroy();
        EntryLog.DataTableInstance = new DataTable('#example', {
            //columnDefs: [
            //    {
            //        "targets": 4, //json column sorting should be disabled
            //        "orderable": false
            //    },
            //    {
            //        // The `data` parameter refers to the data for the cell (defined by the
            //        // `data` option, which defaults to the column being worked with, in
            //        // this case `data: 0`.
            //        render: (data, type, row) => {
            //            //return data + ' (' + row[3] + ')'
            //            let k = 90;
            //            k += 90;
            //            let jsonData = JSON.parse(data);
            //            //return data ;
            //            //let htmls = [];
            //            //Object.keys(jsonData).forEach(key => {
            //            //    let html = "<button class='btn btn-dark btn-sm'>" + key + jsonData[key] + "</button>";
            //            //    htmls.push(html);
            //            //});
            //            //return htmls ;

            //            let html = "<div><div class='border border-secondary rounded-2 p-2'>";
            //            Object.keys(jsonData).forEach(key => {
            //                html += "&#9827; " + BasicAction.dfq_mapping[key] + " : " + jsonData[key] + "</br>";
            //            });
            //            html += "</div></div>";
            //            return html;
            //        },
            //        targets: 4
            //    },
            //    {
            //        render: (data, type, row) => {
            //            let disp = BasicAction.gate_mapping[data] === undefined ? data : BasicAction.gate_mapping[data];
            //            let html = "<h5 class='badge bg-secondary p-2'>" + disp + "</h5>";
            //            return html;
            //        },
            //        targets: 3
            //    }
            //    //{ visible: false, targets: [3] }
            //],
            ajax: {
                url: config.contextPath + 'Home/GetActors',
                type: 'GET',
                //data: { "project_id": project_id, "user_id": EntryLog.selected_user_id }
            },
            processing: true,
            serverSide: true,
            destroy: true
        });
        $("#entry_log_table").removeClass("d-none");
        //EntryLog.DataTableInstance.on('draw', function () {
        //    let rows = EntryLog.DataTableInstance.rows().data();
        //    let data = [];
        //    rows.each(function (value, index) {
        //        let obj = {};
        //        for (let key in value) {
        //            if (key == "extra_info" || key == "the_time") continue;
        //            obj[key] = value[key];
        //        }
        //        data.push(obj);
        //    });
        //    EntryLog.DataTableInstance.clear().draw();
        //    EntryLog.DataTableInstance.rows.add(data);
        //    EntryLog.DataTableInstance.columns.adjust().draw();
        //})
    },
    SelectUser: function (e) {
        $.ajax({ url: config.contextPath + "Home/isAuthenticated" }).fail((xhr, et) => document.location = config.contextPath);
        let user_id = $("#all_the_users").val();
        if (user_id <= 0) return;
        EntryLog.selected_user_id = user_id;
        EntryLog.FillAllProjectsForUser(user_id);
    },
    FillAllUsers: function (e) {
        $.ajax({ url: config.contextPath + "Home/GetAllUsers" }).done(jData => {
            //write code to fill select box
            let users = JSON.parse(jData);
            users.forEach(user => {
                let opt = "<option value='_VAL_'>_TXT_</option>".replace(/_VAL_/g, user.id).replace(/_TXT_/g, user.name_mail);
                $(opt).appendTo("#all_the_users");
            });
            let opt = "<option value='-1' selected>Choose User</option>";
            $(opt).prependTo("#all_the_users");
        });
    },
    FillAllProjectsForUser: function (user_id) {
        $.ajax({ url: config.contextPath + "Home/GetAllProjectsByUserId", data: { "user_id": user_id } }).done(jData => {
            dfq.all_prjs = JSON.parse(jData);
            $("#all_the_projects").empty();
            dfq.all_prjs.forEach(prj => {
                let opt = "<option value='_VAL_'>_TXT_</option>".replace(/_VAL_/g, prj.id).replace(/_TXT_/g, prj.name);
                $(opt).appendTo("#all_the_projects");
            });
            let opt = "<option value='-1' selected>Choose Project</option>";
            $(opt).prependTo("#all_the_projects");
            $("#all_the_projects[value='-1']").prop('selected', true);
        })
    },
    SelectProject: function (e) {
        $.ajax({ url: config.contextPath + "Home/isAuthenticated" }).fail((xhr, et) => { document.location = config.contextPath });
        let project_id = $("#all_the_projects").val();
        if (project_id <= 0) return;
        EntryLog.doTheServerSidePaging(project_id);
    }
}
