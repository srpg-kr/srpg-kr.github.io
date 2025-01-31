// categories.js
export const CATEGORIES = [
    ["M", "메인 스토리"],
    ["A", "이벤트"],
    ["F", "일지"],
    ["P", "엘모 서버룸"],
    ["T", "호감도"],
    ["CN_A", "중국판"],
    ["CN_M", "중국판"],
  ];
  
  export const DEFAULT_CATEGORY = "기타";
  
  export function categorizeFiles(files) {
      let categorized = {};
  
      // Initialize categories
      CATEGORIES.forEach(([_, categoryName]) => (categorized[categoryName] = []));
      categorized[DEFAULT_CATEGORY] = [];
  
      files.forEach((file) => {
          let matched = false;
          
          for (let [prefix, category] of CATEGORIES) {
            if (file.file.startsWith(prefix) && /\d/.test(file.file[prefix.length])) {
                categorized[category].push(file);
                matched = true;
                break;
            }
          }
          
          if (!matched) {
          categorized[DEFAULT_CATEGORY].push(file);
          }
      });
  
      return categorized;
  }