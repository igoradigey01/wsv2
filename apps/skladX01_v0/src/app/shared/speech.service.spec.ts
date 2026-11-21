import { TestBed } from '@angular/core/testing';

import { SpeechService } from './speech.service';

describe('SpeechService', () => {
  let service: SpeechService;
  let mockRecognition: {
    lang: string;
    interimResults: boolean;
    continuous: boolean;
    onresult: ((event: unknown) => void) | null;
    onerror: ((event: { error: string }) => void) | null;
    onend: (() => void) | null;
    start: jest.Mock;
    stop: jest.Mock;
  };

  beforeEach(() => {
    mockRecognition = {
      lang: '',
      interimResults: false,
      continuous: false,
      onresult: null,
      onerror: null,
      onend: null,
      start: jest.fn(),
      stop: jest.fn(),
    };

    (window as unknown as { webkitSpeechRecognition: unknown }).webkitSpeechRecognition =
      jest.fn(() => mockRecognition);

    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeechService);
  });

  afterEach(() => {
    delete (window as unknown as { webkitSpeechRecognition?: unknown })
      .webkitSpeechRecognition;
  });

  it('включает и выключает микрофон', () => {
    const onResult = jest.fn();

    service.toggle(onResult);
    expect(service.isListening()).toBe(true);
    expect(mockRecognition.start).toHaveBeenCalled();

    service.toggle(onResult);
    expect(service.isListening()).toBe(false);
    expect(mockRecognition.stop).toHaveBeenCalled();
  });

  it('передаёт финальный распознанный текст', () => {
    const onResult = jest.fn();

    service.start(onResult);

    mockRecognition.onresult?.({
      resultIndex: 0,
      results: {
        0: { isFinal: true, 0: { transcript: ' шайба сто штук ' } },
        length: 1,
      },
    });

    expect(onResult).toHaveBeenCalledWith('шайба сто штук');
  });

  it('сообщает об отсутствии доступа к микрофону', () => {
    service.start(jest.fn());

    mockRecognition.onerror?.({ error: 'not-allowed' });

    expect(service.isListening()).toBe(false);
    expect(service.error()).toContain('Нет доступа к микрофону');
  });

  it('не запускает запись, если браузер не поддерживает Web Speech API', () => {
    delete (window as unknown as { webkitSpeechRecognition?: unknown })
      .webkitSpeechRecognition;

    const fallback = new SpeechService();
    fallback.start(jest.fn());

    expect(fallback.isListening()).toBe(false);
    expect(fallback.error()).toContain('не поддерживается');
  });
});
