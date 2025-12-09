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

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
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
    { name: "북경", category: "중식", lat: 37.3217, lng: 126.8285, desc: "안산 시청 앞 코스요리가 유명한 정통 중식당", phone: "031-411-0331", hours: "11:00 ~ 21:30", reserve: "" }
];

/* ⭐ 마커 생성 */
const markers = stores.map(store => {
    const m = L.marker([store.lat, store.lng]).addTo(map);
    m.store = store; 
    m.on("click", () => showStore(store));
    return m;
});

function showStore(store) {
    storeNameEl.textContent = store.name;
    storeDescEl.textContent = store.desc;
    phoneEl.textContent = "전화번호: " + store.phone;
    hoursEl.textContent = "영업시간: " + store.hours;

    if (store.reserve) {
        reserveBtn.style.display = "inline-block";
        reserveBtn.onclick = () => window.open(store.reserve);
    } else {
        reserveBtn.style.display = "none";
        reserveBtn.onclick = null;
    }
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

// 2. ⭐ [추가됨] 엔터 키 누르면 첫 번째 결과로 이동
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const query = searchInput.value.trim();
        if (query.length === 0) return;

        // 현재 입력값으로 다시 검색
        const matches = stores.filter(store => 
            store.name.includes(query)
        );

        if (matches.length > 0) {
            // 검색 결과 중 첫 번째(0번 인덱스) 식당 선택
            handleSearchSelection(matches[0]);
            
            // 모바일 키보드 내려가게 포커스 해제
            searchInput.blur();
        }
    }
});


// 검색 결과 선택 처리 함수
function handleSearchSelection(store) {
    searchInput.value = "";
    searchSuggestions.style.display = "none";

    // 전체 보기로 전환하여 모든 마커 활성화
    filterMarkers("전체");
    selectedTitle.textContent = "검색 결과";

    // 정보 표시 및 이동
    showStore(store);
    map.setView([store.lat, store.lng], 17);
}


/* ⭐ 카테고리 클릭 → 지도화면 전환 */
document.querySelectorAll(".category-card").forEach(card => {
    card.addEventListener("click", () => {
        const cat = card.dataset.category;

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
        }

        setTimeout(() => map.invalidateSize(), 200);
    });
});

backBtn.addEventListener("click", () => {
    mapScreen.style.display = "none";
    categoryScreen.style.display = "block";
    map.setView(ANSAN_CENTER, ANSAN_ZOOM);
});