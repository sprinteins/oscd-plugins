```prompt
---
description: Prepare a comprehensive pre-review report of code changes before the actual code review process begins.
---

The user input to you can be provided directly by the agent or as a command argument - you **MUST** consider it before proceeding with the prompt (if not empty).

User input:

$ARGUMENTS

Goal: Perform an automated pre-review analysis of all code changes in the current feature branch to identify potential issues before the actual code review, validating compliance with project constitution, coding standards, and general code quality principles.

Execution steps:

1. **Environment & Branch Detection**

   **Check for Custom Base Commit in User Input:**
   - First, examine `$ARGUMENTS` for base commit specification
   - Look for patterns like: `base=<commit-id>`, `from <commit-id>`, `compare to <commit-id>`, `since <commit-id>`
   - If found, extract the commit ID and validate it exists with: `git rev-parse --verify <commit-id>`
   - If valid, use this as `$BASE_BRANCH` (even though it's a commit ID, use same variable for consistency)
   - If invalid commit ID provided, show error and abort

   Run this command to get current branch and base branch detection:
   ```bash
   CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD) && \
   BASE_BRANCH=$(git branch -r | grep -oE '(main|develop|master)$' | head -1) && \
   echo "CURRENT_BRANCH=$CURRENT_BRANCH" && \
   echo "BASE_BRANCH=$BASE_BRANCH" && \
   git status --porcelain
   ```

   Then:
   - If custom commit ID was specified in `$ARGUMENTS`, override `$BASE_BRANCH` with that commit ID
   - Parse the output to extract `$CURRENT_BRANCH` and `$BASE_BRANCH` values
   - **CRITICAL**: Use `$CURRENT_BRANCH` in all user-facing output (summary, report header)
   - Verify not on base branch (if `$CURRENT_BRANCH` equals `$BASE_BRANCH`, warn and abort) - skip this check if using custom commit ID
   - Check git status output for uncommitted changes
   - **Always reference `$CURRENT_BRANCH` when showing branch name to user**
   - In reports, if using custom commit ID, display it as: `Base: <commit-id> (custom)` instead of branch name

   **Verify Base Branch is Up-to-Date (CRITICAL):**

   **Skip this step if using custom commit ID** (when user specified a commit in `$ARGUMENTS`).

   Otherwise, run: `git fetch origin $BASE_BRANCH:refs/remotes/origin/$BASE_BRANCH 2>&1 && git rev-list $BASE_BRANCH..origin/$BASE_BRANCH --count`

   - If the count is > 0: **STOP and require user action**
   - Display clear error message:
     ```
     ❌ Your local $BASE_BRANCH is X commits behind origin/$BASE_BRANCH

     Please update your base branch first:

     git fetch origin
     git checkout $BASE_BRANCH
     git pull origin $BASE_BRANCH
     git checkout <your-branch>

     Then run the review again.
     ```
   - Do NOT proceed with outdated base branch - this leads to incorrect diff analysis

2. **Load Project Standards (Flexible)**

   Attempt to load these standard files in order of preference:

   - `.github/copilot-instructions.md` - Project-specific tech stack and guidelines
   - `.specify/memory/constitution.md` OR `CONSTITUTION.md` OR `constitution.md` - Enforceable rules
   - `contributing.md` OR `CONTRIBUTING.md` - Contribution workflow standards

   **Additional docs/ folder discovery:**
   - Check for `docs/` folders in the project root and scan for relevant markdown files
   - If found, scan for guideline documents with flexible naming:
     - Code quality: `code-quality.md`, `CODE_QUALITY.md`, `coding-standards.md`, `style-guide.md`
     - Architecture: `architecture.md`, `ARCHITECTURE.md`, `design.md`, `patterns.md`
     - Testing: `testing.md`, `TESTING.md`, `test-guidelines.md`
     - Security: `security.md`, `SECURITY.md`, `security-guidelines.md`
     - Standards: `standards.md`, `STANDARDS.md`, `guidelines.md`, `best-practices.md`
   - Load any relevant markdown files that could contain project guidance
   - **Note**: Code quality guidelines can appear in ANY of these files, not just "code-quality.md"

   **For each file:**
   - Try to read it
   - If found: Parse and internalize the content, note which sections/rules exist
   - Extract relevant sections regardless of file name (e.g., "Code Quality" section in architecture.md)
   - If NOT found: Note it as missing, will use best practices fallback for that category

   **Important:**
   - Don't fail or abort if files are missing - continue with best practices
   - Track which files were found vs. missing for the final report
   - Don't assume document structure - dynamically discover what rules exist in each file
   - Code quality, testing, security rules can be in constitution, contributing, or any docs/ file
   - Mention all discovered documentation files in final report

3. **Generate Diff Against Base Branch (Branch-Only Changes)**

   **Single-pass approach** to determine the correct diff base and generate stats:

   ```bash
   # All in one terminal call - combine commands with &&
   MERGE_BASE=$(git merge-base $BASE_BRANCH HEAD) && \
   BASE_HEAD=$(git rev-parse $BASE_BRANCH) && \
   git log --first-parent --oneline $BASE_HEAD..HEAD | head -20 > /tmp/branch-commits.txt && \
   git diff --stat --name-status $BASE_HEAD..HEAD > /tmp/diff-stats.txt && \
   cat /tmp/branch-commits.txt /tmp/diff-stats.txt
   ```

   This gives you in **one call**:
   - List of direct commits on the branch (first-parent only)
   - File change statistics
   - Added/modified/deleted file list

   **Fallback for complex histories:**
   - If you detect many merge commits or 90+ files in a "fix" branch, ask user once for clarification
   - Otherwise proceed with `$BASE_BRANCH..HEAD` comparison (excludes merged PRs via first-parent)

   **Parse the combined output to extract:**
   - Commit count (direct commits only)
   - Modified files categorized by type
   - Lines added/removed

   - If diff is empty, report "No changes detected" and exit

4. **Review Changes Against Available Standards**

   Using the documents loaded in step 2, dynamically check against whatever rules exist:

   **From constitution file (if found):**
   - Scan for sections on: architecture, testing, security, observability, API contracts, configuration, code quality, definition of done
   - Check changes against any rules found in those sections
   - Common section names to look for: "Architecture Guardrails", "Test-First", "Security by Default", "Definition of Done", "Technical Minimum", "Code Quality"

   **From contributing file (if found):**
   - Branch naming rules (look for: allowed prefixes, patterns)
   - Commit message format (look for: Conventional Commits, required structure)
   - Pre-commit hooks, code review requirements
   - Secret management, dependency updates

   **From copilot-instructions file (if found):**
   - Technology stack versions and constraints
   - Testing requirements (coverage thresholds, test types)
   - Architecture patterns (layer dependencies, folder structure)
   - Framework-specific patterns (React, .NET, etc.)

   **Fallback - General Best Practices (if no documents found):**
   - Code quality: readability, naming, complexity, duplication
   - Security basics: no hardcoded secrets, input validation, auth patterns
   - Testing: tests exist for new functionality, clear naming
   - Architecture: reasonable separation of concerns

   **Systemic & Architectural Review:**
   - **Larger system context**: How does this change fit into the overall system architecture?
   - **Necessity check**: Is this change solving the problem at the right level, or could it be addressed differently?
   - **Maintainability concerns**:
     - Complex logic that could be simplified
     - Code duplication across files
     - Hard-to-test code structure
     - Missing or leaky abstractions
   - **Future impact**: Will this change make future changes easier or harder?
   - **Abstractions**: Do new abstractions fit with existing architecture patterns?

   **Critical Rules:**
   - Only flag violations you can PROVE from the diff
   - Reference specific document sections by name when citing rules
   - If no project standards exist, be lenient - flag only obvious problems
   - Mention in report which documents were used for review

5. **Analyze Commit Messages & Extract Context**

   Parse the commit messages collected in step 3 to:

   **Extract WHAT/WHY context:**
   - Analyze commit messages and branch name to understand the high-level purpose
   - Extract: What feature/fix/refactor is being implemented
   - Extract: Why this change is needed (problem being solved)
   - If branch follows naming convention (e.g., `feature/add-auth`, `fix/login-bug`), parse that too

   **Check commit message quality:**
   - Flag generic/unhelpful messages: "fix", "WIP", "update", "changes", "Addressed PR feedback"
   - Check if messages explain WHAT changed and WHY (not just HOW)
   - If contributing.md requires issue keys, verify they're present
   - Store good vs. problematic commits for report

   **Estimate review complexity:**
   - Calculate lines changed per file
   - Detect file types (UI: .jsx/.vue/.css, Config: .yaml/.json, Code: .py/.js, Tests: test_*)
   - Categorize files by purpose (core logic, tests, config, docs, auto-generated)
   - Estimate review time:
     - Quick (5-15min): <200 lines, <5 files
     - Standard (15-30min): 200-500 lines, 5-15 files
     - Long (30min-1h): 500-1000 lines or 15-30 files
     - Very Long (>1h): >1000 lines or >30 files
   - Flag if >30min: Add "⚠️ Large PR" warning in review time field

6. **Verify Scope Before Detailed Review**

   Before proceeding with detailed analysis, show a summary using data already collected:

   ```
   📊 Review Scope
   ├─ Branch: <$CURRENT_BRANCH from step 1>
   ├─ Base: <$BASE_BRANCH or commit-id (custom) if specified>
   ├─ What: <extracted purpose from commits/branch>
   ├─ Why: <problem being solved>
   ├─ Direct commits in branch: X (first-parent only)
   ├─ Merge commits detected: Y
   ├─ Files changed: Z
   ├─ Lines: +A / -B
   ├─ Review time estimate: ~X minutes
   └─ Review mode: BRANCH-ONLY (excludes merged content)
   ```

   **CRITICAL**: Use `$CURRENT_BRANCH` value from step 1, not a guess or cached value.

   List first 10 changed files as preview (already have from step 3).

   **Standards loaded:**
   - Report which files were found: "✅ constitution.md, ✅ contributing.md, ❌ copilot-instructions.md (using best practices)"

   If user provided `$ARGUMENTS` like "include merged content" or "full diff", note this preference.

6. **Generate Review Report**

   **Now retrieve the actual diff content for detailed review** (only once, store in memory):

   ```bash
   git diff $BASE_BRANCH..HEAD
   ```

   Review the diff against loaded standards, then output a **concise, action-focused** report:

   ```markdown
   # Pre-Review Report

   **Branch:** `<$CURRENT_BRANCH from step 1 - ALWAYS use the actual detected branch name>`
   **What:** <extracted from commits/branch - what is being changed>
   **Why:** <problem being solved or feature being added>
   **Scope:** <count> files | +<added> / -<removed> lines | <commit-count> commits
   **Review Time:** ~<estimate> minutes <if >30min: add "⚠️ Large PR - consider splitting">
   **Status:** 🔴 BLOCKED | 🟡 NEEDS WORK | 🟢 READY

   ---

   ## ℹ️ Summary

   <1-2 sentences: What this branch does + WHY it's needed>
   <If commit quality issues found, add one brief sentence with specific reason:>
   - If cleanup/fix commits: "📝 Note: <X> commits should be squashed (cleanup/fixes of earlier commits)."
   - If generic messages: "📝 Note: <X> commits have unclear messages (too generic, missing context)."
   - If mixed issues: "📝 Note: <X> commits need improvement (squash cleanups + clarify messages)."

   <If READY status:>
   ✅ All checks passed. Ready for merge.

   <If BLOCKED/NEEDS WORK:>
   ⚠️ Address <X> blocking issues and <Y> warnings before merge.

   ---

   ## ❌ Blocking Issues (Must Fix)

   <If none, say "None ✅">

   <For each blocking issue - use constructive, empathetic tone:>
   **<Issue title>**
   📁 `<file>:<line>`
   📋 <Reference: constitution section / security concern / etc.>

   **Current approach:** <briefly describe what the code does>
   **Concern:** <explain the issue - what could go wrong and why>
   **Suggested fix:** <specific, actionable recommendation using "Consider..." or "Could we...">

   <Example of good tone:>
   "Consider adding input validation here. Without it, this could be vulnerable to X attack. Could we add a check for Y?"

   <Not:>
   "This is wrong. You must add validation."

   ---

   ## ⚠️ Important (Should Fix)

   <If none, say "None ✅">

   <For each important item - maintainability, complexity, missing tests:>
   **<Issue title>**
   📁 `<file>:<line>`

   **Observation:** <what you see>
   **Impact:** <why it matters - future maintainability, testing difficulty, etc.>
   **Suggestion:** <alternative approach, phrased as a question when appropriate>

   <Example:>
   "This logic is quite complex with nested conditions. It might be challenging to maintain. What if we extracted this into smaller functions with clear names? That could also make it easier to test."

   ---

   ## 💭 Optional Improvements

   <Only include if there are meaningful improvements. Otherwise omit this section entirely.>
   <Max 3 items - these are nice-to-haves that won't block merge>

   **<Improvement>** → `<file>:<line>`
   <Brief reason why this would be beneficial>

   ---

   ## 🤔 Questions & Clarifications

   <If you need clarification or might be missing context>
   <Phrase as genuine questions, not accusations>

   **About `<file>:<line>`:**
   "I might be missing context here - is there a specific reason for using approach X instead of Y? I'm curious because typically we'd use Y for Z reason."

   ---

   ## ✨ Positive Highlights

   <Only include if there are genuinely good patterns/solutions - 2-3 max>
   <This section balances constructive criticism with recognition>

   - ✅ **Nice use of X pattern** in `file.py:45` - makes the code more maintainable
   - ✅ **Good test coverage** for edge cases in `test_file.py`
   - ✅ **Clear naming** throughout - easy to understand intent

   ---

   ## 📋 Follow-up Suggestions

   <If there are improvements that would be better as separate PRs>
   <This allows pragmatic merging while not losing track of improvements>

   **Could be addressed in follow-up PRs:**
   - **<Improvement>** → `<file>` - <Why it can be separate: "doesn't block core functionality", "larger refactor needed", etc.>
   - Consider adding TODO comments with ticket references for tracking

   **Rationale:** These changes would be valuable but are better handled separately to keep this PR focused and unblock progress.

   ---

   ## 📸 Visual Changes

   <If UI files detected (.jsx, .vue, .tsx, .css, .scss, .html, etc.):>
   🎨 **UI/Frontend modified** - Consider adding screenshots to PR description

   <Else:>
   <Omit this section entirely if no UI files>

   ---

   ## 🗺️ Review Guide (Optional)

   <Only include if helpful - omit for trivial PRs>

   **Suggested review order:**
   1. 🎯 `<main-file>` - <brief description>
   2. 🔗 `<related-files>` - <description>
   3. ✅ `<test-files>` - <description>
   4. ⏭️ Skip: `<auto-generated>` - <description>

   ---

   ## 📋 Action Items

   <Numbered list of ALL fixes needed, in priority order:>

   1. [BLOCKING] <action>
   2. [HIGH] <action>
   3. [MEDIUM] <action>

   **Effort estimate:** <trivial/1-2h/half-day/significant>

   ---

   **Standards checked:** <list which files were found and used, e.g., "constitution.md, contributing.md (copilot-instructions.md not found - used best practices)">
   ```

   **Report Guidelines:**
   - **Structure**: Status → Summary → Blocking → Important → Optional → Questions → Positive Highlights → Follow-ups → Visual Changes → Review Guide → Action Items
   - **Tone is CRITICAL**: Use empathetic, constructive language throughout - see tone rules below
   - **Comment categories**: Use clear prefixes: ❌ Blocking, ⚠️ Important, 💭 Optional, 🤔 Question, ✨ Positive
   - **Summary first**: Right after status - explains WHAT and WHY in 1-2 sentences
   - **Lead with problems** but **balance with positives** (2-3 highlights if genuine)
   - **Be specific** - always include file path and line number
   - **Omit empty sections** - if no questions/positives, don't show those sections
   - **Prioritize actionability** - every item should have clear, constructive suggestion
   - **Questions over statements**: When uncertain, ask for clarification rather than assert
   - **Test coverage** - only mention if tests are MISSING or inadequate

7. **Tone & Communication Rules (CRITICAL)**

   **How you communicate is as important as what you communicate. Follow these rules strictly:**

   **Use Open-Ended Questions, Not Statements:**
   - ❌ "This is wrong" / "This doesn't work" / "You should do X"
   - ✅ "Could we use X approach here? It might handle edge case Y better"
   - ✅ "Have you considered Z? It could simplify this logic"
   - ✅ "What if we extracted this into a separate function?"

   **Assume You Might Be Missing Context:**
   - ❌ "This doesn't follow our standards"
   - ✅ "I might be missing context - is there a specific reason for this approach?"
   - ✅ "Could you help me understand why we're using X instead of Y here?"
   - When you see something unusual, always consider there might be a valid reason

   **Be Empathetic and Positive:**
   - Acknowledge effort and good solutions
   - Celebrate good patterns: "✨ Nice use of X pattern here"
   - Frame suggestions constructively: "Consider... / What if... / Could we... / Have you thought about..."
   - Remember: the author spent significant time and effort on this code

   **Mark Non-Blocking Comments Clearly:**
   - Use consistent prefixes to set expectations:
     - ❌ **BLOCKING**: Must be fixed (security, bugs, standard violations)
     - ⚠️ **IMPORTANT**: Should be fixed (maintainability, complexity)
     - 💭 **OPTIONAL**: Nice-to-have improvements
     - 🤔 **QUESTION**: Seeking clarification
     - ✨ **POSITIVE**: Highlighting good work

   **Avoid Opinionated Language:**
   - ❌ "This is bad" / "Never do this" / "Always use X"
   - ✅ "This might cause issues with X" / "Consider using Y" / "Alternatively..."
   - Focus on impacts and trade-offs, not absolute judgments

   **Examples of Good Tone:**

   Instead of: "This function is too complex"
   Say: "This function handles several concerns. What if we broke it into smaller functions? That could make it easier to test and maintain."

   Instead of: "Missing error handling"
   Say: "I noticed this doesn't handle the case where X is null. Could we add a check here to prevent potential runtime errors?"

   Instead of: "Wrong pattern"
   Say: "I'm curious about the choice of pattern X here. In our codebase, we typically use Y for this scenario. Is there a specific advantage of X I'm missing?"

8. **Behavior Rules**
   - **Empathy-first approach**: Be kind, constructive, and assume good intent
   - **Never fail on missing standards**: If project has no constitution/contributing files, use best practices and note in report
   - **Verify scope first**: Show file/line count in compact format before detailed analysis
   - **Be ruthlessly specific**: Every issue needs file path, line number, and constructive suggestion
   - **Prioritize blockers**: Security/bugs → Maintainability → Nice-to-haves
   - **Omit empty sections**: No questions? Don't show that section
   - **Keep it scannable**: Use consistent emoji, bold headings, clear hierarchy
   - **Balance criticism with recognition**: Show 2-3 genuine positive highlights when warranted
   - **Transparent about standards**: Always show which files were checked in report footer
   - **Questions are better than assertions**: When in doubt, ask
   - If user provides `$ARGUMENTS`, focus review accordingly (e.g., "security only" → skip other checks)

9. **Exit Conditions**
   - If no changes detected, report and exit
   - If not on a feature branch, warn and optionally abort
   - **Never abort due to missing standards** - always continue with best practices
   - Large diffs (>1000 lines): Note in summary, focus on critical areas

   **Note:** Missing project standards is NOT an error condition - note what's missing and review against general best practices.

---

## Optimization Notes

**Git Command Efficiency:**
- Steps 1-3 use **minimal git calls** by combining commands with `&&`
- All file reads (step 2) happen in **one parallel batch**
- Diff content retrieved **only once** in step 6 after scope confirmation
- Total git operations: ~3-4 calls for entire review (vs. 10-15 in sequential approach)

**Memory Usage:**
- Store diff output once, parse multiple times
- Reuse branch/commit data collected in step 3
- No redundant file system reads

Context for review focus: $ARGUMENTS

```
