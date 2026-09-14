# Fact-check prompts for the AutoSRE and SentinelSOL sites

Two self-contained prompts. Run each in a **fresh Claude Code session inside that repo**, not here.

- AutoSRE site: `~/Developer/Auto-SRE/frontend/index.html`
- SentinelSOL site: `~/Developer/SentinelSOL/frontend/` (Next.js)

Both prompts assume no prior context, so paste them whole.

---

## PROMPT 1 — AutoSRE

```
You are auditing the AutoSRE project website in this repository for factual accuracy.
The website lives in frontend/. The CODE IN THIS REPO IS THE SOURCE OF TRUTH, not the
website copy, not the README, and not my memory.

This site is read by recruiters and engineers who may also read my CV and my portfolio
at shamza31.vercel.app. All three must say the same thing.

## METHODOLOGY, READ THIS FIRST

Before you declare any claim false, search BROADLY. A previous audit wrongly concluded
that a real feature was invented, because it searched `-name "Dockerfile*"` and missed a
file named `network-daemon.Dockerfile`. Deleting a true claim is a worse outcome than
leaving a vague one.

For every claim, before concluding "unsupported":
- grep the whole repo, including docs/, deployments/, configs/, and dotfiles
- try suffix and prefix variants of filenames
- check docs/adr/ and docs/operations.md, which document design decisions
- if you find a claim in the docs but not the code, say exactly that, do not guess

## VERIFIED TRUE — do not weaken or remove these

These were checked against the code on 14 Sep 2026. If the site states any of them,
leave them. If the site omits them, consider adding, because they are real and undersold:

- Chaos framework injecting latency, errors, CPU burn and memory pressure via a REST
  control plane. Bounded at two layers, time-limited, self-reverting.
- Control plane, health probes and metrics endpoints are exempt from injection, so the
  abort path can never be made unreachable.
- Errors spread deterministically via a Bresenham accumulator (shared/autosre_shared/chaos.py).
- Memory injector touches one byte per page to force real commit.
- Three-state circuit breaker (closed/open/half-open), thread-safe, injectable clock,
  pluggable store ABC, Prometheus state metrics (shared/autosre_shared/resilience/circuit_breaker.py, 273 lines).
- Token-bucket rate limiting middleware returning 429 with Retry-After.
- RED metrics via ASGI middleware with bounded label cardinality (route templates, not raw paths).
- p95 500ms SLO with a 750ms alert threshold, defined as Prometheus rules.
- tests/test_alerts.py unit-tests the alert rules themselves, asserting every alert
  carries severity, summary, description and runbook_url.
- 9-job CI: ruff, gofmt, go vet, go test, mypy, pytest, Bandit, Trivy, pip-audit,
  govulncheck, Docker build validation, promtool validation, Grafana provisioning
  validator, release job.
- Third-party actions pinned to commit SHAs. NOTE: only softprops/action-gh-release and
  aquasecurity/trivy-action are SHA-pinned; the other 20 `uses:` are GitHub's own
  actions/* on tags. The claim is correct as written because those two are the only
  genuinely third-party actions. Keep it, and if the site elaborates, state it that way.
- Container hardening via a reusable x-app-hardening YAML anchor: read_only, cap_drop ALL,
  no-new-privileges, tmpfs /tmp, CPU and memory limits, stop_grace_period.
- Non-root: USER 10001 in api/auth/worker/tests Dockerfiles.
- Distroless Go daemon: deployments/docker/network-daemon.Dockerfile uses
  gcr.io/distroless/static-debian12:nonroot, uid 65532, CGO_ENABLED=0 static binary.
- Coverage: coverage.xml reports 94.0% line and 85.5% branch. 55 Python tests, 19 Go tests.
- Correlation-ID propagation as pure ASGI middleware, not BaseHTTPMiddleware.
- Security headers: CSP default-src 'none', frame-ancestors 'none', HSTS,
  X-Frame-Options DENY, nosniff, referrer-policy, permissions-policy.
- 6 ADRs in docs/adr/ and 3 game-day postmortems in docs/postmortems/, each with a
  Reproduce command.

## BLOCKLIST — these are false, flag and remove any occurrence

- "self-healing", "automated recovery", "auto-remediation", "recovery playbook".
  The repo argues AGAINST this in eight places. docker-compose.yml comment: restarts are
  a deliberate operator action, not auto-remediation. Alertmanager is commented out in
  prometheus.yml. AutoSRE observes and notifies; a human follows the runbook.
- "50ms p95". The real SLO is p95 under 500ms, alert above 750ms for 5 minutes.
  The 0.05 in the repo is a histogram bucket boundary and the 5% error-rate threshold.
- "concurrency cap". It is a token-bucket RATE limiter. In-flight concurrency is measured
  (http_requests_in_progress) but never bounded. No semaphore exists.
- "the service rejoins rotation". Nothing consumes readiness: no load balancer, no
  replicas, no mesh, and depends_on has no condition: service_healthy.
- "CI/CD" implying deployment. ci.yml says deployment is intentionally NOT implemented;
  it validates, builds and tags, and never deploys.
- Any claim that the project is "production" or serving real users. It is a local
  Docker Compose stack.
- Any AI/ML claim. There is none in this repo.

## DATES AND POSITIONING, must match the CV exactly

- AutoSRE: Feb 2026 to Jul 2026. Not "ongoing", not "Dec 2025". Last commit 15 Jul 2026.
- Describe it as a "chaos engineering and resilience platform", not a monitoring tool
  and not a self-healing system.
- Author: Hamza Shaikh. Site Reliability, DevOps, Cloud Infrastructure.
  M.Sc. Computer Science, RPTU Kaiserslautern-Landau, Oct 2025 to Expected 2027,
  Specialisation 1 Distributed Systems, Specialisation 2 Software Engineering.
- Links: github.com/Raynzler, linkedin.com/in/shamza31, shamza31.vercel.app

## CANONICAL WORDING — three surfaces must agree

These are the EXACT words already used elsewhere. The site does not have to copy them
verbatim, but it must not contradict them, and the facts must match.

### From the CV (verbatim, this is authoritative)

AutoSRE: Chaos Engineering Platform | Python, Go, FastAPI, Prometheus, Docker, GitHub Actions
Feb. 2026 - Jul. 2026

- Built a chaos engineering framework injecting latency, errors, CPU burn and memory
  pressure into live services through a REST control plane. Experiments are bounded,
  time-limited and self-reverting; the control plane, health probes and metrics endpoints
  are exempt from injection so the abort path can never be made unreachable.
- Made experiments reproducible rather than random: errors are spread deterministically
  across requests, and the memory injector touches one byte per page to force real commit
  instead of a lazy allocation.
- Implemented a three-state circuit breaker (closed, open, half-open) with an injectable
  clock for deterministic tests, a pluggable store interface and Prometheus state metrics,
  plus token-bucket rate limiting middleware returning 429 with Retry-After.
- Instrumented RED metrics through ASGI middleware with bounded label cardinality; defined
  a p95 500ms SLO with a 750ms alert threshold as Prometheus rules, unit-tested to assert
  every alert carries severity and a runbook link.
- Hardened the delivery path: 9-job CI running Bandit, Trivy, pip-audit and govulncheck
  with third-party actions pinned to commit SHAs; containers run read-only and non-root
  with all capabilities dropped and a distroless image for the Go daemon.
- 93.9% line coverage on the shared platform library. Documented with architecture
  decision records and game-day postmortems, each carrying a command to reproduce the
  incident.

### From the portfolio at shamza31.vercel.app (verbatim, currently live)

tagline: "Chaos engineering platform: inject failure into live services and prove the
resilience patterns hold."

description: "Injects latency, errors, CPU burn and memory pressure into live services
through a REST control plane. Experiments are bounded, time-limited and self-reverting.
RED metrics via ASGI middleware against a p95 500ms SLO, alerting at 750ms."

stack: Python, FastAPI, Prometheus, Docker, Docker Compose, GitHub Actions
status badge: "active"   <- QUESTIONABLE, last commit was 15 Jul 2026. Flag if the site
                            also claims active or ongoing development.
pipeline stages: FastAPI service / RED metrics -> Prometheus scrape + recording rules ->
                 Alertmanager thresholds -> Runbook-linked alert, human responder

If the project site contradicts either of the above, the site is wrong. If the site says
something TRUE that neither of the above mentions, keep it and tell me, because it may be
worth adding to the CV.

## WHAT TO DO

1. Read every file under frontend/ including hidden text, meta tags, OpenGraph tags,
   alt text, aria-labels, JSON-LD, and any copy inside scripts.
2. For each factual claim, classify:
   - VERIFIED, cite the file and line that proves it
   - OVERSTATED, give the strongest fully defensible rewrite
   - FALSE, quote the code that contradicts it
   - UNVERIFIABLE, say what evidence would settle it
3. Correct FALSE and OVERSTATED claims in place. Do NOT touch the visual design.
4. Do not invent metrics. If a number is missing, say what kind would help.
5. Re-run the full sweep after editing to catch anything you missed.
6. Run whatever build, lint and typecheck the repo has, and report results.

## REPORT

1. Claims verified, with file:line evidence
2. Claims rewritten, before and after
3. Claims removed, and the code that disproves them
4. Anything you could not verify either way
5. Anything a technical interviewer could still challenge
```

---

## PROMPT 2 — SentinelSOL

```
You are auditing the SentinelSOL project website in this repository for factual accuracy.
The website lives in frontend/ (Next.js). THE CODE IN THIS REPO IS THE SOURCE OF TRUTH,
not the website copy, not the README, not the pitch deck, and not my memory.

This site is read by recruiters and engineers who may also read my CV and my portfolio
at shamza31.vercel.app. All three must say the same thing.

## METHODOLOGY, READ THIS FIRST

Search broadly before declaring anything false. A previous audit wrongly called a real
feature invented because it used too narrow a filename glob. Deleting a true claim is
worse than leaving a vague one. Check docs, configs, compose files and dotfiles, and try
filename variants, before concluding "unsupported".

## THE BIGGEST PROBLEM IN THIS REPO

tools/mock-jito/main.go is a MOCK EXPORTER. Its first line says "Mock Jito metrics
exporter for demo/video purposes only". It generates:
  jito_shred_receive_latency_ms  = rand.Float64()
  jito_bundle_accepted_total     = rand.Intn(4)

Any website claim about Jito, ShredStream, block engine, bundle acceptance, or
revenue-aware signals is presenting randomly generated numbers as real telemetry.
Find every one and remove it. Also check any dashboard screenshot for panels titled
"Jito: ShredStream Ingestion Latency" or "Jito: Block Engine Bundles Accepted"; if a
screenshot shows them, flag the image itself, not just the caption.

The daemon polls stock Solana JSON-RPC (getVoteAccounts, getSlot). Nothing in it is
Jito-specific.

## VERIFIED TRUE — do not weaken or remove these

Checked against code on 14 Sep 2026:

- Go telemetry daemon polling a Solana validator's JSON-RPC out of process into
  Prometheus (cmd/sentinelsol/main.go).
- Exponential backoff retrying only transient failures, timeouts and 5xx (main.go:76, 97).
- 5-second HTTP client timeout, to prevent goroutine leaks when the RPC is degraded
  (main.go:24).
- Both endpoints scraped concurrently under a sync.WaitGroup so the two metrics share a
  timestamp and cannot drift (main.go:153-162).
- pprof bound to 127.0.0.1:6060 rather than 0.0.0.0, avoiding a profiling and DoS
  surface (main.go:189).
- 3-sigma Z-score anomaly detection on vote velocity as Prometheus recording and alerting
  rules, against a rolling ONE-HOUR baseline (config/alerts.rules.yml uses [1h]), with
  for: 2m.
- Alertmanager routing to Telegram.
- The detection blind spot fix (commit 5d85ee8): the original rule divided vote-credit
  rate by slot rate; when the validator stalls the denominator goes to zero and the
  expression becomes undefined, silencing the alert at exactly the moment it exists to
  catch. Replaced with a plain rate. THIS IS THE BEST STORY IN THE REPO, feature it.
- Docker Compose stack for single-command bare-metal deployment, Grafana dashboards
  provisioned as code.
- Award: Winner, Superteam Germany / neosfer Solana Ideathon, Frankfurt 2026.

## BLOCKLIST — false, remove every occurrence

- Jito, ShredStream, block engine, bundle acceptance, "revenue-aware". See above.
- "72-hour baseline" or "72h". It is one hour. The README says so too.
- "5s refresh cadence". The Go poll loop sleeps 10s, and Prometheus scrape_interval and
  evaluation_interval are both 10s. 5s is only the Grafana UI refresh setting.
- "P0-P4 severity". Two alerts exist, both severity: critical.
- "4-12 minute window before delinquency". Appears nowhere in the repo, unsourced.
- "testnet fault-injection validation" or any claimed test run. There are no chaos
  scripts, zero Go test files, logs/ holds only .gitkeep, and the only validator log is
  a gitignored local test-ledger on cluster_type=3 (Development).
- Multi-validator or per-validator baselines. The vote account is a hardcoded Go constant
  (main.go:27). One validator, no by() grouping, no per-validator label.
- "Built solo". The repo has a second contributor with roughly 7 commits. If the site
  implies sole authorship, soften to shared attribution.
- "Out-of-band with zero hot-path impact" stated as the default. Default RPC_URL is
  host.docker.internal:8899 and docker-compose.prod.yml uses network_mode: host, so the
  default deployment is on the same host as the validator. The isolated-host path is
  documented, not default. Use: "Runs as a separate process from the validator, with a
  configurable RPC endpoint so it can be deployed on an isolated host."
- Any claimed incident with an outcome, such as "0 slots lost" or a detect-to-page time
  like 1m13s. No such event is recorded anywhere. 1m13s is also arithmetically impossible
  against a 10s poll, 10s scrape and for: 2m; the real end-to-end path exceeds 2 minutes.
  If the site narrates an incident, reframe it as a DESIGN walkthrough of the detection
  path, clearly labelled as design rather than history.

## DATES AND POSITIONING, must match the CV exactly

- SentinelSOL: Sep 2025 to May 2026.
- Describe it as "Distributed Validator Node Monitoring", with Solana named in the detail.
- Author: Hamza Shaikh. Site Reliability, DevOps, Cloud Infrastructure.
  M.Sc. Computer Science, RPTU Kaiserslautern-Landau, Oct 2025 to Expected 2027.
- Links: github.com/Raynzler, linkedin.com/in/shamza31, shamza31.vercel.app

## SECURITY CHECK WHILE YOU ARE HERE

This repo is PUBLIC. A literal Telegram bot token sat in config/alertmanager.yml between
19 Apr and 7 May 2026, and is still readable in git history. It was rotated in commit
0357986 and HEAD now uses ${TELEGRAM_BOT_TOKEN}. Confirm no literal credential exists at
HEAD or in frontend/. Do NOT rewrite git history. Do NOT print any token value you find;
report only the file and line.

## CANONICAL WORDING — three surfaces must agree

These are the EXACT words already used elsewhere. The site does not have to copy them
verbatim, but it must not contradict them, and the facts must match.

### From the CV (verbatim, this is authoritative)

SentinelSOL: Distributed Validator Node Monitoring | Go, Prometheus, PromQL, Alertmanager, Grafana
Sep. 2025 - May 2026

- Built a Go telemetry daemon polling a Solana validator's JSON-RPC out of process into
  Prometheus; backoff retries only transient failures, and both endpoints scrape
  concurrently under a WaitGroup so the metrics share a timestamp.
- Implemented 3-sigma Z-score anomaly detection on vote velocity as Prometheus recording
  and alerting rules against a rolling one-hour baseline learned from the node's own
  history, routed through Alertmanager to Telegram.
- Fixed a detection blind spot: the original rate-ratio rule went undefined as the
  validator stalled, silencing the alert at exactly the moment it existed to catch.
- Packaged the full telemetry stack with Docker Compose for single-command bare-metal
  deployment, with Grafana dashboards provisioned as code.
- Winner, Superteam Germany / neosfer Solana Ideathon, Frankfurt (2026). Also submitted to
  the Colosseum Frontier hackathon.

Note the award wording is "Winner", NOT "3rd place". If the site says 3rd place, change it.

### From the portfolio at shamza31.vercel.app (verbatim, currently live)

tagline: "Out-of-band observability for Solana validators."
   <- FLAG THIS. "Out-of-band" is overstated as a default: RPC_URL defaults to
      host.docker.internal:8899 and docker-compose.prod.yml uses network_mode: host, so
      the default deployment shares a host with the validator. The portfolio has the same
      problem and I will fix it there. Propose consistent wording for both, along the
      lines of: "Runs as a separate process from the validator, with a configurable RPC
      endpoint so it can be deployed on an isolated host."

description: "A Go daemon polls the validator's Solana JSON-RPC out of process and exports
vote-credit accrual and slot progression to Prometheus. 3-sigma Z-score over a rolling
one-hour baseline, routed through Alertmanager to Telegram."

stack: Go, Prometheus, PromQL, Alertmanager, Telegram API, Docker Compose
award line: "Winner, Superteam Germany / neosfer Ideathon Frankfurt 2026. $250 USD."
status badge: "live"  <- QUESTIONABLE given the CV dates it Sep 2025 to May 2026. Flag if
                         the site also implies it is currently running.

If the project site contradicts either of the above, the site is wrong. If the site says
something TRUE that neither of the above mentions, keep it and tell me, because it may be
worth adding to the CV.

## WHAT TO DO

1. Read every file under frontend/ including hidden text, meta tags, OpenGraph tags,
   alt text, aria-labels, JSON-LD, and copy inside scripts. Check public/ images too.
2. For each factual claim, classify: VERIFIED with file:line, OVERSTATED with the
   strongest defensible rewrite, FALSE with the contradicting code, or UNVERIFIABLE.
3. Correct FALSE and OVERSTATED claims in place. Do NOT touch the visual design.
4. Do not invent metrics.
5. Re-run the full sweep after editing.
6. Run the repo's build, lint and typecheck, and report results.

## REPORT

1. Claims verified, with file:line evidence
2. Claims rewritten, before and after
3. Claims removed, and the code that disproves them
4. Every Jito/ShredStream reference found and what you did with it
5. Anything a technical interviewer could still challenge
```

---

## After both run

Come back here and I'll cross-check all three surfaces (portfolio, AutoSRE site, SentinelSOL site) against the CV so the wording matches, not just the facts.
