class MyMbrane{
    constructor(scene){
        this.scene=scene;
        this.validPlay=null;
        this.myGameBoard=null;
        this.valueP1=null;
        this.valueP2=null;
        this.initBoard();
      
    }
    initBoard(){
             this.validPlay=1;
            let handleReply=function(data){
            if(data.target.status==200){
                this.myGameBoard = JSON.parse(JSON.stringify(data.target.response));
            }
            }.bind(this);

        myServer.initBoard(handleReply);
    }
    makeMoveP1(Line,Col,Number2){

        let handleReply=function(data){
            if(data.target.status==200){
                
                this.myGameBoard = JSON.parse(JSON.stringify(data.target.response));
                console.log(this.myGameBoard);
            }
            }.bind(this);
   
        myServer.makeMoveP1(Line,Col,Number2,this.myGameBoard,handleReply);
        
    }

    makeMoveP2(Line,Col,Number2){

        let handleReply=function(data){
            if(data.target.status==200){
                this.myGameBoard = JSON.parse(JSON.stringify(data.target.response));
                console.log(this.myGameBoard);
            }
            }.bind(this);
        myServer.makeMoveP2(Line,Col,Number2,this.myGameBoard,handleReply);
    }

   checkMove(Line,Col,Number2){
   
        let handleReply=function(data){
                if(data.target.status==200){
                    this.validPlay = JSON.parse(data.target.response);
                    console.log(this.validPlay); 
                }
            }.bind(this);

        myServer.checkMove(Line,Col,Number2,this.myGameBoard,handleReply);
      
    }

    getValue(Board,Player){
        let handleReply=function(data){
            if(data.target.status==200){
                    if(Player==1){
                        this.valueP1 = JSON.parse(data.target.response);
                        console.log("MBRANE.JS VALUE PLAYER 1   "+ this.valueP1); 
                     }  
                     if(Player==2){
                        this.valueP2 = JSON.parse(data.target.response);
                        console.log("MBRANE.JS VALUE PLAYER 2   "+ this.valueP2); 
                     }  
            }
        }.bind(this);
        myServer.getValue(Board,Player,handleReply)
    }

}