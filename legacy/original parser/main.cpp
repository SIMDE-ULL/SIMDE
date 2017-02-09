#include "simdeLex.h"
#include <iostream>
#include <string>
#include <cstdlib>
#include <cstring>

extern "C" int yylex(void);
extern "C" int setYyin(char *nombre);
extern "C" int unsetYyin();
extern "C" char *getYytext();

typedef enum {NOP = 0, ADD, ADDF, ADDI, MULT, MULTF, SW, SF, LW, LF, BNE, BEQ, OPERROR} TOpcodes;
int NOPCODES = OPERROR - NOP;

char* nomOpcode[] = {
    "NOP", "ADD", "ADDF", "ADDI", "MULT", "MULTF", "SW", "SF", "LW", "LF",
    "BNE", "BEQ"
};

int str2Opcode(char* str) {
    int i;
    for (i = 1; i < NOPCODES; i++) {
        if (strcmp(nomOpcode[i],str) == 0)
            break;        
    }
    if (i == NOPCODES)
        return OPERROR;
    return (TOpcodes) i;
}

int main (void) {


#define GETLEXEMA lexema = yylex(); yytext = getYytext();
    int *res;
    int lexema;
    char *yytext;
    bool nuevoBloque = true;

    std::string myString ("bucle.pla");

    if (setYyin(const_cast<char*>(myString.c_str())) != 0) {
        std::cout << "Error" << std::endl;
        return 0;
    }

    GETLEXEMA;
    if (lexema != LEXNLINEAS) {
        unsetYyin();
        std::cout << "Error en el numero de lineas" << std::endl;
        return 0;
    }

    int nLineas = atoi(yytext);
    // Se inicializa el array de instrucciones
    for (int i = 0; i < nLineas; i++) {
        GETLEXEMA;
        if (lexema == LEXETIQUETA) {
            std::cout << "Etiqueta: " << yytext << " " << std::endl;
            GETLEXEMA;
        }
        int op = str2Opcode(yytext);
        switch (op) {
            case NOP:   // No se esperan operandos
                break;
            case ADD:
            case MULT:
                std::cout << yytext << " ";
                GETLEXEMA;
                std::cout << yytext << " ";
                GETLEXEMA;
                std::cout << yytext << " ";
                GETLEXEMA;
                std::cout << yytext << std::endl;
                break;
            case ADDF:
            case MULTF:
                std::cout << yytext << " ";
                GETLEXEMA;
                std::cout << yytext << " ";
                GETLEXEMA;
                std::cout << yytext << " ";
                GETLEXEMA;
                std::cout << yytext << std::endl;
                break;
            case ADDI:
                std::cout << yytext << " ";
                GETLEXEMA;
                std::cout << yytext << " ";
                GETLEXEMA;
                std::cout << yytext << " ";
                GETLEXEMA;
                std::cout << yytext << std::endl;
                break;
            case SW:
            case LW:
                std::cout << yytext << " ";
                GETLEXEMA;
                std::cout << yytext << " ";
                GETLEXEMA;
                std::cout << yytext << std::endl;
                break;
            case SF:
            case LF:
                std::cout << yytext << " ";
                GETLEXEMA;
                std::cout << yytext << " ";
                GETLEXEMA;
                std::cout << yytext << std::endl;
                break;
            case BNE:
            case BEQ:
                std::cout << yytext << " ";
                GETLEXEMA;
                std::cout << yytext << " ";
                GETLEXEMA;
                std::cout << yytext << " ";
                GETLEXEMA;
                std::cout << yytext << std::endl;
                nuevoBloque = true; // La siguiente inst. es un nuevo bloque
                break;
            case OPERROR:
            default:
                unsetYyin();
                return 0;
        }
}
    return 0;
}