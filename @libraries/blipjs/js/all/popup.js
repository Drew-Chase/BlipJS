let popupLoaded = false 
$(document).on('nav-complete', () => {
    if (!popupLoaded) {
        popupLoaded = true;
        let popupBody = document.createElement('div');
        popupBody.classList.add('popup');
        $("body")[0].appendChild(popupBody)
    }
})
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