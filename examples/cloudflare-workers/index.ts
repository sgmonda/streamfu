export default {
  async fetch(): Promise<Response> {
    return new Response("streamfu cloudflare workers example")
  },
}
