/*
Pest.GenerateHTMlAndJavaScript("ExampleTable", {
    Id: "S.No",
    Name: "The Name",
    Address: "Residence Location",
    Age: "The Age",
},
{
    TotRecURL: '/Home/GetRecordCount',
    getPageDataURL: "/Home/GetNextSet?offset=_OFFSET_&limit=_LIMIT_&orderby=Age&etc",
});
use the above code to generate HTML and JavaScript, this code is copied  to your clipboard
*/
/*
var ControlConfig = {
    End_Batch: true,
    Start_Batch: true,
    Current_Page: true,
    Records_Per_Page: true,
    Total_Records: true,
    Total_Pages: true,
    Go_to_Page: false,
    isEditable:true,
    pagebar:true,
    containerJID: null,
    totalRecordsJID:null,
    totalPagesJID:null, 
    RecordsPerPageJID:null, 
    CurrentPageJID:null, 
    GoToPageJID:null, 
    itemsJID:null, 
    TableContJID:null, 
    pitem:null,
    actualobjectName:null,
    headerMapping: {
        Id: "S.No",
        Name: "The Name",
        Address: "Residence Location",
        Age: "The Age",
        },
    deleteCallback:null,
    editCallback:null,
    sortCallBack:null,
    GetRecordCount:null,
    getTable:null,
    TotRecURL: '/Home/GetRecordCount',
    getPageDataURL: "/Home/GetNextSet?offset=_OFFSET_&limit=_LIMIT_&orderby=Age&etc",
}
*/
class Pest /*Pagable Editable Sortable Table*/ {
    constructor(ControlConfig, actualObjectName) {
        this.htmlPage = "<span _PITEM_ offset='_OFFSET_' thePage='_N_' class='pItem'>_N_</span>";
        this.itemsPerPage = parseInt($(ControlConfig.RecordsPerPageJID).val());
        this.totalRecords = 0;
        this.maxPagesPerView = 10; //constant value
        this.pageRecordStart = 0;
        this.PageRecordEnd = 0;
        this.maxAllowedRecords = 0;
        this.pageStart = 0;
        this.pageEnd = 0;
        this.currentPage = 0;
        this.maxPages = 0;
        this.offset = 0;
        this.ControlConfig = ControlConfig;
        this.actualObjectName = actualObjectName;
        if (this.ControlConfig) this.ControlConfig.actualobjectName = this.actualObjectName;
    }
    start_action() {
        return this.GetRecordCount().then(async totRecs => {
            this.totalRecords = totRecs;
            await this.PhelaFetch();
            $(this.ControlConfig.containerJID).removeClass('d-none');
            this.HandleControlConfiguration();
            return "done";
        });
    }
    static GenerateHTMlAndJavaScript(uniqueObjectName, headerMapping, urls) {
        let actualobject = uniqueObjectName + ".theUsageTable";
        let finalhtml = this.MakeHTML(uniqueObjectName, actualobject).replace('_EDIT_', Pest.MakeEditableDialog(uniqueObjectName, headerMapping));
        let ConfigAndCall = Pest.MakeJavaScriptCall(uniqueObjectName, actualobject, headerMapping, urls);
        let fObj = { html: finalhtml, ConfigAndCall: ConfigAndCall };
        $("<textarea style='width:100%;height:200px;color:blue;font-weight:bold;font-size:10px;' ></textarea>").prependTo(document.body).text(ConfigAndCall);
        $("<textarea style='width:100%;height:300px;color:blue;font-weight:bold;font-size:10px;' ></textarea>").prependTo(document.body).text("HTML copied to Clipboard\n" + finalhtml);
        //navigator.clipboard.writeText(finalhtml + ConfigAndCall);
        return fObj;
        //_END_BATCH_ ,  _START_BATCH_ , _CURRENT_PAGE_ , _RECORDS_PER_PAGE_ , _TOTAL_PAGES_ , _TOTAL_RECORDS_ , _GO_TO_PAGE_
        //'_PAGER_' , '_TOTALRECORDS_', '_TOTALPAGES_', '_RECORDSPERPAGE_', '_CURRENTPAGE_', '_GOTOPAGE_', '_ITEMS_', '_TABLECONT_'
        //'#pager','#totalRecords', '#totalPages', '#RecordsPerPage', '#CurrentPage', '#GoToPage', '#items', '#TableCont'
    }
    static MakeJavaScriptCall(uidSuffix, actualobject, headerMapping, urls) {
        return `
           var _UIDSUFFIX_ = {
                _END_BATCH_: true,
                _START_BATCH_: true,
                _CURRENT_PAGE_: true,
                _RECORDS_PER_PAGE_: true,
                _TOTAL_RECORDS_: true,
                _TOTAL_PAGES_: true,
                _GO_TO_PAGE_: true,
                _PAGE_BAR_:true,
                isEditable: true,
                containerJID: '#_PAGER_',
                totalRecordsJID: '#_TOTALRECORDS_',
                totalPagesJID: '#_TOTALPAGES_',
                RecordsPerPageJID: '#_RECORDSPERPAGE_',
                CurrentPageJID: '#_CURRENTPAGE_',
                GoToPageJID: '#_GOTOPAGE_',
                itemsJID: '#_ITEMS_',
                TableContJID: '#_TABLECONT_',
                pitem: '_PITEM_',
                actualobjectName: '_OBJECT_',
                headerMapping: _HEADER_INFO_,
                deleteCallback: (row, jData) => {
                    _UIDSUFFIX_.currentRow = row; //store this row object for future use
                    alert('About to delete\\n' +JSON.stringify(jData, null, ' '));
                    _OBJECT_.remove_row(_UIDSUFFIX_.currentRow);
                    //make Ajax call and get the jData deleted at the Back end/ DB
                    //$.ajax({ url: "back end url to delete jData from DB", data: { toDel: JSON.stringify(jData) } }).done((jRespData) => {
                    //            _OBJECT_.remove_row(_UIDSUFFIX_.currentRow);
                    //        }).catch(jCatch => jCatch);
                },
                editCallback: (row, jData) => {
                    _UIDSUFFIX_.currentObject_1 = jData;
                    _UIDSUFFIX_.currentRow = row;//store this row object for future use
                    for (let k in _UIDSUFFIX_.headerMapping) $("#"+k + '__UIDSUFFIX_').val(jData[k]);
                    if (!_UIDSUFFIX_.myModal) _UIDSUFFIX_.myModal = new bootstrap.Modal(document.getElementById('_PAGER_'))
                        _UIDSUFFIX_.myModal.toggle();
                    //After jData gets Edited you can do the following
                    //_OBJECT_.edit_row(this.currentRow, this.currentObject_1);
                },
                save_click: function (e) {
                    var theObj = { };
                    for (let k in _UIDSUFFIX_.headerMapping) theObj[k]= $("#" +k + '__UIDSUFFIX_').val();
                    alert("Send this object to back end for editing\\nUpon success make the following call :\\n_UIDSUFFIX_.theUsageTable.edit_row(_UIDSUFFIX_.currentRow, theObj)" +JSON.stringify(theObj, null, ' '));
                    _UIDSUFFIX_.theUsageTable.edit_row(_UIDSUFFIX_.currentRow, theObj);
                    //$.ajax({ url: config.contextPath + "Home/editobject?theObj="_OBJ_ }).done((jRespData) => {
                    //    //jData.Name = "Labamba_" + jData.Name.split('_')[1] ;
                    //    TheTopTable.theTable.edit_row(this.currentRow, this.currentObject_1);
                    //    //this.myModal.toggle();
                    //});
                },
                sortCallBack: (e, byWhat, direction) => {
                    alert("In Sort Callback \\nbyWhat = " + byWhat + "\\ndir = " + direction + "\\nOffset = " + _OBJECT_.offset + "\\nLimit = " + _OBJECT_.itemsPerPage);
                    _OBJECT_.start_action();
                },
                getTable: (offset, limit) => {
                    //make an AJAX call and return the ajax response as a promise
                    var url = _UIDSUFFIX_.getPageDataURL;
                    url = url.replace('_OFFSET_', offset).replace('_LIMIT_', limit);
                    return $.ajax({ url: url, context: this });
                },
                GetRecordCount: () => {
                    return $.ajax({ url: _UIDSUFFIX_.TotRecURL, context: this }).then(jData => parseInt(jData));
                },
                CellRenderCallBack: (row_number, json_key_of_the_rowData, rowData) => {
                    return false
                },    
                start_action: function () {
                    if(!_UIDSUFFIX_.theUsageTable) _UIDSUFFIX_.theUsageTable = new Pest(_UIDSUFFIX_, "_UIDSUFFIX_.theUsageTable");
                    _UIDSUFFIX_.theUsageTable.start_action();
                },
                theUsageTable: null,
                TotRecURL: '/Home/GetRecordCount',
                getPageDataURL: "/Home/GetNextSet?offset=_OFFSET_&limit=_LIMIT_&orderby=Age&etc",
            }
            //*****************_UIDSUFFIX_.start_action(); *********************`
            .replace('_PAGER_', 'pager_' + uidSuffix).replace('_TOTALRECORDS_', 'totalRecords_' + uidSuffix).replace('_TOTALPAGES_', 'totalPages_' + uidSuffix)
            .replace('_RECORDSPERPAGE_', 'RecordsPerPage_' + uidSuffix).replace('_CURRENTPAGE_', 'CurrentPage_' + uidSuffix).replace('_GOTOPAGE_', 'GoToPage_' + uidSuffix)
            .replace('_ITEMS_', 'items_' + uidSuffix).replace('_TABLECONT_', 'TableCont_' + uidSuffix).replace(/_OBJECT_/g, actualobject)
            .replace('_END_BATCH_', 'End_Batch_' + uidSuffix).replace('_START_BATCH_', 'Start_Batch_' + uidSuffix)
            .replace('_CURRENT_PAGE_', 'Current_Page_' + uidSuffix).replace('_RECORDS_PER_PAGE_', 'Records_Per_Page_' + uidSuffix)
            .replace('_TOTAL_PAGES_', 'Total_Pages_' + uidSuffix).replace('_TOTAL_RECORDS_', 'Total_Records_' + uidSuffix)
            .replace('_GO_TO_PAGE_', 'Go_to_Page_' + uidSuffix).replace('_PITEM_', 'pitem_' + uidSuffix).replace(/_UIDSUFFIX_/g, uidSuffix)
            .replace('_PAGE_BAR_', 'Page_Bar_' + uidSuffix)
            .replace('_PAGER_', 'pager_edit_' + uidSuffix).replace('_HEADER_INFO_', JSON.stringify(headerMapping, null, ' '))
            .replace('/Home/GetRecordCount', (urls && urls.TotRecURL) ? urls.TotRecURL : '/Home/GetRecordCount')
            .replace('/Home/GetNextSet?offset=_OFFSET_&limit=_LIMIT_&orderby=Age&etc', (urls && urls.getPageDataURL) ? urls.getPageDataURL : '/Home/GetNextSet?offset=_OFFSET_&limit=_LIMIT_&orderby=Age&etc');
    }
    static MakeHTML(uidSuffix, actualobject) {
        let TheHTML =
            `<PEST _OBJECT_ uid__SUFFIX_>
                _EDIT_
                <div id="_PAGER_" class ="no_highlights d-none mt-2">
                <hr />
                    <div class ="title p-2 border border-primary rounded-pill  d-none" _TOTAL_RECORDS_>
                        <h6 id="_TOTALRECORDS_" class ="title p-2 border border-primary rounded-pill"></h6>
                    </div>
                    <div class ="title p-2 border border-primary rounded-pill  d-none" _TOTAL_PAGES_>
                        <h6 id="_TOTALPAGES_" class ="title p-2 border border-primary rounded-pill"></h6>
                    </div>
                    <div class ="title p-2 border border-primary rounded-pill d-none" _RECORDS_PER_PAGE_>
                        <h6 class ="title p-2 border border-primary rounded-pill">- Records Per page =</h6>
                        <select id="_RECORDSPERPAGE_" onchange="_OBJECT_.onItemsPerPageChange(event)">
                            <option selected value="5">5</option>
                            <option value="10">10</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="250">250</option>
                        </select>
                    </div>
                    <div class ="title p-2 border border-primary rounded-pill d-none" _CURRENT_PAGE_>
                        <h5 class ="title p-2 border border-primary rounded-pill" id="_CURRENTPAGE_"></h5>
                    </div>
                    <div class ="title d-none" _GO_TO_PAGE_>
                        <h5 class ="title">- Go to Page</h5>
                        <input type="text" style="width: 30px; font-size: 10px;" id="_GOTOPAGE_" onchange="_OBJECT_.GoToPageChange(event)" />
                    </div>
                    <div class ="pageBar d-none p-2 border border-primary rounded-pill" _PAGE_BAR_>
                        <div class ="arrow d-none" _START_BATCH_ onclick="_OBJECT_.Left_double_arrow_Click(event)">&Larr; </div>
                        <div class ="arrow" onclick="_OBJECT_.Left_arrow_Click(event)">&lt; </div>
                        <div id="_ITEMS_" class ="items">
                            <span class ="pItem">1</span> <span class="pItem">2</span> <span class ="pItem">3</span> <span class="pItem">4</span>
                        </div>
                        <div class ="arrow" onclick="_OBJECT_.Right_arrow_Click(event)">&gt; </div>
                        <div class ="arrow d-none" _END_BATCH_ onclick="_OBJECT_.Right_double_arrow_Click(event)">&Rarr; </div>
                    </div>
                    <hr style="clear: both;" />
                </div>
                    <!-- <div id="_TABLECONT_"></div>  -->
                    <table class ="table table-dark table-hover table-striped table-bordered">
                        <thead ><tr></tr></thead>
                        <tbody id="_TABLECONT_"></tbody>
                    </table>
            </PEST>`;
        let finalhtml = TheHTML
            .replace('_SUFFIX_', uidSuffix)
            .replace('_PAGER_', 'pager_' + uidSuffix).replace('_TOTALRECORDS_', 'totalRecords_' + uidSuffix).replace('_TOTALPAGES_', 'totalPages_' + uidSuffix)
            .replace('_RECORDSPERPAGE_', 'RecordsPerPage_' + uidSuffix).replace('_CURRENTPAGE_', 'CurrentPage_' + uidSuffix)
            .replace('_GOTOPAGE_', 'GoToPage_' + uidSuffix).replace('_ITEMS_', 'items_' + uidSuffix).replace(/_TABLECONT_/g, 'TableCont_' + uidSuffix)
            .replace(/_OBJECT_/g, actualobject).replace('_END_BATCH_', 'End_Batch_' + uidSuffix).replace('_START_BATCH_', 'Start_Batch_' + uidSuffix)
            .replace('_CURRENT_PAGE_', 'Current_Page_' + uidSuffix).replace('_RECORDS_PER_PAGE_', 'Records_Per_Page_' + uidSuffix)
            .replace('_TOTAL_PAGES_', 'Total_Pages_' + uidSuffix).replace('_TOTAL_RECORDS_', 'Total_Records_' + uidSuffix)
            .replace('_GO_TO_PAGE_', 'Go_to_Page_' + uidSuffix).replace('_PAGE_BAR_', 'Page_Bar_' + uidSuffix).replace('_PITEM_', 'pitem_' + uidSuffix);
        return finalhtml;
    }
    static MakeEditableDialog(uidSuffix, headerMapping) {
        let modalEdit = `<div id="_PAGER_EDIT_" class ="modal fade" tabindex="-1">
                    <div class ="modal-dialog">
                        <div class ="modal-content">
                            <div class ="modal-header bg-dark">
                                <h5 class ="modal-title">Modal title</h5>
                                <button type="button" class ="btn-close bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class ="modal-body bg-dark">
                                _MODAL_BODY_
                            </div>
                            <div class ="modal-footer bg-dark">
                                <button type="button" class ="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" class ="btn btn-primary" data-bs-dismiss="modal" onclick="_UIDSUFFIX_.save_click(event)">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>`;
        let body_template = `<div class ="row mt-1">
                                <div class ="col">_LABEL_:</div>
                                <div class ="col">
                                    <input type="text" class="form-control bg-dark text-warning" id="_ID_" />
                                </div>
                            </div>`;
        let ModalBody = "";
        for (let k in headerMapping) ModalBody += body_template.replace('_LABEL_', headerMapping[k]).replace('_ID_', k + '_' + uidSuffix);
        let mEdit = modalEdit.replace("_UIDSUFFIX_", uidSuffix).replace('_PAGER_EDIT_', 'pager_edit_' + uidSuffix).replace('_MODAL_BODY_', ModalBody);
        //navigator.clipboard.writeText(mEdit);
        return mEdit;
    }
    static GenerateHTMlAndJavaScriptForSimpleDimple(uniqueObjectName, headerMapping, urls) {
        let actualobject = uniqueObjectName + ".theUsageTable";
        let finalhtml = this.MakeHTML(uniqueObjectName, actualobject).replace('_EDIT_', "");
        let ConfigAndCall = Pest.MakeJavaScriptCallForSimpleDimple(uniqueObjectName, actualobject, headerMapping, urls);
        let fObj = { html: finalhtml, ConfigAndCall: ConfigAndCall };
        $("<textarea style='width:100%;height:200px;color:blue;font-weight:bold;font-size:10px;' ></textarea>").prependTo(document.body).text(ConfigAndCall);
        $("<textarea style='width:100%;height:300px;color:blue;font-weight:bold;font-size:10px;' ></textarea>").prependTo(document.body).text("HTML copied to Clipboard\n" + finalhtml);
        //navigator.clipboard.writeText(finalhtml + "\n\n" + ConfigAndCall);
        return fObj;
    }
    static MakeJavaScriptCallForSimpleDimple(uidSuffix, actualobject, headerMapping, urls) {
        return `
           var _UIDSUFFIX_ = {
                //_END_BATCH_: false,
                //_START_BATCH_: false,
                //_CURRENT_PAGE_: false,
                //_RECORDS_PER_PAGE_: false,
                //_TOTAL_RECORDS_: false,
                //_TOTAL_PAGES_: false,
                //_GO_TO_PAGE_: false,
                //_PAGE_BAR_:false,
                //isEditable: false,
                containerJID: '#_PAGER_',
                totalRecordsJID: '#_TOTALRECORDS_',
                totalPagesJID: '#_TOTALPAGES_',
                RecordsPerPageJID: '#_RECORDSPERPAGE_',
                CurrentPageJID: '#_CURRENTPAGE_',
                GoToPageJID: '#_GOTOPAGE_',
                itemsJID: '#_ITEMS_',
                TableContJID: '#_TABLECONT_',
                pitem: '_PITEM_',
                actualobjectName: '_OBJECT_',
                headerMapping: _HEADER_INFO_,
                getTable: (offset, limit) => {
                        //make an AJAX call and return the ajax response as a promise
                        var url = _UIDSUFFIX_.getPageDataURL;
                        url = url.replace('_OFFSET_', offset).replace('_LIMIT_', limit);
                        return $.ajax({ url: url, context: this });
                },
                GetRecordCount: () => {
                        return $.ajax({ url: _UIDSUFFIX_.TotRecURL, context: this }).then(jData => parseInt(jData));
                },
                start_action: function () {
                    if(!_UIDSUFFIX_.theUsageTable) _UIDSUFFIX_.theUsageTable = new Pest(_UIDSUFFIX_, "_UIDSUFFIX_.theUsageTable");
                    _UIDSUFFIX_.theUsageTable.SimpleDimple();
                },
                theUsageTable: null,
                TotRecURL: '/Home/GetRecordCount',
                getPageDataURL: "/Home/GetNextSet?offset=_OFFSET_&limit=_LIMIT_&orderby=Age&etc",
            }
            //*****************_UIDSUFFIX_.start_action(); *********************`
            .replace('_PAGER_', 'pager_' + uidSuffix).replace('_TOTALRECORDS_', 'totalRecords_' + uidSuffix).replace('_TOTALPAGES_', 'totalPages_' + uidSuffix)
            .replace('_RECORDSPERPAGE_', 'RecordsPerPage_' + uidSuffix).replace('_CURRENTPAGE_', 'CurrentPage_' + uidSuffix).replace('_GOTOPAGE_', 'GoToPage_' + uidSuffix)
            .replace('_ITEMS_', 'items_' + uidSuffix).replace('_TABLECONT_', 'TableCont_' + uidSuffix).replace(/_OBJECT_/g, actualobject)
            .replace('_END_BATCH_', 'End_Batch_' + uidSuffix).replace('_START_BATCH_', 'Start_Batch_' + uidSuffix)
            .replace('_CURRENT_PAGE_', 'Current_Page_' + uidSuffix).replace('_RECORDS_PER_PAGE_', 'Records_Per_Page_' + uidSuffix)
            .replace('_TOTAL_PAGES_', 'Total_Pages_' + uidSuffix).replace('_TOTAL_RECORDS_', 'Total_Records_' + uidSuffix)
            .replace('_GO_TO_PAGE_', 'Go_to_Page_' + uidSuffix).replace('_PITEM_', 'pitem_' + uidSuffix).replace(/_UIDSUFFIX_/g, uidSuffix)
            .replace('_PAGE_BAR_', 'Page_Bar_' + uidSuffix)
            .replace('_PAGER_', 'pager_edit_' + uidSuffix).replace('_HEADER_INFO_', JSON.stringify(headerMapping, null, ' '))
            .replace('/Home/GetRecordCount', (urls && urls.TotRecURL) ? urls.TotRecURL : '/Home/GetRecordCount')
            .replace('/Home/GetNextSet?offset=_OFFSET_&limit=_LIMIT_&orderby=Age&etc', (urls && urls.getPageDataURL) ? urls.getPageDataURL : '/Home/GetNextSet?offset=_OFFSET_&limit=_LIMIT_&orderby=Age&etc');
    }
    makeHeader(oneObject) {
        if (!this.ControlConfig.headerMapping) {
            this.ControlConfig.headerMapping = {};
            for (let k in oneObject) this.ControlConfig.headerMapping[k] = k;
        }
        let theHead = $(this.ControlConfig.TableContJID).siblings("thead").first();
        let theTROfthead = theHead.children("tr").first();
        if (undefined !== theTROfthead.attr("header_added")) return;
        for (let k in this.ControlConfig.headerMapping) {
            if (this.ControlConfig.sortCallBack) {
                let sortIconUPTemplate = "<span up class='point ms-2 p-1' onclick=\"_OBJECT_.click_sort(event,'_FIELD_' , 'up')\"> &uarr; </span>";
                let sortIconDOWNTemplate = "<span down class='point me-2 p-1' onclick=\"_OBJECT_.click_sort(event,'_FIELD_' , 'down')\"> &darr; </span>";
                let sortUPIcon = sortIconUPTemplate;
                sortUPIcon = sortUPIcon.replace("_OBJECT_", this.ControlConfig.actualobjectName).replace('_FIELD_', k);
                let sortDownIcon = sortIconDOWNTemplate;
                sortDownIcon = sortDownIcon.replace("_OBJECT_", this.ControlConfig.actualobjectName).replace('_FIELD_', k);
                theTROfthead.append("<th><span class='nowrap'>" + sortDownIcon + this.ControlConfig.headerMapping[k] + sortUPIcon + "</span></th>");
            }
            else theTROfthead.append("<th class='nowrap'>" + this.ControlConfig.headerMapping[k] + "</th>");
        }
        if (this.ControlConfig.isEditable) theTROfthead.append("<th><i class='bi bi-pencil'></i></th>");
        theTROfthead.attr({ "header_added": "" });
    }
    makeTable(mydata) {
        this.makeHeader(mydata[0]);
        var htmlRows = "";
        let that = this;
        $.each(mydata, (index, value) => {
            var TableRow = "<tr tr_dat='_JDATA_'>";
            TableRow = TableRow.replace('_JDATA_', JSON.stringify(value));
            //$.each(value,  (key, val) {
            //    TableRow += "<td>" + val + "</td>";
            //});
            for (let k in this.ControlConfig.headerMapping) {
                if (this.ControlConfig.CellRenderCallBack) {
                    let cellHTML = this.ControlConfig.CellRenderCallBack(index, k, value);
                    if (false === cellHTML) TableRow += "<td>" + value[k] + "</td>"; 
                    else TableRow += "<td>" + cellHTML + "</td>";
                } else TableRow += "<td>" + value[k] + "</td>";                
            }
            //let str = that.ControlConfig.actualobjectName + ".click_delete(event, '" + JSON.stringify(value) + "')";
            //let _CTX_CLICK_ = that.ControlConfig.actualobjectName + ".click_delete(event, '" + JSON.stringify(value) + "')"; //this will not work
            if (that.ControlConfig.isEditable) {
                let trash = "<i class='bi bi-trash point f-sm' onclick=_CTX_CLICK_></i>".replace('_CTX_CLICK_', that.ControlConfig.actualobjectName + ".click_delete(event)");
                let edit = "<i class='bi bi-pencil ml-2 point f-sm' onclick=_CTX_CLICK_></i>".replace('_CTX_CLICK_', that.ControlConfig.actualobjectName + ".click_edit(event)");
                TableRow += "<td><span class='nowrap'>_TRASH_ _EDIT_</span></td>".replace('_TRASH_', trash).replace('_EDIT_', edit);
            }
            TableRow += "</tr>";
            htmlRows += TableRow;
            //$(table).append(TableRow);
        });
        return $(htmlRows);
    }
    SimpleDimple() {
        this.HandleControlConfiguration();
        this.MakePagedTable(this.itemsPerPage, this.offset).then(jData => {
            let table = this.makeTable(jData);
            $(this.ControlConfig.TableContJID).empty();
            $(table).appendTo(this.ControlConfig.TableContJID);
            $(this.ControlConfig.containerJID).removeClass("d-none").find("hr").hide();
        });
    }
    HandleControlConfiguration() {
        //if (ControlConfig.End_Batch) $("div[End_Batch]").show(); else $("div[End_Batch]").hide();
        //if (ControlConfig.Start_Batch) $("div[Start_Batch]").show(); else $("div[Start_Batch]").hide();
        //if (ControlConfig.Current_Page) $("div[Current_Page]").show(); else $("div[Current_Page]").hide();
        //if (ControlConfig.Records_Per_Page) $("div[Records_Per_Page]").show(); else $("div[Records_Per_Page]").hide();
        //if (ControlConfig.Total_Records) $("div[Total_Records]").show(); else $("div[Total_Records]").hide();
        //if (ControlConfig.Go_to_Page) $("div[Go_to_Page]").show(); else $("div[Go_to_Page]").hide();
        //if (ControlConfig.Total_Pages) $("div[Total_Pages]").show(); else $("div[Total_Pages]").hide();
        //for (var key in this.PageConfig) {
        //    if (this.PageConfig[key]) $("div[" + key + "]").show();
        //    else $("div[" + key + "]").hide();
        //}
        for (var key in this.ControlConfig) {
            //if (this.ControlConfig[key]) $("div[" + key + "]").show();
            if (this.ControlConfig[key]) $("div[" + key + "]").removeClass('d-none');
            //else $("div[" + key + "]").hide();
        }
    }
    PhelaFetch() {
        this.currentPage = this.pageRecordStart = this.PageRecordEnd = this.pageStart = this.pageEnd = 0;

        this.maxAllowedRecords = this.itemsPerPage * this.maxPagesPerView;
        if (this.totalRecords < this.maxAllowedRecords) this.maxAllowedRecords = this.totalRecords;

        this.PageRecordEnd = this.pageRecordStart + this.maxAllowedRecords;
        this.pageStart = this.pageRecordStart / this.itemsPerPage;

        this.pageEnd = this.PageRecordEnd / this.itemsPerPage;

        this.PageRecordEnd = Math.ceil(this.PageRecordEnd);
        this.pageStart = Math.ceil(this.pageStart);
        this.pageEnd = Math.ceil(this.pageEnd);

        this.Render();
        this.maxPages = Math.ceil(this.totalRecords / this.itemsPerPage);

        this.UpdateUI();
        this.GetPageData(this.itemsPerPage, 0);
    }
    UpdateUI() {
        $(this.ControlConfig.CurrentPageJID).text("Current Page = " + this.currentPage);
        $(this.RecordsPerPagJID).val(this.itemsPerPage);
        $(this.ControlConfig.totalRecordsJID).text("Total Records = " + this.totalRecords);
        $(this.ControlConfig.totalPagesJID).text("Total Pages = " + this.maxPages);
    }
    Render() {
        if (this.pageStart >= this.pageEnd) return;
        $(this.ControlConfig.itemsJID).empty();
        var i;
        for (i = this.pageStart; i < this.pageEnd; ++i) {
            var html = this.htmlPage.replace('_PITEM_', this.ControlConfig.pitem).replace(/_N_/g, i).replace('_OFFSET_', i * this.itemsPerPage);
            var fs = 10 - (i.toString().length / 3);
            $(html).appendTo(this.ControlConfig.itemsJID).click((e) => this.click_page(e)).css({ "font-size": fs + "px" });
        }
        //alert(10 - (i.toString().length / 2));
        this.HighlightCurrentPage();
    }
    GetPageData(limit, offset) {
        this.HighlightCurrentPage();
        this.MakePagedTable(this.itemsPerPage, offset).then(jData => {
            $(this.ControlConfig.TableContJID).empty();
            var table = this.makeTable(jData);
            $(table).appendTo(this.ControlConfig.TableContJID);
        });
    }
    HighlightCurrentPage() {
        $("span[" + this.ControlConfig.pitem + "]").removeClass("bold");
        $("span[" + this.ControlConfig.pitem + "][offset='" + this.currentPage * this.itemsPerPage + "']").toggleClass("bold");
    }
    MakePagedTable(limit, offset) {
        if (!this.ControlConfig.getTable) {
            return new Promise((resolve, reject) => {
                var students = [];
                limit = parseInt(limit);
                offset = parseInt(offset);
                for (var i = offset; i < offset + limit; ++i) {
                    var student = {};
                    student.Name = "this.ControlConfig.getTable _" + i;
                    student.Age = i;
                    student.Address = 'has no callback _' + i;
                    students.push(student);
                }
                resolve(students);
            });
        }
        return this.ControlConfig.getTable(offset, limit).then(jData => JSON.parse(jData));
    }
    GetRecordCount() {
        if (!this.ControlConfig.GetRecordCount) return new Promise((resolve, reject) => resolve(5000));
        return this.ControlConfig.GetRecordCount();
    }
    ////////////////////////////Event Handlers///////////////////////////////
    click_sort(e, byWhat, direction) {
        $(e.target).closest("tr").find("span[up],span[down]").removeClass("border border-primary");
        $(e.target).addClass("border border-primary");
        if (!this.ControlConfig.sortCallBack) return;
        this.ControlConfig.sortCallBack(e, byWhat, direction);
    }
    click_delete(e) {
        let row = $(e.target).closest('tr');
        let jData = row.attr('tr_dat');
        if (!(this.ControlConfig.deleteCallback)) return;
        this.ControlConfig.deleteCallback(row, JSON.parse(jData));
    }
    remove_row(row) { row.remove(); }
    click_edit(e) {
        this.target = e.target;
        let row = $(e.target).closest('tr');
        let jData = row.attr('tr_dat');
        if (!(this.ControlConfig.editCallback)) return;
        this.ControlConfig.editCallback(row, JSON.parse(jData));
    }
    edit_row(row, jData) {
        //alert("About to Edit\n" + JSON.stringify(jData));
        let jArr = Array.isArray(jData) ? jData : [jData];
        let rows = this.makeTable(jArr);
        row.replaceWith(rows);
    }
    onItemsPerPageChange(e) {
        this.itemsPerPage = $(e.target).val();
        this.PhelaFetch();
    }
    click_page(e) {
        this.offset = $(e.target).attr('offset');
        //alert("offset = " + this.offset + "\nlimit=" + this.itemsPerPage);
        this.currentPage = $(e.target).attr("thePage");
        $(this.ControlConfig.CurrentPageJID).text(" - Current Page = " + this.currentPage);
        this.GetPageData(this.itemsPerPage, this.offset);
    }
    Left_arrow_Click(e) {
        this.pageRecordStart = this.pageRecordStart - this.maxAllowedRecords;
        if (this.pageRecordStart <= 0) this.pageRecordStart = 0;
        this.PageRecordEnd = this.pageRecordStart + this.maxAllowedRecords;

        if (this.PageRecordEnd >= this.totalRecords) this.PageRecordEnd = this.totalRecords;
        this.pageStart = this.pageRecordStart / this.itemsPerPage;
        this.pageEnd = this.PageRecordEnd / this.itemsPerPage;

        this.PageRecordEnd = Math.ceil(this.PageRecordEnd);
        this.pageStart = Math.ceil(this.pageStart);
        this.pageEnd = Math.ceil(this.pageEnd);

        this.Render();
    }
    Left_double_arrow_Click(e) {
        this.pageRecordStart = 0;
        if (this.pageRecordStart <= 0) this.pageRecordStart = 0;
        this.PageRecordEnd = this.pageRecordStart + this.maxAllowedRecords;

        if (this.PageRecordEnd >= this.totalRecords) this.PageRecordEnd = this.totalRecords;
        this.pageStart = this.pageRecordStart / this.itemsPerPage;
        this.pageEnd = this.PageRecordEnd / this.itemsPerPage;

        this.PageRecordEnd = Math.ceil(this.PageRecordEnd);
        this.pageStart = Math.ceil(this.pageStart);
        this.pageEnd = Math.ceil(this.pageEnd);

        this.Render();
    }
    Right_arrow_Click(e) {
        this.pageRecordStart = this.PageRecordEnd;
        this.PageRecordEnd = this.pageRecordStart + this.maxAllowedRecords;

        if (this.PageRecordEnd >= this.totalRecords) this.PageRecordEnd = this.totalRecords;
        this.pageStart = this.pageRecordStart / this.itemsPerPage;
        this.pageEnd = this.PageRecordEnd / this.itemsPerPage;

        this.PageRecordEnd = Math.ceil(this.PageRecordEnd);
        this.pageStart = Math.ceil(this.pageStart);
        this.pageEnd = Math.ceil(this.pageEnd);

        this.Render();
    }
    Right_double_arrow_Click(e) {
        this.pageStart = this.maxPages - 1;
        this.pageRecordStart = this.pageStart * this.itemsPerPage;
        this.PageRecordEnd = this.pageRecordStart + this.maxAllowedRecords;
        if (this.PageRecordEnd >= this.totalRecords) this.PageRecordEnd = this.totalRecords;
        this.pageEnd = this.PageRecordEnd / this.itemsPerPage;

        this.Render();
    }
    GoToPageChange(e) {
        var pageNum = parseInt($(this.ControlConfig.GoToPageJID).val());
        if (pageNum >= this.maxPages) return;
        this.currentPage = pageNum;
        this.GetPageData(this.itemsPerPage, pageNum * this.itemsPerPage);
    }
    ////////////////////////////Event Handlers///////////////////////////////
}