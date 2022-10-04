(() => {
    let stylesheet = document.createElement('link');
    stylesheet.href = `@libraries/blipjs/css/all.min.css`
    stylesheet.rel = "stylesheet";
    $("head")[0].appendChild(stylesheet)
    stylesheet = document.createElement('link');
    stylesheet.rel = "stylesheet";
    stylesheet.href = `@libraries/fontawesome/css/all.min.css`
    $("head")[0].appendChild(stylesheet)

}).call();



async function InitPageLoad() {
    await Init()
    async function Init() {
        await InitSections()
    }
    async function InitSections() {
        let pageItems = Array.from($("page-item"));
        for (let i = 0; i < pageItems.length; i++) {
            let item = pageItems[i];

            let url = `@pages/@shared/${$(item).attr('page')}.html`;
            let html = await $.get(url);
            item.outerHTML = html;
        }
        let sections = Array.from($("section"));
        for (let i = 0; i < sections.length; i++) {
            let section = sections[i]
            if (section.id != "" && section.id != null) {
                let url = `@pages/${page.controller}/@sections/${section.id}.html`
                let html = await $.get(url);
                section.innerHTML = html;
            }
        }
    }
}