async function Download(url, filename = "", blob = false) { 
    let link = document.createElement('a');
    if (blob) {
        let response = await fetch(url)
        let b = await response.blob()
        link.href = URL.createObjectURL(b);
    } else
        link.href = url;
    if (filename != "")
        link.download = filename;
    link.click();
}
