/* Декодер из scrolly-video: WebCodecs → ImageBitmap по кадру, в порядке показа.
   Возвращает промис, который резолвится после последнего кадра (или сразу, если WebCodecs нет). */
declare module 'scrolly-video/dist/videoDecoder.js' {
  const decodeVideo: (src: string, emitFrame: (frame: ImageBitmap) => void, debug?: boolean) => Promise<void>
  export default decodeVideo
}
