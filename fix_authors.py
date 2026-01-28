#!/usr/bin/env python3
import subprocess
import sys

# Configuration
NEW_NAME = "Ravi Shankar"
NEW_EMAIL = "ravishankar82923@gmail.com"

def run_command(cmd):
    """Run a shell command and return output."""
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result.returncode, result.stdout, result.stderr

# Get all commit hashes
print("Getting all commits...")
code, commits, err = run_command("git log --format='%H' --all")
if code != 0:
    print(f"Error getting commits: {err}")
    sys.exit(1)

commit_list = [c.strip() for c in commits.split('\n') if c.strip()]
print(f"Found {len(commit_list)} commits to rewrite")

# Set environment variables
env_filter = f"""
export GIT_AUTHOR_NAME="{NEW_NAME}"
export GIT_AUTHOR_EMAIL="{NEW_EMAIL}"
export GIT_COMMITTER_NAME="{NEW_NAME}"
export GIT_COMMITTER_EMAIL="{NEW_EMAIL}"
"""

# Run filter-branch
print("\nRewriting commit history...")
cmd = f'FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch --force --env-filter \'{env_filter}\' -- --all'
code, out, err = run_command(cmd)

if code == 0:
    print("✅ Successfully rewrote all commits!")
    print("\nVerifying changes...")
    code, log, _ = run_command('git log --format="%an <%ae>" -5')
    print(log)
    print("\nNext steps:")
    print("1. Review the changes above")
    print("2. Run: git push --force origin main")
    print("3. Clean up: rm -rf .git/refs/original/")
else:
    print(f"❌ Error: {err}")
    sys.exit(1)
