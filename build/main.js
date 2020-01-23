"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exec_1 = __importDefault(require("./exec"));
const check_1 = require("./check");
const { INPUT_TARGET } = process.env;
const checkName = 'Docker Lint Check';
const dockerLint = () => __awaiter(void 0, void 0, void 0, function* () {
    const { stdout } = yield exec_1.default(`dockerfilelint ${INPUT_TARGET} -j`);
    const result = JSON.parse(stdout);
    const { files, totalIssues } = result;
    const levels = ['notice', 'warning', 'failure'];
    const annotations = files.map((file) => {
        const { issues } = file;
        const path = file.file;
        return issues.map((issue) => {
            const { line, category, title, content, } = issue;
            const annotationLevel = levels[2];
            return {
                path,
                start_line: parseInt(line, 10),
                end_line: parseInt(line, 10),
                start_column: 0,
                end_column: content.length - 1,
                annotation_level: annotationLevel,
                message: `[${category}] ${title}`,
            };
        });
    }).reduce((flat, toFlatten) => flat.concat(toFlatten), []);
    return {
        conclusion: parseInt(totalIssues, 10) > 0 ? 'failure' : 'success',
        output: {
            title: checkName,
            summary: `${totalIssues} issue(s) found`,
            annotations,
        },
    };
});
function exitWithError(err) {
    console.error('Error', err.stack);
    if (err.data) {
        console.error(err.data);
    }
    process.exit(1);
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const id = yield check_1.createCheck();
        try {
            const { conclusion, output } = yield dockerLint();
            console.log(output.summary);
            yield check_1.updateCheck(id, conclusion, output);
            if (conclusion === 'failure') {
                process.exit(78);
            }
        }
        catch (err) {
            yield check_1.updateCheck(id, 'failure');
            exitWithError(err);
        }
    });
}
run().catch(exitWithError);
