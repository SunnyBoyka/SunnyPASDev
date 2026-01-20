var ScanStatus = {
    start_action: function (tag, data) {
        return new TemplateRenderer(data, tag, "~/Scripts/Components/ScanStatus/ScanStatus.html", null, false, true).start_action().then(async (jData) => {
            await ScanStatus.LoadData();
            return "Done from Command";
        });
    },

    LoadData: function () {
        //debugger;
        $("#commandStatus").text("Loading...").removeClass('text-bg-danger text-bg-success').addClass('text-bg-info');

        return $.ajax({
            url: config.contextPath + 'home/GetNmapScans',
            type: 'GET',
            success: function (jData) {
                try {
                    console.log(jData);
                    let scanStatus = jData;
                   // ScanStatus.original_data = JSON.parse(JSON.stringify(commands));
                    //alert(JSON.stringify(scanStatus));

                    ScanStatus.RenderCommandTable(scanStatus);

                    $("#commandStatus").text("Loaded successfully").removeClass('text-bg-info').addClass('text-bg-success');
                    setTimeout(() => $("#commandStatus").text(""), 2000);
                } catch (error) {
                    console.error('Error parsing command data:', error);
                    $("#commandStatus").text("Error loading commands").removeClass('text-bg-info').addClass('text-bg-danger');
                }
            },
            error: function (xhr, status, error) {
                console.error('Error occurred when trying to load commands:', error);
                $("#commandStatus").text("Failed to load commands").removeClass('text-bg-info').addClass('text-bg-danger');
            }
        });
    },


    RenderCommandTable: function (commands) {
        //debugger;

        const tbody = document.getElementById("scanstatusTableBody");

        // If table is EMPTY → clear and create fresh rows
        if (tbody.children.length === 0) {
            tbody.innerHTML = ""; // optional clear
        }

        // Append rows
        commands.forEach(cmd => {
            const rowHtml = `
            <tr>
                <td class="align-middle">
                    <span class="fs-small fw-bold">${cmd.id}</span>
                </td>
                <td class="align-middle">
                    <span class="fs-small fw-bold">${cmd.scanType}</span>
                </td>
                <td class="align-middle">
                    <span class="fs-small fw-bold">${cmd.command}</span>
                </td>
                <td class="align-middle">
                    <span class="fs-small fw-bold">${cmd.createdAt}</span>
                </td>
                <td class="align-middle">
                    <span class="fs-small fw-bold">${cmd.completedAt}</span>
                </td>
                <td class="align-middle">
            <span class="fs-small fw-bold ${ScanStatus.getStatusClass(cmd.scanStatus)}">
                ${cmd.scanStatus.trim()}
            </span>
        </td>
                <td class="align-middle">
                    <span class="fs-small fw-bold">${cmd.scanResult}</span>
                </td>
            </tr>
        `;

            tbody.insertAdjacentHTML("beforeend", rowHtml);
        });

       
    },
    getStatusClass: function (status) {
        status = status.trim().toLowerCase();

        if (status === "Failed") return "status-failed";
        if (status === "Pending") return "status-pending";
        if (status === "Completed") return "status-completed";

        return "";
    },
}
