const categoryScreen = document.getElementById("category-screen");
const mapScreen = document.getElementById("map-screen");
const backBtn = document.getElementById("back-btn");

const selectedTitle = document.getElementById("selected-category-title");
const storeNameEl = document.getElementById("store-name");
const storeDescEl = document.getElementById("store-desc");
const phoneEl = document.getElementById("store-phone");
const hoursEl = document.getElementById("store-hours");
const reserveBtn = document.getElementById("reserve-btn");

/* ⭐ 검색 관련 요소 */
const searchInput = document.getElementById("search-input");
const searchSuggestions = document.getElementById("search-suggestions");

/* ⭐ 리뷰 관련 요소 */
const reviewSection = document.getElementById("review-section");
const starRatingEl = document.getElementById("star-rating");
const reviewTextEl = document.getElementById("review-text");
const submitReviewBtn = document.getElementById("submit-review");
const reviewListEl = document.getElementById("review-list");

/* ✅ (추가) 리스트/정렬 UI 요소 (index.html에 추가해둔 것과 연결) */
const viewMapBtn = document.getElementById("view-map-btn");
const viewListBtn = document.getElementById("view-list-btn");
const sortSelect = document.getElementById("sort-select");

const listPanel = document.getElementById("list-panel");
const storeListEl = document.getElementById("store-list");
const emptyStateEl = document.getElementById("empty-state");

/* ⭐ 안산 중심 & 범위 제한 */
const ANSAN_CENTER = [37.3189, 126.8375];
const ANSAN_ZOOM = 14;

const map = L.map("map", {
    maxBounds: [
        [37.26, 126.78],
        [37.37, 126.89]
    ],
    maxBoundsViscosity: 1.0
}).setView(ANSAN_CENTER, ANSAN_ZOOM);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 18,
    minZoom: 12
}).addTo(map);


/* ⭐ 맛집 데이터 */
const stores = [
    { name:"진원소우 고잔신도시점", category:"한식", lat:37.3175, lng:126.8310, desc:"소고기 · 한식 고기 전문점", phone:"0507-1388-2292", hours:"11:00~22:30", reserve:"" },
    { name:"카페 나드오프 - 잎새달", category:"카페", lat:37.3310, lng:126.8120, desc:"감성 카페", phone:"정보 없음", hours:"10:00~22:00", reserve:"" },
    { name:"열이틀", category:"카페", lat:37.3340, lng:126.8150, desc:"조용한 카페", phone:"정보 없음", hours:"10:00~22:00", reserve:"" },
    { name:"당당초밥", category:"일식", lat:37.3150, lng:126.8380, desc:"초밥 전문점", phone:"0507-1312-5817", hours:"11:00~20:00", reserve:"" },
    { name:"파앤피하우스", category:"양식", lat:37.3230, lng:126.8270, desc:"파스타 · 피자", phone:"정보 없음", hours:"11:00~21:00", reserve:"" },
    { name:"마마교자관", category:"중식", lat:37.3190, lng:126.8240, desc:"교자 전문점", phone:"031-491-2888", hours:"10:00~22:00", reserve:"" },
    { name: "북경", category: "중식", lat: 37.3217, lng: 126.8285, desc: "안산 시청 앞 코스요리가 유명한 정통 중식당", phone: "031-411-0331", hours: "11:00 ~ 21:30", reserve: "" },
    { name: "포크너 고잔점", category: "양식", lat: 37.3108, lng: 126.8309, desc: "안산에서 가장 핫한 파스타 & 스테이크 맛집", phone: "0507-1353-4752", hours: "11:00 ~ 22:00", reserve: "https://app.catchtable.co.kr/ct/shop/forkner_gojan" },
    { name: "빈체로파스타 안산점", category: "양식", lat: 37.3175, lng: 126.8322, desc: "가성비 좋은 이탈리안 파스타 전문점", phone: "031-485-9393", hours: "11:00 ~ 21:30", reserve: "" },
    { name: "투파인드피터 고잔점", category: "양식", lat: 37.3105, lng: 126.8315, desc: "분위기 좋은 감성 다이닝 레스토랑", phone: "0507-1392-4992", hours: "11:00 ~ 22:00", reserve: "https://app.catchtable.co.kr/ct/shop/2fp_gojan" },
    { name: "쉐프스라운지", category: "양식", lat: 37.3118, lng: 126.8302, desc: "화덕피자와 뇨끼가 맛있는 레스토랑", phone: "031-482-1112", hours: "11:30 ~ 22:00", reserve: "https://map.naver.com/p/entry/place/37852319" },
    { name: "그남자의이태리식당", category: "양식", lat: 37.3162, lng: 126.8368, desc: "조용하고 고급스러운 데이트 코스", phone: "031-401-5252", hours: "11:30 ~ 22:00", reserve: "" },
    { name: "오복당", category: "중식", lat: 37.31045, lng: 126.83134, desc: "샤오롱바오 & 우육면이 유명한 감성 중식당", phone: "0507-1329-8345", hours: "11:00 ~ 22:00", reserve: "https://app.catchtable.co.kr/ct/shop/obokdang"},
    { name: "청년다방 안산중앙점", category: "분식", lat: 37.3165, lng: 126.8382, desc: "차돌 떡볶이와 버터갈릭 감자튀김이 유명한 곳", phone: "031-402-1599", hours: "11:00~22:00", reserve: "" },
    { name: "두끼 안산중앙점", category: "분식", lat: 37.3170, lng: 126.8375, desc: "취향대로 만들어 먹는 즉석 떡볶이 무한리필", phone: "031-405-3777", hours: "11:00~22:00", reserve: "" },
    { name: "레드썬 안산본점", category: "분식", lat: 37.3168, lng: 126.8385, desc: "안산 토박이들의 추억이 담긴 즉석 떡볶이 맛집", phone: "031-401-1141", hours: "11:00~21:30", reserve: "" },
    { name: "신전떡볶이 안산중앙점", category: "분식", lat: 37.3162, lng: 126.8370, desc: "중독성 강한 매운맛 떡볶이", phone: "031-482-6339", hours: "11:00~23:00", reserve: "" },
    { name: "동대문엽기떡볶이 안산중앙점", category: "분식", lat: 37.3172, lng: 126.8368, desc: "매운 떡볶이의 대명사", phone: "031-484-8592", hours: "11:00~23:00", reserve: "" },
    { name: "이삭토스트 안산중앙점", category: "분식", lat: 37.3158, lng: 126.8379, desc: "달콤한 소스가 일품인 국민 토스트", phone: "031-405-2422", hours: "09:00~22:00", reserve: "" },
    { name: "에그드랍 안산중앙점", category: "분식", lat: 37.3169, lng: 126.8381, desc: "부드러운 스크램블 에그 샌드위치", phone: "031-411-2999", hours: "09:00~21:00", reserve: "" },
    { name: "김가네김밥 안산중앙역점", category: "분식", lat: 37.3155, lng: 126.8365, desc: "재료가 꽉 찬 프리미엄 김밥", phone: "031-487-2200", hours: "08:00~21:00", reserve: "" },
    { name: "해피치즈스마일 안산점", category: "분식", lat: 37.3180, lng: 126.8355, desc: "돈가스 플레이트와 떡볶이의 조화가 좋은 힙한 분식집", phone: "0507-1355-1234", hours: "11:30~21:30", reserve: "" },
    { name: "볼라바", category: "양식", lat: 37.3102, lng: 126.8305, desc: "트러플 뇨끼와 스테이크가 맛있는 다이닝", phone: "0507-1385-0909", hours: "11:30 ~ 22:00", reserve: "https://app.catchtable.co.kr/ct/shop/volava" },
    { name: "딥볼란테", category: "양식", lat: 37.3115, lng: 126.8330, desc: "분위기 좋은 감성 파스타 & 피자 맛집", phone: "0507-1422-5522", hours: "12:00 ~ 22:00", reserve: "" },
    { name: "오피지", category: "양식", lat: 37.3120, lng: 126.8320, desc: "쫄깃한 도우의 사워도우 화덕피자 전문점", phone: "0507-1321-1234", hours: "11:30 ~ 21:30", reserve: "" },
    { name: "코지", category: "양식", lat: 37.3165, lng: 126.8385, desc: "중앙동 소개팅 성지로 유명한 파스타집", phone: "0507-1355-6789", hours: "11:30 ~ 22:00", reserve: "" },
    { name: "포크너 그랑시티자이점", category: "양식", lat: 37.2885, lng: 126.8372, desc: "상록구에서도 즐기는 포크너의 맛", phone: "0507-1345-4752", hours: "11:00 ~ 22:00", reserve: "https://app.catchtable.co.kr/ct/shop/forkner_grandcity" },
    { name: "까사부오노", category: "양식", lat: 37.3005, lng: 126.8665, desc: "상록수역 근처 분위기 좋은 이탈리안 레스토랑", phone: "0507-1335-1234", hours: "11:30 ~ 22:00", reserve: "" },
    { name: "꽃피는 화덕피자D485", category: "양식", lat: 37.3022, lng: 126.8648, desc: "본오동에서 가장 유명한 화덕피자 맛집", phone: "031-408-4850", hours: "11:30 ~ 21:00", reserve: "https://map.naver.com/p/entry/place/36906231" },
    { name: "투파인드피터 한양대에리카점", category: "양식", lat: 37.2965, lng: 126.8358, desc: "대학가 감성의 가성비 좋은 파스타 맛집", phone: "0507-1318-4992", hours: "11:00 ~ 22:00", reserve: "" },
    { name: "국스테이크", category: "양식", lat: 37.3345, lng: 126.8125, desc: "선부동 가성비 좋은 스테이크 & 파스타 맛집", phone: "031-413-5353", hours: "11:30 ~ 22:00", reserve: "" },
    { name: "나폴리1번가", category: "양식", lat: 37.3338, lng: 126.8115, desc: "화덕피자가 맛있는 선부동 숨은 맛집", phone: "031-485-0011", hours: "11:00 ~ 21:30", reserve: "" },
    { name: "임페리아", category: "양식", lat: 37.3205, lng: 126.7915, desc: "원곡동 다문화거리의 러시아식 빵 & 스테이크", phone: "031-494-6663", hours: "10:00 ~ 22:00", reserve: "" },
    { name: "오늘여기", category: "양식", lat: 37.3172, lng: 126.8085, desc: "초지동 데이트하기 좋은 와인 & 파스타 바", phone: "0507-1335-5482", hours: "17:00 ~ 24:00", reserve: "https://map.naver.com/p/entry/place/1523648562" },
    { name: "홍푸", category: "중식", lat: 37.3115, lng: 126.8305, desc: "안산 고잔동 딤섬 & 코스요리 전문 고급 중식당", phone: "031-403-3885", hours: "11:30 ~ 21:30", reserve: "https://app.catchtable.co.kr/ct/shop/hongfu" },
    { name: "인화반점", category: "중식", lat: 37.3385, lng: 126.7915, desc: "1970년대부터 이어진 안산 신길동 노포 짜장면집", phone: "031-492-4588", hours: "11:00 ~ 20:30", reserve: "" },
    { name: "시낭운동장 시장", category: "중식", lat: 37.3465, lng: 126.8135, desc: "선부동 줄 서서 먹는 얼큰한 고기짬뽕 맛집", phone: "031-484-1400", hours: "10:30 ~ 20:00", reserve: "" },
    { name: "이화원", category: "중식", lat: 37.2985, lng: 126.8365, desc: "한양대 에리카생들이 사랑하는 가성비 중식당", phone: "031-419-0011", hours: "10:30 ~ 21:00", reserve: "" },
    { name: "아오모리 짬뽕", category: "중식", lat: 37.3105, lng: 126.8318, desc: "고잔동에서 가장 유명한 불맛 가득 짬뽕 맛집", phone: "031-484-1110", hours: "11:00 ~ 21:00", reserve: "" },
    { name: "장백산", category: "중식", lat: 37.3125, lng: 126.8328, desc: "푸짐한 양과 얼큰한 국물이 일품인 정통 중식", phone: "031-405-3335", hours: "10:30 ~ 21:30", reserve: "" },
    { name: "브레드앤밀 & 딤섬", category: "중식", lat: 37.3162, lng: 126.8375, desc: "현지인이 운영하는 육즙 가득 수제 만두 & 딤섬", phone: "031-410-5252", hours: "11:00 ~ 22:00", reserve: "" },
    { name: "마라홀릭 안산본점", category: "중식", lat: 37.3175, lng: 126.8382, desc: "안산 마라탕 유행의 시작, 웨이팅 필수 핫플", phone: "0507-1325-8808", hours: "11:30 ~ 22:00", reserve: "" },

    // [고잔신도시/NC백화점 인근]
    { name: "바르다김선생 안산고잔점", category: "분식", lat: 37.3115, lng: 126.8315, desc: "건강한 식재료를 사용하는 깔끔한 김밥", phone: "031-401-1155", hours: "10:00~21:00", reserve: "" },
    { name: "고봉민김밥인 안산고잔점", category: "분식", lat: 37.3120, lng: 126.8305, desc: "돈가스 김밥이 맛있는 분식점", phone: "031-403-5055", hours: "09:00~20:30", reserve: "" },
    { name: "남도분식 안산고잔점", category: "분식", lat: 37.3125, lng: 126.8320, desc: "상추튀김과 시래기 떡볶이가 유명한 레트로 분식", phone: "031-410-5552", hours: "11:30~21:00", reserve: "" },
    { name: "우리할매떡볶이 안산고잔점", category: "분식", lat: 37.3105, lng: 126.8312, desc: "통가래떡 떡볶이로 유명한 옛날 떡볶이 맛집", phone: "031-401-7977", hours: "11:00~21:00", reserve: "" },

    // [한양대 에리카 / 사동 인근]
    { name: "밀플랜비 한양대에리카점", category: "분식", lat: 37.2985, lng: 126.8355, desc: "학생들의 소울푸드, 든든한 치킨 감자 부리또", phone: "031-408-9292", hours: "10:00~22:00", reserve: "" },
    { name: "알촌 한양대점", category: "분식", lat: 37.2980, lng: 126.8360, desc: "가성비 최고의 약매 알밥 전문점", phone: "031-417-8880", hours: "09:00~20:30", reserve: "" },
    { name: "쪽문분식", category: "분식", lat: 37.2975, lng: 126.8345, desc: "에리카 쪽문에 위치한 가성비 제육덮밥과 떡볶이", phone: "정보 없음", hours: "10:00~20:00", reserve: "" },
    { name: "서브웨이 안산한양대점", category: "분식", lat: 37.2990, lng: 126.8365, desc: "신선한 야채가 가득한 샌드위치", phone: "031-409-1230", hours: "08:00~22:00", reserve: "" },
    { name: "봉구스밥버거 한양대점", category: "분식", lat: 37.2982, lng: 126.8358, desc: "간단하게 한 끼 해결하기 좋은 밥버거", phone: "031-408-5949", hours: "10:00~21:00", reserve: "" },

    // [상록수/본오동 인근]
    { name: "신전떡볶이 상록수점", category: "분식", lat: 37.3015, lng: 126.8655, desc: "매운맛 마니아들이 찾는 떡볶이", phone: "031-408-6339", hours: "11:00~22:30", reserve: "" },
    { name: "명랑핫도그 상록수점", category: "분식", lat: 37.3020, lng: 126.8660, desc: "바삭하고 쫄깃한 쌀 핫도그", phone: "031-406-0601", hours: "11:00~22:00", reserve: "" },

    // ───────── 아시안 (다은 담당) ─────────
    {
        name: "드렁킨타이 안산초지점",
        category: "아시안",
        lat: 37.30830,
        lng: 126.8166,
        desc: "태국 길거리 음식 감성의 타이 레스토랑",
        phone: "031-414-9593",
        hours: "11:00~22:00",
        reserve: ""
    },
    {
        name: "포메인 안산중앙점",
        category: "아시안",
        lat: 37.31967,
        lng: 126.8365,
        desc: "베트남 쌀국수 전문 체인점, 중앙동 메가박스 건물 3층",
        phone: "031-413-7758",
        hours: "11:00~21:00",
        reserve: ""
    },
    {
        name: "연제네 안산본점",
        category: "아시안",
        lat: 37.31023,
        lng: 126.8305,
        desc: "쌀국수와 분짜 등 다양한 아시안 메뉴를 즐길 수 있는 맛집",
        phone: "",
        hours: "11:00~21:30",
        reserve: "https://app.catchtable.co.kr/ct/shop/yeonjene"
    },
    {
        name: "남월 쌀국수 안산한양대 본점",
        category: "아시안",
        lat: 37.30158,
        lng: 126.8383,
        desc: "한양대 에리카 근처 학생들에게 인기 많은 쌀국수집",
        phone: "031-407-5021",
        hours: "10:00~21:00",
        reserve: ""
    },

    // ───────── 한식 (다은 담당) ─────────
    {
        name: "정든집",
        category: "한식",
        lat: 37.31411,
        lng: 126.8922,
        desc: "시골 밥상 느낌의 한식 백반집",
        phone: "031-437-2678",
        hours: "11:30~21:00",
        reserve: ""
    },
    {
        name: "시골순대",
        category: "한식",
        lat: 37.30329,
        lng: 126.8612,
        desc: "순댓국과 머릿고기가 인기인 순대 전문점",
        phone: "031-418-3352",
        hours: "10:00~20:50",
        reserve: ""
    },
    {
        name: "대궐막국수 안산본점",
        category: "한식",
        lat: 37.30323,
        lng: 126.8536,
        desc: "막국수와 편육이 유명한 한식 전문점",
        phone: "031-417-1555",
        hours: "10:50~20:30",
        reserve: "https://app.catchtable.co.kr/ct/shop/daegual_ansan"
    },
    {
        name: "산촌칼국수",
        category: "한식",
        lat: 37.29698,
        lng: 126.8679,
        desc: "칼국수와 수제비가 메인인 따끈한 국물 맛집",
        phone: "031-406-8569",
        hours: "11:30~20:40",
        reserve: ""
    },
    {
        name: "송탄나여사부대찌개",
        category: "한식",
        lat: 37.30900,
        lng: 126.8109,
        desc: "부대찌개와 철판볶음이 유명한 부대찌개 전문점",
        phone: "",
        hours: "10:00~21:00",
        reserve: ""
    },
    {
        name: "영월에곤드레",
        category: "한식",
        lat: 37.34614,
        lng: 126.8303,
        desc: "곤드레밥과 한식 반찬이 잘 나오는 건강식당",
        phone: "031-403-3015",
        hours: "11:00~21:00",
        reserve: ""
    },
    {
        name: "시랑면옥",
        category: "한식",
        lat: 37.33477,
        lng: 126.8541,
        desc: "냉면과 온면이 인기 메뉴인 면 요리 전문점",
        phone: "031-486-1101",
        hours: "11:00~20:00",
        reserve: ""
    }
];

/* ✅ (중요) 전역 상태: 현재 카테고리 기억 (리스트에도 똑같이 반영) */
let currentCategory = null;

/* ✅ 리뷰 데이터: localStorage 저장(새로고침해도 유지) */
const REVIEWS_KEY = "ansan_reviews_v1";
let currentStoreName = null;

function loadReviewStore() {
    try {
        const raw = localStorage.getItem(REVIEWS_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") return parsed;
        return {};
    } catch {
        return {};
    }
}
function saveReviewStore() {
    try {
        localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviewStore));
    } catch {
        // 저장 실패해도 앱이 죽지 않게
    }
}

/* ⭐ { "식당이름": [ {rating, text, date}, ... ] } */
const reviewStore = loadReviewStore();

/* ⭐ 별 클릭 시 색칠하기 */
function setStarActive(count) {
    if (!starRatingEl) return;
    const stars = Array.from(starRatingEl.querySelectorAll("span"));
    stars.forEach((star, idx) => {
        if (idx < count) star.classList.add("active");
        else star.classList.remove("active");
    });
}

/* ✅ 평균 별점/리뷰 수 계산 (정렬/리스트 표시용) */
function getReviewStats(storeName) {
    const list = reviewStore[storeName] || [];
    const count = list.length;
    if (count === 0) return { avg: 0, count: 0 };
    const sum = list.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    return { avg: sum / count, count };
}

/* 특정 식당의 리뷰 목록 렌더링 */
function renderReviews(storeName) {
    if (!reviewListEl) return;

    reviewListEl.innerHTML = "";
    const list = reviewStore[storeName] || [];

    if (list.length === 0) {
        const p = document.createElement("p");
        p.className = "no-review";
        p.textContent = "아직 등록된 리뷰가 없습니다.";
        reviewListEl.appendChild(p);
        return;
    }

    list.forEach(item => {
        const wrap = document.createElement("div");
        wrap.className = "review-item";

        const header = document.createElement("div");
        header.className = "review-header";

        const starSpan = document.createElement("span");
        starSpan.className = "review-stars";
        starSpan.textContent = "★".repeat(item.rating);

        const dateSpan = document.createElement("span");
        dateSpan.className = "review-date";
        dateSpan.textContent = item.date;

        header.appendChild(starSpan);
        header.appendChild(dateSpan);

        const body = document.createElement("div");
        body.className = "review-body";
        body.textContent = item.text;

        wrap.appendChild(header);
        wrap.appendChild(body);

        reviewListEl.appendChild(wrap);
    });
}

/* ⭐ 이모지 마커 디자인 함수 */
function getMarkerContent(category) {
    const icons = {
        "한식": "🍚", "양식": "🍝", "중식": "🥟",
        "일식": "🍣", "분식": "🍢", "카페": "☕",
        "아시안": "🍜", "전체": "😋"
    };
    return icons[category] || "🍴";
}

/* ⭐ 마커 생성 (커스텀 디자인 적용) */
const markers = stores.map(store => {
    const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-pin">${getMarkerContent(store.category)}</div>`,
        iconSize: [60, 60],
        iconAnchor: [30, 60]
    });

    const m = L.marker([store.lat, store.lng], { icon: customIcon }).addTo(map);

    m.store = store;
    m.on("click", () => {
        showStore(store);
        // ✅ 리스트 뷰에서 마커 클릭했어도 리스트 하이라이트 갱신
        renderStoreList();
    });
    return m;
});

function showStore(store) {
    storeNameEl.textContent = store.name;
    storeDescEl.textContent = store.desc;
    phoneEl.textContent = "전화번호: " + (store.phone || "정보 없음");
    hoursEl.textContent = "영업시간: " + (store.hours || "정보 없음");

    if (store.reserve) {
        reserveBtn.style.display = "inline-block";
        reserveBtn.onclick = () => window.open(store.reserve);
    } else {
        reserveBtn.style.display = "none";
        reserveBtn.onclick = null;
    }

    // ⭐ 현재 선택된 가게 이름 저장 + 리뷰 표시
    currentStoreName = store.name;
    setStarActive(0);
    renderReviews(store.name);
}

/* ⭐ 카테고리 필터 */
function filterMarkers(category) {
    const visible = markers.filter(m =>
        category === "전체" || m.store.category === category
    );

    markers.forEach(m => {
        if (visible.includes(m)) {
            if (!map.hasLayer(m)) m.addTo(map);
        } else {
            if (map.hasLayer(m)) map.removeLayer(m);
        }
    });
}

/* ✅ 현재 화면에 보이는(필터 적용된) store 목록 얻기 */
function getVisibleStoresByCategory() {
    const visibleMarkers = markers.filter(m => map.hasLayer(m));
    return visibleMarkers.map(m => m.store);
}

/* ✅ 정렬 적용 */
function sortStores(list) {
    const mode = sortSelect ? sortSelect.value : "default";
    const arr = [...list];

    if (mode === "rating_desc") {
        arr.sort((a, b) => {
            const A = getReviewStats(a.name).avg;
            const B = getReviewStats(b.name).avg;
            if (B !== A) return B - A;
            // 동점이면 리뷰 많은 순
            return getReviewStats(b.name).count - getReviewStats(a.name).count;
        });
    } else if (mode === "reviews_desc") {
        arr.sort((a, b) => getReviewStats(b.name).count - getReviewStats(a.name).count);
    } else if (mode === "name_asc") {
        arr.sort((a, b) => a.name.localeCompare(b.name, "ko"));
    } else {
        // default: stores 원본 순서 유지
        // (현재 리스트는 map layer 순서에 영향받을 수 있어, 원본 배열 기준으로 재정렬)
        const indexMap = new Map(stores.map((s, i) => [s.name, i]));
        arr.sort((a, b) => (indexMap.get(a.name) ?? 99999) - (indexMap.get(b.name) ?? 99999));
    }

    return arr;
}

/* ✅ 리스트 렌더링 */
function renderStoreList() {
    if (!storeListEl || !listPanel) return;

    // 필터 적용된 visible stores 기준
    const visibleStores = getVisibleStoresByCategory();
    const sorted = sortStores(visibleStores);

    storeListEl.innerHTML = "";

    if (emptyStateEl) {
        emptyStateEl.style.display = (sorted.length === 0) ? "block" : "none";
    }

    sorted.forEach(store => {
        const { avg, count } = getReviewStats(store.name);

        const item = document.createElement("div");
        item.className = "store-list-item";
        if (currentStoreName === store.name) item.classList.add("active");

        item.innerHTML = `
            <div class="sli-top">
                <div class="sli-title">${store.name}</div>
                <div class="sli-badge">${store.category}</div>
            </div>
            <div class="sli-desc">${store.desc || ""}</div>
            <div class="sli-meta">
                <span class="sli-stars">★ ${avg ? avg.toFixed(1) : "0.0"}</span>
                <span class="sli-reviews">리뷰 ${count}</span>
            </div>
        `;

        item.addEventListener("click", () => {
            // 지도/정보패널 이동
            showStore(store);
            map.setView([store.lat, store.lng], 17);

            // 리스트 하이라이트 갱신
            renderStoreList();

            // 리스트에서 눌러도 "지도 보기"로 자동 전환은 안 함 (원하면 켜줄 수도)
        });

        storeListEl.appendChild(item);
    });
}

/* ✅ 지도/리스트 뷰 토글 */
function setViewMode(mode) {
    const isMap = mode === "map";

    if (isMap) {
        if (listPanel) listPanel.style.display = "none";
        if (document.getElementById("map")) document.getElementById("map").style.display = "block";
        if (document.getElementById("info-panel")) document.getElementById("info-panel").style.display = "flex";

        if (viewMapBtn) viewMapBtn.classList.add("active");
        if (viewListBtn) viewListBtn.classList.remove("active");

        // 지도 깨짐 방지
        setTimeout(() => map.invalidateSize(), 150);
    } else {
        if (listPanel) listPanel.style.display = "block";
        if (document.getElementById("map")) document.getElementById("map").style.display = "none";
        if (document.getElementById("info-panel")) document.getElementById("info-panel").style.display = "none";

        if (viewMapBtn) viewMapBtn.classList.remove("active");
        if (viewListBtn) viewListBtn.classList.add("active");

        renderStoreList();
    }
}

/* ✅ 토글/정렬 이벤트 연결 */
if (viewMapBtn && viewListBtn) {
    viewMapBtn.addEventListener("click", () => setViewMode("map"));
    viewListBtn.addEventListener("click", () => setViewMode("list"));
}
if (sortSelect) {
    sortSelect.addEventListener("change", () => {
        // 현재 리스트 뷰면 즉시 반영
        if (listPanel && listPanel.style.display !== "none") renderStoreList();
    });
}

/* ⭐ 검색 기능 로직 */

// 1. 입력할 때 추천 목록 띄우기
searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim();
    searchSuggestions.innerHTML = "";

    if (query.length === 0) {
        searchSuggestions.style.display = "none";
        return;
    }

    const matches = stores.filter(store =>
        store.name.includes(query)
    );

    if (matches.length > 0) {
        searchSuggestions.style.display = "block";
        matches.forEach(store => {
            const div = document.createElement("div");
            div.className = "suggestion-item";
            div.innerHTML = `<span>${store.name}</span> <span class="s-cat">${store.category}</span>`;

            div.addEventListener("click", () => {
                handleSearchSelection(store);
            });

            searchSuggestions.appendChild(div);
        });
    } else {
        searchSuggestions.style.display = "none";
    }
});

// 2. ⭐ 엔터 키 누르면 첫 번째 결과로 이동
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const query = searchInput.value.trim();
        if (query.length === 0) return;

        const matches = stores.filter(store =>
            store.name.includes(query)
        );

        if (matches.length > 0) {
            handleSearchSelection(matches[0]);
            searchInput.blur();
        }
    }
});

function handleSearchSelection(store) {
    searchInput.value = "";
    searchSuggestions.style.display = "none";

    // 검색은 전체로 전환
    currentCategory = "전체";
    filterMarkers("전체");
    selectedTitle.textContent = "검색 결과";

    // 지도 모드에서는 이동, 리스트 모드에서는 리스트에도 반영되도록
    showStore(store);
    map.setView([store.lat, store.lng], 17);

    renderStoreList();
}

/* ⭐ 카테고리 클릭 → 지도화면 전환 */
document.querySelectorAll(".category-card").forEach(card => {
    card.addEventListener("click", () => {
        const cat = card.dataset.category;

        currentCategory = cat;

        categoryScreen.style.display = "none";
        mapScreen.style.display = "block";
        searchInput.value = "";
        searchSuggestions.style.display = "none";

        selectedTitle.textContent =
            (cat === "전체") ? "전체 맛집" : `${cat} 맛집`;

        filterMarkers(cat);

        const visibleMarkers = markers.filter(m => map.hasLayer(m));
        if (visibleMarkers.length > 0) {
            map.setView(visibleMarkers[0].getLatLng(), 16);
            showStore(visibleMarkers[0].store);
        } else {
            storeNameEl.textContent = "검색된 식당이 없습니다";
            storeDescEl.textContent = "";
            phoneEl.textContent = "";
            hoursEl.textContent = "";
            reserveBtn.style.display = "none";
            currentStoreName = null;
        }

        // ✅ 리스트도 같이 갱신
        renderStoreList();

        setTimeout(() => map.invalidateSize(), 200);

        // ✅ 카테고리 누르면 기본은 지도 모드로
        setViewMode("map");
    });
});

backBtn.addEventListener("click", () => {
    mapScreen.style.display = "none";
    categoryScreen.style.display = "flex";
    map.setView(ANSAN_CENTER, ANSAN_ZOOM);

    // ✅ 리스트/정렬 초기화(원하면 유지해도 됨)
    if (sortSelect) sortSelect.value = "default";
    setViewMode("map");
});

/* ⭐ 별점 클릭 & 리뷰 등록 이벤트 */
if (starRatingEl && submitReviewBtn) {
    const starSpans = Array.from(starRatingEl.querySelectorAll("span"));
    let selectedRating = 0;

    // 별 클릭 이벤트
    starSpans.forEach(star => {
        star.addEventListener("click", () => {
            const value = Number(star.dataset.star);
            selectedRating = value;
            setStarActive(value);
        });
    });

    // 리뷰 등록 버튼
    submitReviewBtn.addEventListener("click", () => {
        if (!currentStoreName) {
            alert("먼저 지도의 가게를 선택해주세요!");
            return;
        }
        if (selectedRating === 0) {
            alert("별점을 선택해주세요!");
            return;
        }
        const text = reviewTextEl.value.trim();
        if (text.length === 0) {
            alert("리뷰 내용을 입력해주세요!");
            return;
        }

        const today = new Date();
        const dateStr = `${today.getFullYear()}.${today.getMonth() + 1}.${today.getDate()}`;

        if (!reviewStore[currentStoreName]) {
            reviewStore[currentStoreName] = [];
        }
        reviewStore[currentStoreName].push({
            rating: selectedRating,
            text,
            date: dateStr
        });

        // ✅ localStorage 저장
        saveReviewStore();

        // 입력창 초기화 + 별 초기화 + 리스트 다시 렌더링
        reviewTextEl.value = "";
        selectedRating = 0;
        setStarActive(0);
        renderReviews(currentStoreName);

        // ✅ 리스트에도 평균/리뷰수 즉시 반영
        renderStoreList();
    });
}

/* ⭐ 랜덤 맛집 추천 기능 (룰렛) */
const randomBtn = document.getElementById("random-btn");

if (randomBtn) {
    randomBtn.addEventListener("click", () => {
        const randomIndex = Math.floor(Math.random() * stores.length);
        const randomStore = stores[randomIndex];

        categoryScreen.style.display = "none";
        mapScreen.style.display = "block";

        currentCategory = "전체";
        selectedTitle.textContent = "🎲 오늘의 운명은?";

        filterMarkers("전체");

        // 지도 모드로 보여주고 이동
        setViewMode("map");
        map.setView([randomStore.lat, randomStore.lng], 16);
        showStore(randomStore);

        // 리스트도 최신화
        renderStoreList();

        setTimeout(() => {
            alert(`오늘의 추천 맛집은 [${randomStore.name}] 입니다! \n(${randomStore.category} - ${randomStore.desc})`);
        }, 300);
    });
}

/* ✅ 첫 로드 시 기본값 */
setViewMode("map");
