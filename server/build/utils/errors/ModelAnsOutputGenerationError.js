"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ModelAnsOutputGenerationError extends Error {
    constructor(message, questionIdx) {
        super(message);
        this.questionIdx = questionIdx;
    }
}
exports.default = ModelAnsOutputGenerationError;
//# sourceMappingURL=ModelAnsOutputGenerationError.js.map