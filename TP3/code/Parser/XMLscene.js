var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface
     */
    constructor(myinterface) {
        super();

        // Altered by the interface. Used to check if light should be on/off
        this.lightStates = [];

        this.currentCameraID = null;
        this.cameraChanged = false;

        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(100);
        this.RTTtexture = new CGFtextureRTT(this, this.gl.canvas.width, this.gl.canvas.height);
        this.securityCamera = new MySecurityCamera(this);

        this.setPickEnabled(true);

    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.fallBackCamera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
        this.camera = this.fallBackCamera;
    }


    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break; // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                this.lightStates[key] = (light[0] === true ? true : false);

                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);
                //light[6] is attenuation
                this.lights[i].setConstantAttenuation(light[6][0]);
                this.lights[i].setLinearAttenuation(light[6][1]);
                this.lights[i].setQuadraticAttenuation(light[6][2]);

                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[7]);
                    this.lights[i].setSpotExponent(light[8]);
                    this.lights[i].setSpotDirection(light[9][0], light[9][1], light[9][2]);
                } else if (light[1] == "omni") {
                    // Do nothing, all functions should have been called already
                }

                if (this.lightStates[key] === true) {
                    this.lights[i].setVisible(true);
                    this.lights[i].enable();
                } else {
                    this.lights[i].setVisible(false);
                    this.lights[i].disable();
                }

                this.lights[i].update();

                i++;
            }
        }
    }

    addSceneViews() {
        this.cameraNames = [];
        for (var view in this.graph.views) {
            this.cameraNames.push(view);
        }

        this.currentCameraID = this.graph.defaultCameraID;
        this.camera = this.graph.views[this.currentCameraID] || this.fallBackCamera;
        this.interface.setActiveCamera(this.camera);
    }

    onSelectedCameraChanged(newCameraID) {
        this.currentCameraID = newCameraID;
        this.camera = this.graph.views[this.currentCameraID];
    }

    changeMaterialsMpressed() {
        this.graph.changeMaterialsMpressed();
    }
    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }
    /** Handler called when the graph is finally loaded.
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {

        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

        this.initLights();
        this.addSceneViews();
        this.interface.addLights(this.lightStates);
        this.interface.addViews();

        this.sceneInited = true;
    }

    update(t) {
        for (var key in this.graph.animations)
            this.graph.animations[key].update(t);
        this.securityCamera.update(t);
    }

    /**
     * Displays the scene.
     */

    render(camera) {
        // ---- BEGIN Background, camera and axis setup

        this.camera = camera;
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();
        this.axis.display();

        if (this.sceneInited) {

            var lightIterator = 0;
            for (var id in this.lightStates) {
                if (this.lightStates.hasOwnProperty(id)) {
                    if (this.lightStates[id] === true) {
                        this.lights[lightIterator].enable();
                        this.lights[lightIterator].setVisible(true);
                    } else {
                        this.lights[lightIterator].disable();
                        this.lights[lightIterator].setVisible(false);
                    }
                    this.lights[lightIterator].update();
                    lightIterator++;
                }
            }
            // Draw axis
            this.setDefaultAppearance();

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }


        this.popMatrix();
        // ---- END Background, camera and axis setup
    }

    logPicking() {
        if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {
                for (var i = 0; i < this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
                    if (obj) {
                        var customId = this.pickResults[i][1];
                        console.log("Picked object: " + obj + ", with pick id " + customId);
                    }
                }
                this.pickResults.splice(0, this.pickResults.length);
            }
        }
    }

    display() {
        this.logPicking();

        var cameraAux = this.camera;
        this.RTTtexture.attachToFrameBuffer();
        for (var i in this.graph.views) {
            if (i == 'securityCamera') {
                this.render(this.graph.views[i]);

                break;
            }
        }
        this.RTTtexture.detachFromFrameBuffer();
        this.render(cameraAux);
        this.interface.setActiveCamera(this.camera);
        this.gl.disable(this.gl.DEPTH_TEST);
        this.securityCamera.display();
        this.gl.enable(this.gl.DEPTH_TEST);

    }
}