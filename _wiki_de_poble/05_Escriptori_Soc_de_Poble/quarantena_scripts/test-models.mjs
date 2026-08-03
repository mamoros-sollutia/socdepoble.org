import 'dotenv/config';
async function run() {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
  const json = await res.json();
  const names = json.models.map(m => m.name);
  console.log(names);
}
run();
