var Footer = {
    start_action: function (jData, tag) {
        return new TemplateRenderer(jData, tag, "~/Scripts/Components/Footer/Footer.html", null, false, true).start_action();
    }
}