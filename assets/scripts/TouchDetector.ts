import { _decorator, Component, Node, RichText, input, Input, EventTouch, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TouchDetector')
export class TouchDetector extends Component {
    @property(RichText)
    touchInfoLabel: RichText = null!;

    private touchStartPos: Vec2 = new Vec2();
    private touchEndPos: Vec2 = new Vec2();
    private isDragging: boolean = false;
    private dragStartTime: number = 0;
    private readonly SWIPE_THRESHOLD = 50; // Minimum distance for swipe
    private readonly SWIPE_TIME_THRESHOLD = 500; // Maximum time for swipe (ms)

    start() {
        // Register touch events
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        // Debug: Check if label is connected
        console.log("TouchDetector started");
        console.log("TouchInfoLabel connected:", this.touchInfoLabel);
        
        // Initialize display
        this.updateDisplay("Touch the screen to start");
    }

    onDestroy() {
        // Clean up event listeners
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    private onTouchStart(event: EventTouch) {
        const touchPos = event.getLocation();
        this.touchStartPos.set(touchPos.x, touchPos.y);
        this.isDragging = false;
        this.dragStartTime = Date.now();
        
        this.updateDisplay(`Touch Start: (${Math.round(touchPos.x)}, ${Math.round(touchPos.y)})`);
    }

    private onTouchMove(event: EventTouch) {
        const touchPos = event.getLocation();
        const distance = Vec2.distance(this.touchStartPos, new Vec2(touchPos.x, touchPos.y));
        
        if (distance > 10) { // Small threshold to start dragging
            this.isDragging = true;
            this.updateDisplay(`Dragging: (${Math.round(touchPos.x)}, ${Math.round(touchPos.y)})\nDistance: ${Math.round(distance)}px`);
        }
    }

    private onTouchEnd(event: EventTouch) {
        const touchPos = event.getLocation();
        this.touchEndPos.set(touchPos.x, touchPos.y);
        
        const distance = Vec2.distance(this.touchStartPos, this.touchEndPos);
        const duration = Date.now() - this.dragStartTime;
        
        let action = "Touch End";
        
        if (this.isDragging) {
            if (distance > this.SWIPE_THRESHOLD && duration < this.SWIPE_TIME_THRESHOLD) {
                // It's a swipe
                const direction = this.getSwipeDirection(this.touchStartPos, this.touchEndPos);
                action = `Swipe ${direction}`;
            } else {
                // It's a drag
                action = "Drag End";
            }
        }
        
        this.updateDisplay(`${action}: (${Math.round(touchPos.x)}, ${Math.round(touchPos.y)})\nDistance: ${Math.round(distance)}px\nDuration: ${duration}ms`);
        
        this.isDragging = false;
    }

    private getSwipeDirection(start: Vec2, end: Vec2): string {
        const deltaX = end.x - start.x;
        const deltaY = end.y - start.y;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        
        if (absX > absY) {
            return deltaX > 0 ? "Right" : "Left";
        } else {
            return deltaY > 0 ? "Up" : "Down";
        }
    }

    private updateDisplay(text: string) {
        console.log("Updating display with text:", text);
        if (this.touchInfoLabel) {
            this.touchInfoLabel.string = text;
            console.log("Text updated successfully");
        } else {
            console.log("ERROR: TouchInfoLabel is not connected!");
        }
    }
}
