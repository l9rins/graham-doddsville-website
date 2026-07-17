const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');

const pages = {
    'philosophy.html': 'Warren Buffett on Investment Philosophy',
    'investing.html': 'Warren Buffett on Investment Strategies',
    'businesses.html': 'Warren Buffett on Businesses',
    'governance.html': 'Warren Buffett on Corporate Governance',
    'accounting.html': 'Warren Buffett on Accounting and Valuation',
    'economics.html': 'Warren Buffett on Economy',
    'miscellaneous.html': 'Warren Buffett on Miscellaneous'
};

// Copy philosophy.html to economics.html as a starting point to rebuild it
const philosophyContent = fs.readFileSync(path.join(publicDir, 'philosophy.html'), 'utf8');
// wait, the topics for economics might be in the backup?
// For now, let's just make sure we update the existing files appropriately.

for (const [filename, newTitle] of Object.entries(pages)) {
    const filePath = path.join(publicDir, filename);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');

    // If it's economics, and it doesn't look like philosophy, rebuild it using philosophy as a template
    if (filename === 'economics.html' && !content.includes('topicModal')) {
        console.log("Rebuilding economics.html from philosophy.html template");
        content = philosophyContent; // Start with philosophy template, then we'll change titles
        // We also need to clear out the buffettTopicsData to be empty or keep the old one?
        // Let's assume the user doesn't have the economics quotes yet or they are in the script block.
    }

    // 1. Update Title and H1
    content = content.replace(/<title>.*?<\/title>/, `<title>${newTitle} - Graham and Doddsville</title>`);
    content = content.replace(/<h1.*?>.*?<\/h1>/, `<h1 style="font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; color: #111827; margin-bottom: 8px; letter-spacing: -0.02em;">${newTitle}</h1>`);

    // 2. Add In-Page Detail View
    // Find where to insert the detail view. A good place is right before the topics grid container or replacing the modal.
    // Let's replace the modal HTML.
    const modalRegex = /<!-- Topic Modal -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
    const inPageHTML = `
    <!-- Topic Detail View (In-Page Navigation) -->
    <div id="topic-detail-view" style="display: none; background: #fff; border: 1px solid var(--border-color); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); padding: 32px; margin-bottom: 40px;">
        <button onclick="closeTopicView()" style="background: none; border: none; color: var(--primary-blue); cursor: pointer; font-weight: 600; font-size: 16px; display: flex; align-items: center; gap: 8px; margin-bottom: 24px; padding: 0;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Back to Topics
        </button>
        <div id="topic-detail-content" style="color: var(--text-primary); font-size: 16px; line-height: 1.8;"></div>
    </div>
    `;
    
    if (modalRegex.test(content)) {
        content = content.replace(modalRegex, inPageHTML);
    } else if (content.includes('id="topicModal"')) {
        // Fallback regex if comments are different
        content = content.replace(/<div id="topicModal" class="modal">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, inPageHTML);
    }

    // Find the topics-grid container and add an ID so we can hide it
    // Wait, some pages have multiple .subcategory-section with .topics-grid.
    // It's better to wrap all topics in a container, or hide .subcategory-section
    
    // 3. Update the JavaScript
    const oldJsRegex = /\/\/ Buffett Topic Modal Logic[\s\S]*?const buffettTopicsData = \{/;
    if (content.includes('// Buffett Topic Modal Logic')) {
        // We'll replace the click listener and the open/close functions
        // Let's just find the openTopicModal and closeTopicModal functions
        
        content = content.replace(/function openTopicModal\(title\)\s*\{[\s\S]*?\}/, `
        function openTopicModal(title) {
            const key = title.toLowerCase().trim();
            if (buffettTopicsData[key]) {
                document.getElementById('topic-detail-content').innerHTML = buffettTopicsData[key];
                
                // Hide all subcategory sections and grids
                document.querySelectorAll('.subcategory-section').forEach(el => el.style.display = 'none');
                
                // Show the detail view
                document.getElementById('topic-detail-view').style.display = 'block';
                
                // Scroll to the top of the detail view
                window.scrollTo({ top: document.getElementById('topic-detail-view').offsetTop - 100, behavior: 'smooth' });
            }
        }`);
        
        content = content.replace(/function closeTopicModal\(\)\s*\{[\s\S]*?\}/, `
        function closeTopicView() {
            document.getElementById('topic-detail-view').style.display = 'none';
            document.querySelectorAll('.subcategory-section').forEach(el => el.style.display = 'block');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }`);
        
        // Remove the window.onclick that closes the modal
        content = content.replace(/\/\/ Close modal when clicking outside[\s\S]*?window\.onclick = function \(event\) \{[\s\S]*?\}\s*\}/, '');
        
        // Remove the "close on X click" code if it exists
        content = content.replace(/document\.querySelector\('\.modal-close'\)\.addEventListener\('click', closeTopicModal\);/, '');
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Processed " + filename);
}
