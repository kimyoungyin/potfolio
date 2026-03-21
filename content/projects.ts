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
        images: [],
        features: [
            "Feature placeholder 1",
            "Feature placeholder 2",
            "Feature placeholder 3",
        ],
        techStack: [
            "Next.js 15",
            "React 18",
            "TypeScript 5",
            "TanStack Query 5",
            "Zustand 4",
            "React Hook Form",
            "Zod",
            "Axios",
            "Tailwind CSS",
            "Radix UI",
            "ESLint 9",
            "Husky",
        ],
        liveUrl: "https://lala.harvester.kr",
        githubUrl: "",
        challenges: [
            {
                title: "RHF + Zod 도입: 폼 아키텍처 리팩터링",
                summary:
                    "폼 로직을 단일 훅에 몰아 넣은 구조가 유지보수·확장을 막고 있었고, 리렌더만이 아니라 ‘상태·검증·타입을 어느 층에 둘지’까지 재정의해 RHF+Zod로 책임을 나눴습니다. 핵심 훅 코드 74% 감소와 검증·조립 구조의 단일화가 함께 따라왔습니다.",
                caseStudy: {
                    problem: [
                        "폼 로직을 단일 훅에 집중시키는 구조 때문에 상태 관리, 검증, Create/Edit 분기가 한곳에 뒤엉켜 유지보수와 확장이 어려워졌습니다.",
                        "구체적으로 use-scenario-form-state.ts(592줄) 하나에 상태(useState 9개)·ref(useRef 4개)·submit 시 수동 validation(if-else 약 25줄)·모드 분기가 모두 있었고, 230줄짜리 조립 컴포넌트는 그 결과를 props drilling으로 전달했습니다.",
                        "초기에는 폼을 훅으로 캡슐화하면 조립 층이 단순해지고 선언적으로 읽힐 거라 기대했습니다. 실제로는 규칙과 임시 입력까지 훅 안으로 몰리며 복잡도가 줄기보다 훅 내부에 숨은 형태가 됐고, 수정·추적·디버깅 부담이 커졌습니다.",
                        "추가로 useState 기반 제어 패턴은 필드가 늘수록 상위 상태 갱신이 잦아져 불필요한 리렌더와, 저사양·다필드에서는 입력 지연 같은 성능 리스크로 이어질 수 있었습니다.",
                    ],
                    investigation: [
                        "문제를 단순한 리렌더 이슈로만 보지 않고, 폼 상태·검증·타입을 어느 층(스키마, 폼 라이브러리, 훅, UI)에 둘지로 재정의했습니다.",
                        "기존 방식의 한계로는 세 가지를 짚었습니다. 값마다 상위 useState를 갱신하는 제어 컴포넌트는 트리가 커질수록 리렌더 비용이 커질 수 있고, 수동 if-else validation은 로직이 훅과 submit 경로에 흩어져 일관성이 떨어지며, 단일 훅은 책임이 과다해 한 줄을 고칠 때 파급이 크다는 점입니다.",
                        "대안으로 React.memo를 먼저 검토했습니다. 제어 폼에서는 입력마다 부모 formData가 바뀌어 자식을 memo로 감싸도 value·onChange·인라인 핸들러·매번 새 객체 props 때문에 얕은 비교를 통과하지 못하는 경우가 흔하고, props가 많을수록 useCallback·useMemo에 의존하게 됩니다. 구조적 부채(분산된 검증, Create/Edit 단일 훅)는 memo만으로는 남습니다.",
                        "React Hook Form은 ref 기반 비제어로 입력을 추적해 useWatch 범위 위주로 구독을 줄일 수 있어, 당시 구조의 ‘매 타이핑마다 상위 상태 흔들기’와 맞물린 문제를 완화하는 데 적합한 대안이라 봤습니다.",
                        "Zod는 z.infer로 타입을 스키마에서 끌어와 이중 정의를 없애고, superRefine으로 날짜 역전·배타 규칙 같은 복합 검증을 한곳에 둘 수 있습니다. zodResolver로 RHF와 붙이면 제출 시점의 유효성도 스키마와 같은 규칙을 쓰게 되어, 수동 if-else와 화면 쪽 판단이 어긋날 여지를 줄일 수 있다고 봤습니다.",
                        "정리하면 RHF+Zod는 재렌더 범위 완화, 검증·타입의 단일화, 훅 책임 분리·Context 기반 조립까지 한 번에 정리할 수 있어 이 조합으로 가기로 결론을 내렸습니다.",
                    ],
                    solution: [
                        "복잡도를 줄이기 위해 추상화 레이어를 더 쌓기보다, 책임을 나누는 방향으로 구조를 재설계했습니다. 훅을 더 감싸 늘리지 않고 네 가지로 나눴습니다.",
                        "첫째, 스키마를 base → create/edit으로 계층화했습니다. 공통 필드는 baseScenarioFormSchema에 두고 Create 전용 validation(platforms 최소 1개·날짜 역전 등)은 extend + superRefine으로 분리해, 공통 규칙 변경과 생성 전용 규칙 변경의 영향 범위를 나눴습니다.",
                        "둘째, 단일 훅을 use-create-scenario-form(78줄)과 use-scenario-edit-form(78줄)으로 완전히 나눴습니다. Create/Edit 분기를 훅 밖으로 빼 한 훅이 초기화·제출 조율만 담당하게 해, 한 모드를 고칠 때 다른 모드로의 오염을 줄였습니다.",
                        "셋째, ScenarioFormContent는 FormProvider만 제공하고 하위가 useFormContext()로 폼 상태에 접근하게 했습니다. 조립 컴포넌트에서 props drilling을 없애 필드 단위 수정 시 넘겨줄 인자 수를 줄였습니다.",
                        "넷째, 키워드·제외키워드 배타 규칙은 FormKeywords가 Context로 직접 집행하게 했습니다. 훅은 폼 생명주기만 맡기고 UI 근처 규칙은 컴포넌트에 두어, 규칙 변경 시 훅 파일을 건드릴 필요를 줄였습니다.",
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
                            "그 결과 단일 훅에 숨겨져 있던 복잡도를 스키마·훅(create/edit)·컴포넌트로 나눠, 구조적으로 관리·확장할 수 있는 형태로 바뀌었습니다.",
                        ],
                    },
                },
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
