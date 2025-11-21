function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
function ReplaceDangerousChars() { return this.replace(/&nl/g, '<br/>').replace(/&as/g, "'") }
String.prototype.ReplaceDanger = ReplaceDangerousChars;

function RandomString(len) { return Array.from({ length: len }, i => String.fromCharCode(Math.round(Math.ceil(Math.random() * 25) + 65))).join(''); }
Math.RandomString = RandomString;

$.makeTable = function (mydata, cssClass, HeaderMapping, callback) {
    if (!cssClass) cssClass = "table table-bordered table-sm table-hover";
    var table = $('<table class="' + cssClass + '">');
    var tblHeader = '<thead ><tr class="table-info">';
    for (var k in mydata[0]) {
        if (HeaderMapping) tblHeader += "<th>" + HeaderMapping[k] + "</th>";
        else tblHeader += "<th>" + k + "</th>";
    }
    tblHeader += "</tr></thead>";
    $(tblHeader).appendTo(table);
    var TableRow = "<tbody>";
    $.each(mydata, function (index, value) {
        TableRow += "<tr id=_ID_>".replace("_ID_", value.name);
        $.each(value, function (key, val) {
            if (callback) TableRow += "<td >" + callback(key, val, value) + "</td>";
            else TableRow += "<td>" + val + "</td>";
        });
        TableRow += "</tr>";
    });
    TableRow += "</tbody>";
    var tblFooter = "<tfoot><tr>";
    for (var k in mydata[0]) tblFooter += "<th>" + k + "</th>";
    tblFooter += "</tr></tfoot>";
    TableRow += tblFooter;
    $(table).append(TableRow);
    return ($(table));
};
$.majax = function (ajaxData) {
    return $.ajax(ajaxData).done(jData => {
        if (jData.indexOf("{637F88DB-6182-4928-A640-A4E1D87586AD}") != -1) document.location.href = config.contextPath; 
        else return jData
    });
}