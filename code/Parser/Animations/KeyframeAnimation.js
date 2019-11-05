class KeyFrameAnimation extends Animation {

    /* 
    keyframes[N] = {
        time: number of corresponding frame(eg. 10, 5, 8, ...)
        matrix: target matrix at frame time
    }
    */
    constructor(scene, keyframes) {
        super(scene);
        if(keyframes.length < 1) {
            throw "Error in Animation: must have at least 1 keyframe";
        }
        this.keyframes = keyframes;
        this.currentFrame = 1;

        var identityMatrix; mat4.identity(identityMatrix);
        this.keyframes[0] = {
            time: 0,
            matrix: identityMatrix
        }

        // Store and update animation matrix each time
        // this.update() is called
        this.currentAnimationMatrix = null;
        this.currentAnimationMatrixOffset = this.keyframes[this.currentFrame - 1].matrix;

        this.firstTimeBool = true;
        this.firstTime;

        this.isAnimationDone = false;
    }

    /*
        This function updates this.currentAnimationMatrix to match
        expected values at time param{t}
    */
    update(t) {

        if(this.isAnimationDone === true) {
            return;
        }

        if(this.firstTimeBool === true) {
            this.firstTime = t;
            this.firstTimeBool = false;
        }

        const timeInterval = t - this.firstTime;
        const incrementMatrix = (this.keyframes[this.currentFrame].matrix - this.keyframes[this.currentFrame -1].matrix)
            / (this.keyframes[this.currentFrame].time - this.keyframes[this.currentFrame -1].time);

        this.currentAnimationMatrix = this.currentAnimationMatrixOffset 
            + (timeInterval- this.keyframes[this.currentFrame -1].time) * incrementMatrix;

        if(timeInterval >= this.keyframes[this.currentFrame].time) {
            this.currentAnimationMatrixOffset = this.keyframes[this.currentFrame].matrix;
            this.currentFrame++;
            if(this.currentFrame >= this.keyframes.length) {
                this.isAnimationDone = true;
                this.currentAnimationMatrix = this.keyframes[this.keyframes.length -1].matrix;
            }
        }
    }

    apply() {
        this.scene.multMatrix(this.currentAnimationMatrix);
    }

}