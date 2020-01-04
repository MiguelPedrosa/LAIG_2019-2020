:-use_module(boards).


% Display do board
display_game(Board, Player) :-
    print_final_board(9, Board).


print_final_board(Number,[E|B]):-
    print_game_board(Number,[E|B]),
    write('------------------------------------------------------------------------').% imprime a ultima linha de todas
    

print_game_board(Number,[E|B]):-
    print_separating_lines(1,Number),
    print_spaces_1(1,Number),
    print_values(E),
    nl,
    print_spaces_2(1,Number),
    (B \= [])->print_game_board(Number,B);
    true.

%%imprimir as linhas da tabela
print_separating_lines(I,Number):-
    (I>Number)-> nl;
    write('--------'),I1 is I + 1, print_separating_lines(I1, Number).
%imprime os espaços(estetica) e as colunas antes dos valores.
print_spaces_1(I,Number):-
    (I>Number)-> nl;
    write('       |'), I1 is I + 1, print_spaces_1(I1, Number).
%imprime os espaços(estetica) e as colunas depois dos valores.
print_spaces_2(I,Number):-
    (I>Number)-> nl;
    write('       |'), I1 is I + 1, print_spaces_1(I1, Number).
    
%Imprimir os valores de uma determinada Lista
print_values([E|B]):-
    write(' '),
    write(E),
    (B \= [])-> write(' |'), print_values(B);
    write(' |').
