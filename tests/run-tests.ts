import { db } from '../server/db/database.js';
import { providerRouter } from '../server/providers/router.js';
import { jobQueue } from '../server/jobs/queue.js';
import { authService } from '../server/auth/authService.js';
import { buildDeterministicTimeline, generateSrtSubtitles, buildPublishingPackage } from '../server/renderer/timeline.js';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    failed++;
  }
}

async function runTestSuite() {
  console.log('--- Starting JayTech AI Test Suite ---');

  // Test 1: Database Seeding & User Fetching
  const defaultUser = db.getUserById('user-jafta-creator');
  assert(!!defaultUser && defaultUser.name === 'Jafta Moloto', 'Default creator user exists and is properly seeded');

  // Test 2: Sample Project "The Rise of Jafta"
  const jaftaProject = db.getProjectById('proj-the-rise-of-jafta');
  assert(!!jaftaProject, 'Project "The Rise of Jafta" is pre-seeded');
  assert(jaftaProject?.scenes.length === 5, 'The Rise of Jafta contains exactly 5 cinematic scenes');
  assert(jaftaProject?.targetDuration === 45, 'Target duration is 45 seconds');

  // Test 3: Brand Kit & Character Bible
  const brandKits = db.getBrandKits(defaultUser!.id);
  assert(brandKits.length > 0, 'Brand kits retrieved for user');
  const jaftaCharacter = brandKits[0].characterBible.find(c => c.name === 'Jafta');
  assert(!!jaftaCharacter && jaftaCharacter.appearance.includes('warrior'), 'Character bible contains Jafta warrior description');

  // Test 4: Provider Router Brief Generation
  const brief = await providerRouter.generateBrief('Create a 45-second TikTok about Jafta, ruler of the skies');
  assert(brief.sceneCount >= 4, 'Creative brief generates adequate scene count');
  assert(brief.aspectRatio === '9:16', 'Default aspect ratio is 9:16 vertical');

  // Test 5: Provider Router Script & Hooks
  const script = await providerRouter.generateScript('The Rise of Jafta', brief);
  assert(script.hooks.length >= 3, 'Generates at least 3 opening hook variations');
  assert(script.mainScript.length > 50, 'Main script body is generated');
  assert(script.hashtags.topic.length > 0, 'Hashtags are organized into categories');

  // Test 6: Storyboard Scene Decomposition
  const scenes = await providerRouter.decomposeStoryboard(script, brief);
  assert(scenes.length >= 4, 'Script decomposed into scenes');
  assert(scenes[0].visualPrompt.length > 20, 'Scene 1 has detailed visual prompt');
  assert(!!scenes[0].cameraDirection, 'Scene has camera direction');

  // Test 7: Timeline & Subtitle (SRT) Generation
  const timeline = buildDeterministicTimeline(jaftaProject!);
  assert(timeline.tracks.length === 4, 'Deterministic composition timeline has 4 tracks (video, narration, music, captions)');
  const srt = generateSrtSubtitles(jaftaProject!.scenes);
  assert(srt.includes('-->') && srt.includes('Before kings ruled'), 'Valid SRT format generated with timestamps');

  // Test 8: Publishing Package Assembly
  const pkg = buildPublishingPackage(jaftaProject!);
  assert(!!pkg.videoUrl, 'Publishing package contains video URL');
  assert(!!pkg.coverHeadline, 'Publishing package contains cover headline');
  assert(pkg.hashtags.includes('#'), 'Publishing package contains formatted hashtags');
  assert(JSON.parse(pkg.metadataJson).platform === 'TikTok', 'Publishing package metadata valid JSON');

  // Test 9: Async Job Queue
  const testJob = jobQueue.createJob(jaftaProject!.id, 'FULL_PIPELINE');
  assert(testJob.status === 'QUEUED', 'Job initialized with QUEUED status');
  jobQueue.updateJobProgress(testJob.id, 'RUNNING', 50, 'Generating assets');
  const updatedJob = db.getJob(testJob.id);
  assert(updatedJob?.progress === 50 && updatedJob.status === 'RUNNING', 'Job progress updated correctly');

  // Test 10: Authentication
  const auth = authService.login('creator@example.com');
  assert(!!auth.token && auth.user.role === 'CREATOR', 'Auth service logs in and generates session token');

  console.log(`\nTest Suite Complete: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});
