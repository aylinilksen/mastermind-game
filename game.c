
#include "game.h"
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

static int target[10];
static int digitCount;
static int lastMinus = 0;

void generateRandomNumberArray(int A[], int n) {
    int digits[10], i, upperBound = 10;

    for (i = 0; i < 10; i++) {
        digits[i] = i;
    }

    int a = 1 + rand() % 9;
    A[0] = digits[a];

    upperBound--;

    for (i = a; i < upperBound; i++) {
        digits[i] = digits[i + 1];
    }

    for (i = 1; i < n; i++) {
        a = rand() % upperBound;
        A[i] = digits[a];

        for (int j = a; j < upperBound; j++) {
            digits[j] = digits[j + 1];
        }

        upperBound--;
    }
}

void convertToArray(int number, int A[], int size) {
    for (int i = size - 1; i >= 0; i--) {
        A[i] = number % 10;
        number /= 10;
    }
}

int checkTwoArrays(int A[], int B[], int n, int *minus) {
    int plus = 0;
    int minusCount = 0;

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (B[i] == A[j]) {
                if (i == j) {
                    plus++;
                } else {
                    minusCount++;
                }
            }
        }
    }

    *minus = minusCount;
    return plus;
}

bool isValidNumber(int number, int n) {
    int count = 0;

    if (number <= 0) return false;

    while (number > 0) {
        number /= 10;
        count++;
    }

    return count == n;
}

int convertToNumber(int A[], int n) {
    int number = A[0];

    for (int i = 1; i < n; i++) {
        number = number * 10 + A[i];
    }

    return number;
}

/* Web arayuzu ile C kodu arasindaki fonksiyonlar */

int game_start(int n) {
    if (n < 1 || n > 9) return 0;

    digitCount = n;
    srand((unsigned int)time(NULL));

    generateRandomNumberArray(target, digitCount);

    return 1;
}

int game_submit_guess(int number) {
    if (!isValidNumber(number, digitCount)) {
        return -1;
    }

    int guess[10];
    convertToArray(number, guess, digitCount);

    return checkTwoArrays(target, guess, digitCount, &lastMinus);
}

int game_get_minus(void) {
    return lastMinus;
}


int game_get_answer(void) {
    return convertToNumber(target, digitCount);
}
