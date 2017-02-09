%{
/****************************************************************************
simdeLex.l
ParserWizard generated Lex file.

Date: miércoles, 27 de agosto de 2003
****************************************************************************/
#include "simdeLex.h"

%}

H			[A-Fa-f0-9]
D			[0-9]
E			[Ee][+-]?{D}+
id			[A-Za-z_][A-Za-z0-9_]*
espacio		[ \t\v\f]
direccion	[+-]?{D}*"("[Rr]{D}+")"

%%

^{D}+			{	/* Esto es el número de líneas del fichero */
					return LEXNLINEAS;
				}

#[+-]?{D}+		{ return LEXINMEDIATO; }
[Ff]{D}+		{ return LEXREGFP; }
[Rr]{D}+		{ return LEXREGGP; }
{id}			{ return LEXID; }
{id}":"			{ return LEXETIQUETA; }
{direccion}		{ return LEXDIRECCION; }

"//".*			{ /* Comentario */ }
{espacio}+		{ /* Espacio en blanco */ }
(.|\n)			{ /* Cosas extrañas y retornos de carro */ }

%%

int yywrap() { return 1; }

int setYyin(char *nombre) {
	FILE *aux = fopen(nombre, "r");
	if (aux == NULL)
		return -1;
	yyrestart(aux);
	return 0;
}

int unsetYyin() {
	int res = fclose(yyin);
	yyin = NULL;
	return res;
}

char *getYytext() {
	return yytext;
}
