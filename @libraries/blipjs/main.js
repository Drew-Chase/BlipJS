(() => {
    let stylesheet = document.createElement('link');
    stylesheet.href = `@libraries/blipjs/main.min.css`
    stylesheet.rel = "stylesheet";
    $("head")[0].appendChild(stylesheet)
    stylesheet = document.createElement('link');
    stylesheet.rel = "stylesheet";
    stylesheet.href = `@libraries/fontawesome/css/all.min.css`
    $("head")[0].appendChild(stylesheet)

}).call();

async function closeAllPopups() {
    $("html")[0].style.overflow = "";
    $("nav")[0].classList.remove('hidden');
    let popup = $(".popup")[0]
    popup.classList.remove('open');
    await new Promise(r => setTimeout(r, 500));
    popup.innerHTML = "";
}

class Popup {
    constructor(name) {
        this.name = name;
        this.classes = [];
    }
    async open() {

        let popup = $(".popup")[0]
        let body = document.createElement('div')
        body.classList.add('popup-body');
        this.classes.forEach(c => body.classList.add(c))
        $(popup).on('click', e => {
            if (e.target.classList.contains('popup')) {
                closeAllPopups();
            }
        })
        if (popup.innerHTML != "") {
            await this.close();
            popup.innerHTML = "";
        }
        $("html")[0].style.overflow = "hidden";
        $("nav")[0].classList.add('hidden');
        let url = `@popups/${this.name}.html`
        let html = await $.get(url);
        body.innerHTML = html;
        popup.appendChild(body);
        await new Promise(r => setTimeout(r, 100));
        popup.classList.add('open');
        return body;
    }
    async close() {
        await closeAllPopups();
    }
}
/* Curtain */
class CurtainPopup extends Popup {
    constructor(name) {
        super(name);
        this.classes.push("curtain");
    }
}

class CurtainWithBorderPopup extends CurtainPopup {
    constructor(name) {
        super(name);
        this.classes.push('centered', 'border');
    }
}
class CenteredLargeCurtainPopup extends CurtainPopup {
    constructor(name) {
        super(name);
        this.classes.push('centered', 'large');
    }
}
class CenteredSmallCurtainPopup extends CurtainPopup {
    constructor(name) {
        super(name);
        this.classes.push('centered', 'small');
    }
}

/* With Title */
class CurtainWithTitlePopup extends CurtainPopup {
    constructor(name) {
        super(name);
        this.classes.push('title');
    }
}
class CenteredLargeCurtainWithTitlePopup extends CurtainWithTitlePopup {
    constructor(name) {
        super(name);
        this.classes.push('centered', 'large');
    }
}
class CenteredSmallCurtainWithTitlePopup extends CurtainWithTitlePopup {
    constructor(name) {
        super(name);
        this.classes.push('centered', 'small');
    }
}


/* Fade */
class FadePopup extends Popup {
    constructor(name) {
        super(name);
        this.classes.push('fade');
    }
}
class FadeWithBorderPopup extends FadePopup {
    constructor(name) {
        super(name);
        this.classes.push('centered', 'border');
    }
}
class CenteredLargeFadePopup extends FadePopup {
    constructor(name) {
        super(name);
        this.classes.push('centered', 'large');
    }
}
class CenteredSmallFadePopup extends FadePopup {
    constructor(name) {
        super(name);
        this.classes.push('centered', 'small');
    }
}

/* With Title */
class FadeWithTitlePopup extends FadePopup {
    constructor(name) {
        super(name);
        this.classes.push('title');
    }
}
class CenteredLargeFadeWithTitlePopup extends FadeWithTitlePopup {
    constructor(name) {
        super(name);
        this.classes.push('centered', 'large');
    }
}
class CenteredSmallFadeWithTitlePopup extends FadeWithTitlePopup {
    constructor(name) {
        super(name);
        this.classes.push('centered', 'small');
    }
}

class LoadingScreen {
    constructor(title = null, message = null) {
        $("html")[0].style.overflow = "hidden";
        title = title == null ? "Loading..." : title;
        message = message == null ? "This could take a moment..." : message;

        let screen = document.createElement('div');
        screen.classList.add('loading');
        let titleElement = document.createElement('h1');
        titleElement.innerHTML = title;

        let messageElement = document.createElement('p');
        messageElement.innerHTML = message;
        messageElement.classList.add('1');

        let spinner = document.createElement('span');
        spinner.classList.add('spinner');
        spinner.style.width = "100px"

        screen.appendChild(titleElement)
        screen.appendChild(messageElement)
        screen.appendChild(spinner)

        $('body')[0].appendChild(screen);
        setTimeout(() => screen.classList.add('active'), 100);
        this.screen = screen;

    }
    async close() {
        $("html")[0].style.overflow = "";
        this.screen.classList.remove('active')
        await new Promise(r => setTimeout(r, 500))
        this.screen.remove();
    }
}

var page = {
    controller: null,
    view: null,
    model: {}
}
var lastpage = null
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
}
async function InitPageLoad() {
    await Init()
    async function Init() {
        await InitSections()
        InitNav();
        InitVideoPlayer()
        InitPageElements();
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
    async function InitNav() {
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
    async function InitVideoPlayer() {
        Array.from($("video-player")).forEach(player => {
            let src = $(player).attr('src');
            let id = $(player).attr('id');
            let poster = $(player).attr('poster');

            let classes = $(player).attr('class');
            let videoPlayer = document.createElement('div');
            videoPlayer.classList.add('video-player')
            if (classes != null)
                videoPlayer.classList.add(classes.split(' '));
            if (id != null)
                videoPlayer.id = id;
            let video = document.createElement('video');
            video.src = src;
            if (poster != null)
                video.poster = poster;

            let controls = document.createElement('div');
            controls.classList.add('controls');

            let progress = document.createElement('div')
            progress.classList.add('progress');

            let preview = document.createElement('span');
            preview.classList.add('preview');

            let track = document.createElement('span');
            track.classList.add('track');

            let hover = document.createElement('span');
            hover.classList.add('hover');

            progress.appendChild(preview)
            progress.appendChild(track)
            progress.appendChild(hover)

            let buttons = document.createElement('div');
            buttons.classList.add('row', 'control-buttons');

            let playBtn = document.createElement('i');
            playBtn.classList.add('play');
            playBtn.title = "play/pause";

            let timestamp = document.createElement('p');
            timestamp.classList.add('4', 'video-track-timestamp');

            let current = document.createElement('span');
            current.classList.add('current-timestamp');

            let total = document.createElement('span');
            total.classList.add('total-timestamp');

            let volume = document.createElement('i')
            volume.classList.add('mute-button', 'fa-solid', 'fa-volume-up')
            volume.title = "mute/unmute"



            let fullscreen = document.createElement('i')
            fullscreen.classList.add('fullscreen-btn', 'fa-solid', 'fa-expand')
            fullscreen.title = "toggle fullscreen"


            timestamp.appendChild(current);
            timestamp.append("/");
            timestamp.appendChild(total);

            buttons.appendChild(playBtn);
            buttons.appendChild(timestamp);

            controls.appendChild(progress);
            controls.appendChild(buttons);
            controls.appendChild(volume);
            controls.appendChild(fullscreen);

            videoPlayer.appendChild(video);
            videoPlayer.appendChild(controls);

            player.outerHTML = videoPlayer.outerHTML;

        })
        Array.from($(".video-player")).forEach(player => {

            let timeout = null;
            let video = $(player).find("video")[0];
            if (video.paused) {
                show();
            }
            let playBtn = $(player).find(".play")[0]
            let fullscreen = $(player).find(".fullscreen-btn")[0]
            let muteButton = $(player).find(".mute-button")[0]
            let timer = setInterval(() => update(), 500)
            let preview = $(player).find(".preview")[0];
            let dragging = false;
            preview.style.display = "none"

            $(playBtn).on('click', () => togglePlay())
            $(video).on('click', () => togglePlay())
            $(video).on('dblclick', () => toggleFullscreen())
            $(fullscreen).on('click', () => toggleFullscreen())
            $(fullscreen).on('click', () => toggleFullscreen())
            $(muteButton).on('click', () => {
                video.muted = !video.muted;
                if (video.muted) {
                    muteButton.classList.add("fa-volume-mute")
                    muteButton.classList.remove("fa-volume-up")
                } else {
                    muteButton.classList.add("fa-volume-up")
                    muteButton.classList.remove("fa-volume-mute")
                }
            })
            $(player).contextmenu(e => {
                e.preventDefault();
            })
            update();


            $(player).find(".progress").on('click', e => {
                let bound = $(player).find(".progress")[0].getBoundingClientRect();
                let percentage = ((e.clientX - bound.left) / bound.width) * 100;
                let seconds = (percentage * video.duration) / 100;
                video.currentTime = seconds;
                $(player).find(".progress .track")[0].style.transition = `unset`;
                $(player).find(".progress .track")[0].style.maxWidth = `${percentage}%`;
                setTimeout(() => {
                    $(player).find(".progress .track")[0].style.transition = ``;
                }, 500)
            })

            $(player).find(".progress").on('mousedown', () => {
                dragging = true;
            })

            $(document).on('mouseup', () => {
                dragging = false;
            })
            $(player).attr("tabindex", 0)
            $(player).on('keydown', e => {
                e.preventDefault();
                switch (e.key) {
                    case " ":
                        togglePlay();
                        break;
                    case "f":
                        toggleFullscreen();
                        break;
                    case "m":
                        video.muted = !video.muted;
                        if (video.muted) {
                            muteButton.classList.add("fa-volume-mute")
                            muteButton.classList.remove("fa-volume-up")
                        } else {
                            muteButton.classList.add("fa-volume-up")
                            muteButton.classList.remove("fa-volume-mute")
                        }
                        break;
                    case "ArrowRight":
                        if (video.currentTime <= video.duration - 10) {
                            video.currentTime += 10;
                        } else {
                            stop();
                        }
                        update();
                        break;
                    case "ArrowLeft":
                        if (video.currentTime >= 10) {
                            video.currentTime -= 10;
                        } else {
                            video.currentTime = 0;
                        }
                        update();
                        break;
                    case "ArrowDown":
                        if (video.volume >= .10) {
                            video.volume -= .10;
                        } else {
                            video.mute = true;
                            muteButton.classList.add("fa-volume-mute")
                            muteButton.classList.remove("fa-volume-up")
                        }
                        console.log(video.volume)
                        update();
                        break;
                    case "ArrowUp":
                        video.mute = false;
                        if (video.volume <= .90) {
                            video.volume += .10;
                        } else {
                            video.volume = 1;
                        }
                        console.log(video.volume)
                        muteButton.classList.add("fa-volume-up")
                        muteButton.classList.remove("fa-volume-mute")
                        update();
                        break;
                    default:
                        break;
                }
            })
            $(player).on('mousemove', e => {
                if (dragging) {
                    let track = $(player).find(".progress .track")[0];
                    let bar = $(player).find(".progress")[0];
                    let bound = bar.getBoundingClientRect();
                    let percentage = ((e.clientX - bound.left) / bound.width) * 100;

                    track.style.transition = `unset`;
                    track.style.maxWidth = `${percentage}%`;
                    setTimeout(() => {
                        track.style.transition = ``;
                    }, 500)
                }
            })
            $(player).find(".progress").on('mousemove', e => {
                let bound = $(player).find(".progress")[0].getBoundingClientRect();
                let percentage = ((e.clientX - bound.left) / bound.width) * 100;
                $(player).find(".progress .hover")[0].style.maxWidth = `${percentage}%`;
                let seconds = (percentage * video.duration) / 100;
                let time = new Date(seconds * 1000).toISOString().substr(11, 8);
                preview.innerText = time;
                preview.style.display = ""
                preview.style.left = `calc(${percentage}% - ${(preview.getBoundingClientRect().width / 2)}px)`
            })
            $(player).find(".progress").on('mouseleave', () => {
                preview.style.display = "none"
                $(player).find(".progress .hover")[0].style.maxWidth = `0%`;
            })

            $(video).on("mousemove", () => {
                if (!video.paused) {
                    show();
                    if (timeout != null) {
                        clearInterval(timeout)
                    }
                    timeout = setInterval(() => {
                        if (!video.paused)
                            hide();
                    }, 3000)
                }
            })

            $(player).on("mouseleave", () => {
                if (!video.paused)
                    hide();
                if (timeout != null) {
                    clearInterval(timeout)
                }
            })

            function toggleFullscreen() {
                if (document.fullscreen)
                    document.exitFullscreen();
                else
                    player.requestFullscreen();
            }
            function togglePlay() {
                if (video.paused) {
                    play()
                } else {
                    pause();
                    update();
                }
            }
            function play() {
                video.play();
                playBtn.classList.add('pause')
                playBtn.classList.remove('play')
                timer = setInterval(() => update(), 100)
                timeout = setInterval(() => {
                    hide();
                }, 1000)
            }
            function pause() {
                video.pause();
                playBtn.classList.add('play')
                playBtn.classList.remove('pause')
                show()
                clearInterval(timer);
                clearInterval(timeout)
            }
            function stop() {
                pause();
                video.currentTime = 0;
                update();
            }
            function update() {
                try {
                    let current = new Date(video.currentTime * 1000).toISOString().substr(11, 8)
                    let duration = new Date(video.duration * 1000).toISOString().substr(11, 8)
                    let percentage = video.currentTime / video.duration * 100;
                    $(player).find(".current-timestamp")[0].innerText = current;
                    $(player).find(".total-timestamp")[0].innerText = duration;
                    if (!dragging)
                        $(player).find(".progress .track")[0].style.maxWidth = `${percentage}%`;

                } catch { }
            }
            function hide() {
                player.classList.remove('show')
            }
            function show() {
                player.classList.add('show')
            }
        })
    }
    async function InitPageElements() {
        let popupBody = document.createElement('div');
        popupBody.classList.add('popup');
        $("body")[0].appendChild(popupBody)
        Array.from($("a")).forEach(link => {
            let src = link.href;
            if (src != null) {
                if (!src.startsWith(window.location.origin)) {
                    console.log(link)
                    link.title = `External Link: ${src}`
                    link.href = "#";
                    $(link).on('click', () => {
                        Navigate("@error", "external", { src: src })
                    })
                }
            }
        })
        Array.from($("toggle")).forEach(toggle => {
            $(toggle).attr('value', $(toggle).attr('value') == null ? "false" : $(toggle).attr('value'))
            $(toggle).on('click', () => {
                $(toggle).attr('value', $(toggle).attr('value') == "false")
                toggle.dispatchEvent(new ToggleEvent($(toggle).attr('value') == "true"));
            })
        })
        Array.from($("dropdown")).forEach(dropdown => {

            $(dropdown).attr('tabindex', 0);
            $(dropdown).attr('name', $(dropdown).find('dropdown-name')[0].innerText);
            Array.from($(dropdown).find("dropdown-item")).forEach(item => {
                $(item).on('click', () => {
                    if (item.classList.contains('selected')) {
                        item.classList.remove('selected');
                        $(dropdown).find('dropdown-name')[0].innerText = $(dropdown).attr('name');
                        dropdown.dispatchEvent(new DropdownEvent(null))
                    } else {
                        Array.from($(dropdown).find("dropdown-item")).forEach(i => {
                            i.classList.remove('selected');
                        })
                        let value = $(item).attr('value');
                        value = value == null ? item.innerText : value;
                        item.classList.add('selected');
                        $(dropdown).find('dropdown-name')[0].innerText = item.innerText;
                        dropdown.dispatchEvent(new DropdownEvent(value))

                    }
                    dropdown.blur();
                })
            })
            $(dropdown).on('dropdown', e => {
                console.log(e.originalEvent.value);
            })
        })
    }
    class ToggleEvent extends Event {
        constructor(value) {
            super("toggle", { bubbles: true, cancelable: true, composed: true });
            this.value = value;
        }
    }
    class DropdownEvent extends Event {
        constructor(value) {
            super("dropdown", { bubbles: true, cancelable: true, composed: true });
            this.value = value;
        }
    }

}