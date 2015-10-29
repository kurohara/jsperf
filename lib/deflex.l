
SYMBOL				[A-Za-z_][A-Za-z0-9_]+
LITERALS			'"'([^\"]*)'"'
LITERALD			"'"([^\']*)"'"
YYYYMMDD			[0-9]{4}"/"[0-9]{2}"/"[0-9]{2}
HHMMSS				[0-9]{2}":"[0-9]{2}":"[0-9]{2}
INTERVAL			[0-9]{2}":"[0-9]{2}"."[0-9]+
INUM				[+\-]?[0-9]+
FNUM				[+\-]?[0-9]+\.[0-9]+
NL				\r\n|\n|\r
NA				"N/A"|"n/a"

%%
[0-9][A-Za-z]+			{return yylval.call(this, 'NUMBERNAME');}
{LITERALS}			{return yylval.call(this, 'LITERAL');}
{LITERALD}			{return yylval.call(this, 'LITERAL');}
{YYYYMMDD}			{return yylval.call(this, 'DATE');}
{HHMMSS}			{return yylval.call(this, 'TIME');}
{INTERVAL}			{return yylval.call(this, 'INTERVAL');}
{NA}				{return yylval.call(this, 'NA');}
({SYMBOL}(" "{SYMBOL})+)":"	{return yylval.call(this, 'TAGSYMBOL');}
({SYMBOL})":"			{return yylval.call(this, 'TAGSYMBOL');}
{SYMBOL}("-"{SYMBOL})+		{return yylval.call(this, 'COMPWORD');}
({SYMBOL}("."{SYMBOL})+)	{return yylval.call(this, 'INAME');}
"%"({SYMBOL})			{return yylval.call(this, 'PCTTAG');}
"#"({SYMBOL})			{return yylval.call(this, 'QTYTAG');}
{SYMBOL}			{return yylval.call(this, 'SYMBOL');}
({FNUM})([KMGT]?)"+"		{return yylval.call(this, 'FVALOV');}
({FNUM})([KMGT]?)"B+"		{return yylval.call(this, 'FVALBYTESOV');}
({FNUM})([KMGT]?)"B"		{return yylval.call(this, 'FVALBYTES');}
({FNUM})([KMGT]?)		{return yylval.call(this, 'FVAL');}
({INUM})([KMGT]?)"B+"		{return yylval.call(this, 'IVALBYTESOV');}
({INUM})([KMGT]?)"+"		{return yylval.call(this, 'IVALOV');}
({INUM})([KMGT]?)"B"		{return yylval.call(this, 'IVALBYTES');}
({INUM})([KMGT]?)		{return yylval.call(this, 'IVAL');}
{NL}+				{return yylval.call(this, 'NL'); }
[ \t]+				/* */
","				{return ',';}
"."				{return '.';}
"/"				{return '/';}
"%"				{return '%';}
"("				{return '(';}
")"				{return ')';}
":"				{return ':';}
"["				{return '[';}
"]"				{return ']';}
"*"				{return '*';}
"+"				{return '+';}
<<EOF>>				{return 'EOF';}

%%

function yylval(tok) {
	this.yy.yylval = {
		value: this.yytext
	};
	switch(tok) {
	case 'LITERAL':
		this.yy.yylval.value = new Date(this.matches[1]);
		break;
	case 'DATE':
		this.yy.yylval.value = new Date("0000/01/01/ " + this.matches[1]);
		break;
	case 'TIME':
		this.yy.yylval.value = this.matches[1];
		break;
	case 'SYMBOL':
		this.yy.yylval.value = this.matches[1];
		break;
	case 'INTERVAL':
		this.yy.yylval.value = this.matches[1];
		break;
	case 'TAGSYMBOL':
		this.yy.yylval.value = this.matches[1];
		break;
	case 'COMPWORD':
		break;
	case 'INAME':
		break;
	case 'PCTTAG':
		this.yy.yylval.value = this.matches[1];
		break;
	case 'QTYTAH':
		this.yy.yylval.value = this.matches[1];
		break;
	case 'FVALOV':
	case 'FVALBYTESOV':
	case 'FVALBYTES':
	case 'FVAL':
		this.yy.yylval.value = parseFloat(this.matches[1]);
		this.yy.yylval.unit = this.matches[2];
		break;
	case 'IVALBYTESOV':
	case 'IVALOV':
	case 'IVALBYTES':
	case 'IVAL':
		this.yy.yylval.value = parseInt(this.matches[1], 10);
		this.yy.yylval.unit = this.matches[2];
		break;
	default:
		break;
	}
	return tok;
}

