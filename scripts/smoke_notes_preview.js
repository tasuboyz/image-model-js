import PromptGenerator from '../src/lib/promptGenerator.js';

function run() {
  const gen = new PromptGenerator();
  const formData = { identity: { gender: 'female', age: '25', notes: 'A mysterious scar on left cheek' }, appearance: {}, outfit: {}, scene: {} };
  const res = gen.generate(formData);
  console.log('PROMPT:', res.prompt);
  if (!res.prompt.includes('A mysterious scar')) {
    console.error('Notes not included in prompt');
    process.exit(2);
  }
  console.log('Smoke test passed');
}

run();
