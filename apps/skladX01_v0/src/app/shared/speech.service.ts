import { Injectable, signal } from '@angular/core';

interface ISpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: { transcript: string };
    };
  };
}

interface ISpeechRecognitionErrorEvent {
  error: string;
}

interface ISpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onerror: ((event: ISpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

type SpeechRecognitionConstructor = new () => ISpeechRecognitionInstance;

/**
 * Голосовой ввод через Web Speech API (Chrome/Edge/Safari).
 * Если браузер не поддерживает распознавание речи, кнопка микрофона
 * сообщает об этом через сигнал `error`.
 */
@Injectable({ providedIn: 'root' })
export class SpeechService {
  readonly isListening = signal(false);
  readonly error = signal<string | null>(null);

  private readonly recognition: ISpeechRecognitionInstance | null;
  private onResultCallback: ((text: string) => void) | null = null;

  constructor() {
    const globals = window as unknown as {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const SpeechRecognitionCtor =
      globals.SpeechRecognition ?? globals.webkitSpeechRecognition;

    if (SpeechRecognitionCtor) {
      const recognition = new SpeechRecognitionCtor();
      recognition.lang = 'ru-RU';
      recognition.interimResults = false;
      recognition.continuous = true;

      recognition.onresult = (event) => this.handleResult(event);
      recognition.onerror = (event) => this.handleError(event);
      recognition.onend = () => this.isListening.set(false);

      this.recognition = recognition;
    } else {
      this.recognition = null;
    }
  }

  toggle(onResult: (text: string) => void): void {
    if (this.isListening()) {
      this.stop();
      return;
    }

    this.start(onResult);
  }

  start(onResult: (text: string) => void): void {
    if (!this.recognition) {
      this.error.set('Голосовой ввод не поддерживается этим браузером.');
      return;
    }

    if (this.isListening()) {
      return;
    }

    this.onResultCallback = onResult;
    this.error.set(null);
    this.isListening.set(true);

    try {
      this.recognition.start();
    } catch {
      this.isListening.set(false);
      this.error.set('Не удалось запустить микрофон.');
    }
  }

  stop(): void {
    if (!this.recognition || !this.isListening()) {
      return;
    }

    this.recognition.stop();
    this.isListening.set(false);
  }

  private handleResult(event: ISpeechRecognitionEvent): void {
    let text = '';

    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const result = event.results[index];

      if (result.isFinal) {
        text += result[0].transcript;
      }
    }

    const trimmed = text.trim();

    if (trimmed && this.onResultCallback) {
      this.onResultCallback(trimmed);
    }
  }

  private handleError(event: ISpeechRecognitionErrorEvent): void {
    this.isListening.set(false);

    if (event.error === 'not-allowed' || event.error === 'permission-denied') {
      this.error.set('Нет доступа к микрофону: разрешите его в браузере.');
      return;
    }

    if (event.error === 'no-speech') {
      this.error.set('Речь не распознана. Попробуйте ещё раз.');
      return;
    }

    this.error.set('Ошибка распознавания речи. Попробуйте ещё раз.');
  }
}
