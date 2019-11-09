var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX           = 0;
var VIEWS_INDEX           = 1;
var GLOBALS_INDEX         = 2;
var LIGHTS_INDEX          = 3;
var TEXTURES_INDEX        = 4;
var MATERIALS_INDEX       = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX      = 7;
var PRIMITIVES_INDEX      = 8;
var COMPONENTS_INDEX      = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.animations = [];

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];
        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <globals>
        if ((index = nodeNames.indexOf("globals")) == -1)
            return "tag <globals> missing";
        else {
            if (index != GLOBALS_INDEX)
                this.onXMLMinorError("tag <globals> out of order");

            //Parse globals block
            if ((error = this.parseGlobals(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1)
            return "tag <animations> missing";
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {

        this.views = [];

        const children = viewsNode.children;
        var viewCount = 0;

        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName === "perspective") {
                // Create perspective camera
                if (this.createPerspective(children[i]) == null)
                    //Increment view if no problems were found
                    viewCount++;
            } else if (children[i].nodeName === "ortho") {
                // Create ortho camera
                if (this.createOrtho(children[i]) == null)
                    //Increment view if no problems were found
                    viewCount++;
            } else {
                console.log("Camera named " + children[i].nodeName + " wasn't parsed, was instead ignored");
            }
        }

        if (viewCount === 0)
            return "Error: No camera was parsed"

        this.defaultCameraID = this.reader.getString(viewsNode, 'default');

        if (this.defaultCameraID == null || this.views[this.defaultCameraID] == null) {
            this.defaultCameraID = Object.keys(this.views)[0];
            console.warn("Missing default view. Assuming default as node with id: " + defaultCameraID);
        }

        this.log("Parsed views");
        return null;
    }

    createPerspective(perspectiveNode) {

        const viewID = this.reader.getString(perspectiveNode, 'id');
        if (viewID == null)
            return "Missing ID attribute from a view";
        if (this.views[viewID] != null) {
            console.warn("View ID value " + viewID + " is duplicated. Only first is used");
            return null;
        }

        // Parse atributes near, far and angle. In case missing, assume values
        var near = this.reader.getFloat(perspectiveNode, 'near');
        if (near == null) {
            near = 0.1;
            console.warn("Missing atribute near on node " + viewID + ". Using value " + near);
        }

        var far = this.reader.getFloat(perspectiveNode, 'far');
        if (far == null) {
            far = 10;
            console.warn("Missing atribute far on node " + viewID + ". Using value " + far);
        }
        if (far <= near) {
            const extraDistance = 10;
            far = near + extraDistance;
            console.warn("Error in view " + viewID + ": Far isn't bigger than near. Addind to far extra units: " + extraDistance);
        }
        var angle = this.reader.getFloat(perspectiveNode, 'angle');
        if (angle == null) {
            angle = 45;
            console.warn("Missing atribute angle on node " + viewID + ". Assuming an angle of " + angle);
        }

        // Parse child nodes: 'from' and 'to'. In case of error assumes values
        const perspectiveChildren = perspectiveNode.children;
        const perspectiveChildrenNames = [];
        for (var i = 0; i < perspectiveChildren.length; i++)
            perspectiveChildrenNames.push(perspectiveChildren[i].nodeName);

        var from = null;
        const fromIndex = perspectiveChildrenNames.indexOf('from');
        if (fromIndex == -1) {
            console.warn("Error in view node " + viewID + ": No 'from' node found. Assuming origin.");
            from = [0, 0, 0];
        } else {
            var error = "from perspective node. Node id = " + viewID;
            from = this.parseCoordinates3D(perspectiveChildren[fromIndex], error);
            if (!Array.isArray(from)) {
                console.warn("Values of view node " + viewID + " were invalid. Assuming origin.");
                from = [0, 0, 0];
            }
        }

        var to = null;
        const toIndex = perspectiveChildrenNames.indexOf('to');
        if (toIndex == -1) {
            const distance = 10;
            console.warn("Error in view node 'from' of " + viewID + ": No 'to' node found. Assuming translation from 'from' by " + distance);
            to = [from[0] + distance, from[1] + distance, from[2] + distance];
        } else {
            var error = "to perspective node. Node id = " + viewID;
            to = this.parseCoordinates3D(perspectiveChildren[toIndex], error);
            if (!Array.isArray(to)) {
                const distance = 10;
                console.warn("Values of view node 'to' of " + viewID + " were invalid. Assuming distance from near.");
                to = [from[0] + distance, from[1] + distance, from[2] + distance];
            }
        }

        this.views[viewID] = new CGFcamera(angle * DEGREE_TO_RAD, near, far, vec3.fromValues(...from), vec3.fromValues(...to));

        return null
    }

    createOrtho(orthoNode) {

        const viewID = this.reader.getString(orthoNode, 'id');
        if (viewID == null)
            return "Missing ID attribute from a view";
        if (this.views[viewID] != null) {
            console.warn("View ID value " + viewID + " is duplicated. Only first is used");
            return null;
        }

        // Parse atributes near, far, left, right, top and bottom. In case missing, assume values
        var near = this.reader.getFloat(orthoNode, 'near');
        if (near == null) {
            near = 0.1;
            console.warn("Missing atribute near on node " + viewID + ". Using value " + near);
        }
        var far = this.reader.getFloat(orthoNode, 'far');
        if (far == null) {
            far = 10;
            console.warn("Missing atribute far on node " + viewID + ". Using value " + far);
        }
        if (far <= near) {
            const extraDistance = 10;
            far = near + extraDistance;
            console.warn("Error in view " + viewID + ": Far isn't bigger than near. Addind to far extra units: " + extraDistance);
        }
        var left = this.reader.getFloat(orthoNode, 'left');
        if (left == null) {
            left = 10;
            console.warn("Missing atribute left on node " + viewID + ". Using value " + left);
        }
        var right = this.reader.getFloat(orthoNode, 'right');
        if (right == null) {
            right = 10;
            console.warn("Missing atribute right on node " + viewID + ". Using value " + right);
        }
        var top = this.reader.getFloat(orthoNode, 'top');
        if (top == null) {
            top = 10;
            console.warn("Missing atribute top on node " + viewID + ". Using value " + top);
        }
        var bottom = this.reader.getFloat(orthoNode, 'bottom');
        if (bottom == null) {
            bottom = 10;
            console.warn("Missing atribute bottom on node " + viewID + ". Using value " + bottom);
        }

        // Parse child nodes: 'from' and 'to'. In case of error assumes values
        const orthoChildren = orthoNode.children;
        const orthoChildrenNames = [];
        for (var i = 0; i < orthoChildren.length; i++)
            orthoChildrenNames.push(orthoChildren[i].nodeName);

        var from = null;
        const fromIndex = orthoChildrenNames.indexOf('from');
        if (fromIndex == -1) {
            console.warn("Error in view node " + viewID + ": No 'from' node found. Assuming origin.");
            from = [0, 0, 0];
        } else {
            var error = "from ortho node. Node id = " + viewID;
            from = this.parseCoordinates3D(orthoChildren[fromIndex], error);
            if (!Array.isArray(from)) {
                console.warn("Values of view node " + viewID + " were invalid. Assuming origin.");
                from = [0, 0, 0];
            }
        }

        var to = null;
        const toIndex = orthoChildrenNames.indexOf('to');
        if (toIndex == -1) {
            const distance = 10;
            console.warn("Error in view node 'from' of " + viewID + ": No 'to' node found. Assuming translation from 'from' by " + distance);
            to = [from[0] + distance, from[1] + distance, from[2] + distance];
        } else {
            var error = "to ortho node. Node id = " + viewID;
            to = this.parseCoordinates3D(orthoChildren[toIndex], error);
            if (!Array.isArray(to)) {
                const distance = 10;
                console.warn("Values of view node 'to' of " + viewID + " were invalid. Assuming distance from near.");
                to = [from[0] + distance, from[1] + distance, from[2] + distance];
            }
        }

        var up = null;
        const upIndex = orthoChildrenNames.indexOf('up');
        if (upIndex == -1) {
            console.log("Missing value in view node " + viewID + ": No 'up' node found. Assuming default [0, 1, 0]");
            up = [0, 1, 0];
        } else {
            var error = "up ortho node. Node id = " + viewID;
            up = this.parseCoordinates3D(orthoChildren[upIndex], error);
            if (!Array.isArray(up)) {
                console.warn("Values of view node 'up' of " + viewID + " were invalid. Assuming default [0, 1, 0]");
                up = [0, 1, 0];
            }
        }

        this.views[viewID] = new CGFcameraOrtho(left, right, bottom, top, near, far,
            vec3.fromValues(...from),
            vec3.fromValues(...to),
            vec3.fromValues(...up));

        return null
    }

    /**
     * Parses the <globals> node.
     * @param {globals block element} globalsNode
     */
    parseGlobals(globalsNode) {

        var children = globalsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed globals");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            } else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux === true || aux === false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            enableLight = aux || 1;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                } else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }

            // Parse attenuation
            var attenuationConstant = 0;
            var attenuationLinear = 0;
            var attenuationQuadratric = 0;
            var attenuationIndex = nodeNames.indexOf('attenuation');
            if (attenuationIndex == -1) {
                console.warn("Missing attenuation node in light " + lightId + ". Assuming linear of 1");
                attenuationConstant = 0;
                attenuationLinear = 1;
                attenuationQuadratric = 0;
            }
            attenuationConstant = this.reader.getFloat(grandChildren[attenuationIndex], 'constant');
            attenuationLinear = this.reader.getFloat(grandChildren[attenuationIndex], 'linear');
            attenuationQuadratric = this.reader.getFloat(grandChildren[attenuationIndex], 'quadratic');
            if (attenuationConstant == null || attenuationLinear == null || attenuationQuadratric == null ||
                !((attenuationConstant > 0 && attenuationConstant <= 1 && attenuationLinear == 0 && attenuationQuadratric == 0) ||
                    (attenuationLinear > 0 && attenuationLinear <= 1 && attenuationConstant == 0 && attenuationQuadratric == 0) ||
                    (attenuationQuadratric > 0 && attenuationQuadratric <= 1 && attenuationLinear == 0 && attenuationConstant == 0))) {

                console.warn("Attenuation values on light " + lightId + " were invalid. Assuming 0, 1, 0");
                attenuationConstant = 0;
                attenuationLinear = 1;
                attenuationQuadratric = 0;
            }
            global.push([attenuationConstant, attenuationLinear, attenuationQuadratric]);

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                } else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight])
            }

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        this.textures = [];

        //For each texture in textures block, check ID and file URL
        var children = texturesNode.children;

        for (var j = 0; j < children.length; j++) {
            if (children[j].nodeName == "texture") {

                var textureID = this.reader.getString(children[j], 'id');

                if (this.textures[textureID] != null)
                    console.warn("ERROR: already has " + textureID + "texture");
                else {
                    var file = this.reader.getString(children[j], "file");
                    var texture = new CGFtexture(this.scene, file);
                    if (texture == null)
                        return "Couldn't find texture file";
                    else
                        this.textures[textureID] = texture;
                }

            } else
                return "ERROR: not texture node";
        }

        if (this.textures.size == 0)
            return "ERROR: invalid number of textures";

    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            this.parseSingleMaterial(children[i]);
        }

        this.log("Parsed materials");
        return null;
    }

    /**
     * Parses a single node of the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseSingleMaterial(materialNode) {

        // Get id of the current material
        var materialID = this.reader.getString(materialNode, 'id');
        if (materialID == null)
            return "no ID defined for material";

        // Checks for repeated IDs
        if (this.materials[materialID] != null)
            return "ID must be unique for each light (conflict: ID = " + materialID + ")";

        // Read shininess
        var shininess = this.reader.getFloat(materialNode, 'shininess');

        if (materialID == null || shininess == null) return "ERROR: null shininess or id!";

        //id can't be inherit. Must guarantee that
        if (materialID == "inherit") return "ERROR: material can't be inherit";
        //Verify if that material is already on the array
        if (this.materials[materialID] != null) return "ERROR: material already exists!";

        this.materials[materialID] = {};
        var children = materialNode.children;
        var nodeNames = [];
        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        if (materialNode.getElementsByTagName('emission').length > 1 || materialNode.getElementsByTagName('ambient').length > 1 ||
            materialNode.getElementsByTagName('diffuse').length > 1 || materialNode.getElementsByTagName('specular').length > 1)
            return "no more than one element at the same type may be defined in material";

        // gets element indices
        var eIndex = nodeNames.indexOf("emission");
        var aIndex = nodeNames.indexOf("ambient");
        var dIndex = nodeNames.indexOf("diffuse");
        var sIndex = nodeNames.indexOf("specular");

        //R,G,B,A
        var emissionr, emissiong, emissionb, emissiona;
        var ambientr, ambientg, ambientb, ambienta;
        var diffuser, diffuseg, diffuseb, diffusea;
        var specularr, specularg, specularb, speculara;

        if (sIndex == -1) return "ERROR: parsing specular ";
        else {
            specularr = this.reader.getFloat(children[sIndex], 'r');
            specularg = this.reader.getFloat(children[sIndex], 'g');
            specularb = this.reader.getFloat(children[sIndex], 'b');
            speculara = this.reader.getFloat(children[sIndex], 'a');
        }
        if (dIndex == -1) return "ERROR: parsing diffuse ";
        else {
            diffuser = this.reader.getFloat(children[dIndex], 'r');
            diffuseg = this.reader.getFloat(children[dIndex], 'g');
            diffuseb = this.reader.getFloat(children[dIndex], 'b');
            diffusea = this.reader.getFloat(children[dIndex], 'a');
        }
        if (aIndex == -1) return "ERROR: parsing ambient ";
        else {
            ambientr = this.reader.getFloat(children[aIndex], 'r');
            ambientg = this.reader.getFloat(children[aIndex], 'g');
            ambientb = this.reader.getFloat(children[aIndex], 'b');
            ambienta = this.reader.getFloat(children[aIndex], 'a');
        }
        if (eIndex == -1) return "ERROR: parsing emission ";
        else {
            emissionr = this.reader.getFloat(children[eIndex], 'r');
            emissiong = this.reader.getFloat(children[eIndex], 'g');
            emissionb = this.reader.getFloat(children[eIndex], 'b');
            emissiona = this.reader.getFloat(children[eIndex], 'a');
        }

        //verify if values are valid!
        if (specularr == null || specularr < 0 || specularr > 1 || specularg == null || specularg < 0 || specularg > 1 ||
            specularb == null || specularb < 0 || specularb > 1 || speculara == null || speculara < 0 || speculara > 1 ||
            diffuser == null || diffuser < 0 || diffuser > 1 || diffuseg == null || diffuseg < 0 || diffuseg > 1 ||
            diffuseb == null || diffuseb < 0 || diffuseb > 1 || diffusea == null || diffusea < 0 || diffusea > 1 ||
            ambientr == null || ambientr < 0 || ambientr > 1 || ambientg == null || ambientg < 0 || ambientg > 1 ||
            ambientb == null || ambientb < 0 || ambientb > 1 || ambienta == null || ambienta < 0 || ambienta > 1 ||
            emissionr == null || emissionr < 0 || emissionr > 1 || emissiong == null || emissiong < 0 || emissiong > 1 ||
            emissionb == null || emissionb < 0 || emissionb > 1 || emissiona == null || emissiona < 0 || emissiona > 1
        )
            return "ERROR: values invalid or null!! Must be >0 & <1 !!";

        var newMaterial = new CGFappearance(this.scene);

        newMaterial.setShininess(shininess);
        newMaterial.setEmission(emissionr, emissiong, emissionb, emissiona);
        newMaterial.setAmbient(ambientr, ambientg, ambientb, ambienta);
        newMaterial.setDiffuse(diffuser, diffuseg, diffuseb, diffusea);
        newMaterial.setSpecular(specularr, specularg, specularb, speculara);

        this.materials[materialID] = newMaterial;

    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        this.transformations = [];

        var grandChildren = [];

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            var transfMatrix = mat4.create();

            for (var j = 0; j < grandChildren.length; j++) {
                switch (grandChildren[j].nodeName) {
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'scale':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "rotate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);

                        break;
                    case 'rotate':
                        // angle
                        var axis = this.reader.getString(grandChildren[j], 'axis');
                        var angle = this.reader.getFloat(grandChildren[j], 'angle');
                        var put_axis = [];

                        if (axis == null || angle == null) {
                            return "ERROR: axis or angle missing!"
                        }
                        if (axis == "x") {
                            put_axis = [1, 0, 0];
                        } else if (axis == "y") {
                            put_axis = [0, 1, 0];
                        } else if (axis == "z") {
                            put_axis = [0, 0, 1];
                        } else {
                            throw "Unexpected axis value. Expected x, y, z; got ${axis}"
                        }
                        transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle * DEGREE_TO_RAD, put_axis);
                        break;
                }
            }
            this.transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
        return null;
    }

    /**
     * Parses the <animations> block.
     * @param {animations block element} animationsNode
     */
    parseAnimations(animationsNode) {
        const children = animationsNode.children;

        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "animation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            } else {
                this.parseSingleAnimation(children[i]);
            }
        }
        
        this.log("Parsed animations");
        return null;
    }

    parseSingleAnimation(animationNode) {

        // Get id of the current animation.
        var animationID = this.reader.getString(animationNode, 'id');
        if (animationID == null) {
            console.warn("no ID defined for animation");
            return;
        }
        
        // Checks for repeated IDs.
        if (this.animations[animationID] != null) {
            console.warn("ID must be unique for each transformation (conflict: ID = " + animationID + ")");
            return;
        }

        const keyframesNode = animationNode.children;
        var keyFrames = []; //Variable to store all processed keyframes
        for(let i = 0; i < keyframesNode.length; i++) {
            const currentKeyFrame = keyframesNode[i];
            
            // Parse time
            const time = this.reader.getFloat(currentKeyFrame, 'instant');
            if(time == null) {
                console.warn("Missing instant atribute in animation node: " + animationID);
                continue;
            }
            if(time <= 0) {
                console.warn("Instant atribute in animation node: " + animationID + 
                    " was smaller or equal to 0. Couldn't be parsed");
                continue;
            }
            // Boolean to check if timestamp already exists, done this way
            // since there isn't a way to skip/continue an outer loop
            var isRepeted = false;
            for(var k in keyFrames) {
                if(k.time === time) {
                    console.warn("Animation node: " + animationID + 
                        " has repeted instants. Only first will be parsed");
                    isRepeted = true;
                }
            }
            if(isRepeted === true) continue;

            // Parse transformations
            var transformationMatrix = mat4.create();
            const keyTransformations = currentKeyFrame.children;
            // Order expected is: translate, rotate and finally scale
            if(keyTransformations.length != 3) {
                console.warn("Key frame " + animationID + " at instant " + time + 
                    " contains wrong amount of transformations. Won't be parsed");
                continue;
            }
            // Parse transformation: translate
            if(keyTransformations[0].nodeName !== 'translate') {
                console.warn("First transformation node of keyframe " + time +
                    " of node " + animationID + " isn't translate. Assumed no translation");
            } else {
                var coordinates = this.parseCoordinates3D(keyTransformations[0], "translate transformation for ID " + animationID);
                if (!Array.isArray(coordinates)) {
                    console.warn("Couldn't parse translate coordenates of keyframe " + time + 
                        " of node " + animationID + ". No translation assumed");
                } else {
                    transformationMatrix = mat4.translate(transformationMatrix, transformationMatrix, coordinates);
                }
            }
            // Parse transformation: scale
            if(keyTransformations[1].nodeName !== 'scale') {
                console.warn("First transformation node of keyframe " + time +
                    " of node " + animationID + " isn't scale. Assumed no translation");
            } else {
                var coordinates = this.parseCoordinates3D(keyTransformations[1], "scale transformation for ID " + animationID);
                if (!Array.isArray(coordinates)) {
                    console.warn("Couldn't parse scale coordenates of keyframe " + time + 
                        " of node " + animationID + ". No translation assumed");
                } else {
                    transformationMatrix = mat4.scale(transformationMatrix, transformationMatrix, coordinates);
                }
            }
            // Parse transformation: rotate
            if(keyTransformations[2].nodeName !== 'rotate') {
                console.warn("First transformation node of keyframe " + time +
                    " of node " + animationID + " isn't rotate. Assumed no translation");
            } else {
                let rotationX = this.reader.getFloat(keyTransformations[2], 'angle_x');
                if(rotationX == null || rotationX < 0 || rotationX > 360) {
                    console.warn("RotationX of keyframe " + time + " of node " + animationID + 
                        " had invalid value. Assumed no rotation");
                    rotationX = 0;
                }
                mat4.rotate(transformationMatrix, transformationMatrix, rotationX * DEGREE_TO_RAD, [1, 0, 0]);
                let rotationY = this.reader.getFloat(keyTransformations[2], 'angle_y');
                if(rotationY == null || rotationY < 0 || rotationY > 360) {
                    console.warn("RotationY of keyframe " + time + " of node " + animationID + 
                        " had invalid value. Assumed no rotation");
                } else {
                    mat4.rotate(transformationMatrix, transformationMatrix, rotationY * DEGREE_TO_RAD, [0, 1, 0]);
                }
                let rotationZ = this.reader.getFloat(keyTransformations[2], 'angle_z');
                if(rotationZ == null || rotationZ < 0 || rotationZ > 360) {
                    console.warn("RotationZ of keyframe " + time + " of node " + animationID + 
                        " had invalid value. Assumed no rotation");
                } else {
                    mat4.rotate(transformationMatrix, transformationMatrix, rotationZ * DEGREE_TO_RAD, [0, 0, 1]);
                }
            }
            /* Increase index by one because id=0 has to be an identity matrix
            ** that is inserted when constructor is called 
            */
            keyFrames[i +1] = {
                time: time,
                matrix: transformationMatrix
            }
        }

        this.animations[animationID] = new KeyFrameAnimation(this.scene, keyFrames);
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];

        var grandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus')) {
                console.warn("There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere or torus)");
                continue;
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1))) {
                    console.warn("unable to parse x1 of the primitive coordinates for ID = " + primitiveId);
                    continue;
                }

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1))) {
                    console.warn("unable to parse y1 of the primitive coordinates for ID = " + primitiveId);
                    continue;
                }

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2))) {
                    console.warn("unable to parse x2 of the primitive coordinates for ID = " + primitiveId);
                    continue;
                }

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2))) {
                    console.warn("unable to parse y2 of the primitive coordinates for ID = " + primitiveId);
                    continue;
                }

                var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

                this.primitives[primitiveId] = rect;
            } else if (primitiveType == 'triangle') {
                // Construct first Dot
                var dot1 = {
                    x: 0,
                    y: 0,
                    z: 0
                };
                // x1
                dot1.x = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(dot1.x != null && !isNaN(dot1.x)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                dot1.y = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(dot1.y != null && !isNaN(dot1.y)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // z1
                dot1.z = this.reader.getFloat(grandChildren[0], 'z1');
                if (!(dot1.z != null && !isNaN(dot1.z)))
                    return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;

                // Construct secound Dot
                var dot2 = {
                    x: 0,
                    y: 0,
                    z: 0
                };
                // x2
                dot2.x = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(dot2.x != null && !isNaN(dot2.x)))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                dot2.y = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(dot2.y != null && !isNaN(dot2.y)))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                // z2
                dot2.z = this.reader.getFloat(grandChildren[0], 'z2');
                if (!(dot2.z != null && !isNaN(dot2.z)))
                    return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId;

                // Construct third Dot
                var dot3 = {
                    x: 0,
                    y: 0,
                    z: 0
                };
                // x3
                dot3.x = this.reader.getFloat(grandChildren[0], 'x3');
                if (!(dot3.x != null && !isNaN(dot3.x)))
                    return "unable to parse x3 of the primitive coordinates for ID = " + primitiveId;

                // y3
                dot3.y = this.reader.getFloat(grandChildren[0], 'y3');
                if (!(dot3.y != null && !isNaN(dot3.y)))
                    return "unable to parse y3 of the primitive coordinates for ID = " + primitiveId;

                // z3
                dot3.z = this.reader.getFloat(grandChildren[0], 'z3');
                if (!(dot3.z != null && !isNaN(dot3.z)))
                    return "unable to parse z3 of the primitive coordinates for ID = " + primitiveId;


                var triangle = new MyTriangle(this.scene, primitiveId,
                    dot1, dot2, dot3);

                this.primitives[primitiveId] = triangle;

            } else if (primitiveType == 'cylinder') {
                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                // top
                var top = this.reader.getFloat(grandChildren[0], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top of the primitive coordinates for ID = " + primitiveId;

                // base
                var base = this.reader.getFloat(grandChildren[0], 'base');
                if (!(base != null && !isNaN(base)))
                    return "unable to parse base of the primitive coordinates for ID = " + primitiveId;

                // height
                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height)))
                    return "unable to parse height of the primitive coordinates for ID = " + primitiveId;

                var cyl = new MyCylinder(this.scene, primitiveId, base, top, height, slices, stacks);

                this.primitives[primitiveId] = cyl;
            } else if (primitiveType == 'sphere') {

                // radius
                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius)))
                    return "unable to parse radius of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                var sphere = new MySphere(this.scene, primitiveId, radius, slices, stacks);

                this.primitives[primitiveId] = sphere;
            } else if (primitiveType == 'torus') {
                // inner radius
                var inner = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(inner != null && !isNaN(inner)))
                    return "unable to parse inner of the primitive coordinates for ID = " + primitiveId;

                // outer radius
                var outer = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(outer != null && !isNaN(outer)))
                    return "unable to parse outer of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // loops
                var loops = this.reader.getFloat(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops)))
                    return "unable to parse loops of the primitive coordinates for ID = " + primitiveId;

                var torus = new MyTorus(this.scene, primitiveId, inner, outer, slices, loops);
                this.primitives[primitiveId] = torus;
            } else {
                console.warn("To do: Parse other primitives.");
            }
        }

        this.log("Parsed primitives");
        return null;
    }

    /**
     * Parses the <components> block.
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {

        this.components = [];

        var children = componentsNode.children;
        // Any number of components.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            this.parseSingleComponent(children[i]);

        }
        this.log("Parsed components");
    }

    /**
     * Parses a single node of the <component> node.
     * @param {component block element} componentNode
     */
    parseSingleComponent(componentNode) {

        //creates our transformation Matrix.
        var transformationMat = mat4.create();
        var componentMaterials = [];
        var componentTexture = {
            id: "",
            length_s: 0,
            length_t: 0
        }
        var componentChildren = [];

        // Get id of the current component.
        var componentID = this.reader.getString(componentNode, 'id');
        if (componentID == null) {
            console.warn("no ID defined for componentID");
            return null;
        }

        // Checks for repeated IDs.
        if (this.components[componentID] != null) {
            console.warn("ID must be unique for each component (conflict: ID = " + componentID + ")");
            return null;
        }

        var children = componentNode.children;

        var nodeNames = [];
        for (var j = 0; j < children.length; j++) {
            nodeNames.push(children[j].nodeName);
        }

        var transformationIndex = nodeNames.indexOf("transformation");
        if (transformationIndex == -1) {
            console.warn("node " + componentID + " does not contain a transformation node");
            return null;
        }
        var animationIndex = nodeNames.indexOf("animationref");
        var materialsIndex = nodeNames.indexOf("materials");
        if (materialsIndex == -1) {
            console.warn("node " + componentID + " does not contain a material node");
            return null;
        }
        var textureIndex = nodeNames.indexOf("texture");
        if (textureIndex == -1) {
            console.warn("node " + componentID + " does not contain a texture node");
            return null;
        }
        var childrenIndex = nodeNames.indexOf("children");
        if (childrenIndex == -1) {
            console.warn("node " + componentID + " does not contain a children node");
            return null;
        }

        /* Transformations */
        var transformationChildren = children[transformationIndex].children;
        for (var j = 0; j < transformationChildren.length; j++) {
            // VERIFY IF TRANSFORMATION IS "transformationref"
            if (transformationChildren[j].nodeName == "transformationref") {

                const transId = this.reader.getString(transformationChildren[j], "id");

                if (transId != null && this.transformations[transId] != null) {
                    transformationMat = this.transformations[transId];
                } else {
                    console.warn("Couldn't identify transformationref. Assuming identity matrix");
                    mat4.identity(transformationMat);
                }
            }

            // Scale TRANSFORMATION
            else if (transformationChildren[j].nodeName == "scale") {

                var sX = this.reader.getFloat(transformationChildren[j], 'x');
                var sY = this.reader.getFloat(transformationChildren[j], 'y');
                var sZ = this.reader.getFloat(transformationChildren[j], 'z');

                //All variables must have a value greater than 0
                if (sX == null || sY == null || sZ == null || sX == 0 || sY == 0 || sZ == 0) {
                    console.warn("ERROR: invalid scaling values on node " + componentID);
                    sX = 1;
                    sY = 1;
                    sZ = 1;
                }

                //apply the scaling.
                mat4.scale(transformationMat, transformationMat, [sX, sY, sZ]);
            }
            // Translate transformation
            else if (transformationChildren[j].nodeName == "translate") {

                var tX = this.reader.getFloat(transformationChildren[j], 'x');
                var tY = this.reader.getFloat(transformationChildren[j], 'y');
                var tZ = this.reader.getFloat(transformationChildren[j], 'z');

                //tx, ty, tz can´t be NULL
                if (tX == null || tY == null || tZ == null) {
                    console.warn("ERROR: translate values can´t be NULL");
                    tX = 0;
                    tY = 0;
                    tZ = 0;
                }

                mat4.translate(transformationMat, transformationMat, [tX, tY, tZ]);
            }
            // Rotate transformation
            else if (transformationChildren[j].nodeName == "rotate") {

                var axis = this.reader.getString(transformationChildren[j], "axis");
                var angle = this.reader.getFloat(transformationChildren[j], "angle");

                if (angle == null || axis == null)
                    return "ERROR: angle or axis value invalid";
                var axisNew = [];

                if (axis == 'x') axisNew = [1, 0, 0];
                else if (axis == 'y') axisNew = [0, 1, 0];
                else if (axis == 'z') axisNew = [0, 0, 1];
                else return "ERROR: axis value does not exist"

                mat4.rotate(transformationMat, transformationMat, angle * DEGREE_TO_RAD, axisNew);
            } else {
                console.warn("Unknown transformation was found:" + transformationChildren[j].nodeName + " in component " + componentID);
            }
        }

        /* Animation */
        var animationID = null;
        if(animationIndex != -1) {
            var animation = children[animationIndex];
            animationID = this.reader.getString(animation, 'id');
            if(animationID == null) {
                console.warn("Missing animation ID from component " + componentID);
            }
        }
        
        /* Materials */
        var materialChildren = children[materialsIndex].children;
        for (var j = 0; j < materialChildren.length; j++) {
            var materialID = this.reader.getString(materialChildren[j], 'id');
            if (materialID != null) {
                if (componentID == this.root && materialID == "inherit") {
                    console.warn("Root can't have inherit");
                } else if (this.materials[materialID] == null && materialID != "inherit") {
                    console.warn("Material not defined: " + materialID + " on node " + componentID);
                } else
                    componentMaterials.push(materialID);
            } else {
                console.warn("ERROR: parsing materials. Missing an id of node " + componentID);
            }
        }
        if (componentMaterials.length < 1) {
            console.warn("Component " + componentID + " must have at least one material");
            return null;
        }


        /* Texture */
        const textureNode = children[textureIndex];
        const textureID = this.reader.getString(textureNode, 'id');
        var length_s = 0;
        var length_t = 0;

        if (textureID == null)
            return "ERROR: failed to parse texture";
        if (textureID !== "inherit" && textureID !== "none") {
            length_s = this.reader.getFloat(textureNode, 'length_s');
            length_t = this.reader.getFloat(textureNode, 'length_t');
            if (length_t == null) {
                const defaultValue = 1.0;
                console.warn("Missing length_t in texture named " + textureID + ". Assuming " + defaultValue);
                length_t = defaultValue;
            }
            if (length_s == null) {
                const defaultValue = 1.0;
                console.warn("Missing length_s in texture named " + textureID + ". Assuming " + defaultValue);
                length_s = defaultValue;
            }
        }
        if (componentID == this.root && textureID == "inherit") {
            console.warn("ERROR: root can't inherit");
            return null;
        }
        if (this.textures[textureID] == null && textureID != "inherit" && textureID != "none") {
            console.warn("ERROR: failed to parse texture of id = " + textureID);
            return null;
        }

        componentTexture["id"] = textureID;
        componentTexture["length_s"] = length_s;
        componentTexture["length_t"] = length_t;


        /* Children */
        var childrenChildren = children[childrenIndex].children;
        for (var j = 0; j < childrenChildren.length; j++) {
            const childID = this.reader.getString(childrenChildren[j], 'id');
            if (childID == null) {
                console.warn("Couldn't read child id of component " + componentID);
                continue;
            }
            if (childrenChildren[j].nodeName === "componentref" || childrenChildren[j].nodeName === "primitiveref") {
                componentChildren.push(childID);
            } else {
                console.warn("Node name of component " + componentID + " couldn't be identified: " + childrenChildren[j].nodeName);
            }
        }

        var newComponent = {
            transformation: transformationMat,
            animationID: animationID,
            materials: componentMaterials,
            materialsIndex: 0,
            texture: componentTexture,
            children: componentChildren
        };
        this.components[componentID] = newComponent;
    }


    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        var position = [x, y, z];

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;

        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        // Display loop for transversing the scene graph
        this.processNode(this.idRoot, null, null, 1.0, 1.0);
    }


    processNode(nodeID, parentMaterial, parentTextureID, textureS, textureT) {
        // Check if current node is a primitive.
        // If it is, draw it. Else recursive call its' children
        if (this.primitives[nodeID] != null) {
            this.drawPrimitive(nodeID, textureS, textureT);
            return null;
            // If component isn«t found, the program doesn't try to draw it
        } else if (this.components[nodeID] == null) {
            console.warn("Couldn't find component named: " + nodeID);
            return null;
        }

        const currentNode = this.components[nodeID];

        // Setup Material
        var currentNodeMaterial = null;
        const materialIndex = currentNode["materialsIndex"];
        if (currentNode["materials"][materialIndex] === "inherit") {
            if (parentMaterial === "none") {
                console.warn("Attempted to apply an inherit material to component " + nodeID + " but parent has value none");
                return null;
            }
            currentNodeMaterial = parentMaterial;
        } else {
            currentNodeMaterial = this.materials[currentNode["materials"][materialIndex]];
        }

        // Setup Texture
        var currentNodeTexture = null;
        if (currentNode["texture"]["id"] === "inherit") {
            if (parentTextureID === "none") {
                console.warn("Attempted to apply an inherit texture to component " + nodeID + " but parent has value none");
            } else {
                currentNodeTexture = parentTextureID;
                currentNodeMaterial.setTexture(currentNodeTexture);
                currentNodeMaterial.apply();
            }
        } else if (currentNode["texture"]["id"] === "none") {
            currentNodeTexture = "none";
            currentNodeMaterial.setTexture(null);
            currentNodeMaterial.apply();
        } else {
            currentNodeTexture = this.textures[currentNode["texture"]["id"]];
            textureS = currentNode["texture"]["length_s"];
            textureT = currentNode["texture"]["length_t"];
            currentNodeMaterial.setTexture(currentNodeTexture);
            currentNodeMaterial.apply();
        }

        this.scene.pushMatrix();
        this.scene.multMatrix(currentNode["transformation"]);

        //Apply currentNode's animation
        if(currentNode["animationID"] != null)
            this.animations[currentNode["animationID"]].apply();

        for (var i = 0; i < currentNode["children"].length; i++) {
            this.processNode(currentNode["children"][i], currentNodeMaterial, currentNodeTexture, textureS, textureT);
        }
        this.scene.popMatrix();

    }

    drawPrimitive(id, textureS, textureT) {
        const primitiveNode = this.primitives[id];
        primitiveNode.modifyTextCoords(textureS, textureT);
        primitiveNode.display();
    }

    changeMaterialsMpressed() {
        for (var key in this.components) {
            var index = this.components[key]["materialsIndex"];
            // Increment value
            index++;
            // Value can't exceed total amount of materials
            if (index >= this.components[key]["materials"].length)
                index = 0;
            this.components[key]["materialsIndex"] = index;
        }
    }

}