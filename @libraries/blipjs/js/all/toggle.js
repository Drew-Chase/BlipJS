$(document).on('nav-complete', () => {
    Array.from($("toggle")).forEach(toggle => {
        $(toggle).attr('value', $(toggle).attr('value') == null ? "false" : $(toggle).attr('value'))
        $(toggle).on('click', () => {
            $(toggle).attr('value', $(toggle).attr('value') == "false")
            toggle.dispatchEvent(new ToggleEvent($(toggle).attr('value') == "true"));
        })
    })
}) 