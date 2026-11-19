import { chunksToWav, TARGET_SAMPLE_RATE } from './wav-encoder';

type AudioContextCtor = typeof AudioContext;

/** Запись с микрофона сразу в WAV 16 кГц, моно, 16 бит — формат, который понимает Whisper. */
export class WavRecorder {
  private context: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private chunks: Float32Array[] = [];

  get active(): boolean {
    return this.context !== null;
  }

  async start(): Promise<void> {
    if (this.active) {
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Браузер не даёт доступ к микрофону (нужен https или localhost).');
    }

    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    const ctor: AudioContextCtor | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext;

    if (!ctor) {
      this.releaseStream();
      throw new Error('Браузер не поддерживает AudioContext.');
    }

    this.context = new ctor();

    // В Safari контекст создаётся в состоянии suspended — иначе запись будет пустой.
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }

    this.chunks = [];

    this.source = this.context.createMediaStreamSource(this.stream);
    this.processor = this.context.createScriptProcessor(4096, 1, 1);
    this.processor.onaudioprocess = (event) => {
      // Копия обязательна: буфер переиспользуется браузером.
      this.chunks.push(new Float32Array(event.inputBuffer.getChannelData(0)));
    };

    this.source.connect(this.processor);
    // Без подключения к destination onaudioprocess в части браузеров не вызывается.
    this.processor.connect(this.context.destination);
  }

  /** Останавливает запись и отдаёт готовый WAV. */
  async stop(): Promise<Blob> {
    const context = this.context;
    const chunks = this.chunks;

    this.reset();

    if (!context || chunks.length === 0) {
      return chunksToWav([], TARGET_SAMPLE_RATE);
    }

    const wav = chunksToWav(chunks, context.sampleRate);
    await context.close();

    return wav;
  }

  /** Прерывает запись без результата. */
  async cancel(): Promise<void> {
    const context = this.context;

    this.reset();

    if (context) {
      await context.close();
    }
  }

  private reset(): void {
    this.processor?.disconnect();
    this.source?.disconnect();
    this.releaseStream();

    this.processor = null;
    this.source = null;
    this.context = null;
  }

  private releaseStream(): void {
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
  }
}
