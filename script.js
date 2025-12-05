// 1. 지도 생성 (중심 좌표: 안산시청 근처)
var map = L.map('map').setView([37.3219, 126.8309], 14);

// 2. 오픈스트리트맵 타일 레이어 추가 (지도 이미지 불러오기)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// 3. 맛집 데이터 (예시 데이터)
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

// 4. 마커 아이콘 설정 (기본 파란 핀)
// (Leaflet 기본 마커 이미지 경로 이슈 해결을 위한 코드)
var defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// 5. 데이터를 기반으로 지도에 마커 추가하기
restaurants.forEach(function(store) {
    // 마커 생성
    var marker = L.marker([store.lat, store.lng], {icon: defaultIcon}).addTo(map);
    
    // 마커 클릭 시 팝업 표시
    marker.bindPopup(`<b>${store.name}</b><br>${store.category}`);

    // 마커 클릭 시 하단(또는 우측) 패널 정보 업데이트
    marker.on('click', function() {
        document.getElementById('store-name').innerText = store.name + " (" + store.category + ")";
        document.getElementById('store-desc').innerHTML = store.desc;
    });
});