import { _decorator, Component, Node, RichText, input, Input, EventTouch } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SimpleTouchDetector')
export class SimpleTouchDetector extends Component {
    @property(RichText)
    touchLabel: RichText = null!;

    start() {
        console.log("SimpleTouchDetector started");
        console.log("TouchLabel connected:", this.touchLabel);
        
        // Set initial text
        if (this.touchLabel) {
            this.touchLabel.string = "Touch the screen!";
        }
        
        // Register touch events
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchStart(event: EventTouch) {
        console.log("Touch Start detected!");
        const pos = event.getLocation();
        if (this.touchLabel) {
            this.touchLabel.string = `Touch Start: (${Math.round(pos.x)}, ${Math.round(pos.y)})`;
        }
    }

    private onTouchMove(event: EventTouch) {
        console.log("Touch Move detected!");
        const pos = event.getLocation();
        if (this.touchLabel) {
            this.touchLabel.string = `Dragging: (${Math.round(pos.x)}, ${Math.round(pos.y)})`;
        }
    }

    private onTouchEnd(event: EventTouch) {
        console.log("Touch End detected!");
        const pos = event.getLocation();
        if (this.touchLabel) {
            this.touchLabel.string = `Touch End: (${Math.round(pos.x)}, ${Math.round(pos.y)})`;
        }
    }
}
