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
            "JWT + cookie 기반 BFF 인증 시스템 구축",
            "서버 상태 캐싱 전략 정립",
            "rAF 기반 렌더링 성능 최적화",
            "테스트 피라미드 고도화 + CI 안정화",
            "개발 생산성 자동화",
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
        images: [],
        features: [
            "Feature placeholder 1",
            "Feature placeholder 2",
            "Feature placeholder 3",
        ],
        techStack: [
            "Next.js 15",
            "React 19",
            "TypeScript",
            "Tailwind CSS",
            "MySQL (AWS RDS)",
            "AWS S3",
            "Vercel",
        ],
        liveUrl: "https://seongryung.vercel.app",
        githubUrl: "https://github.com/kimyoungyin/seongryung",
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
];
