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
        this.gui.addFolder("Cameras");

        // add a group of controls (and open/expand by defult)

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
        // Add each light, its name and behaviour to folder
        for(var key in lights) {
            lightsFolder.add(this.scene.lightStates, key)
                .name(key)
                .onChange(boolean => this.scene.lightStates[key] = (boolean === true ? true : false ));
        }
    }
  
}