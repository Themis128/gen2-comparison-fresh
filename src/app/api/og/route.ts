import type { NextRequest } from 'next/server';

import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export const runtime = 'nodejs';

interface OGImageParams {
  title?: string;
  description?: string;
  type?: 'website' | 'article' | 'profile';
  image?: string;
  siteName?: string;
  author?: string;
}

function generateHTML(params: OGImageParams): string {
  const {
    title = 'Theo Baltzakis',
    description = 'Full-Stack Developer & Software Engineer',
    type = 'website',
    siteName = 'Theo Baltzakis Portfolio',
    author = 'Theo Baltzakis',
  } = params;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            width: 1200px;
            height: 630px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;
            overflow: hidden;
          }

          .background-pattern {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 0.1;
            background-image:
              radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.2) 0%, transparent 50%);
          }

          .content {
            z-index: 1;
            text-align: center;
            padding: 60px;
            max-width: 1000px;
          }

          .title {
            font-size: 72px;
            font-weight: 700;
            line-height: 1.1;
            margin-bottom: 24px;
            text-shadow: 0 4px 8px rgba(0,0,0,0.3);
            background: linear-gradient(45deg, #ffffff, #f0f0f0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .description {
            font-size: 32px;
            font-weight: 400;
            line-height: 1.4;
            margin-bottom: 40px;
            opacity: 0.9;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }

          .meta {
            font-size: 24px;
            opacity: 0.8;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }

          .badge {
            position: absolute;
            top: 40px;
            right: 40px;
            background: rgba(255,255,255,0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.3);
            border-radius: 50px;
            padding: 12px 24px;
            font-size: 18px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .author {
            position: absolute;
            bottom: 40px;
            left: 40px;
            font-size: 20px;
            opacity: 0.7;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }

          .site-name {
            position: absolute;
            bottom: 40px;
            right: 40px;
            font-size: 20px;
            opacity: 0.7;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
        </style>
      </head>
      <body>
        <div class="background-pattern"></div>
        <div class="badge">${type}</div>
        <div class="content">
          <h1 class="title">${title}</h1>
          <p class="description">${description}</p>
          <div class="meta">
            <span class="author">${author}</span>
            <span class="site-name">${siteName}</span>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function GET(request: NextRequest) {
  console.log('og-init: Starting OG image generation');
  try {
    const { searchParams } = new URL(request.url);

    const params: OGImageParams = {
      title: searchParams.get('title') || undefined,
      description: searchParams.get('description') || undefined,
      type: (searchParams.get('type') as OGImageParams['type']) || 'website',
      image: searchParams.get('image') || undefined,
      siteName: searchParams.get('siteName') || undefined,
      author: searchParams.get('author') || undefined,
    };

    const html = generateHTML(params);

    // Launch browser
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630 });
    await page.setContent(html);

    // Wait for fonts to load
    await new Promise((resolve) => setTimeout(resolve, 100));

    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: false,
    });

    await browser.close();

    return new Response(new Uint8Array(screenshot), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('OG Image generation error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
