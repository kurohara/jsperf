/** -*- tab-width : 2 -*-
 * The default lexer definition for jsperf.
 *
 * Copyright(C) 2015 Hiroyoshi Kurohara(Microgadget,inc.).
 * E-mail: kurohara@yk.rim.or.jp, kurohara@microgadget-inc.com
 * Lisenced under MIT the lincense.
 */

SYMBOL						[A-Za-z_][A-Za-z0-9_]*
LITERALS					'"'([^\"]*)'"'
LITERALD					"'"([^\']*)"'"
YYYYMMDD					[0-9]{4}"/"[0-9]{2}"/"[0-9]{2}
HHMMSS						[0-9]{2}":"[0-9]{2}":"[0-9]{2}
INTERVAL					[0-9]{2}":"[0-9]{2}"."[0-9]+
INUM							[+\-]?[0-9]+
FNUM							[+\-]?[0-9]+\.[0-9]+
NL								\r\n|\n|\r
NA								"N/A"|"n/a"

%%
{LITERALS}										{return yylval.call(this, 'LITERAL');}
{LITERALD}										{return yylval.call(this, 'LITERAL');}
{YYYYMMDD}										{return yylval.call(this, 'DATE');}
{HHMMSS}											{return yylval.call(this, 'TIME');}
{INTERVAL}										{return yylval.call(this, 'INTERVAL');}
{NA}													{return yylval.call(this, 'NA');}
({SYMBOL}(" "{SYMBOL})+)":"		{return yylval.call(this, 'TAGSYMBOL');}
({SYMBOL})":"									{return yylval.call(this, 'TAGSYMBOL');}
{SYMBOL}("-"{SYMBOL})+				{return yylval.call(this, 'COMPWORD');}
({SYMBOL}("."{SYMBOL})+)			{return yylval.call(this, 'INAME');}
"%"({SYMBOL})									{return yylval.call(this, 'PCTTAG');}
"#"({SYMBOL})									{return yylval.call(this, 'QTYTAG');}
{SYMBOL}											{return yylval.call(this, 'SYMBOL');}
({FNUM})([KMGT]?)"+"					{return yylval.call(this, 'FVALOV');}
({FNUM})([KMGT]?)"B+"					{return yylval.call(this, 'FVALBYTESOV');}
({FNUM})([KMGT]?)"B"					{return yylval.call(this, 'FVALBYTES');}
({FNUM})([KMGT]?)							{return yylval.call(this, 'FVAL');}
({INUM})([KMGT]?)"B+"					{return yylval.call(this, 'IVALBYTESOV');}
({INUM})([KMGT]?)"+"					{return yylval.call(this, 'IVALOV');}
({INUM})([KMGT]?)"-"					{return yylval.call(this, 'IVALUND');}
({INUM})([KMGT]?)"B"					{return yylval.call(this, 'IVALBYTES');}
({INUM})([KMGT]?)							{return yylval.call(this, 'IVAL');}
{NL}													{return yylval.call(this, 'NL'); }
[0-9][A-Za-z]+								{return yylval.call(this, 'NUMBERNAME');}
[ \t]+												/* */
","														{return ',';}
"."														{return '.';}
"/"														{return '/';}
"%"														{return '%';}
"("														{return '(';}
")"														{return ')';}
":"														{return ':';}
"["														{return '[';}
"]"														{return ']';}
"*"														{return '*';}
"+"														{return '+';}
<<EOF>>												{return 'EOF';}

%%

function yylval(tok) {
	var yytext = this.yytext;
  this.yytext = { yytext: yytext, value: yytext };
	switch(tok) {
	case 'LITERAL':
		this.yytext.value = new Date(this.matches[1]);
		break;
	case 'DATE':
		this.yytext.value = new Date(this.matches[1]);
		break;
	case 'TIME':
		this.yytext.value = new Date("0000/01/01/ " + this.matches[1]);
		break;
	case 'SYMBOL':
		this.yytext.value = this.matches[1];
		break;
	case 'INTERVAL':
		this.yytext.value = this.matches[1];
		break;
	case 'TAGSYMBOL':
		this.yytext.value = this.matches[1];
		break;
	case 'COMPWORD':
		break;
	case 'INAME':
		break;
	case 'PCTTAG':
		this.yytext.value = this.matches[1];
		break;
	case 'QTYTAH':
		this.yytext.value = this.matches[1];
		break;
	case 'FVALOV':
	case 'FVALBYTESOV':
	case 'FVALBYTES':
	case 'FVAL':
		this.yytext.value = parseFloat(this.matches[1]);
		this.yytext.unit = this.matches[2] === this.matches[1] ? "" : this.matches[2];
		break;
	case 'IVALBYTESOV':
	case 'IVALOV':
	case 'IVALBYTES':
	case 'IVAL':
		this.yytext.value = parseInt(this.matches[1], 10);
		this.yytext.unit = this.matches[2] === this.matches[1] ? "" : this.matches[2];
		break;
	default:
		break;
	}
	return tok;
}

