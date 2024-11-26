const mockStream = new ReadableStream({
    start(controller) {
      controller.enqueue('chunk 1');
      controller.enqueue('chunk 2');
      controller.close();
    }
});
  
/*global.fetch = vi.fn().mockResolvedValue({
    body: mockStream,
    headers: new Headers({ 'Content-Type': 'text/plain' }),
});*/

export default mockStream;