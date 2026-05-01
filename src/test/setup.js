import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mocking global objects that don't exist in JSDOM
global.window.speechSynthesis = {
  speak: vi.fn(),
  cancel: vi.fn(),
  getVoices: vi.fn(() => []),
};

global.window.SpeechSynthesisUtterance = vi.fn();
