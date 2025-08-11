#!/usr/bin/env node

// Test the fixed daily vote tracking logic
import { simpleDailyTracker } from './server/utils/simpleDailyTracker.js';

console.log('🧪 Testing Fixed Daily Vote Tracking Logic');
console.log('==========================================\n');

// Reset tracker to start clean
simpleDailyTracker.resetDay();

console.log('📋 Test 1: First-time initialization (no previous data)');
console.log('--------------------------------------------------------');
const firstVotes = simpleDailyTracker.updateVoteCount(100000);
console.log(`✓ Daily votes added (first time): ${firstVotes} (should be 0 - no baseline)`);

console.log('\n📋 Test 2: Update with more votes (same day)');
console.log('----------------------------------------------');
const secondVotes = simpleDailyTracker.updateVoteCount(100050);
console.log(`✓ Daily votes added (after update): ${secondVotes} (should be 50)`);

console.log('\n📋 Test 3: Another update (same day)');
console.log('-------------------------------------');
const thirdVotes = simpleDailyTracker.updateVoteCount(100075);
console.log(`✓ Daily votes added (another update): ${thirdVotes} (should be 75)`);

console.log('\n📋 Test 4: Debug information');
console.log('-----------------------------');
simpleDailyTracker.debugInfo();

console.log('\n📋 Test 5: Get today stats');
console.log('---------------------------');
const todayStats = simpleDailyTracker.getTodayStats();
console.log('✓ Today stats:', JSON.stringify(todayStats, null, 2));

console.log('\n🏁 Test completed! Check the daily-vote-data.json file for persistence.');
console.log('To test persistence after server restart, run this script again.');
