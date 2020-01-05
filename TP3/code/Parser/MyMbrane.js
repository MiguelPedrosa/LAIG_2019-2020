class MyMbrane{
    constructor(scene){
        this.scene=scene;
        this.validPlay=null;
        this.myGameBoard=null;
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
}