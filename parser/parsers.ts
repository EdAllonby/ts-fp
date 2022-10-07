type Success<T> = { tag: "success"; result: [T, string] };
type Failure = { tag: "failure"; result: string };
type Result<T> = Success<T> | Failure;
type Parser<T> = (input: string) => Result<T>;

export const pStringOld = (
  match: string,
  input: string
) => {
  if (!input || input === "") {
    return { tag: "failure", result: "no more input" };
  }
  if (input.startsWith(match)) {
    return {
      tag: "success",
      result: [match, input.slice(match.length)],
    };
  }
  return {
    tag: "failure",
    result: `Failed to match ${match} on ${input}`,
  };
};

export const pString =
  (match: string): Parser<string> =>
  (input: string) => {
    if (!input || input === "") {
      return { tag: "failure", result: "no more input" };
    }
    if (input.startsWith(match)) {
      return {
        tag: "success",
        result: [match, input.slice(match.length)],
      };
    }
    return {
      tag: "failure",
      result: `Failed to match ${match} on ${input}`,
    };
  };

export const andThen =
  <T, U>(
    parser1: Parser<T>,
    parser2: Parser<U>
  ): Parser<[T, U]> =>
  (input: string) => {
    const result1 = run(parser1, input);

    if (result1.tag === "failure") {
      return result1;
    }

    const result2 = run(parser2, result1.result[1]);

    if (result2.tag === "failure") {
      return result2;
    }

    return {
      tag: "success",
      result: [
        [result1.result[0], result2.result[0]],
        result2.result[1],
      ],
    };
  };

export const orElse =
  <T, U>(
    parser1: Parser<T>,
    parser2: Parser<U>
  ): Parser<T | U> =>
  (input: string) => {
    const result1 = run(parser1, input);

    if (result1.tag === "success") {
      return result1;
    }

    return run(parser2, input);
  };

export const choice = <T>(
  parsers: Parser<T>[]
): Parser<T> => {
  return parsers.reduce(orElse);
};

export const anyOf = (
  matches: string[]
): Parser<string> => {
  const matchParsers = matches.map(pString);
  return choice(matchParsers);
};

export const parseLowercase = anyOf(
  [...Array(26)].map((_, i) => String.fromCharCode(i + 97))
);

export const parseDigit = anyOf([...Array(26)]);

export const map =
  <T, U>(f: (x: T) => U) =>
  (parser: Parser<T>): Parser<U> =>
  (input: string) => {
    let result = parser(input);
    if (result.tag === "failure") {
      return result;
    }
    return {
      tag: "success",
      result: [f(result.result[0]), result.result[1]],
    };
  };

export const run = <T>(
  parser: Parser<T>,
  input: string
): Result<T> => {
  return parser(input);
};
