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
const rest_1 = __importDefault(require("@octokit/rest"));
const { GITHUB_SHA, GITHUB_EVENT_PATH, GITHUB_TOKEN } = process.env;
if (!GITHUB_EVENT_PATH) {
    throw new Error('GITHUB_EVENT_PATH not defnied');
}
const event = require(GITHUB_EVENT_PATH);
const { repository } = event;
const { owner: { login: owner }, } = repository;
const { name: repo } = repository;
const checkName = 'Docker Lint Check';
const octokit = new rest_1.default({
    auth: GITHUB_TOKEN,
});
function createCheck() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!GITHUB_SHA) {
            throw new Error('SHA is not defined');
        }
        const check = yield octokit.checks.create({
            owner,
            repo,
            head_sha: GITHUB_SHA,
            name: checkName,
            status: 'in_progress',
            started_at: new Date().toISOString(),
        });
        return check.data.id;
    });
}
exports.createCheck = createCheck;
function updateCheck(id, conclusion, output = undefined) {
    return __awaiter(this, void 0, void 0, function* () {
        const arg = {
            owner,
            repo,
            check_run_id: id,
            status: 'completed',
            completed_at: new Date().toISOString(),
            conclusion,
        };
        if (output) {
            arg.output = output;
        }
        yield octokit.checks.update(arg);
    });
}
exports.updateCheck = updateCheck;
