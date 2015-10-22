
%lex

%%
[0-9]+[A-Za-z:]+[A-Za-z0-9:]+	{return 'SYMBOL';}
[+\-]?[0-9]+\.[0-9]+[KMGT]?		{return 'FNUM';}
[+\-]?[0-9]+[KMGT]?		{return 'INUM';}
[A-Za-z][A-Za-z0-9:-]+		{return 'SYMBOL';}
[\n\r]+			{return 'NL'; }
<<EOF>>			{return 'EOF';}
\(.*\)			{return 'DESC';}
[ \t]+			/* */

/lex

%start stat

%%

stat
	: block EOF
	  { return; }
	;

block
	: greetings header datalist
	  {
	  }
	| block greetings header datalist
	;

greetings
	: wordlist NL
	  {
		yy.controller.connect();	  
	  }
	;

wordlist
	: SYMBOL
	  { $$ = $1; }
	| wordlist INUM
	  { $$ = $1 + " " + $2; }
	| wordlist FNUM
	  { $$ = $1 + " " + $2; }
	| wordlist SYMBOL
	  { $$ = $1 + " " + $2; }
	| wordlist DESC
	  { $$ = $1 + " " + $2; }
	;

header
	: symbollist NL
	  { yy.keys = $1; }
	;

symbollist
	: SYMBOL
	  { $$ = [ $1 ]; }
	| symbollist SYMBOL
	  { $1.push($2); $$ = $1; }
	;

datalist
	: data NL
	  { yy.controller.send($1); }
	| datalist data NL
	  { yy.controller.send($2); }
	;

data
	: INUM
	  { yy.keyindex = 0; $$ = {}; $$[yy.keys[yy.keyindex++]] = $1; }
	| FNUM
	  { yy.keyindex = 0; $$ = {}; $$[yy.keys[yy.keyindex++]] = $1; }
	| data INUM
	  { $1[yy.keys[yy.keyindex++]] = $2; $$ = $1; }
	| data FNUM
	  { $1[yy.keys[yy.keyindex++]] = $2; $$ = $1; }
	;
%%

