var dfq_processors = {
    __proto__: dfq_base,
    ProcessGateSelection() {
        let the_ids = dfq["column_key_mapping_" + dfq.current_gate];
        $("#dfq_data_Label").text("Current DFQ data for the gate " + BasicAction.gate_mapping[dfq.current_gate]);
        if (the_ids === undefined) {
            alert("column_key_mapping_xxx does not have an entry for\nGate : " + dfq.current_gate + "\nGate id :" + dfq.current_gate_id);
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
                        $("#dfq_date").val(new Date().toISOString().slice(0, 10));
                        return "gate_unlocked_explicit";
                    }
                    //if u r here means a gate is locked
                    dfq.hideElements();
                    $("div[m-body]").show();
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
        $("#qm_incharge").text(dfq.cur_project.qm_incharge);
    }
}