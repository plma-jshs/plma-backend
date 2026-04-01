# PLMA Backend

NestJS + Drizzle ORM 백엔드입니다.

## 필수 환경 변수

기본값 없이 아래 값이 모두 필요합니다.

```env
PORT=3000
DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/DB_NAME
CORS_ORIGINS=https://plma.jshsus.kr,https://iam.jshsus.kr,http://localhost:3000,http://localhost:5173
IAM_CHECK_SESSION_URL=https://iam.jshsus.kr/check-session
```

## 실행

```bash
pnpm install
pnpm start:dev
```

## 빌드/테스트

```bash
pnpm run build
pnpm test
pnpm test:e2e
```

## DB (Drizzle)

```bash
pnpm run db:generate
pnpm run db:push
pnpm run db:studio
```

## 문서

- Swagger: `http://localhost:3000/api/docs`

## API 정책

목록 조회 API는 아래 기본 정렬과 페이지네이션 규칙을 따릅니다.

- Cases 목록(`GET /api/cases`): `id ASC`
- Case Schedules 목록(`GET /api/cases/schedules`): `date ASC`
- Dorm Reports 목록(`GET /api/dorms/reports`): `id DESC`

페이지네이션 규칙:

- 기본값: `page=1`, `size=20`
- 최대값: `size <= 100`
- 응답 메타 규격: `meta.total`, `meta.page`, `meta.size`, `meta.lastPage`
