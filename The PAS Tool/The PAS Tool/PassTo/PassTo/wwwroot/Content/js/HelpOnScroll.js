/*
  let TheAnimAray_AllQuestions = [
                {
                    jid: "#allQ_table",
                    remove: "animate__lightSpeedOutLeft",
                    add: "animate__lightSpeedInLeft"
                },
                {
                    jid: "#allQ",
                    remove: "animate__lightSpeedOutRight",
                    add: "animate__lightSpeedInRight"
                },
                {
                    jid: "#info_allQuestion",
                    remove: "animate__backOutLeft",
                    add: "animate__backInLeft"
                }
            ]
           this.start_action("AllQuestions", TheAnimAray_AllQuestions);
            //where 'AllQuestions' is the id of a div
*/
class HelpOnScroll {
    constructor() {
        this.ElementIDvsWayPoint = {};
        this.AnimationObject = {};
        this.Direction = {};
        Waypoint.destroyAll();
    }
    start_action(mainId, animArray) {
        let that = this;
        this.ElementIDvsWayPoint[mainId] = new Waypoint({
            element: document.getElementById(mainId),
            offset: '70%',
            handler: function (direction) {
                let jele = null;
                if (direction === "down") {
                    animArray.forEach(anim => {
                        jele = $(anim.jid);
                        jele.css({ "visibility": "visible" });
                        jele.removeClass(anim.remove).addClass(anim.add);
                        that.Direction[anim.jid] = "Labamba";
                    })
                }
                else {
                    animArray.forEach(anim => {
                        jele = $(anim.jid);
                        if (anim.add == anim.remove) jele.removeClass(anim.add);
                        else jele.removeClass(anim.add).addClass(anim.remove);
                        that.Direction[anim.jid] = "up";
                        setTimeout(() => jele.css({ "visibility": "hidden" }), 2000);
                    })
                }
                //animArray.forEach(anim => {
                //    if (that.AnimationObject[anim.jid]) return;
                //    jele = $(anim.jid);
                //   that.AnimationObject[anim.jid] = true; //The below ternary(?:) operator is just for shortening the code, full overaction nothing else
                //    //jele[0].addEventListener("animationend", e => (that.Direction[anim.jid] === "up") ? $(e.target).css({ "visibility": "hidden" }) : false);
                //    jele.bind("animationend", e => {
                //        if (that.Direction[anim.jid] === "up") $(e.target).css({ "visibility": "hidden" })
                //    })
                //});
            }
        });
    }
}