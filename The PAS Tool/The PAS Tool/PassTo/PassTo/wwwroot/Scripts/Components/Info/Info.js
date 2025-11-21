var Info = {
    start_action: function (data, tag) {
        return new TemplateRenderer(data, tag, "~/Scripts/Components/Info/Info.html", null, false).start_action().
            then(jData => "From Info");
    },
}