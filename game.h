
#ifndef GAME_H
#define GAME_H

#include <stdbool.h>

void generateRandomNumberArray(int A[], int n);
void convertToArray(int number, int A[], int size);
int checkTwoArrays(int A[], int B[], int n, int *minus);
bool isValidNumber(int number, int n);
int convertToNumber(int A[], int n);

int game_start(int n);
int game_submit_guess(int number);
int game_get_minus(void);
int game_get_answer(void);

#endif
