var AllProjects = {
    End_Batch_AllProjects: true,
    Start_Batch_AllProjects: true,
    Current_Page_AllProjects: true,
    Records_Per_Page_AllProjects: true,
    Total_Records_AllProjects: true,
    Total_Pages_AllProjects: true,
    Go_to_Page_AllProjects: true,
    Page_Bar_AllProjects: true,
    isEditable: true,
    containerJID: '#pager_AllProjects',
    totalRecordsJID: '#totalRecords_AllProjects',
    totalPagesJID: '#totalPages_AllProjects',
    RecordsPerPageJID: '#RecordsPerPage_AllProjects',
    CurrentPageJID: '#CurrentPage_AllProjects',
    GoToPageJID: '#GoToPage_AllProjects',
    itemsJID: '#items_AllProjects',
    TableContJID: '#TableCont_AllProjects',
    pitem: 'pitem_AllProjects',
    actualobjectName: 'AllProjects.theUsageTable',
    headerMapping: {
        "id": '<div class="rotateXYZ d-inline-block"><i class="fs-3 bi bi-fuel-pump-fill pe-none"></i></div>',
        "question": '<div class="rotateZ d-inline-block"><i class="fs-3 bi bi-patch-question-fill pe-none"></i></div>',
        "mail": '<i class="fs-3 bi bi-mailbox pe-none"></i>',
        "insert_time_stamp": '<div class="shake d-inline-block"><i class="fs-3 bi bi-alarm-fill pe-none"></i></div>'
    },
    deleteCallback: (row, jData) => {
        AllProjects.currentRow = row; //store this row object for future use
        alert('About to delete\n' + JSON.stringify(jData, null, ' '));
        AllProjects.theUsageTable.remove_row(AllProjects.currentRow);
        //make Ajax call and get the jData deleted at the Back end/ DB
        //$.ajax({ url: "back end url to delete jData from DB", data: { toDel: JSON.stringify(jData) } }).done((jRespData) => {
        //            AllProjects.theUsageTable.remove_row(AllProjects.currentRow);
        //        }).catch(jCatch => jCatch);
    },
    editCallback: (row, jData) => {        
        AllProjects.currentObject_1 = jData;
        AllProjects.currentRow = row;//store this row object for future use
        for (let k in AllProjects.headerMapping) $("#" + k + '_AllProjects').val(jData[k]);
        if (!AllProjects.myModal) AllProjects.myModal = new bootstrap.Modal(document.getElementById('pager_edit_AllProjects'))
        AllProjects.myModal.toggle();
        //After jData gets Edited you can do the following
        //AllProjects.theUsageTable.edit_row(this.currentRow, this.currentObject_1);
    },
    save_click: function (e) {
        var theObj = {};
        for (let k in AllProjects.headerMapping) theObj[k] = $("#" + k + '_AllProjects').val();
        alert("Send this object to back end for editing\nUpon success make the following call :\nAllProjects.theUsageTable.edit_row(AllProjects.currentRow, theObj)" + JSON.stringify(theObj, null, ' '));
        AllProjects.theUsageTable.edit_row(AllProjects.currentRow, theObj);
        //$.ajax({ url: config.contextPath + "Home/editobject?theObj="_OBJ_ }).done((jRespData) => {
        //    //jData.Name = "Labamba_" + jData.Name.split('_')[1] ;
        //    TheTopTable.theTable.edit_row(this.currentRow, this.currentObject_1);
        //    //this.myModal.toggle();
        //});
    },
    sortCallBack: (e, byWhat, direction) => {
        alert("In Sort Callback \nbyWhat = " + byWhat + "\ndir = " + direction + "\nOffset = " + AllProjects.theUsageTable.offset + "\nLimit = " + AllProjects.theUsageTable.itemsPerPage);
        AllProjects.theUsageTable.start_action();
    },
    getTable: (offset, limit) => {
        //make an AJAX call and return the ajax response as a promise
        var url = AllProjects.getPageDataURL;
        url = url.replace('_OFFSET_', offset).replace('_LIMIT_', limit);
        return $.ajax({ url: url, context: this });
    },
    GetRecordCount: () => $.ajax({ url: AllProjects.TotRecURL, context: this }).then(jData => parseInt(jData)),
    CellRenderCallBack: (row, col, rowData) => {
        switch (col) {
            case "id": {
                //let html_template = '<a target="_blank" href="/VnVOverflow/Home/AnswerToAQuestion?qid=_ID_#answer" class="btn btn-sm btn-warning">_ID_ _ICON_</a>'
                let html_template = '<span class="btn btn-sm btn-warning">_ID_ _ICON_</a>'
                let html = html_template.replace(/_ID_/g, rowData[col]).replace(/_ICON_/g, ' <i class="bi bi-mouse2"></i>');
                return html;
            }
            case "question": return rowData[col].ReplaceDanger();
            case "mail": {
                if (rowData[col].indexOf("sai") != -1) return "<span class='badge bg-primary rounded-pill p-2'><i class='bi bi-mailbox2-flag'></i> " + rowData[col] + "</span>" + '</i>'
                else return false;
            }
            case "insert_time_stamp": return new Date(rowData[col].replace(' ', 'T')).toString().split('GMT')[0];
            default: return false;
        }
    },
    start_action: function (data, tag) {
        new TemplateRenderer(data, tag, "~/Scripts/Components/ThePestTable/ThePestTable.html", null, false, false).start_action().
            then(jData => {
                if (!AllProjects.theUsageTable) AllProjects.theUsageTable = new Pest(AllProjects, "AllProjects.theUsageTable");
                AllProjects.theUsageTable.start_action().
                    then(jData => {
                        setTimeout(() => {
                            //$("#head_AllProjects tr").append('<td><i class="bi bi-arrow-up-circle-fill"></i></td>');
                            ////$("#TableCont_AllProjects tr").append("<td><a target='_blank' href='/VnVOverflow/Home/AnswerToAQuestion?qid=1' class='btn btn-sm btn-primary'>View</a></td>");
                            //$.each($("#TableCont_AllProjects tr"), (i, val) => {
                            //    let theRow = $(val);
                            //    let jRowData = JSON.parse(theRow.attr("tr_dat"));
                            //    theRow.append("<td><a target='_blank' href='/VnVOverflow/Home/AnswerToAQuestion?qid=" + jRowData.id + "' class='btn btn-sm btn-primary'>View</a></td>");
                            //    let firstTD = theRow.find("td:first-child");
                            //    let txt = firstTD.text();
                            //    firstTD.html("<a target='_blank' href='/VnVOverflow/Home/AnswerToAQuestion?qid=" + jRowData.id + "' class='btn btn-sm btn-primary'>" + txt + "</a>")
                            //})

                        }, 1000);
                    });
                theApp.AOSInitialize();

            });
    },
    data: null, tag: null,
    theUsageTable: null,
    TotRecURL: config.contextPath + 'Home/GetAllProjectsCount',
    getPageDataURL: config.contextPath + "Home/GetNextSetFromAllProjects?offset=_OFFSET_&limit=_LIMIT_&orderby=id",
}
//*****************AllProjects.start_action(); *********************