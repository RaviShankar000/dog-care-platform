#!/bin/bash

echo "Step 1: Installing git-filter-repo..."
brew install git-filter-repo

echo -e "\nStep 2: Rewriting commit history with mailmap..."
git filter-repo --mailmap .mailmap --force

echo -e "\nStep 3: Adding back remote..."
git remote add origin https://github.com/RaviShankar000/dog-care-platform.git

echo -e "\nStep 4: Force pushing to GitHub..."
git push --force origin main

echo -e "\n✅ Done! Verifying commits..."
git log --format="%an <%ae>" -8

echo -e "\nAll your commits should now show: Ravi Shankar <ravishankar82923@gmail.com>"
echo "Check your GitHub contribution graph - it should now show all 8 contributions!"
