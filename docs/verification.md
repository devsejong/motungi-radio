# 검증 기록과 직접 사용 시험

## 0.2.14 — 2026-11-01

- GitHub v0.2.14 파일 12개 공개 후 익명 다운로드·SHA256 전부 일치. 홈페이지 캡처·다운로드 링크·4개 대상 업데이트 피드를 0.2.14로 갱신. Pages와 공개 화면은 배포 후 확인한다.
- 제품 빌드 소스 `295190b2e61a02938e88b6999b3ea47bceb0ba0b`. 서랍형 채널 목록, 하단 고정 닫기, 목록 내부 스크롤과 간결한 54px 채널 행.
- 프런트 69개·Rust 57개 통과(외부 연결 5개 제외), CPU·패키지 검사 통과. 브라우저 라이트/다크, 펼침/닫힘, 내부 스크롤·긴 제목 확인. 네이티브 창 크기 전환과 실기기 청취·로그인·절전은 이번 배포에서 미검증.
- Mac arm64 앱 공증 `cda5db0a-f1a9-4799-84f6-af33372e2f4e`, DMG `78c0939f-d175-423f-b845-7cdd63478323`. Intel 앱 `847e47b8-8bd6-47aa-8022-081aa32a0475`, DMG `325c3655-6f76-46eb-b6f1-b5d93e64089d`. 모두 Accepted. DMG와 내부 앱의 확인표·Developer ID·hardened runtime·0.2.14·CPU·앱 ID·Gatekeeper 검증 통과.
- Windows CI `41260880913`, Linux CI `41260882828`, Store MSIX CI `41260884491`, Store 실제 설치 smoke `41261309903` 성공. 4개 업데이트 파일 서명·변조 거절 검사 통과. Mac 업데이트 아카이브 AppleDouble 없음.
- Microsoft Store 제출 `1152921505702287562`: 0.2.14.0 패키지 Validated, 변경 내용과 실제 Windows 플레이어 스크린샷 교체 후 **In certification**, 승인 후 자동 게시. MSIX SHA256 `6afb6a286a8d8f42cebe9742a80b6684e894a0899a2a8176263e81c30e2e1a6b`. 기존 0.2.13 게시 완료 확인. 새 Store 버전 공개는 아직 아님.
- 근거 `artifacts/release-0.2.14/`. 홈페이지 캡처는 실제 렌더러와 예시 프로그램 정보이며 네이티브 투명도 합성 화면은 아니다.

## 0.2.13 — 2026-10-27

- GitHub v0.2.13 파일 12개 공개 후 인증 없는 다운로드·SHA256 전부 일치 확인. 다운로드 페이지의 일반 플레이어 라이트/다크 캡처와 설치 링크, 4개 대상 업데이트 피드를 함께 갱신한다.
- Pages `40399578541` 성공, 공개 링크·새 캡처·피드 원본 일치 확인. 실제 Tauri updater가 4,724,817바이트를 다운로드·서명 검증하고 격리 복사본에 0.2.13 설치 성공. 설치 후 버전·서명·공증 확인표 유효. 사용자 설치 앱은 변경하지 않았다.
- 일반 목록과 채널 편집을 분리. 프런트 69개·Rust 57개 통과(외부 연결 5개 제외), CPU 회귀 6개·패키지 검사 통과. 브라우저 드래그·포함 선택·직접 재생·라이트/다크 확인.
- 모든 제품 빌드 소스 `58e082ce77a27b90e0c04005630ff477c0112f5b`.
- Mac arm64 앱 공증 `058763c2-3994-4177-849f-965e75402c8a`, DMG `c3029ec9-651f-4486-ba42-822cfcceb1fb`. Intel 앱 `0f336447-525e-4cb9-a7c7-a39f63a8db17`, DMG `cf8a854a-daca-401d-a7e8-2dc5ed734c99`. 모두 Accepted. 확인표·Developer ID·hardened runtime·버전·CPU·앱 ID·Gatekeeper 검증 통과.
- Windows CI `40396204317`, Linux CI `40396210100`, Store MSIX CI `40396215114`, Store 설치 smoke `40397812885` 성공. 4개 업데이트 파일 Ed25519 서명·변조 거절 검사 통과. Mac 업데이트 아카이브 AppleDouble 없음.
- Microsoft Store 제출 `1152921505702237995`: 0.2.13.0 패키지 Validated, 소개·변경 내용 저장 후 **In certification** 확인. 통과 후 자동 게시. MSIX SHA256 `6ddb6802f2d7a87fcca9971ce33ed45761ab242c14b023197313a098c582f882`. 이전 0.2.12의 게시 완료는 Partner Center에서 확인했다.
- 근거 `artifacts/release-0.2.13/`. Mac·Windows 실기기 청취·로그인·절전은 이번 배포에서 미검증. 홈페이지 캡처는 실제 렌더러와 예시 프로그램 정보이며 네이티브 투명도 합성 캡처가 아니다.

## 0.2.12 — 2026-10-26

- 채널 정렬·이동 포함 설정과 즐겨찾기 제거. 프런트 67개, Rust 57개 통과(외부 연결 5개 제외), CPU 회귀 6개·패키지 검사 통과. 브라우저 드래그·비활성 건너뛰기·직접 선택과 라이트/다크 확인.
- Mac 빌드 소스 `b6ea2825c2e29abe0208c59e215eb80c9b90837e`. Windows/Linux/Store 소스 `2837f023055e65649d7b3c60f55c974fdc5059d8`는 테스트 범위만 수정하며 제품 코드 동일.
- Mac arm64 앱 공증 `b44a02a2-838d-4fb9-9cb2-c18dc8570569`, DMG `58cb79bb-274e-4233-8b00-ddcd9683883f`. Intel 앱 `d259314c-bcbb-4478-8458-7b0f6c159b36`, DMG `481c3882-d012-4a8c-9daa-35d27a59a783`. 모두 Accepted, 확인표·Developer ID·hardened runtime·0.2.12·CPU·앱 ID·Gatekeeper 검증.
- Windows CI `40264144745`, Linux CI `40264146914`(Debian 가상 실행 포함), Store MSIX CI `40264142175`, Store 설치 smoke `40266756412` 성공. Store 제출 패키지는 시험 인증서 미포함.
- GitHub v0.2.12 파일 12개 공개 후 익명 다운로드·SHA256 일치. 4개 업데이트 파일 Ed25519 서명·변조 거절 검사 통과. Mac 업데이트 아카이브 AppleDouble 없음. 근거 `artifacts/release-0.2.12/`.
- Mac·Windows 실기기 청취·로그인·절전은 미검증. Store 심사 완료/공개는 별도 확인한다.
- Pages `40287873622` 성공, 공개 홈페이지 새 캡처·링크 및 피드 4개 대상 일치 확인. 실제 Tauri updater가 4,724,784바이트를 다운로드·서명 검증하고 격리 복사본에 0.2.12 설치 성공. 사용자 설치 앱은 변경하지 않음.
- Microsoft Store 제출 `1152921505702230255`: 0.2.12.0 업로드·Validated·소개/변경 내용 저장·심사 접수 완료. 실제 포털 **In certification**, 통과 후 자동 게시 설정 확인. MSIX SHA256 `7c0d20415283e4de01a6b92f1539a4ad8f7524511aba72e3b1a0bda392b03c88`. 증빙 `artifacts/release-0.2.12/store-submitted.png`.

## 스토어 심사 제출 — 2026-10-18 21:50 KST

- Windows 제품 `9P5RR68464SX`, 제출 `1152921505702161989`: **In certification**, 공개 전. 실제 MBC FM4U 플레이어 스크린샷 등록.
- Mac 앱 `6824204878`, 0.2.9: **심사 대기 중**, 제출 `4d5bb705-2b91-4e9c-99cb-ccb66e557709`. 실제 설치 앱의 EBS FM 재생 화면을 1280×800 배경에 배치하여 등록했다. 동의 화면은 사용하지 않았다.
- Mac 빌드 `217c8910-97d4-4abe-a4e3-83378e022a8a`: VALID / APP_STORE_ELIGIBLE. 제품 소스 `3ba726f`, Universal arm64·x86_64. 개인정보 레이블 게시, 무료 가격·175개 지역·수동 출시 저장. 글로벌 13+, 한국 12+.
- 콘텐츠 권한은 운영자의 “외부 사용 가능, 권한 문제 없음” 확인을 근거로 입력했다. 개별 방송사 허가서를 독립 수집한 것은 아니다. EU DSA·중국 콘텐츠 규제 관련 추가 증빙 요구 여부는 심사 및 공개 단계에서 확인한다.
- 매일 한국 시간 오전 10시 `automation-2`가 두 스토어 심사 상태를 확인하고 승인 시 공개한다. 변경 없는 대기는 반복 알림하지 않는다. 아직 스토어 공개·스토어 설치 검증은 완료하지 않았다.


## 0.2.7 배포 검증 — 2026-10-12

[0.2.7 공개 릴리스](https://github.com/devsejong/motungi-radio/releases/tag/v0.2.7)의 설치파일 5개와 SHA256SUMS.txt를 인증 없이 내려받아 원본 해시 일치를 확인했다. 공개 Mac DMG 두 파일의 공증 확인표도 유효하다. 홈페이지 소스 `8e38d46`, [Pages 38246147565](https://github.com/devsejong/motungi-radio/actions/runs/38246147565) 성공. 공개 링크·스크린샷 6장 로드·CBS 기능 화면을 확인했다.

앱 소스 `a70f96627d376ac715b76e5623facfb4feaf700d`. Mac Dock 숨김, CBS 공식 썸네일, 투명도 방향 수정, 슬림한 채널 조작부와 방향 눈금 애니메이션을 포함한다. 프런트 54개·네이티브 49개·형식 6개 검사와 웹 빌드 통과. CBS 3채널 공식 이미지 추출 검사 및 이미지 HTTP 200 확인. 홈페이지 스크린샷 6장은 같은 UI의 개발 미리보기와 공식 정보 스냅샷을 사용했다. 실제 OS 투명도 합성 캡처가 아니다.

- Mac arm64·x64: 최종 DMG와 내부 앱의 0.2.7 버전·앱 ID·CPU·Developer ID·hardened runtime·공증 확인표·Gatekeeper 통과. `LSUIElement=true` 확인. 공증 arm64 `8dce9419-44fe-43ab-a0fc-ff5d4f12ddcc`, x64 `8c99a5ee-b0cc-42d3-af00-edc60a5dc79a`, 모두 Accepted.
- [Windows 빌드 38244830036](https://github.com/devsejong/motungi-radio/actions/runs/38244830036): 테스트·설치기·내부 AMD64·형식·해시 통과. 미서명.
- [Linux 빌드 38244834475](https://github.com/devsejong/motungi-radio/actions/runs/38244834475): 두 설치 형식과 해시 생성 완료. 최초 실행 검사는 투명도 슬라이더 방향 변경 전 기대값(35% 대신 실제 25%) 때문에 실패했다. 검사 입력만 `857b449`에서 변경했다. 제품 설치파일은 위 소스 그대로이며, [설치본 재검사 38245799292](https://github.com/devsejong/motungi-radio/actions/runs/38245799292)에서 같은 파일의 Debian·AppImage WebKit/IPC·무음 시작·채널 접기·고정·투명도·트레이 설정/정지·EBS 스트리밍 5초와 정지가 통과했다.

Mac·Windows 실제 설치 UI·Dock·청취·로그인·절전·Windows WebView2 미설치 환경은 미검증이다. Linux 가상 환경은 사람의 청취·물리 트레이·Wayland 검증을 대신하지 않는다.


| 설치파일 | SHA256 |
| --- | --- |
| `motungi-radio-0.2.7-linux-x64.AppImage` | `2f6b9f1300a98c418a7c9e2dc970eff028f8fbc8c76282f391288b4de0738fd1` |
| `motungi-radio-0.2.7-linux-x64.deb` | `17052f90128275beae60818ae3a7b294a2a4c8ee3bf41d13f1762acb4490baa3` |
| `motungi-radio-0.2.7-macos-arm64.dmg` | `46f19245a3548790652d82ed29e0ab207793faf1507ec1d3e7fd05e4d9a372df` |
| `motungi-radio-0.2.7-macos-x64.dmg` | `5cd98ee85e899ca13f9efb7ad444f97b5bf792ab87e6a71699268b22c5f68c96` |
| `motungi-radio-0.2.7-windows-x64.exe` | `240fb1873574f998ca7d6d5e80a7a4f39e4fbb5a06db3a4c2b80ade9d24c7679` |

## 0.2.6 공개 시험판 — 2026-10-11

앱 소스 `2e6ee59d8868fb42e38441f074e3906c3aaa94a7`. 라디오 눈금·현재 채널·이전/다음 방송국과 오른쪽 사각 재생 버튼, 슬림한 여백·앱 로고·흰색 Mac 트레이 아이콘을 포함한다. 프런트 53개·네이티브 48개·형식 6개 검사 통과. 실제 앱 코드의 380px UI 미리보기에서 밝은·어두운 화면, 채널 전환·접기, 긴 제목과 채널명 말줄임을 확인했다. 홈페이지 이미지 6장은 같은 미리보기 캡처이며 OS 합성 화면은 아니다.

- Mac arm64·x64: DMG·내부 앱 버전 0.2.6, 앱 ID, CPU, Developer ID, hardened runtime, 공증 확인표, Gatekeeper 통과. 공증 arm64 `5f1d50ba-9f75-4b5e-bf22-191cc6c5c90d`, x64 `6522b3f2-6b56-4417-bf3a-6d0a560b6dcb`, 모두 Accepted.
- [Windows 빌드 38122776584](https://github.com/devsejong/motungi-radio/actions/runs/38122776584): 테스트·설치기·내부 AMD64·형식·해시 통과. 미서명.
- [Linux 빌드 38122778535](https://github.com/devsejong/motungi-radio/actions/runs/38122778535), [설치본 실행 38123121402](https://github.com/devsejong/motungi-radio/actions/runs/38123121402): Debian·AppImage의 WebKit/IPC, 무음 시작, 채널 접기, 고정·투명도·트레이 설정/정지, EBS 스트리밍 5초·정지 통과.

Mac·Windows 실기기 UI·청취·로그인·절전·Windows WebView2 미설치 환경은 미검증. Linux 가상 화면·가상 음원 출력은 사람의 청취·물리 트레이·Wayland 검증을 대신하지 않는다.

[0.2.6 릴리스](https://github.com/devsejong/motungi-radio/releases/tag/v0.2.6)

설치파일 5개와 SHA256SUMS.txt를 인증 없이 내려받아 원본과 해시 일치를 확인했다. 공개 Mac 두 DMG의 공증 확인표도 유효하다. [Pages 38123355025](https://github.com/devsejong/motungi-radio/actions/runs/38123355025)는 홈페이지 소스 `1a9a110`에서 성공했으며 공개 0.2.6 링크·새 이미지 6장·기능 캐러셀 화면을 확인했다.

| 설치파일 | SHA256 |
| --- | --- |
| `motungi-radio-0.2.6-macos-arm64.dmg` | `21d34d2657f08dc15dcf02eb169e8fc0e0b8eab3762dc78bc8e600eee1dabcf2` |
| `motungi-radio-0.2.6-macos-x64.dmg` | `94ac5730fddf0ae4202f445430081b6b359855e6cc65ac8a1ef95d6875a290fd` |
| `motungi-radio-0.2.6-windows-x64.exe` | `24afc791d984d72cd5c74f09451976d09305e0dd6d29ad6b8b067eb10eefb00a` |
| `motungi-radio-0.2.6-linux-x64.deb` | `a28bbe6b86e2c57044d3a9df7f7c100f76da4e7b70ef51036a757e8e1f85d9b8` |
| `motungi-radio-0.2.6-linux-x64.AppImage` | `13cf0be0200a6ac6ac48107bb1526a59c078c41f31daa1c59c93206ea4c5377c` |

## 0.2.5 공개 시험판 — 2026-10-10

앱 빌드 소스 `9ac40d1ea70d7bcad38e739414c5386fbe28909c`. 상단 투명도·압정·설정 톱니바퀴를 한 줄에 배치하고 채널 보기·접기를 플레이어 카드 하단에 통합했다. 별도 미니 스타일은 제거했다. 프런트 53개·네이티브 48개·형식 6개 테스트 통과. 같은 앱 코드의 UI 미리보기에서 밝은·어두운 플레이어·목록 접기·편성표 화면을 다시 캡처했다. OS 합성 캡처는 아니다.

- Mac arm64·x64: 최종 DMG와 내부 앱의 버전 0.2.5·앱 ID·CPU·Developer ID·hardened runtime·공증 확인표·Gatekeeper 통과. 공증 Accepted, issues 없음. arm64 `bc43b59f-141f-4516-8e8e-28e1bbd3e94d`, x64 `c840f726-986d-4500-a6dc-cfa5edd78c7c`.
- [Windows 빌드 38045108709](https://github.com/devsejong/motungi-radio/actions/runs/38045108709): 설치파일 생성·내부 앱 CPU·형식·해시 확인. 미서명.
- [Linux 빌드 38045111781](https://github.com/devsejong/motungi-radio/actions/runs/38045111781): Debian·AppImage 생성, CPU·형식·해시 및 Debian WebKit/IPC·무음 시작·채널 접기·고정·투명도·트레이 설정/정지·설정 검사 통과.

Mac·Windows 실기기 UI·청취·로그인·절전 및 Windows WebView2 미설치 환경은 미검증이다. Linux 가상 화면 검사를 사람의 청취·물리 트레이·로그인·절전·Wayland 검증으로 합산하지 않는다.

[Linux 설치본 실행 38045565423](https://github.com/devsejong/motungi-radio/actions/runs/38045565423)에서 Debian·AppImage의 WebKit/IPC·무음 시작·채널 접기 높이·고정·35% 투명도·트레이 설정/정지·EBS 재생/정지 통과. 실행 검사 소스도 `9ac40d1`.

[0.2.5 공개 릴리스](https://github.com/devsejong/motungi-radio/releases/tag/v0.2.5). 설치파일 5개와 SHA256SUMS.txt의 익명 다운로드·해시 일치를 확인했다. 내려받은 Mac 두 DMG의 공증 확인표도 유효하다. [Pages 38045742549](https://github.com/devsejong/motungi-radio/actions/runs/38045742549)는 홈페이지 소스 `0073dae`에서 성공했으며 공개 링크·새 이미지 6장·화면을 확인했다.

| 설치파일 | SHA256 |
| --- | --- |
| `motungi-radio-0.2.5-linux-x64.AppImage` | `dfa80eb65474393b5a17888b31df63724c85dcd37b4a45c45c55ec7e82c88a8b` |
| `motungi-radio-0.2.5-linux-x64.deb` | `6dfa8020b6daaddb6bf0a94a91e55cb1d1ba9a1ec8d3a9a2077db7d547a7c349` |
| `motungi-radio-0.2.5-macos-arm64.dmg` | `99c34be0b2a6b78a64137622aaa9c4052b673c8f5d1f54127d9cf8ca49068611` |
| `motungi-radio-0.2.5-macos-x64.dmg` | `e67a4c5fe3165d77ea8143d043f2182c0db7d9eaef377a464109636dfcb66053` |
| `motungi-radio-0.2.5-windows-x64.exe` | `8d7e6144147e553bcc4a8276dcd9a5194071351b6da24de7302593037c993320` |

## 0.2.4 공개 시험판 — 2026-10-10

앱 소스 `d0795541f79fbfe5190238fe37d9c668b34e74e4`. 고정 모드 상단 오른쪽의 작은 투명도 슬라이더. 프런트 53개·네이티브 48개·형식 6개 테스트 통과. UI 미리보기에서 기본·미니·라이트·다크·편성표 화면을 캡처하고 키보드 조절·고정 해제 시 불투명 복원을 확인했다. OS 바탕화면 합성 캡처는 아니다.

- Mac arm64·x64: 최종 DMG와 내부 앱의 버전 0.2.4·앱 ID·CPU·Developer ID·hardened runtime·공증 확인표·Gatekeeper 통과. 공증 Accepted, issues 없음. arm64 `21a4c647-d438-42bf-afd0-ca850db323d8`, x64 `3853db03-7dce-4097-9a2a-34942755d507`.
- [Windows 빌드 38037608394](https://github.com/devsejong/motungi-radio/actions/runs/38037608394): 테스트·NSIS·내부 앱 AMD64·형식·해시 통과. 미서명. 실기기 설치·UI·청취·로그인·절전은 미검증.
- [Linux 빌드 38037610609](https://github.com/devsejong/motungi-radio/actions/runs/38037610609): 두 설치 형식 생성, CPU·형식·해시 및 Debian 설치본 WebKit/IPC 검사 통과. [설치본 실행 38038072869](https://github.com/devsejong/motungi-radio/actions/runs/38038072869)에서 Debian·AppImage의 WebKit/IPC·무음 시작·미니 높이·고정·35% 투명도·고정 해제·트레이 설정/정지·EBS 재생/정지 통과. 가상 화면·가상 음원 출력이며 사람의 청취·물리 트레이·로그인·절전·Wayland는 미검증. 실행 검사 소스도 `d079554`.

[0.2.4 공개 릴리스](https://github.com/devsejong/motungi-radio/releases/tag/v0.2.4)

| 설치파일 | SHA256 |
| --- | --- |
| `motungi-radio-0.2.4-macos-arm64.dmg` | `2c4e5a9957999d98a3565f5438601b542ced0ffe1ece0c1e0282463656da06aa` |
| `motungi-radio-0.2.4-macos-x64.dmg` | `f5e81a96ffc8064b74ccd1080b2c48bbd9809f3b9217856f8b7cdcbbc0288ea3` |
| `motungi-radio-0.2.4-windows-x64.exe` | `12cd40ba4128c9014c133097a9a891d834c1b7423be0a7ed869c1a8ad53ef4c5` |
| `motungi-radio-0.2.4-linux-x64.deb` | `920e7f3a38cec260278cc53c79c6693762543d21b51442d7d67b1df71da5f025` |
| `motungi-radio-0.2.4-linux-x64.AppImage` | `c9b3578760a4ecfb856b7438902668034e2338ab5492e08a917a403c100c1d6e` |

공개 설치파일 5개를 인증 없이 내려받아 통합 SHA256SUMS.txt 및 원본과 대조했다. Mac 다운로드 사본의 공증 확인표도 확인했다. Mac 실기기 UI·청취·로그인·절전 및 Intel 실행은 미검증이다.

## 0.2.3 공개 시험판 — 2026-10-10

앱 소스 `5fd59318b3d4e0f01bff387f24b05fc9393cf196`. 프런트 53개·네이티브 48개·형식 6개 테스트 통과. KBS 6개 채널의 현재 썸네일을 실제 조회했다.

- Mac arm64·x64: 최종 DMG와 내부 앱의 버전·앱 ID·CPU·Developer ID·hardened runtime·공증 확인표·Gatekeeper 통과. 두 공증은 Accepted, issues 없음. arm64 `08f15043-3411-43db-8741-5e53eeb7c783`, x64 `7de13ba2-5c34-4225-b34b-5c09105c6fdc`.
- [Windows 빌드 38033325610](https://github.com/devsejong/motungi-radio/actions/runs/38033325610): 테스트·NSIS·내부 앱 AMD64·형식·해시 통과. 설치기는 미서명이며 실기기 설치·새 UI 동작은 미검증.
- [Linux 빌드 38033327182](https://github.com/devsejong/motungi-radio/actions/runs/38033327182), [설치본 실행 38033693221](https://github.com/devsejong/motungi-radio/actions/runs/38033693221): 두 설치 형식의 WebKit/IPC, 무음 시작, 미니 높이, 고정·35% 투명도 명령·해제, 트레이 설정·정지 이벤트, EBS 재생·정지 통과. 가상 화면·가상 음원 출력이며 사람의 청취·물리 트레이·로그인·절전·Wayland는 미검증. 실행 검사 소스는 `63bd71a`이며 앱 소스와 구분한다.
- 인터넷에서 익명으로 받은 5개 설치파일과 통합 체크섬의 SHA256 일치. Mac 다운로드 사본의 공증 확인표도 확인했다. Mac 실제 UI·청취·로그인·절전과 Intel 실행은 미검증.

[0.2.3 공개 릴리스](https://github.com/devsejong/motungi-radio/releases/tag/v0.2.3)

| 설치파일 | SHA256 |
| --- | --- |
| `motungi-radio-0.2.3-macos-arm64.dmg` | `c3d271ac39296cd273015839c082ec235ced1a35770e7f25bef9b83e24ce9809` |
| `motungi-radio-0.2.3-macos-x64.dmg` | `3d6d39516092aa0fac22da3a20c4cb99ac70628cf38b58ad8d2f6b7892927f44` |
| `motungi-radio-0.2.3-windows-x64.exe` | `fa68d02eb9b125ac31bd5e4aef31bba093bec85c97babf77feeb7c095425e53d` |
| `motungi-radio-0.2.3-linux-x64.deb` | `021e4b88886390188e9a12fea07fa130972c5b45e7ba0b09684a064c099fd5bb` |
| `motungi-radio-0.2.3-linux-x64.AppImage` | `943c3ab167a927d7447da6f95baafb74eea5ad5d9e1895195014828c93cae574` |

## Mac 0.2.2 서명 빌드 — 2026-10-10

앱 소스 `76dc1ab`, 공증·검증 스크립트 `46eac92`. Apple Silicon·Intel DMG 생성 완료. 최종 이미지 내부의 0.2.2 버전·앱 ID·대상 CPU·Developer ID Application 서명·hardened runtime와 서명 무결성을 확인했다. 프런트 50개·네이티브 46개·설치파일 형식 테스트 6개 통과.

Apple Silicon·Intel 모두 `Accepted`, 공증 로그의 issues 없음. 제출 ID: Apple Silicon `ea3e2011-481b-4d59-93f9-f7dc3b41f82a`, Intel `d5ad84cb-52a8-4a17-b703-884fb5adcae2`. 두 DMG의 공증 확인표, 체크섬, 서명과 최종 이미지 안의 앱 서명·Gatekeeper 평가가 모두 통과했다. Gatekeeper 원천은 `Notarized Developer ID`다. 실제 설치·청취·로그인·절전과 Intel Mac 실행은 별도 미검증이다.

[공개 릴리스](https://github.com/devsejong/motungi-radio/releases/tag/v0.2.2). 최종 파일 해시:

| 설치파일 | SHA256 |
| --- | --- |
| `motungi-radio-0.2.2-macos-arm64.dmg` | `f5a1013a4f2f939a60d678180092db948484830c1d023b5eecef9202d6117326` |
| `motungi-radio-0.2.2-macos-x64.dmg` | `9c873bdfe5bb8a87320fc08d995d13749deef8e6e19f612a1af2c1d1a4494dab` |

Windows 0.2.1과 Linux 시험판은 기존 파일을 유지한다.

## Linux 시험판 — 2026-10-10

소스 `165b9c0002c1d9142a8b905e2b5f3907a8abed99`. [빌드 37995950870](https://github.com/devsejong/motungi-radio/actions/runs/37995950870), [실행 37996892130](https://github.com/devsejong/motungi-radio/actions/runs/37996892130) 성공. 프런트 50개·네이티브 46개·형식 6개 통과. Ubuntu 22.04의 실제 WebKit/IPC, `.deb` 설치 및 AppImage 실행, 무음 시작, 미니 200–360px, 설정 640px·음량 100%, EBS FM playing 이벤트·5초 유지·정지 후 무재생을 확인했다. 가상 화면과 가상 음원 출력이며 사람의 청취, 물리 트레이·로그인·절전·Wayland는 미검증이다.

| 설치파일 | SHA256 |
| --- | --- |
| `motungi-radio-0.2.1-linux-x64.deb` | `fd8b8e74e42ebbfff3fc2e828ca1a4cceaefd1fc54a4578aaa1d6a8888bc1beb` |
| `motungi-radio-0.2.1-linux-x64.AppImage` | `0cfa1490d13039779f0e8fd72762da3a1a39b2bed713671eff529af956268ed8` |

[공개 다운로드](https://github.com/devsejong/motungi-radio/releases/tag/v0.2.1-linux.1). 내부 패키지명 `motungi-radio`, 앱 목록 이름 모퉁이 라디오, amd64 ELF와 다운로드 사본 해시를 확인했다.

## 공개 시험판 0.2.1 — 2026-10-09

[GitHub Releases](https://github.com/devsejong/motungi-radio/releases/tag/v0.2.1)에 Mac 2종·Windows x64 설치파일과 통합 SHA256SUMS.txt를 공개했다. 소스는 `a0bab4ea21869a072571f954872d39874f5c7b0c`, 빌드는 [Actions 37927624430](https://github.com/devsejong/motungi-radio/actions/runs/37927624430)이며 세 작업 모두 성공했다.

각 대상 프런트 50개·네이티브 46개·패키지 5개 테스트 통과(네이티브 실시간 검사 3개 제외). 실제 바이너리 CPU·설치파일 형식·SHA256 검사 통과. 두 DMG는 로컬에서 체크섬·내부 앱 ID·버전·CPU 및 ad-hoc 서명 무결성도 확인했다. 공개 파일 4개를 인증 없이 HTTP 200으로 내려받아 원본 해시와 대조했다.

| 공개 파일 | SHA256 |
| --- | --- |
| `motungi-radio-0.2.1-macos-arm64.dmg` | `500644000f40ceb65319b60e6857d662f7549db14f5534a585c2c69f249e125f` |
| `motungi-radio-0.2.1-macos-x64.dmg` | `2b9947b1686e1c2ff81b360b33e3e1885afac047322797b1518c523738e615ab` |
| `motungi-radio-0.2.1-windows-x64.exe` | `c8e5bc2ab1df5c5e1f378abc5ef5cc303c3b320979b4f279e0e0ace0a2821163` |

Mac 공증·Windows 코드 서명은 하지 않았다. 이번 설치본의 실기기 설치·청취, 로그인·절전·업데이트 시험은 미검증이다. 방송사 조건과 명시적인 제3자 앱 허가는 별개로 기록한다.

## 이전 0.2.1 설치파일 — 2026-10-09

빌드 소스는 `4b7a65f024829fe4a669c04b7497205cc7fb12c4` (`codex/player-redesign`)이다. 플레이어 제목·다음 프로그램, 중앙 재생/정지와 이전·다음 채널, 압정 고정·드래그, 날짜별 편성표, 기본 음량 100%, Retina 메뉴바 아래 배치 수정을 포함한다. 이후 문서 커밋은 빌드 소스가 아니다.

Mac arm64·x64 DMG는 로컬 릴리스 빌드와 DMG 체크섬 검사를 통과했다. 최종 DMG를 읽기 전용으로 마운트하여 내부 앱 버전 0.2.1, 실제 대상 CPU, `codesign --verify --deep --strict` 무결성 검사를 확인했다. ad-hoc 서명이며 Developer ID 서명·공증은 받지 않았다.

Windows x64 NSIS EXE는 [GitHub Actions 37914476217](https://github.com/devsejong/motungi-radio/actions/runs/37914476217)에서 같은 소스로 생성했다. 프런트 44개·네이티브 46개·패키지 5개 테스트, 실제 앱 AMD64 PE32+ 검사, EXE 형식·SHA256 검사와 artifact 업로드가 통과했다. 실시간 네이티브 테스트 3개는 제외됐다. 로컬 다운로드 사본의 EXE 형식과 SHA256도 확인했다. Windows는 코드 서명 전이다. 이 실행의 Mac 단계는 생략됐고 위 Mac 파일은 로컬 빌드 결과다.

| 대상 | 파일 | SHA256 |
| --- | --- | --- |
| macos-arm64 | `radiokorea-0.2.1-macos-arm64.dmg` | `2d5c30109f0c2e24258531989518fc04d373fff22c9f9d0be7f51f40ea990351` |
| macos-x64 | `radiokorea-0.2.1-macos-x64.dmg` | `43270ca9d542927ecfb42dec894837611d40de7929112bf093a93bb57419dd4e` |
| windows-x64 | `radiokorea-0.2.1-windows-x64.exe` | `6e8629a0cebf652672013134213aa90498b265eef362c989efeace9acf3c8913` |

파일은 `release-artifacts/0.2.1-4b7a65f/`의 대상별 폴더에 보관한다. 루트의 `build-provenance.json`과 `SHA256SUMS.txt`에 소스·빌드·체크섬을 기록했다. Windows [artifact 11608819910](https://github.com/devsejong/motungi-radio/actions/runs/37914476217/artifacts/11608819910)은 접근 권한이 필요하며 보관 기간은 14일이다. 소스 브랜치를 푸시했으며 공개 Releases 발행이나 저장소 공개 전환은 하지 않았다.

이번 0.2.1 DMG/EXE로 실제 설치·청취·업그레이드·로그인·절전 시험은 수행하지 않았다. 로컬 Mac에 설치된 0.2.0 앱은 `a9df600` 기준으로 이번 설치본과 같은 기능 코드를 포함하지만 버전 메타데이터와 설치파일은 다르다. Intel Mac 및 Windows 11 Intel의 실기기 시험은 사용자 확인이 남아 있다.

## 0.2.0 설치파일 — 2026-10-09

빌드 소스는 `162aa69393dbe7d879fc21e4f0753ac3d8a6f28c` (`codex/player-redesign`)이다. 아래 설치파일은 같은 소스의 UI 개편을 포함한다. 이후 문서 커밋은 설치파일의 빌드 소스가 아니다.

Mac arm64·x64 DMG는 로컬 릴리스 빌드, DMG 체크섬, 읽기 전용으로 마운트한 내부 앱의 0.2.0 버전·실제 CPU 아키텍처·서명 무결성 검사를 통과했다. Mac은 ad-hoc 서명이며 Developer ID 서명·공증은 받지 않았다.

Windows x64 NSIS EXE는 [GitHub Actions 37904725710](https://github.com/devsejong/motungi-radio/actions/runs/37904725710)에서 성공했다. 프런트 40개·네이티브 43개·패키지 5개 테스트, 실제 앱 AMD64 PE32+ 검사, EXE 형식·SHA256 검사와 artifact 업로드를 통과했다. 네이티브 실시간 테스트 3개는 기본 실행에서 제외됐다. 다운로드 사본의 SHA256도 일치한다. Windows는 코드 서명 전이다. 같은 실행의 Mac 단계는 생략됐으며 위 Mac 파일은 로컬 빌드 결과다.

| 대상 | 파일 | SHA256 |
| --- | --- | --- |
| macos-arm64 | `radiokorea-0.2.0-macos-arm64.dmg` | `176d5b4dfa1dcb7447a4e9bd45f6a68918a651c7b20088b17f236a29826d1e11` |
| macos-x64 | `radiokorea-0.2.0-macos-x64.dmg` | `debb1f18c0ddabf0e0eafedada97e781f1cd012d9112be010c3131997bfc5767` |
| windows-x64 | `radiokorea-0.2.0-windows-x64.exe` | `752f30ddd0739c25614532f09dd4d7b5dcca64ced08471e9f81d4f02e1a353ba` |

파일은 `release-artifacts/0.2.0-162aa69/`의 대상별 폴더에 보관한다. 루트의 `build-provenance.json`에 빌드 근거, `SHA256SUMS.txt`에 전체 체크섬을 기록했다. Windows artifact ID는 `11604147942`이며 GitHub 접근 권한이 필요하고 보관 기간은 14일이다. 공개 Releases 발행이나 저장소 공개 전환은 하지 않았다.

실제 설치·청취, 0.1.0에서의 설정 유지, 로그인 자동 실행·절전 복귀는 이 빌드에서 미검증이다. 아래 현재 버전 시험표에 Mac 및 Windows 11 Intel 결과를 별도로 기록한다.

## 0.1.0 이전 기록

기준일: 2026-10-09. 실제 설치·화면·청취 및 공개 배포 검증은 아직 완료되지 않았다. 앱 코드 `91ffeb4` 기준 자동 테스트 87개가 통과했다. Mac 잠금 상태로 화면 검증이 막힌 뒤 사용자가 “나중에 직접 화면 확인”을 선택했다. Windows 11 Intel 시험 PC는 연결되지 않았다. 아래 미검증 항목은 성공으로 판정하지 않는다.

## 0.1.0 이전 시험 판정

| 구분 | 확인된 근거 | 판정과 한계 |
| --- | --- | --- |
| 구현 | 메뉴 막대/트레이, 채널 전환, 프로그램 표시, 설정 저장, 자동 실행 설정 코드 연결 | 구현됨. OS에서의 실제 동작은 별도 확인 필요 |
| 프런트엔드 | `91ffeb4`에서 `npm run verify`: 테스트 43개 및 프로덕션 빌드, 종료 코드 0 | 자동 검증 통과. 지연된 TBN 설정 저장이 나중 채널 선택을 덮어쓰는 회귀 수정 포함 |
| 네이티브 | `91ffeb4`에서 `cargo test --locked --offline --manifest-path src-tauri/Cargo.toml`: 39개 통과, 실시간 원천 테스트 2개 제외, 종료 코드 0 | 자동 검증 통과. 실시간 테스트를 통과로 합산하지 않음 |
| 설치파일 검사 코드 | `91ffeb4`에서 `node --test scripts/check-binary-architecture.test.mjs`: 5개 통과, 종료 코드 0. `node scripts/check-package.mjs` 메타데이터 사전 검증 종료 코드 0 | 자동 검증 통과. 파일 검사 코드의 테스트이며 설치파일 자체의 성공 판정은 별도 |
| 스트림 원천 | 32개 채널의 실제 네이티브 resolver 및 HLS/미디어 바이트 응답 성공 | 네트워크 응답 확인. 소리 출력, 디코딩 지속성, 30분 재생을 확인한 것은 아님 |
| 프로그램 원천 | 18개 현재 프로그램 확인, 14개 확인 불가 | TBN 13개는 네이티브 TLS 요청 시간 초과, KBS 한민족은 응답 채널 불일치. 확인 불가를 정상 프로그램 정보로 간주하지 않음 |
| 0.1.0 설치파일 | `91ffeb4` 기준 Mac arm64·Intel DMG 생성·내부 바이너리·서명 일관성·해시 검증 통과. Windows x64 EXE도 [빌드 성공](https://github.com/devsejong/motungi-radio/actions/runs/37873884953), 실제 앱 AMD64 PE32+·설치파일 형식·해시 확인 | 파일별 결과는 아래 표에 기록. 실제 설치·화면·청취를 확인한 것은 아님. 이전 취소 실행은 성공 근거에서 제외 |
| 실기기 | 사용자 직접 확인 예정 | Mac 화면·청취 및 Windows 설치·실행 미검증 |
| 공개 배포 | [GitHub 저장소](https://github.com/devsejong/motungi-radio)는 비공개 검증 단계. MBC 재링크 고지 관련 공개 조건 미해결 | 공개 릴리스 완료 아님. 저장소·빌드 기록 접근에는 권한 필요 |

자동 테스트·원천 응답·파일 검사는 실제 설치·청취의 증거와 구분한다. 원천 확인 결과는 이후 방송사 변경으로 달라질 수 있다.

## 현재 버전 설치 후 10분 시험

자신의 CPU에 맞는 시험 파일과 SHA256SUMS.txt를 함께 확인한다. Mac은 DMG에서 앱을 Applications로 복사하고, Windows는 EXE를 실행해 현재 사용자 범위에 설치한다. Mac의 ad-hoc 서명은 Developer ID 공증이 아니며 Windows는 미서명 시험본이다. 출처와 해시를 확인하고 해당 앱에 대한 OS 실행 허용 여부를 판단한다. 전역 보안 기능을 끄지 않는다. 첫 시험 전에 스피커 또는 이어폰의 출력 상태를 확인한다.

| 순서 | 할 일 | 기대 결과 | 결과 |
| --- | --- | --- | --- |
| 1 | 설치 후 실행하고 메뉴 막대/트레이 아이콘 누르기 | 작은 창이 열리고 자동으로 소리가 나지 않음. 새 설정의 처음 음량은 100% | 미검증 |
| 2 | MBC·KBS·SBS 등 서로 다른 방송 선택 | 선택한 방송 하나만 들리고 현재 프로그램 또는 확인 불가 표시 | 미검증 |
| 3 | 여러 채널을 빠르게 선택한 뒤 정지 누르기 | 마지막 선택만 재생하고 정지 뒤 늦게 소리가 시작되지 않음 | 미검증 |
| 4 | 재생 중 창 숨기기, 다시 열기, 음량 바꾸기 | 숨겨도 재생 유지. 다시 열어 상태 확인과 음량 변경 가능 | 미검증 |
| 5 | 즐겨찾기 추가 후 앱에서 완전히 종료하고 재실행 | 즐겨찾기·음량·마지막 채널 복원, 재생은 시작하지 않음 | 미검증 |
| 6 | TBN 경인을 즐겨찾기에 등록 | 전체 목록에는 경인만 표시, 즐겨찾기 탭에 경인 표시 | 미검증 |
| 7 | 설정에서 라이트·다크·시스템 테마 및 음량 변경 | 테마 적용, 음량·음소거가 설정에서 명확히 표시 | 미검증 |
| 8 | 재생 중 미니 모드·편성표·설정 전환 | 재생 유지, 현재 채널 및 다음 편성 또는 공식 페이지 안내 확인 | 미검증 |

문제가 있으면 운영체제/CPU, 설치파일 이름과 버전, 채널, 한국시간, 수행한 동작, 화면 표시, 실제 들린 소리를 함께 기록한다. 토큰이 붙은 스트림 주소나 개인 정보는 공유하지 않는다.

## 상세 실기기 검증표

각 항목을 Mac과 Windows에서 따로 기록한다. `통과/실패/미검증`과 관찰 시각·내용을 적고, 실패 시 같은 시각의 공식 방송사 플레이어 상태를 함께 확인한다.

| 항목 | 시험 방법과 통과 기준 | Mac | Windows 11 Intel |
| --- | --- | --- | --- |
| 설치와 최초 실행 | 실제 배포 파일 설치, 보안 경고 및 첫 실행 경로 기록. 메뉴 막대/트레이에서 창 열기 | 미검증 | 미검증 |
| 30분 실제 청취 | 채널·시작/끝 한국시간 기록. 스피커로 30분 청취하며 중복 재생·예상치 않은 정지 없는지 확인. 대표 채널을 선택해 기록 | 미검증 | 미검증 |
| 전환 경쟁 | A→B→C 빠른 선택을 반복. 마지막 C만 들리고 A/B로 되돌아가지 않음 | 미검증 | 미검증 |
| 정지 취소 | 연결 중·재생 중 각각 정지. 20초 이상 기다려도 늦은 소리 없음. 다시 재생은 수동으로 가능 | 미검증 | 미검증 |
| 창 숨김과 종료 | 숨김/포커스 이동/닫기 후 재생 유지. 아이콘으로 복원. 명시적 앱 종료 후 소리와 프로세스 종료 | 미검증 | 미검증 |
| 음량 | 0·중간·100%에서 출력 반영, 드래그 중 끊김 없음. 재실행 후 저장값 복원 | 미검증 | 미검증 |
| 즐겨찾기와 마지막 채널 | 추가·제거 및 재실행 후 복원. 마지막 선택만 표시하고 무음으로 시작 | 미검증 | 미검증 |
| TBN 경인 | 경인만 한 줄 표시. 이전 버전의 다른 지역 즐겨찾기는 목록에 노출하지 않음 | 미검증 | 미검증 |
| 자동 실행 켜기 | 설정 켠 뒤 실제 로그아웃/로그인. 아이콘만 시작하고 창·소리 자동 시작 없음. OS 등록 상태와 앱 표시 일치 | 미검증 | 미검증 |
| 자동 실행 끄기 | 끈 뒤 실제 로그아웃/로그인 시 앱 시작하지 않음. OS에서 직접 상태를 바꾼 뒤 앱 표시도 실제 상태 반영 | 미검증 | 미검증 |
| 자동 실행 등록 실패 | 등록 실패가 발생하면 성공 안내 대신 오류가 표시되는지 확인. OS 실제 상태와 비교하고 설정 창을 다시 열어 재조회 | 미검증 | 미검증 |
| 절전 복귀 | 짧은 절전과 긴 절전을 각각 시험. 재생 상태에서 복귀 후 단일 재생 복구. 정지 상태에서는 복귀해도 무음 | 미검증 | 미검증 |
| 네트워크 복구 | 연결 해제 시 영구 로딩 없이 오류 표시. 재생 의도가 있으면 연결 복구 시 재시도. 정지 뒤 연결 복구해도 무음 | 미검증 | 미검증 |
| 중복 실행 | 재생 중 앱을 다시 실행. 프로세스/음원 중복 없이 기존 창 표시 | 미검증 | 미검증 |
| 프로그램 정확성 | 같은 시각 공식 편성표/현재 방송과 채널·제목·시작/종료 비교. 한국시간, 편성표 기준 표시, 시간 경계 전후 갱신 확인 | 미검증 | 미검증 |
| 정보 실패 독립성 | 확인 불가 채널에서도 음원 재생 가능. 정보 실패 시 이전 프로그램을 현재 방송처럼 계속 표시하지 않음 | 미검증 | 미검증 |
| 출력 장치 전환 | 스피커↔이어폰 전환 시 재생/볼륨 상태 확인 | 미검증 | 미검증 |
| 업데이트와 삭제 | 이전 버전 위 설치 후 설정 유지. 자동 실행 끈 뒤 제거하고 재로그인 시 잔여 자동 실행 없음 | 미검증 | 미검증 |

절전 복귀는 macOS의 `NSWorkspaceDidWake`와 Windows의 `PowerRegisterSuspendResume` 알림으로 처리하도록 구현했다. 타이머 간격으로 절전을 추정하던 방식은 제거했다. 실제 기기의 짧은·긴 절전 복귀와 네트워크 복구는 여전히 미검증이며, 구현이나 자동 테스트만으로 정상 복구를 보장하지 않는다.

## 채널별 실제 청취 기록

Mac과 Windows에서 아래 20개 채널을 각각 선택해 짧게 실제 소리를 듣고 결과를 기록한다. MBC 표준FM·FM4U·올댓뮤직도 각각 확인하며 한 채널 성공으로 나머지를 대신하지 않는다. 채널명과 실제 방송이 일치하는지 확인하고 `통과/실패`, 한국시간, 관찰 내용을 적는다. 위의 대표 채널 30분 시험은 이 채널별 확인과 별개다.

| 채널 ID | 방송 | Mac 실제 청취 | Windows 11 Intel 실제 청취 |
| --- | --- | --- | --- |
| mbc-sfm | MBC 표준FM | 미검증 | 미검증 |
| mbc-mfm | MBC FM4U | 미검증 | 미검증 |
| mbc-chm | MBC 올댓뮤직 | 미검증 | 미검증 |
| kbs-21 | KBS 1Radio | 미검증 | 미검증 |
| kbs-22 | KBS HappyFM | 미검증 | 미검증 |
| kbs-23 | KBS 사랑의소리 | 미검증 | 미검증 |
| kbs-24 | KBS ClassicFM | 미검증 | 미검증 |
| kbs-25 | KBS CoolFM | 미검증 | 미검증 |
| kbs-26 | KBS 한민족방송 | 미검증 | 미검증 |
| sbs-powerpc | SBS 파워FM | 미검증 | 미검증 |
| sbs-lovepc | SBS 러브FM | 미검증 | 미검증 |
| cpbc-seoul | cpbc 가톨릭평화방송 | 미검증 | 미검증 |
| ebs-fm | EBS FM | 미검증 | 미검증 |
| cbs-standard | CBS 표준FM | 미검증 | 미검증 |
| cbs-music | CBS 음악FM | 미검증 | 미검증 |
| cbs-joy4u | CBS JOY4U | 미검증 | 미검증 |
| bbs-seoul | BBS 불교방송 | 미검증 | 미검증 |
| febc-seoul | FEBC 서울극동방송 | 미검증 | 미검증 |
| wbs-seoul | WBS 원음방송 | 미검증 | 미검증 |
| tbn-gyeongin | TBN 경인 | 미검증 | 미검증 |

## 환경과 설치파일 증거

| 대상 | 목표 최소 환경 | 확보된 실기기 결과 |
| --- | --- | --- |
| Mac arm64 | macOS 13 이상 Apple Silicon | 개발 호스트 macOS 27.0.1. 실제 앱 화면·청취 미검증, macOS 13 미시험 |
| Mac x64 | macOS 13 이상 Intel | Intel 실기기와 최소 OS 모두 미시험. 크로스 빌드는 실행 검증을 대신하지 않음 |
| Windows x64 | Windows 10/11 x64 | 사용자 Windows 11 Intel PC는 존재하나 미연결·미시험. Windows 10 및 WebView2 미설치 환경 미시험 |

| 0.1.0 이전 시험 배포본 | 소스 commit | 파일명 / SHA256 | 빌드·형식 검증 | 실제 설치 |
| --- | --- | --- | --- | --- |
| Mac arm64 | `91ffeb4` | `macos-arm64/radiokorea-0.1.0-macos-arm64.dmg`<br>SHA256: `c9a09382a5fb0873e5cff6804684cf87d6ccfe48b6948188d5dfa53e2bdda5a3` | 빌드·DMG·arm64 바이너리·서명 일관성·해시 검사 종료 코드 0 | 미검증 |
| Mac x64 | `91ffeb4` | `macos-x64/radiokorea-0.1.0-macos-x64.dmg`<br>SHA256: `c7a25ff95a6025e488caa8ca6a60cea497c13ddddb0f9c54dce36358413f14cf` | 빌드·DMG·x86_64 바이너리·서명 일관성·해시 검사 종료 코드 0 | 미검증 |
| Windows x64 | `91ffeb4` | `radiokorea-0.1.0-windows-x64.exe` / `44b51e0d2f3f1767d3773002c8a0dbe9866e1ad3c654913fc3e8e45fcb168222` | Windows 테스트 43+39+5개·EXE 생성·실제 앱 AMD64 PE32+·설치파일 형식·해시 검사 통과. 다운로드 사본 SHA256도 동일 | 미검증 |

Mac 두 파일은 저장소의 `release-artifacts/0.1.0-91ffeb4/` 아래 각 하위 폴더에 보관한다. 각 대상에 `CI=true npm run tauri -- build --target aarch64-apple-darwin --bundles dmg` 또는 `--target x86_64-apple-darwin`을 실행해 종료 코드 0을 확인했다. `package-artifacts.mjs`의 실제 바이너리 아키텍처·DMG 헤더·SHA256 검사, `hdiutil verify`의 VALID 결과, 읽기 전용 마운트한 내부 앱의 `codesign --verify --deep --strict`, `file`의 arm64 또는 x86_64 확인, 마운트 해제가 모두 종료 코드 0이었다. 앱 UI를 실행하거나 소리를 청취한 검증은 아니다.

Mac은 ad-hoc 서명이며 Developer ID 서명/공증이 아니다. Windows는 코드 서명하지 않았다. 형식·해시 검증은 게시자 신원, 설치 성공, 실제 청취의 증거가 아니다.

공식 방송사 원천을 직접 사용하며 원천 응답 성공은 제3자 배포 허가가 아니다. MBC 공개 조건 해결, 직접 사용 결과와 최종 사용자 확인이 남아 있으므로 전체 검증 완료 또는 공개 배포 완료로 판정하지 않는다.

Windows 파일은 `release-artifacts/0.1.0-91ffeb4/windows-x64/`에 보관했다. GitHub 실행 37873884953의 Windows 작업은 성공이며, 같은 실행의 Mac 작업은 플랫폼 선택 때문에 생략됐다. Mac 두 파일은 별도 로컬 빌드 결과다. Windows 설치기 자체가 x86 형식이어도 내부 앱은 검증한 x64 대상이다.

## 0.2.8 (2026-10-13)

- 제품 소스: `427bfc589389fab2ccf19bb5ff655fa4de487957`. 이후 홈페이지·문서 커밋은 제품 코드와 구분한다.
- 프런트 59개, Rust direct 50개(외부 실시간 5개 제외), 배포 경로 3개, CPU 6개 검사 통과. GitHub 배포 경로 분리 검사 `38395056599` 통과.
- Mac arm64 공증 `86b97684-30a2-4dda-a8bb-5e90b93fbe83`, x64 `31aca38d-4cea-492e-bdad-f78be5e9bfa6`: Accepted. 두 DMG·내부 앱의 Developer ID/hardened runtime/버전/ID/CPU/Gatekeeper 확인.
- Mac 업데이트 tarball은 공증된 앱에 확인표를 첨부한 뒤 생성했다. 추출 후에도 codesign·stapler·Gatekeeper 통과. 실제 공개키 서명 검증과 변조 거부 확인.
- Windows x64 Actions `38395048578`, Linux x64 Actions `38395052335` 성공. Windows는 Authenticode 미서명. Linux는 설치·가상 화면/실제 IPC 스모크 검사까지 통과했으며 이 실행에서 실제 청취·로그인·절전은 확인하지 않았다.
- UI 눈금은 매번 다른 위치에서 정지하며 작은/큰 눈금 위치가 일치하고 정지 후 유지됨을 브라우저에서 확인.
- 로컬 통계 동의/해제·재시작 저장을 시험했고 사용자가 PostHog 수신을 확인했다. 90일 보관은 운영 정책이며 프로젝트 자동 삭제 설정은 미검증이다.
- 공개 자산 12개를 인증 없이 내려받아 원본 SHA256 일치를 확인했다. Pages 실행 `38397228405` 성공, 실제 페이지의 0.2.8 링크와 공개 latest.json 일치 확인.
- Mac arm64 실제 앱 내 업그레이드: 로컬 0.2.7 기반 업데이터 시험본에서 공개 피드의 0.2.8을 받아 버튼 실행으로 설치·재시작했다. 설치 경로 /Applications/모퉁이 라디오.app의 버전 0.2.8, Developer ID/공증/Gatekeeper 유지 확인. About 0.2.8·최신 버전 표시, 무음 시작, MBC 마지막 채널·CBS 즐겨찾기·음량 100·통계 꺼짐 유지 확인. 공개 0.2.7에는 업데이터가 없으므로 일반 사용자는 첫 수동 설치가 필요하다.
- Windows/Intel/Linux의 실제 앱 교체, 실제 스피커 청취·로그인·절전은 미검증이다.

## 0.2.9 (2026-10-18)

- 제품 소스: e9dadf0ef662c4a94b4a63c080cc2ac12914dd48.
- 프런트 61개, Rust 55개(실시간 외부 검사 5개 제외), 배포 경로/CPU 검사 9개 통과.
- Mac arm64 공증: 2c565ad3-d4df-4e5d-92b7-721853c478ab Accepted.
- Mac Intel 공증: 9588dab9-a5f7-4b8c-ae63-73b2423ad0fb Accepted.
- 두 DMG 무결성·서명·확인표·Gatekeeper, 읽기 전용 내부 앱 버전 0.2.9·앱 ID 검사 통과.
- Mac 업데이트용 앱 자체 확인표 첨부, tar.gz의 버전 서명과 변조 거부 확인.
- 로컬 arm64 0.2.9 설치·실행 및 기존 안내 완료/즐겨찾기 상태 유지 확인. 첫 실행 재생은 정지 상태였다.
- Windows·Intel·Linux 실기기 청취·로그인·절전과 이번 버전 앱 내 업그레이드 실기기 검증은 별도 필요하다.

- Windows Actions `39104154927`, Linux `39104157344`, 배포 경로 분리 `39104159348` 성공. Linux 두 설치 형식의 가상 화면·IPC 스모크 통과. CI 설치파일 SHA256 일치 확인.
- 네 플랫폼 업데이트 파일의 공개키 서명 및 변조 거부 확인. Windows Authenticode는 미서명이다.
- 공개 자산 12개를 인증 없이 다운로드해 SHA256 일치를 확인했다. Pages 실행 `39105341103` 성공, 공개 업데이트 피드 0.2.9 확인. 브라우저에서 소개→기능→다운로드 순서 확인 후 기존 CSS 캐시 갱신을 위해 스타일 버전도 변경했다.

## 2026-10-18 스토어 준비 — 미제출

- Windows 제품 소스 `8d278ab5f17e703b0aa762778b73920976e79725`, [MSIX 빌드 39124192804](https://github.com/devsejong/motungi-radio/actions/runs/39124192804) 성공. MakeAppx·AMD64·내용 검사 통과. 미서명 원본 SHA256 `8e9c8be766cbdbb6fe9cf3dd92eb111d8c0c375ab9fba435cea0994d182b4485`. Partner Center 0.2.9.0 X64 Validated 확인.
- [Windows 설치 실행 39125518142](https://github.com/devsejong/motungi-radio/actions/runs/39125518142): 같은 MSIX 사본에 CI 임시 시험 서명을 적용해 설치·실행·창 표시 확인. 동의 화면을 지나 MBC FM4U 선택 후 정지한 실제 화면을 촬영해 소개에 저장했다. 원본 업로드 MSIX에는 시험 서명이 없다. 물리 PC 청취·트레이·로그인·절전·WebView2 없는 환경은 미검증이다.
- Mac 제품 소스 `3ba726f`, 프런트 61개·Rust app-store 55개(실시간 5개 제외) 통과, Universal release 빌드 성공. 사용자 승인으로 배포 인증서 두 개와 명시적 앱 프로파일 발급/키체인 등록. 개인키는 저장소 외부에만 보관한다.
- Mac `dist-packages/mac-app-store/0.2.9-3ba726f-final/motungi-radio-0.2.9-mac-app-store.pkg`: 7,166,212 bytes, SHA256 `138776974b5386d7e332b1aeefee0f2c321bb5a90b76b85058d72a6829a03620`. 전체 추출한 내부 앱의 0.2.9, `io.github.devsejong.motungiradio`, arm64+x86_64, app-sandbox+network.client, team/app 식별자, codesign deep/strict 및 Installer 인증서 체인 확인.
- 한글 이름 .app으로 만든 빈 Payload pkg는 업로드하지 않았다. ASCII 설치 폴더 `Motungi Radio.app`로 패키징하되 앱 표시명은 한국어 유지. 추출 바이너리와 서명 원본 일치 검사 뒤에만 체크섬을 생성한다.
- 두 스토어 심사·공개 전. Mac App Privacy·연령등급·콘텐츠 권리 자료·최종 샌드박스 실기기 확인이 남아 있다. 기존 GitHub 0.2.9 설치파일/업데이트 피드는 변경하지 않았다.

### Mac Store 최종 업로드 파일

`dist-packages/mac-app-store/0.2.9-3ba726f-clean-profile/motungi-radio-0.2.9-mac-app-store.pkg`
SHA256 `11360a295f146811c181ec04a95bb703b210540f9e43d51f58ab71d1f01e0760`.
첫 업로드는 embedded.provisionprofile의 quarantine 속성으로 Apple 91109 오류가 발생했다. staging 복사본의 속성만 제거한 후 서명·전체 pkg 추출·원본 실행파일 일치·deep strict signature·속성 부재를 확인하고 재업로드했다. Transporter 성공, Apple 업로드 COMPLETE, errors/warnings 없음, 빌드 VALID를 확인했다. 사용자 키·프로파일 원본을 변경하거나 비밀 정보를 저장소에 추가하지 않았다.
패키징 프로파일 테스트, 아키텍처 6개 테스트 및 패키지 메타데이터 검사 통과. App Store 설치·샌드박스 청취·로그인·절전 검증과 직접 배포 앱의 실제 화면 캡처를 구분한다.


## 0.2.10 — 미니 플레이어

- Mac·Windows 제품 소스: `b4f1dd5105acbdffe510dffd471aa52c5450291d`.
- Linux 창 크기 적용 순서 수정 소스: `002fcfe55d017fbf187fe89bc03a35a94001bd8b`.
- 프런트 62개, Rust 56개 통과(외부 연결 5개 제외), 패키지 아키텍처 6개 통과.
- 실제 앱 컴포넌트를 사용하는 브라우저 프리뷰에서 일반·미니·라이트·다크·긴 제목을 확인했다. 미니 320×98px, 세 버튼 30×34px/곡률 6px/동일 y 좌표, 가로 넘침 없음. 이는 Mac 설치 앱의 창·청취 검증과 구분한다.
- Mac Apple Silicon 공증 `87bcc0cb-5529-4c36-8798-3fa448cc3a44`, Intel 공증 `a516ad22-596b-4dbf-bf03-360c30698e4a`: Accepted. 두 DMG 확인표·서명 및 읽기 전용 마운트 내부 앱의 Developer ID, hardened runtime, 버전 0.2.10, CPU, 앱 ID, Gatekeeper 통과. 업데이트용 앱에도 공증 확인표 첨부 후 검증했다.
- Windows CI `39343367900` 성공. x64 설치파일·실제 앱 아키텍처와 SHA256 확인. Authenticode 미서명.
- 업데이트용 Mac tarball·Windows 설치파일·Linux AppImage 네 파일의 Ed25519 서명 및 변조 거절 확인. 개인 키는 저장소 밖에 보관한다.
- Linux 최초 CI `39343371292`: 미니 진입 통과 후 일반 화면 복귀 크기 검사 실패. 제약 적용 순서를 수정한 CI `39346132159` 성공. Debian 설치 후 실제 WebKit/IPC에서 미니 320px·일반 380×640px 복귀, 채널 접기, 고정, 투명도, 트레이 설정·정지 이벤트를 통과했다.
- Mac 앱 교체·실제 네이티브 UI, Windows 실기기 청취·로그인·절전과 OS별 자동 업데이트 설치는 이번 버전 미검증이다. 기존 스토어 심사 제출은 변경하지 않았다.

- GitHub `v0.2.10` 공개 완료. 설치·업데이트 파일과 서명·SHA256SUMS.txt 12개를 인증 없이 다시 내려받아 로컬 해시와 전부 일치함을 확인했다. Pages 실행 `39347235862` 성공. 공개 홈페이지에서 0.2.10 다운로드 링크와 새 미니 소개 화면을 확인했고, 공개 `updates/latest.json`의 네 플랫폼 URL·서명이 로컬 검증본과 완전히 일치했다.

## 0.2.10 Mac 업데이트 설치 실패 수정 — 2026-10-20

- 기존 Mac tarball에 AppleDouble `._모퉁이 라디오.app` 항목이 들어 있었다. Tauri updater 2.13.3이 첫 경로를 제거하며 임시 폴더에 파일을 풀려 해 PermissionDenied가 발생했다. 다운로드·서명 검사만으로는 발견되지 않았다.
- 동일한 서명·공증 완료 앱을 메타데이터 없이 다시 압축했다. 제품 실행파일은 변경하지 않았으며 새 `-clean.app.tar.gz` 및 서명과 `SHA256SUMS-updater-fix.txt`를 v0.2.10에 추가했다. 기존 파일을 덮어쓰지 않았다.
- 로컬 시험 복사본에 실제 Tauri updater 설치 성공, 설치 후 버전 0.2.10·codesign deep/strict·stapler validate 통과. 실제 /Applications 앱과 사용자 설정은 변경하지 않았다.
- 공개 검증: Pages `39350199182` 성공. 수정 파일 5개 익명 다운로드·SHA256 일치, 공개 피드의 네 플랫폼 정보가 로컬과 일치했다. 실제 Tauri updater가 공개 피드에서 arm64 4,719,649 bytes를 받아 서명 검증 후 격리된 0.2.9 앱을 0.2.10으로 교체했다. 설치 후 codesign deep/strict 및 stapler validate 통과. Intel 수정본도 압축 해제 후 두 검사 통과. 실제 /Applications 앱은 0.2.9 그대로이며, 사용자 앱의 재시작·청취 시험과 Windows 업데이트 설치는 별도 미검증이다.

## 0.2.11 — 고정 미니모드 투명도

- 직접 배포 소스: `20491e8e333fd4851bb3499e320a48b452198049`. Store 진단 예제 분리: `83d97e3`.
- 프런트 63개·Rust 56개(외부 연결 5개 제외)·아키텍처 6개 통과. 실제 컴포넌트 프리뷰 미니 320×98에서 슬라이더 64×20 겹침 없음, 조절과 모드 전환 유지·고정 해제 불투명 복원 검사. 네이티브 실기기 UI와 구분한다.
- Mac 앱 공증: arm64 f2a90034-1408-400a-827f-8ee4f12639ea, x64 fa6e401c-5e50-4321-9598-daf9f1aa3ebb Accepted. DMG 공증: arm64 c1a581dc-fa8f-425c-9f0e-940e4dd6f6da, x64 35e53c6b-d81b-4821-afb6-d878a6eabc6f Accepted. 두 DMG·내부 앱 서명·확인표·Gatekeeper·버전·CPU·앱 ID 통과.
- Windows CI 39541354098 및 Linux CI 39541357621 성공. 산출물 SHA256 일치. 네 플랫폼 updater 서명과 변조 거절 검사 통과. Mac 압축파일 AppleDouble 제외.
- Store 최초 CI 39541361341 실패: direct 전용 check_update 예제를 Store 테스트가 컴파일했다. required-features로 direct에 한정해 재빌드한다.
- Mac·Windows 실제 청취·로그인·절전, Windows updater 설치는 미검증. Mac Store 0.2.9 보완은 별도다.
- GitHub v0.2.11 파일 12개를 익명 다운로드 후 로컬 SHA256과 일치 확인했다. 공개 피드/페이지는 이 검증 후 전환한다.
- Pages 39545364455 성공, 공개 홈페이지의 Store/직접 설치 링크와 새 미니 이미지 확인. 공개 피드 네 플랫폼 정보 일치. Tauri updater가 arm64 4,714,511 bytes를 다운로드·서명 검증하고 격리 앱을 0.2.11로 설치했다. 설치 후 codesign deep/strict와 stapler validate 통과. 실제 사용자 앱은 변경하지 않았다.
- Microsoft Store 0.2.11.0 MSIX CI 39544822718 성공, 별도 시험 서명 복사본 Windows 설치·실행 CI 39545556978 성공. 제출 원본은 미서명, 기존 앱 식별자·x64·해시 확인. Partner Center 재로그인이 필요해 심사 제출 전이다.
