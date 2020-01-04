:- use_module(boards).
:- use_module(move).
:- use_module(value).
:- use_module(valid_moves).
:- use_module(library(lists)).
:- use_module(library(system)).
:- use_module(library(random)).


choose_move(Board, Level, Move) :-
    % Calculate next player
    calculate_next_player(Board, Player),
    % Grab all moves 
    valid_moves(Board, Player, ListOfMoves),
    % Choose move based on difficulty
    choose_move_from_list(Board, Player, Level, ListOfMoves, Move).


% Choose a random move. Ignores
% both current board status and
% the current player
choose_move_from_list(_, _, 0, ListOfMoves, Move) :-
    % Function from library(random)
    % that returns a random element
    % of a given list
    now(RandomValue), setrand(RandomValue),
    random_member(Move, ListOfMoves).


% Chooses the move from the given list
% with the best value
choose_move_from_list(Board, Player, 1, ListOfMoves, Move) :-
    
    

% Code given from exercise sheet 6, that
% applied a given function to each
% member of a given a list
map([],_,[]).
map([C|R],Transfor,[TC|CR]):-
    aplica(Transfor, [C,TC]),
    map(R,Transfor,CR).
aplica(P,LArgs) :- G =.. [P|LArgs], G. 

% Calculates next player based
% on board's current state.
calculate_next_player(Board, Player) :-
    findall(P, 
        (between(0, 8, Line),
            between(0, 8, Col),
            get_player(Line, Col, Board, P),
            P \= 'e'),
        ListOfPlayerOccurences),
    sumPlayers(ListOfPlayerOccurences, 0, Player).

% Helper function to calculate_next_player.
sumPlayers([], Count,  Result) :-
    % Add 1 so that result is the same
    % value as player
    Result is Count +1.
sumPlayers([1 | R], Count,  Result) :-
    NewCount is Count -1,
    sumPlayers(R, NewCount, Result).
sumPlayers([2 | R], Count, Result) :-
    NewCount is Count +1,
    sumPlayers(R, NewCount, Result).