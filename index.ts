import {
  andThen,
  choice,
  map,
  orElse,
  pString,
  run,
} from "./parser/parsers";

const pipe =
  <T>(...fns: Array<(arg: T) => T>) =>
  (value: T) =>
    fns.reduce((acc, fn) => fn(acc), value);

const aParser = pString("A");
const bParser = pString("B");
const cParser = pString("C");
const boutParser = pString("bout");
const topParser = pString("top");

const firstNameParser = pString("Ed");
const spaceCharacter = pString(" ");
const surnameParser = pString("Allonby");

const aboutOrAtopParser = andThen(
  aParser,
  orElse(boutParser, topParser)
);

const aOrBOrCParser = choice([aParser, bParser, cParser]);

console.log(run(aboutOrAtopParser, "Atop"));
console.log(run(aOrBOrCParser, "Batch"));

const oneParser = pString("1");
const numberMapper = map((str) => Number(str) + 999);

console.log(run(numberMapper(oneParser), "1"));

const fullNameParser = pipe((a: number) => a + 1);
