const fs = require('fs');
const logPath = 'C:/Users/Mark Lorenz/.gemini/antigravity/brain/5f2a59ac-4e92-4403-befc-0aed70cc51f9/.system_generated/logs/overview.txt';

if (!fs.existsSync(logPath)) {
    console.log('Log file does not exist');
    process.exit(1);
}

const content = fs.readFileSync(logPath, 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
    if (line.includes('"USER_EXPLICIT"') && line.includes('check please and thoroughly add smarttly')) {
        try {
            const obj = JSON.parse(line);
            fs.writeFileSync('scratch/user_docx_script.js', obj.content);
            console.log('Successfully wrote user_docx_script.js! Total length:', obj.content.length);
        } catch (e) {
            console.log('Failed to parse line:', idx, e.message);
        }
    }
});
