#!/bin/bash

# Change author information for all commits
git filter-branch -f --env-filter '
CORRECT_NAME="Ravi Shankar"
CORRECT_EMAIL="ravishankar82923@gmail.com"

export GIT_COMMITTER_NAME="$CORRECT_NAME"
export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
export GIT_AUTHOR_NAME="$CORRECT_NAME"
export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
' --tag-name-filter cat -- --branches --tags
