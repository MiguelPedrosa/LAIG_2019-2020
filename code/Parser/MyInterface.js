/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        this.initKeys();
        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyUp(event) {
        //this.activeKeys[event.code]=false;
        if (event.code == "KeyM") {
            this.scene.changeMaterialsMpressed();
        }
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }

    addLights(lights) {
        var lightsFolder = this.gui.addFolder("Lights");
        lightsFolder.open();
        for(var key in lights) {
            lightsFolder.add(this.scene.lightStates, key);
        }
    }


    addViews(views) {
        var viewNames = [];
        for(var view in views) {
            viewNames.push(view);
        }
        var viewsFolder = this.gui.add(this.scene.graph, 'views', viewNames);
        viewsFolder.onChange(viewName => {
            this.scene.currentCameraID = viewName;
            this.scene.cameraChanged = true;
        });
    }
  
}