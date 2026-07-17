(function () {
    'use strict';

    var imageMap = null;

    function normalizeText(value) {
        return String(value || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/["'`]/g, '')
            .replace(/&/g, ' and ')
            .replace(/[^a-z0-9]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function stripNumericPrefix(value) {
        return String(value || '').replace(/^\d+(?:\.\d+)*\s*/, '').trim();
    }

    function buildImageMap() {
        if (imageMap) {
            return imageMap;
        }

        imageMap = Object.create(null);
        var names = [];

        try {
            var request = new XMLHttpRequest();
            request.open('GET', 'images/articles-index.json', false);
            request.send(null);
            if (request.status >= 200 && request.status < 300) {
                names = JSON.parse(request.responseText || '[]');
            }
        } catch (error) {
            names = [];
        }

        for (var i = 0; i < names.length; i++) {
            var filename = names[i];
            var dotIndex = filename.lastIndexOf('.');
            var stem = dotIndex > 0 ? filename.slice(0, dotIndex) : filename;
            var stripped = stripNumericPrefix(stem);
            var keyA = normalizeText(stem);
            var keyB = normalizeText(stripped);

            if (keyA && !imageMap[keyA]) {
                imageMap[keyA] = filename;
            }
            if (keyB && !imageMap[keyB]) {
                imageMap[keyB] = filename;
            }
        }

        return imageMap;
    }

    function resolveArticleImageFilename(articleId, articleData) {
        var map = buildImageMap();
        var title = articleData && articleData.title ? articleData.title : '';
        var shortTitle = title.split(':')[0].split('-')[0].trim();
        var idPhrase = String(articleId || '').replace(/[-_]+/g, ' ');
        var candidates = [title, shortTitle, idPhrase];

        for (var i = 0; i < candidates.length; i++) {
            var normalized = normalizeText(candidates[i]);
            if (normalized && map[normalized]) {
                return map[normalized];
            }
        }

        var queryTokens = normalizeText(title || idPhrase).split(' ').filter(function (token) {
            return token.length >= 3;
        });

        var bestFile = null;
        var bestScore = 0;

        for (var key in map) {
            if (!Object.prototype.hasOwnProperty.call(map, key)) {
                continue;
            }
            var keyTokens = key.split(' ').filter(function (token) {
                return token.length >= 3;
            });
            if (!keyTokens.length) {
                continue;
            }

            var matches = 0;
            for (var j = 0; j < queryTokens.length; j++) {
                if (keyTokens.indexOf(queryTokens[j]) >= 0) {
                    matches++;
                }
            }

            var score = matches / Math.max(queryTokens.length || 1, keyTokens.length);
            if (score > bestScore) {
                bestScore = score;
                bestFile = map[key];
            }
        }

        return bestScore >= 0.45 ? bestFile : null;
    }

    window.buildArticleImageHtml = function (articleId, articleData) {
        var filename = resolveArticleImageFilename(articleId, articleData);
        if (!filename) {
            return '<div style="width:100%;height:auto;aspect-ratio:16/9;background:#f0f4f8;border:2px dashed #cbd5e0;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;color:#94a3b8;font-size:14px;">Image unavailable</div>';
        }

        var altText = articleData && articleData.title ? articleData.title : 'Article image';
        var src = 'images/articles/' + encodeURIComponent(filename);
        return '<img src="' + src + '" alt="' + altText.replace(/"/g, '&quot;') + '" style="width:100%;height:auto;object-fit:cover;border-radius:8px;display:block;margin:0 auto 20px;box-shadow:0 2px 8px #e5e7eb;">';
    };
})();
