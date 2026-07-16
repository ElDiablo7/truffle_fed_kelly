# Truffle Fed by Kelly Stopher

Luxury one-page website for Truffle Fed, Émeraude Noire and White Gold Escargot Elite. Built with Next.js and prepared for GitHub-to-Railway deployment.

## Deploy on Railway

1. In Railway, create a **New Project** and choose **Deploy from GitHub repo**.
2. Select `ElDiablo7/truffle_fed_kelly`.
3. On the project canvas, choose **+ New → Database → Add PostgreSQL**.
4. Open the website service, go to **Variables**, and add:

   ```text
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   ```

5. Open **Settings → Networking** and choose **Generate Domain**.
6. Add the generated address as another website-service variable:

   ```text
   NEXT_PUBLIC_SITE_URL=https://your-generated-domain.up.railway.app
   OPENAI_API_KEY=your-secret-openai-api-key
   ```

Railway reads `railway.json`, runs `npm run build`, starts the site on its injected `PORT`, and redeploys automatically whenever the connected GitHub branch changes.

GRACE-X uses `gpt-4o-mini` for grounded concierge answers and `gpt-4o-mini-tts` with the `marin` voice. Override these defaults with `OPENAI_MODEL`, `OPENAI_VOICE_MODEL` or `OPENAI_VOICE` if required. The API key remains server-side.

## Local development

```bash
npm install
npm run dev
```

The page works locally without PostgreSQL, but submitting the enquiry form requires `DATABASE_URL`.

## Enquiries

The form validates input, includes a consent checkbox and spam honeypot, and stores accepted submissions in the PostgreSQL `enquiries` table. The table is created automatically on the first valid submission.
