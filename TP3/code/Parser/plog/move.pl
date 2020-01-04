:- use_module(library(lists)).
:- use_module(library(between)).
:- use_module(boards).


%Colocar um numero na board.
move(Move, Board, ReturnBoard):-
    get_Move_values(Move,Line,Col,Number,_Player),
    check_move(Line,Col,Number,Board),
    nth0(Line, Board, X),
    Index is Col,
    replace(X, Index, [Number,_Player], L),
    replace(Board, Line, L, ReturnBoard).

%get value com a disposição antiga (sem player)
get_value(Line,Col,B, Number2):-
      nth0(Line,B,X), 
      nth0(Col,X,Number2).

get_player(Line,Col,B, Player):-
      nth0(Line,B,X), 
      nth0(Col,X,T),
      nth0(1,T,Player).

%get value com player
get_valueWP(Line,Col,B, Number2):-
      nth0(Line,B,X), 
      nth0(Col,X,T),
      nth0(0,T,Number2).

basic_check_play(Line, Col, B):-                      
      Line >= 0, Line <9 , Col >=0, Col<9,
      get_valueWP(Line, Col, B, Y),
      Y = 'e'.

check_place_line(Line,B, Number):-
      nth0(Line,B,X),
      \+member(Number,X).

check_place_column(Col,B,Number):-                                 
     get_valueWP(0,Col,B,N0),\+(Number = N0),
     get_valueWP(1,Col,B,N1),\+(Number = N1),
     get_valueWP(2,Col,B,N2),\+(Number = N2),
     get_valueWP(3,Col,B,N3),\+(Number = N3),
     get_valueWP(4,Col,B,N4),\+(Number = N4),
     get_valueWP(5,Col,B,N5),\+(Number = N5),
     get_valueWP(6,Col,B,N6),\+(Number = N6),
     get_valueWP(7,Col,B,N7),\+(Number = N7),
     get_valueWP(8,Col,B,N8),\+(Number = N8).

check_square_col(Line,Col,B,Number):-
      X is Line mod 3,

      ((X = 0 )-> X1 is Line + 1 , X2 is Line + 2, get_valueWP(X1,Col,B,N1), get_valueWP(X2,Col,B,N2),get_valueWP(Line,Col,B,N3),
                        \+(Number = N1),\+(Number = N2),\+(Number = N3);
                  !),

      ((X = 1)->X1 is Line - 1, X2 is Line+1 ,  get_valueWP(X1,Col,B,N1),  get_valueWP(X2,Col,B,N2),get_valueWP(Line,Col,B,N3), 
                  \+(Number = N1),\+(Number = N2),\+(Number = N3);
                  !),

      ((X = 2)->X1 is Line -1, X2 is Line-2 ,  get_valueWP(X1,Col,B,N1),  get_valueWP(X2,Col,B,N2), get_valueWP(Line,Col,B,N3),
                  \+(Number = N1),\+(Number = N2),\+(Number = N3);
                  !).

check_place_squares(Line, Col,B, Number):-
      Y is Col mod 3,
       ((Y = 0 )-> Y1 is Col + 1 , Y2 is Col + 2, check_square_col(Line,Col,B,Number),
                                                 check_square_col(Line,Y1,B,Number),
                                                 check_square_col(Line,Y2,B,Number);
                                                 !),

       ((Y = 1 )-> Y1 is Col - 1 , Y2 is Col + 1, check_square_col(Line,Col,B,Number),
                                                 check_square_col(Line,Y1,B,Number),
                                                 check_square_col(Line,Y2,B,Number);
                                                 !),    

       ((Y = 2 )-> Y1 is Col - 1 , Y2 is Col - 2, check_square_col(Line,Col,B,Number),
                                                 check_square_col(Line,Y1,B,Number),
                                                 check_square_col(Line,Y2,B,Number);    
                                                 !).      



%Verifica se é valid move ou não!
check_move(Line,Col,Number, Board):-
        Number >=0, Number<9,
        basic_check_play(Line,Col,Board),
        check_place_line(Line,Board, Number),
        check_place_column(Col,Board,Number),
        check_place_squares(Line,Col,Board,Number).

%replace values with a specified index!
%(Init matrix, index, value to use, final matrix!
replace([_|B], 0, E, [E|B]).
replace([H|B], I, E, [H|R]):- I > -1, NI is I-1, replace(B, NI, E, R), !.
replace(L, _, _, L).
%Aceder aos valores da lista Move.
get_Move_values(Move,Line,Col,Number,_Player):-
      nth0(0,Move,Line),
      nth0(1,Move,Col),
      nth0(2,Move,Number),
      nth0(3,Move,_Player).
