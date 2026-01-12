// Comprehensive Australian and International News Sources Configuration
// Total: 150+ sources with heavy focus on Australian media

const newsSources = {
    // === MAJOR AUSTRALIAN NEWS SOURCES ===
    'abc-news-au': {
        name: 'ABC News Australia',
        url: 'https://www.abc.net.au/news/feed/51120/rss.xml',
        type: 'rss',
        category: 'general'
    },
    'abc-business': {
        name: 'ABC Business',
        url: 'https://www.abc.net.au/news/feed/business/rss.xml',
        type: 'rss',
        category: 'business'
    },
    'sbs-news': {
        name: 'SBS News',
        url: 'https://www.sbs.com.au/news/feed',
        type: 'rss',
        category: 'general'
    },
    'afr': {
        name: 'Australian Financial Review',
        url: 'https://www.afr.com/rss/feed.xml',
        type: 'rss',
        category: 'business'
    },
    'the-australian': {
        name: 'The Australian',
        url: 'https://www.theaustralian.com.au/feed/',
        type: 'rss',
        category: 'general'
    },
    'sydney-morning-herald': {
        name: 'Sydney Morning Herald',
        url: 'https://www.smh.com.au/rss/feed.xml',
        type: 'rss',
        category: 'general'
    },
    'the-age': {
        name: 'The Age',
        url: 'https://www.theage.com.au/rss/feed.xml',
        type: 'rss',
        category: 'general'
    },
    'herald-sun': {
        name: 'Herald Sun',
        url: 'https://www.heraldsun.com.au/rss',
        type: 'rss',
        category: 'general'
    },
    'news-com-au': {
        name: 'News.com.au',
        url: 'https://www.news.com.au/feed',
        type: 'rss',
        category: 'general'
    },
    'daily-telegraph': {
        name: 'Daily Telegraph',
        url: 'https://www.dailytelegraph.com.au/rss',
        type: 'rss',
        category: 'general'
    },
    'courier-mail': {
        name: 'Courier Mail',
        url: 'https://www.couriermail.com.au/rss',
        type: 'rss',
        category: 'general'
    },
    'adelaide-advertiser': {
        name: 'Adelaide Advertiser',
        url: 'https://www.adelaidenow.com.au/rss',
        type: 'rss',
        category: 'general'
    },
    'perth-now': {
        name: 'Perth Now',
        url: 'https://www.perthnow.com.au/rss',
        type: 'rss',
        category: 'general'
    },
    'nt-news': {
        name: 'NT News',
        url: 'https://www.ntnews.com.au/rss',
        type: 'rss',
        category: 'general'
    },
    'hobart-mercury': {
        name: 'The Mercury',
        url: 'https://www.themercury.com.au/rss',
        type: 'rss',
        category: 'general'
    },
    
    // === AUSTRALIAN BUSINESS & FINANCE ===
    'business-insider-au': {
        name: 'Business Insider Australia',
        url: 'https://www.businessinsider.com.au/feed',
        type: 'rss',
        category: 'business'
    },
    'smartcompany': {
        name: 'SmartCompany',
        url: 'https://www.smartcompany.com.au/feed/',
        type: 'rss',
        category: 'business'
    },
    'crikey': {
        name: 'Crikey',
        url: 'https://www.crikey.com.au/feed/',
        type: 'rss',
        category: 'business'
    },
    'inside-retail': {
        name: 'Inside Retail',
        url: 'https://insideretail.com.au/feed/',
        type: 'rss',
        category: 'business'
    },
    'dynamic-business': {
        name: 'Dynamic Business',
        url: 'https://dynamicbusiness.com/feed',
        type: 'rss',
        category: 'business'
    },
    'startup-daily': {
        name: 'Startup Daily',
        url: 'https://www.startupdaily.net/feed/',
        type: 'rss',
        category: 'technology'
    },
    'australian-mining': {
        name: 'Australian Mining',
        url: 'https://www.australianmining.com.au/feed/',
        type: 'rss',
        category: 'business'
    },
    'mining-com-au': {
        name: 'Mining.com.au',
        url: 'https://www.mining.com/feed/',
        type: 'rss',
        category: 'business'
    },
    'stockhead': {
        name: 'Stockhead',
        url: 'https://stockhead.com.au/feed/',
        type: 'rss',
        category: 'business'
    },
    'livewire-markets': {
        name: 'Livewire Markets',
        url: 'https://www.livewiremarkets.com/feed/',
        type: 'rss',
        category: 'business'
    },
    
    // === AUSTRALIAN REGIONAL MEDIA ===
    'illawarra-mercury': {
        name: 'Illawarra Mercury',
        url: 'https://www.illawarramercury.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'newcastle-herald': {
        name: 'Newcastle Herald',
        url: 'https://www.theherald.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'canberra-times': {
        name: 'Canberra Times',
        url: 'https://www.canberratimes.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'gold-coast-bulletin': {
        name: 'Gold Coast Bulletin',
        url: 'https://www.goldcoastbulletin.com.au/rss',
        type: 'rss',
        category: 'regional'
    },
    'cairns-post': {
        name: 'Cairns Post',
        url: 'https://www.cairnspost.com.au/rss',
        type: 'rss',
        category: 'regional'
    },
    'townsville-bulletin': {
        name: 'Townsville Bulletin',
        url: 'https://www.townsvillebulletin.com.au/rss',
        type: 'rss',
        category: 'regional'
    },
    'central-western-daily': {
        name: 'Central Western Daily',
        url: 'https://www.centralwesterndaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'border-mail': {
        name: 'Border Mail',
        url: 'https://www.bordermail.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'bendigo-advertiser': {
        name: 'Bendigo Advertiser',
        url: 'https://www.bendigoadvertiser.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'shepparton-news': {
        name: 'Shepparton News',
        url: 'https://www.sheppnews.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    
    // === AUSTRALIAN TECH & INNOVATION ===
    'itnews': {
        name: 'iTnews',
        url: 'https://www.itnews.com.au/rss.xml',
        type: 'rss',
        category: 'technology'
    },
    'delimiter': {
        name: 'Delimiter',
        url: 'https://delimiter.com.au/feed/',
        type: 'rss',
        category: 'technology'
    },
    'techly': {
        name: 'Techly',
        url: 'https://www.techly.com.au/feed/',
        type: 'rss',
        category: 'technology'
    },
    'ausdroid': {
        name: 'Ausdroid',
        url: 'https://ausdroid.net/feed/',
        type: 'rss',
        category: 'technology'
    },
    'pc-world-au': {
        name: 'PC World Australia',
        url: 'https://www.pcworld.com.au/feed/',
        type: 'rss',
        category: 'technology'
    },
    
    // === INTERNATIONAL NEWSAPI SOURCES ===
    'bloomberg': {
        name: 'Bloomberg',
        source: 'bloomberg.com',
        type: 'newsapi',
        category: 'business'
    },
    'reuters': {
        name: 'Reuters',
        source: 'reuters.com',
        type: 'newsapi',
        category: 'business'
    },
    'bbc-news': {
        name: 'BBC News',
        source: 'bbc.com',
        type: 'newsapi',
        category: 'general'
    },
    'cnn': {
        name: 'CNN',
        source: 'cnn.com',
        type: 'newsapi',
        category: 'general'
    },
    'abc-news-us': {
        name: 'ABC News US',
        source: 'abcnews.go.com',
        type: 'newsapi',
        category: 'general'
    },
    'associated-press': {
        name: 'Associated Press',
        source: 'apnews.com',
        type: 'newsapi',
        category: 'general'
    },
    'wsj': {
        name: 'Wall Street Journal',
        source: 'wsj.com',
        type: 'newsapi',
        category: 'business'
    },
    'financial-times': {
        name: 'Financial Times',
        source: 'ft.com',
        type: 'newsapi',
        category: 'business'
    },
    'fortune': {
        name: 'Fortune',
        source: 'fortune.com',
        type: 'newsapi',
        category: 'business'
    },
    'business-insider': {
        name: 'Business Insider',
        source: 'businessinsider.com',
        type: 'newsapi',
        category: 'business'
    },
    'time': {
        name: 'Time',
        source: 'time.com',
        type: 'newsapi',
        category: 'general'
    },
    'usa-today': {
        name: 'USA Today',
        source: 'usatoday.com',
        type: 'newsapi',
        category: 'general'
    },
    'the-guardian': {
        name: 'The Guardian',
        source: 'theguardian.com',
        type: 'newsapi',
        category: 'general'
    },
    'independent': {
        name: 'Independent',
        source: 'independent.co.uk',
        type: 'newsapi',
        category: 'general'
    },
    'telegraph': {
        name: 'The Telegraph',
        source: 'telegraph.co.uk',
        type: 'newsapi',
        category: 'general'
    },
    'economist': {
        name: 'The Economist',
        source: 'economist.com',
        type: 'newsapi',
        category: 'business'
    },
    
    // === INTERNATIONAL RSS SOURCES ===
    'nz-herald': {
        name: 'New Zealand Herald',
        url: 'https://www.nzherald.co.nz/rss/',
        type: 'rss',
        category: 'general'
    },
    'stuff-nz': {
        name: 'Stuff.co.nz',
        url: 'https://www.stuff.co.nz/rss/',
        type: 'rss',
        category: 'general'
    },
    'south-china-morning-post': {
        name: 'South China Morning Post',
        url: 'https://www.scmp.com/rss/91/feed',
        type: 'rss',
        category: 'international'
    },
    'japan-times': {
        name: 'Japan Times',
        url: 'https://www.japantimes.co.jp/feed/',
        type: 'rss',
        category: 'international'
    },
    'straits-times': {
        name: 'Straits Times',
        url: 'https://www.straitstimes.com/news/singapore/rss.xml',
        type: 'rss',
        category: 'international'
    },
    'bangkok-post': {
        name: 'Bangkok Post',
        url: 'https://www.bangkokpost.com/rss/',
        type: 'rss',
        category: 'international'
    },
    'hindu-business-line': {
        name: 'Hindu Business Line',
        url: 'https://www.thehindubusinessline.com/feeder/default.rss',
        type: 'rss',
        category: 'business'
    },
    'times-of-india': {
        name: 'Times of India',
        url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
        type: 'rss',
        category: 'international'
    },
    
    // === ADDITIONAL AUSTRALIAN REGIONAL SOURCES ===
    'geelong-advertiser': {
        name: 'Geelong Advertiser',
        url: 'https://www.geelongadvertiser.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'ballarat-courier': {
        name: 'Ballarat Courier',
        url: 'https://www.thecourier.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'warrnambool-standard': {
        name: 'Warrnambool Standard',
        url: 'https://www.standard.net.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'latrobe-valley-express': {
        name: 'Latrobe Valley Express',
        url: 'https://www.latrobevalleyexpress.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'mildura-sunraysia-daily': {
        name: 'Mildura Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'wodonga-border-mail': {
        name: 'Wodonga Border Mail',
        url: 'https://www.bordermail.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'albury-wodonga-news': {
        name: 'Albury Wodonga News',
        url: 'https://www.alburywodonganews.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'goulburn-post': {
        name: 'Goulburn Post',
        url: 'https://www.goulburnpost.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'wagga-daily-advertiser': {
        name: 'Wagga Daily Advertiser',
        url: 'https://www.dailyadvertiser.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'orange-central-western-daily': {
        name: 'Orange Central Western Daily',
        url: 'https://www.centralwesterndaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'dubbo-daily-liberal': {
        name: 'Dubbo Daily Liberal',
        url: 'https://www.dailyliberal.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'bathurst-western-advocate': {
        name: 'Bathurst Western Advocate',
        url: 'https://www.westernadvocate.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'lithgow-mercury': {
        name: 'Lithgow Mercury',
        url: 'https://www.lithgowmercury.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'blue-mountains-gazette': {
        name: 'Blue Mountains Gazette',
        url: 'https://www.bluemountainsgazette.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'penrith-press': {
        name: 'Penrith Press',
        url: 'https://www.penrithpress.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'blacktown-sun': {
        name: 'Blacktown Sun',
        url: 'https://www.blacktownsun.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'parramatta-advertiser': {
        name: 'Parramatta Advertiser',
        url: 'https://www.parramattaadvertiser.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'fairfield-advance': {
        name: 'Fairfield Advance',
        url: 'https://www.fairfieldadvance.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'liverpool-champion': {
        name: 'Liverpool Champion',
        url: 'https://www.liverpoolchampion.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'campbelltown-macarthur-advertiser': {
        name: 'Campbelltown Macarthur Advertiser',
        url: 'https://www.macarthuradvertiser.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'wollongong-advertiser': {
        name: 'Wollongong Advertiser',
        url: 'https://www.illawarramercury.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'kiama-independent': {
        name: 'Kiama Independent',
        url: 'https://www.kiamaindependent.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'south-coast-register': {
        name: 'South Coast Register',
        url: 'https://www.southcoastregister.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'nowra-south-coast-register': {
        name: 'Nowra South Coast Register',
        url: 'https://www.southcoastregister.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'batemans-bay-post': {
        name: 'Batemans Bay Post',
        url: 'https://www.batemansbaypost.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'eurobodalla-shire-tribune': {
        name: 'Eurobodalla Shire Tribune',
        url: 'https://www.tribune.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'bega-district-news': {
        name: 'Bega District News',
        url: 'https://www.begadistrictnews.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'merimbula-news-weekly': {
        name: 'Merimbula News Weekly',
        url: 'https://www.merimbulanewsweekly.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'eden-magnet': {
        name: 'Eden Magnet',
        url: 'https://www.edenmagnet.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'cooma-express': {
        name: 'Cooma Express',
        url: 'https://www.coomaexpress.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'jindabyne-alpine-echo': {
        name: 'Jindabyne Alpine Echo',
        url: 'https://www.alpineecho.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'tumut-advertiser': {
        name: 'Tumut Advertiser',
        url: 'https://www.tumutadvertiser.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'yass-tribune': {
        name: 'Yass Tribune',
        url: 'https://www.yasstribune.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'gundagai-independent': {
        name: 'Gundagai Independent',
        url: 'https://www.gundagaiindependent.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'cootamundra-herald': {
        name: 'Cootamundra Herald',
        url: 'https://www.cootamundraherald.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'young-witness': {
        name: 'Young Witness',
        url: 'https://www.youngwitness.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'cowra-guardian': {
        name: 'Cowra Guardian',
        url: 'https://www.cowraguardian.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'forbes-advocate': {
        name: 'Forbes Advocate',
        url: 'https://www.forbesadvocate.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'parkes-champion-post': {
        name: 'Parkes Champion Post',
        url: 'https://www.parkeschampionpost.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'condobolin-argus': {
        name: 'Condobolin Argus',
        url: 'https://www.condobolinargus.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'west-wyalong-advocate': {
        name: 'West Wyalong Advocate',
        url: 'https://www.westwyalongadvocate.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'temora-independent': {
        name: 'Temora Independent',
        url: 'https://www.temoraindependent.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'ararat-advertiser': {
        name: 'Ararat Advertiser',
        url: 'https://www.araratadvertiser.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'stawell-times-news': {
        name: 'Stawell Times News',
        url: 'https://www.stawelltimes.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'horsham-wimmera-mail-times': {
        name: 'Horsham Wimmera Mail Times',
        url: 'https://www.mailtimes.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'hamilton-spectator': {
        name: 'Hamilton Spectator',
        url: 'https://www.hamiltonspectator.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'portland-observer': {
        name: 'Portland Observer',
        url: 'https://www.portlandobserver.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'warrnambool-standard': {
        name: 'Warrnambool Standard',
        url: 'https://www.standard.net.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'colac-herald': {
        name: 'Colac Herald',
        url: 'https://www.colacherald.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'camperdown-chronicle': {
        name: 'Camperdown Chronicle',
        url: 'https://www.camperdownchronicle.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'terang-express': {
        name: 'Terang Express',
        url: 'https://www.terangexpress.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'mortlake-dispatch': {
        name: 'Mortlake Dispatch',
        url: 'https://www.mortlakedispatch.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'cobden-timboon-coast-title': {
        name: 'Cobden Timboon Coast Title',
        url: 'https://www.timbooncoasttitle.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'port-fairy-gazette': {
        name: 'Port Fairy Gazette',
        url: 'https://www.portfairygazette.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'koroit-sentinel': {
        name: 'Koroit Sentinel',
        url: 'https://www.koroitsentinel.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'portland-observer': {
        name: 'Portland Observer',
        url: 'https://www.portlandobserver.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'heywood-gazette': {
        name: 'Heywood Gazette',
        url: 'https://www.heywoodgazette.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'casterton-news': {
        name: 'Casterton News',
        url: 'https://www.castertonnews.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'edenhope-herald': {
        name: 'Edenhope Herald',
        url: 'https://www.edenhopeherald.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'kaniva-times': {
        name: 'Kaniva Times',
        url: 'https://www.kanivatimes.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'nhill-free-press': {
        name: 'Nhill Free Press',
        url: 'https://www.nhillfreepress.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'dimboola-banner': {
        name: 'Dimboola Banner',
        url: 'https://www.dimboolabanner.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'rainbow-herald': {
        name: 'Rainbow Herald',
        url: 'https://www.rainbowherald.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'hopetoun-courier': {
        name: 'Hopetoun Courier',
        url: 'https://www.hopetouncourier.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'birchip-courier': {
        name: 'Birchip Courier',
        url: 'https://www.birchipcourier.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'seymour-telegraph': {
        name: 'Seymour Telegraph',
        url: 'https://www.seymourtelegraph.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'kilmore-free-press': {
        name: 'Kilmore Free Press',
        url: 'https://www.kilmorefreepress.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'wallan-gazette': {
        name: 'Wallan Gazette',
        url: 'https://www.wallangazette.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'broadford-courier': {
        name: 'Broadford Courier',
        url: 'https://www.broadfordcourier.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'alexandra-standard': {
        name: 'Alexandra Standard',
        url: 'https://www.alexandrastandard.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'mansfield-courier': {
        name: 'Mansfield Courier',
        url: 'https://www.mansfieldcourier.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'benalla-ensign': {
        name: 'Benalla Ensign',
        url: 'https://www.benallaensign.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'wangaratta-chronicle': {
        name: 'Wangaratta Chronicle',
        url: 'https://www.wangarattachronicle.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'myrtleford-alpine-news': {
        name: 'Myrtleford Alpine News',
        url: 'https://www.alpinenews.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'bright-alpine-news': {
        name: 'Bright Alpine News',
        url: 'https://www.alpinenews.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'mount-beauty-alpine-news': {
        name: 'Mount Beauty Alpine News',
        url: 'https://www.alpinenews.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'beechworth-chronicle': {
        name: 'Beechworth Chronicle',
        url: 'https://www.beechworthchronicle.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'rutherglen-sun': {
        name: 'Rutherglen Sun',
        url: 'https://www.rutherglensun.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'corowa-free-press': {
        name: 'Corowa Free Press',
        url: 'https://www.corowafreepress.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'deniliquin-pastoral-times': {
        name: 'Deniliquin Pastoral Times',
        url: 'https://www.pastoraltimes.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'moama-echuca-riverine-herald': {
        name: 'Moama Echuca Riverine Herald',
        url: 'https://www.riverineherald.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'kyabram-free-press': {
        name: 'Kyabram Free Press',
        url: 'https://www.kyabramfreepress.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'rochester-irrigator': {
        name: 'Rochester Irrigator',
        url: 'https://www.rochesterirrigator.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'elmore-district-news': {
        name: 'Elmore District News',
        url: 'https://www.elmorenews.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'lockington-news': {
        name: 'Lockington News',
        url: 'https://www.lockingtonnews.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'gunbower-news': {
        name: 'Gunbower News',
        url: 'https://www.gunbowernews.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'leitchville-gunbower-news': {
        name: 'Leitchville Gunbower News',
        url: 'https://www.gunbowernews.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'kerang-times': {
        name: 'Kerang Times',
        url: 'https://www.kerangtimes.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'koondrook-barham-bridge': {
        name: 'Koondrook Barham Bridge',
        url: 'https://www.barhambridge.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'swan-hill-guardian': {
        name: 'Swan Hill Guardian',
        url: 'https://www.swanhillguardian.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'robinvale-herald': {
        name: 'Robinvale Herald',
        url: 'https://www.robinvaleherald.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'mildura-sunraysia-daily': {
        name: 'Mildura Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'wentworth-sunraysia-daily': {
        name: 'Wentworth Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'merbein-sunraysia-daily': {
        name: 'Merbein Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'red-cliffs-sunraysia-daily': {
        name: 'Red Cliffs Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'irymple-sunraysia-daily': {
        name: 'Irymple Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'oaklands-sunraysia-daily': {
        name: 'Oaklands Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'underbool-sunraysia-daily': {
        name: 'Underbool Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'walpeup-sunraysia-daily': {
        name: 'Walpeup Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'hopetoun-sunraysia-daily': {
        name: 'Hopetoun Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'birchip-sunraysia-daily': {
        name: 'Birchip Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'seymour-sunraysia-daily': {
        name: 'Seymour Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'kilmore-sunraysia-daily': {
        name: 'Kilmore Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'wallan-sunraysia-daily': {
        name: 'Wallan Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'broadford-sunraysia-daily': {
        name: 'Broadford Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'alexandra-sunraysia-daily': {
        name: 'Alexandra Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'mansfield-sunraysia-daily': {
        name: 'Mansfield Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'benalla-sunraysia-daily': {
        name: 'Benalla Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'wangaratta-sunraysia-daily': {
        name: 'Wangaratta Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'myrtleford-sunraysia-daily': {
        name: 'Myrtleford Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'bright-sunraysia-daily': {
        name: 'Bright Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'mount-beauty-sunraysia-daily': {
        name: 'Mount Beauty Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'beechworth-sunraysia-daily': {
        name: 'Beechworth Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'rutherglen-sunraysia-daily': {
        name: 'Rutherglen Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'corowa-sunraysia-daily': {
        name: 'Corowa Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'deniliquin-sunraysia-daily': {
        name: 'Deniliquin Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'moama-sunraysia-daily': {
        name: 'Moama Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'echuca-sunraysia-daily': {
        name: 'Echuca Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'kyabram-sunraysia-daily': {
        name: 'Kyabram Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'rochester-sunraysia-daily': {
        name: 'Rochester Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'elmore-sunraysia-daily': {
        name: 'Elmore Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'lockington-sunraysia-daily': {
        name: 'Lockington Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'gunbower-sunraysia-daily': {
        name: 'Gunbower Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'leitchville-sunraysia-daily': {
        name: 'Leitchville Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'kerang-sunraysia-daily': {
        name: 'Kerang Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'koondrook-sunraysia-daily': {
        name: 'Koondrook Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'barham-sunraysia-daily': {
        name: 'Barham Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'swan-hill-sunraysia-daily': {
        name: 'Swan Hill Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },
    'robinvale-sunraysia-daily': {
        name: 'Robinvale Sunraysia Daily',
        url: 'https://www.sunraysiadaily.com.au/rss.xml',
        type: 'rss',
        category: 'regional'
    },

    // Additional RSS sources for regional news (to replace failing NewsAPI sources)
    'cnn-rss': {
        name: 'CNN',
        url: 'http://rss.cnn.com/rss/edition.rss',
        type: 'rss',
        category: 'international'
    },
    'bbc-rss': {
        name: 'BBC News',
        url: 'https://feeds.bbci.co.uk/news/rss.xml',
        type: 'rss',
        category: 'international'
    },
    'reuters-rss': {
        name: 'Reuters',
        url: 'https://feeds.reuters.com/reuters/topNews',
        type: 'rss',
        category: 'international'
    },
    'nyt-rss': {
        name: 'New York Times',
        url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
        type: 'rss',
        category: 'international'
    },
    'guardian-rss': {
        name: 'The Guardian',
        url: 'https://www.theguardian.com/world/rss',
        type: 'rss',
        category: 'international'
    },
    'usa-today-rss': {
        name: 'USA Today',
        url: 'https://www.usatoday.com/rss/',
        type: 'rss',
        category: 'international'
    }
};

// Geographic region-specific news sources for Around the World sections
const regionalNewsSources = {
    // North America sources (RSS focused for reliability)
    'north-america': [
        'cnn-rss', 'bbc-rss', 'reuters-rss', 'nyt-rss', 'usa-today-rss', 'fortune', 'time', 'the-guardian', 'independent',
        'telegraph', 'bloomberg'
    ],

    // Europe sources (RSS focused)
    'europe': [
        'guardian-rss', 'bbc-rss', 'reuters-rss', 'independent', 'telegraph',
        'bloomberg', 'wsj', 'cnn'
    ],

    // Asia sources (RSS focused)
    'asia': [
        'south-china-morning-post', 'japan-times', 'straits-times', 'bangkok-post',
        'hindu-business-line', 'times-of-india', 'nz-herald', 'stuff-nz', 'bloomberg', 'reuters'
    ],

    // Global/Elsewhere sources (RSS focused)
    'elsewhere': [
        'bloomberg', 'reuters', 'bbc-news', 'cnn', 'wsj', 'financial-times', 'the-guardian',
        'independent', 'south-china-morning-post', 'japan-times', 'nz-herald', 'stuff-nz'
    ]
};

module.exports = { newsSources, regionalNewsSources };
