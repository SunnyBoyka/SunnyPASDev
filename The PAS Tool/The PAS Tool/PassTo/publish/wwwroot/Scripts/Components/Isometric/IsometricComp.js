var IsometricComp = {
    iso_demo: {},
    start_action: function (tag) {
        //we use HandleBar
        new TemplateRenderer(null, tag, "~/Scripts/Components/Isometric/Isometric.html", undefined, false).start_action().
            then(jData => {
                $("img[lesson]").css({ "transform": "scale(0)" });

                setTimeout(() => {
                    IsometricComp.iso_demo = new IsoMetric(".TheContainer", ".my-item", 3);
                    $({ scale: 0 }).animate({ scale: 1 },
                        {
                            duration: 3500,
                            step: function () {
                                $("img[lesson]").css({ transform: 'scale(' + this.scale + ')' });
                            },
                            complete: function () {
                                
                            }
                        });

                }, 1000);
            })
    },
    DecideAnimation: function (e) { IsometricComp.iso_demo.SetAnimation(parseInt($(e.target).val())); },
    SetButtonState: function (e) {
        //$(e.target).siblings().removeClass("text-secondary");
        $(e.target).siblings().removeClass("fs-5 text-decoration-underline");
        $(e.target).addClass("fs-5 text-decoration-underline");
    },
    Filter(e, selector) {
        IsometricComp.SetButtonState(e);
        IsometricComp.iso_demo.Filter(event, selector);
    }
}