import { _decorator, Component, Node, RichText } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SimpleTest')
export class SimpleTest extends Component {
    @property(RichText)
    testLabel: RichText = null!;

    start() {
        console.log("SimpleTest started");
        console.log("TestLabel connected:", this.testLabel);
        
        if (this.testLabel) {
            this.testLabel.string = "SIMPLE TEST WORKING!";
            console.log("Simple test text set");
        } else {
            console.log("ERROR: TestLabel not connected!");
        }
    }
}
