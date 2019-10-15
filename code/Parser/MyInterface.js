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
        this.gui.addFolder("Lights");
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

    processKeyDown(event) {
       this.activeKeys[event.code]=true;
        if (event.code == "KeyM") {
            this.scene.graph.KeyM = true;
            console.log("1");
        }
    };

    processKeyUp(event) {
        //this.activeKeys[event.code]=false;
         if (event.code == "KeyM") {
            this.scene.changeMaterialsMpressed();
         }

         console.log("2");
            

    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }

  
}