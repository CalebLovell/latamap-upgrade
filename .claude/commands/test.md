Run the project tests and fix any failures.

1. Run `npm run test` (vitest unit tests)
2. If any tests fail, read the failing test files and the source code they test
3. Determine whether the bug is in the source code or the test
4. Fix the issue and re-run the failing tests to confirm they pass
5. If all unit tests pass, run `npm run test:e2e` (playwright)
6. Fix any e2e failures the same way
7. Summarize what passed and what was fixed

If $ARGUMENTS is provided, use it to scope which tests to run (e.g., a specific test file or pattern).
