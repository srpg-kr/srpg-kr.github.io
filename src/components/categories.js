// categories.js
export const CATEGORIES = [
    ["M", "메인 스토리"],
    ["A", "이벤트"],
    ["WE", "이벤트"],
    ["PL", "이벤트"],
    ["CL", "이벤트"],
    ["FE", "이벤트"],
    ["W", "이벤트"],
    ["F", "일지"],
    ["P", "엘모 서버룸"],
    ["PD", "엘모 서버룸"],
    ["T", "호감도"],
    ["G", "라운지 스토리"],
    ["CN_A", "중국판"],
    ["CN_M", "중국판"],
    ["C", "티타임"],
    ["K", "요리"],
  ];

  export const CATEGORY_ORDER = [
    "메인 스토리",
    "이벤트",
    "ASMR",
    "기념일",
    "서약",
    "일지",
    "엘모 서버룸",
    "호감도",
    "라운지 스토리",
    "티타임",
    "요리",
    "중국판",
  ];
  
  export const DEFAULT_CATEGORY = "기타";
  
  export function categorizeFiles(files) {
      let categorized = {};
  
      // Initialize categories
      CATEGORY_ORDER.forEach((categoryName) => (categorized[categoryName] = []));
      categorized[DEFAULT_CATEGORY] = [];
  
      files.forEach((file) => {
          if (file.category && Object.hasOwn(categorized, file.category)) {
              categorized[file.category].push(file);
              return;
          }

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
