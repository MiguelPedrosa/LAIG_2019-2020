class MySecurityCamera extends CGFobject {
    constructor(scene) {
        super(scene);
        this.rectangle = new MyRectangle(scene, 0, 0.5,1,-1,-0.5);
        this.shader = new CGFshader (scene.gl,"shaders/rect.vert", "shaders/rect.frag");
       
    }

    display(){
    	//ativar shader, ativar textura, display retangulo, voltar a ativcar default shader.
    	 this.scene.setActiveShader(this.shader);
    	 this.scene.RTTtexture.bind();
    	 this.rectangle.display();
        
    	 this.scene.setActiveShader(this.scene.defaultShader);
    }
    update(t){
         this.shader.setUniformsValues({ timeFactor: (t / 1000) % 100 });
    }
}