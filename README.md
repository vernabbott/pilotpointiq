# PilotPointIQ

This repository is configured to deploy the site to GitHub Pages using GitHub Actions.

Quick setup and deploy:

1. Ensure your local git branch is `main` (or change the workflow branch).
2. Add the remote and push:

```bash
git remote add origin https://github.com/vernabbott/pilotpointiq.git
git branch -M main
git push -u origin main
```

The `CNAME` file is included for the custom domain `pilotpointiq.com`. Configure your DNS to point the domain to GitHub Pages (A records for apex domain or CNAME for subdomain).
