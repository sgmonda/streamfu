export const example = 'Hello, World!';

class Transformer extends TransformStream {
  constructor() {
    super({
      start: () => { },

      flush: () => { },

      transform: async function transform(chunk, controller) {
        chunk = await chunk
        const type = typeof chunk

        if (type === 'symbol') {
          controller.error(new Error('Symbol is not valid as a chunk part'))
          return
        }

        if (type === 'undefined') {
          controller.error(new Error('Undefined is not valid as a chunk part'))
          return
        }

        if (type !== 'object') {
          controller.enqueue(chunk)
          return
        }

        if (chunk === null) {
          controller.terminate()
          return
        }

        if (ArrayBuffer.isView(chunk)) {
          controller.enqueue(new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength))
          return
        }

        if (Array.isArray(chunk) && chunk.every((item) => typeof item === 'number')) {
          controller.enqueue(new Uint8Array(chunk))
          return
        }

        if (typeof chunk.valueOf === 'function' && chunk.valueOf() !== chunk) {
          transform(chunk.valueOf(), controller) // hack from https://developer.mozilla.org/en-US/docs/Web/API/TransformStream
          return
        }

        if ('toJSON' in chunk) {
          transform(JSON.stringify(chunk), controller)
          return
        }
      },
    })
  }
}

export default {
  example,
}