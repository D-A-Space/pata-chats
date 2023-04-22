import badWords from "./badwords";

const isArabic = (text) => {
  const ar_regex = new RegExp(
    "[\u0600-\u06ff]|[\u0750-\u077f]|[\ufb50-\ufc3f]|[\ufe70-\ufefc]"
  );
  return ar_regex.test(text);
};

function filterProfanity(origString) {
  var key;
  var dictionary = badWords;
  var searchFromArr = origString.toLowerCase().split(" ");
  console.log(searchFromArr);
  for (let i in searchFromArr) {
    for (var j = 0; j < dictionary.length; j++) {
      key = dictionary[j].toLowerCase();
      var index = searchFromArr.indexOf(key);
      if (index !== -1) {
        var origStringArr = origString.split(" ");
        origStringArr[index] = "*".repeat(key.length);
        origString = origStringArr.join(" ");
        searchFromArr = origString.toLowerCase().split(" ");
      }
    }
  }

  return origString;
}
export { isArabic, filterProfanity };