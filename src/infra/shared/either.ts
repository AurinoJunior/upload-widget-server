// Representa um erro no lado esquerdo do tipo Either, contendo um valor de erro.
export type LeftError<T> = {
  error: T
  data?: never
}

// Representa um resultado no lado direito do tipo Either, contendo um valor de sucesso.
export type RightResult<U> = {
  error?: never
  data: U
}

// Define o tipo Either, que pode ser um LeftError ou um RightResult, mas nunca ambos ao mesmo tempo.
export type Either<T, U> = NonNullable<LeftError<T> | RightResult<U>>

// Verifica se o valor fornecido é um LeftError (lado esquerdo do Either).
export const isLeftError = <T, U>(e: Either<T, U>): e is LeftError<T> => {
  return e.error !== undefined
}

// Verifica se o valor fornecido é um RightResult (lado direito do Either).
export const isRightResult = <T, U>(e: Either<T, U>): e is RightResult<U> => {
  return e.data !== undefined
}

// Define o tipo de uma função que "desempacota" um Either, retornando o valor contido nele.
export type UnwrapEither = <T, U>(e: Either<T, U>) => NonNullable<T | U>

// Desempacota um Either, retornando o valor contido no lado esquerdo (erro) ou no lado direito (resultado).
// Lança um erro se ambos os valores (erro e resultado) estiverem presentes ou se nenhum estiver presente.
export const unwrapEither: UnwrapEither = <T, U>({
  error,
  data,
}: Either<T, U>) => {
  if (data !== undefined && error !== undefined) {
    throw new Error(
      `Received both left and right values at runtime when opening an Either\nLeftError: ${JSON.stringify(
        error
      )}\nRight: ${JSON.stringify(data)}`
    )
  }

  if (error !== undefined) {
    return error as NonNullable<T>
  }

  if (data !== undefined) {
    return data as NonNullable<U>
  }

  throw new Error(
    "Received no left or right values at runtime when opening Either"
  )
}

// Cria um LeftError com o valor fornecido.
export const makeLeftError = <T>(value: T): LeftError<T> => ({ error: value })

// Cria um RightResult com o valor fornecido.
export const makeRightResult = <U>(value: U): RightResult<U> => ({
  data: value,
})
