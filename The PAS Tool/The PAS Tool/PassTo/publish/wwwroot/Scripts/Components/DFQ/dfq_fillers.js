var dfq_fillers = {
    __proto__: dfq_processors,
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
                else $(col_map[k]).html(jData[k]);
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