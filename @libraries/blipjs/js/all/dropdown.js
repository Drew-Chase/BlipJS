$(document).on('nav-complete', () => { 
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
})