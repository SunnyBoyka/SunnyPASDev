var Alertify = {
    myModal: null,
    callback: null,
    data: null,
    action:false,
    start_action: function (data,tag) {
       return new TemplateRenderer(data, tag, "~/Scripts/Components/ReUse/Alertify/Alertify.html", null, false, false).start_action().then(jD => "From Alertify");
    },
    ShowAlertDialog: function (data, callback) {
        Alertify.data = data;
        Alertify.callback = callback;
        let options = {}; options.focus = true; options.keyboard = true;
        if (Alertify.myModal === null) {
            let element = document.getElementById('Alertify');
            Alertify.myModal = new bootstrap.Modal(element, options);
            element.addEventListener('hidden.bs.modal', evt => { if (Alertify.callback) Alertify.callback(Alertify.action); })
        }
        Alertify.myModal.show(Alertify.myModal, 3000);
        $("#title").html(Alertify.data.title);
        $("#our_body").html(Alertify.data.body);
        if (Alertify.data.foot_note) $("#footer").html(Alertify.data.foot_note);        
        if (Alertify.data.buttons) Alertify.data.buttons.forEach((but_info, i) => $("#but_" + i).html(but_info));
    },
    Click_button: function (e, action) {
        $("#but_0").html("Cancel"); $("#but_1").html("Ok");
        $("#title").html("The Title");
        $("#our_body").html("Our Body");
        $("#footer").html("Welcome to V<sub>&</sub>V Automation Platform");
        Alertify.action = action;
        Alertify.myModal.hide(Alertify.myModal);        
    },
};
/*
Sample usage
Alertify.ShowAlertDialog({
                "title": "This is a serious matter",
                "body": "Are you sure <br/> a 100% sure you want to delete your answer<h3> We won't ask again and agaian</h3>",
                "buttons": ["Ok Fine I got it", "Yes I want to delete"],
                "foot_note" : "Welcome to V<sub>&</sub>V Overflow"
            },async(action) => {
                    if (!action) return;
                    . . . your code  if action is true, remove asunc if you r not awaitng . . . . 
           });
*/
