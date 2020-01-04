:-use_module(boards).
:-use_module(move).

%Lista de jogadas possiveis!
valid_moves(Board, _Player, ListOfMoves):-
    findall([Line, Col,Numbers], 
        (between(0, 8, Line),
            between(0, 8, Col),
            between(0, 8, Numbers),
            check_move(Line, Col, Numbers, Board)),
        ListOfMoves).