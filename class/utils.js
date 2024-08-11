export function outputText(text) {
    const output = document.getElementById('output');
    if (output) {
        output.innerHTML += `${text}<br>`;
        output.scrollTop = output.scrollHeight;
    } else {
        console.error('Output element not found');
    }
}
