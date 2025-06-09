// src/infra/shared/either.ts
var isLeftError = (e) => {
  return e.error !== void 0;
};
var isRightResult = (e) => {
  return e.data !== void 0;
};
var unwrapEither = ({
  error,
  data
}) => {
  if (data !== void 0 && error !== void 0) {
    throw new Error(
      `Received both left and right values at runtime when opening an Either
LeftError: ${JSON.stringify(
        error
      )}
Right: ${JSON.stringify(data)}`
    );
  }
  if (error !== void 0) {
    return error;
  }
  if (data !== void 0) {
    return data;
  }
  throw new Error(
    "Received no left or right values at runtime when opening Either"
  );
};
var makeLeftError = (value) => ({ error: value });
var makeRightResult = (value) => ({
  data: value
});

export {
  isLeftError,
  isRightResult,
  unwrapEither,
  makeLeftError,
  makeRightResult
};
