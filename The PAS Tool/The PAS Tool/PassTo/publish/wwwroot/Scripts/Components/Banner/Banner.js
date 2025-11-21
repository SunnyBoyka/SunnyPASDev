var Banner = {
    html_short_cut: '<a target="_self" href="#_ID_" class="btn border-3 text-capitalize m-1" style="font-weight:600; font-size:12px;">_TEXT_</a >',
    cont_short_cut: "div[short_cuts]",
    short_cut_attr: "zibla",
    deafult_text_color: "red",
    data: null,
    start_action: function (tag, data) {
        data.captions.forEach((cap, index) => { if (!cap.color) cap.color = Banner.deafult_text_color; });
        Banner.data = data;
        return new TemplateRenderer(data, tag, "~/Scripts/Components/Banner/Banner.html", null, false).start_action().
            then(jData => {
                //$('#' + data.id).carousel({ interval: 3000, cycle: true });
                return "From banner"
            });
    },
    Show_ShortCuts(shortcuts) {
        let timer = setInterval(() => {
            if ($(Banner.cont_short_cut).length > 0) {
                clearInterval(timer);
                Banner.Show_ShortCuts_internal(shortcuts);
            }
        }, 500);
    },
    SetBannerTitles: function (b_t_1, b_t_1_color, b_st_1, b_t_2, b_t_2_color, b_st_2) {
        let timer = setInterval(() => {
            if ($("#b_t_1").length > 0) {

                if (null === b_t_1_color) b_t_1_color = "white";
                if (null === b_t_2_color) b_t_2_color = "white";

                $("#b_t_1").html(b_t_1).css({ "color": b_t_1_color });

                if (null === b_st_1) $("#b_st_1").hide()
                else $("#b_st_1").html(b_st_1).show();

                $("#b_t_2").html(b_t_2).css({ "color": b_t_2_color });

                if (null === b_st_2) $("#b_st_2").hide()
                else $("#b_st_2").html(b_st_2).show();;

                clearInterval(timer);
            }
        }, 500);
    },
    GetAppropriateBackgroundColor: function (color) {
        $("#ribal").css({ "background-color": color });
        let clr = $("#ribal").css("background-color");
        clr = clr.replace(")", ",.3)").replace(/rgb/g, "rgba");
        return clr;
    },
    Show_ShortCuts_internal: function (shortcuts) {
        if (!shortcuts || shortcuts.length <= 0) return;
        $(Banner.cont_short_cut).empty();
        shortcuts.forEach(short_cut => {
            let html = null;
            if (short_cut.isExternal) html = Banner.html_short_cut.replace('#_ID_', short_cut.id).replace('_TEXT_', short_cut.text).replace('target="_self"', 'target="_blank"');
            else html = Banner.html_short_cut.replace('_ID_', short_cut.id).replace('_TEXT_', short_cut.text);
            $(html).appendTo(Banner.cont_short_cut);
        });
        Banner.data.captions.forEach((cap, index) => {
            if (!cap.color) cap.color = Banner.deafult_text_color;
            let clr = Banner.GetAppropriateBackgroundColor(cap.color)
            $("div[zibla='" + index + "'").find("a").css({ "color": cap.color, "border-color": cap.color, "background-color": clr });
            //$("div[kibla='" + index + "'").css({ "background-color": clr });
        });
    },
    remove_short_cuts: function () {
        let timer = setInterval(() => {
            if ($(Banner.cont_short_cut).length > 0) {
                clearInterval(timer);
                $(Banner.cont_short_cut).empty();
            }
        }, 500);
    },
    html_special: '<img src="_SRC_" class="img_fluid" />',
    cont_special: "div[special]",
    Show_Specials(img_id) {
        $(Banner.cont_special).empty();
        let timer = setInterval(() => {
            if ($(Banner.cont_special).length > 0) {
                clearInterval(timer);
                Banner.Show_Specials_Internal(img_id);
            }
        }, 500);
    },
    Show_Specials_Internal: function (img_src) {
        let html = Banner.html_special.replace('_SRC_', img_src);
        $(html).appendTo(Banner.cont_special)
        $("img[car_img]").height(600);
    },
    remove_specials: function () {
        let timer = setInterval(() => {
            if ($(Banner.cont_special).length > 0) {
                clearInterval(timer);
                $(Banner.cont_special).empty();
                $("img[car_img]").height(500);
            }
        }, 500);
    },
    add_special_html(theHTML) {
        let timer = setInterval(() => {
            if ($(Banner.cont_special).length > 0) {
                clearInterval(timer);
                $(Banner.cont_special).html(theHTML)
                $("img[car_img]").height(600);
            }
        }, 500);
    }
}