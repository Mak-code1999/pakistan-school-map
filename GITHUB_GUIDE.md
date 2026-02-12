# GitHub Setup Guide for Maktab

This guide will help you upload your Maktab project to GitHub, even if you've never used Git before.

## What is GitHub?

GitHub is a website where developers store and share their code. It's like Google Drive, but specifically for code projects. It's **completely free** for public projects.

## Step 1: Create GitHub Account

1. Go to: https://github.com/
2. Click "Sign up"
3. Enter your email, create a password, choose a username
4. Verify your email address
5. You're done! You now have a GitHub account.

## Step 2: Install Git on Windows

1. Download Git from: https://git-scm.com/download/win
2. Run the installer
3. Use all default settings (just keep clicking "Next")
4. Click "Install" and wait for it to finish

### Verify Git is Installed

Open Command Prompt (search for "cmd" in Windows) and type:
```bash
git --version
```

You should see something like: `git version 2.43.0`

## Step 3: Configure Git (One-Time Setup)

Open Command Prompt and run these commands (replace with your info):

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Example:
```bash
git config --global user.name "Mahrkh Iftikhar"
git config --global user.email "mahrkh@example.com"
```

## Step 4: Create a New Repository on GitHub

1. Go to: https://github.com/
2. Click the "+" icon (top-right corner)
3. Click "New repository"
4. Fill in:
   - **Repository name**: `maktab`
   - **Description**: "Pakistan School Mapping Platform - GIS Web Application"
   - **Public** (keep it public so Jugrafiya can see it)
   - **DO NOT** check "Add a README file"
5. Click "Create repository"

You'll see a page with instructions. **Keep this page open!**

## Step 5: Upload Your Project to GitHub

### Open Command Prompt in Your Project Folder

1. Open File Explorer
2. Navigate to: `C:\Users\Lenovo\Desktop\Maktab`
3. Click in the address bar (top of window)
4. Type `cmd` and press Enter
5. Command Prompt will open in this folder

### Run These Commands (Copy-Paste One at a Time)

```bash
# Initialize Git in your project
git init

# Add all files to Git
git add .

# Create your first commit
git commit -m "Initial commit: Maktab Pakistan School Mapping Platform"

# Rename branch to main
git branch -M main

# Connect to your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/maktab.git
```

**IMPORTANT**: Replace `YOUR_USERNAME` with your actual GitHub username!

Example:
```bash
git remote add origin https://github.com/mahrkh-iftikhar/maktab.git
```

```bash
# Upload to GitHub
git push -u origin main
```

### Authentication

When you run `git push`, you'll be asked to log in:
1. A browser window will open
2. Click "Authorize"
3. Your code will start uploading

## Step 6: Verify Upload

1. Go to: `https://github.com/YOUR_USERNAME/maktab`
2. You should see all your files:
   - backend/
   - frontend/
   - database/
   - README.md
   - .gitignore

## Step 7: Share with Jugrafiya

Send them this link:
```
https://github.com/YOUR_USERNAME/maktab
```

They can:
- View all your code
- Download it
- See your commit history

## Common Issues

### Error: "fatal: not a git repository"

**Solution**: Make sure you're in the correct folder. Run:
```bash
cd C:\Users\Lenovo\Desktop\Maktab
```

### Error: "remote origin already exists"

**Solution**: Remove the old remote and add again:
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/maktab.git
```

### Error: "failed to push some refs"

**Solution**: Pull first, then push:
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

## Making Changes Later

If you update your code and want to upload the changes:

```bash
# Add all changed files
git add .

# Create a commit with a message
git commit -m "Describe what you changed"

# Upload to GitHub
git push
```

## Important Files to Check

Before uploading, make sure:
- ✅ `.gitignore` file exists (it does!)
- ✅ No `.env` files are uploaded (they're ignored)
- ✅ No `venv/` folder is uploaded (it's ignored)
- ✅ No `node_modules/` folder is uploaded (it's ignored)

These are automatically excluded by the `.gitignore` file I created.

## Tips

- **Commit often**: Every time you make significant changes
- **Write clear commit messages**: "Added search feature" not "updated files"
- **Don't upload sensitive data**: Passwords, API keys (use .env files)

## What to Include in Your Submission

Send Jugrafiya:
1. **GitHub Repository Link**: `https://github.com/YOUR_USERNAME/maktab`
2. **README.md**: Already created (explains the project)
3. **Setup Instructions**: Already in backend/SETUP.md and frontend/SETUP.md

That's it! You're now a GitHub user! 🎉
