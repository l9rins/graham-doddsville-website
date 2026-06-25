// News Sources Data - Extracted from client Excel spreadsheet
// "2026-05-22 Latest News - Sources - Updated (1).xlsx"
// Each category contains an array of { name, url } objects

const newsSourcesData = {

    // =============================================
    // LATEST NEWS CATEGORIES
    // =============================================

    companies: [
        { name: 'ABC News', url: 'https://www.abc.net.au/news/business' },
        { name: 'Canberra Times', url: 'https://www.canberratimes.com.au/news/business/' },
        { name: 'Herald Sun', url: 'https://www.heraldsun.com.au/business/breaking-news' },
        { name: 'Money Management', url: 'https://www.moneymanagement.com.au/news' },
        { name: 'Morningstar', url: 'https://www.morningstar.com.au/insights/stocks' },
        { name: 'News.com.au', url: 'https://www.news.com.au/finance' },
        { name: 'Nine News', url: 'https://www.9news.com.au/finance' },
        { name: 'Perth Now', url: 'https://www.perthnow.com.au/business/breaking-news' },
        { name: 'Sydney Morning Herald', url: 'https://www.smh.com.au/business' },
        { name: '7News', url: 'https://7news.com.au/business' },
        { name: 'Sky News', url: 'https://www.skynews.com.au/business' },
        { name: 'The Advertiser', url: 'https://www.adelaidenow.com.au/business/work/leaders-companies' },
        { name: 'The Age', url: 'https://www.theage.com.au/business' },
        { name: 'The Australian', url: 'https://www.theaustralian.com.au/business' },
        { name: 'The Bull', url: 'https://thebull.com.au/category/allnews/breaking-news/' },
        { name: 'The Courier Mail', url: 'https://www.couriermail.com.au/business/breaking-news' },
        { name: 'The Guardian', url: 'https://www.theguardian.com.au/business' },
        { name: 'The West Australian', url: 'https://thewest.com.au/business' }
    ],

    markets: [
        { name: 'ABC News', url: 'https://www.abc.net.au/news/topic/stockmarket' },
        { name: 'MarketWatch', url: 'https://www.marketwatch.com/' },
        { name: 'Money Management', url: 'https://www.moneymanagement.com.au/news' },
        { name: 'Morningstar', url: 'https://www.morningstar.com.au/insights/markets' },
        { name: 'News.com.au', url: 'https://www.news.com.au/finance/markets/australian-markets' },
        { name: 'Nine.com.au', url: 'https://www.9news.com.au/finance' },
        { name: 'Share Café', url: 'https://www.sharecafe.com.au/shares/' },
        { name: '7News', url: 'https://7news.com.au/business/markets' },
        { name: 'Sky News', url: 'https://www.skynews.com.au/business/markets' },
        { name: 'Sydney Morning Herald', url: 'https://www.smh.com.au/business/markets' },
        { name: 'The Age', url: 'https://www.theage.com.au/business/markets' },
        { name: 'The Guardian', url: 'https://www.theguardian.com/business/stock-markets' },
        { name: 'The West Australian', url: 'https://thewest.com.au/business' },
        { name: 'WA Today', url: 'https://www.watoday.com.au/business/markets' }
    ],

    economy: [
        { name: 'ABC News', url: 'https://www.abc.net.au/news/business' },
        { name: 'Crikey', url: 'https://www.crikey.com.au/economy/' },
        { name: 'DFAT', url: 'https://www.dfat.gov.au/news' },
        { name: 'Macrobusiness', url: 'https://www.macrobusiness.com.au/' },
        { name: 'Morningstar', url: 'https://www.morningstar.com.au/insights/top-stories' },
        { name: 'News.com.au', url: 'https://www.news.com.au/finance/economy' },
        { name: 'RBA', url: 'https://www.rba.gov.au/media-releases/' },
        { name: 'Sharecafe', url: 'https://www.sharecafe.com.au/category/economics/' },
        { name: 'Sydney Morning Herald', url: 'https://www.smh.com.au/business/the-economy' },
        { name: '7News', url: 'https://7news.com.au/business/economy' },
        { name: 'The Bull', url: 'https://thebull.com.au/category/share_tips/economics/' }
    ],

    industry: [
        { name: 'ABA', url: 'https://www.ausbanking.org.au/news/' },
        { name: 'ASFA', url: 'https://www.superannuation.asn.au/media/media-releases/' },
        { name: 'Bloomberg', url: 'https://www.bloomberg.com/industries' },
        { name: 'FAAA', url: 'https://faaa.au/news/' },
        { name: 'Fat Tail Daily', url: 'https://daily.fattail.com.au/latest-articles/' },
        { name: 'Financial Standard', url: 'https://www.financialstandard.com.au/' },
        { name: 'FS Advice', url: 'https://www.fsadvice.com.au/' },
        { name: 'FS Managed Accounts', url: 'https://www.fsmanagedaccounts.com.au/' },
        { name: 'FS Private Wealth', url: 'https://www.fsprivatewealth.com.au/' },
        { name: 'FS Super', url: 'https://www.fssuper.com.au/' },
        { name: 'Harvard Business Review', url: 'https://hbr.org/' },
        { name: 'Inc Australia', url: 'https://www.inc.com/' },
        { name: 'Investor Daily', url: 'https://www.investordaily.com.au/' },
        { name: 'McKinsey & Co (Australia)', url: 'https://www.mckinsey.com/au/our-insights' },
        { name: 'McKinsey & Co (US)', url: 'https://www.mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights' },
        { name: 'Money Management', url: 'https://www.moneymanagement.com.au/' },
        { name: 'Morningstar', url: 'https://www.morningstar.com.au/' },
        { name: 'News.com.au', url: 'https://www.news.com.au/finance/business' },
        { name: 'The Guardian', url: 'https://www.theguardian.com/au/business' }
    ],

    'guru-watch': [
        { name: 'AFR', url: 'https://www.afr.com/' },
        { name: 'Berkshire Hathaway', url: 'https://www.berkshirehathaway.com/news/2026news.html' },
        { name: 'Bloomberg', url: 'https://www.bloomberg.com/search?query=warren+buffett' },
        { name: 'CNBC', url: 'https://www.cnbc.com/warren-buffett-watch/' },
        { name: 'Daily News', url: 'https://www.nydailynews.com/?s=warren+buffett&orderby=date&order=desc' },
        { name: 'Entrepreneur', url: 'https://www.entrepreneur.com/topic/warren-buffett' },
        { name: 'Forbes', url: 'https://www.forbes.com/search/?q=warren%20buffett' },
        { name: 'Fox News', url: 'https://www.foxbusiness.com/category/rich-famous' },
        { name: 'Guru Focus', url: 'https://www.gurufocus.com/guru/warren%2Bbuffett/stock-picks?view=table' },
        { name: 'Harvard Business Review', url: 'https://hbr.org/the-latest' },
        { name: 'HuffPost', url: 'https://www.huffpost.com/topic/warren-buffett' },
        { name: 'Markets Insider', url: 'https://markets.businessinsider.com/news/warren-buffett' },
        { name: 'MarketWatch', url: 'https://www.marketwatch.com/search?q=warren%20buffett&ts=0&tab=All%20News' },
        { name: 'Morningstar', url: 'https://www.morningstar.com.au/search/documents?q=warren%20buffett' },
        { name: 'New York Times', url: 'https://www.nytimes.com/topic/person/warren-e-buffett' },
        { name: 'Newsweek', url: 'https://www.newsweek.com/search/site/?q=warren+buffett' },
        { name: 'US News', url: 'https://www.usnews.com/topics/people/warren_buffett' },
        { name: 'USA Today', url: 'https://www.usatoday.com/search/?q=warren%20buffett' },
        { name: 'Washington Post', url: 'https://www.washingtonpost.com/search/?query=warren+buffett' }
    ],

    regulatory: [
        { name: 'ACCC', url: 'https://www.accc.gov.au/about-us/media/media-releases' },
        { name: 'AFCA', url: 'https://www.afca.org.au/news/latest-news' },
        { name: 'APRA', url: 'https://www.apra.gov.au/news-and-publications' },
        { name: 'ASIC', url: 'https://asic.gov.au/newsroom/' },
        { name: 'ATO', url: 'https://www.ato.gov.au/whats-new' },
        { name: 'AUSTRAC', url: 'https://www.austrac.gov.au/news-and-media/media-release' },
        { name: 'FIRB', url: 'https://foreigninvestment.gov.au/news-and-reports/news' },
        { name: 'Financial Reporting Council', url: 'https://frc.gov.au/media/media-release' },
        { name: 'Financial Services Council', url: 'https://www.fsc.org.au/news/media-releases' },
        { name: 'OAIC', url: 'https://www.oaic.gov.au/newsroom' },
        { name: 'Reserve Bank of Australia', url: 'https://www.rba.gov.au/news/' },
        { name: 'Treasury', url: 'https://treasury.gov.au/media' }
    ],

    // =============================================
    // AROUND THE WORLD CATEGORIES
    // =============================================

    'north-america': [
        { name: 'Bloomberg', url: 'https://www.bloomberg.com/markets' },
        { name: 'CBS News', url: 'https://www.cbsnews.com/moneywatch/' },
        { name: 'Chicago Tribune', url: 'https://www.chicagotribune.com/business/' },
        { name: 'CNBC', url: 'https://www.cnbc.com/investing/' },
        { name: 'CNN Money', url: 'https://edition.cnn.com/business' },
        { name: 'Financial Post', url: 'https://financialpost.com/category/investing/' },
        { name: 'Fortune', url: 'https://fortune.com/section/finance/' },
        { name: 'Fox News', url: 'https://www.foxbusiness.com/' },
        { name: 'Globe and Mail', url: 'https://www.theglobeandmail.com/investing/' },
        { name: 'HuffPost', url: 'https://www.huffpost.com/business' },
        { name: "Investor's Business Daily", url: 'https://www.investors.com/' },
        { name: 'NBC News', url: 'https://www.nbcnews.com/business' },
        { name: 'New York Post', url: 'https://nypost.com/business/' },
        { name: 'New York Times', url: 'https://www.nytimes.com/section/business' },
        { name: 'Time', url: 'https://time.com/section/business/' },
        { name: 'USA News', url: 'https://usanews.com/business' },
        { name: 'USA Today', url: 'https://www.usatoday.com/money/investing/' },
        { name: 'Washington Post', url: 'https://www.washingtonpost.com/business/' }
    ],

    europe: [
        { name: 'BBC News', url: 'https://www.bbc.com/news/world/europe' },
        { name: 'Bloomberg Europe', url: 'https://www.bloomberg.com/europe' },
        { name: 'CNBC', url: 'https://www.cnbc.com/europe-news/' },
        { name: 'EUbusiness', url: 'https://www.eubusiness.com/news-eu' },
        { name: 'Euronews', url: 'https://www.euronews.com/business' },
        { name: 'Euroweekly News', url: 'https://euroweeklynews.com/finance/business/' },
        { name: 'IMF', url: 'https://www.imf.org/en/News' },
        { name: 'Independent', url: 'https://www.independent.co.uk/news/business' },
        { name: 'NL Times', url: 'https://nltimes.nl/categories/business' },
        { name: 'The Baltic Times', url: 'https://www.baltictimes.com/news_business/' },
        { name: 'The Budapest Times', url: 'https://www.budapesttimes.hu/category/economy/' },
        { name: 'The Guardian', url: 'https://www.theguardian.com/au/business' },
        { name: 'The Moscow Times', url: 'https://www.themoscowtimes.com/business' },
        { name: 'The Sun', url: 'https://www.thesun.co.uk/money/business/' }
    ],

    asia: [
        { name: 'Asia Times', url: 'https://asiatimes.com/' },
        { name: 'Business Standard', url: 'https://www.business-standard.com/economy' },
        { name: 'Channel News Asia', url: 'https://www.channelnewsasia.com/business' },
        { name: 'China Daily', url: 'https://www.chinadaily.com.cn/business' },
        { name: 'East Asia Forum', url: 'https://eastasiaforum.org/' },
        { name: 'FinanceAsia', url: 'https://www.financeasia.com/' },
        { name: 'Focus Taiwan', url: 'https://focustaiwan.tw/business' },
        { name: 'Japan Today', url: 'https://japantoday.com/category/business' },
        { name: 'Nikkei Asia', url: 'https://asia.nikkei.com/Economy' },
        { name: 'Shine', url: 'https://www.shine.cn/biz/economy/' },
        { name: 'South China Morning Post', url: 'https://www.scmp.com/economy' },
        { name: 'The Asian Age', url: 'https://www.asianage.com/business' },
        { name: 'The Chosun Daily', url: 'https://www.chosun.com/english/market-money-en/' },
        { name: 'The Diplomat', url: 'https://thediplomat.com/topics/economy/' },
        { name: 'The Japan News', url: 'https://japannews.yomiuri.co.jp/news/business/' },
        { name: 'The Japan Times', url: 'https://www.japantimes.co.jp/news/business/' },
        { name: 'The Korea Times', url: 'https://www.koreatimes.co.kr/www/sublist_488.html' },
        { name: 'The Standard', url: 'https://www.thestandard.com.hk/business' },
        { name: 'The Star', url: 'https://www.thestar.com.my/business/' },
        { name: 'The Straits Times', url: 'https://www.straitstimes.com/business' }
    ],

    elsewhere: [
        { name: 'Africa News', url: 'https://www.africanews.com/business/' },
        { name: 'Arabian Business', url: 'https://www.arabianbusiness.com/' },
        { name: 'Egypt Today', url: 'https://www.egypttoday.com/Section/Business/3' },
        { name: 'Folha De S. Paulo', url: 'https://www1.folha.uol.com.br/internacional/en/business/' },
        { name: 'Gulf News', url: 'https://gulfnews.com/business' },
        { name: 'Independent Online', url: 'https://www.iol.co.za/business-report' },
        { name: 'Khaleej Times', url: 'https://www.khaleejtimes.com/business' },
        { name: 'Mail and Guardian', url: 'https://mg.co.za/section/business/' },
        { name: 'MarketWatch', url: 'https://www.marketwatch.com/markets/latin-america' },
        { name: 'NZ Herald', url: 'https://www.nzherald.co.nz/business/' },
        { name: 'The National', url: 'https://www.thenationalnews.com/business/economy/' },
        { name: 'The Peninsula', url: 'https://thepeninsulaqatar.com/category/business' },
        { name: 'The Rio Times', url: 'https://www.riotimesonline.com/brazil-news/category/rio-business/' },
        { name: 'This Day', url: 'https://www.thisdaylive.com/category/business' }
    ]
};

// Category display metadata
const categoryMeta = {
    companies:      { title: 'Companies',       section: 'Latest News',       icon: '🏢', accent: '#6b21a8' },
    markets:        { title: 'Markets',          section: 'Latest News',       icon: '📈', accent: '#7c3aed' },
    economy:        { title: 'Economy',          section: 'Latest News',       icon: '🏛️', accent: '#8b5cf6' },
    industry:       { title: 'Industry',         section: 'Latest News',       icon: '🏗️', accent: '#6d28d9' },
    'guru-watch':   { title: 'Guru Watch',       section: 'Latest News',       icon: '🎯', accent: '#5b21b6' },
    regulatory:     { title: 'Regulatory',        section: 'Latest News',       icon: '⚖️', accent: '#4c1d95' },
    'north-america':{ title: 'North America',    section: 'Around the World',  icon: '🌎', accent: '#1e3a5f' },
    europe:         { title: 'Europe',           section: 'Around the World',  icon: '🌍', accent: '#1e3a8a' },
    asia:           { title: 'Asia',             section: 'Around the World',  icon: '🌏', accent: '#1e40af' },
    elsewhere:      { title: 'Elsewhere',        section: 'Around the World',  icon: '🌐', accent: '#1d4ed8' }
};

if (typeof module !== 'undefined') { module.exports = { newsSourcesData, categoryMeta }; }
