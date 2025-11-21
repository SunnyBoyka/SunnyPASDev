var AboutUS = {
    start_action: function (data, tag) {
        return new TemplateRenderer(data, tag, "~/Scripts/Components/AboutUS/AboutUS.html", null, false).start_action().
            then(jData => {
                $("#sri").attr({ "src": $("#sri").attr("src") + "?" + Math.round(Math.random() * 1000) });
                $("#sesh").attr({ "src": $("#sesh").attr("src") + "?" + Math.round(Math.random() * 1000) });
                return " From Contact";
            });
    },
}