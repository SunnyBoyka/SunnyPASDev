var dfq_dummy_response = {
    __proto__: dfq_fillers,
    dummy_response: null,
    makeDummyResponse: function () {
        dfq.all_gates_column_key_mappings = [dfq.column_key_mapping_sgr, dfq.column_key_mapping_pgr, dfq.column_key_mapping_cgr_i, dfq.column_key_mapping_cgr_a, dfq.column_key_mapping_fei, dfq.column_key_mapping_vgr, dfq.column_key_mapping_iqa, dfq.column_key_mapping_fqa];
        dfq.dummy_response = {}; dfq.dummy_response.id = -1; dfq.dummy_response.project_id = -1; dfq.dummy_response.user_id = -1; dfq.dummy_response.insert_update_time = new Date;
        Object.keys(dfq.column_key_mapping_sgr).forEach(k => dfq.dummy_response[k] = "Look up <i class='bi bi-arrow-up fw-bolder'></i>");
    },
}