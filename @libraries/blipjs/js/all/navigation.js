let navLoaded = false; 
$(document).on('nav-complete', () => {
    if (!navLoaded) {
        navLoaded = true
        let nav = $("nav.fixed.animated")[0];
        if (nav != null) {
            if (window.scrollY > 5) {
                nav.classList.add('collapsed')
            } else {
                nav.classList.remove('collapsed')
            }
            $(document).on('scroll', () => {
                if (window.scrollY > 5) {
                    nav.classList.add('collapsed')
                } else {
                    nav.classList.remove('collapsed')
                }
            })
        }
    }
})

var page = {
    controller: null,
    view: null,
    model: {}
}
var lastpage = null;

BuildPage()
Navigate(page.controller == null ? "home" : page.controller, page.view == null ? "index" : page.view, page.model)

function BuildPage() {
    let sections = window.location.search.replaceAll("?", "").split('&');
    sections.forEach(kv => {
        let key = kv.split('=')[0]
        let value = kv.split('=')[1]
        switch (key) {
            case "controller":
                page.controller = value;
                break;
            case "view":
                page.view = value;
                break;
            default:
                let json = `{"${key}": "${value}"}`
                Object.assign(page.model, JSON.parse(json));
                break;
        }
    })
}

async function NavBack() {
    await Navigate(lastpage.controller, lastpage.view, lastpage.model);
}

async function Navigate(controller = "home", view = "index", model = {}) {
    let loading = new LoadingScreen();
    lastpage = page;
    page = {
        controller: controller,
        view: view,
        model: model
    }
    document.dispatchEvent(new NavigationStartEvent(page))

    let url = `@pages/${controller}/${view}.html`;
    let html = await $.get(url)
    let keys = Object.keys(model);
    let values = Object.values(model)
    let modelp = "";
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let value = values[i];
        if (key != null && value != null) {
            modelp += `&${key}=${value}`
            if (html.toLowerCase().includes(`{${key.toLowerCase()}}`)) {
                html = html.replaceAll(`{src}`, value);
            }
        }
    }
    window.history.pushState("", "", `?controller=${controller}&view=${view}${modelp}`)
    $("main")[0].innerHTML = html;
    await InitPageLoad()
    loading.close();
    document.dispatchEvent(new NavigationCompleteEvent(page))
}