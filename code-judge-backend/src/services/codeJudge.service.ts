class CodeJudgeService {
  sanitizeCode(code: string): string {
	return code;
    const escapeSequences = {
      "\\": "\\\\", // Backslash
      "\n": "\\n", // New line
      "\r": "\\r", // Carriage return
      "\t": "\\t", // Tab
      "\b": "\\b", // Backspace
      "\f": "\\f", // Form feed
      "\v": "\\v", // Vertical tab
      '"': '\\"', // Double quote
      "'": "\\'", // Single quote
    };

    return code.replace(
      /[\\\n\r\t\b\f\v"']/g,
      (match) => escapeSequences[match as keyof typeof escapeSequences]
    );
  }
}

export const codeJudgeService = new CodeJudgeService();
