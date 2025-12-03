import { ActionResponse, Command, ScenarioState } from '@shared/types/scenario'
import { scenarioUtils } from '../../scenarioUtils'

// OptionalActionResponse allows handlers to short-circuit the pipeline.
// ..If a handler ever returns a ActionResponse, the pipeline ends immediately.
// ..Otherwise, they return the input to the next handler.
export type OptionalActionResponse<T> =
  | ActionResponse
  | { command: Command; scenarioState: ScenarioState; context: T }

// Handler and OuterHandler are distinct from VerbHandler in that they accept
// ..context, and they are meant for use in the handler pipeline rather than
// ..in the engine at large.
export type Handler<TContext, TExtendedContext> = (
  command: Command,
  scenarioState: ScenarioState,
  context: TContext,
) => OptionalActionResponse<TExtendedContext>

export type OuterHandler<TContext> = (
  command: Command,
  scenarioState: ScenarioState,
  context: TContext,
) => ActionResponse

// Make type-safe pipes for variable number of parameters *like a gorilla*
// ..Inspired by RxJS approach (https://github.com/ReactiveX/rxjs/blob/f174d38554d404f21f98ab1079a101e80d777e95/src/internal/util/pipe.ts)
// ..If you ever need a longer pipeline, make another overload!
export function pipeHandlers<A, B>(_op1: Handler<A, B>): OuterHandler<A>

export function pipeHandlers<A, B, C>(
  _op1: Handler<A, B>,
  _op2: Handler<B, C>,
): OuterHandler<A>

export function pipeHandlers<A, B, C, D>(
  _op1: Handler<A, B>,
  _op2: Handler<B, C>,
  _op3: Handler<C, D>,
): OuterHandler<A>

export function pipeHandlers<A, B, C, D, E>(
  _op1: Handler<A, B>,
  _op2: Handler<B, C>,
  _op3: Handler<C, D>,
  _op4: Handler<D, E>,
): OuterHandler<A>

export function pipeHandlers<A, B, C, D, E, F>(
  _op1: Handler<A, B>,
  _op2: Handler<B, C>,
  _op3: Handler<C, D>,
  _op4: Handler<D, E>,
  _op5: Handler<E, F>,
): OuterHandler<A>

export function pipeHandlers<A, B, C, D, E, F, G>(
  _op1: Handler<A, B>,
  _op2: Handler<B, C>,
  _op3: Handler<C, D>,
  _op4: Handler<D, E>,
  _op5: Handler<E, F>,
  _op6: Handler<F, G>,
): OuterHandler<A>

export function pipeHandlers<A, B, C, D, E, F, G, H>(
  _op1: Handler<A, B>,
  _op2: Handler<B, C>,
  _op3: Handler<C, D>,
  _op4: Handler<D, E>,
  _op5: Handler<E, F>,
  _op6: Handler<F, G>,
  _op7: Handler<G, H>,
): OuterHandler<A>

export function pipeHandlers<A, B, C, D, E, F, G, H, I>(
  _op1: Handler<A, B>,
  _op2: Handler<B, C>,
  _op3: Handler<C, D>,
  _op4: Handler<D, E>,
  _op5: Handler<E, F>,
  _op6: Handler<F, G>,
  _op7: Handler<G, H>,
  _op8: Handler<H, I>,
): OuterHandler<A>

export function pipeHandlers<A, B, C, D, E, F, G, H, I, J>(
  _op1: Handler<A, B>,
  _op2: Handler<B, C>,
  _op3: Handler<C, D>,
  _op4: Handler<D, E>,
  _op5: Handler<E, F>,
  _op6: Handler<F, G>,
  _op7: Handler<G, H>,
  _op8: Handler<H, I>,
  _op9: Handler<I, J>,
): OuterHandler<A>

export function pipeHandlers<A, B, C, D, E, F, G, H, I, J, K>(
  _op1: Handler<A, B>,
  _op2: Handler<B, C>,
  _op3: Handler<C, D>,
  _op4: Handler<D, E>,
  _op5: Handler<E, F>,
  _op6: Handler<F, G>,
  _op7: Handler<G, H>,
  _op8: Handler<H, I>,
  _op9: Handler<I, J>,
  _op10: Handler<J, K>,
): OuterHandler<A>

export function pipeHandlers<TContext>(
  // `any` is necessary here to allow variable number and type of handlers.
  // ..Thankfully, this function (should) never been called by client code, and
  // ..the overloads provided above provide the necessary type information.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...handlers: Handler<any, any>[]
): OuterHandler<TContext> {
  return (
    command: Command,
    scenarioState: ScenarioState,
    context: TContext,
  ): ActionResponse => {
    let current:
      | ActionResponse
      | { command: Command; scenarioState: ScenarioState; context: TContext } =
      {
        command,
        scenarioState: scenarioState,
        context: context,
      }

    // eslint-disable-next-line prefer-rest-params
    for (const handler of handlers) {
      current = handler(current.command, current.scenarioState, current.context)

      if (scenarioUtils.isActionResponse(current)) {
        return current
      }
    }

    return {
      responseText: 'UNEXPECTED ERROR: Reached the end of handler chain',
      scenarioState: current.scenarioState,
      result: 'unexpected_error',
    }
  }
}

export type GuardResponse = {
  didPass: boolean
  failureMessage: string
}

export const guard = <T>(
  check: (
    command: Command,
    scenarioState: ScenarioState,
    context: T,
  ) => GuardResponse,
  overrideMessage?: string,
): Handler<T, T> => {
  return (command, scenarioState, context) => {
    const checkResult = check(command, scenarioState, context)
    return checkResult.didPass
      ? { command, scenarioState, context }
      : {
          responseText: overrideMessage ?? checkResult.failureMessage,
          scenarioState,
          result: 'guard_failure',
        }
  }
}

export const enrich = <T, U>(
  enricher: (
    command: Command,
    scenarioState: ScenarioState,
    context: T,
  ) => OptionalActionResponse<T & U>,
): Handler<T, T & U> => {
  return enricher
}

export const transform = <T>(
  handler: (
    command: Command,
    scenarioState: ScenarioState,
    context: T,
  ) => OptionalActionResponse<T>,
): Handler<T, T> => {
  return handler
}
