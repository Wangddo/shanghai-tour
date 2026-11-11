# Shanghai Tour

상하이 2박 3일(2026. 11. 20–22) 셀프 가이드 투어 PWA. `poland-tour-main`의 엔진을 그대로 쓰고, 도시 대신 **요일(토·일)** 단위로 코스를 나눴다.
장소 구성은 <https://wangddo.github.io/shanghai-guide/> 를 기준으로 하고, 숙소만 **인터컨티넨털 상하이 푸동**으로 바꿨다.

## 일정

| | 내용 |
|---|---|
| 가는 편 | 11/20(금) 20:50 김포 → 22:10 상하이 훙차오 T1 |
| 오는 편 | 11/22(일) 17:00 상하이 훙차오 T1 → 19:50 김포 |
| 숙소 | 인터컨티넨털 상하이 푸동 · 上海锦江汤臣洲际大酒店 · 浦东新区张杨路777号 · 세기대도역(2·4·6·9호선) 도보 7분 |

| 요일 | 정거장 | 코스 |
|---|---|---|
| 금 11/20 밤 | — | 훙차오 T1 → 택시·디디로 숙소 (40–50분) |
| 토 11/21 | 13 | 숙소 → 루자쭈이 강변 → ⭐난징동루 → ⭐와이탄 → ⭐그랜드마더 → 난샹 만두 → ⭐예원 → ⭐임시정부 → 신천지 → 톈즈팡 → ⭐헌지우이치엔 → 우캉 맨션 → ⭐Flair · 09:00–20:00 · 도보 ~8km |
| 일 11/22 | 5 | 숙소 → ⭐동방명주 → ⭐점도덕 → 상하이타워 → 숙소 → 훙차오 T1 · 08:30–13:45 |

⭐ = 꼭 가야 할 곳 (`stops-data.js`의 `must: true`, 카드에 "꼭 가기" 배지)

## 구조

```
shanghai-tour/
├── index.html          루트 → course/ 리다이렉트
├── manifest.json       PWA 매니페스트
├── sw.js               Service Worker (오프라인 캐시, 사진 포함)
├── navi/assets/        공용 엔진 (폴란드 투어에서 이어받음 + 중국 좌표계 GCJ-02 보정)
└── course/
    ├── index.html      코스 선택 (금 도착 안내 · 토 · 일 · 여행 메모 · 예약 방법)
    ├── shared-ticket.js  교통·결제 카드 (토·일 공용, 숙소 중국어 주소 포함)
    ├── sat.html · sat/stops-data.js · sat/images/
    └── sun.html · sun/stops-data.js · sun/images/
```

`stops-data.js`의 형식은 폴란드 투어와 같고, 장소명 필드가 `namePl` 대신 `nameLocal`(중국어)이며 구글 검색용 `mapQuery`가 추가됐다.
좌표는 WGS-84(OSM)로 적고, 구글 지도로 넘길 때만 `navi-core.js`가 GCJ-02로 변환한다.

## 로컬에서 보기

```bash
cd shanghai-tour && python3 -m http.server 8777
```

→ <http://localhost:8777/course/>

## 라이선스

- 코드: MIT
- 이미지: Wikimedia Commons (CC BY-SA / CC BY / CC0 / Public Domain) — `course/*/images/credits.txt`
