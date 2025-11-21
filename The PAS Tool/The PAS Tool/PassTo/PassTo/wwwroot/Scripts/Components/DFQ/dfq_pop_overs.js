var dfq_pop_overs = {
    __proto__: dfq_dummy_response,
    makePopOversAndHandlePopOverShowEvent: function () {
        dfq.pop_overs.forEach(pop_up_struct => {
            if ($(pop_up_struct.id).length <= 0) return;
            new bootstrap.Popover(pop_up_struct.id, {
                trigger: 'hover',
                html: true,
                title: "<img src='" + config.contextPath + "Content/Images/rs.png' class='img-small' /> What does it mean",
                content: pop_up_struct.content ? pop_up_struct.content + "<hr/>": "<img src='https://i.pinimg.com/236x/5d/a3/f5/5da3f5a126b2180360911ac27e7d5f02.jpg' class='img-small' /><br/>" + $(pop_up_struct.id).attr("data-bs-content"),
                //content: pop_up_struct.content ? "<img src='/Content/Images/rs.png' class='d-inline' />" + pop_up_struct.content : "<img src='/Content/Images/rs.png' class='img-small' /><hr/>" + $(pop_up_struct.id).attr("data-bs-content"),
            })
            if (pop_up_struct.sub_pop_up_legacy === undefined || pop_up_struct.sub_pop_up_non_legacy === undefined) return;
            document.getElementById(pop_up_struct.id.split('#')[1]).addEventListener('shown.bs.popover', function () {

                $(pop_up_struct.sub_pop_up_legacy).show(); $(pop_up_struct.sub_pop_up_non_legacy).show();
                if (dfq.cur_project === null) return;
                switch (dfq.cur_project.is_legacy) {
                    case 1: $(pop_up_struct.sub_pop_up_legacy).hide(); break;
                    case 0: $(pop_up_struct.sub_pop_up_non_legacy).hide(); break;
                }
            });
        });
    }
}