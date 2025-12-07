let map;
let mapInitialized = false;

const restaurants = [
    {
        name: "중앙동 파스타 맛집",
        lat: 37.3165,
        lng: 126.8385,
        category: "양식",
        desc: "분위기 좋은 데이트 코스로 추천하는 파스타 전문점입니다. <br>추천 메뉴: 크림 파스타"
    },
    {
        name: "고잔동 삼겹살",
        lat: 37.3105,
        lng: 126.8315,
        category: "한식",
        desc: "육즙이 살아있는 숙성 삼겹살 맛집입니다. <br>단체 회식 장소로 좋습니다."
    },
    {
        name: "에리카 카페거리",
        lat: 37.2980,
        lng: 126.8360,
        category: "카페",
        desc: "한양대 에리카 근처의 조용한 감성 카페입니다. <br>카공하기 좋은 곳."
    },
    {
        name: "안산역 다문화 음식점",
        lat: 37.3265,
        lng: 126.7890,
        category: "아시안",
        desc: "현지의 맛을 그대로 느낄 수 있는 쌀국수 전문점입니다."
    }
];

const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function initMap() {
    map = L.map('map').setView([37.3219, 126.8309], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    restaurants.forEach(store => {
        const marker = L.marker([store.lat, store.lng], {icon: defaultIcon}).addTo(map);

        marker.bindPopup(`<b>${store.name}</b><br>${store.category}`);

        marker.on('click', () => {
            document.getElementById("store-name").innerText =
                `${store.name} (${store.category})`;
            document.getElementById("store-desc").innerHTML = store.desc;
        });
    });
}

// 카테고리 클릭 이벤트
document.querySelectorAll(".category-card").forEach(card => {
    card.addEventListener("click", () => {
        const category = card.dataset.category;

        document.getElementById("category-screen").style.display = "none";
        document.getElementById("map-screen").style.display = "block";

        document.getElementById("selected-category-title").innerText =
            `선택한 카테고리: ${category}`;

        if (!mapInitialized) {
            initMap();
            mapInitialized = true;
        }
        // 지도가 보일 때 크기 재조정 (깨짐 방지)
        setTimeout(() => map.invalidateSize(), 100);
    });
});

// ▼ [추가된 부분] 뒤로가기 버튼 기능
document.getElementById("back-btn").addEventListener("click", () => {
    document.getElementById("map-screen").style.display = "none";
    document.getElementById("category-screen").style.display = "flex";
});