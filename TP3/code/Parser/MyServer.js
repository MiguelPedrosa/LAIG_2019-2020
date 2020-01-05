let myServer={

    getPlogRequest: function (requestString, onSuccess, onError, port) {
        var requestPort = port || 8081;
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

        request.onload = onSuccess;

        request.onerror = onError || function(){console.log("Error waiting for response");};

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    },

    makeRequest: function(requestString,handleReply){
        this.getPlogRequest(requestString, handleReply);
    },

    initBoard: function(handleReply){
        let requestString = 'init_board';
        this.makeRequest(requestString, handleReply);
    },

    makeMoveP1: function(Line,Col,Number2,Board,handleReply){
        let requestString = "makeMoveP1(" +
        JSON.stringify(Line)+","+JSON.stringify(Col)+","+JSON.stringify(Number2)+","+
        JSON.parse(JSON.stringify(Board))+")";

        console.log(Line,Col,Number2);
        this.makeRequest(requestString,handleReply);
    },

    makeMoveP2: function(Line,Col,Number2,Board,handleReply){
        let requestString = "makeMoveP2(" +
        JSON.stringify(Line)+","+JSON.stringify(Col)+","+JSON.stringify(Number2)+","+
        JSON.parse(JSON.stringify(Board))+")";
        this.makeRequest(requestString,handleReply);
    },

    checkMove: function(Line,Col,Number2,Board,handleReply){
        let requestString = "checkMove(" +
        JSON.stringify(Line)+","+JSON.stringify(Col)+","+JSON.stringify(Number2)+","+
        JSON.parse(JSON.stringify(Board))+")";
        this.makeRequest(requestString,handleReply);
    },

    getValue: function(Board,Player,handleReply){
        let requestString = "getValue(" +
        JSON.parse(JSON.stringify(Board))+"," +   JSON.stringify(Player) + ")";
        this.makeRequest(requestString,handleReply);
    },

};