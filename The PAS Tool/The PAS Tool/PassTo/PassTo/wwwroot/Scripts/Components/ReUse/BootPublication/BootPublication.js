class BootPublication {
    constructor(tag, data) {
        this.tag = tag;
        this.data = data;
        if (!data) alert("Govinda Govinda")
        if (!this.data.animation) this.data.animation = "zoom-in"
    }
    start_action() {
        new TemplateRenderer(this.data, this.tag, "~/Scripts/Components/ReUse/BootPublication/BootPublication.html", undefined, false).start_action();
    }
}