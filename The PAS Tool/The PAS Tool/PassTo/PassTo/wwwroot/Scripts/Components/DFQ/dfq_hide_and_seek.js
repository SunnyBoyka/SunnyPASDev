var dfq_hide_and_seek = {
    __proto__: dfq_pop_overs,
    ShowHideRowsBasedOnLegacy: function (isLegacy) {
        let tr = "tr[legacy='_IS_LEGACY_']"; let div = "div[legacy='_IS_LEGACY_']";
        $("tr[legacy]").show();
        $("div[legacy]").show();
        $("div[hide_when_legacy]").show();
        let trHide = tr.replace('_IS_LEGACY_', 1 - isLegacy); $(trHide).hide();
        let divHide = div.replace('_IS_LEGACY_', 1 - isLegacy); $(divHide).hide();

        if (!isLegacy) {
            $("#td_coown_pop_over").text("Owned");
            $("#span_coown").text("Owned");
            $("#td_identified_pop_over").text("Draft");
            $("#span_identified").text("Draft");
        }
        else {
            $("div[hide_when_legacy]").hide();
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
        
        $("#project_program_cgr_pop_up").children().show();
        $("#or_cgr_text").hide();
        $("#for_programs").hide();
        if (dfq.cur_project.is_project === 1) {
            $("#prg_txt").hide(); 
            $("#program_cgr_pop_up").hide();
        } 
        else{
            $("#prj_txt").hide();
            $("#project_cgr_pop_up").hide();
        } 
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
        $("#project_program_cgr_pop_up").children().show();
    },
}