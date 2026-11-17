const http = require('http');

const allRoutes = [
  '/',
  '/about',
  '/admin',
  '/blog',
  '/contact',
  '/docs',
  '/features',
  '/forgot-password',
  '/industries',
  '/login',
  '/onboarding',
  '/pricing',
  '/privacy',
  '/reset-password',
  '/signup',
  '/terms',
  '/dashboard',
  '/dashboard/agent-playground',
  '/dashboard/agent-quality',
  '/dashboard/agent-studio',
  '/dashboard/ai-employees',
  '/dashboard/ai-followup-copilot',
  '/dashboard/ai-lead-scoring',
  '/dashboard/ai-revenue-intelligence',
  '/dashboard/analytics',
  '/dashboard/automations',
  '/dashboard/call-history',
  '/dashboard/campaigns',
  '/dashboard/contacts',
  '/dashboard/crm',
  '/dashboard/customer-360',
  '/dashboard/help',
  '/dashboard/integrations',
  '/dashboard/knowledge-base',
  '/dashboard/leads',
  '/dashboard/live-calls',
  '/dashboard/notifications',
  '/dashboard/phone-numbers',
  '/dashboard/settings',
  '/dashboard/team',
  '/dashboard/wallet'
];

async function auditAllRoutes() {
  console.log(`Auditing all ${allRoutes.length} application routes on http://localhost:3000...\n`);
  let passed = 0;
  let failed = 0;

  for (const route of allRoutes) {
    await new Promise(resolve => {
      http.get('http://localhost:3000' + route, res => {
        const isOk = res.statusCode === 200 || (res.statusCode === 307 && res.headers.location?.includes('/login'));
        if (isOk) {
          passed++;
          console.log(`✓ ${route.padEnd(35)} [${res.statusCode}] ${res.headers.location ? '-> ' + res.headers.location : ''}`);
        } else {
          failed++;
          console.error(`✗ ${route.padEnd(35)} [FAIL: ${res.statusCode}]`);
        }
        resolve();
      }).on('error', e => {
        failed++;
        console.error(`✗ ${route.padEnd(35)} [ERROR: ${e.message}]`);
        resolve();
      });
    });
  }

  console.log(`\n========================================`);
  console.log(`TOTAL ROUTES AUDITED: ${allRoutes.length}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log(`========================================`);
}

auditAllRoutes();
