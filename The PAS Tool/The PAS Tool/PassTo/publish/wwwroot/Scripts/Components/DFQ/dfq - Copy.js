var dfq = {
    current_gate: null,
    current_gate_id: -1,
    first_gate_where_dataentry_can_happen: null,
    myModal: null,
    all_prjs: null,
    cur_project: null,
    curr_proj_id: -1,
    dummy_response: null,
    pop_overs: [
        { id: "#td_identified_pop_over", content: "", sub_pop_up_legacy: "#draft_popup", sub_pop_up_non_legacy: "#identified_popup" },
        { id: "#td_defined_pop_over", content: "" },
        {
            id: "#td_coown_pop_over", content: `<div id='committed_popup'><b>Committed : </b>This is like <b class='text-primary'>Ram Vachan</b>, once committed you cannot go back in life</div>
                                                <div id='owned_popup'><b>Owned : </b>This is like <b class='text-primary'>Ram Vachan</b>, once committed you cannot go back in life</div>`,
            sub_pop_up_legacy: "#owned_popup", sub_pop_up_non_legacy: "#committed_popup"
        },
        { id: "#td_covered_pop_over", content: "" },
        { id: "#td_obsolete_pop_over", content: "" },
        { id: "#td_rejected_pop_over", content: "" },
        { id: "#td_characterized_pop_over", content: "" },
        { id: "#td_assigned_pop_over", content: "" },
        { id: "#td_analyzed_pop_over", content: "" },
        { id: "#td_traced_by_implementation_pop_over", content: "" },
        { id: "#td_covered_by_implementation_pop_over", content: "" },
        { id: "#td_traced_by_mean_of_proof_pop_over", content: "" },
        { id: "#td_covered_by_mean_of_proof_pop_over", content: "" },
        { id: "#td_demonstrated_pop_over", content: "" },
        { id: "#td_time_of_movement_pop_over", content: "" },
        { id: "#td_dfq_date_pop_over", content: "" }
    ],
    column_key_mapping_sgr: { identified: "#sgr_identified", defined: "#sgr_defined", coown: "#sgr_coown", covered: "#sgr_covered", characterized: "#sgr_characterized", assigned: "#sgr_assigned", analyzed: "#sgr_analyzed", traced_by_impl: "#sgr_traced_by_impl", covered_by_impl: "#sgr_covered_by_impl", traced_by_mop: "#sgr_traced_by_mop", covered_by_mop: "#sgr_covered_by_mop", obsolete: "#sgr_obsolete", rejected: "#sgr_rejected", demonstrated: "#sgr_demonstrated", dfq_date: "#sgr_dfq_date", insert_update_time: "#sgr_insert_update_time" },
    column_key_mapping_pgr: { identified: "#pgr_identified", defined: "#pgr_defined", coown: "#pgr_coown", covered: "#pgr_covered", characterized: "#pgr_characterized", assigned: "#pgr_assigned", analyzed: "#pgr_analyzed", traced_by_impl: "#pgr_traced_by_impl", covered_by_impl: "#pgr_covered_by_impl", traced_by_mop: "#pgr_traced_by_mop", covered_by_mop: "#pgr_covered_by_mop", obsolete: "#pgr_obsolete", rejected: "#pgr_rejected", demonstrated: "#pgr_demonstrated", dfq_date: "#pgr_dfq_date", insert_update_time: "#pgr_insert_update_time" },
    column_key_mapping_cgr_i: { identified: "#cgr-i_identified", defined: "#cgr-i_defined", coown: "#cgr-i_coown", covered: "#cgr-i_covered", characterized: "#cgr-i_characterized", assigned: "#cgr-i_assigned", analyzed: "#cgr-i_analyzed", traced_by_impl: "#cgr-i_traced_by_impl", covered_by_impl: "#cgr-i_covered_by_impl", traced_by_mop: "#cgr-i_traced_by_mop", covered_by_mop: "#cgr-i_covered_by_mop", obsolete: "#cgr-i_obsolete", rejected: "#cgr-i_rejected", demonstrated: "#cgr-i_demonstrated", dfq_date: "#cgr-i_dfq_date", insert_update_time: "#cgr-i_insert_update_time" },
    column_key_mapping_cgr_a: { identified: "#cgr-a_identified", defined: "#cgr-a_defined", coown: "#cgr-a_coown", covered: "#cgr-a_covered", characterized: "#cgr-a_characterized", assigned: "#cgr-a_assigned", analyzed: "#cgr-a_analyzed", traced_by_impl: "#cgr-a_traced_by_impl", covered_by_impl: "#cgr-a_covered_by_impl", traced_by_mop: "#cgr-a_traced_by_mop", covered_by_mop: "#cgr-a_covered_by_mop", obsolete: "#cgr-a_obsolete", rejected: "#cgr-a_rejected", demonstrated: "#cgr-a_demonstrated", dfq_date: "#cgr-a_dfq_date", insert_update_time: "#cgr-a_insert_update_time" },
    column_key_mapping_fei: { identified: "#fei_identified", defined: "#fei_defined", coown: "#fei_coown", covered: "#fei_covered", characterized: "#fei_characterized", assigned: "#fei_assigned", analyzed: "#fei_analyzed", traced_by_impl: "#fei_traced_by_impl", covered_by_impl: "#fei_covered_by_impl", traced_by_mop: "#fei_traced_by_mop", covered_by_mop: "#fei_covered_by_mop", obsolete: "#fei_obsolete", rejected: "#fei_rejected", demonstrated: "#fei_demonstrated", dfq_date: "#fei_dfq_date", insert_update_time: "#fei_insert_update_time" },
    column_key_mapping_vgr: { identified: "#vgr_identified", defined: "#vgr_defined", coown: "#vgr_coown", covered: "#vgr_covered", characterized: "#vgr_characterized", assigned: "#vgr_assigned", analyzed: "#vgr_analyzed", traced_by_impl: "#vgr_traced_by_impl", covered_by_impl: "#vgr_covered_by_impl", traced_by_mop: "#vgr_traced_by_mop", covered_by_mop: "#vgr_covered_by_mop", obsolete: "#vgr_obsolete", rejected: "#vgr_rejected", demonstrated: "#vgr_demonstrated", dfq_date: "#vgr_dfq_date", insert_update_time: "#vgr_insert_update_time" },
    column_key_mapping_iqa: { identified: "#iqa_identified", defined: "#iqa_defined", coown: "#iqa_coown", covered: "#iqa_covered", characterized: "#iqa_characterized", assigned: "#iqa_assigned", analyzed: "#iqa_analyzed", traced_by_impl: "#iqa_traced_by_impl", covered_by_impl: "#iqa_covered_by_impl", traced_by_mop: "#iqa_traced_by_mop", covered_by_mop: "#iqa_covered_by_mop", obsolete: "#iqa_obsolete", rejected: "#iqa_rejected", demonstrated: "#iqa_demonstrated", dfq_date: "#iqa_dfq_date", insert_update_time: "#iqa_insert_update_time" },
    column_key_mapping_fqa: { identified: "#fqa_identified", defined: "#fqa_defined", coown: "#fqa_coown", covered: "#fqa_covered", characterized: "#fqa_characterized", assigned: "#fqa_assigned", analyzed: "#fqa_analyzed", traced_by_impl: "#fqa_traced_by_impl", covered_by_impl: "#fqa_covered_by_impl", traced_by_mop: "#fqa_traced_by_mop", covered_by_mop: "#fqa_covered_by_mop", obsolete: "#fqa_obsolete", rejected: "#fqa_rejected", demonstrated: "#fqa_demonstrated", dfq_date: "#fqa_dfq_date", insert_update_time: "#fqa_insert_update_time" },
    all_gates_column_key_mappings: null,
    makeDummyResponse: function () {
        dfq.all_gates_column_key_mappings = [dfq.column_key_mapping_sgr, dfq.column_key_mapping_pgr, dfq.column_key_mapping_cgr_i, dfq.column_key_mapping_cgr_a, dfq.column_key_mapping_fei, dfq.column_key_mapping_vgr, dfq.column_key_mapping_iqa, dfq.column_key_mapping_fqa];
        dfq.dummy_response = {}; dfq.dummy_response.id = -1; dfq.dummy_response.project_id = -1; dfq.dummy_response.user_id = -1; dfq.dummy_response.insert_update_time = new Date;
        Object.keys(dfq.column_key_mapping_sgr).forEach(k => dfq.dummy_response[k] = "Please choose Project");
    },
    makePopOversAndHandlePopOverShowEvent: function () {
        dfq.pop_overs.forEach(pop_up_struct => {
            if ($(pop_up_struct.id).length <= 0) return;
            new bootstrap.Popover(pop_up_struct.id, {
                trigger: 'hover',
                html: true,
                content: pop_up_struct.content ? "<img src='https://i.pinimg.com/236x/5d/a3/f5/5da3f5a126b2180360911ac27e7d5f02.jpg' class='img-small rounded' /><br/>" + pop_up_struct.content : "<img src='/favicon.ico' class='img-small' /><br/>" + $(pop_up_struct.id).attr("data-bs-content"),
            })
            if (pop_up_struct.sub_pop_up_legacy === undefined || pop_up_struct.sub_pop_up_non_legacy === undefined) return;
            document.getElementById(pop_up_struct.id.split('#')[1]).addEventListener('shown.bs.popover', function () {

                $(pop_up_struct.sub_pop_up_legacy).show(); $(pop_up_struct.sub_pop_up_non_legacy).show();
                if (dfq.cur_project === null) return;
                switch (dfq.cur_project.is_legacy) {
                    case 1: $(pop_up_struct.sub_pop_up_legacy).hide(); break;
                    case 0: $(pop_up_struct.sub_pop_up_non_legacy).hide(); break;
                }
            });
        });
    },
    ShowHideRowsBasedOnLegacy: function (isLegacy) {
        let tr = "tr[legacy='_IS_LEGACY_']"; let div = "div[legacy='_IS_LEGACY_']";
        $("tr[legacy]").show();
        $("div[legacy]").show();
        let trHide = tr.replace('_IS_LEGACY_', 1 - isLegacy); $(trHide).hide();
        let divHide = div.replace('_IS_LEGACY_', 1 - isLegacy); $(divHide).hide();

        if (!isLegacy) {
            $("#td_coown_pop_over").text("Owned");
            $("#span_coown").text("Owned");
            $("#td_identified_pop_over").text("Draft");
            $("#span_identified").text("Draft");
        }
        else {
            $("#td_coown_pop_over").text("Committed");
            $("#span_coown").text("Committed");
            $("#td_identified_pop_over").text("Identified");
            $("#span_identified").text("Identified");
        }
        $("#is_legacy").text(BasicAction.legacy[isLegacy]);
    },
    ShowHideProjectProgramText() {
        $("#prj_prg").children().show();
        $("#or_txt").hide();
        if (dfq.cur_project.is_project === 1) $("#prg_txt").hide();
        else $("#prj_txt").hide();
    },
    start_action: function (tag, data) {
        dfq.makeDummyResponse();
        dfq.dummy_response.user_id = LoggedInUser.id;
        return new TemplateRenderer(data, tag, "~/Scripts/Components/DFQ/dfq.html", null, false).start_action().
            then(jData => {
                dfq.FillDummyResponse();
                dfq.FillAllProjects();
                dfq.makePopOversAndHandlePopOverShowEvent();
                return "ok";
            })
    },
    ResetTableDataAndOtherLabels: function () {
        dfq.FillDummyResponse();
        $("#is_legacy").text("Project-Type");
        $("#search_edit").addClass("d-none");
        $("tr[legacy]").show();
        $("div[legacy]").show();
        $("#td_coown_pop_over").text("Committed/Owned");
        $("#span_coown").text("Committed/Owned");
        $("#td_identified_pop_over").text("Identified/Draft");
        $("#span_identified").text("Identified/Draft");
        $("#prj_prg").children().show();
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
            return;
        }
        $("div[m-body]").show();
        dfq.ProcessGate();
    },
    ShowModalEditDialog: function () {
        $.ajax({ url: config.contextPath + "Home/isAuthenticated" }).fail((xhr, et) => document.location = config.contextPath);
        dfq.FillProjectGates();
        let element = document.getElementById('dfq_data');
        let options = {}; options.focus = true; options.keyboard = true;
        if (dfq.myModal === null) {
            dfq.myModal = new bootstrap.Modal(element, options);
            dfq.attachEventhandler();
        }
        dfq.myModal.show(Nominations.myModal, 3000);
        $("div[m-body]").hide();
        dfq.ProcessModalDialogAfterShown();
    },
    ProcessGate() {
        dfq.current_gate = BasicAction.gate_mapping_backward[$("#gates :selected").text()];
        let the_ids = dfq["column_key_mapping_" + dfq.current_gate];
        $("#dfq_data_Label").text("Current DFQ data for the gate " + BasicAction.gate_mapping[dfq.current_gate]);
        if (the_ids === undefined) {
            alert("column_key_mapping_xxx does not have an entry for dfq.current_gate")
            $("#gates option[value='-1']").prop('selected', true);
            dfq.current_gate_id = -1;
            dfq.current_gate = BasicAction.gate_mapping_backward[$("#gates :selected").text()];
            return;
        }
    },
    ProcessModalDialogAfterShown: function () {
        $.ajax({ url: config.contextPath + "Home/GetLockedGateByProjectID", data: { "project_id": dfq.cur_project.id } }).
            done(jData => {
                //Simulate gate unlocked//jData = []; jData.push({ gate: BasicAction.gate_mapping["sgr"] , is_locked: 1 }); jData = JSON.stringify(jData);
                if (jData === "null") {
                    dfq.showElements();
                    return "gate_unlocked_implicit";
                }
                else /*if (jData !== "null")*/ {
                    //If no gate is locked we put comboBox and hide Move button, else we remove combobox and put Move Button and the gate that comes along
                    let gate_data = JSON.parse(jData);
                    let gate_bandh = gate_data[0];
                    if (gate_data.length === 0 || gate_bandh.is_locked === 0) {
                        dfq.showElements();
                        return "gate_unlocked_explicit";
                    }
                    //if u r here means a gate is locked
                    dfq.hideElements();
                    let gate = gate_bandh.gate;
                    //let par = $("#gates").parent();//$(par).append("<h5 id='fixed_gate'>" + BasicAction.gate_mapping[gate] + "</h5> ");
                    $("#fixed_gate").text(BasicAction.gate_mapping[gate]);
                    dfq.first_gate_where_dataentry_can_happen = gate;
                    dfq.current_gate = gate_bandh.gate;
                    dfq.current_gate_id = BasicAction.gate_value_mapping.indexOf(gate);
                    $("#dfq_data_Label").text("Enter new DFQ values for gate: " + BasicAction.gate_mapping[gate]);
                    $.ajax({ url: config.contextPath + "Home/GetLatestFromEntryLogByUserIDAndProjectID", data: { "project_id": dfq.curr_proj_id } })
                        .done(jData => {
                            let last_entry_for_this_user = JSON.parse(jData);
                            if (last_entry_for_this_user.length <= 0) return;
                            let vals = JSON.parse(last_entry_for_this_user.vals)
                            Object.keys(vals).forEach(k => $("#" + k).val(vals[k]));
                        }); //end
                    return "gate_locked";
                }
            })
    },
    ProcessProjectSelection: function () {
        dfq.cur_project = dfq.all_prjs.find(prj => prj.id === dfq.curr_proj_id);
        dfq.ShowHideRowsBasedOnLegacy(dfq.cur_project.is_legacy);
        dfq.ShowHideProjectProgramText();
        //alert(dfq.curr_proj_id + "\n" + JSON.stringify(LoggedInUser));
        let user_id_project_id = { "project_id": dfq.curr_proj_id, "user_id": LoggedInUser.id, "offset": 0, "limit": 100 };
        dfq.Fill(user_id_project_id);
        $("#search_edit").removeClass("d-none");
        $("#segment").text(dfq.cur_project.segment);
        $("#ct_gp_code").text(dfq.cur_project.ct_gp_code);
        $("#leading_unit").text(dfq.cur_project.leading_unit);
        let br_levelArray = dfq.cur_project.breakdown_level.split("");
        $("#breakdown_level").html(br_levelArray[0] + "<sub>" + br_levelArray[1] + "</sub>");
        $("#cluster").text(dfq.cur_project.cluster);
        $("#rm_name").text(dfq.cur_project.rm_name);
        $("#pc_incharge").text(dfq.cur_project.pc_incharge)
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
            alert("column_key_mapping_xxx does not have an entry for dfq.current_gate")
            return;
        }
        let jData = {};

        //longcut for getting values from modal window
        //jData.identified = $("#identified").val(); jData.defined = $("#defined").val(); jData.coown = $("#coown").val();
        //shortcut for getting values from modal form modal window
        //Object.keys(the_ids).forEach(k => jData[k] = $("#" + the_ids[k].split('_')[1]).val());
        Object.keys(the_ids).forEach((k, i) => {
            let jid = "#" + the_ids[k].substring(the_ids[k].indexOf('_') + 1);
            jData[k] = $(jid).val();
            if (!jData[k] || $(jid).closest("div[legacy]").css("display") === 'none') {
                //alert(k + " : " + $(jid).closest("div[legacy]").css("display"));
                jData[k] = "0";
            }
        });
        dfq.myModal.hide(dfq.myModal);
        //let's validate
        if (undefined !== Object.keys(jData).find(k => parseFloat(jData[k]) < 0)) {
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
        //alert(JSON.stringify(query_object, null, ' '));
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
    hideElements: function () {
        $("#gates").hide();
        $("#move").show();
        $("#fixed_gate").show();
    },
    showElements: function () {
        $("#dfq_data_Label").text("Choose a gate and enter its DFQ values");
        $("#gates").show();
        $("#gates option[value='-1']").prop('selected', true);
        $("input[moda]").val("");
        $("#move").hide();
        $("#fixed_gate").hide();
    },
    
    FillDummyResponse: function () { dfq.all_gates_column_key_mappings.forEach(gate => dfq.FillDFQTable(dfq.dummy_response, gate)) },
    Fill: function (user_id_project_id) {

        //var sgr = {}; sgr.identified = Math.round(Math.random() * 500 + 10); sgr.defined = Math.round(Math.random() * 500 + 10); sgr.coown = Math.round(Math.random() * 500 + 10);
        //var pgr = {}; pgr.identified = -Math.round(Math.random() * 500 + 10); pgr.defined = -Math.round(Math.random() * 500 + 10); pgr.coown = -Math.round(Math.random() * 500 + 10);
        //var cgr_i = {}; cgr_i.identified = -Math.round(Math.random() * 500 + 10); cgr_i.defined = -Math.round(Math.random() * 500 + 10); cgr_i.coown = -Math.round(Math.random() * 500 + 10);

        if (dfq.column_key_mapping_sgr !== undefined) {
            user_id_project_id.gate = "sgr";
            $.ajax({ url: config.contextPath + "Home/GetDFQDataByGateByProjectIDAndByUserID", data: user_id_project_id }).done(jDataStr => dfq.FillDFQTable(JSON.parse(jDataStr), dfq.column_key_mapping_sgr))
        }
        if (dfq.column_key_mapping_pgr !== undefined) {
            user_id_project_id.gate = "pgr";
            $.ajax({ url: config.contextPath + "Home/GetDFQDataByGateByProjectIDAndByUserID", data: user_id_project_id }).done(jDataStr => dfq.FillDFQTable(JSON.parse(jDataStr), dfq.column_key_mapping_pgr))
        }
        if (dfq.column_key_mapping_cgr_i !== undefined) {
            user_id_project_id.gate = "cgr_i";
            $.ajax({ url: config.contextPath + "Home/GetDFQDataByGateByProjectIDAndByUserID", data: user_id_project_id }).done(jDataStr => dfq.FillDFQTable(JSON.parse(jDataStr), dfq.column_key_mapping_cgr_i))
        }
        if (dfq.column_key_mapping_cgr_a !== undefined) {
            user_id_project_id.gate = "cgr_a";
            $.ajax({ url: config.contextPath + "Home/GetDFQDataByGateByProjectIDAndByUserID", data: user_id_project_id }).done(jDataStr => dfq.FillDFQTable(JSON.parse(jDataStr), dfq.column_key_mapping_cgr_a))
        }
        if (dfq.column_key_mapping_fei !== undefined) {
            user_id_project_id.gate = "fei";
            $.ajax({ url: config.contextPath + "Home/GetDFQDataByGateByProjectIDAndByUserID", data: user_id_project_id }).done(jDataStr => dfq.FillDFQTable(JSON.parse(jDataStr), dfq.column_key_mapping_fei))
        }
        if (dfq.column_key_mapping_vgr !== undefined) {
            user_id_project_id.gate = "vgr";
            $.ajax({ url: config.contextPath + "Home/GetDFQDataByGateByProjectIDAndByUserID", data: user_id_project_id }).done(jDataStr => dfq.FillDFQTable(JSON.parse(jDataStr), dfq.column_key_mapping_vgr))
        }
        if (dfq.column_key_mapping_iqa !== undefined) {
            user_id_project_id.gate = "iqa";
            $.ajax({ url: config.contextPath + "Home/GetDFQDataByGateByProjectIDAndByUserID", data: user_id_project_id }).done(jDataStr => dfq.FillDFQTable(JSON.parse(jDataStr), dfq.column_key_mapping_iqa))
        }
        if (dfq.column_key_mapping_fqa !== undefined) {
            user_id_project_id.gate = "fqa";
            $.ajax({ url: config.contextPath + "Home/GetDFQDataByGateByProjectIDAndByUserID", data: user_id_project_id }).done(jDataStr => dfq.FillDFQTable(JSON.parse(jDataStr), dfq.column_key_mapping_fqa))
        }
    },
    FillDFQTable: function (jData, col_map) {
        Object.keys(col_map).forEach(k => {
            if (jData[k] !== undefined) {
                if (k === "insert_update_time") $(col_map[k]).html(jData[k].replace('T', " <br/> "));
                else if (k === "dfq_date" && jData[k]) $(col_map[k]).html(jData[k].split('T')[0]);
                else $(col_map[k]).text(jData[k]);
            }
            else $(col_map[k]).text("--");
        });
    },
    FillAllProjects: function () {
        $.ajax({ url: config.contextPath + "Home/GetAllProjectsByUserId" }).done(jData => {
            dfq.all_prjs = JSON.parse(jData);
            dfq.all_prjs.forEach(prj => {
                let opt = "<option value='_VAL_'>_TXT_</option>".replace(/_VAL_/g, prj.id).replace(/_TXT_/g, prj.name);
                $(opt).appendTo("#all_projects");
            })
        }).fail((xhr, et) => {
            alert(JSON.stringify(xhr, null, ' '));
        })
    },
    attachEventhandler: function () {
        const element = document.getElementById('dfq_data')
        element.addEventListener('hidden.bs.modal', event => {
            if (dfq.callback) dfq.callback();
            dfq.callback = null;
        })
    },
    FillProjectGates: async function () { //this gate drop down is in the modal div
        let jData = await $.ajax({ url: config.contextPath + "Home/GetGatesByProjectIdAndUserID", data: { "project_id": dfq.curr_proj_id } });
        let PermissibleGates = JSON.parse(jData);
        let allGates = []; let index = 1;
        Object.keys(PermissibleGates).forEach(key => {
            if (PermissibleGates[key] !== 1) {
                let gate = {};
                gate.id = index++; gate.Name = key;
                allGates.push(gate);
            }
        });
        $("#gates").empty();
        let opt = "<option value='-1'>Choose Gate</option>";
        $(opt).appendTo("#gates");
        if (allGates.length <= 0) {
            dfq.callback = () => Alertify.ShowAlertDialog({
                "title": "This is the End",
                "body": '<div>Hold your breath and count to 10. No more gates available for this project</div> <iframe class="w-100" height="300" src="https://www.youtube.com/embed/DeumyOzKqgI" title="Adele - Skyfall (Official Lyric Video)" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
                "buttons": ["Thanks Sri, amazing work", "Fine My Project also ends here"],
                "foot_note": "Welcome to <h4 class='d-inline'>DFQ</h4><sub<sub>Readiness</sub> "
            });
            setTimeout(() => dfq.myModal.hide(dfq.myModal), 500);
            return;
        }
        allGates.forEach(gate => {
            let opt = "<option value='_VAL_'>_TXT_</option>".replace(/_VAL_/g, gate.id).replace(/_TXT_/g, BasicAction.gate_mapping[gate.Name] === undefined ? gate.Name : BasicAction.gate_mapping[gate.Name]);
            $(opt).appendTo("#gates");
        });
    },
}
