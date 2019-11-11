class KeyFrameAnimation extends Animation {

    /* 
    keyFrames[i] = {
        time: number of corresponding frame(eg. 10, 5, 8, ...)
        translation: target translation values at frame time
        rotation: target rotation values at frame time
        scale: target scale values at frame time
    }
    */
    constructor(scene, keyframes) {
        super(scene);
        if(keyframes.length < 1) {
            throw "Error in Animation: must have at least 1 keyframe";
        }
        this.keyframes = keyframes;
        this.currentFrame = 1;

        this.keyframes[0] = {
            time: 0,
            translation: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
        }

        // Store and update animation matrix each time
        // this.update() is called
        this.currentAnimationMatrix = mat4.create();

        this.firstTimeBool = true;
        this.firstTime;
        
        this.isAnimationDone = false;
    }

    /*
        This function updates this.currentAnimationMatrix to match
        expected values at time param{t}
    */
    update(t) {

        /* Once animation is done, no point in continuously trying to alter the matrix */
        if(this.isAnimationDone === true) {
            return;
        }

        if(this.firstTimeBool === true) {
            this.firstTime = t;
            this.firstTimeBool = false;
            return;
        }

        /* Helper lambas that reduce the amont of code*/
        const getTime = (pos) => this.keyframes[pos].time;
        const getTranslationAt = (pos, key) => this.keyframes[pos].translation[key];
        const getRotationAt = (pos, key) => this.keyframes[pos].rotation[key];
        const getScaleAt = (pos, key) => this.keyframes[pos].scale[key];

        const timeInterval = (t - this.firstTime) / 1000;
        console.log("Interval = " + timeInterval);
        
        this.currentAnimationMatrix = mat4.create();
        const timeFrame = getTime(this.currentFrame) - getTime(this.currentFrame -1);
        const incrementTranslation = [
            (getTranslationAt(this.currentFrame, 0) - getTranslationAt(this.currentFrame -1, 0)) / timeFrame * timeInterval + getTranslationAt(this.currentFrame -1, 0),
            (getTranslationAt(this.currentFrame, 1) - getTranslationAt(this.currentFrame -1, 1)) / timeFrame * timeInterval + getTranslationAt(this.currentFrame -1, 1),
            (getTranslationAt(this.currentFrame, 2) - getTranslationAt(this.currentFrame -1, 2)) / timeFrame * timeInterval + getTranslationAt(this.currentFrame -1, 2),
        ];
        const incrementRotation = [
            (getRotationAt(this.currentFrame, 0) - getRotationAt(this.currentFrame -1, 0)) / timeFrame * timeInterval + getRotationAt(this.currentFrame -1, 0),
            (getRotationAt(this.currentFrame, 1) - getRotationAt(this.currentFrame -1, 1)) / timeFrame * timeInterval + getRotationAt(this.currentFrame -1, 1),
            (getRotationAt(this.currentFrame, 2) - getRotationAt(this.currentFrame -1, 2)) / timeFrame * timeInterval + getRotationAt(this.currentFrame -1, 2),
        ];
        console.log("incrementRotation = " + incrementRotation);
        const incrementScale = [
            (getScaleAt(this.currentFrame, 0) - getScaleAt(this.currentFrame -1, 0) ) / timeFrame * timeInterval + getScaleAt(this.currentFrame -1, 0),
            (getScaleAt(this.currentFrame, 1) - getScaleAt(this.currentFrame -1, 1) ) / timeFrame * timeInterval + getScaleAt(this.currentFrame -1, 1),
            (getScaleAt(this.currentFrame, 2) - getScaleAt(this.currentFrame -1, 2) ) / timeFrame * timeInterval + getScaleAt(this.currentFrame -1, 2),
        ];
        
        mat4.rotateY(this.currentAnimationMatrix, this.currentAnimationMatrix, incrementRotation[1]);
/*
        mat4.rotateX(this.currentAnimationMatrix, this.currentAnimationMatrix, incrementRotation[0]);
        mat4.rotateZ(this.currentAnimationMatrix, this.currentAnimationMatrix, incrementRotation[2]);
        mat4.translate(this.currentAnimationMatrix, this.currentAnimationMatrix, vec3.fromValues(... incrementTranslation));
        mat4.scale(this.currentAnimationMatrix, this.currentAnimationMatrix, vec3.fromValues(... incrementScale));
*/
        
        if(timeInterval >= getTime(this.currentFrame)) {
            this.currentFrame++;
            if(this.currentFrame >= this.keyframes.length) {
                this.isAnimationDone = true;
            }
        }
    }

    apply() {
        this.scene.multMatrix(this.currentAnimationMatrix);
    }

}