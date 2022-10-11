$(document).on('nav-complete', () => {
    Array.from($("colorpicker")).forEach(picker => {

        let name = $(picker).attr('name')
        if (name == null) name = ""
        let v = $(picker).attr('value');
        if (v == null) v = "#000000"
        v = hexToHSL(v).replace("hsl(", "").replace(")", "").replaceAll("%", "").split(',');

        picker.innerHTML = `<p class="1 title">${name}</p>
                        <div class="body">
                            <div class="picker">
                                <div class="hue-sat-lat">
                                    <div class="hue" value="${v[0]}">
                                        <span class="cursor"></span>
                                    </div>
                                    <div class="sat-lat">
                                        <span class="cursor"></span>
                                    </div> 
                                </div>
                            </div>
                            <div class="sliders">
                                <slider value="${v[0]}" min="0" max="360" class="hue">Hue</slider>
                                <slider value="${v[1]}" min="0" max="100" suffix="%" class="saturation">Saturation</slider>
                                <slider value="${v[2]}" min="0" max="100" suffix="%" class="lightness">Lightness</slider>
                                <slider value="100" min="0" max="100" suffix="%" class="alpha">Alpha</slider>
                            </div>
                        </div>
                        <div class="grid bottom">
                            <button class="secondary color-hsl">HSLA Sliders</button>
                            <p class="3 copy color-hex" title="copy hex value">#ff00ff</p>
                        </div>`


        let viewSliders = false;
        let updateDom = null
        let draggingHue = false;
        let draggingSatLat = false;

        let hue = $(picker).find(".picker .hue")[0]
        let satLat = $(picker).find(".picker .sat-lat")[0]
        let currentHue = $(hue).attr('value');
        if (currentHue == null) currentHue = 0;
        let hueCursor = $(hue).find(".cursor")[0]
        let satlatCursor = $(satLat).find(".cursor")[0]

        hueCursor.style.top = `${currentHue / 360 * 100}%`;
        satLat.style.setProperty("--hue", currentHue)

        let hueSlider = $(picker).find("slider.hue")[0]
        let saturationSlider = $(picker).find("slider.saturation")[0]
        let lightnessSlider = $(picker).find("slider.lightness")[0]

        $(hueSlider).attr('value', currentHue)

        updateColor()

        $(satLat).on('mousedown', () => {
            draggingSatLat = true;
        })

        $(picker).find('.copy.color-hex').on('click', () => {
            let cp = $(picker).find('.copy.color-hex')[0]
            cp.classList.add('active')
            cp.innerText = "COPIED"
            setTimeout(() => cp.classList.remove('active'), 250)
            setTimeout(() => updateColor(), 2500)
        })
        $(picker).find('.color-slider-back').on('click', () => {
            $(picker).find('.body').css("left", "0%")
        })
        $(picker).find('.color-hsl').on('click', () => {
            if (viewSliders) {
                $(picker).find('.body').css("left", "0%")
                $(picker).find('.color-hsl')[0].innerText = "HSLA Sliders"
            } else {
                $(picker).find('.body').css("left", "-100%")
                $(picker).find('.color-hsl')[0].innerText = "Picker"
            }
            viewSliders = !viewSliders;
        })

        $(document).on('mouseup', e => {
            if (draggingHue) {
                draggingHue = false;
                slideHue(e.clientY)
            }
            if (draggingSatLat) {
                draggingSatLat = false;
                slideSatLat(e.clientY, e.clientX);
            }
        })

        $(hue).on('mousedown', e => {
            draggingHue = true;
        })

        $(document).on('mousemove', e => {
            if (draggingHue) {
                slideHue(e.clientY)
            }
            if (draggingSatLat) {
                slideSatLat(e.clientY, e.clientX);
            }
        })

        $(hueSlider).on('slide', e => {
            currentHue = e.originalEvent.value;
            hueCursor.style.top = `${currentHue / 360 * 100}%`;
            satLat.style.setProperty("--hue", currentHue)
            updateColor()
        })
        $(lightnessSlider).on('slide', e => {
            updateColor()
        })
        $(saturationSlider).on('slide', e => {
            updateColor()
        })
        function updateColor() {
            let color = hslToHex(currentHue, $(saturationSlider).attr('value'), $(lightnessSlider).attr('value'))
            $(picker).find(".color-hex")[0].innerText = color;
            $(picker).find(".color-hex").css("background", color)
            if ($(lightnessSlider).attr('value') > 65) {
                $(picker).find(".color-hex").css("color", "black")
            } else {
                $(picker).find(".color-hex").css("color", "white")
            }
            if (updateDom != null) {
                clearTimeout(updateDom)
            }
            updateDom = setTimeout(() => {
                $(picker).attr('value', color)
            }, 1000)
        }



        function slideHue(x) {
            let bound = hue.getBoundingClientRect();
            let percentage = ((x - bound.top) / bound.height) * 100;
            if (percentage <= 100 && percentage >= 0) {
                hueCursor.style.top = `${percentage}%`;
                currentHue = Math.round(360 / 100 * percentage);
                $(hue).attr('value', currentHue)
                satLat.style.setProperty("--hue", currentHue)
                $(hueSlider).attr('value', currentHue)
                updateColor()
            }
        }
        function slideSatLat(x, y) {
            let bound = satLat.getBoundingClientRect();
            let px = ((x - bound.top) / bound.height) * 100;
            let py = ((y - bound.left) / bound.width) * 100;
            if (px <= 100 && px >= 0 && py <= 100 && py >= 0) {
                satlatCursor.style.top = `calc(${px}% - calc(var(--size) / 2))`;
                satlatCursor.style.left = `calc(${py}% - calc(var(--size) / 2))`;
                let sat = Math.floor(getComputedStyle(satlatCursor).left.replace("px", "") / bound.width * 100)
                let lat = Math.floor(getComputedStyle(satlatCursor).bottom.replace("px", "") / bound.height * 100)
                $(saturationSlider).attr('value', sat)
                $(lightnessSlider).attr('value', lat)
            }
            updateColor()
        }


    })

})