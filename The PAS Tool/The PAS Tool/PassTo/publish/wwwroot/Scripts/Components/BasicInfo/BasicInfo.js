var BasicInfo = {
    start_action: function (tag, data) {
        return new TemplateRenderer(data, tag, "~/Scripts/Components/BasicInfo/BasicInfo.html", null, false, true).start_action();
    }
}
