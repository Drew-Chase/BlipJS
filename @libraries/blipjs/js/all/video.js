$(document).on('nav-complete', () => {
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
        $(player).attr("tabindex", 0)

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
                if (video.currentTime == video.duration) {
                    stop();
                    console.log($(player).attr('loop'))
                    if ($(player).attr('loop') != null)
                        play();
                }
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
        function events() {
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
            $(player).find(".progress").on('mousedown', () => {
                dragging = true;
            })

            $(document).on('mouseup', e => {
                if (dragging) {
                    dragging = false;
                    let bound = $(player).find(".progress")[0].getBoundingClientRect();
                    let percentage = ((e.clientX - bound.left) / bound.width) * 100;
                    let seconds = (percentage * video.duration) / 100;
                    video.currentTime = seconds;
                    $(player).find(".progress .track")[0].style.transition = `unset`;
                    $(player).find(".progress .track")[0].style.maxWidth = `${percentage}%`;
                    setTimeout(() => {
                        $(player).find(".progress .track")[0].style.transition = ``;
                    }, 500)
                }
            })
            $(document).on('mousemove', e => {
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

                    $(player).find(".progress .hover")[0].style.maxWidth = `${percentage}%`;
                    let seconds = (percentage * video.duration) / 100;
                    let time = new Date(seconds * 1000).toISOString().substr(11, 8);
                    preview.innerText = time;
                    preview.style.display = ""
                    preview.style.left = `calc(${percentage}% - ${(preview.getBoundingClientRect().width / 2)}px)`
                }
            })
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

        }


        update();
        events();
    })
})