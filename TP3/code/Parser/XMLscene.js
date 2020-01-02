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
        this.selectorCounter = 0;
        this.objectSelect = 0;
        this.squareSelect = 0;
        this.interface = myinterface;
        this.player1 = true;
        this.player2 = false;
        this.resetCam = false;
        this.usedMaterial;

        this.redMaterial = new CGFappearance(this.scene);
        this.redMaterial.setShininess(10.0);
        this.redMaterial.setEmission(1.0, 0.0, 0.0, 0.0);
        this.redMaterial.setAmbient(1.0, 0.0, 0.0, 0.0);
        this.redMaterial.setDiffuse(1.0, 0.0, 0.0, 0.0);
        this.redMaterial.setSpecular(1.0, 0.0, 0.0, 0.0);
    }


    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);
        this.endPosition = [];
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
        this.marcador = new Marcador(this, [true, true, true, true, true, false, true, true], [true, true, true, true, true, false, true, true]);
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

    addSceneThemes() {
        this.themeNames = [];
        for (var theme in this.graph.theme) {
            this.themeNames.push(theme);
        }
        this.currentThemeID = this.graph.defaultThemeID;
        this.theme = this.graph.theme[this.currentThemeID];
        this.interface.setActiveTheme(this.theme);
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
        this.marcador.display();

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
                    if (this.selectorCounter == 0 && this.pickResults[i][1] >= 82 && this.pickResults[i][1] <= 90) {
                        this.selectorCounter++;
                        this.objectSelect = this.pickResults[i][1];
                        this.selectedNumber = this.pickResults[i][0];
                    } else if (this.selectorCounter == 1 && this.pickResults[i][1] >= 1 && this.pickResults[i][1] <= 81) {
                        this.squareSelect = this.pickResults[i][1];
                        console.log("Object:" + this.objectSelect + "Square:" + this.squareSelect);
                        this.selectorCounter = 0;
                        if (this.player1 == true) {
                            this.camera.orbit("Y", DEGREE_TO_RAD * 60);
                            this.usedMaterial = ["TVMaterial"];
                            this.player1 = false;
                            this.player2 = true;
                        } else if (this.player2 == true) {
                            this.camera.orbit("Y", DEGREE_TO_RAD * -60);
                            this.usedMaterial = ["redMaterial"];
                            console.log("floor");
                            this.player1 = true;
                            this.player2 = false;
                        }
                        this.movePiece(this.selectedNumber, obj, this.squareSelect);
                    }
                }
                this.pickResults.splice(0, this.pickResults.length);
            }
        }
    }

    wait(ms) {
        var start = new Date().getTime();
        var end = start;
        while (end < start + ms) {
            end = new Date().getTime();
            this.camera.orbit("Y", DEGREE_TO_RAD * -5);
        }
    }
    parseEndPositions() {
        /*Square 1*/
        /*--------------------------------*/
        this.endPosition[1] = [-10, 9.9, -0.25];
        this.endPosition[2] = [-8.15, 9.9, -0.25];
        this.endPosition[3] = [-6.35, 9.9, -0.25];
        /*--------------------------------*/
        this.endPosition[4] = [-10, 8.05, -0.25];
        this.endPosition[5] = [-8.15, 8.05, -0.25];
        this.endPosition[6] = [-6.35, 8.05, -0.25];
        /*--------------------------------*/
        this.endPosition[7] = [-10, 6.25, -0.25];
        this.endPosition[8] = [-8.15, 6.25, -0.25];
        this.endPosition[9] = [-6.35, 6.25, -0.25];
        /*--------------------------------*/
        /*--------------------------------*/
        /*Square 2*/
        /*--------------------------------*/
        this.endPosition[10] = [-2.2, 9.9, -0.25];
        this.endPosition[11] = [-0.4, 9.9, -0.25];
        this.endPosition[12] = [1.5, 9.9, -0.25];
        /*--------------------------------*/
        this.endPosition[13] = [-2.2, 8.05, -0.25];
        this.endPosition[14] = [-0.4, 8.05, -0.25];
        this.endPosition[15] = [1.5, 8.05, -0.25];
        /*--------------------------------*/
        this.endPosition[16] = [-2.2, 6.25, -0.25];
        this.endPosition[17] = [-0.4, 6.25, -0.25];
        this.endPosition[18] = [1.5, 6.25, -0.25];
        /*--------------------------------*/
        /*--------------------------------*/
        /*Square 3*/
        /*--------------------------------*/
        this.endPosition[19] = [5.5, 9.9, -0.25];
        this.endPosition[20] = [7.3, 9.9, -0.25];
        this.endPosition[21] = [9.2, 9.9, -0.25];
        /*--------------------------------*/
        this.endPosition[22] = [5.5, 8.05, -0.25];
        this.endPosition[23] = [7.3, 8.05, -0.25];
        this.endPosition[24] = [9.2, 8.05, -0.25];
        /*--------------------------------*/
        this.endPosition[25] = [5.5, 6.25, -0.25];
        this.endPosition[26] = [7.3, 6.25, -0.25];
        this.endPosition[27] = [9.2, 6.25, -0.25];
        /*--------------------------------*/
        /*--------------------------------*/
        /*Square 4*/
        /*--------------------------------*/
        this.endPosition[28] = [-10, 2.0, -0.25];
        this.endPosition[29] = [-8.15, 2.0, -0.25];
        this.endPosition[30] = [-6.35, 2.0, -0.25];
        /*--------------------------------*/
        this.endPosition[31] = [-10, 0.2, -0.25];
        this.endPosition[32] = [-8.15, 0.2, -0.25];
        this.endPosition[33] = [-6.35, 0.2, -0.25];
        /*--------------------------------*/
        this.endPosition[34] = [-10, -1.5, -0.25];
        this.endPosition[35] = [-8.15, -1.5, -0.25];
        this.endPosition[36] = [-6.35, -1.5, -0.25];
        /*--------------------------------*/
        /*--------------------------------*/
        /*Square 5*/
        /*--------------------------------*/
        this.endPosition[37] = [-2.2, 2.0, -0.25];
        this.endPosition[38] = [-0.4, 2.0, -0.25];
        this.endPosition[39] = [1.5, 2.0, -0.25];
        /*--------------------------------*/
        this.endPosition[40] = [-2.2, 0.2, -0.25];
        this.endPosition[41] = [-0.4, 0.2, -0.25];
        this.endPosition[42] = [1.5, 0.2, -0.25];
        /*--------------------------------*/
        this.endPosition[43] = [-2.2, -1.5, -0.25];
        this.endPosition[44] = [-0.4, -1.5, -0.25];
        this.endPosition[45] = [1.5, -1.5, -0.25];
        /*--------------------------------*/
        /*--------------------------------*/
        /*Square 6*/
        /*--------------------------------*/
        this.endPosition[46] = [5.5, 2.0, -0.25];
        this.endPosition[47] = [7.3, 2.0, -0.25];
        this.endPosition[48] = [9.2, 2.0, -0.25];
        /*--------------------------------*/
        this.endPosition[49] = [5.5, 0.2, -0.25];
        this.endPosition[50] = [7.3, 0.2, -0.25];
        this.endPosition[51] = [9.2, 0.2, -0.25];
        /*--------------------------------*/
        this.endPosition[52] = [5.5, -1.5, -0.25];
        this.endPosition[53] = [7.3, -1.5, -0.25];
        this.endPosition[54] = [9.2, -1.5, -0.25];
        /*--------------------------------*/
        /*--------------------------------*/
        /*Square 7*/
        /*--------------------------------*/
        this.endPosition[55] = [-10, -5.7, -0.25];
        this.endPosition[56] = [-8.15, -5.7, -0.25];
        this.endPosition[57] = [-6.35, -5.7, -0.25];
        /*--------------------------------*/
        this.endPosition[58] = [-10, -7.5, -0.25];
        this.endPosition[59] = [-8.15, -7.5, -0.25];
        this.endPosition[60] = [-6.35, -7.5, -0.25];
        /*--------------------------------*/
        this.endPosition[61] = [-10, -9.3, -0.25];
        this.endPosition[62] = [-8.15, -9.3, -0.25];
        this.endPosition[63] = [-6.35, -9.3, -0.25];
        /*--------------------------------*/
        /*--------------------------------*/
        /*Square 8*/
        /*--------------------------------*/
        this.endPosition[64] = [-2.2, -5.7, -0.25];
        this.endPosition[65] = [-0.4, -5.7, -0.25];
        this.endPosition[66] = [1.5, -5.7, -0.25];
        /*--------------------------------*/
        this.endPosition[67] = [-2.2, -7.5, -0.25];
        this.endPosition[68] = [-0.4, -7.5, -0.25];
        this.endPosition[69] = [1.5, -7.5, -0.25];
        /*--------------------------------*/
        this.endPosition[70] = [-2.2, -9.3, -0.25];
        this.endPosition[71] = [-0.4, -9.3, -0.25];
        this.endPosition[72] = [1.5, -9.3, -0.25];
        /*--------------------------------*/
        /*--------------------------------*/
        /*Square 9*/
        /*--------------------------------*/
        this.endPosition[73] = [5.5, -5.7, -0.25];
        this.endPosition[74] = [7.3, -5.7, -0.25];
        this.endPosition[75] = [9.2, -5.7, -0.25];
        /*--------------------------------*/
        this.endPosition[76] = [5.5, -7.5, -0.25];
        this.endPosition[77] = [7.3, -7.5, -0.25];
        this.endPosition[78] = [9.2, -7.5, -0.25];
        /*--------------------------------*/
        this.endPosition[79] = [5.5, -9.3, -0.25];
        this.endPosition[80] = [7.3, -9.3, -0.25];
        this.endPosition[81] = [9.2, -9.3, -0.25];
        /*--------------------------------*/
        /*--------------------------------*/
    }
    movePiece(piece, square, squareID) {
        const startMatrix = piece.getCurrentPosition();
        const startPosition = [startMatrix[0], startMatrix[5], startMatrix[10]];

        this.parseEndPositions();
        const newAnimationID = "movementAnimation" + squareID;
        const newPieceID = "piece" + squareID;
        const bools = piece.getBools();
        const newNumber = new Number(this.graph.scene, 0.6, 0.2, bools);

        this.graph.animations[newAnimationID] = new AngularAnimation(this.graph.scene, startPosition, this.endPosition[squareID], 3);

        var newComponent = {
            transformation: mat4.create(),
            animationID: newAnimationID,

            materials: this.usedMaterial,
            materialsIndex: 0,
            texture: {
                "ID": "mesa",
                "length_s": 1.0,
                "length_t": 1.0
            },
            componentChildren: [],
            primitiveChildren: [newPieceID]
        };
        this.graph.components["mbrane"]["componentChildren"].push(newPieceID);
        this.graph.components[newPieceID] = newComponent;
        this.graph.primitives[newPieceID] = newNumber;


        console.log("Piece movement added");

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