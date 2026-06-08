/* eslint-disable no-console */
sap.ui.define([
    "sap/m/BusyDialog",
    "sap/m/MessageToast"
], function(BusyDialog, MessageToast) {
    'use strict';

    return {
        onFileChange: function (oEvent) {
            /* If a file is uploaded enable the upload button */
            const aFiles = oEvent.getParameter("files");
            const oUploadBtn = this.byId("uploadBtn");
            
            if (aFiles && aFiles.length > 0) {
                this._selectedFile = aFiles[0];
                oUploadBtn.setEnabled(true);
            } else {
                this._selectedFile = null;
                oUploadBtn.setEnabled(false);
            }
        },
        onUploadCV: function (oEvent) {
            
            if (!this._selectedFile) {return;}

            // Initializing the BusyDialog
            if (!this._BusyDialog) {
                this._BusyDialog = new BusyDialog({
                    text: "AI is analyzing the CV, Please Wait...",
                    title: "Processing"
                });
            }

            const control = oEvent.getSource();

            const bindingContext = control.getBindingContext();

            const candidatePath = bindingContext.getPath();
            // Upload URL for PUT request
            const uploadUrl = bindingContext.getModel().getServiceUrl() + candidatePath.substring(1) + "/Content";
            

            const oProgressBar = this.byId("uploadProgressBar");
            oProgressBar.setVisible(true);
            oProgressBar.setPercentValue(0);
            oProgressBar.setDisplayValue("0%");

            const xhr = new XMLHttpRequest();
            xhr.open("PUT", uploadUrl, true);
            
            // Set required streaming headers
            xhr.setRequestHeader("Content-Type", this._selectedFile.type);

            // Progress Bar Update 
            xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable) {
                    const iPercent = Math.round((e.loaded / e.total) * 100);
                    oProgressBar.setPercentValue(iPercent);
                    oProgressBar.setDisplayValue(iPercent + "%");
                    
                    if (iPercent === 100) {
                        oProgressBar.setState("Success");
                        this._BusyDialog.open(); // Show loading spinner
                    }
                }
            });

            // Backend response handler
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    this._BusyDialog.close(); // Hide loading spinner
                    
                    if (xhr.status === 204 || xhr.status === 200) {
                        MessageToast.show("CV uploaded and processed successfully!");
                        this.byId("cvFileUploader").clear();
                        this.byId("uploadBtn").setEnabled(false);
                        oProgressBar.setVisible(false);

                        // Updating the UI fields
                        bindingContext.requestSideEffects([
                            { $PropertyPath: "FullName" },
                            { $PropertyPath: "Email" },
                            { $PropertyPath: "Phone" },
                            { $PropertyPath: "Skills" },
                            { $PropertyPath: "YearsOfExperience" },
                            { $PropertyPath: "CurrentRole" },
                            { $PropertyPath: "AISummary" },
                            { $PropertyPath: "FileName" }
                        ]).then(() => {
                            MessageToast.show("Candidate profile updated with AI-extracted details!");
                        }).catch((oError) => {
                            console.error("Failed to refresh candidate side effects:", oError);
                        });

                    } else {
                        oProgressBar.setState("Error");
                        const response = JSON.parse(xhr.response);
                        MessageToast.show(response?.error?.message || "Upload failed. Please try again.");
                    }
                }
            };

            // Send the raw binary file content directly
            xhr.send(this._selectedFile);
        }
    };
});
