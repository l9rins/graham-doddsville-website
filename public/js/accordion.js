// Shared accordion for Buffett topic pages

(function() {
    var style = document.createElement('style');
    style.textContent = '.collapsible-header:hover { background-color: #f3f4f6 !important; } ' +
        '.collapsible-section.active > .collapsible-header { background-color: #f8f9fa !important; } ' +
        '.collapsible-content { transition: max-height 0.35s ease-in-out !important; } ' +
        '.collapsible-arrow { transition: transform 0.2s ease; display: inline-block; } ' +
        '.collapsible-title { user-select: none; }';
    document.head.appendChild(style);
})();

function toggleCollapsible(id) {
    var content = document.getElementById(id + '-content');
    var arrow = document.getElementById(id + '-arrow');
    if (!content) return;
    var willOpen = !content.classList.contains('expanded');
    document.querySelectorAll('.collapsible-content').forEach(function(c) {
        if (c.id !== id + '-content') {
            c.style.maxHeight = '0px';
            c.classList.remove('expanded');
            c.classList.add('collapsed');
            var s = c.closest('.collapsible-section');
            if (s) s.classList.remove('active');
            var a = document.getElementById(c.id.replace('-content', '-arrow'));
            if (a) a.textContent = '+';
        }
    });
    if (willOpen) {
        content.style.maxHeight = content.scrollHeight + 20 + 'px';
        content.classList.add('expanded');
        content.classList.remove('collapsed');
        var section = content.closest('.collapsible-section');
        if (section) section.classList.add('active');
        if (arrow) arrow.textContent = '\u2212';
    } else {
        content.style.maxHeight = '0px';
        content.classList.remove('expanded');
        content.classList.add('collapsed');
        var section = content.closest('.collapsible-section');
        if (section) section.classList.remove('active');
        if (arrow) arrow.textContent = '+';
    }
}

function closeMobileMenu() {
    var drawer = document.getElementById('mobile-drawer');
    if (drawer) {
        drawer.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Fill accordion content from buffettTopicsData + fallback map
function fillAccordionContent(sectionId, quoteText, source) {
    var div = document.getElementById(sectionId + '-content');
    if (!div) return;
    div.innerHTML = '<div style="padding: 24px 16px; color: #4b5563;"><blockquote style="margin: 0 0 12px 0; padding: 0 0 0 16px; border-left: 3px solid #d4af37; font-style: italic; line-height: 1.7;">' + quoteText + '</blockquote><footer style="font-size: 13px; color: #6b7280; padding-left: 16px;">\u2014 ' + source + '</footer></div>';
}
