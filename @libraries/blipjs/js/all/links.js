$(document).on('nav-complete', () => { 
    Array.from($("a")).forEach(link => {
        let src = link.href;
        if (src != null) {
            if (!src.startsWith(window.location.origin)) {
                link.title = `External Link: ${src}`
                link.href = "#";
                $(link).on('click', () => {
                    Navigate("@error", "external", { src: src })
                })
            }
        }
    })
}) 