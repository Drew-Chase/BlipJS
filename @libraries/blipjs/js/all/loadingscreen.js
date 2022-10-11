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