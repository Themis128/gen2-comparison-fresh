#!/usr/bin/env node

/**
 * Turbopack Performance Monitor
 * Monitors Next.js dev server performance with Turbopack
 */

import http from 'http';

const SERVER_URL = 'http://localhost:3001';
const TEST_ROUTES = [
  '/',
  '/test-page',
  '/custom-navigation-demo',
  '/auth/signin'
];

const MEASUREMENTS = 5;

async function measureResponseTime(url) {
  const start = process.hrtime.bigint();

  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const end = process.hrtime.bigint();
        const duration = Number(end - start) / 1e6; // Convert to milliseconds
        resolve({
          url,
          status: res.statusCode,
          duration,
          size: data.length
        });
      });
    }).on('error', reject);
  });
}

async function runBenchmark() {
  console.log('🚀 Turbopack Performance Monitor');
  console.log('================================');
  console.log(`Testing ${SERVER_URL} with ${MEASUREMENTS} measurements per route\n`);

  const results = {};

  for (const route of TEST_ROUTES) {
    const url = `${SERVER_URL}${route}`;
    console.log(`📊 Testing ${route}...`);

    const measurements = [];
    for (let i = 0; i < MEASUREMENTS; i++) {
      try {
        const result = await measureResponseTime(url);
        measurements.push(result);
        process.stdout.write(`  ${i + 1}/${MEASUREMENTS}: ${result.duration.toFixed(2)}ms (${result.status})  `);

        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
        measurements.push({ url, status: 'ERROR', duration: 0, size: 0 });
      }
    }

    const validMeasurements = measurements.filter(m => m.status !== 'ERROR');
    const avgDuration = validMeasurements.reduce((sum, m) => sum + m.duration, 0) / validMeasurements.length;
    const minDuration = Math.min(...validMeasurements.map(m => m.duration));
    const maxDuration = Math.max(...validMeasurements.map(m => m.duration));

    results[route] = {
      measurements: validMeasurements.length,
      avgDuration,
      minDuration,
      maxDuration,
      totalSize: validMeasurements.reduce((sum, m) => sum + m.size, 0)
    };

    console.log(`\n    📈 Avg: ${avgDuration.toFixed(2)}ms | Min: ${minDuration.toFixed(2)}ms | Max: ${maxDuration.toFixed(2)}ms\n`);
  }

  // Summary
  console.log('📋 Summary:');
  console.log('===========');

  const totalAvg = Object.values(results).reduce((sum, r) => sum + r.avgDuration, 0) / Object.keys(results).length;

  console.log(`Overall average response time: ${totalAvg.toFixed(2)}ms`);
  console.log(`Total routes tested: ${TEST_ROUTES.length}`);
  console.log(`Measurements per route: ${MEASUREMENTS}`);

  // Performance rating
  let rating = 'Unknown';
  if (totalAvg < 200) rating = '🚀 Excellent';
  else if (totalAvg < 500) rating = '⚡ Good';
  else if (totalAvg < 1000) rating = '🐌 Fair';
  else rating = '🐌 Slow';

  console.log(`Performance rating: ${rating}`);

  console.log('\n✅ Benchmark complete!');
}

runBenchmark().catch(console.error);
