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
            {
                label: "Metric 1",
                value: "—",
                description: ["placeholder"],
            },
            {
                label: "Metric 2",
                value: "—",
                description: ["placeholder"],
            },
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
            "Firebase Cloud Messaging",
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
                        "1) 인증 책임의 서버 경계 이동",
                        "동시성·쿠키·CORS 문제를 구조적으로 해결하기 위해, 인증 책임을 클라이언트에서 서버로 옮기는 것을 핵심 목표로 설계를 재구성했습니다.",
                        "인증 API를 `/api/auth/*` Route Handler로 단일화하고, 클라이언트는 `authBffFetch`로만 인증 요청을 보내도록 변경했습니다.",
                        "2) Route Handler와 쿠키 전달",
                        "서버 경계에서 인증 상태를 일관되게 유지하기 위해 Route Handler는 `serverFetch(server-only)`로 백엔드를 호출하고, 성공 시 백엔드 Set-Cookie를 앱 도메인 기준으로 전달했습니다.",
                        "3) Middleware 1차 분기",
                        "진입 단계 제어를 위해 middleware에서 보호/게스트 경로를 1차 분기해 비인증 접근을 서버 단계에서 즉시 리다이렉트하고, 게스트 경로에서는 세션 refresh를 생략해 불필요한 검증을 줄였습니다.",
                        "middleware는 인증 여부를 확정하지 않고 비인증 사용자 조기 차단을 위한 1차 필터 역할로만 두어, 클라이언트 진입 이전의 불필요한 네트워크 요청을 줄였습니다.",
                        "4) 동시성 처리의 분리",
                        "동시성 문제의 성격이 다르다고 판단해 401 재시도는 인터셉터 Queue로, 세션·인터셉터 간 중복 호출은 Singleton Promise로 나눠 처리했습니다.",
                        "5) 서버 간 보조 검증",
                        "Route Handler → Backend 호출 헤더에 x-internal-key를 포함하고 백엔드에서 검증하도록 했습니다. x-internal-key는 인증을 대체하는 수단이 아니라, 내부 경유 요청을 1차 식별하기 위한 보조 검증 계층입니다.",
                        "6) 트레이드오프",
                        "BFF 도입으로 서버 레이어가 추가되면서 초기 응답 경로는 길어졌지만, 인증 흐름의 일관성과 보안 제어 가능성을 확보하는 편이 장기적으로 더 중요하다고 판단했습니다.",
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
                        "1) 설계 원칙",
                        "복잡도를 줄이기 위해 추상화 레이어를 더 쌓기보다, 각 레이어가 하나의 책임만 갖도록 분리한다는 원칙으로 구조를 재설계했습니다. 훅을 더 감싸 늘리지 않고 네 가지 구조 변경으로 나눴습니다.",
                        "2) 스키마 계층화",
                        "스키마를 base → create/edit으로 계층화했습니다. 공통 필드는 baseScenarioFormSchema에 두고 Create 전용 validation(platforms 최소 1개·날짜 역전 등)은 extend + superRefine으로 분리해, 공통 규칙 변경과 생성 전용 규칙 변경의 영향 범위를 나눴습니다.",
                        "3) Create/Edit 훅 분리",
                        "단일 훅을 use-create-scenario-form(78줄)과 use-scenario-edit-form(78줄)으로 완전히 나눴습니다. Create/Edit 분기를 훅 밖으로 빼 한 훅이 초기화·제출 조율만 담당하게 해, 한 모드를 고칠 때 다른 모드로의 오염을 줄였습니다.",
                        "4) FormProvider와 Context 조립",
                        "ScenarioFormContent는 FormProvider만 제공하고 하위 컴포넌트가 useFormContext()로 폼 상태에 접근하게 했습니다. 이를 통해 컴포넌트 간 props drilling을 없애 필드 단위 수정 시 넘겨줄 인자 수를 줄였습니다.",
                        "5) 배타 규칙의 컴포넌트 집행",
                        "키워드·제외키워드 배타 규칙은 FormKeywords가 Context로 직접 집행하게 했습니다. 훅은 폼 생명주기만 맡기고 UI 근처 규칙은 컴포넌트에 두어, 규칙 변경 시 훅 파일을 건드릴 필요를 줄였습니다.",
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
        ],
    },
    {
        title: "Myblog",
        duration: "2025.08 ~ 2025.09",
        teamSize: "개인 프로젝트 (100%)",
        description:
            '"다른 사람은 읽을 수 있지만, 업로드는 나만 가능한" 콘셉트의 기술 블로그로, 해시태그 기반 분류·검색을 직접 구현해 내가 쓴 글을 위키처럼 빠르게 다시 찾을 수 있도록 설계한 서비스입니다.',
        images: [
            "/images/projects/myblog/home.png",
            "/images/projects/myblog/posts.png",
            "/images/projects/myblog/search.png",
            "/images/projects/myblog/profile.png",
            "/images/projects/myblog/create.png",
        ],
        features: [
            "글 목록(`/posts`)·검색(`/search`)에서 `q`·`sort`·`tag`(복수 해시태그 id)를 URLSearchParams로 동기화해 새로고침·공유·뒤로가기 시 동일 필터·정렬 상태를 재현했습니다.",
            "Supabase RPC·인덱스 기반으로 다중 해시태그 AND 조건과 정렬(최신/인기/좋아요/오래된 순)을 조합한 목록·검색 API를 사용하고, 클라이언트는 TanStack Query `useInfiniteQuery`와 Intersection Observer로 무한 스크롤을 구성했습니다.",
            "서버에서 `prefetchInfiniteQuery` → `dehydrate` → `HydrationBoundary`로 첫 페이지를 시드하고, `lib/queries.ts`의 queryKey 팩토리로 서버 prefetch와 클라이언트 `useInfiniteQuery·무효화`가 같은 키를 쓰도록 맞췄습니다(검색은 필터가 있을 때만 prefetch, `initialData` 없음).",
            "정적 읽기 위주에 맞게 글 목록의 주기적 폴링(`refetchInterval`)을 제거하고 `refetchOnWindowFocus: false` 등으로 클라이언트 refetch 부담을 줄였습니다.",
            "Next.js `unstable_cache`와 태그(`revalidateTag`)로 홈·글 상세·해시태그·댓글 등 읽기 스냅샷을 Data Cache에 두고, 변경 시 태그 단위로 무효화했습니다. 좋아요처럼 사용자별 데이터는 세션 기반 조회로 분리하고 `useQuery` + 낙관적 업데이트·`refetchOnWindowFocus`로 탭 복귀 시 동기화했습니다.",
            "글·댓글·좋아요·이미지 업로드 등을 Server Actions로 모으고 Zod로 입력을 검증한 뒤 Supabase(PostgreSQL, Storage, RPC)를 호출하는 구조로 유지했습니다.",
            "마크다운 뷰어에서 `next/image`·GFM·구문 강조·Mermaid를 커스텀 컴포넌트로 묶어 렌더 품질과 잘못된 HTML 중첩·hydration 리스크를 줄이는 방향으로 구성했습니다.",
            "Supabase OAuth와 Next.js Middleware로 `/admin`·`/profile` 등 보호 라우트를 두고, 관리자 권한에 따라 UI와 서버 로직을 함께 제한했습니다.",
            "`generateMetadata`로 글·목록·검색·해시태그 맥락별 메타·OG를 동적으로 구성하고 `sitemap.xml`·`robots.txt`로 크롤링 경로를 정리했습니다.",
            "검색 결과 구역은 `Suspense`와 Skeleton fallback으로 전환 시 빈 화면과 레이아웃 점프를 줄였습니다.",
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
                title: "읽기 경로의 중복 요청을 제거하기 위한 Next.js Data Cache와 TanStack Query 기반 캐시 계층 재설계",
                summary:
                    "읽기 경로가 요청마다 DB에 직접 붙고, 클라이언트에서도 불필요한 refetch가 반복되는 구조를 개선했습니다. Next.js Data Cache와 TanStack Query SSR Hydration을 정렬해 서버·클라이언트 캐시 계층을 분리하고, 중복 요청을 제거해 동일 데이터 재요청 시 DB 접근을 줄이는 구조로 변경했습니다.",
                caseStudy: {
                    problem: [
                        "읽기 데이터가 요청마다 Supabase에 직접 조회되는 구조로, 동일 요청에서도 DB 접근이 반복되는 비효율이 있었습니다.",
                        "또한 Next.js Data Cache를 활용한 요청 간 스냅샷 공유가 없어 서버 캐시 계층이 사실상 부재한 상태였습니다.",
                        "클라이언트 측에서도 무한 스크롤 기반으로 동작하는 `/posts`와 `/search`의 데이터 패칭 방식이 달라 SSR Hydration 계약이 일관되지 않았고, 일부 경로에서는 불필요한 refetch가 발생했습니다.",
                        "특히 글 목록에는 주기적 polling이 설정되어 있어, 갱신 빈도가 낮은 정적 콘텐츠(블로그)임에도 지속적인 백그라운드 요청이 발생했습니다.",
                    ],
                    investigation: [
                        "문제를 단순 증상이 아닌, 읽기 부하 / 캐시 무효화 단위 / 클라이언트 데이터 흐름의 세 축으로 재정의했습니다.",
                        "시나리오 1(상세): 동일 `postId`를 반복 방문할 때마다 서버가 DB 조회를 다시 수행하는 구조로, 캐시가 없는 상태에서는 동일 데이터에 대한 불필요한 쿼리가 반복되었습니다.",
                        "시나리오 2(목록·검색): 서버에서 내려주는 초기 데이터와 클라이언트의 `queryKey`, fetch 시점이 일치하지 않아, 화면은 동일하게 보이지만 내부적으로는 중복 요청과 캐시 미스가 발생하는 구조였습니다.",
                        "또한 일부 목록에서는 주기적 refetch가 설정되어 있어, 실제로 변경이 거의 없는 데이터에도 지속적인 네트워크 요청이 발생하고 있었습니다.",
                        "이러한 구조는 현재 트래픽이 낮은 환경에서는 큰 문제가 되지 않지만, 기능이 확장되거나 사용자 행동이 늘어날 경우 불필요한 DB 접근과 네트워크 비용이 빠르게 증가할 수 있는 상태라고 판단했습니다.",
                        "결국 문제의 본질이 '데이터가 아니라 요청 흐름'에 있다고 판단했습니다. 이를 해결하기 위해, 서버와 클라이언트 캐시 계층을 분리하고, 중복 요청을 제거하는 방향으로 설계했습니다.",
                    ],
                    solution: [
                        "1) 서버 캐시 계층 도입",
                        "읽기 요청이 매번 DB로 향하는 구조를 해결하기 위해, Next.js Data Cache를 서버 캐시 계층으로 도입했습니다.",
                        "클라이언트 TanStack Query 캐시만으로는 HTTP 요청 단위를 넘어 서버에서 조회한 결과를 공유할 수 없어, 여러 요청에서 동일 읽기가 반복될 구조를 줄이기 위해 Next Data Cache를 서버 측 스냅샷 계층으로 별도 두었습니다.",
                        "공용 읽기는 `unstable_cache`로 감싸고, 변경 시 범위를 쪼개 무효화할 수 있도록 태그 기반으로 설계했습니다. 무효화 최소 단위를 태그로 나눠 전 라우트만 일괄 갱신하는 방식이 되지 않게 했습니다.",
                        "이후 무효화는 태그 기반으로 제어하고, TTL은 보조적 안정장치로 사용하는 전략을 선택했습니다.",
                        "2) 개인화 데이터 분리",
                        "모든 데이터를 캐싱하지 않고, 사용자별 상태가 필요한 좋아요 여부는 Data Cache에서 제외했습니다.",
                        "공용 데이터는 서버 캐시로 처리하고, 사용자 의존 데이터는 Server Action과 클라이언트 TanStack Query로 분리해 캐시 키 폭발을 방지하고 데이터 일관성을 유지했습니다.",
                        "3) SSR Hydration 계약 통일",
                        "목록(`/posts`)과 검색(`/search`)의 패칭·시드 방식이 달라, 화면은 같아 보여도 중복 요청과 캐시 미스가 생겼습니다.",
                        "단일 SSR prefetch·hydrate 계약으로 정렬해 서버와 클라이언트가 같은 TanStack 캐시 슬롯을 바라보도록 통일했습니다.",
                        "4) 불필요한 클라이언트 요청 제거",
                        "블로그는 갱신 빈도가 낮고 실시간성이 필수는 아니어서 목록의 주기적 polling을 제거했습니다. 실시간 대시보드형 UI라면 polling이 의미 있을 수 있으나, 이 서비스는 정적 읽기에 가깝다고 보았습니다.",
                        "변경이 생기면 태그 무효화를 중심으로 서버 스냅샷을 갱신하고, 필요할 때만 명시적 동기화로 클라이언트를 맞추는 방향으로 두었습니다.",
                        "5) 캐시 정책 설계(trade-off)",
                        "조회수는 실시간 정합성이 중요하지 않다고 판단해 캐시된 값을 사용하고, DB는 별도로 증가시키는 방식으로 읽기 성능을 우선시했습니다.",
                        "반대로 좋아요는 사용자 상태에 따라 달라지므로 캐시하지 않고, 클라이언트에서 refetch 및 낙관적 업데이트로 일관성을 유지했습니다.",
                        "결과적으로, 캐싱의 목적을 단순 성능 개선이 아니라, 요청 흐름 자체를 줄이는 구조적 문제 해결로 정의했습니다.",
                    ],
                    solutionCode: {
                        caption:
                            "읽기 스냅샷을 Data Cache에 두고 태그로 무효화 범위를 제어하는 `unstable_cache` 패턴. 캐시 키 `['post', id]`는 `id`와 정합적이고, 호출 시 래퍼를 구성한 뒤 즉시 실행(`()`)하면 Next가 해당 키로 스냅샷을 재사용한다(팩토리로 분리해 재사용할 수도 있으나 예시는 직관용).",
                        codeSnippet: `// src/lib/posts.ts (발췌)
import { unstable_cache } from "next/cache";

export async function getCachedPost(id: string) {
  // 동일 id면 ["post", id] 키로 스냅샷 재사용 → 히트 시 아래 콜백 미실행
  return unstable_cache(
    async () => fetchPostFromSupabase(id),
    ["post", id],
    {
      tags: [\`post-\${id}\`, "posts"],
      revalidate: 3600,
    }
  )();
}`,
                    },
                    architectureIntro: [
                        "RSC와 읽기 액션은 먼저 `unstable_cache`로 Next Data Cache를 조회하고, 히트면 콜백 내 DB 조회 없이 스냅샷을 씁니다. 미스·태그 무효화·TTL 만료 시에만 Supabase를 채웁니다.",
                        "글 목록·검색은 요청 단위 서버 `QueryClient`에 `prefetchInfiniteQuery`로 넣은 뒤 dehydrate → `HydrationBoundary`로 브라우저 TanStack 캐시를 시드하고, 이후 같은 `queryKey`면 메모리 히트로 네트워크를 생략할 수 있습니다.",
                        "Mutation은 `revalidateTag`로 Data Cache 엔트리를 무효화합니다. 브라우저 TanStack 상태는 서버 무효화만으로는 비워지지 않으므로 필요 시 `invalidateQueries` 등으로 맞춥니다.",
                        "좋아요는 사용자별 캐시 폭발을 피하기 위해 Data Cache 밖에서 두고, 조회수는 스냅샷과 DB 증분 사이에 의도된 지연을 허용합니다.",
                        "브라우저 TanStack은 세션·탭 생명주기 안의 메모리 캐시에 가깝고, Next Data Cache는 서버에서 요청 간 공유되는 읽기 스냅샷이라, 두 계층을 분리해 요청 내부 최적화와 요청 간 최적화를 동시에 노렸습니다.",
                    ],
                    diagram: {
                        before: `flowchart LR
RSC[Server_RSC] --> DB[(Supabase)]
RSC --> RevPath[revalidatePath]
Posts[posts_infinite_query] --> TanStack[TanStack_client]
Search[search_initialData] --> TanStack
Posts -.->|SSR_contract_drift| Search
Posts --> Poll[periodic_refetch]`,
                        after: `flowchart TB
RSC[RSC_read] --> DC[Next_Data_Cache]
DC -->|hit| RSC
DC -->|miss_or_invalidated| DB[(Supabase)]
RSC --> Prefetch[prefetchInfiniteQuery]
Prefetch --> QC[QueryClient_server]
QC --> Hydration[dehydrate_HydrationBoundary]
Hydration --> TanStack[TanStack_client]`,
                    },
                    implementation: {
                        description: [
                            "구현에서 가장 까다로운 부분은 Data Cache 키·무효화 태그·TanStack `queryKey`가 어긋나면 같은 데이터인데도 한쪽은 히트·한쪽은 미스가 나는 점이었습니다.",
                            "`queryKey`를 객체 형태로 통일하고, 서버 `prefetchInfiniteQuery`와 클라이언트 `useInfiniteQuery`가 동일 키를 쓰도록 맞췄습니다.",
                            "태그와 캐시 키를 분산 관리하면 무효화 누락이나 불일치가 발생할 수 있기 때문에, `cache-tags.ts`에 `posts`·`hashtags`·`comments`의 `unstable_cache` 래퍼에서 사용될 태그 문자열과 캐시 키 배열의 대응을 한곳에서 정리했습니다.",
                            "`/search`는 `initialData` 중심, `/posts`는 prefetch 중심이라 hydration 이후 중복 요청이 났습니다. 검색 경로에서 `initialData`를 제거하고 `prefetchInfiniteQuery` → `dehydrate` → `HydrationBoundary`로 목록과 같은 계약으로 바꿨습니다(`search/page.tsx`, `SearchResultsWrapper.tsx`). 필터가 있을 때만 쿼리를 켜고(`enabled`), 총계는 첫 페이지 메타에서 읽습니다.",
                            "polling 제거 뒤 stale 가능성은 mutation 직후 `revalidateTag`로 Data Cache를 무효화하고, 필요 시 `invalidateQueries`로 클라이언트 메모리를 비우는 연결로 보완했습니다(`actions.ts`). 정적 읽기에 맞게 `refetchOnWindowFocus` 등은 `PostWrapper.tsx`에서 정리했습니다.",
                            "좋아요는 사용자별이라 Data Cache에 넣으면 키 폭발이 날 수 있으므로 클라이언트 측 `useQuery`로 분리했고, 공용 글 스냅샷과 섞이지 않도록 별도 fetch·낙관적 업데이트로 hydration 경계를 넘겼습니다.",
                            "파일 앵커: `page.tsx`·`posts/[id]/page.tsx`는 캐시된 읽기를 RSC에서 호출하고, `actions.ts`는 글·댓글·좋아요 뒤 `revalidateTag`를 묶습니다.",
                        ],
                        codeLanguage: "tsx",
                        codeSnippet: `// SearchResultsWrapper.tsx (발췌)
const hasFilters = Boolean(q?.trim() || tag);

const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  useInfiniteQuery({
    queryKey: ["search", { q, tag }],
    queryFn: ({ pageParam }) =>
      fetchSearchPosts({ q, tag, cursor: pageParam }),
    getNextPageParam: (last) => last.nextCursor,
    initialPageParam: null as string | null,
    enabled: hasFilters,
  });

const total = data?.pages[0]?.total ?? 0;`,
                    },
                    impact: {
                        metrics: [
                            {
                                label: "DB Read 감소",
                                value: "재방문 시 DB 접근 제거",
                                description: ["요청마다 DB 접근 -> Cache"],
                            },
                            {
                                label: "중복 요청 제거",
                                value: "초기 렌더링 중복 fetch 정리",
                                description: [
                                    "SSR `prefetch`와 클라이언트 `queryKey` 불일치 -> dehydrate/hydrate 계약을 통일",
                                ],
                            },
                            {
                                label: "무효화",
                                value: "태그 단위",
                                description: [
                                    "mutation 후 `revalidateTag`로 글·댓글·해시태그 스코프만 선택 무효화",
                                ],
                            },
                        ],
                        summary: [
                            "핵심은 ‘응답 한 줄이 얼마나 빨라졌나’만이 아니라, 읽기가 DB에 매번 붙고 검색·목록 계약이 엇갈리며 폴링이 돌던 구조를 캐시 계층 + 단일 SSR 계약 + 클라이언트 정책으로 재정의한 점입니다.",
                            "Document TTFB는 동일 조건에서 전후 차이가 크지 않았고, 이는 SSR·네트워크 쪽 영향이 상대적으로 커서라고 보았습니다. 그래서 효과 해석의 중심을 DB 접근 제거와 중복 요청 제거로 옮겼습니다.",
                            "Data Cache 도입 이후 동일 데이터 재요청 시 DB 없이 스냅샷으로 응답할 수 있는 경로가 생겼고, 서버 로그·DB 쿼리 로그로 히트·미스를 구분해 검증했습니다.",
                            "TanStack Query는 dehydrate/hydrate와 `queryKey` 정렬로 서버 시드와 클라이언트 캐시를 맞춰 초기 렌더 단계의 불필요한 fetch를 줄였습니다.",
                            "정적 콘텐츠에 맞지 않던 polling·과한 refetch를 정리했습니다.",
                        ],
                    },
                },
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
            "/images/projects/seongryoung/location-before-preload.png",
            "/images/projects/seongryoung/location-after-preload.png",
        ],
        features: [
            "URL Query(`/?query=...`)로 검색 상태를 유지해 새로고침/공유 시 동일 결과를 재현했습니다.",
            "`ilike` 기반 부분 매칭 검색을 적용하고, 결과가 없을 때도 안내 UI로 검색 흐름을 유지했습니다.",
            "검색 중 로딩 인디케이터와 추천 검색어 클릭 플로우를 제공해 사용 흐름이 끊기지 않게 했습니다.",
            "검색 결과 카드에서 “위치 보기”를 통해 `/location/:id`로 이동하는 Hard navigation을 지원했습니다.",
            "위치 상세는 Intercepting/Parallel route 모달로 오버레이하는 Soft navigation을 구현했습니다.",
            "모달 오픈 시 useLayoutEffect로 body 스크롤 고정 및 top 보정을 적용해 배경 스크롤/레이아웃 흔들림을 줄였습니다.",
            "`Suspense`와 Skeleton fallback으로 초기 로딩 공백과 렌더 점프를 최소화했습니다.",
            "`generateMetadata`로 검색/상세 페이지별 SEO 및 Open Graph를 동적으로 생성했습니다.",
            "검색 결과 카드 표지 `next/image`는 lazy를 기본으로 두되, 첫 8개에만 `priority`를 주어 첫 렌더링 체감 성능 저하를 줄였습니다.",
            "고해상도 위치 지도 이미지는 ImageKit CDN + `next/image`로 전달하고, 검색 카드에서 상세·모달 진입 이전에 지도를 선요청해 전환 직후 공백과 LCP를 줄였습니다(`onMouseEnter` + 모바일 대응 `onPointerDown`).",
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
                title: "CDN 기반 이미지 서빙 구조 개선 + 이미지 preload + DB 워터폴 제거로 LCP 최적화",
                summary:
                    "메인 화면의 고해상도 책 위치 이미지가 LCP 요소로 늦게 그려지며 Slow 4G에서 LCP가 4.69s까지 지연되는 문제를, public 정적 서빙에서 Supabase Storage + ImageKit CDN로 옮겨 Cold 기준 LCP를 2.81s(약 40% 단축)까지 개선했습니다. 이어서 검색 카드→위치 상세 페이지 플로우에서는, 링크 `onMouseEnter`와 터치 환경을 고려한 `onPointerDown`에서 동일 선요청 로직을 실행해 네비게이션 이전에 이미지 요청을 미리 열었고, LCP 마커는 약 ~5.8s에서 ~4.3s로 상대 개선됐습니다. 마지막으로 모달 마운트 후 useEffect에서 Server Action을 호출해 location을 확정하던 DB 조회 워터폴을 제거해, 호버 preload와 맞물려 모달 전환 직후 이미지가 즉시 렌더링되도록 개선했습니다.",
                caseStudy: {
                    problem: [
                        "기존에는 고해상도 이미지를 Next.js `public` 디렉토리에서 직접 서빙하는 단순한 구조였습니다.",
                        "하지만, 사용자 테스트 과정에서 메인 화면의 핵심 콘텐츠인 ‘책 위치 이미지’가 늦게 렌더링되는 문제가 확인되었습니다.",
                        "해당 이미지는 페이지에서 가장 큰 영역을 차지하는 LCP 요소였고, 로딩 지연으로 초기 화면이 비어 보이는 시간이 길어져 Slow 4G 환경 기준 LCP가 4.69s까지 증가하는 등 첫 방문 품질이 특히 나빠졌습니다.",
                    ],
                    investigation: [
                        "원인을 좁히기 위해 Chrome DevTools의 Performance, Network, Lighthouse를 병행해 측정했습니다.",
                        "JPEG 기준 약 76KB 용량에 네트워크 다운로드만 약 2.45s가 소요되는 구간이 있었고, 전송 데이터 크기 자체가 병목임이 드러났습니다.",
                        "동시에 LCP 후보 이미지에 대해 리소스 요청 시작이 늦고, 우선순위가 상대적으로 낮게 잡히는 Resource Load Delay도 함께 관찰되었습니다.",
                        "캐시가 채워진 Warm 상태에서는 체감이 나아보여도, Cold Start에서는 동일 구조가 반복적으로 성능 저하를 만들었습니다.",
                        "결국, 문제의 본질은 서버 응답 속도가 아니라 전송 데이터 크기와 요청 타이밍의 결합으로 재정의했고, 이미지 전달 경로와 포맷·크기·선요청 전략을 함께 바꾸는 방향으로 Solution을 설계했습니다.",
                        "또 기존 구조에서는 검색 결과 카드 리스트에서 링크를 클릭하여 이미지를 렌더링하는 상세 페이지에 진입한 뒤(네비게이션 직후)에야 이미지 다운로드가 본격화되는 방식이었기에, 이를 해결하기 위해 '전환 전에' 같은 이미지에 대한 네트워크를 미리 요청하는 방향을 검토했습니다.",
                        "preload 최적화 이후에도 남은 문제가 있었습니다. 모달(`@locationModal`)은 클라이언트 컴포넌트로, 마운트 후 `useEffect`에서 Server Action(`getBookLocation`)을 호출해 DB로부터 `location` 번호를 받아온 뒤에야 `<Image>`를 렌더했습니다. 이미지 자체는 이미 캐시에 있어도 DB 응답이 돌아오기 전까지는 skeleton이 표시되는 구조였습니다.",
                        "즉 '클릭 → 모달 마운트 → useEffect → DB 조회 → location 확정 → 이미지 렌더'의 순서적 워터폴이 preload의 효과를 상쇄하고 있었습니다. `ToLocationButton`은 이미 `location` prop을 갖고 있었으므로, 이를 URL 쿼리 파라미터로 전달하면 모달이 마운트 직후 동기적으로 location을 읽을 수 있다고 판단했습니다.",
                    ],
                    solution: [
                        "1) 전달 방식 비교 및 ImageKit 채택",
                        "Next.js 내장 Image Optimization, Cloudflare Images, ImageKit을 비교했고 ImageKit을 선택했습니다.",
                        "Next.js 내장만으로는 변환이 서버에서 발생하므로 트래픽 증가 시 비용과 부하가 커질 수 있고, Cloudflare Images는 운영 관점에서 추가 파이프라인 구성이 필요했습니다.",
                        '반면 ImageKit은 URL 파라미터 기반 실시간 변환과 글로벌 Edge 캐싱을 제공하고, 기존 Storage(Supabase)와의 연동이 비교적 단순해 "변환 + 캐싱 + 전달"을 한 경로에서 처리할 수 있어 선택했습니다.',
                        "2) 이미지 경로 분리",
                        "구조적 병목을 줄이기 위해 이미지 경로를 분리했습니다. 책 표지 등 가벼운 기존 리소스는 Supabase URL을 유지하고, 위치 지도처럼 대용량이자 LCP에 영향이 큰 이미지는 ImageKit 경로로 변경했습니다.",
                        "3) 커스텀 로더와 포맷·크기 최적화",
                        "CDN 기반 ImageKit 경로에는 next/image 커스텀 로더가 `tr=w-{width},q-{quality},f-auto`를 부여하도록 구성해 포맷 자동 선택과 폭 기반 리사이징을 동시에 적용했습니다.",
                        "4) LCP 후보별 priority",
                        "페이지별 렌더링 우선순위를 다르게 했습니다. 풀 페이지(`/location/[id]`)에서는 상단 표지에 `priority`를 두고, 인터셉트 모달에서는 지도가 메인 컨텐츠로 화면 대부분을 차지하므로 지도에 `priority`를 적용했습니다.",
                        "5) 네비게이션 전 선요청(preload)",
                        "전달 경로와 포맷을 정리한 뒤에도 검색 카드→위치 상세(모달)에서는 전환 직후에야 지도 바이트가 크게 움직여 LCP가 늦게 잡히는 체감이 남았습니다.",
                        "사용자가 아직 상세 화면에 없을 때부터 그 화면에서 LCP가 될 지도 이미지 요청을 미리 시작해, 클릭 이후 LCP 타임라인에서 다운로드가 끝나 있거나 앞서가게 만들기로 했습니다.",
                        "6) ToLocationButton과 URL 정합성",
                        "`ToLocationButton`에서는 데스크톱에서 포인터가 링크 위에 올라올 때(`onMouseEnter`) 선요청을 걸고, 모바일 등 호버가 없을 수 있어 같은 핸들러를 `onPointerDown`에도 연결해 탭 직전에 네트워크를 열 수 있게 했습니다.",
                        "url은 상세에서 실제로 그려지는 변환 URL과 동일한 규칙으로 만들기 위해 `getLocationMapPreloadUrl`(내부적으로 로더와 같은 `w,q,tr` 조합)을 사용했습니다.",
                        "7) location을 URL 쿼리 파라미터로 전달해 DB 조회 워터폴 제거",
                        "`ToLocationButton`의 링크 href에 `?loc=N`을 추가해 모달이 마운트 직후 `useSearchParams()`로 location을 동기적으로 읽도록 변경했습니다. `loc` 파라미터가 있으면 Server Action 호출을 건너뛰고, 파라미터 없이 직접 URL에 접근하는 경우에는 기존 DB 조회 로직이 폴백으로 실행되어 hard navigation에서도 정상 동작을 유지합니다.",
                        "이러한 설계를 구조 관점에서 보면 다음과 같은 흐름으로 정리할 수 있습니다.",
                    ],
                    solutionCode: {
                        caption:
                            "location을 URL 파라미터로 전달해 DB 조회 없이 모달 마운트 직후 이미지 렌더링",
                        codeLanguage: "tsx",
                        codeSnippet: `// ToLocationButton.tsx — 변경 전
<Link href={\`/location/\${bookId}\`}>위치 보기</Link>

// ToLocationButton.tsx — 변경 후
<Link href={\`/location/\${bookId}?loc=\${location}\`}>위치 보기</Link>

// @locationModal/(.)location/[id]/page.tsx — 변경 후
const searchParams = useSearchParams();
const locFromUrl = searchParams.get("loc");
const [location, setLocation] = useState<number | null>(
  locFromUrl !== null ? Number(locFromUrl) : null,
);

useEffect(() => {
  if (location !== null) return; // loc 파라미터 있으면 DB 조회 생략
  // 직접 URL 접근 시 폴백으로 DB 조회
  const getBookData = async () => { ... };
  getBookData();
}, []);`,
                    },
                    architectureIntro: [
                        "기존에는 브라우저 요청이 Next.js 서버를 거쳐 `public` 정적 이미지를 직접 내려받는 단일 경로였습니다.",
                        "개선 이후에는 브라우저가 Next.js로부터 HTML을 받고, 위치 지도는 ImageKit Edge(변환·캐시), 책 표지는 Supabase Origin으로 각각 직접 요청하는 이중 경로로 분리했습니다.",
                        "CDN 경로를 바꾸는 옵션이 아니라 preload 힌트로 요청 시점을 앞당기는 역할인 `priority`를 적용해, 전달 경로(어디서 받는가)와 요청 시점(언제 받는가)을 분리 제어할 수 있도록 하여 Cold Start 편차와 LCP 지연을 함께 줄입니다.",
                        "검색 카드에서 호버 또는 포인터 다운 시 아직 상세 라우트로 가기 전에 지도(LCP 후보)에 대한 네트워크를 시작해, 클릭·터치 이후 타임라인에서 이미지가 늦게 붙는 구간을 줄입니다.",
                        "3단계에서는 데이터 흐름 구조를 바꿨습니다. 기존에는 '클릭 → 모달 마운트 → useEffect → DB 조회 → location 확정 → 이미지 렌더'로 이어지는 순차 워터폴이 존재했습니다. location을 URL 파라미터(`?loc=N`)로 전달함으로써 모달이 마운트되는 시점에 location이 이미 확정되어, 이미지 렌더링이 DB 응답을 기다리지 않아도 됩니다. preload로 이미지가 캐시에 올라와 있는 상태와 결합되면, 전환 직후 skeleton 없이 즉시 이미지가 표시됩니다.",
                    ],
                    diagram: {
                        before: `flowchart TD
Browser[Browser] --> NextServer[Next.js Server]
NextServer --> PublicDir[public Static Images]
Browser -->|"클릭 후"| Modal[Modal Mount]
Modal -->|useEffect| ServerAction[Server Action getBookLocation]
ServerAction -->|DB 조회| DB[(Supabase DB)]
DB -->|location 반환| Modal
Modal -->|location 확정 후| Image[이미지 렌더]`,
                        after: `flowchart TD
Browser[Browser] --> NextHTML["Next.js HTML + preload hint"]
Browser -->|"hover/pointerdown"| IKPreload["ImageKit CDN (Preload)"]
Browser -->|"클릭 후"| Modal["Modal Mount (location = URL params)"]
Modal -->|"즉시"| Image["이미지 렌더 (캐시 히트)"]`,
                    },
                    implementation: {
                        description: [
                            "next.config에서 `images.loaderFile`과 `remotePatterns`를 설정해 ImageKit·Supabase 호스트를 명시적으로 허용하고, 로더 규칙을 전역에서 일관 적용했습니다.",
                            "위치 지도 URL은 `getLocationImageSrc`로 ImageKit 엔드포인트를 사용하고, `LOCATION_MAP_IMAGE_SIZES` 상수와 `fill`을 결합해 실제 레이아웃 폭에 맞는 요청만 내려가도록 조정했습니다.",
                            "풀 페이지에서는 상단 표지(`getImageSrc`)에 `priority`를 두고 지도는 non-priority로 운영했으며, 모달 라우트에서는 지도에 `priority`를 적용해 화면 점유율에 맞게 우선순위를 분기했습니다.",
                            "`ToLocationButton`에서 `getLocationMapPreloadUrl`로 변환 URL을 잡아 `new Image()`로 선요청하며, `onMouseEnter`뿐 아니라 모바일을 고려해 `onPointerDown`에도 동일 핸들러를 연결했습니다. 목표는 전환 전에 바이트 전송을 시작해 LCP가 측정되는 순간까지의 대기를 줄이는 것입니다.",
                            "`ToLocationButton`의 href에 `?loc=N`을 추가하고, 모달 컴포넌트는 `useSearchParams()`로 마운트 시점에 동기적으로 location을 읽도록 변경했습니다. `useState` 초기값을 URL 파라미터로 설정하므로 `useEffect`가 실행될 필요가 없어 DB 조회 워터폴이 사라집니다. `?loc` 파라미터가 없는 직접 URL 접근이나 새로고침에서는 기존 DB 조회 폴백이 실행되어 hard navigation에서도 정상 동작합니다.",
                            "1~3단계 모두 '어디서 파일을 두느냐'보다 '어떤 포맷·크기·언제 요청을 열 것인가, 그리고 렌더에 필요한 데이터를 언제 확정하는가'에 초점을 두고, 각각 측정 맥락에 맞는 지표로 검증했습니다.",
                        ],
                        codeLanguage: "tsx",
                        codeSnippet: `// ToLocationButton.tsx (발췌) — preload + ?loc 파라미터 전달
const preloadLocationMap = () => {
  const img = new Image();
  img.src = getLocationMapPreloadUrl(
    location,
    window.innerWidth,
    window.devicePixelRatio
  );
};
// 데스크톱: 호버 / 모바일·터치: 다운 시점에도 선요청
onMouseEnter={preloadLocationMap}
onPointerDown={preloadLocationMap}

// href에 loc 파라미터 포함 — 모달이 마운트 즉시 location을 동기적으로 읽음
<Link href={\`/location/\${bookId}?loc=\${location}\`}>위치 보기</Link>

// @locationModal/(.)location/[id]/page.tsx (발췌)
const locFromUrl = searchParams.get("loc");
const [location, setLocation] = useState<number | null>(
  locFromUrl !== null ? Number(locFromUrl) : null,
);
// loc 있으면 useEffect에서 DB 조회 생략 → 이미지 즉시 렌더
useEffect(() => {
  if (location !== null) return;
  const getBookData = async () => { ... };
  getBookData();
}, []);`,
                    },
                    impact: {
                        metrics: [
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
                                    "약 35% 단축",
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
                            {
                                label: "LCP (1단계, Cold·Slow 4G)",
                                value: "4.69s → 2.81s",
                                description: ["약 40% 단축", "Cold 기준"],
                            },
                            {
                                label: "LCP (2단계, preload)",
                                value: "~5.8s → ~4.3s",
                                description: ["약 25% 단축"],
                            },
                            {
                                label: "모달 이미지 렌더 지연 (3단계, DB 워터폴 제거)",
                                value: "DB 조회 대기 → 즉시 렌더 (0ms)",
                                description: [
                                    "soft navigation 경로에서 Server Action 호출 완전 제거",
                                    "MCP 브라우저 측정: 모달 오픈 후 ImageKit 이미지 transferSize 0B (캐시 히트, ~1ms 렌더)",
                                    "preload(~132ms 선취득)와 맞물려 skeleton 표시 구간 사라짐",
                                    "hard navigation(직접 URL 접근)에서는 DB 조회 폴백으로 정상 동작 유지",
                                ],
                            },
                        ],
                        summary: [
                            "1단계에서는 책 표지와 위치 지도의 전달 경로를 분리하고, ImageKit·`next/image`의 `priority`·`sizes`로 전송 바이트와 첫 화면 요청 시점을 줄였습니다. CDN은 최적화된 이미지를 Edge에서 전달하는 역할을 담당했습니다.",
                            "2단계에서는 상세·모달로 넘어가기 전에 LCP가 될 지도 이미지에 대한 요청을 열고, 데스크톱은 `onMouseEnter`, 터치 환경은 `onPointerDown`으로 같은 선제 로딩을 두어 클릭 이후 LCP 타임라인에서 다운로드가 뒤늦게 붙는 구간을 줄이는 데 초점을 맞췄습니다.",
                            "3단계에서는 데이터 흐름 자체를 바꿨습니다. 모달이 마운트된 뒤 useEffect에서 Server Action으로 DB를 조회하는 순차 워터폴을 `?loc=N` URL 파라미터로 대체해, location이 마운트 시점에 이미 확정되도록 했습니다. 이미지가 preload로 캐시에 올라와 있는 상태와 결합되면 전환 직후 skeleton 없이 즉시 이미지가 표시되어, 1·2단계로 확보한 성능 여유를 실제 체감으로 연결합니다.",
                        ],
                    },
                },
            },
        ],
    },
];
