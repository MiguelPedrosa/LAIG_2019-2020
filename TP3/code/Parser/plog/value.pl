:-use_module(boards).
:-use_module(move).


% Used to evaluated game state. Due to the game's rules,
% this value can range from 0 to 9, without any direct
% implications of the opponent' score. The sum of both
% scores can be at max 9, but can be lower than that.
value(Board, Player, Value) :-
    get_value_section(Board, Player, 0, 0, V1),
    get_value_section(Board, Player, 0, 3, V2),
    get_value_section(Board, Player, 0, 6, V3),
    get_value_section(Board, Player, 3, 0, V4),
    get_value_section(Board, Player, 3, 3, V5),
    get_value_section(Board, Player, 3, 6, V6),
    get_value_section(Board, Player, 6, 0, V7),
    get_value_section(Board, Player, 6, 3, V8),
    get_value_section(Board, Player, 6, 6, V9),
    Value is V1 + V2 + V3 + V4 + V5 + V6 + V7 + V8 + V9.

% Outputs to Value either 1 or 0, depending on the
% region's power and the Player that called the
% function. The region is an area of the Board
% that goes from [Column, Line] to [Column +2, Line +2].
get_value_section(Board, Player, Column, Line, Value) :-
    % Grabs all cells from a 3x3 square, starting
    % from [Column, Line], and stores them in CellsList. 
    findall(Cell,
        (ColumnEnd is Column +2,
            LineEnd is Line +2,
            between(Column, ColumnEnd, X),
            between(Line, LineEnd, Y),
            get_value(Y, X, Board, Cell)),
        CellsList),
    % Goes though the list, and calculates the curresponding
    % power. Power is refered in the game rules as the
    % difference between the sums of the combined peaces of
    % each player and their respective sum.
    addCellLists(CellsList, 0, Power),
    % Positive means Value is 1 for player 1 and 0 for
    % player 2, meanwhile a negative value means 0 for
    % player 1 and 1 for player 2. A tie(0) returns 0. 
    ((Player == 1, Power > 0) -> Value is 1;
     ((Player == 2, Power < 0) -> Value is 1;
      Value is 0)).

% Iterates through given list and return in last parameter
% the 'power' of the board.
% The Value is always added is player is 1, substracted
% if player is 2 and no operation if empty('e').
addCellLists([], Value, Value).
addCellLists([[ _ , e ] | Tail], CurrentCounter, Out) :-
    addCellLists(Tail, CurrentCounter, Out).
addCellLists([[ ValueCell, 1 ] | Tail], CurrentCounter, Out) :-
    NewCounter is ValueCell + CurrentCounter,
    addCellLists(Tail, NewCounter, Out).
addCellLists([[ ValueCell, 2 ] | Tail], CurrentCounter, Out) :-
    NewCounter is CurrentCounter - ValueCell,
    addCellLists(Tail, NewCounter, Out).