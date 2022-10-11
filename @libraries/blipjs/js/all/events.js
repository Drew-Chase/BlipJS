
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
class SliderEvent extends Event {
    constructor(value) {
        super("slide", { bubbles: true, cancelable: true, composed: true });
        this.value = value;
    }
}

class NavigationCompleteEvent extends Event {
    constructor(value) {
        super("nav-complete", { bubbles: true, cancelable: true, composed: true });
        this.value = value;
    }
}
class NavigationStartEvent extends Event {
    constructor(value) {
        super("nav-start", { bubbles: true, cancelable: true, composed: true });
        this.value = value;
    }
}
class NavigationProgressUpdateEvent extends Event {
    constructor(value) {
        super("nav-progress-update", { bubbles: true, cancelable: true, composed: true });
        this.value = value;
    }
}