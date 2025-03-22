document.addEventListener("DOMContentLoaded", () => {
    const dropArea = document.getElementById("dropArea");
    const fileInput = document.getElementById("fileInput");

    dropArea.addEventListener("dragover", (event) => {
        event.preventDefault();
        dropArea.style.borderColor = "lime";
    });

    dropArea.addEventListener("dragleave", () => {
        dropArea.style.borderColor = "cyan";
    });

    dropArea.addEventListener("drop", (event) => {
        event.preventDefault();
        dropArea.style.borderColor = "cyan";
        handleFile(event.dataTransfer.files[0]);
    });

    fileInput.addEventListener("change", () => {
        handleFile(fileInput.files[0]);
    });
});

function handleFile(file) {
    if (!file) return;
    
    const fileType = file.name.split('.').pop().toLowerCase();
    const reader = new FileReader();

    reader.onload = function (event) {
        let decryptedData = decryptConfig(event.target.result, fileType);
        displayConfig(decryptedData);
    };

    reader.readAsText(file);
}

function decryptConfig(content, fileType) {
    switch (fileType) {
        case "hc":
            return "HC Decrypted Data: " + atob(content); // Example Base64 decryption
        case "ehi":
            return "EHI Decrypted Data: " + atob(content);
        case "npvi":
            return "NPVI Decrypted Data: " + atob(content);
        case "dark":
            return "Dark Config: " + atob(content);
        case "ovpn":
        case "json":
            return "OpenVPN/V2Ray Config: " + content;
        default:
            return "Unknown config type. Raw content:\n" + content;
    }
}

function displayConfig(config) {
    document.getElementById("configOutput").textContent = config;
    document.getElementById("outputBox").style.display = "block";
    hljs.highlightAll();
}

function copyToClipboard() {
    navigator.clipboard.writeText(document.getElementById("configOutput").textContent);
    alert("Copied to clipboard!");
}
