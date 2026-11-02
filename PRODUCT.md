# 모퉁이 라디오 웹

<!-- impeccable:product-schema 1 -->

## Platform
web

## Purpose and audience
한국 라디오를 작업 중 가볍게 듣는 이용자를 위한 무료 웹 플레이어. 계정 없이 방송사를 넘나들며 채널을 선택한다.

## Capabilities
공식 방송사 스트림에 직접 연결한다. 이전·다음 채널, 검색, 음량, 마지막 채널 기억, 라이트/다크 모드를 제공한다. KBS·SBS·cpbc는 제공 범위 안에서 현재 프로그램과 표지를 표시하고 나머지는 채널 워드마크로 대체한다. MBC·EBS는 공식 사이트 링크로 안내한다.

## Constraints
시작은 무음. 하나의 기존 재생 제어기 유지. 정보 조회 실패는 청취를 중단하지 않는다. 인증·지역·CORS 제한을 우회하지 않는다. 일시 스트림 URL을 저장하지 않는다. 통계 SDK 없음. 공개 배포 전의 로컬 프리뷰.

## Confirmed design commitments
사용자 2026-11-02: 왼쪽 플레이어, 오른쪽 좁은 단일 열 채널 목록, 중앙 정렬, 양옆 다운로드 없음, 플레이어 아래 다운로드 페이지 링크. 라이트/다크 모드 유지. 나머지 시각 디자인은 위임.

Latest confirmed 2026-11-02: two-column station list, remove search/previous/next/volume slider, one play action beside programme info, stronger desktop-download CTA below player. This supersedes earlier single-column and controls.
