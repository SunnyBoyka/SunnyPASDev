var NMapCommand = {
    pageNumber: 1,
    maxPage: 0,

    original_data: [], // Store original data to track changes

    header_mapping: {
        checkbox: "",
        command: "Command Name",
        //run_command: "Run Command",
        info: '<i class="bi bi-clock"></i> Info'
    },

    start_action: function (tag, data) {
        return new TemplateRenderer(data, tag, "~/Scripts/Components/NMapCommand/NMapCommand.html", null, false, true)
            .start_action()
            .then(async (jData) => {
                //await NMapCommand.LoadAllCommands();
                //NMapCommand.GetCommands();
               // NMapCommand.GenerateComm();
                return "Done from Command";
            });
    },
    addCommandToTable: function (command) {
        const commandInput = document.getElementById('commandInput').value;
        document.getElementById('commandInput').value = "";
        if (!commandInput) {
            alert('Please enter command.');
            return;
        }

        // Split commands by comma and trim whitespace
        const commandList = commandInput
            .split(',')
            .map((cmd, index) => ({
                id: index + 1,
                command_name: cmd.trim()
            }))
            .filter(item => item.command_name.length > 0);

        // ✅ Close modal after adding
        let modal = bootstrap.Modal.getInstance(document.getElementById('commandModal'));
        modal.hide();
        NMapCommand.RenderCommandTable(commandList);


    },
    LoadAllCommands: function () {
        $("#commandStatus").text("Loading...").removeClass('text-bg-danger text-bg-success').addClass('text-bg-info');

        return $.ajax({
            url: config.contextPath + 'home/GetAllNMapCommands',
            type: 'GET',
            success: function (jData) {
                try {
                    let commands = JSON.parse(jData);
                    NMapCommand.original_data = JSON.parse(JSON.stringify(commands));
                    //alert(JSON.stringify(commands));

                    NMapCommand.RenderCommandTable(commands);

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

        if (!commands || commands.length === 0) {
            $("#CommandTable").html('<div class="alert alert-info">No commands found</div>');
            return;
        }

        //var ipAddress = $('#ipaddress_con').val();
        //let tableHtml = `
        //    <table class="table table-striped table-hover table-bordered">
        //        <thead class="table-dark">
        //            <tr>
        //                <th style="width: 80px;">${NMapCommand.header_mapping.checkbox}</th>
        //                <th>${NMapCommand.header_mapping.command}</th>
        //               <!-- <th style="width: 200px;">${NMapCommand.header_mapping.run_command}</th>-->
        //                <!--<th>${NMapCommand.header_mapping.info}</th>-->
        //            </tr>
        //        </thead>
        //        <tbody>
        //`;

        //commands.forEach(function (row) {
        //    debugger;
        //    let checked = row.run_command === true || row.run_command === 'true' || row.run_command === 1 || row.run_command === '1' ? 'checked' : '';
        //    let labelText = checked ? 'Enabled' : 'Disabled';
        //    let lastUpdate = row.last_update ? moment(row.last_update).format('ddd, MMM DD, YYYY HH:mm') : 'Never';

        //    tableHtml += `
        //        <tr>
        //            <td class="text-center align-middle">
        //                <div class="form-check">
        //                    <input class="form-check-input command-checkbox"
        //                           type="checkbox"
        //                           ${checked}
        //                           data-id="${row.id}"
        //                           id="cmd_${row.id}"
        //                           style="cursor: pointer;">
        //                    <!--<label class="form-check-label" for="cmd_${row.id}" style="cursor: pointer;">
        //                        //${labelText}
        //                    </label>-->
        //                </div>
        //            </td>
        //            <td class="align-middle">
        //                <span class="fs-small fw-bold">${row.command_name || ''}</span>
        //            </td>
        //            <!--<td class="align-middle">
        //                <span class="fs-small fw-bold">${row.description || ''}</span>
        //            </td>-->
        //            <!--<td class="text-center align-middle">
        //                <button class="btn btn-outline-info btn-sm" onclick="NMapCommand.ShowCommandInfo(event)"
        //                        data-command='${JSON.stringify(row).replace(/'/g, "&apos;")}'>
        //                    <i class="bi bi-info-circle" style="pointer-events:none;"></i>Info
        //                </button>
        //            </td>-->
        //        </tr>
        //    `;
        //});

        //tableHtml += `
        //        </tbody>
        //    </table>
        //`;

        //$("#CommandTable").html(tableHtml);

        const tbody = document.getElementById("commandTableBody");

        // If table is EMPTY → clear and create fresh rows
        if (tbody.children.length === 0) {
            tbody.innerHTML = ""; // optional clear
        }

        // Append rows
        commands.forEach(cmd => {
            const rowHtml = `
            <tr id="row_${cmd.id}">
                <td class="text-center align-middle">
                    <div class="form-check">
                        <input class="form-check-input command-checkbox"
                            type="checkbox"
                            data-id="${cmd.id}"
                            id="cmd_${cmd.id}"
                            style="cursor: pointer;">
                    </div>
                </td>
                <td class="align-middle">
                    <span class="fs-small fw-bold">${cmd.command_name}</span>
                </td>
            </tr>
        `;

            tbody.insertAdjacentHTML("beforeend", rowHtml);
        });

        $(".command-checkbox").on('change', function () {
            let label = $(this).next('label');
            if ($(this).is(':checked')) {
                label.text('Enabled');
                label.removeClass('text-danger').addClass('text-success');
            } else {
                label.text('Disabled');
                label.removeClass('text-success').addClass('text-danger');
            }
        });

        $(".command-checkbox").each(function () {
            let label = $(this).next('label');
            if ($(this).is(':checked')) {
                label.addClass('text-success');
            } else {
                label.addClass('text-danger');
            }
        });
    },
    /**
     * Show command information in a popup
     */
    ShowCommandInfo: function (event) {
        let btn = $(event.target);
        let commandData = JSON.parse(btn.attr('data-command').replace(/&apos;/g, "'"));

        let lastUpdate = commandData.last_update
            ? moment(commandData.last_update).format('dddd, MMMM DD, YYYY [at] HH:mm:ss')
            : 'Never Updated';

        let runStatus = (commandData.run_command === true || commandData.run_command === 'true' || commandData.run_command === 1 || commandData.run_command === '1')
            ? '<span class="badge bg-success">Enabled</span>'
            : '<span class="badge bg-danger">Disabled</span>';

        let popupContent = `
            <div class="text-center mb-3">
                <h2 class="text-primary fw-bold">${commandData.command}</h2>
            </div>
            <hr>
            <div class="mt-3">
                <table class="table table-borderless">
                    <tbody>
                        <tr>
                            <td class="fw-bold text-secondary" style="width: 40%;">Command ID:</td>
                            <td><span class="badge bg-secondary">${commandData.id}</span></td>
                        </tr>
                        <tr>
                            <td class="fw-bold text-secondary">Status:</td>
                            <td><span class="badge bg-info">${commandData.status || 'N/A'}</span></td>
                        </tr>
                        <tr>
                            <td class="fw-bold text-secondary">Run Command:</td>
                            <td>${runStatus}</td>
                        </tr>
                        <tr>
                            <td class="fw-bold text-secondary">Last Update:</td>
                            <td class="text-muted">
                                <i class="bi bi-clock me-2"></i>${lastUpdate}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;

        Alertify.ShowAlertDialog({
            "title": '<i class=" bi-info-circle-fill text-info"></i> Command Information',
            "body": popupContent,
            //"buttons": ["Close"],
            "foot_note": "Command Manager"
        }, (action) => {
            // No action needed, just close
        });
    },
    /**
     * Save all command changes
     * Obsolete - Sunil 18-11-2025
     */
    SaveCommands: function (event) {
        let changedCommands = [];
        //debugger;

        $(".command-checkbox").each(function () {
            let id = parseInt($(this).attr('data-id'));
            let isChecked = $(this).is(':checked');

            let originalCommand = NMapCommand.original_data.find(cmd => cmd.id === id);

            if (originalCommand) {
                let originalChecked = originalCommand.run_command === true ||
                    originalCommand.run_command === 'true' ||
                    originalCommand.run_command === 1 ||
                    originalCommand.run_command === '1';

                // Only add to changedCommands if value actually changed
                if (isChecked !== originalChecked) {
                    changedCommands.push({
                        Id: id,
                        RunCommand: isChecked
                    });
                }
            }
        });

        if (changedCommands.length === 0) {
            $("#commandStatus").text("No changes to save")
                .removeClass('text-bg-danger text-bg-success text-bg-info')
                .addClass('text-bg-warning');
            setTimeout(() => $("#commandStatus").text(""), 2000);
            return;
        }

        let changeDetails = '';
        for (let i = 0; i < changedCommands.length; i++) {
            let cmd = changedCommands[i];
            let cmdName = 'Command ' + cmd.Id;

            for (let j = 0; j < this.original_data.length; j++) {
                if (this.original_data[j].id === cmd.Id) {
                    cmdName = this.original_data[j].command || cmdName;
                    break;
                }
            }

            let statusBadge = cmd.RunCommand
                ? '<span class="badge bg-success">Enable</span>'
                : '<span class="badge bg-danger">Disable</span>';

            changeDetails += '<li>' + cmdName + ': ' + statusBadge + '</li>';
            
        }

        Alertify.ShowAlertDialog({
            "title": "Confirm Save",
            "body": `
                <p>You are about to update <strong>${changedCommands.length}</strong> command(s):</p>
                <ul class="text-start mt-2 mb-2">${changeDetails}</ul>
                <div class='badge text-bg-info p-2 mt-2'>
                    <i class="bi bi-exclamation-triangle"></i> This will affect command execution
                </div>
            `,
            "buttons": ["Cancel", "Yes, Save Changes"],
            "foot_note": "Command Manager"
        }, async (action) => {
            if (!action) return;

            $("#commandStatus").text("Saving...")
                .removeClass('text-bg-danger text-bg-success text-bg-warning')
                .addClass('text-bg-info');
            $("#saveCommandsButton").prop('disabled', true);

            // Disable all checkboxes during save
            $(".command-checkbox").prop('disabled', true);

            try {
                let retval = await $.ajax({
                    url: config.contextPath + 'home/UpdateNMapCommandsRunStatus',
                    type: 'POST',
                    data: { commandsData: JSON.stringify(changedCommands) },
                    timeout: 30000 // 30 second timeout
                });

                retval = parseInt(retval);

                if (retval === -1) {
                    $("#commandStatus").text("Validation failed")
                        .removeClass('text-bg-info text-bg-success text-bg-warning')
                        .addClass('text-bg-danger');
                } else if (retval === 1) {
                    $("#commandStatus").text(`${ changedCommands.length } command(s) updated successfully`)
                        .removeClass('text-bg-info text-bg-danger text-bg-warning')
                        .addClass('text-bg-success');

                    // Reset button style
                    $("#saveCommandsButton").removeClass('btn-warning').addClass('btn-primary');

                    // Reload the table to get updated Last_Update times
                    setTimeout(() => {
                        NMapCommand.LoadAllCommands();
                    }, 1500);
                } else {
                    $("#commandStatus").text("Error occurred while updating")
                        .removeClass('text-bg-info text-bg-success text-bg-warning')
                        .addClass('text-bg-danger');
                }
            } catch (error) {
                console.error('Error saving commands:', error);

                let errorMsg = "Failed to save commands";
                if (error.statusText) {
                    errorMsg += `: ${ error.statusText }`;
                }
                if (error.status === 0) {
                    errorMsg = "Network error: Unable to reach server";
                } else if (error.status === 500) {
                    errorMsg = "Server error: Please contact administrator";
                } else if (error.status === 401 || error.status === 403) {
                    errorMsg = "Authentication error: Please login again";
                }

                $("#commandStatus").text(errorMsg)
                    .removeClass('text-bg-info text-bg-success text-bg-warning')
                    .addClass('text-bg-danger');
            } finally {
                $("#saveCommandsButton").prop('disabled', false);
                $(".command-checkbox").prop('disabled', false);

                // Clear status message after delay
                setTimeout(() => {
                    if (!$("#commandStatus").hasClass('text-bg-success')) {
                        $("#commandStatus").text("");
                    }
                }, 5000);
            }
        });
    },
    /**
     * Select all checkboxes
     */
    SelectAll: function (event) {
        $(".command-checkbox").prop('checked', true).trigger('change');
        $("#commandStatus").text("All commands selected")
            .removeClass('text-bg-danger text-bg-success')
            .addClass('text-bg-info');
        setTimeout(() => $("#commandStatus").text(""), 2000);
    },

    /** * Deselect all checkboxes */
    DeselectAll: function (event) {
        $(".command-checkbox").prop('checked', false).trigger('change');
        $("#commandStatus").text("All commands deselected")
            .removeClass('text-bg-danger text-bg-success')
            .addClass('text-bg-info');
        setTimeout(() => $("#commandStatus").text(""), 2000);
    },

    /** * Deselect all checkboxes */
    UpdateTableCommands: function (event) {
        this.LoadAllCommands();
    },


    GenerateScanTasks: function (event) {
        alert('Reached');
        let changedCommands = [];

        $(".command-checkbox").each(function () {
            let id = parseInt($(this).attr('data-id'));
            let isChecked = $(this).is(':checked');
            debugger;
            if (isChecked) {
                // get the row of the current checkbox
                let row = $(this).closest('tr');

                // get 2nd column text (index 1)
                let secondColumnText = row.find('td').eq(1).text().trim();

                changedCommands.push({
                    Id: id,
                    Command: secondColumnText
                });
            }            
        });
        console.log(changedCommands);
        Alertify.ShowAlertDialog({
            "title": "Confirm Save",
            "body": `
                <p>You are about to trigger scan for <strong>${changedCommands.length}</strong> command(s):</p>
                <div class='badge text-bg-info p-2 mt-2'>
                    <i class="bi bi-exclamation-triangle"></i> This will affect command execution
                </div>
            `,
            "buttons": ["Cancel", "Yes, Save Changes"],
            "foot_note": "PAS Tool"
        }, async (action) => {
            if (!action) return;

            $("#commandStatus").text("Saving...")
                .removeClass('text-bg-danger text-bg-success text-bg-warning')
                .addClass('text-bg-info');
            $("#saveCommandsButton").prop('disabled', true);

            // Disable all checkboxes during save
            $(".command-checkbox").prop('disabled', true);

            try {
                let retval = await $.ajax({
                    url: config.contextPath + 'home/CreateScanTasks',
                    type: 'POST',
                    data: { commandsData: JSON.stringify(changedCommands) },
                    timeout: 30000 // 30 second timeout
                });

                retval = parseInt(retval);

                if (retval === 0) {
                    $("#commandStatus").text("Scan trigger failed")
                        .removeClass('text-bg-info text-bg-success text-bg-warning')
                        .addClass('text-bg-danger');
                } else if (retval >0) {
                    $("#commandStatus").text(`${changedCommands.length} command(s) triggered for scan successfully`)
                        .removeClass('text-bg-info text-bg-danger text-bg-warning')
                        .addClass('text-bg-success');

                    // Reset button style
                    $("#saveCommandsButton").removeClass('btn-warning').addClass('btn-primary');

                    // Reload the table to get updated Last_Update times
                    setTimeout(() => {
                        //NMapCommand.LoadAllCommands();
                    }, 1500);
                } else {
                    $("#commandStatus").text("Error occurred while updating")
                        .removeClass('text-bg-info text-bg-success text-bg-warning')
                        .addClass('text-bg-danger');
                }

            } catch (error) {
                console.error('Error saving commands:', error);

                let errorMsg = "Failed to save commands";
                if (error.statusText) {
                    errorMsg += `: ${error.statusText}`;
                }
                if (error.status === 0) {
                    errorMsg = "Network error: Unable to reach server";
                } else if (error.status === 500) {
                    errorMsg = "Server error: Please contact administrator";
                } else if (error.status === 401 || error.status === 403) {
                    errorMsg = "Authentication error: Please login again";
                }

                $("#commandStatus").text(errorMsg)
                    .removeClass('text-bg-info text-bg-success text-bg-warning')
                    .addClass('text-bg-danger');
            } finally {
                $("#saveCommandsButton").prop('disabled', false);
                $(".command-checkbox").prop('disabled', false);

                // Clear status message after delay
                setTimeout(() => {
                    if (!$("#commandStatus").hasClass('text-bg-success')) {
                        $("#commandStatus").text("");
                    }
                }, 5000);
            }
        });
    },









    // pass tool part 
    GetCommands: function () {

        $.ajax({
            url: config.contextPath + "Home/GetCommands",
            type: "GET",
            success: function (data) {
                var select = $("#command");
                select.empty();


                if (Array.isArray(data) && data.length > 0) {
                    $.each(data, function (i, Commands) {
                        select.append($('<option>', {
                            value: Commands,
                            text: Commands
                        }));
                    });
                } else {
                    select.append($('<option>', {
                        value: '',
                        text: 'No Commands names available'
                    }));
                }
            },
            error: function (xhr, status, error) {
                console.error("Error fetching Commands names:", error);
                alert("Failed to load Commands names.");
            }
        });
    },
    GenerateComm: function () {
        var ipAddress = $('#ipaddress').val();
        var selectedCommand = $('#command').val();
        var generatedCommand = selectedCommand + ' ' + ipAddress;
        $('#gencommands').val(generatedCommand);
    },
    SaveScanData: async function (e) {
        let command = $("#gencommands").val();
        if (!command) {
            alert("Please fill data");
            return;
        }
        let scan_data = JSON.stringify({ command: command });
        $.ajax({
            url: config.contextPath + 'Home/SaveScanData',
            method: 'GET',
            contentType: 'application/json',
            data: { scan_data: scan_data },
            success: function (response) {
                alert(response);
            },
            error: function (error) {
                let errorMsg = error.responseText || "An error occurred while saving configuration.";
                alert(errorMsg);
            }
        });

    },
}


