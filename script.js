// 화면 요소
const categoryScreen = document.getElementById("category-screen");
const mapScreen = document.getElementById("map-screen");
const backBtn = document.getElementById("back-btn");

const selectedCategoryTitle = document.getElementById("selected-category-title");
const storeNameEl = document.getElementById("store-name");
const storeDescEl = document.getElementById("store-desc");
const storePhoneEl = document.getElementById("store-phone");
const storeHoursEl = document.getElementById("store-hours");
const reserveBtn = document.getElementById("reserve-btn");

// 처음에는 카테고리 화면만 보이게
categoryScreen.style.display = "block";
mapScreen.style.display = "none";

// Leaflet 지도 설정
const map = L.map("map").setView([37.32, 126.83], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap"
}).addTo(map);

// ★ 요구사항 2: 식당 6개 데이터
const stores = [
    {
        name: "진원소우 고잔신도시점",
        category: "한식",
        lat: 37.3175,
        lng: 126.8310,
        desc: "소고기 · 샤브샤브 등 한식 계열 고기 맛집",
        phone: "0507-1388-2292",
        hours: "11:00 ~ 22:30",
        reserveUrl: "" // 온라인 예약 링크 있으면 여기 넣기
    },
    {
        name: "카페 나드오프 - 잎새달",
        category: "카페",
        lat: 37.3310,
        lng: 126.8120,
        desc: "감성 카페, 디저트와 함께 쉬기 좋은 곳",
        phone: "정보 없음",
        hours: "10:00 ~ 22:00 (변동 가능)",
        reserveUrl: ""
    },
    {
        name: "열이틀",
        category: "카페",
        lat: 37.3340,
        lng: 126.8150,
        desc: "조용한 분위기의 카페 열이틀",
        phone: "정보 없음",
        hours: "10:00 ~ 22:00 (변동 가능)",
        reserveUrl: ""
    },
    {
        name: "당당초밥",
        category: "일식",
        lat: 37.3150,
        lng: 126.8380,
        desc: "초밥 · 사시미 · 덮밥이 인기인 일식당",
        phone: "0507-1312-5817",
        hours: "11:30 ~ 21:00 (브레이크타임 있음, 가정)",
        reserveUrl: ""
    },
    {
        name: "파앤피하우스",
        category: "양식",
        lat: 37.3230,
        lng: 126.8270,
        desc: "파스타와 피자를 파는 양식 맛집",
        phone: "정보 없음",
        hours: "11:00 ~ 21:00 (가정)",
        reserveUrl: ""
    },
    {
        name: "마마교자관",
        category: "중식",
        lat: 37.3190,
        lng: 126.8240,
        desc: "중국식 교자와 다양한 메뉴",
        phone: "031-491-2888",
        hours: "10:00 ~ 22:00",
        reserveUrl: ""
    }
];

// 마커들 저장
const markers = [];

stores.forEach((store) => {
    const marker = L.marker([store.lat, store.lng]).addTo(map);
    marker.store = store;

    marker.on("click", () => {
        showStoreInfo(store);
    });

    markers.push(marker);
});

// 식당 정보 패널 업데이트 (요구사항 3: 전화번호, 영업시간, 예약 버튼)
function showStoreInfo(store) {
    storeNameEl.textContent = store.name;
    storeDescEl.textContent = store.desc || "";

    storePhoneEl.textContent = store.phone ? `전화번호: ${store.phone}` : "";
    storeHoursEl.textContent = store.hours ? `영업시간: ${store.hours}` : "";

    // 예약 버튼 처리
    if (store.reserveUrl && store.reserveUrl.trim() !== "") {
        reserveBtn.style.display = "inline-block";
        reserveBtn.textContent = "온라인 예약하기";
        reserveBtn.onclick = () => {
            window.open(store.reserveUrl, "_blank");
        };
    } else if (store.phone && store.phone !== "정보 없음") {
        reserveBtn.style.display = "inline-block";
        reserveBtn.textContent = "전화로 예약하기";
        reserveBtn.onclick = () => {
            alert(`${store.name}\n${store.phone}\n\n전화로 예약해 주세요 😊`);
        };
    } else {
        reserveBtn.style.display = "none";
        reserveBtn.onclick = null;
    }
}

// ★ 요구사항 1: 카테고리별로 마커 필터링
function filterMarkersByCategory(category) {
    const visibleLatLngs = [];

    markers.forEach((marker) => {
        const s = marker.store;
        const show =
            category === "전체" || s.category === category;

        if (show) {
            if (!map.hasLayer(marker)) marker.addTo(map);
            visibleLatLngs.push(marker.getLatLng());
        } else {
            if (map.hasLayer(marker)) map.removeLayer(marker);
        }
    });

    if (visibleLatLngs.length > 0) {
        const bounds = L.latLngBounds(visibleLatLngs);
        map.fitBounds(bounds, { padding: [40, 40] });

        const firstStore = markers.find((m) =>
            category === "전체" || m.store.category === category
        ).store;
        showStoreInfo(firstStore);
    } else {
        // 해당 카테고리 식당 없을 때
        storeNameEl.textContent = "등록된 식당이 없습니다";
        storeDescEl.textContent = "이 카테고리에 등록된 맛집이 아직 없어요.";
        storePhoneEl.textContent = "";
        storeHoursEl.textContent = "";
        reserveBtn.style.display = "none";
    }
}

// 카테고리 카드 클릭 → 지도 화면으로 전환 + 필터 적용
document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", () => {
        const category = card.dataset.category;

        categoryScreen.style.display = "none";
        mapScreen.style.display = "block";

        if (category === "전체") {
            selectedCategoryTitle.textContent = "전체 맛집 보기";
        } else {
            selectedCategoryTitle.textContent = `${category} 맛집`;
        }

        filterMarkersByCategory(category);

        // 지도가 처음 보일 때 깨지는 것 방지
        setTimeout(() => {
            map.invalidateSize();
        }, 200);
    });
});

// 뒤로가기 버튼
backBtn.addEventListener("click", () => {
    mapScreen.style.display = "none";
    categoryScreen.style.display = "block";
});
