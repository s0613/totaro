#!/usr/bin/env node

/**
 * Toss Payments 환경변수 검증 스크립트
 *
 * 배포 전 필수 환경변수가 올바르게 설정되었는지 확인합니다.
 *
 * Usage:
 *   node scripts/check-payment-env.js
 *   npm run check:payment-env
 */

const chalk = require('chalk');

// ANSI 색상 코드 (chalk 없이 사용 가능)
const colors = {
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`,
};

console.log(colors.bold(colors.cyan('\n🔍 Toss Payments 환경변수 검증 시작...\n')));

let hasError = false;
let warnings = [];

// 1. Client Key 검증
const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
console.log('1. Client Key 검증...');

if (!clientKey) {
  console.log(colors.red('   ❌ NEXT_PUBLIC_TOSS_CLIENT_KEY가 설정되지 않았습니다.'));
  hasError = true;
} else if (clientKey.startsWith('test_gck_')) {
  console.log(colors.green('   ✅ Payment Widget 테스트 모드입니다 (test_gck_)'));
  console.log(colors.cyan(`      현재 키: ${clientKey.substring(0, 20)}...`));
  if (clientKey.includes('docs')) {
    warnings.push('Toss 공개 샘플 키를 사용 중입니다. 실제 프로젝트에서는 본인의 키를 발급받으세요.');
  }
} else if (clientKey.startsWith('live_gck_')) {
  console.log(colors.green('   ✅ Payment Widget 실제 결제 모드입니다 (live_gck_)'));
  console.log(colors.cyan(`      현재 키: ${clientKey.substring(0, 20)}...`));
} else if (clientKey.startsWith('test_ck_') || clientKey.startsWith('live_ck_')) {
  console.log(colors.red('   ❌ API 개별 연동 키입니다. Payment Widget에서는 사용할 수 없습니다!'));
  console.log(colors.red(`      현재 키: ${clientKey.substring(0, 20)}...`));
  console.log(colors.yellow('   💡 해결방법:'));
  console.log(colors.yellow('      1. https://developers.tosspayments.com 로그인'));
  console.log(colors.yellow('      2. "내 개발 정보" → "API 키 관리"'));
  console.log(colors.yellow('      3. "결제위젯(Payment Widget)" 타입으로 키 발급'));
  console.log(colors.yellow('      4. test_gck_ 또는 live_gck_로 시작하는 키 사용'));
  hasError = true;
} else {
  console.log(colors.red('   ❌ 올바르지 않은 Client Key 형식입니다.'));
  console.log(colors.red(`      현재 값: ${clientKey.substring(0, 20)}...`));
  hasError = true;
}

// 2. Secret Key 검증
const secretKey = process.env.TOSS_SECRET_KEY;
console.log('\n2. Secret Key 검증...');

if (!secretKey) {
  console.log(colors.red('   ❌ TOSS_SECRET_KEY가 설정되지 않았습니다.'));
  hasError = true;
} else if (secretKey.startsWith('test_gsk_')) {
  console.log(colors.green('   ✅ Payment Widget 테스트 모드입니다 (test_gsk_)'));
  console.log(colors.cyan(`      현재 키: ${secretKey.substring(0, 20)}...`));
} else if (secretKey.startsWith('live_gsk_')) {
  console.log(colors.green('   ✅ Payment Widget 실제 결제 모드입니다 (live_gsk_)'));
  console.log(colors.cyan(`      현재 키: ${secretKey.substring(0, 20)}...`));
} else if (secretKey.startsWith('test_sk_') || secretKey.startsWith('live_sk_')) {
  console.log(colors.red('   ❌ API 개별 연동 키입니다. Payment Widget에서는 사용할 수 없습니다!'));
  console.log(colors.red(`      현재 키: ${secretKey.substring(0, 20)}...`));
  console.log(colors.yellow('   💡 test_gsk_ 또는 live_gsk_로 시작하는 키를 사용하세요.'));
  hasError = true;
} else {
  console.log(colors.red('   ❌ 올바르지 않은 Secret Key 형식입니다.'));
  console.log(colors.red(`      현재 값: ${secretKey.substring(0, 20)}...`));
  hasError = true;
}

// 3. 키 모드 일치 확인
console.log('\n3. 키 모드 일치 확인...');

const clientKeyMode = clientKey?.startsWith('test_gck_') ? 'test' : clientKey?.startsWith('live_gck_') ? 'live' : 'unknown';
const secretKeyMode = secretKey?.startsWith('test_gsk_') ? 'test' : secretKey?.startsWith('live_gsk_') ? 'live' : 'unknown';

if (clientKeyMode !== secretKeyMode) {
  console.log(colors.red('   ❌ Client Key와 Secret Key의 모드가 일치하지 않습니다!'));
  console.log(colors.red(`      Client Key: ${clientKeyMode} 모드`));
  console.log(colors.red(`      Secret Key: ${secretKeyMode} 모드`));
  hasError = true;
} else {
  console.log(colors.green(`   ✅ 모두 ${clientKeyMode} 모드로 일치합니다.`));
}

// 4. Site URL 검증
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
console.log('\n4. Site URL 검증...');

if (!siteUrl) {
  console.log(colors.red('   ❌ NEXT_PUBLIC_SITE_URL이 설정되지 않았습니다.'));
  hasError = true;
} else if (siteUrl.includes('localhost')) {
  console.log(colors.yellow('   ⚠️  로컬 개발 환경입니다'));
  console.log(colors.yellow(`      현재 URL: ${siteUrl}`));
  warnings.push('로컬 URL이 사용 중입니다. 프로덕션 배포 시 실제 도메인으로 변경하세요.');
} else if (!siteUrl.startsWith('https://')) {
  console.log(colors.red('   ❌ HTTPS를 사용해야 합니다!'));
  console.log(colors.red(`      현재 URL: ${siteUrl}`));
  hasError = true;
} else {
  console.log(colors.green('   ✅ 올바른 Site URL입니다.'));
  console.log(colors.cyan(`      현재 URL: ${siteUrl}`));
}

// 5. Callback URL 검증
console.log('\n5. Callback URL 검증...');
const successUrl = `${siteUrl}/checkout/success`;
const failUrl = `${siteUrl}/checkout/fail`;

console.log(colors.cyan(`   Success URL: ${successUrl}`));
console.log(colors.cyan(`   Fail URL: ${failUrl}`));

// 6. Supabase 환경변수 검증
console.log('\n6. Supabase 환경변수 검증...');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.log(colors.red('   ❌ NEXT_PUBLIC_SUPABASE_URL이 설정되지 않았습니다.'));
  hasError = true;
} else {
  console.log(colors.green('   ✅ Supabase URL이 설정되었습니다.'));
}

if (!supabaseAnonKey) {
  console.log(colors.red('   ❌ NEXT_PUBLIC_SUPABASE_ANON_KEY가 설정되지 않았습니다.'));
  hasError = true;
} else {
  console.log(colors.green('   ✅ Supabase Anon Key가 설정되었습니다.'));
}

// 7. Payment Widget Version 확인
console.log('\n7. Payment Widget Version 확인...');

const widgetVersion = process.env.NEXT_PUBLIC_TOSS_PAYMENT_WIDGET_VERSION || '2.0';
console.log(colors.cyan(`   Widget Version: ${widgetVersion}`));

// 결과 요약
console.log(colors.bold('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

if (hasError) {
  console.log(colors.bold(colors.red('❌ 환경변수 검증 실패\n')));
  console.log(colors.red('위의 오류를 수정한 후 다시 시도하세요.\n'));
  process.exit(1);
} else if (warnings.length > 0) {
  console.log(colors.bold(colors.yellow('⚠️  환경변수 검증 완료 (경고 있음)\n')));
  console.log(colors.yellow('경고 사항:'));
  warnings.forEach((warning, i) => {
    console.log(colors.yellow(`  ${i + 1}. ${warning}`));
  });
  console.log('');

  // 모드별 안내
  if (clientKeyMode === 'test') {
    console.log(colors.cyan('📝 현재 테스트 모드입니다.'));
    console.log(colors.cyan('   - 테스트 카드로 결제 테스트 가능'));
    console.log(colors.cyan('   - 실제 결제는 발생하지 않음'));
    console.log(colors.cyan('   - 프로덕션 배포 시 live 키로 변경 필요\n'));
  }
} else {
  console.log(colors.bold(colors.green('✅ 모든 환경변수가 올바르게 설정되었습니다!\n')));

  if (clientKeyMode === 'live') {
    console.log(colors.bold(colors.green('🚀 실제 결제 모드입니다.')));
    console.log(colors.green('   - 실제 결제가 처리됩니다'));
    console.log(colors.green('   - 카드 승인 및 정산 진행'));
    console.log(colors.green('   - 프로덕션 배포 준비 완료\n'));
  }
}

console.log(colors.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

// 환경별 추가 안내
const nodeEnv = process.env.NODE_ENV || 'development';
console.log(colors.cyan(`현재 환경: ${colors.bold(nodeEnv)}`));

if (nodeEnv === 'production' && clientKeyMode === 'test') {
  console.log(colors.red('\n⚠️  경고: 프로덕션 환경인데 테스트 키를 사용 중입니다!'));
  console.log(colors.red('   실제 결제를 위해 live 키로 변경하세요.\n'));
}

// 다음 단계 안내
console.log(colors.cyan('\n다음 단계:'));
if (clientKeyMode === 'test') {
  console.log(colors.cyan('  1. npm run dev 로 개발 서버 실행'));
  console.log(colors.cyan('  2. http://localhost:3000/checkout 에서 테스트 결제'));
  console.log(colors.cyan('  3. 테스트 카드: 5570-1234-5678-9012'));
  console.log(colors.cyan('  4. 모든 기능 테스트 완료 후 프로덕션 배포'));
} else {
  console.log(colors.cyan('  1. npm run build 로 프로덕션 빌드'));
  console.log(colors.cyan('  2. vercel --prod 로 배포'));
  console.log(colors.cyan('  3. 소액(1,000원) 테스트 결제 수행'));
  console.log(colors.cyan('  4. Toss Dashboard에서 결제 확인'));
}

console.log('');
