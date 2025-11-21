class Icon {
    static myModal = null;
    static profile_img = '<img class="rounded-circle" style="width:30px;" src="_SRC_" />';
    static small_icon = ` <div class="nav-text border border-1 p-2 ">
                            <img id="img_small" class="rounded-circle border border-2 border-secondary float-lg-end" style="width:50px;" />
                            <i id="person" class="bi bi-person pe-none mx-2 fs-4 pe-none"></i>
                            <span id="zibla"></span>
                        </div>`
    constructor() { }
    start_action(data, tag , small_tag) {
        this.data = data;
        this.data.uid = "IC_" + Math.round(Math.random() * 1000);     
        (new TemplateRenderer(data, tag, "~/Scripts/Components/ReUse/Icon/Icon.html", null, false, true).start_action()).
            then(value => {
                //$("body").append($("#icon_" + this.data.uid).html())
                $(small_tag).html(Icon.small_icon);
                $("#img_small").hide();
                setTimeout(() => this.SetUserDetails(), 2000);
            });
    }
    async show_user_details(e) {
        let user_details = await $.ajax({ url: config.contextPath + "Home/GetUserDetails" });
        if (!user_details) {
            LogIn.ShowLoginDialog(this.AfterLogin);
            return;
        }
        else this.AfterLogin(user_details)
    }
    SetUserDetails() {
        if (!BasicAction.user) return;
        $("." + this.data.uid).text("Welcome to the Grand child Component")
        $("#user_img").attr({ "src": BasicAction.user.imgSRC });
        $("#user_name").text(BasicAction.user.name);
        $("#zibla").text(BasicAction.user.name);
        $("#user_mail").text(BasicAction.user.mail);
        $("#img_profile").html(Icon.profile_img.replace(/_SRC_/g, BasicAction.user.imgSRC));
        $("#img_small").attr({ "src": BasicAction.user.imgSRC });
        $("#img_small").show();
        $("#person").hide();
    }
    AfterLogin(user_details) {
        if (!BasicAction.user) return;
        let options = {}; options.focus = true; options.keyboard = true;
        let id = "user_details_" + this.data.uid ;
        if (Icon.myModal === null) Icon.myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById(id), options);
        Icon.myModal.show();
        //$("#user_details").modal('show');
    }
}