var f = String.prototype.charAt;
String.prototype.charAt = function(i) {
  return "::::" + f.call(this, i);
};

var s = "abc";
// s.__proto__._charAt = s.__proto__.charAt;
// s.__proto__.charAt = function(index) {
//  return ":::" + this._charAt(index);
//};
console.log(s.__proto__);
console.log(s[2]);
