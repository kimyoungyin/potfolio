## Content 구조 안내

이 프로젝트에서 실제 포트폴리오 **내용(텍스트/링크/리스트 등)** 은 모두 `content` 디렉터리에서 관리합니다.  
디자인/레이아웃은 `components` 쪽에서 유지하고, **값만 이 폴더에서 바꾼다**고 생각하면 됩니다.

- `content/header.ts`  
  - 상단 네비게이션 메뉴 항목(`navItems`) 정의  
  - 섹션 이름, 앵커(`#about`, `#skills` 등)를 바꾸고 싶을 때 수정

- `content/hero.ts`  
  - 소개 섹션의 프로필 정보(`heroProfile`): 이니셜, 직무 타이틀, 위치, 상태 문구  
  - 소개 문장(`heroIntro`)  
  - 이메일/깃허브/링크드인 등 연락처(`heroContacts`)  
  - 주요 CTA 버튼들(`heroCtas`)  
  → 자기소개/연락처/버튼 텍스트를 바꾸고 싶으면 여기만 수정

- `content/skills.ts`  
  - 기술 스택 카테고리와 스킬 리스트(`skillCategories`)  
  → 사용 기술을 추가/제거/이름 수정할 때 여기서 관리

- `content/types.ts`  
  - 프로젝트/케이스 스터디에서 공통으로 사용하는 타입 정의  
  - `Project`, `CaseStudy` 등

- `content/projects.ts`  
  - 포트폴리오에 보여줄 프로젝트 목록(`projects`)  
  - 각 프로젝트의 설명, 기능 리스트, 기술 스택, Live/GitHub 링크, 케이스 스터디/지표까지 모두 포함  
  → 실제 본인 프로젝트로 교체하고 싶으면 이 배열을 편집

- `content/blog.ts`  
  - 블로그 글 목록(`blogPosts`)  
  - 제목, 요약, 링크, 날짜, 읽는 시간  
  → 포트폴리오에서 소개할 글들을 이곳에서 관리

- `content/education.ts`  
  - 학력(`educationList`), 자격증(`certificationList`), 교육/부트캠프(`trainingList`)  
  → 학력/교육 이력을 바꾸고 싶으면 이 파일만 수정

### 활용 팁

- **디자인은 건드리지 않고 내용만 바꾸고 싶을 때**  
  → `components` 폴더는 그대로 두고, `content/*.ts` 파일들만 수정하면 됩니다.
- **나중에 다국어(ko/en)로 확장하고 싶을 때**  
  → 이 파일들의 구조를 유지한 채로 `ko`, `en` 필드를 추가하거나, `content/ko`, `content/en` 디렉터리로 분리하는 식으로 확장할 수 있습니다.

