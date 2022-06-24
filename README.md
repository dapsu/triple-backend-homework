# triple-backend-homework
여행 장소 리뷰 작성 시 포인트 부여, 전체/개인에 대한 포인트 포인트 부여 히스토리, 개인별 누적 포인트 관리

---

# 목차

1. 프로젝트 소개 및 요구사항 명시
2. DB 설계
3. API 설계
4. Git commit 메시지 컨벤션

---

# 1. 프로젝트 소개 및 요구사항 명시

이 프로젝트는 여행 장소에 대해 리뷰 작성이 이루어질때마다 리뷰 작성 이벤트가 발생하고, 이 이벤트를 전달하는 API를 구현하는 것이 목적입니다.

> API 예시

```
{
"type": "REVIEW",
"action": "ADD", /* "MOD", "DELETE" */
"reviewId": "240a0658-dc5f-4878-9381-ebb7b2667772",
"content": "좋아요!",
"attachedPhotoIds": ["e4d1a64e-a531-46de-88d0-ff0ed70c0bb8", "afb0cef2-
851d-4a50-bb07-9cc15cbdc332"],
"userId": "3ede0ef2-92b7-4817-a5f3-0c575361f745",
"placeId": "2e4baf1c-5acb-4efb-a1af-eddada31b00f"
}

```
* type: 미리 정의된 string값을 가지고 있습니다. 리뷰 이벤트의 경우 "REVIEW"로 옵니다.
* action: 리뷰 생성 이벤트의 경우 "ADD", 수정 이벤트는 "MOD", 삭제 이벤트는 "DELETE"값을 가지고 있습니다.
* reviewId: UUID 포맷의 review id입니다. 어떤 리뷰에 대한 이벤트인지 가리키는 값입니다.
* content: 리뷰의 내용입니다.
* attachedPhotoIds: 리뷰에 첨부된 이미지들의 id 배열입니다.
* userId: 리뷰의 작성자 id입니다.
* placeId: 리뷰가 작성된 장소의 id입니다.

> 한 사용자는 장소마다 한 개의 리뷰만 작성할 수 있고, 리뷰는 수정 및 삭제 가능합니다. 리뷰 작성 보상 점수는 아래와 같습니다.

* 내용 점수
  * 1자 이상 텍스트 작성: 1점
  * 1장 이상 사진 첨부: 1점
* 보너스 점수
  * 특정 장소에 첫 리뷰 작성: 1점


## Run

#### 1. 환경변수 파일 생성

* DB와 연동되어야 서버 실행이 가능합니다.
* **.env** 파일 내용
```
# ? 부분에 사용하는 DB 정보를 입력합니다.
DB_USER = ?
DB_PASSWORD = ?
DB_DATABSE = ?
COOKIE_SECRET = ?
```

#### 2. 서버 실행
```
# 작업 경로로 이동
$ cd /back

# 서버 실행 명령어 실행
$ npm run start

# 코드 컴파일 및 빌드
$ npm run build
```

#### 3. 접속
```
http://localhost:3000
```



## Skill stack
* Node.js (v16.13.0)
* TypeScript (v4.7.3)
* Express (v4.18.1)
* MySQL (v8.0.28)
* Sequelize (v6.20.1)

---

# 2. DB 설계
* REBMS: MySQL
* DB_NAME: wanted_preonboarding
* DB_TABLES:
	1. users
	2. places
	3. reviews
	4. points
	5. pointlogs
	6. reviewimages
	
## ERD
![캡처](https://user-images.githubusercontent.com/80298502/175456521-14e80910-cd74-44df-947b-21a71cb1cb0e.JPG)

---

# 3. API 설계

## 회원 인증 관련 API

### 회원가입
* 이메일, 유저 이름, 패스워드 입력 통해 회원가입
* URL: /api/user/
* METHOD: POST

### 로그인
* 이메일, 유저 이름, 패스워드 입력 통해 로그인
* URL: /api/user/login
* METHOD: POST

### 로그아웃
* 세션 삭제 통해 로그아웃
* URL: /api/user/logout
* METHOD: POST

## 리뷰 관련 API

### 리뷰 작성
* request param을 통해 얻은 해당 장소 데이터의 id로 장소 리뷰 작성 
* URL: /api/review/evnets/:placeId
* METHOD: POST

### 리뷰 이미지 등록
* 해당 리뷰에서 사진 등록 시 api 
* URL: /api/review/img/:reviewId
* METHOD: POST

### 리뷰 수정
* 리뷰 내용 수정
* URL: /api/review/events/:placeId
* METHOD: PUT

### 리뷰 이미지 삭제
* 해당 리뷰에서 사진 삭제 
* URL: /api/review/img/:imageId
* METHOD: DELETE

### 리뷰 삭제
* 해당 리뷰 삭제
* URL: /api/review/events/:reviewId
* METHOD: DELETE

---

# 4. Git commit 메시지 컨벤션

> 커밋 메시지를 어떠한 근거로 작성할 것인지 명시

* "태그 : 제목" 의 형태이며, : 뒤에만 space가 있습니다.

작업 | 설명 | 비고
--- | --- | --- |
Feat | 새로운 기능 생성 및 파일 추가 | 
Docs | 문서 생성 및 수정 | 
Upgrade | 기존 기능 수정 | 성능 향상 O
Refactor | 기존 기능 수정 | 성능 향상 X
Delete | 기능 제거 및 파일 삭제 | 
Test | 테스트 코드 추가 및 리팩토링
Fix | 오류 수정

#### 제목
- 제목의 총 글자 수는 50자 이내로 작성

#### 본문
- 본문은 한 줄당 72자 내로 작성
- 본문의 내용은 양에 구애받지 않고 최대한 상세히 작성
- 어떻게 변경했는지보다 **무엇을 변경했는지** 또는 **왜 변경했는지** 설명

#### Commit Message 예시
```
Feat: 초기 환경 설정

* index.js : 프로젝트의 메인 코드 파일
* bin/www.js : express 모듈 연결하고 포트 지정하는 부분
* config/config.js : 시퀄라이즈 환경 설정
```

