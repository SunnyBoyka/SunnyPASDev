var Projects = {
    start_action: function (tag, data) {
        return new TemplateRenderer(data, tag, "~/Scripts/Components/Projects/Projects.html", null, false).start_action().
            then(async (jData) => {
                Projects.ShowTheOnlyProject();
                return "Done from Projects";
            });
    },
    GetTheOnlyProject: function () {
        //return Promise.resolve(false);        
        //return new Promise((resolve, reject) => {
        //    return resolve({ "id": 54, "project_name": "Draupadi", "project_id": "The Celestial Angles", "single_or_double": false });
        //});
       return $.majax({ url: config.contextPath + 'Home/GetTheOnlyProject' }).then(jData => {
            if (!jData) return false;
            let projectsDetailsArray = JSON.parse(jData);
            if (projectsDetailsArray.length <= 0) return false;
            return projectsDetailsArray[0];
        });
    },
    ShowTheOnlyProject: function () {
        Projects.GetTheOnlyProject().then(projectsDetails => {
            if (!projectsDetails) return;
            $("#add_project").remove();
            BasicAction.project = projectsDetails;
            $("#project_id").val(projectsDetails.project_id);
            $("#project_name").val(projectsDetails.project_name);
            if (projectsDetails.single_or_double) {
                $("#pkiSingle").prop('checked', true).attr("disabled", "true");
                $("#pkiDual").attr("disabled", "true");
            }
            else {
                $("#pkiDual").prop('checked', true).attr("disabled", "true");
                $("#pkiSingle").attr("disabled", "true");
            }
        });
    },
    AddProjectClick: function () {
        let project_name = $("#project_name").val();
        let project_id = $("#project_id").val();
        let pki_setup = $("input[name='pkiSetUp']:checked").val();
        if (!project_name) {
            alert("Please enter the project name");
            return;
        }
        let project_data = JSON.stringify({
            project_name: project_name,
            project_id: project_id,
            pki_setup: pki_setup
        });
        $.majax({
            url: config.contextPath + 'Home/AddTheProject',
            method: 'GET', 
            contentType: 'application/json',
            data: { project_data: project_data },
        }).then(jData => {
            if (jData === "Done") {
                alert("Project added successfully");
                Projects.ShowTheOnlyProject();
            } else {
                alert("Error: " + jData);
            }
        }).catch(error => {
            alert("An error occurred: " + error.statusText);
        });
    },
    //AddProjectClick: function () {
    //    let project_name = $("#project_name").val();
    //    let project_id = $("#project_id").val();

    //    var project_data = {
    //        project_name: project_name,
    //        project_id: project_id
    //    };
    //    if (!project_name) {
    //        alert("Please enter the project name");
    //        return;
    //    }
    //    $.majax({
    //        url: config.contextPath + 'Home/AddTheProject',
    //       // method: 'GET',
    //        //data: { project_name: project_name, project_id: project_id }
    //        contentType: 'application/json',
    //        data: JSON.stringify(project_data),
    //    }).then(jData => {
    //        //alert(jData);
    //        if (jData == "Done") {
    //            alert("Project added successfully");
    //            Projects.ShowTheOnlyProject();
    //        }
    //    });
    //},
    UpdateProjectClick: function () {
        let project_id = $("#project_id").val();
        let project_name = $("#project_name").val();
        if (!project_name) {
            alert("Please enter the project name");
            return;
        }
        let project_data = JSON.stringify({
            project_name: project_name,
            project_id: project_id,
        });
        $.majax({
            url: config.contextPath + 'Home/UpdateTheProject',
            data: { project_data: project_data },
        }).then(jData => {
            if (jData == "Done") {
                alert("Project edited successfully");
                Projects.ShowTheOnlyProject();
            }
        });
    }
}