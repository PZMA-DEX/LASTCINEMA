# 은하극장 리셋 v6 업로드 및 동기화 안내

## 1. 파일 전체 업로드

청명산장과 별도로 **마지막 상영회 전용 저장소**를 사용하세요.

1. 새 ZIP의 압축을 풉니다.
2. GitHub에서 마지막 상영회 저장소를 엽니다.
3. **Add file → Upload files**를 선택합니다.
4. `last_screening_2042` 폴더 **안의 내용물**을 전부 끌어 놓습니다. 저장소 첫 화면에 `index.html`과 `assets` 폴더가 나란히 있어야 합니다.
5. 변경 내용을 커밋합니다. 이전 `index.html`, `sw.js`도 새 파일로 교체합니다.
6. `assets/game/cinema.js`, `assets/opening/last_screening_opening.mp4`가 실제로 올라갔는지 확인합니다. 대소문자와 폴더 이름을 유지하세요.

이번 MP4는 **약9MiB**로 줄였으므로 파일당25MiB인 GitHub 웹 업로드 한도 안에 들어갑니다. 영상과 폴더를 빠뜨리지 않고 함께 올리세요.[1]

GitHub Desktop을 쓰면 저장소 복제 → 압축을 푼 내용물 복사 → Commit → Push origin 순서입니다. 처음 만드는 전용 저장소는 New repository → 파일 복사 → Commit → Publish repository로 올릴 수도 있습니다.[2]

## 2. Pages 설정 및 새 버전 확인

전용 저장소의 **Settings → Pages → Deploy from a branch → main → /(root) → Save**를 선택합니다. 실제 올린 브랜치가 main이 아니라면 해당 브랜치를 고릅니다. 배포가 끝나면 Pages가 표시한 사이트 주소로 접속합니다.[3]

기존에 Pages를 사용했다면 파일 업로드 후 Actions 배포 완료를 기다립니다. 새로고침 뒤 맵 상단에 **EUNHA CINEMA · v6**가 보이면 새 엔진입니다. 예전 지도라면 `index.html`, `sw.js`, 새 `assets/game/cinema.js` 업로드 여부를 다시 확인합니다.

청명산장과 같은 저장소를 꼭 써야 하면 기존 게시 폴더 아래에 이 게임의 폴더를 별도로 추가합니다. 청명산장의 최상위 index.html과 assets를 덮어쓰지 않습니다.

## 3. Firebase 규칙

GitHub는 화면·파일을 제공하고 Firebase는 단계·증거·채팅·투표 데이터를 공유합니다. ZIP 업로드만으로 Firebase 규칙이 바뀌지는 않습니다.

| 구분 | 경로 |
|---|---|
| 청명산장 — 유지 | `/rooms/main` |
| 마지막 상영회 — 실제 사용 | `/games/last-screening-2042/rooms/default` |
| 첨부 화면에서 잘못 허용한 위치 | `/rooms/games/last-screening-2042/rooms/default` |

Firebase 콘솔의 **CHECKIN → Realtime Database → 규칙**에서 `games`를 `rooms` 밖으로 옮겨 둘을 `rules` 바로 아래 같은 깊이에 둡니다. 규칙의 JSON 중첩이 적용할 데이터 경로를 결정합니다.[4]

첨부 화면과 현재 규칙이 같다면 동봉 `firebase-rules-screenshot-fixed.json`을 적용한 뒤 **게시**합니다. 다른 규칙을 추가했다면 기존 항목을 보존하고 `games/last-screening-2042`만 병합합니다. 청명산장 `rooms/main`의 조건은 그대로 들어 있습니다.

예시의 유효기간은 2027년1월1일00:00 한국시간 전까지입니다. 현재 문제는 만료가 아니라 경로 중첩 차이였습니다.

## 4. 관리자 오프닝과 실제 기기 확인

1. 참가자와 관리자가 같은 Pages 주소로 접속합니다. `?offline=1`은 제거합니다.
2. 등록·배역 배정 후 관리자가 단계표의 **오프닝**을 시작합니다.
3. 각 기기에 영상이 자동으로 나타나 무음 재생됩니다. **소리 켜기**를 누르면 음성이 나옵니다.
4. 영상 대신 오류 안내가 나타나면 표시된 MP4 경로가 저장소에 있는지 확인합니다. 수정 후 영상의 재시도 버튼을 누릅니다.
5. 관리자가1차 수색을 시작하고 다른 기기의 단계·타이머가 함께 바뀌는지 확인합니다.
6. 같은 증거를 두 기기에서 조사해 최초 조사자 한 명만 획득하는지 확인합니다.

원격 iPhone 등에서 소리가 있는 자동재생은 브라우저가 제한할 수 있습니다. 이번 버전은 무음 자동재생 후 별도의 소리 켜기로 처리합니다. 영상이 끝나도 관리자가 다음 단계를 직접 시작하는 기존 진행 방식은 유지됩니다.

실제 GitHub·Firebase 서버는 이번 수정 작업에서 변경하지 않았습니다.

## 공식 자료

1. [GitHub 업로드 방법 및25MiB 제한](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)
2. [GitHub Desktop 저장소 만들기·커밋·게시](https://docs.github.com/en/desktop/overview/creating-your-first-repository-using-github-desktop)
3. [GitHub Pages 게시 소스 설정](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
4. [Firebase 경로별 규칙](https://firebase.google.com/docs/database/security/core-syntax)
