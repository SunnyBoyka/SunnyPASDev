class OwlPublication {
    constructor(tag, data, owl_params) {
        this.tag = tag; this.data = data; this.owl_params = owl_params;
        if (!this.owl_params) this.owl_params = {
            autoplay: false,
            smartSpeed: 2000,
            loop: true,
            //nav: true,//next prev button
            dots: true,
            dotsEach:true,
            margin: 50,
            //autoWidth:true,
            items: 1,
            autoplayHoverPause: true,
            autoplaySpeed: 100,
        }
        if (!this.data.wd) this.data.wd = "100%";
    }
    start_action() {
        (new TemplateRenderer(this.data, this.tag, "~/Scripts/Components/ReUse/OwlPublication/OwlPublication.html", undefined, false).start_action()).then(value => {
            $('#' + this.data.id).owlCarousel(this.owl_params);
        });
    }
}