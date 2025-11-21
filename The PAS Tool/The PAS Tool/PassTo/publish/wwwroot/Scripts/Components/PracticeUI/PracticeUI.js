var PracticeUI = {
    pageNumber: 1,
    maxPage: 0,

    start_action: function (tag, data) {

         //PracticeUI.CountFilmsByPenelope();
         //PracticeUI.GetFilmsByPenelopePagination_Table();
     
        return new TemplateRenderer(data, tag, "~/Scripts/Components/PracticeUI/PracticeUI.html", null, false, true).start_action();
    },
    Create_Ajax_Table: function (e) {
        // alert("Ajax_Table");

        $.ajax({
            url: config.contextPath + "home/GetActorsByName",
            type: "GET",
            dataType: "json",
            success: function (empArray) {
                var table = $.makeTable(empArray);
                $("#btn_ajax_table_gen").empty().append(table);
            },
            error: function (xhr, status, error) {
                console.error("Error:", status, error);
                alert("Failed to load employees. Check console.");
            }
        });

    },
    click_ActorByNameButton(e) {
       // alert("Labamba");
        $.ajax({
            url: config.contextPath + "home/GetActorsByFirstAndLastName",
            data: { "firstName": "Penelope", "lastName": "Cronyn" },
            type: "GET",
             dataType: "json",
            success: function (empArray) {
                //alert(typeof empArray);
                var table = $.makeTable(empArray);
                $("#btn_actor_by_name").empty().append(table);
            },
            error: function (xhr, status, error) {
                console.error("Error:", status, error);
                alert("Failed to load employees. Check console.");
            }
        });
        //.then(jData => {
        //        alert(typeof jData);
        //        const data = JSON.stringify(jData);
        //        alert(data);
        //        //alert(JSON.parse(jData));
        //        var table = $.makeTable(data);
        //    $("#btn_actor_by_name").empty().append(table);
        //}).fail((a, b) => {
        //    alert(JSON.stringify(a, null, ' ') + "\n" + "b :" + b);
        //});    
    },
    GetFilmsByPenelopeCronyn_Table: function (e) {

        $.ajax({
            url: config.contextPath + "home/GetFilmsByPenelopeCronyn",
            type: "GET",
            dataType: "json",
            success: function (empArray) {
                var table = $.makeTable(empArray);
                $("#btn_GetFilmsByPenelopeCronyn").empty().append(table);
            },
            error: function (xhr, status, error) {
                console.error("Error:", status, error);
                alert("Failed to load GetFilmsByPenelopeCronyn. Check console.");
            }
        });
    },
    GetFilmsByPenelope_Table: function (e) {
        $.ajax({
            url: config.contextPath + "home/GetFilmsByPenelope",
            type: "GET",
            dataType: "json",
            success: function (empArray) {
                var table = $.makeTable(empArray);
                $("#btn_GetFilmsByPenelope").empty().append(table);
            },
            error: function (xhr, status, error) {
                console.error("Error:", status, error);
                alert("Failed to load GetFilmsByPenelope. Check console.");
            }
        });
    },
    GetFilmsByPenelopePagination_Table: function (e) {
        $.ajax({
            url: config.contextPath + "home/GetFilmsByPenelopePagination",
            data: { "pageNumber": this.pageNumber },
            type: "GET",
            dataType: "json",
            success: async function (empArray) {
                var table = $.makeTable(empArray);
                await $("#btn_GetFilmsByPenelope_Pagination").empty().append(table);
                PracticeUI.updatePagerState();
            },
            error: function (xhr, status, error) {
                console.error("Error:", status, error);
                alert("Failed to load GetFilmsByPenelopePagination. Check console.");
            }
        });
    },
    CountFilmsByPenelope: function (e) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: config.contextPath + "home/GetMaxPageCountFilmsByPenelope",
                type: "GET",
                dataType: "json",
                success: function (data) {
                    PracticeUI.maxPage = Number(data) || 0;
                    resolve(PracticeUI.maxPage);
                },
                error: function (xhr, status, error) {
                    console.error("Error:", status, error);
                    alert("Failed to load CountFilmsByPenelope. Check console.");
                    reject(error);
                }
            });
        });
    },
    Btn_Next: async function (e) {
        //++this.pageNumber;
        //PracticeUI.GetFilmsByPenelopePagination_Table();

        if (!PracticeUI.maxPage || PracticeUI.maxPage < 1) {
            await PracticeUI.CountFilmsByPenelope();
        }

        if (PracticeUI.pageNumber < PracticeUI.maxPage) {
            ++PracticeUI.pageNumber;
            PracticeUI.GetFilmsByPenelopePagination_Table();
        }

        PracticeUI.updatePagerState();
    },
    Btn_Prev: async function (e) {
        //--this.pageNumber;
        //PracticeUI.GetFilmsByPenelopePagination_Table();
        if (PracticeUI.pageNumber > 1) {
            --PracticeUI.pageNumber;
            PracticeUI.GetFilmsByPenelopePagination_Table();
        }

        PracticeUI.updatePagerState();
    },
    updatePagerState: function () {
        const prevDisabled = PracticeUI.pageNumber <= 1;
        const nextDisabled = PracticeUI.maxPage && PracticeUI.pageNumber >= PracticeUI.maxPage;

        $("#btnPrev").prop("disabled", prevDisabled);
        $("#btnNext").prop("disabled", nextDisabled);
    }
}
