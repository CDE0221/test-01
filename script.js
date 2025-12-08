/* script.js */
let map;
let mapInitialized = false;
let markerLayerGroup; // 마커들을 관리할 그룹 (필터링용)

// 데이터
const restaurants = [
    { name: "중앙동 파스타 맛집", lat: 37.3165, lng: 126.8385, category: "양식", desc: "분위기 좋은 데이트 코스.<br>추천: 크림 파스타 🍝" },
    { name: "고잔동 삼겹살", lat: 37.3105, lng: 126.8315, category: "한식", desc: "육즙 가득 숙성 삼겹살.<br>회식 장소 강추 🥩" },
    { name: "에리카 카페거리", lat: 37.2980, lng: 126.8360, category: "카페", desc: "한양대 에리카 근처 감성 카페.<br>카공하기 좋아요 ☕" },
    { name: "안산역 쌀국수", lat: 37.3265, lng: 126.7890, category: "아시안", desc: "현지의 맛 그대로.<br>진한 국물의 쌀국수 🍜" },
    { name: "상록수 떡볶이", lat: 37.3020, lng: 126.8650, category: "분식", desc: "학교 앞 추억의 맛.<br>매콤달콤 떡볶이 🌶️" }
];

// 지도 초기화 함수
function initMap() {
    // 1. 안산 중심으로 지도 생성 (줌 레벨 조정)
    map = L.map('map', { zoomControl: false }).setView([37.315, 126.835], 13);
    
    // 줌 컨트롤 위치 변경 (오른쪽 하단)
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // 2. ✨ 네이버 지도 느낌의 깔끔한 타일 (CartoDB Voyager) 적용
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 20
    }).addTo(map);

    // 3. 마커 그룹 생성 (마커를 꼈다 뺐다 하기 위함)
    markerLayerGroup = L.layerGroup().addTo(map);
}

// 마커 표시 함수 (카테고리 필터링 적용)
function showMarkers(category) {
    // 기존 마커 싹 지우기
    markerLayerGroup.clearLayers();

    // 선택한 카테고리(또는 전체)에 맞는 가게만 필터링
    const filteredData = restaurants.filter(store => {
        return category === '전체' || store.category === category;
    });

    // 필터링된 가게들만 마커 생성
    filteredData.forEach(store => {
        const marker = L.marker([store.lat, store.lng]).addTo(markerLayerGroup);

        // 마커 클릭 이벤트
        marker.on('click', () => {
            // 정보 패널 업데이트
            document.getElementById("store-name").innerText = store.name;
            document.getElementById("store-desc").innerHTML = store.desc;
            document.getElementById("selected-category-title").innerText = store.category;
            
            // 지도 중심 이동 (부드럽게)
            map.flyTo([store.lat, store.lng], 15, { duration: 1.5 });
        });
    });

    // 데이터가 하나라도 있으면 첫 번째 가게 정보를 패널에 띄움
    if (filteredData.length > 0) {
        // 지도 범위 재조정 (모든 마커가 보이게)
        /* map.fitBounds(L.featureGroup(markerLayerGroup.getLayers()).getBounds().pad(0.2)); */
    }
}

// 📌 카테고리 카드 클릭 이벤트
document.querySelectorAll(".category-card").forEach(card => {
    card.addEventListener("click", () => {
        const category = card.dataset.category;

        // 화면 전환
        document.getElementById("category-screen").style.display = "none";
        document.getElementById("map-screen").style.display = "block";

        // 지도 초기화 (최초 1회만)
        if (!mapInitialized) {
            initMap();
            mapInitialized = true;
        }
        
        // 지도 크기 재계산 (화면 전환 시 깨짐 방지)
        setTimeout(() => {
            map.invalidateSize();
            showMarkers(category); // 선택한 카테고리 마커만 표시
        }, 100);

        // 패널 초기 문구 설정
        document.getElementById("selected-category-title").innerText = `${category} 맛집 리스트`;
        document.getElementById("store-name").innerText = "지도에서 마커를 눌러보세요";
        document.getElementById("store-desc").innerText = "";
    });
});

// 🔙 뒤로가기 버튼 기능
document.getElementById("back-btn").addEventListener("click", () => {
    document.getElementById("map-screen").style.display = "none";
    document.getElementById("category-screen").style.display = "flex";
});