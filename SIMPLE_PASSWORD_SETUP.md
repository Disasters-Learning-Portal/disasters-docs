# Simple Password Protection Setup

This setup uses a GitHub secret to password-protect your documentation site.

## Setup Steps (5 minutes)

### Step 1: Add Password to GitHub Secrets

1. Go to your GitHub repository: `https://github.com/Disasters-Learning-Portal/disasters-docs`
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret**
5. Enter:
   - **Name:** `SITE_PASSWORD`
   - **Secret:** Your desired password (e.g., `DisastersPortal2024`)
6. Click **Add secret**

### Step 2: Enable GitHub Actions

Make sure GitHub Actions is enabled:
1. Go to **Settings** → **Actions** → **General**
2. Ensure "Allow all actions and reusable workflows" is selected

### Step 3: Commit and Push

```bash
git add .
git commit -m "Add password protection"
git push
```

The GitHub Action will automatically:
- Build your Quarto site
- Inject the password from the secret into the login page
- Deploy to GitHub Pages

### Step 4: Test

1. Wait 2-3 minutes for GitHub Actions to complete
2. Visit: `https://disasters-learning-portal.github.io/disasters-docs/password-protect.html`
3. Enter your password
4. You should be redirected to the documentation

## How It Works

1. **GitHub Secret:** Password stored securely in `SITE_PASSWORD` secret
2. **GitHub Actions:** Workflow injects password during build
3. **Login Page:** `password-protect.html` checks entered password
4. **Session:** Authenticated for 8 hours via localStorage
5. **All Pages:** `auth-check.js` verifies authentication

## Making the Login Page Default

To make users see the login page first, you have two options:

### Option A: Rename in GitHub Pages settings

1. After deployment, go to **Settings** → **Pages**
2. GitHub Pages should show `password-protect.html` as an option
3. Or add a redirect in your main `index.html`

### Option B: Add redirect to index.qmd

Add this to the top of your [index.qmd](index.qmd):

```html
<meta http-equiv="refresh" content="0; url=password-protect.html">
```

Or add JavaScript redirect in [_quarto.yml](_quarto.yml):

```yaml
format:
  html:
    include-before-body:
      - text: |
          <script>
          if (!localStorage.getItem('disasters_docs_auth')) {
            window.location.href = 'password-protect.html';
          }
          </script>
```

## Changing the Password

1. Go to GitHub **Settings** → **Secrets and variables** → **Actions**
2. Click on `SITE_PASSWORD`
3. Click **Update secret**
4. Enter new password
5. Re-run the GitHub Action or push a new commit

## Files Created

- `password-protect.html` - Login page
- `auth-check.js` - Authentication check on all pages
- `.github/workflows/deploy-with-password.yml` - GitHub Actions workflow
- `_quarto.yml` - Updated to include auth-check.js

## Security Notes

⚠️ **This is client-side protection** - password is visible in browser source after deployment. Good for:
- Internal documentation
- Preventing casual access
- Simple team authentication

❌ **NOT suitable for:**
- Highly sensitive data
- Public-facing secure content
- Compliance requirements

For real security, you'd need server-side authentication (like the CloudFront + Keycloak approach).

## Troubleshooting

**Q: Password doesn't work**
- Check the `SITE_PASSWORD` secret is set correctly in GitHub
- Re-run the GitHub Action to rebuild the site

**Q: Can still access pages without login**
- Clear browser localStorage: `localStorage.clear()`
- Make sure `auth-check.js` is being loaded (check _quarto.yml)
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

**Q: GitHub Action fails**
- Check the Actions tab for error details
- Make sure `SITE_PASSWORD` secret exists
- Verify the workflow file is in `.github/workflows/`
