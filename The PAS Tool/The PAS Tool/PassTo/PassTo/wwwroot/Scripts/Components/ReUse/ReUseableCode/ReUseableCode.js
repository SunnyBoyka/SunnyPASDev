var ReUseableCode = {
    start_action: function (data) {
        (new TemplateRenderer(data, "ReUseableCode", "~/Scripts/Components/ReUse/ReUseableCode/ReUseableCode.html", null, false).start_action()).then((value => {
            $('#' + data.id).owlCarousel({
                autoplay: true,
                smartSpeed: 1000,
                loop: true,
                nav: false,
                items: 1,
                margin: 10,
                autoplayHoverPause: true,
                dots: true,
                dotsData: true
            });
        }));
    }
}