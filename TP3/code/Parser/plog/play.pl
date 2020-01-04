:-use_module(boards).
:-use_module(move).
:-use_module(valid_moves).
:-use_module(display_game).
:-use_module(value).
:-use_module(choose_move).
:-use_module(library(lists)).

play:-
    initial_menu(OP),
    ( OP == '1' -> start_HvH;
        (OP == '2' -> start_HvC;
            OP == '3' -> start_CvC;
                (OP == '4' -> write('Exiting the game...'),nl,nl;nl))).


initial_menu(OP):-
    write('****************************************************'), nl,
    write('*                                                  *'), nl,
    write('*                      MBRANE                      *'), nl,
    write('*                                                  *'), nl,
    write('*                                                  *'), nl,
    write('*                 1- Play (Human vs Human)         *'), nl,
    write('*                 2- Play (Human vs Computer)      *'), nl,
    write('*                 3- Play (Computer vs Computer)   *'), nl,
    write('*                 4- Exit                          *'), nl,
    write('*                                                  *'), nl,
    write('*                                                  *'), nl,
    write('*                                                  *'), nl,
    write('*                                                  *'), nl,
    write('*                        Authors:                  *'), nl,
    write('*                                Bernardo Moreira  *'), nl,
    write('*                                Miguel Henriques  *'), nl,
    write('****************************************************'), nl,
    nl,write('Insert your option number:'),nl,
    get_char(OP).


start_HvH:-
    empty_board(B),
    game_loop_HvH(B,0).
start_HvC:-
    empty_board(B),
    game_loop_HvP(B,0).
start_CvC:-
    empty_board(B),
    game_loop_PvP(B,0).
    
game_loop_HvH(B,I):-
    game_over(B, Winner),
    (Winner \= -1) -> !;
    display_game(B, 0),
    Player is (I mod 2) +1,
    nl,write('Inserir os valores a inserir, linha . coluna . e numero., tudo junto.'),nl,
    get_play(X,Y,Z,B,Player),
    move([X,Y,Z,Player],B,ReturnList),
    I1 is I+1,
    game_loop_HvH(ReturnList, I1).

game_loop_HvP(B,I):-
    game_over(B, Winner),
    (Winner \= -1) -> !;
    Player is (I mod 2) +1,
    % If player is 1, read input.
    % If player is 2, call choose_move
    (Player == 1 -> (display_game(B, 0), nl,
        write('Inserir os valores a inserir, linha . coluna . e numero., tudo junto.'), nl,
        get_play(X,Y,Z,B,Player));
        choose_move(B, 0, [X, Y, Z])),
    move([X,Y,Z,Player],B,ReturnList),
    I1 is I+1,
    game_loop_HvP(ReturnList, I1).

game_loop_PvP(B,I):-
    game_over(B, Winner),
    (Winner \= -1) -> !;
    Player is (I mod 2) +1,
    % If player is 1, read input.
    % If player is 2, call choose_move
    choose_move(B, 0, [X, Y, Z]),
    move([X,Y,Z,Player],B,ReturnList),
    (Player == 2 -> display_game(B, 0), nl; nl),
    I1 is I+1,
    game_loop_PvP(ReturnList, I1).

game_over(B, Winner):-
    valid_moves(B,1,T),
    length(T, X),
    (X>0) -> Winner is -1, !;
    value(B,1,V1), value(B,2,V2),
    ((V1 > V2) -> nl,write('WINNER : Player 1 '), Winner is 1 ,nl;
    	!),
    ((V2 > V1) -> nl,write('WINNER : Player 2 '), Winner is 2, nl;
    	!),
    ((V1 = V2) -> nl,write('DRAW'),Winner is 0 ,nl;
        !).

get_play(X,Y,Z,Board,Player):-
    read(X),read(Y),read(Z),
    check_move(X,Y,Z, Board);
    write('Play cannot be done. Type another play'), nl,
    get_play(X,Y,Z,Board, Player).