document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject modal HTML
    const modalHtml = `
    <div id="bookSummaryModal" class="topic-modal"
        style="display: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.5); backdrop-filter: blur(4px);">
        <div class="topic-modal-content"
            style="background-color: #fefefe; margin: 8% auto; padding: 32px; border-radius: 12px; max-width: 750px; width: 90%; box-shadow: 0 10px 25px rgba(0,0,0,0.15); border: 1px solid #e5e7eb; max-height: 80vh; overflow-y: auto; position: relative;">
            <span class="topic-modal-close" id="bookSummaryModalClose"
                style="color: #6b7280; position: absolute; right: 24px; top: 16px; font-size: 28px; font-weight: bold; cursor: pointer; transition: color 0.2s;">&times;</span>
            <div id="bookSummaryModalBody"
                style="font-family: 'Inter', system-ui, sans-serif; color: #1f2937; line-height: 1.7; font-size: 15px;">
                <!-- content goes here -->
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.getElementById('bookSummaryModal');
    const closeBtn = document.getElementById('bookSummaryModalClose');
    const modalBody = document.getElementById('bookSummaryModalBody');

    // Close logic
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

    // Attach click listeners to all .btn-summary
    document.querySelectorAll('.btn-summary').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Find book title
            const bookCard = btn.closest('.book-card, .book-card-detailed, .book-item, .category-book');
            if (!bookCard) return;
            const titleEl = bookCard.querySelector('.book-title');
            if (!titleEl) return;
            
            let rawTitle = titleEl.innerText.trim();
            // Try to find the book in bookSummariesData
            let foundSummary = null;
            if (typeof bookSummariesData !== 'undefined') {
                // Check by exact title match
                for (const key in bookSummariesData) {
                    if (bookSummariesData[key].title.toLowerCase() === rawTitle.toLowerCase()) {
                        foundSummary = bookSummariesData[key].summaryHtml;
                        break;
                    }
                }
                // fuzzy match fallback
                if (!foundSummary) {
                    for (const key in bookSummariesData) {
                        if (bookSummariesData[key].title.toLowerCase().includes(rawTitle.toLowerCase()) || 
                            rawTitle.toLowerCase().includes(bookSummariesData[key].title.toLowerCase())) {
                            foundSummary = bookSummariesData[key].summaryHtml;
                            break;
                        }
                    }
                }
            }
            
            if (foundSummary) {
                // If summary doesn't have an image, inject the one from the book card
                if (!foundSummary.includes('<img')) {
                    const imgEl = bookCard.querySelector('img.book-cover');
                    if (imgEl && imgEl.src) {
                        const imgHtml = `<p style="text-align: center;"><img src="${imgEl.getAttribute('src')}" class="book-cover-summary" style="max-width: 200px; border-radius: 8px; margin: 15px 0; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"></p>`;
                        
                        // Insert image after the Pages paragraph, or just at the top
                        if (foundSummary.includes('<p>Pages:')) {
                            foundSummary = foundSummary.replace(/(<p>Pages:.*?<\/p>)/, `$1${imgHtml}`);
                        } else {
                            foundSummary = imgHtml + foundSummary;
                        }
                    }
                }
                
                // Only add a title header if it's not already in the summaryHtml
                if (!foundSummary.includes('<strong>' + rawTitle) && !foundSummary.toLowerCase().includes(rawTitle.toLowerCase())) {
                    modalBody.innerHTML = '<h2>' + rawTitle + '</h2>' + foundSummary;
                } else {
                    modalBody.innerHTML = foundSummary;
                }
            } else {
                modalBody.innerHTML = '<h2>' + rawTitle + '</h2><p>Summary not available for this book.</p>';
            }
            
            modal.style.display = 'block';
        });
    });
});
