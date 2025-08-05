import { FeedItem } from "@/types.db";

// Helper function to determine if content is financial/economic
export const isFinancialOrEconomic = (feed: FeedItem) => {
  const financialKeywords = [
    'bank', 'finance', 'financial', 'economy', 'economic', 'money', 'currency', 
    'inflation', 'gdp', 'market', 'trading', 'investment', 'stock', 'bond',
    'cryptocurrency', 'bitcoin', 'forex', 'exchange', 'rate', 'monetary',
    'fiscal', 'budget', 'tax', 'revenue', 'profit', 'debt', 'credit',
    'lending', 'borrowing', 'interest', 'reserve', 'central bank', 'imf',
    'world bank', 'development', 'growth', 'recession', 'bull market',
    'bear market', 'commodity', 'gold', 'oil', 'mining', 'agriculture'
  ];
  
  const content = `${feed.title} ${feed.contentSnippet}`.toLowerCase();
  return financialKeywords.some(keyword => content.includes(keyword));
};

// Helper function to categorize news by region
export const categorizeByRegion = (feed: FeedItem) => {
  const content = `${feed.title} ${feed.contentSnippet}`.toLowerCase();
  
  // Zimbabwean keywords
  const zimbabweanKeywords = [
    'zimbabwe', 'zimbabwean', 'harare', 'bulawayo', 'mutare', 'gweru',
    'masvingo', 'chinhoyi', 'kwekwe', 'kadoma', 'chegutu', 'norton',
    'rbz', 'reserve bank of zimbabwe', 'zanu-pf', 'mdc', 'zec',
    'zimra', 'zimbabwe revenue authority', 'rtgs', 'zwl', 'bond notes',
    'nostro', 'cabs', 'cbz', 'steward bank', 'fbc bank', 'nedbank zimbabwe',
    'econet', 'telecel', 'netone', 'zimplats', 'implats', 'anglo american',
    'tobacco', 'mining', 'victoria falls', 'kariba', 'hwange'
  ];
  
  // African keywords (excluding Zimbabwe)
  const africanKeywords = [
    'africa', 'african', 'south africa', 'kenya', 'nigeria', 'ghana', 'egypt',
    'morocco', 'tunisia', 'algeria', 'libya', 'sudan', 'ethiopia', 'uganda',
    'tanzania', 'rwanda', 'botswana', 'namibia', 'zambia', 'malawi', 'mozambique',
    'madagascar', 'mauritius', 'seychelles', 'congo', 'cameroon', 'ivory coast',
    'burkina faso', 'mali', 'niger', 'chad', 'central african republic',
    'gabon', 'equatorial guinea', 'sao tome', 'cape verde', 'guinea-bissau',
    'guinea', 'sierra leone', 'liberia', 'senegal', 'gambia', 'mauritania',
    'djibouti', 'somalia', 'eritrea', 'lesotho', 'swaziland', 'comoros',
    'african union', 'au', 'ecowas', 'sadc', 'eac', 'continental free trade',
    'afcfta', 'african development bank', 'adb'
  ];
  
  if (zimbabweanKeywords.some(keyword => content.includes(keyword))) {
    return 'zimbabwean';
  } else if (africanKeywords.some(keyword => content.includes(keyword))) {
    return 'african';
  } else {
    return 'international';
  }
};

// Categories configuration
export const categories = [
  { id: 'zimbabwean', name: 'Zimbabwean News' },
  { id: 'african', name: 'African News' },
  { id: 'international', name: 'International News' },
] as const;

export type CategoryId = typeof categories[number]['id'];
