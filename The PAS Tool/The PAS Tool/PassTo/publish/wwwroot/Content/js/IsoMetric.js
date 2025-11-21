/*
    Posted in StackOverflow : https://stackoverflow.com/questions/64241431/web-animation-library-for-code-editor-animation/72484383#72484383
    License : MIT, do what ever you want with my code.
*/
class IsoMetric {
    // 1: ZoomOutMoveInAndZoomIn, 2: FadeOffAppearAndFadeIn, 3: ImplodeExplode, 4: Rotation, 5: JustMove, 6: ExpandFadeMoveInAndZoomBack, 7: ScaleInScaleOut
    // 8: RotationY
    constructor(item_container, item_identifier, animationOption) {
        this.animationOption = animationOption ? animationOption : 1;
        this.jItemsContainer = $(item_container);
        this.leftCont = this.jItemsContainer.position().left;
        this.topCont = this.jItemsContainer.position().top;
        this.wdCont = parseFloat(this.jItemsContainer.width());
        this.htCont = parseFloat(this.jItemsContainer.height());
        this.eleJArray = $(item_identifier);
        this.eleArray = this.eleJArray.toArray();
        this.allPositions = [];
        let that = this;
        $.each(this.eleJArray, function (index, ele) {
            let $ele = $(ele);
            let pos = $ele.position();
            let onePos = {
                "x": parseFloat(pos.left.toFixed(2)) + "px", "y": parseFloat(pos.top.toFixed(2)) + "px",
                "w": parseFloat($ele.width().toFixed(2)), "h": parseFloat($ele.height().toFixed(2)),
                "scale": 1
            };
            that.allPositions.push(onePos);
            $ele.attr(onePos);
            let par = $ele;
            //while (true) { //I restore width of all parents leading up to the container.
            //    par = $(par).parent();
            //    if (par[0] === that.jItemsContainer[0]) break;
            //    $(par).css({ "width": $(par).width(), "height": $(par).height() });
            //}
        });
        $.each(this.eleJArray, function (index, ele) {
            let $ele = $(ele);
            $ele.css({ "position": "absolute", "left": $ele.attr("x"), "top": $ele.attr("y"), "transform": "rotate(0deg) scale(1)" });
        });
        this.jItemsContainer.css({ "width": this.wdCont + "px", "height": this.htCont + "px" });
    }
    Filter(e, selector) {
        switch (this.animationOption) {
            case 1:
                this.ZoomOutMoveInAndZoomIn(e, selector);
                break;
            case 2:
                this.FadeOffAppearAndFadeIn(e, selector);
                break;
            case 3:
                this.ImplodeExplode(e, selector);
                break;
            case 4:
                this.Rotation(e, selector);
                break;
            case 5:
                this.JustMove(e, selector);
                break;
            case 6:
                this.ExpandFadeMoveInAndZoomBack(e, selector);
                break;
            case 7:
                this.ScaleInScaleOut(e, selector);
                break;
            case 8:
                this.RotationY(e, selector);
                break;
        }
    }
    SetAnimation(option) {
        this.animationOption = option;
        let that = this;
        $.each(this.eleJArray, function (index, ele) {
            let $ele = $(ele);
            $ele.css({
                transform: "rotate(0deg) scale(1)", opacity: 1,
                left: that.allPositions[index].x, top: that.allPositions[index].y,
                width: that.allPositions[index].w, height: that.allPositions[index].h,
            });
            $ele.attr({ "scale": "1" });
        });
    }
    ZoomOutMoveInAndZoomIn(e, selector) {
        let boneEle = $(selector);
        let that = this;
        $.each(this.eleJArray, function (index, bEle) {
            $(bEle).animate({
                "width": 0,
                "height": 0,
                "left": parseFloat($(bEle).position().left) + parseFloat($(bEle).attr("w") / 2),
                "top": parseFloat($(bEle).position().top) + parseFloat($(bEle).attr("h") / 2),
                //"opacity": 0,
            }, 200, function () {
                //$(bEle).css({ "opacity": 0 });
                //$(bEle).css({ "display": "none" });
            });
        });
        $.each(boneEle, function (index, bEle) {
            //$(bEle).css({ "display": "block" });
            $(bEle).animate({
                "left": that.allPositions[index].x,
                "top": that.allPositions[index].y,
                "width": $(bEle).attr("w"),
                "height": $(bEle).attr("h"),
                //"opacity": 1
            }, 500);
        });
    }
    FadeOffAppearAndFadeIn(e, selector) {
        let boneEle = $(selector);
        let that = this;
        $.each(this.eleJArray, function (index, bEle) {
            $(bEle).animate({ "opacity": 0, }, 2000, function () {
                $(bEle).css({ "width": 0, "height": 0 });
            });
        });
        $(":animated").promise().done(function () {
            //code here
            $.each(boneEle, function (index, bEle) {
                $(bEle).css({
                    "left": that.allPositions[index].x,
                    "top": that.allPositions[index].y,
                    "width": that.allPositions[index].w,
                    "height": that.allPositions[index].h
                });
                $(bEle).animate({
                    "opacity": 1
                }, 2000);
            });
        });
    }
    ImplodeExplode(e, selector) {
        let boneEle = $(selector);
        let that = this;
        let Cx = that.leftCont + (that.wdCont / 2); let Cy = that.topCont + (that.htCont / 2);
        $.each(this.eleJArray, function (index, bEle) {
            $(bEle).animate({
                "left": Cx, //that.allPositions[index].x,
                "top": Cy, //that.allPositions[index].y,
                "width": 0,
                "height": 0,
            }, 100);
        });
        $(":animated").promise().done(function () {
            //code here
            $.each(boneEle, function (index, bEle) {
                $(bEle).animate({
                    "left": that.allPositions[index].x,
                    "top": that.allPositions[index].y,
                    "width": $(bEle).attr("w"),
                    "height": $(bEle).attr("h"),
                    "opacity": 1
                }, 400);
            });
        });
    }
    Rotation(e, selector) {
        let boneEle = $(selector);
        let that = this; let count = 0; let sAngle = 0; let endEngle = 360 * 5;
        $.each(this.eleJArray, function (index, bEle) {
            $({
                deg: sAngle, w: $(bEle).width(), h: $(bEle).height(),
                l: parseFloat($(bEle).position().left),
                t: parseFloat($(bEle).position().top),
                o: 1
            }).animate({
                deg: endEngle, w: 0, h: 0,
                l: parseFloat($(bEle).position().left) + parseFloat($(bEle).attr("w") / 2),
                t: parseFloat($(bEle).position().top) + parseFloat($(bEle).attr("h") / 2),
                o: 0
            }, {
                duration: 2000,
                index: index,
                step: function () {
                    // in the step-callback (that is fired each step of the animation),
                    // you can use the `now` paramter which contains the current
                    // animation-position (`0` up to `angle`)
                    //let xx = parseFloat($(bEle).position().left) + parseFloat($(bEle).attr("w") / 2) + "px";
                    $(bEle).css({
                        transform: 'rotate(' + this.deg + 'deg)',
                        left: this.l,
                        top: this.t,
                        width: this.w,
                        height: this.h,
                        opacity: this.o
                    });
                },
                complete: function () {
                    //alert("sasa");
                    //$(bEle).css({ "opacity": 0 });
                    ++count;
                }
            });
        });

        function TheTheFinalAct() {
            $.each(boneEle, function (index, bEle) {
                $(bEle).css({
                    left: that.allPositions[index].x,
                    top: that.allPositions[index].y,
                });
                $({
                    deg: endEngle, w: 0, h: 0,
                    l: parseFloat($(bEle).position().left),
                    t: parseFloat($(bEle).position().top),
                    o: 0,
                }).animate({
                    deg: sAngle,
                    w: that.allPositions[index].w, h: that.allPositions[index].h,
                    l: that.allPositions[index].x,
                    t: that.allPositions[index].y,
                    o: 1
                }, {
                    duration: 1000,
                    index: index,
                    step: function () {
                        // in the step-callback (that is fired each step of the animation),
                        // you can use the `now` paramter which contains the current
                        // animation-position (`0` up to `angle`)
                        //let xx = parseFloat($(bEle).position().left) + parseFloat($(bEle).attr("w") / 2) + "px";
                        $(bEle).css({
                            transform: 'rotate(' + this.deg + 'deg)',
                            width: this.w,
                            height: this.h,
                            //left: this.l,
                            //top: this.t,
                            opacity: this.o
                        });
                    }
                });
            });
        }
        //$(this.eleJArray).promise().done(function () {
        //    TheTheFinalAct();
        //});
        function WaitForAllAnimationsToBeOver() {
            setTimeout(() => {
                if (count >= that.eleArray.length) TheTheFinalAct();
                else WaitForAllAnimationsToBeOver();
            }, 500);
        }
        WaitForAllAnimationsToBeOver();
    }
    RotationY(e, selector) {
        let boneEle = $(selector);
        let that = this; let count = 0; let startAngle = 0; let endAngle = 360 * 5;
        $.each(this.eleJArray, function (index, bEle) {
            $({
                deg: startAngle, w: $(bEle).width(), h: $(bEle).height(),
                l: parseFloat($(bEle).position().left),
                t: parseFloat($(bEle).position().top),
                o: 1
            }).animate({
                deg: endAngle, w: 0, h: 0,
                l: parseFloat($(bEle).position().left) + parseFloat($(bEle).attr("w") / 2),
                t: parseFloat($(bEle).position().top) + parseFloat($(bEle).attr("h") / 2),
                o: 0
            }, {
                duration: 2000,
                index: index,
                step: function () {
                    // in the step-callback (that is fired each step of the animation),
                    // you can use the `now` paramter which contains the current
                    // animation-position (`0` up to `angle`)
                    //let xx = parseFloat($(bEle).position().left) + parseFloat($(bEle).attr("w") / 2) + "px";
                    $(bEle).css({
                        transform: 'rotateY(' + this.deg + 'deg)',
                        //left: this.l,
                        //top: this.t,
                        //width: this.w,
                        //height: this.h,
                        opacity: this.o
                    });
                },
                complete: function () {
                    ++count;
                }
            });
        });

        function TheTheFinalAct() {
            $.each(boneEle, function (index, bEle) {
                $(bEle).css({
                    left: that.allPositions[index].x,
                    top: that.allPositions[index].y,
                });
                $({
                    deg: endAngle,
                    w: 0, h: 0,
                    l: parseFloat($(bEle).position().left),
                    t: parseFloat($(bEle).position().top),
                    o: 0,
                }).animate({
                    deg: startAngle,
                    w: that.allPositions[index].w, h: that.allPositions[index].h,
                    l: that.allPositions[index].x, t: that.allPositions[index].y,
                    o: 1
                }, {
                    duration: 1000,
                    index: index,
                    step: function () {
                        $(bEle).css({
                            transform: 'rotateY(' + this.deg + 'deg)',
                            //width: this.w,//height: this.h,//left: this.l,//top: this.t,
                            opacity: this.o
                        });
                    }
                });
            });
        }
        function WaitForAllAnimationsToBeOver() {
            setTimeout(() => {
                if (count >= that.eleArray.length) TheTheFinalAct();
                else WaitForAllAnimationsToBeOver();
            }, 500);
        }
        WaitForAllAnimationsToBeOver();
    }
    JustMove(e, selector) {
        let boneEle = $(selector);
        let that = this;
        $.each(this.eleJArray, function (index, bEle) {
            $(bEle).animate({
                //"left": (that.leftCont + that.wdCont / 2) - that.allPositions[index].w / 2,
                //"top": (that.topCont + that.htCont / 2) - that.allPositions[index].h / 2,
                "left": -that.leftCont - that.wdCont,
            }, 200, function () {
                $(bEle).css({ "opacity": 0 });
            });
        });
        $.each(boneEle, function (index, bEle) {
            $(bEle).css({ "top": that.allPositions[index].y })
            $(bEle).animate({
                "left": that.allPositions[index].x,
                //"top": that.allPositions[index].y,
                "opacity": 1
            }, 200);
        });
    }
    ExpandFadeMoveInAndZoomBack(e, selector) {
        let boneEle = $(selector);
        let that = this; let count = 0;
        $.each(this.eleJArray, function (index, bEle) {
            $({ scale: 1, o: 1 }).animate({ scale: 10, o: 0 },
                {
                    duration: 1000,
                    index: index,
                    step: function () {
                        // in the step-callback (that is fired each step of the animation),
                        // you can use the `now` paramter which contains the current
                        // animation-position (`0` up to `angle`)
                        //let xx = parseFloat($(bEle).position().left) + parseFloat($(bEle).attr("w") / 2) + "px";
                        $(bEle).css({
                            transform: 'scale(' + this.scale + ')',
                            opacity: this.o
                        });
                    },
                    complete: function () {
                        //alert("sasa");
                        ++count;
                        $(bEle).css({ "width": 0, "height": 0, "opacity": 0 });
                    }
                });
        });
        function TheTheFinalAct() {
            $.each(boneEle, function (index, bEle) {
                $({
                    scale: 10, w: 0, h: 0, o: 0,
                    //scale: 10, o: 0,
                    l: parseFloat($(bEle).position().left), t: parseFloat($(bEle).position().top),
                }).animate({
                    scale: 1, w: that.allPositions[index].w, h: that.allPositions[index].h, o: 1,
                    l: that.allPositions[index].x, t: that.allPositions[index].y,
                }, {
                    duration: 1000,
                    index: index,
                    step: function () {
                        $(bEle).css({
                            transform: 'scale(' + this.scale + ')',
                            left: this.l,
                            top: this.t,
                            width: this.w,
                            height: this.h,
                            opacity: this.o
                        });
                    }
                });
            });
        }
        function WaitForAllAnimationsToBeOver() {
            setTimeout(() => {
                if (count >= that.eleArray.length) TheTheFinalAct();
                else WaitForAllAnimationsToBeOver();
            }, 500);
        }
        WaitForAllAnimationsToBeOver();
    }
    ScaleInScaleOut(e, selector) {
        let boneEle = $(selector);
        let that = this; let count = 0;
        $.each(this.eleJArray, function (index, bEle) {
            $({ scale: 1 }).animate({ scale: 0 },
                {
                    duration: 500,
                    index: index,
                    step: function () {
                        if (parseInt($(bEle).attr("scale")) !== 0) $(bEle).css({ transform: 'scale(' + this.scale + ')' });
                    },
                    complete: function () {
                        ++count;
                        $(bEle).attr({ "scale": 0 });
                    }
                });
        });
        function TheTheFinalAct() {
            $.each(boneEle, function (index, bEle) {
                $(bEle).attr({ "scale": 1 })
                $({
                    scale: 0,
                    l: parseFloat($(bEle).position().left), t: parseFloat($(bEle).position().top),
                }).animate({
                    scale: 1,
                    l: that.allPositions[index].x, t: that.allPositions[index].y,
                }, {
                    duration: 1000,
                    index: index,
                    step: function () {
                        $(bEle).css({
                            transform: 'scale(' + this.scale + ')',
                            left: this.l,
                            top: this.t,
                        });
                    }
                });
            });
        }
        function WaitForAllAnimationsToBeOver() {
            setTimeout(() => {
                if (count >= that.eleArray.length) TheTheFinalAct();
                else WaitForAllAnimationsToBeOver();
            }, 500);
        }
        WaitForAllAnimationsToBeOver();
    }
    Sort(e, attrib, isAsc) {
        let that = this;
        //if (!this.eleArrAsc) {
        this.eleArrAsc =
        this.eleArray.sort(function (a, b) {
            let lhs = parseInt($(a).attr(attrib));
            let rhs = parseInt($(b).attr(attrib));
            return isAsc ? lhs - rhs : rhs - lhs;
        });
        $.each(this.eleArrAsc, function (index, bEle) {
            $(bEle).animate({
                "left": that.allPositions[index].x,
                "top": that.allPositions[index].y,
            }, 200);
        });
    }
}