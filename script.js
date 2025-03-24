document.getElementById('dropArea').addEventListener('dragover', function(e) {
    e.preventDefault();
    this.style.background = 'rgba(255, 255, 255, 0.2)';
});

document.getElementById('dropArea').addEventListener('dragleave', function() {
    this.style.background = '';
});

document.getElementById('dropArea').addEventListener('drop', function(e) {
    e.preventDefault();
    this.style.background = '';
    let file = e.dataTransfer.files[0];
    processFile(file);
});

document.getElementById('fileInput').addEventListener('change', function() {
    processFile(this.files[0]);
});

function processFile(file) {
    if (!file) return;
    let reader = new FileReader();
    reader.onload = function(e) {
        let byteArray = new Uint8Array(e.target.result);
        let decryptedText = decryptData(byteArray, file.name);
        displayOutput(decryptedText);
    };
    reader.readAsArrayBuffer(file);
}

function decryptData(byteArray, fileName) {
    let extension = fileName.split('.').pop().toLowerCase();
    
    switch (extension) {
        case "hc": return decryptXOR(byteArray, 0x55);
        case "ehi": return decryptAES(byteArray);
        case "dark": return decryptBlowfish(byteArray);
        case "npvi": return decryptBase64(byteArray);
        default: return "Unknown file type.";
    }
}

function decryptXOR(byteArray, key) {
    let decrypted = byteArray.map(byte => byte ^ key);
    return new TextDecoder("utf-8").decode(new Uint8Array(decrypted));
}

async function decryptAES(byteArray) {
    let key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode("1234567890abcdef"),
        { name: "AES-CBC" },
        false,
        ["decrypt"]
    );
    let iv = new Uint8Array(16);
    let decrypted = await crypto.subtle.decrypt({ name: "AES-CBC", iv: iv }, key, byteArray);
    return new TextDecoder("utf-8").decode(new Uint8Array(decrypted));
}

function decryptBlowfish(byteArray) {
    return "Blowfish decryption coming soon...";
}

function decryptBase64(byteArray) {
    let text = new TextDecoder("utf-8").decode(byteArray);
    return atob(text);
}

function displayOutput(text) {
    document.getElementById("configOutput").textContent = text;
    document.getElementById("outputBox").style.display = "block";
    hljs.highlightAll();
}

function copyToClipboard() {
    let text = document.getElementById("configOutput").textContent;
    navigator.clipboard.writeText(text).then(() => alert("Copied!"));
}
