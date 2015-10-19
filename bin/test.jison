
%lex

%%
[0-9]+[A-Za-z:]+[A-Za-z0-9:]*	{return 'SYMBOL';}
[+\-]?[0-9]+\.[0-9]+		{return 'FNUM';}
[+\-]?[0-9]+		{return 'INUM';}
[A-Za-z][A-Za-z0-9:]+		{return 'SYMBOL';}
\n			{return 'NL';}
<<EOF>>			{return 'EOF';}
\(.*\)			{return 'DESC';}
\s+			/* */

/lex

%start stat

%%

stat
	: block EOF
	  { $$ = $1; console.log($$); }
	;

block
	: greetings header datalist
	  { $$ = { greetings: $1, header: $2, datalist: $3 }; }
	| block header datalist
	  { $1.datalist = $1.datalist.concat($3); $$ = $1; }
	;

greetings
	: wordlist NL
	  { $$ = $1; }
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
	  { $$ = $1; }
	;

symbollist
	: SYMBOL
	  { $$ = [ $1 ]; }
	| symbollist SYMBOL
	  { $1.push($2); $$ = $1; }
	;

datalist
	: data NL
	  { $$ = [ $1 ]; }
	| datalist data NL
	  { $1.push($2); $$ = $1; }
	;

data
	: INUM
	  { $$ = [ $1 ]; }
	| FNUM
	  { $$ = [ $1 ]; }
	| data INUM
	  { $1.push($2); $$ = $1; }
	| data FNUM
	  { $1.push($2); $$ = $1; }
	;
%%

