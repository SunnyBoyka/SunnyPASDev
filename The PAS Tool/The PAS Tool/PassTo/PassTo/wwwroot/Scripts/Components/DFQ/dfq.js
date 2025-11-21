var dfq = {
    __proto__: dfq_hide_and_seek,
    current_gate: null,
    current_gate_id: -1,
    first_gate_where_dataentry_can_happen: null,
    myModal: null,
    all_prjs: null,
    cur_project: null,
    curr_proj_id: -1,
    start_action: function (tag, data) {
        dfq.makeDummyResponse();
        dfq.dummy_response.user_id = LoggedInUser.id;
        return new TemplateRenderer(data, tag, "~/Scripts/Components/DFQ/dfq.html", null, false).start_action().
            then(jData => {
                if (LoggedInUser.role === "read") $("#edit_group").hide();
                dfq.FillDummyResponse();
                dfq.FillAllProjects();
                dfq.makePopOversAndHandlePopOverShowEvent();
                return jData +" -> ok";
            })
    },
    SelectProject: function (event) {
        dfq.curr_proj_id = parseInt($("#all_projects").val());
        if (dfq.curr_proj_id <= 0) {
            dfq.ResetTableDataAndOtherLabels();
            dfq.cur_project = null;
            return;
        }
        dfq.ProcessProjectSelection();
    },
    SelectGate: function () {
        dfq.current_gate_id = parseInt($("#gates").val());
        if (dfq.current_gate_id === -1) {
            $("div[m-body]").hide();
            dfq.current_gate = null;
            return;
        }
        dfq.current_gate = BasicAction.gate_mapping_backward[$("#gates :selected").text()];
        $("div[m-body]").show();
        dfq.ProcessGateSelection();
    },
    ShowModalEditDialog: function () {
        $.ajax({ url: config.contextPath + "Home/isAuthenticated" }).fail((xhr, et) => document.location = config.contextPath);
        dfq.FillProjectGates();
        let element = document.getElementById('dfq_data');
        let options = {}; options.focus = true; options.keyboard = true;
        if (dfq.myModal === null) {
            dfq.myModal = new bootstrap.Modal(element, options);
            dfq.AttachBSModalEventhandler();
        }
        $("#dfq_data_Label").text("Fetching Values Please wait . . . ");
        dfq.myModal.show(Nominations.myModal, 3000);
        $("div[m-body]").hide();
        dfq.ProcessModalDialogAfterShown();
    },
    SaveOrMove: function (e, moveOrsave, defined, identified, coown) { //same function called for save or move
        if (dfq.current_gate_id === -1) {
            Alertify.ShowAlertDialog({ "title": "This is a serious matter", "body": "<h3>You have to choose some gate in life </h3>", "buttons": ["Ok Fine I got it"], "foot_note": "Welcome to <h4 class='d-inline'>DFQ</h4><sub>Readiness</sub> " });
            return;
        }
        let action = moveOrsave.toLowerCase();
        let n = dfq.curr_proj_id.name;
        let the_ids = dfq["column_key_mapping_" + BasicAction.gate_value_mapping[dfq.current_gate_id]]
        if (the_ids === undefined) {
            alert("column_key_mapping_xxx does not have an entry for\nGate : " + dfq.current_gate + "\nGate id :" + dfq.current_gate_id);
            return;
        }
        
        let jData = {};
        let today = new Date();
       
        //shortcut for getting values from modal form modal window
        //Object.keys(the_ids).forEach(k => jData[k] = $("#" + the_ids[k].split('_')[1]).val());
        Object.keys(the_ids).forEach((k, i) => {
            let jid = "#" + the_ids[k].substring(the_ids[k].indexOf('_') + 1);
            if (jid === "#dfq_date") {
                if (!$("#dfq_date").val()) jData[k] = today.toISOString().slice(0, 10);
                else jData[k] = $("#dfq_date").val()
            } else if (jid === "#insert_update_time") return; //jData[k] = today.toISOString().slice(0, 10);            
            else {
                if (!$(jid).val()) jData[k] = 0;
                else jData[k] = Math.floor(parseInt($(jid).val()))
            }
        });
        //alert(JSON.stringify(jData, null, ' ')); return;
        dfq.myModal.hide(dfq.myModal);
        //let's validate
        if (undefined !== Object.keys(jData).find(k => Math.floor(parseInt(jData[k]) < 0))) {
            Alertify.ShowAlertDialog({
                "title": "This is a serious matter",
                "body": "<h3>Don't be Negative in life </h3>",
                "buttons": ["Ok Fine I got it", "I was just testing"],
                "foot_note": "Welcome to <h4 class='d-inline'>DFQ</h4><sub>Readiness</sub> "
            });
            return;
        }
        let query_object = {}
        query_object.gate = dfq.current_gate; query_object.project_id = dfq.curr_proj_id; query_object.dfq_data = JSON.stringify(jData);
        //alert(JSON.stringify(query_object, null, ' ')+"\nMethod will return after this alert"+);  return;
        let url = config.contextPath + "Home/SaveDFQDataToEntryLog";
        switch (action) {
            case "save":
                url = config.contextPath + "Home/SaveDFQDataToEntryLog";
                break;
            case "move":
                if (!confirm("Are you sure, you want to move this data to gate {" + dfq.current_gate + "}\nIf you move it, you cannot move back, move back is possible only by Sri\n\nYou got to Move It Move It")) return;
                url = config.contextPath + "Home/MoveDFQData";
                dfq.FillDFQTable(jData, the_ids);
                break;
        }
        $.ajax({ url: url, data: query_object }).
            done(jData => {
                if (1 === parseInt(jData)) {
                    Alertify.ShowAlertDialog({
                        "title": "Congratulations",
                        "body": "<h5>Data Successfully updated</h5>",
                        "buttons": ["Ok Fine I got it", "I was getting worried"],
                        "foot_note": "Welcome to <h4 class='d-inline'>DFQ</h4><sub>Readiness</sub> "
                    });
                }
                else {
                    Alertify.ShowAlertDialog({
                        "title": "Damar, FInished, Gone, Gaya . . .",
                        "body": "<h5>Data Not updated, Error Code: " + jData + "</h5>",
                        "buttons": ["What should I do now", "<a target='_blank' href='mailto: srivatchan.vs@alstomgroup.com?subject=Error while saving DFQ data&cc=sesha.sai@alstomgroup.com&body=Hi Sri,%0AI am facing some issue.%0AThe Error Code is : " + jData + " %0APlease help me%0A%0A...YOUR COMMENTS ...%0A%0AThanks and Regards' ><span class='text-white' >Send this error code to Srivatchan</span></a>"],
                        "foot_note": "Welcome to <h4 class='d-inline'>DFQ</h4><sub>Readiness</sub> "
                    });
                }
            });
    },
    canEdit: function (id) {
        let selected_project = JSON.parse(JSON.stringify(dfq.all_prjs.filter(prj => prj.id === id)[0]));
        delete selected_project.id;
        delete selected_project.name;
        delete selected_project.insert_update_time;
        dfq.first_gate_where_dataentry_can_happen = Object.keys(selected_project).find(key => selected_project[key] === 0); //Find the First Zero
        //alert("Editable gate : " + dfq.first_gate_where_dataentry_can_happen);
        return dfq.first_gate_where_dataentry_can_happen;
    },
    AttachBSModalEventhandler: function () {
        const element = document.getElementById('dfq_data')
        element.addEventListener('hidden.bs.modal', event => {
            if (dfq.callback) dfq.callback();
            dfq.callback = null;
        })
    }
}
