document.addEventListener("DOMContentLoaded", () => {
    const dropArea = document.getElementById("dropArea");
    const fileInput = document.getElementById("fileInput");

    dropArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropArea.style.background = "rgba(255, 255, 255, 0.2)";
    });

    dropArea.addEventListener("dragleave", () => {
        dropArea.style.background = "";
    });

    dropArea.addEventListener("drop", (e) => {
        e.preventDefault();
        dropArea.style.background = "";
        processFile(e.dataTransfer.files[0]);
    });

    fileInput.addEventListener("change", () => {
        processFile(fileInput.files[0]);
    });
});

function processFile(file) {
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const byteArray = new Uint8Array(e.target.result);
        const decryptedText = decryptData(byteArray, file.name);
        displayOutput(decryptedText);
    };
    
    reader.readAsArrayBuffer(file);
}

function decryptData(byteArray, fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    
    switch (extension) {
        case "hc": return decryptXOR(byteArray, 0x55);
        case "ehi": return decryptAES(byteArray);
        case "dark": return decryptBlowfish(byteArray);
        case "npvi": return decryptBase64(byteArray);
        default: return "Unknown file type.";
    }
}

function decryptXOR(byteArray, key) {
    return new TextDecoder("utf-8").decode(byteArray.map(byte => byte ^ key));
}

async function decryptAES(byteArray) {
    try {
        const key = await crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode("1234567890abcdef"),
            { name: "AES-CBC" },
            false,
            ["decrypt"]
        );
        const iv = new Uint8Array(16);
        const decrypted = await crypto.subtle.decrypt({ name: "AES-CBC", iv }, key, byteArray);
        return new TextDecoder("utf-8").decode(new Uint8Array(decrypted));
    } catch {
        return "AES Decryption failed.";
    }
}

function decryptBlowfish(byteArray) {
    return "Blowfish decryption coming soon...";
}

function decryptBase64(byteArray) {
    try {
        return atob(new TextDecoder("utf-8").decode(byteArray));
    } catch {
        return "Base64 decryption failed.";
    }
}

function displayOutput(text) {
    document.getElementById("configOutput").textContent = text;
    document.getElementById("outputBox").style.display = "block";
    hljs.highlightAll();
}

function copyToClipboard() {
    navigator.clipboard.writeText(document.getElementById("configOutput").textContent)
        .then(() => alert("Copied!"))
        .catch(() => alert("Copy failed!"));
}
