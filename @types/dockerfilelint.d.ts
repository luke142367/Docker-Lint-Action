import { ChecksUpdateParamsOutput } from '@octokit/rest'
import { Conclusion } from './check'

export interface ParsedLintResult {
    conclusion: Conclusion,
    output: ChecksUpdateParamsOutput
}

export interface LintResults {
    totalIssues: string
    files: LintResultsFile[]
}

export interface LintResultsFile {
    file: string
    issues: LintResultFileIssue[]
}

export interface LintResultFileIssue {
    line: string,
    category: string
    title: string
    content: string
}
