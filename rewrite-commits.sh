#!/bin/bash
git filter-branch --force --env-filter '
export GIT_AUTHOR_NAME="Ravi Shankar"
export GIT_AUTHOR_EMAIL="ravishankar82923@gmail.com"
export GIT_COMMITTER_NAME="Ravi Shankar"
export GIT_COMMITTER_EMAIL="ravishankar82923@gmail.com"
' -- --all
