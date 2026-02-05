/**
 * Returns a readable stream from a factory function, in a throttled manner.
 * So the factory function is called at most once per time window, while
 * consumers will receive their own readable stream without waiting.
 *
 * @param factory Factory function that returns a readable stream
 * @param delay Delay in milliseconds
 * @returns A new readable stream, whose content is identical to the input stream
 */
// deno-lint-ignore no-explicit-any
export const throttle = <TArgs extends any[], Tin = unknown, Tout = Tin>(
  factory: (...args: TArgs) => ReadableStream<Tin>,
  delay: number,
  hash: (...args: TArgs) => string,
): (...args: TArgs) => ReadableStream<Tout> => {
  type Batch = {
    controllers: Set<ReadableStreamDefaultController<Tout>>
    started: boolean
    timer: ReturnType<typeof setTimeout> | null
    reader: ReadableStreamDefaultReader<Tin> | null
    // args con los que se llamará a la factoría cuando empiece la ventana
    args: TArgs
  }

  type State = {
    lastExecution: number
    pendingBatch: Batch | null
  }

  const states = new Map<string, State>()

  const getKey = (...args: TArgs): string => {
    if (hash) return hash(...args)
    // Default simple (puedes cambiarlo según tus parámetros reales)
    return JSON.stringify(args)
  }

  const getState = (key: string): State => {
    let state = states.get(key)
    if (!state) {
      state = { lastExecution: 0, pendingBatch: null }
      states.set(key, state)
    }
    return state
  }

  const startBatch = (state: State, batch: Batch) => {
    if (batch.started) return
    batch.started = true

    // Esta ventana deja de estar pendiente para nuevos consumidores
    if (state.pendingBatch === batch) {
      state.pendingBatch = null
    }

    const source = factory(...batch.args)
    state.lastExecution = Date.now()

    const reader = source.getReader()
    batch.reader = reader
    ;(async () => {
      try {
        while (true) {
          const { value, done } = await reader.read()
          if (done) break

          // Broadcast a todos los consumidores de esta ventana
          for (const controller of batch.controllers) {
            try {
              controller.enqueue(value as unknown as Tout)
            } catch {
              // Ignoramos streams ya cerrados
            }
          }
        }

        // Cerramos todos los streams de la ventana
        for (const controller of batch.controllers) {
          try {
            controller.close()
          } catch {
            // Ignoramos errores de controladores ya cerrados
          }
        }
      } catch (err) {
        // Propagamos error a todos los consumidores de esta ventana
        for (const controller of batch.controllers) {
          try {
            controller.error(err)
          } catch {
            // Ignoramos errores de controladores ya cerrados
          }
        }
      } finally {
        batch.controllers.clear()
        batch.reader = null
        reader.releaseLock()
      }
    })().catch(() => {
      // Evitamos que una excepción sin capturar se propague
    })
  }

  // Factory throttled por clave
  return (...args: TArgs): ReadableStream<Tout> => {
    const key = getKey(...args)
    const state = getState(key)

    let batchForStream: Batch | null = null
    let controllerForStream: ReadableStreamDefaultController<Tout> | null = null

    return new ReadableStream<Tout>({
      start(controller) {
        controllerForStream = controller

        const now = Date.now()
        let batch = state.pendingBatch

        if (!batch) {
          // Creamos una nueva ventana para esta clave
          batch = {
            controllers: new Set(),
            started: false,
            timer: null,
            reader: null,
            args,
          }
          state.pendingBatch = batch

          // Tiempo restante hasta poder volver a llamar a factory() para esta clave
          const remaining = Math.max(0, state.lastExecution + delay - now)

          batch.timer = setTimeout(() => {
            startBatch(state, batch!)
          }, remaining)
        } else {
          // Si ya hay ventana pendiente, podríamos decidir si
          // actualizar los args o no. Normalmente queremos
          // que todos los consumidores de la ventana compartan
          // el mismo "request", así que NO los cambiamos.
          // batch.args = args; // <- solo si quisieras sobrescribir.
        }

        batchForStream = batch
        batch.controllers.add(controller)
      },

      cancel() {
        if (!batchForStream || !controllerForStream) return

        const batch = batchForStream
        batch.controllers.delete(controllerForStream)

        // Si la ventana aún no ha empezado y se queda sin consumidores, la anulamos
        if (!batch.started && batch.controllers.size === 0) {
          if (batch.timer != null) {
            clearTimeout(batch.timer)
          }
          if (state.pendingBatch === batch) {
            state.pendingBatch = null
          }
        }

        // Si la ventana ya está en marcha y se han ido todos, cancelamos el origen
        if (batch.started && batch.controllers.size === 0 && batch.reader) {
          batch.reader.cancel().catch(() => {
            /* ignoramos */
          })
        }

        batchForStream = null
        controllerForStream = null
      },
    })
  }
}
