$(document).on('nav-complete', () => {
    Array.from($("slider")).forEach(slider => {
        let name = document.createElement('span');
        name.classList.add('name');
        name.innerHTML = slider.innerHTML;
        slider.innerHTML = "";
        let track = document.createElement('div');
        track.classList.add('track');
        let progress = document.createElement('div');
        progress.classList.add('progress');
        let preview = document.createElement('span');
        preview.classList.add('preview');
        progress.appendChild(preview) 
        track.appendChild(progress)
        slider.appendChild(name);
        slider.appendChild(track);
        let suffix = $(slider).attr('suffix')
        if (suffix == null) suffix = ""


        $(slider).attr('tabindex', 0)

        let drag = false;
        let timer = null;
        let min = $(slider).attr('min');
        let max = $(slider).attr('max');
        let value = $(slider).attr('value');

        if (value == null) value = 0;
        if (min == null) min = 0;
        if (max == null) max = 100;


        progress.style.maxWidth = `${value / max * 100}%`;

        let update = setInterval(() => {
            value = $(slider).attr('value');
            progress.style.maxWidth = `${value / max * 100}%`;
        }, 200)


        $(slider).on("mousedown", () => {
            drag = true;
        })
        $(document).on("mouseup", () => {
            drag = false;
        })
        $(document).on("mousemove", e => {
            if (drag) {
                slide(e.clientX);
            }
        })

        $(slider).on('click', e => {
            slide(e.clientX);
        })

        function slide(x) {
            let bound = $(slider).find(".track")[0].getBoundingClientRect();
            let percentage = ((x - bound.left) / bound.width) * 100;
            if (percentage <= 100 && percentage >= 0) {
                $(slider).find(".progress")[0].style.maxWidth = `${percentage}%`;
                let v = Math.round(max / 100 * percentage);

                if (timer != null)
                    clearTimeout(timer);
                $(slider).find('.preview')[0].classList.add('show');
                $(slider).find('.preview')[0].innerText = `${v}${suffix}`;
                $(slider).attr('value', v);
                slider.dispatchEvent(new SliderEvent(v));
                timer = setTimeout(() => {
                    $(slider).find('.preview')[0].classList.remove('show');
                }, 2000)
            }
        }
    })
})