import { describe, it, expect, beforeEach } from 'vitest';
import { setApiKey, getApiKey, hasApiKey, parseJsonResponse } from '../services/claudeApi';

describe('Claude API Service', () => {
  beforeEach(() => {
    setApiKey('');
  });

  describe('API Key Management', () => {
    it('hasApiKey returns false when no key set', () => {
      expect(hasApiKey()).toBe(false);
    });

    it('setApiKey stores key and hasApiKey returns true', () => {
      setApiKey('sk-ant-api-test-key-12345');
      expect(hasApiKey()).toBe(true);
      expect(getApiKey()).toBe('sk-ant-api-test-key-12345');
    });

    it('empty string counts as no key', () => {
      setApiKey('');
      expect(hasApiKey()).toBe(false);
    });

    it('getApiKey returns set value', () => {
      setApiKey('test-key');
      expect(getApiKey()).toBe('test-key');
    });
  });

  describe('parseJsonResponse', () => {
    it('parses valid JSON from response', () => {
      const response = '{"key": "value", "number": 42}';
      const result = parseJsonResponse<{ key: string; number: number }>(response);
      expect(result.key).toBe('value');
      expect(result.number).toBe(42);
    });

    it('extracts JSON from surrounding text', () => {
      const response = 'Here is the analysis:\n{"modules": ["a", "b"]}\nEnd of response.';
      const result = parseJsonResponse<{ modules: string[] }>(response);
      expect(result.modules).toEqual(['a', 'b']);
    });

    it('throws on response without JSON', () => {
      expect(() => parseJsonResponse('No JSON here')).toThrow('JSON을 찾을 수 없습니다');
    });

    it('throws on invalid JSON', () => {
      expect(() => parseJsonResponse('{invalid json}')).toThrow();
    });

    it('handles nested JSON objects', () => {
      const response = '{"outer": {"inner": "value"}, "list": [1, 2, 3]}';
      const result = parseJsonResponse<{ outer: { inner: string }; list: number[] }>(response);
      expect(result.outer.inner).toBe('value');
      expect(result.list).toEqual([1, 2, 3]);
    });

    it('handles JSON with markdown code fence', () => {
      const response = '```json\n{"result": true}\n```';
      const result = parseJsonResponse<{ result: boolean }>(response);
      expect(result.result).toBe(true);
    });
  });
});
