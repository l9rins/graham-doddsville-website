const fs = require('fs');
const logPath = 'C:/Users/Mark Lorenz/.gemini/antigravity/brain/5f2a59ac-4e92-4403-befc-0aed70cc51f9/.system_generated/logs/overview.txt';

if (!fs.existsSync(logPath)) {
    console.log('Log file does not exist');
    process.exit(1);
}

const content = fs.readFileSync(logPath, 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
    if (line.includes('"USER_EXPLICIT"')) {
        try {
            const obj = JSON.parse(line);
            console.log(`=== USER MESSAGE ${idx} (step_index: ${obj.step_index}) ===`);
            console.log(obj.content);
        } catch (e) {
            console.log(`Failed to parse line ${idx}:`, line.slice(0, 200));
        }
    }
});
