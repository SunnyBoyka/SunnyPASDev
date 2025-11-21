var nMap = {
    start_action: function (tag, data) {
        return new TemplateRenderer(data, tag, "~/Scripts/Components/nMap/nMap.html", null, false, true).start_action();
    },
    Click_Button: function (e) {
        $("#wait_until_dark").show();
        setTimeout(() => {
            $("#wait_until_dark").remove();
            $("#nMap_results").show();
        }, 1000)
    }
}
