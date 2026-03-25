import type { CaseStudy, Project } from "./types";

const placeholderCaseStudy: CaseStudy = {
    problem: ["Problem placeholder — 실제 내용을 입력해주세요."],
    investigation: ["Investigation placeholder — 실제 내용을 입력해주세요."],
    solution: ["Solution placeholder — 실제 내용을 입력해주세요."],
    implementation: {
        description: ["Implementation placeholder — 실제 내용을 입력해주세요."],
    },
    impact: {
        metrics: [
            { label: "Metric 1", value: "—", description: ["placeholder"] },
            { label: "Metric 2", value: "—", description: ["placeholder"] },
        ],
        summary: ["Impact summary placeholder — 실제 내용을 입력해주세요."],
    },
};

export const projects: Project[] = [
    {
        title: "Harvesters-LALA",
        duration: "2026.01 ~ 진행 중",
        teamSize: "팀 프로젝트 (6명)",
        description:
            "댓글 수집 및 AI 분석을 기반으로, 사용자의 추가 관여 없이 평판을 자동 수집·분석·관리하는 B2B 웹 서비스입니다.",
        isPrivate: true,
        images: [],
        features: [
            "App Router + FSD 레이어 구조를 표준화하고(엔티티/공유/도메인 분리), ESLint 규칙으로 의존성 방향을 고정해 아키텍처 일관성을 확보했습니다.",
            "사이드바 리사이즈 인터랙션을 rAF 기반 스케줄링으로 전환해 체감 성능을 안정화하고(INP 80ms대), 프레임 드랍을 줄였습니다.",
            "AppSidebar에 WAI-ARIA(role/aria-*)와 키보드 조작 핸들러를 반영해 접근성 중심 UI를 구현했습니다.",
            "TanStack Query의 캐시 키가 시나리오 토글 순서에 의해 흔들리던 문제를 정리해 중복 요청/캐시 분산 가능성을 낮췄습니다.",
            "인증/세션 갱신에서 refresh 동시 호출 경합이 발생하지 않도록 단일화(Singleton Promise)와 재시도 큐 흐름을 적용해 안정성을 높였습니다.",
            "FCM 알림 파이프라인을 포그라운드/백그라운드까지 통합하고 BroadcastChannel 멀티탭 동기화로 중복 처리를 방지했습니다.",
            "Vitest+MSW 테스트 인프라를 구축하고 통합/E2E 인증 전략을 문서화했으며, CI와 커밋 전 자동화(ESLint/Prettier/lint-staged/Husky)로 품질을 지속 검증했습니다.",
            "쿠키 보안 옵션과 프론트-백 DTO 형식 정합성을 문서/검증 기준으로 맞춰, 보안 이슈와 변경 비용을 함께 관리했습니다.",
        ],
        techStack: [
            "Next.js 15",
            "React 18",
            "TypeScript 5",
            "TanStack Query 5",
            "Zustand 4",
            "Axios",
            "React Hook Form",
            "Zod",
            "Tailwind CSS",
            "Radix UI",
            "Vitest",
            "React Testing Library",
            "Playwright",
            "ESLint 9",
            "Husky",
        ],
        liveUrl: "https://lala.harvester.kr",
        githubUrl: "",
        challenges: [
            {
                title: "인증 구조 고도화: Client-only에서 BFF 하이브리드로 전환",
                summary:
                    "클라이언트 분산 인증 구조에서 발생하던 동시성·쿠키·CORS 문제를 해결하기 위해, 인증 흐름을 서버 경계 중심으로 재설계했습니다.",
                caseStudy: {
                    problem: [
                        "기존 인증 구조는 브라우저에서 인증 상태를 직접 관리하는 Client-only 방식이었습니다.",
                        "기존 토큰 전략은 JWT 기반으로 accessToken은 메모리에, refreshToken은 HttpOnly·Secure·SameSite 쿠키에 저장하는 형태였습니다.",
                        "하지만 인증 상태 판단, 토큰 갱신, 접근 제어가 클라이언트 여러 진입점에 분산되어 있었습니다.",
                        "이 구조에서는 동시 401 상황에서 각 진입점이 독립적으로 refresh를 호출해 중복 요청이 발생했고, 네트워크/서버 부하와 토큰 레이스 가능성이 커졌습니다.",
                        "또한 보호 경로 차단이 클라이언트 렌더 이후에 이루어져 비인증 사용자가 불필요한 번들 실행과 화면 깜빡임을 겪는 문제가 있었습니다.",
                        "브라우저가 타 도메인 인증 API를 직접 호출하는 구조에서는 쿠키 전송 제약과 CORS 설정 복잡도도 함께 증가했습니다.",
                        "결국 이 문제는 개별 로직 오류라기보다, 인증 책임이 클라이언트에 과도하게 집중된 구조에서 비롯된 것으로 판단했습니다.",
                        "특히 동시성 제어가 분산된 구조로 인해 동일한 인증 이벤트가 여러 번 처리되는 문제가 핵심 병목으로 작용했습니다.",
                        "이 문제의 원인을 구체적으로 파악하기 위해 refresh 호출 흐름을 중심으로 분석을 진행했습니다.",
                    ],
                    problemCode: {
                        caption:
                            "문제 시점 인터셉터 refresh 분기 코드 (재현 맥락 확인용)",
                        codeLanguage: "typescript",
                        codeSnippet: `// src/app/config/axios-auth-interceptor.ts (발췌)
if (isRefreshing) {
  return new Promise((resolve, reject) => {
    failedQueue.push({
      resolve: (response) => {
        originalRequest._retry = true;
        originalRequest.headers.Authorization = \`Bearer \${response.data.accessToken}\`;
        resolve(axiosInstance(originalRequest));
      },
      reject,
    });
  });
}

isRefreshing = true;
return handleUnauthorizedAndRetry(originalRequest);`,
                    },
                    investigation: [
                        "refresh 중복 문제는 두 축으로 나눠 분석했습니다. (1) 여러 API 요청이 동시에 401을 받는 경우, (2) 세션 검증 훅과 인터셉터가 동시에 refresh를 호출하는 경우입니다.",
                        "초기에는 인터셉터 큐만으로 문제를 해결할 수 있다고 판단했지만, 세션 검증 훅과의 중복 호출 문제는 남아 진입점 전반을 함께 정리해야 했습니다.",
                        "이 문제를 해결하기 위한 접근으로, 인터셉터 레벨에서는 failedQueue + isRefreshing 패턴으로 동시 요청을 제어하고 진입점 간 중복 호출은 refreshViewer 내부 Singleton Promise로 통합하는 방향을 선택했습니다.",
                        "이 단계에서 클라이언트 내부 동시성 문제는 일정 수준 제어할 수 있었습니다.",
                        "하지만 여전히 브라우저가 인증 API를 직접 호출하는 구조로 인해 쿠키 전송과 CORS 문제는 남아 있었고, 이를 구조적 한계로 판단했습니다.",
                        "이 과정에서 인증 책임을 클라이언트에서 완전히 해결하는 것은 한계가 있다고 보고, 인증 흐름의 일부를 서버 경계로 이동시키는 방향으로 설계를 전환했습니다.",
                        "이에 따라 인증 요청을 same-origin으로 수렴시키는 BFF 패턴을 도입하는 방향을 선택했습니다. 브라우저는 `/api/auth/*`만 호출하고, 서버가 백엔드를 호출하는 구조로 책임을 분리하는 것이 적절하다고 판단했습니다.",
                        "또한 접근 제어 시점을 앞당기기 위해 middleware에서 쿠키 존재 여부를 기준으로 1차 분기를 수행하고, 인증 여부는 클라이언트에서 보완하는 구조로 역할을 분리하는 것이 적절하다고 판단했습니다.",
                        "마지막으로 서버 간 요청의 신뢰 경계를 보완하기 위해, 내부 경유 요청을 식별할 수 있는 별도의 검증 계층이 필요하다고 판단했습니다.",
                        "결과적으로 문제를 동시성·네트워크·보안이 결합된 구조 문제로 재정의했습니다.",
                        "이를 해결하기 위해 인증 흐름 전반을 재구성하는 방향으로 Solution을 설계했습니다.",
                    ],
                    investigationCode: {
                        caption:
                            "진입점이 달라도 refresh 요청을 단일 흐름으로 수렴시키기 위한 설계 선택: Singleton Promise",
                        codeLanguage: "typescript",
                        codeSnippet: `// src/entities/viewer/api/refresh-viewer.ts (발췌)
let refreshPromise = null;

export function refreshViewer() {
  if (refreshPromise) return refreshPromise;
  refreshPromise = fetchRefresh().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}`,
                    },
                    solution: [
                        "동시성·쿠키·CORS 문제를 구조적으로 해결하기 위해, 인증 책임을 클라이언트에서 서버로 이동시키는 것을 핵심 목표로 설계를 재구성했습니다.",
                        "첫째, 인증 책임을 서버 경계로 이동시키기 위해 인증 API를 `/api/auth/*` Route Handler로 단일화하고, 클라이언트는 `authBffFetch`로만 인증 요청을 보내도록 변경했습니다.",
                        "둘째, 서버 경계에서 인증 상태를 일관되게 유지하기 위해 Route Handler는 `serverFetch(server-only)`로 백엔드를 호출하고 성공 시 백엔드 Set-Cookie를 앱 도메인 기준으로 전달했습니다.",
                        "셋째, 진입 단계 제어를 위해 middleware에서 보호/게스트 경로를 1차 분기해 비인증 접근을 서버 단계에서 즉시 리다이렉트하고, 게스트 경로에서는 세션 refresh를 생략해 불필요한 검증을 줄였습니다. 이때 middleware는 인증 여부를 확정하지 않고 비인증 사용자 조기 차단을 위한 1차 필터 역할로 제한해, 클라이언트 진입 이전의 불필요한 네트워크 요청을 줄였습니다.",
                        "넷째, 동시성 문제의 성격이 다르다고 판단하여 401 재시도는 인터셉터 Queue로, 세션/인터셉터 간 중복 호출은 Singleton Promise로 분리해 처리했습니다.",
                        "다섯째, 서버 간 신뢰 보완을 위해 Route Handler -> Backend 호출 헤더에 x-internal-key를 포함하고 백엔드에서 이를 검증하도록 했습니다. x-internal-key는 인증을 대체하는 수단이 아니라, 내부 경유 요청을 1차 식별하기 위한 보조 검증 계층입니다.",
                        "마지막으로 BFF 도입으로 서버 레이어가 추가되면서 초기 응답 경로는 길어졌지만, 인증 흐름의 일관성과 보안 제어 가능성을 확보하는 것이 장기적으로 더 중요하다고 판단했습니다.",
                        "이러한 설계를 구조 관점에서 보면 다음과 같은 흐름으로 정리할 수 있습니다.",
                    ],
                    solutionCode: {
                        caption:
                            "BFF Route Handler에서 백엔드 호출 및 쿠키 전달",
                        codeLanguage: "typescript",
                        codeSnippet: `// app/api/auth/login/route.ts (발췌)
const res = await serverFetch("/auth/login", {
  method: "POST",
  body: JSON.stringify(body),
});
const data = await res.json();
const nextRes = NextResponse.json(data, { status: res.status });
if (res.status >= 200 && res.status < 300) {
  appendSetCookieFromBackend(nextRes, getSetCookieFromResponse(res));
}
return nextRes;`,
                    },
                    architectureIntro: [
                        "구조 변경의 핵심은 인증 흐름의 제어 시점을 클라이언트 이후에서 서버 진입 단계로 이동한 것입니다.",
                        "Before 구조에서는 브라우저가 인증 API를 직접 호출하고, 인증 실패 이후 클라이언트에서 후차단하는 방식이었습니다. 이 구조는 인증 책임이 클라이언트에 분산되어 동시성·쿠키·CORS 문제를 함께 유발하는 한계가 있었습니다.",
                        "즉, 인증 실패 이후 처리하던 구조를 인증 진입 단계에서 제어하는 구조로 전환했습니다.",
                        "After에서는 인증 흐름을 서버 경계 중심으로 재구성해 브라우저는 same-origin BFF만 호출하고, middleware에서 1차 접근 제어, 인터셉터 + Singleton으로 동시성 제어, Route Handler와 백엔드 사이에는 x-internal-key 검증을 적용했습니다.",
                        "이 구조는 인증 흐름을 서버 경계 중심으로 일관되게 통제할 수 있다는 점에서 기존 구조의 한계를 해소합니다.",
                    ],
                    diagram: {
                        before: `graph TD
Client[Client]
AuthApi[ExternalAuthApi]
Store[MemoryStore]

Client -->|"login + accessToken"| AuthApi
Client -->|"API call with Bearer"| AuthApi
AuthApi -->|"401"| Client
Client -->|"refresh from each entrypoint"| AuthApi
Client -->|"set token"| Store`,
                        after: `graph TD
Browser[Browser]
Middleware[NextMiddleware]
Bff[RouteHandlersApiAuth]
Backend[BackendAuthApi]
Store[ViewerStore]
Interceptor[AxiosInterceptor]

Browser -->|"page request"| Middleware
Middleware -->|"allow or redirect"| Browser
Browser -->|"POST /api/auth/*"| Bff
Bff -->|"serverFetch + x-internal-key"| Backend
Backend -->|"Set-Cookie + body"| Bff
Bff -->|"same-origin cookie response"| Browser
Browser -->|"protected api call"| Interceptor
Interceptor -->|"refreshViewer singleton + queue"| Bff
Bff --> Backend
Interceptor --> Store`,
                    },
                    implementation: {
                        description: [
                            "설계 의도를 유지하면서 각 계층의 책임이 명확히 분리되도록 구현했습니다.",
                            "클라이언트 인증 요청의 진입점을 단일화하기 위해 `loginViewer`, `signupViewer`, `refreshViewer`, `logoutViewer` 모두 `authBffFetch`를 사용하도록 통일했습니다.",
                            "서버 경계에서 인증 흐름을 일관되게 제어하기 위해 BFF Route Handler는 `serverFetch`로 서버 환경변수 기반 API URL만 참조하고, 백엔드 응답의 Set-Cookie를 앱 응답에 전달했습니다.",
                            "초기 접근 단계에서 불필요한 인증 요청을 줄이기 위해 middleware는 `refreshToken` 쿠키 유무만 기준으로 보호/게스트 라우트를 분기하고, matcher로 API 및 정적 리소스를 제외해 불필요한 실행을 방지했습니다.",
                            "인터셉터 중복 등록으로 인한 부작용을 방지하기 위해 axios 인터셉터는 앱 초기 로드 시 1회만 등록되도록 제어했고, 큐 대기 후 refresh 완료 시 재시도되도록 구현했습니다.",
                            "서버 간 신뢰 경계를 명시하기 위해 Route Handler -> Backend 요청 헤더에 x-internal-key를 주입했고, 백엔드는 키 불일치/누락 시 즉시 401 또는 403으로 차단하도록 구성했습니다.",
                            "운영 관점에서는 키 유출 및 오용 가능성을 고려해 x-internal-key를 환경변수(비밀 저장소)로 관리하고 주기적으로 회전하며, 실패 로그 수집·누락 트래픽 모니터링 정책을 함께 문서화했습니다.",
                            "이러한 구현을 통해 각 계층의 책임이 분리된 상태에서도 전체 인증 흐름이 일관되게 동작하도록 유지했습니다.",
                        ],
                        codeLanguage: "typescript",
                        codeSnippet: `// 예시: Route Handler 내부 서버 간 검증 헤더 전달 (개념 코드)
const res = await serverFetch("/auth/refresh", {
  method: "POST",
  headers: {
    Cookie: backendCookie,
    "x-internal-key": process.env.INTERNAL_API_KEY ?? "",
  },
});`,
                    },
                    impact: {
                        metrics: [
                            {
                                label: "동시 401 처리",
                                value: "refresh 1회",
                                description: [
                                    "인터셉터 Queue + Singleton Promise 결합",
                                    "중복 refresh 호출 제거",
                                    "동시 요청 수에 비례하던 refresh 호출을 단일 요청으로 수렴",
                                    "동시 401 N건 기준: Before refresh N회 근접 -> After 1회 수렴",
                                ],
                            },
                            {
                                label: "접근 제어 시점",
                                value: "middleware 단계 선차단",
                                description: [
                                    "middleware 1차 분기",
                                    "비인증 보호 경로 즉시 리다이렉트",
                                    "인증 실패 후 클라이언트 후처리에서 서버 진입 단계 선차단으로 전환",
                                    "깜빡임 및 불필요 렌더 감소",
                                ],
                            },
                            {
                                label: "인증 API 경로",
                                value: "same-origin 단일화",
                                description: [
                                    "브라우저는 /api/auth/*만 호출",
                                    "브라우저 -> 백엔드 직접 호출 제거",
                                    "쿠키 도메인·전송 정책 일관화",
                                    "CORS 설정 부담 축소",
                                ],
                            },
                            {
                                label: "서버 간 보안",
                                value: "x-internal-key 1차 검증",
                                description: [
                                    "Route Handler 내부에서만 키 주입",
                                    "백엔드에서 키 누락/불일치 즉시 차단",
                                    "내부 요청 위조/우회 호출에 대한 1차 방어 계층 확보",
                                    "내부 경유 요청 식별 강화",
                                ],
                            },
                        ],
                        summary: [
                            "인증 흐름을 클라이언트 중심의 분산 처리 구조에서, 서버 경계 기반의 일관된 제어 구조로 재설계했습니다.",
                            "이를 통해 동시성 문제는 요청 수에 비례하던 refresh 호출을 단일 요청으로 수렴시켜 제거했고, 접근 제어는 클라이언트 후처리에서 서버 진입 단계 선차단으로 전환했습니다.",
                            "또한 인증 API를 same-origin으로 단일화하고 서버 간 x-internal-key 검증을 도입해, 네트워크 및 보안 정책을 구조적으로 통합했습니다.",
                            "사용자 경험 측면에서도 비인증 진입 시 화면 깜빡임과 불필요한 번들 실행을 줄여, 첫 화면 진입 흐름을 더 안정적으로 유지할 수 있었습니다.",
                            "그 결과 인증 로직의 예측 가능성과 장애 대응성이 향상되었고, 개별 문제를 임시 대응하던 방식에서 벗어나 구조적으로 해결할 수 있는 기반을 마련했습니다.",
                        ],
                    },
                },
            },
            {
                title: "RHF + Zod 도입: 폼 아키텍처 리팩터링",
                summary:
                    "폼 로직을 단일 훅에 몰아 넣은 구조가 유지보수·확장을 막고 있었고, 리렌더만이 아니라 ‘상태·검증·타입을 어느 층에 둘지’까지 재정의해 RHF+Zod로 책임을 나눴습니다. 핵심 훅 코드 74% 감소와 검증·조립 구조의 단일화를 달성했습니다.",
                caseStudy: {
                    problem: [
                        "폼 로직을 단일 훅에 집중시키는 구조 때문에 상태 관리, 검증, Create/Edit 분기가 한곳에 뒤엉켜 유지보수와 확장이 어려워졌습니다.",
                        "이 훅은 점점 비대해져 하나의 파일에서 모든 책임을 처리하는 구조가 되었고, 조립 컴포넌트는 해당 상태를 props drilling으로 전달하는 형태였습니다.",
                        "구체적으로는 use-scenario-form-state.ts가 592줄이었고, useState 9개·useRef 4개·submit 시 수동 validation(if-else 약 25줄)·Create/Edit 분기 로직이 한 파일에 혼재되어 있었습니다. scenario-form-content.tsx는 약 230줄로, 훅이 넘긴 값과 핸들러를 필드 컴포넌트에 계속 전달하는 역할에 가까웠습니다.",
                        "초기에는 폼을 훅으로 캡슐화하면 조립 층이 단순해지고 선언적으로 읽힐 거라 기대했습니다. 실제로는 규칙과 임시 입력까지 훅 안으로 몰리며 복잡도가 줄기보다 훅 내부에 숨은 형태가 됐고, 수정·추적·디버깅 부담이 커졌습니다.",
                        "또한 useState 기반 제어 패턴은 필드가 늘수록 상위 상태 갱신이 잦아져 불필요한 리렌더 가능성이 있었고, 입력 성능에도 영향을 줄 수 있는 구조였습니다.",
                    ],
                    problemCode: {
                        caption:
                            "592줄 훅에 몰려 있던 상태·수동 검증·조립 방식의 일부",
                        codeLanguage: "typescript",
                        codeSnippet: `// Before: use-scenario-form-state.ts (발췌)
const nameInputRef = useRef<HTMLInputElement>(null);
const galleryInputRef = useRef<HTMLInputElement>(null);
const authorInputRef = useRef<HTMLInputElement>(null);

const [errors, setErrors] = useState<IScenarioFormErrors>({});
const [formData, setFormData] =
    useState<IScenarioFormState>(DEFAULT_FORM_STATE);
const [keywordInput, setKeywordInput] = useState("");
const [excludeKeywordInput, setExcludeKeywordInput] = useState("");
const [authorInput, setAuthorInput] = useState("");
const [boardInput, setBoardInput] = useState("");
const [boardSearchQuery, setBoardSearchQuery] = useState("");
const [showBoardResults, setShowBoardResults] = useState(false);
const [showAuthorBoardResults, setShowAuthorBoardResults] = useState(false);

// submit 시 수동 validation (발췌)
const newErrors: IScenarioFormErrors = {};

if (!formData.name.trim()) {
    newErrors.name = true;
    setErrors(newErrors);
    toast.error("시나리오명을 입력해주세요");
    nameInputRef.current?.focus();
    return;
}
if (formData.platforms.length === 0) {
    newErrors.platforms = true;
    setErrors(newErrors);
    toast.error("최소 1개 플랫폼을 선택해주세요");
    return;
}
// ... 필드가 늘어날수록 if-else도 비례 증가

// Before: scenario-form-content.tsx — props drilling (발췌)
<FormBasicInfo
  formData={form.formData}
  errors={form.errors}
  nameInputRef={form.nameInputRef}
  onNameChange={(name) => {
    form.setFormData((prev) => ({ ...prev, name }));
    if (form.errors.name && name.trim())
      form.setErrors((prev) => ({ ...prev, name: false }));
  }}
/>
<FormPlatforms
  platforms={form.formData.platforms}
  errors={form.errors}
  onPlatformToggle={form.handlePlatformToggle}
  naverPlatformSortOrders={form.formData.naverPlatformSortOrders}
/>`,
                    },
                    investigation: [
                        "문제를 단순한 리렌더 이슈로만 보지 않고, 폼 상태·검증·타입을 어느 층(스키마, 폼 라이브러리, 훅, UI)에 둘지로 재정의했습니다.",
                        "기존 방식의 한계로는 세 가지를 짚었습니다. 값마다 상위 useState를 갱신하는 제어 컴포넌트는 트리가 커질수록 리렌더 비용이 커질 수 있고, 수동 if-else validation은 로직이 훅과 submit 경로에 흩어져 일관성이 떨어지며, 단일 훅은 책임이 과다해 한 줄을 고칠 때 파급이 크다는 점입니다.",
                        "React.memo도 검토했지만, 제어 컴포넌트에서는 부모 상태 변경으로 props가 계속 바뀌기 때문에 얕은 비교를 통과하지 못하는 경우가 많았습니다. 또한 분산된 검증과 단일 훅 구조 같은 문제는 memo만으로 해결할 수 없었습니다.",
                        "Formik 등도 검토했으나 제어 컴포넌트 중심이라 코드는 단순해질 수 있어도, 리렌더 특성은 기존과 유사할 것으로 보였습니다.",
                        "React Hook Form은 ref 기반 비제어로 입력을 추적해 useWatch 범위 위주로 구독을 줄일 수 있어, 당시 구조의 ‘매 타이핑마다 상위 상태 흔들기’와 맞물린 문제를 완화하는 데 적합한 대안이라 봤습니다.",
                        "React DevTools Profiler로 텍스트 입력 시나리오를 비교했을 때, 기존 구조에서는 입력 시 폼 전반의 컴포넌트가 함께 렌더링되었고 Profiler 상에서 다수 컴포넌트가 동시에 업데이트되는 것을 확인했습니다. RHF 적용 이후에는 입력 필드 컴포넌트 중심으로만 렌더링이 발생했습니다.",
                        "Zod는 z.infer로 타입을 스키마에서 끌어와 이중 정의를 없애고, superRefine으로 날짜 역전·배타 규칙 같은 복합 검증을 한곳에 둘 수 있습니다. zodResolver로 RHF와 붙이면 제출 시점의 유효성도 스키마와 같은 규칙을 쓰게 되어, 수동 if-else와 화면 쪽 판단이 어긋날 여지를 줄일 수 있다고 봤습니다.",
                        "정리하면 RHF+Zod는 재렌더 범위 완화, 검증·타입의 단일화, 훅 책임 분리·Context 기반 조립까지 한 번에 정리할 수 있어 이 조합으로 가기로 결론을 내렸습니다.",
                        "결론적으로, 기존 구조는 상태·검증·타입이 훅·submit 경로·화면 판단에 흩어진 형태였고, RHF+Zod는 이를 폼·스키마 축으로 단일화할 수 있는 선택이었습니다.",
                        "또한 RHF를 도입함으로써 기존 제어 컴포넌트 패턴에서 벗어나 폼 상태 관리 방식을 구조적으로 전환할 수 있다고 판단했습니다.",
                    ],
                    investigationCode: {
                        caption:
                            "폼 상태·검증·타입을 한 축으로 묶기로 한 연결 방식",
                        codeLanguage: "typescript",
                        codeSnippet: `// Investigation에서 확정한 방향 — Zod 선택 근거 (요약)
// - TypeScript-first: z.infer<typeof schema>로 타입·스키마 단일 출처
// - superRefine: ctx.addIssue({ path })로 필드에 귀속되는 복합 규칙
// - @hookform/resolvers: zodResolver(schema)로 RHF와 공식 연동

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const form = useForm<TCreateScenarioFormValues>({
    resolver: zodResolver(createScenarioFormSchema),
    mode: "onChange",
});`,
                    },
                    solution: [
                        "복잡도를 줄이기 위해 추상화 레이어를 더 쌓기보다, 각 레이어가 하나의 책임만 갖도록 분리한다는 원칙으로 구조를 재설계했습니다. 훅을 더 감싸 늘리지 않고 네 가지 구조 변경으로 나눴습니다.",
                        "첫째, 스키마를 base → create/edit으로 계층화했습니다. 공통 필드는 baseScenarioFormSchema에 두고 Create 전용 validation(platforms 최소 1개·날짜 역전 등)은 extend + superRefine으로 분리해, 공통 규칙 변경과 생성 전용 규칙 변경의 영향 범위를 나눴습니다.",
                        "둘째, 단일 훅을 use-create-scenario-form(78줄)과 use-scenario-edit-form(78줄)으로 완전히 나눴습니다. Create/Edit 분기를 훅 밖으로 빼 한 훅이 초기화·제출 조율만 담당하게 해, 한 모드를 고칠 때 다른 모드로의 오염을 줄였습니다.",
                        "셋째, ScenarioFormContent는 FormProvider만 제공하고 하위가 useFormContext()로 폼 상태에 접근하게 했습니다. 조립 컴포넌트에서 props drilling을 없애 필드 단위 수정 시 넘겨줄 인자 수를 줄였습니다.",
                        "넷째, 키워드·제외키워드 배타 규칙은 FormKeywords가 Context로 직접 집행하게 했습니다. 훅은 폼 생명주기만 맡기고 UI 근처 규칙은 컴포넌트에 두어, 규칙 변경 시 훅 파일을 건드릴 필요를 줄였습니다.",
                        "배타 규칙은 입력 직후 리스트를 맞춰 주는 성격이 커서, 서버 도메인 규칙보다 입력 UX에 가깝다고 보아 스키마가 아닌 컴포넌트에서 집행했습니다.",
                    ],
                    solutionCode: {
                        caption:
                            "Create 전용 훅으로 초기화·제출만 담당하는 형태",
                        codeLanguage: "typescript",
                        codeSnippet: `// After: use-create-scenario-form.ts (발췌)
export function useCreateScenarioForm({
    open,
    projectId,
    prefillData,
    onSuccess,
}) {
    const form = useForm<TCreateScenarioFormValues>({
        resolver: zodResolver(createScenarioFormSchema),
        defaultValues: CREATE_FORM_DEFAULT_VALUES,
        mode: "onChange",
    });

    const { mutate, isPending } = useCreateScenario();

    useEffect(() => {
        if (!open) return;
        form.reset(
            prefillData
                ? mapPrefillToScenarioForm(prefillData)
                : CREATE_FORM_DEFAULT_VALUES,
        );
    }, [open, prefillData, form]);

    const handleSubmit = () => {
        void form.handleSubmit((data) => {
            const payload = mapScenarioFormToCreatePayload(data, projectId);
            mutate(payload, {
                onSuccess: () => {
                    form.reset(CREATE_FORM_DEFAULT_VALUES);
                    onSuccess();
                },
            });
        })();
    };

    return {
        form,
        handleSubmit,
        isSubmitting: isPending,
        isFormValid: form.formState.isValid,
        mode: "create",
    };
}`,
                    },
                    architectureIntro: [
                        "Before는 단일 훅이 상태·검증·분기를 한데 묶는 단일 훅 중심 구조입니다.",
                        "After는 단일 훅 중심 구조에서 역할별 레이어 분리 구조로 변경했습니다.",
                        "스키마·훅(create/edit)·컴포넌트로 책임이 분리된 구조이며, 폼 관련 변경은 스키마·훅·UI 중 한 축에서 끝나도록 경계를 고정했습니다.",
                    ],
                    diagram: {
                        before: `graph TD
    H["use-scenario-form-state.ts (592줄)\\nuseState ×9  /  useRef ×4\\n수동 validation · Create/Edit 분기 혼재"]
    H -->|"formData, errors, handlers..."| SC["ScenarioFormContent (230줄)\\nprops drilling 조립 컴포넌트"]
    SC --> BI["FormBasicInfo"]
    SC --> PL["FormPlatforms"]
    SC --> KW["FormKeywords"]
    SC --> DR["FormDateRange"]`,
                        after: `graph TD
    subgraph create ["scenario-create"]
        CS["createScenarioFormSchema\\n(baseSchema.extend + superRefine)"]
        CH["use-create-scenario-form\\n78줄"]
    end
    subgraph edit ["scenario-edit"]
        ES["editScenarioFormSchema"]
        EH["use-scenario-edit-form\\n78줄"]
    end
    subgraph shared ["@x Public API"]
        BX["baseScenarioFormSchema\\nScenarioFormContent"]
    end
    BX --> CS --> CH
    BX --> ES --> EH
    CH --> FP["ScenarioFormContent\\nFormProvider 제공"]
    EH --> FP
    FP -->|"useFormContext()"| BI["FormBasicInfo"]
    FP -->|"useFormContext()"| PL["FormPlatforms"]
    FP -->|"useFormContext()"| KW["FormKeywords\\n(배타 규칙 직접 집행)"]
    FP -->|"useFormContext()"| DR["FormDateRange"]`,
                    },
                    implementation: {
                        description: [
                            "FSD 레이어 경계를 유지하기 위해 scenario-edit은 scenario-create 내부를 직접 import하지 않고 @x/scenario-edit.ts public API만을 통해 baseScenarioFormSchema와 ScenarioFormContent를 가져갑니다. Create 전용 superRefine은 scenario-create 경계 안에만 존재합니다.",
                            "상태 위치는 세 가지입니다. 제출 시 서버로 가는 값은 RHF 폼 상태(setValue·getValues), 제출과 무관한 입력 중 임시값(keywordInput 등)은 컴포넌트 로컬 useState, validation 규칙 선언은 Zod 스키마입니다.",
                            "폼은 mode: onChange로 두어 입력 중에도 zodResolver 결과가 formState에 반영되도록 했습니다. 제출 가능 여부 등 UI는 기존과 같이 스키마 유효성에 맞춰 두었고, 달라진 점은 규칙의 단일 출처가 Zod 스키마라는 것입니다.",
                            "이 구조를 통해 폼 상태, 검증, UI 로직이 서로 독립적으로 바꿀 수 있게 했습니다.",
                        ],
                        codeSnippet: `// base → create 확장: 공통 필드는 base에, Create 전용 validation은 extend + superRefine에
export const createScenarioFormSchema = baseScenarioFormSchema
    .extend({
        platforms: z
            .array(z.enum(PLATFORM_KEYS))
            .min(1, "최소 1개 플랫폼을 선택해주세요"),
        keywords: z
            .array(z.string())
            .min(1, "키워드는 1개 이상 입력해주세요")
            .refine(
                (kws) => new Set(kws).size === kws.length,
                "키워드는 중복되지 않아야 합니다",
            ),
    })
    .superRefine((data, ctx) => {
        if (!data.startDate) {
            ctx.addIssue({ code: "custom", path: ["startDate"], message: "시작일을 선택해주세요" });
            return;
        }
        if (!data.isOngoing && data.endDate && data.endDate < data.startDate) {
            ctx.addIssue({ code: "custom", path: ["endDate"], message: "종료일은 시작일 이후여야 합니다" });
        }
    });

export type TCreateScenarioFormValues = z.infer<typeof createScenarioFormSchema>;
// Edit은 base 그대로 — Create 전용 superRefine 불필요
export const editScenarioFormSchema = baseScenarioFormSchema;`,
                        codeLanguage: "typescript",
                    },
                    impact: {
                        metrics: [
                            {
                                label: "핵심 훅 코드량",
                                value: "-74%",
                                description: [
                                    "592줄 단일 훅",
                                    "→ create 78줄 + edit 78줄",
                                    "단일 책임 훅으로 읽기·수정 범위가 줄어 유지보수성이 좋아졌습니다.",
                                ],
                            },
                            {
                                label: "조립 컴포넌트 코드량",
                                value: "-77%",
                                description: [
                                    "230줄",
                                    "→ 53줄",
                                    "props drilling 제거로 조립 층이 얇아지고 컴포넌트 역할이 단순해졌습니다.",
                                ],
                            },
                            {
                                label: "수동 상태 관리",
                                value: "전량 제거",
                                description: [
                                    "훅 내 useState 9개·useRef 4개",
                                    "→ 0",
                                    "폼 값 흐름이 RHF·스키마 쪽으로 모여 상태 추적이 단순해졌습니다.",
                                ],
                            },
                            {
                                label: "검증·타입",
                                value: "Zod 단일화",
                                description: [
                                    "수동 if-else·분산된 에러 플래그",
                                    "→ 스키마 한곳 선언",
                                    "z.infer로 타입과 규칙이 같이 움직이고, resolver로 RHF와 동일 규칙을 공유합니다.",
                                ],
                            },
                        ],
                        summary: [
                            "숫자로는 훅·조립 컴포넌트 코드가 크게 줄었고, 훅 안에 있던 수동 상태·분산 검증은 스키마와 폼 레이어로 옮겨졌습니다.",
                            "그 결과 단일 훅에 숨겨져 있던 복잡도를 스키마(검증), 훅(폼 생명주기), 컴포넌트(UI·비즈니스 규칙)로 나눴습니다.",
                            "기능 추가나 수정 시 어느 레이어를 변경해야 하는지 명확해져, 변경 영향 범위를 예측하고 안전하게 수정할 수 있는 구조로 개선했습니다.",
                            "또한 렌더 범위 축소로 인해 입력 지연 없이 즉각적인 피드백이 가능해졌고, 필드가 많은 폼에서도 안정적인 입력 경험을 유지할 수 있게 되었습니다.",
                        ],
                    },
                },
            },
            {
                title: "Challenge placeholder 3",
                summary: "Challenge summary placeholder 3",
                caseStudy: placeholderCaseStudy,
            },
        ],
    },
    {
        title: "Myblog",
        duration: "2025.08 ~ 2025.09",
        teamSize: "개인 프로젝트 (100%)",
        description:
            '"다른 사람은 읽을 수 있지만, 업로드는 나만 가능한" 콘셉트의 기술 블로그로, 해시태그 기반 분류·검색을 직접 구현해 내가 쓴 글을 위키처럼 빠르게 다시 찾을 수 있도록 설계한 서비스입니다.',
        images: [],
        features: [
            "Feature placeholder 1",
            "Feature placeholder 2",
            "Feature placeholder 3",
        ],
        techStack: [
            "Next.js 15",
            "React 19",
            "TypeScript 5",
            "TanStack Query 5",
            "Zustand 5",
            "Supabase (PostgreSQL/Auth/Storage)",
            "Tailwind CSS 4",
            "shadcn/ui",
            "Zod",
        ],
        liveUrl: "https://myblog-navy-kappa.vercel.app",
        githubUrl: "https://github.com/kimyoungyin/myblog",
        challenges: [
            {
                title: "Challenge placeholder 1",
                summary: "Challenge summary placeholder 1",
                caseStudy: placeholderCaseStudy,
            },
            {
                title: "Challenge placeholder 2",
                summary: "Challenge summary placeholder 2",
                caseStudy: placeholderCaseStudy,
            },
            {
                title: "Challenge placeholder 3",
                summary: "Challenge summary placeholder 3",
                caseStudy: placeholderCaseStudy,
            },
        ],
    },
    {
        title: "승룡이네집 도서 검색 시스템",
        duration: "2025.03 ~ 2025.04",
        teamSize: "개인 프로젝트 (100%)",
        description:
            "군 복무 중 700~800권 규모 도서에 대한 검색 시스템이 없고 수기·분산 관리로 자료와 실제 위치가 어긋나던 문제를 해결하기 위해 개발한 도서 위치 안내 서비스입니다.",
        images: [
            "/images/projects/seongryoung/search-list.png",
            "/images/projects/seongryoung/location-modal.png",
            "/images/projects/seongryoung/location-detail.png",
            "/images/projects/seongryoung/before-performance-coldstart.png",
            "/images/projects/seongryoung/after-performance-coldstart.png",
            "/images/projects/seongryoung/before-network-coldstart.png",
            "/images/projects/seongryoung/after-network-coldstart.png",
        ],
        features: [
            "URL Query(`/?query=...`)로 검색 상태를 유지해 새로고침/공유 시 동일 결과를 재현했습니다.",
            "`ilike` 기반 부분 매칭 검색을 적용하고, 결과가 없을 때도 안내 UI로 검색 흐름을 유지했습니다.",
            "검색 중 로딩 인디케이터와 추천 검색어 클릭 플로우를 제공해 사용 흐름이 끊기지 않게 했습니다.",
            "검색 결과 카드에서 “위치 보기”를 통해 `/location/:id`로 이동하는 Hard navigation을 지원했습니다.",
            "위치 상세는 Intercepting/Parallel route 모달로 오버레이하는 Soft navigation을 구현했습니다.",
            "모달 오픈 시 body 스크롤 고정 및 top 보정을 적용해 배경 스크롤/레이아웃 흔들림을 줄였습니다.",
            "`Suspense`와 Skeleton fallback으로 초기 로딩 공백과 렌더 점프를 최소화했습니다.",
            "`generateMetadata`로 검색/상세 페이지별 SEO 및 Open Graph를 동적으로 생성했습니다.",
            "위치 지도 이미지는 ImageKit CDN + `next/image`(custom loader, `priority`, `sizes`)로 LCP 관점을 반영해 전달 경로를 최적화했습니다.",
        ],
        techStack: [
            "Next.js 15",
            "React 19",
            "TypeScript",
            "Tailwind CSS",
            "이전: MySQL (AWS RDS)",
            "변경: Supabase (PostgreSQL)",
            "이전: AWS S3",
            "변경: Supabase Storage",
            "ImageKit CDN",
            "Vercel",
        ],
        liveUrl: "https://seongryung.vercel.app",
        githubUrl: "https://github.com/kimyoungyin/seongryung",
        challenges: [
            {
                title: "이미지 서빙 구조 개선과 LCP 최적화",
                summary:
                    "메인 화면의 책 위치 이미지가 LCP 요소로 늦게 그려지며 Slow 4G 환경에서 LCP가 4.69s까지 지연되는 문제를, public 정적 서빙에서 Supabase Storage + ImageKit CDN·next/image priority로 옮겨 Cold 기준 LCP를 2.81s(약 40% 단축)까지 끌어올렸습니다.",
                caseStudy: {
                    problem: [
                        "기존에는 고해상도 이미지를 Next.js `public` 디렉토리에서 직접 서빙하는 단순한 구조였습니다.",
                        "사용자 테스트 과정에서 메인 화면의 핵심 콘텐츠인 ‘책 위치 이미지’가 늦게 렌더링되는 문제가 확인되었습니다.",
                        "해당 이미지는 페이지에서 가장 큰 영역을 차지하는 LCP 요소였고, 로딩 지연으로 초기 화면이 비어 보이는 시간이 길어져 사용자 경험이 저하되었습니다.",
                        "고해상도 원본 전송으로 네트워크 비용이 커졌고, Slow 4G 환경 기준 LCP가 4.69s까지 증가하는 등 첫 방문 품질이 특히 나빠졌습니다.",
                        "결국 이 문제는 특정 컴포넌트 버그라기보다, 이미지 전달 방식과 요청 시점이 맞물린 구조적 병목으로 인한 성능 저하로 정의했습니다.",
                    ],
                    investigation: [
                        "원인을 좁히기 위해 Chrome DevTools의 Performance, Network, Lighthouse를 병행해 측정했습니다.",
                        "JPEG 기준 약 76KB 용량에 네트워크 다운로드만 약 2.45s가 소요되는 구간이 있었고, 전송 데이터 크기 자체가 병목임이 드러났습니다.",
                        "동시에 LCP 후보 이미지에 대해 리소스 요청 시작이 늦고, 우선순위가 상대적으로 낮게 잡히는 Resource Load Delay도 함께 관찰되었습니다.",
                        "캐시가 채워진 Warm 상태에서는 체감이 나아보여도, Cold Start에서는 동일 구조가 반복적으로 성능 저하를 만들었습니다.",
                        "결국, 문제의 본질은 서버 응답 속도가 아니라 전송 데이터 크기와 요청 타이밍의 결합으로 재정의했습니다.",
                        "이에 따라 단순 서버 튜닝이 아니라 이미지 전달 경로와 포맷·크기·선요청 전략을 함께 바꾸는 방향으로 Solution을 설계했습니다.",
                    ],
                    solution: [
                        "구조적 병목을 줄이기 위해 이미지 경로를 분리했습니다. 책 표지 등 가벼운 기존 리소스는 Supabase URL을 유지하고, 위치 지도처럼 대용량이자 LCP에 영향이 큰 이미지는 ImageKit 경로로 변경했습니다.",
                        "ImageKit 경로에는 next/image 커스텀 로더가 `tr=w-{width},q-{quality},f-auto`를 부여하도록 구성해 포맷 자동 선택과 폭 기반 리사이징을 동시에 적용했습니다.",
                        "풀 페이지(`/location/[id]`)에서는 상단 표지에 `priority`를 두고 지도는 `fill + sizes + 종횡비 래퍼`로 요청 폭만 최적화했습니다. 반대로 인터셉트 모달에서는 지도가 메인 컨텐츠로써 화면 대부분을 차지하므로 지도에 `priority`를 적용했습니다.",
                        "물론 이미지 최적화 방식에 대해 Next.js Image Optimization(내장 변환), Cloudflare Images(별도 변환/캐시 파이프라인)도 함께 검토했습니다.",
                        "하지만 Next.js 내장은 변환이 서버에서 발생하므로 트래픽 증가 시 비용과 부하가 커질 수 있고, Cloudflare Images는 운영 관점에서 추가 파이프라인 구성이 필요했습니다.",
                        '반면 ImageKit은 URL 파라미터 기반 실시간 변환과 글로벌 Edge 캐싱을 제공하고, 기존 Storage(Supabase)와의 연동이 비교적 단순해 "변환 + 캐싱 + 전달"을 한 경로에서 처리할 수 있어 선택했습니다.',
                        "이러한 설계를 구조 관점에서 보면 다음과 같은 흐름으로 정리할 수 있습니다.",
                    ],
                    solutionCode: {
                        caption:
                            "next/image 커스텀 로더로 ImageKit 변환 파라미터를 일관 적용",
                        codeLanguage: "typescript",
                        codeSnippet: `// imageKitLoader.ts (발췌)
import type { ImageLoaderProps } from "next/image";

const IK_HOST = "ik.imagekit.io";

export default function imageKitLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  const q = quality ?? 75;
  if (src.startsWith("/")) return src;

  try {
    const url = new URL(src);
    if (url.hostname === IK_HOST) {
      url.searchParams.set("tr", \`w-\${width},q-\${q},f-auto\`);
      return url.toString();
    }
  } catch {}

  return src;
}`,
                    },
                    architectureIntro: [
                        "기존에는 브라우저 요청이 Next.js 서버를 거쳐 `public` 정적 이미지를 직접 내려받는 단일 경로였습니다.",
                        "개선 이후에는 브라우저가 Next.js로부터 HTML을 받고, 위치 지도는 ImageKit Edge(변환·캐시), 책 표지는 Supabase Origin으로 각각 직접 요청하는 이중 경로로 분리했습니다.",
                        "CDN 경로를 바꾸는 옵션이 아니라 preload 힌트로 요청 시점을 앞당기는 역할인 `priority`를 적용해, 전달 경로(어디서 받는가)와 요청 시점(언제 받는가)을 분리 제어할 수 있도록 하여 Cold Start 편차와 LCP 지연을 함께 줄입니다.",
                    ],
                    diagram: {
                        before: `flowchart LR
Browser[Browser] --> NextServer[Next.js Server]
NextServer --> PublicDir[public Static Images]`,
                        after: `flowchart LR
Browser[Browser] --> NextHTML["Next.js HTML + preload hint (priority image)"]
Browser --> ImageKit["ImageKit CDN Edge (Location Map)"]
Browser --> Supabase["Supabase Storage Origin (Book Cover)"]`,
                    },
                    implementation: {
                        description: [
                            "next.config에서 `images.loaderFile`과 `remotePatterns`를 설정해 ImageKit·Supabase 호스트를 명시적으로 허용하고, 로더 규칙을 전역에서 일관 적용했습니다.",
                            "위치 지도 URL은 `getLocationImageSrc`로 ImageKit 엔드포인트를 사용하고, `LOCATION_MAP_IMAGE_SIZES` 상수와 `fill`을 결합해 실제 레이아웃 폭에 맞는 요청만 내려가도록 조정했습니다.",
                            "풀 페이지에서는 상단 표지(`getImageSrc`)에 `priority`를 두고 지도는 non-priority로 운영했으며, 모달 라우트에서는 지도에 `priority`를 적용해 화면 점유율에 맞게 우선순위를 분기했습니다.",
                            "핵심은 ‘어디서 파일을 두느냐’보다 ‘어떤 포맷·크기·시점으로 전달하느냐’에 두고, 측정 가능한 지표로 Before/After를 맞춰 검증했습니다.",
                        ],
                        codeLanguage: "tsx",
                        codeSnippet: `// app/location/[id]/page.tsx (발췌)
<div className="relative sm:w-24 sm:h-36 w-16 h-24 self-center">
  <Image
    src={getImageSrc(bookInfo.location, bookInfo.id)}
    alt={bookInfo.title}
    fill
    sizes="(min-width: 640px) 6rem, 4rem"
    className="object-cover rounded-lg"
    quality={80}
    priority
  />
</div>

<div
  className="relative mt-4 w-full"
  style={{ aspectRatio: \`\${LOCATION_IMAGE_SIZE.width} / \${LOCATION_IMAGE_SIZE.height}\` }}
>
  <Image
    src={getLocationImageSrc(bookInfo.location)}
    alt={bookInfo.title + "이 있는 책장"}
    fill
    sizes={LOCATION_MAP_IMAGE_SIZES}
    className="object-contain"
  />
</div>`,
                    },
                    impact: {
                        metrics: [
                            {
                                label: "LCP (Cold, Slow 4G)",
                                value: "4.69s → 2.81s",
                                description: [
                                    "약 40% 단축",
                                    "WebP 변환·리사이징으로 전송 데이터 크기를 줄여 다운로드 시간을 단축",
                                    "`priority/preload`로 요청 시작 시점을 앞당겨 Resource Load Delay를 낮춤",
                                ],
                            },
                            {
                                label: "이미지 전송 용량",
                                value: "76KB → 26KB",
                                description: [
                                    "약 66% 감소",
                                    "WebP·리사이징·품질 파라미터로 바이트 축소",
                                    "동일 시각 품질 대비 네트워크 비용 절감",
                                ],
                            },
                            {
                                label: "이미지 다운로드 시간",
                                value: "2.45s → 1.58s",
                                description: [
                                    "약 35% 단축 (Slow 4G)",
                                    "WebP·리사이징으로 용량을 축소해 전송/다운로드 병목을 제거",
                                ],
                            },
                            {
                                label: "첫 방문 품질",
                                value: "1.88s 단축 (Cold LCP)",
                                description: [
                                    "Warm만 빠른 구조에서 Cold Start도 안정",
                                    "사용자 경험 편차 감소",
                                ],
                            },
                        ],
                        summary: [
                            "책 표지와 위치 지도의 전달 경로를 분리하고, 지도에는 ImageKit 로더(`f-auto`·폭 기반 `tr`)를 적용해 자산별 전송 전략을 명확히 했습니다.",
                            "전송 데이터 축소(WebP·리사이징)로 다운로드 비용을 줄이고, `priority` 선요청으로 Resource Load Delay를 낮춰 Cold 기준 LCP를 4.69s에서 2.81s로 개선했습니다. CDN은 최적화된 이미지를 사용자와 가까운 Edge에서 빠르게 전달하는 역할을 담당했습니다.",
                            "Warm에서만 체감이 나던 한계를 넘어, 첫 방문에서도 핵심 이미지가 빠르게 보이도록 사용자 경험 편차를 줄였습니다.",
                            "결과적으로 측정된 병목(크기·시점)을 코드 레벨 규칙(로더·sizes·priority)으로 연결해 검증한 성능 개선 사례로 정리할 수 있었습니다.",
                        ],
                    },
                },
            },
        ],
    },
];
