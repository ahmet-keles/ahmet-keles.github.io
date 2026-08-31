/**
 * Project case studies.
 *
 * Every technical claim here was taken from the corresponding repository's
 * main branch (README, architecture notes, and release notes) rather than
 * written from memory. Where a project is incomplete, `limitations` says so
 * in the repository's own terms — nothing here is aspirational.
 *
 * Sources:
 *   event-driven-commerce      v1.0.0 release notes + repo
 *   novasearch                 README @ 713066e
 *   distributed-job-scheduler  README @ 93c57f8
 *   distributed-object-storage README @ e6a38a3
 */
import type { Project } from './types';

const eventDrivenCommerce: Project = {
  slug: 'event-driven-commerce',
  name: 'Event-Driven Commerce',
  tagline: 'A three-service saga that survives duplicate delivery, crashes, and concurrent writes.',
  status: 'shipped',
  statusLabel: 'v1.0.0',
  domains: ['Distributed Systems', 'Backend', 'Reliability'],
  summary:
    'Three independently deployable Spring Boot services — orders, inventory, payments — each owning its own PostgreSQL database and communicating only over Kafka, with the reliability patterns that make an asynchronous saga trustworthy.',
  stack: [
    { name: 'Java 21' },
    { name: 'Spring Boot' },
    { name: 'Apache Kafka', note: 'Asynchronous service-to-service messaging' },
    { name: 'PostgreSQL', note: 'One isolated database per service' },
    { name: 'Flyway', note: 'Versioned schema migrations, Hibernate in validate mode' },
    { name: 'Docker Compose' },
    { name: 'Testcontainers', note: 'Real Kafka and PostgreSQL in the test suite' },
  ],
  capabilities: [
    'Transactional outbox in all three services',
    'Idempotent consumers with processed-event ledgers',
    'Saga compensation on payment failure',
    'Optimistic locking on the order aggregate',
    'Bounded retries and dead-letter topics',
    '345 automated tests',
  ],
  repo: 'https://github.com/ahmet-keles/event-driven-commerce',
  release: {
    label: 'v1.0.0 release',
    href: 'https://github.com/ahmet-keles/event-driven-commerce/releases/tag/v1.0.0',
  },
  featured: true,

  problem: [
    'A synchronous checkout that calls inventory and payment in-process is easy to write and impossible to keep consistent: any network blip leaves an order confirmed with no stock reserved, or stock reserved for an order that never completed.',
    'Splitting the flow across services and a broker fixes the coupling and introduces the real problems — messages arrive twice, a service dies between writing its state and publishing its event, and two replicas process the same order at the same moment. This project exists to implement the patterns that make those cases survivable, and to prove they work with tests rather than assertions in a README.',
  ],

  diagram: {
    width: 760,
    height: 300,
    caption:
      'Each service owns its database and publishes through its own outbox. Nothing calls another service synchronously.',
    nodes: [
      { id: 'client', label: 'Client', x: 20, y: 122, w: 96, h: 56, kind: 'client' },
      { id: 'order', label: 'order-service', sublabel: 'aggregate + outbox', x: 156, y: 110, w: 150, h: 76, kind: 'service' },
      { id: 'kafka', label: 'Kafka', sublabel: 'order · inventory · payment', x: 350, y: 18, w: 170, h: 66, kind: 'broker' },
      { id: 'inventory', label: 'inventory-service', sublabel: 'reservations', x: 560, y: 96, w: 160, h: 68, kind: 'service' },
      { id: 'payment', label: 'payment-service', sublabel: 'payment saga', x: 560, y: 200, w: 160, h: 68, kind: 'service' },
      { id: 'orderdb', label: 'orders DB', x: 168, y: 224, w: 126, h: 50, kind: 'store' },
    ],
    edges: [
      { from: 'client', to: 'order', label: 'REST' },
      { from: 'order', to: 'orderdb' },
      { from: 'order', to: 'kafka', label: 'outbox relay', dashed: true },
      { from: 'kafka', to: 'inventory', dashed: true },
      { from: 'kafka', to: 'payment', dashed: true },
      { from: 'inventory', to: 'kafka', label: 'reserved / failed', dashed: true, labelDy: 14 },
      { from: 'payment', to: 'kafka', label: 'completed / failed', dashed: true, labelDy: -14 },
    ],
  },

  sections: [
    {
      id: 'saga',
      heading: 'The saga',
      body: [
        'An order is assembled item by item and then explicitly submitted — submission is separate state, so a fast inventory reply cannot confirm an order the client is still building.',
        'Each item added emits ORDER_ITEM_ADDED. Inventory reserves stock per item and answers INVENTORY_RESERVED or INVENTORY_RESERVATION_FAILED. Only when every item is reserved and the order has been submitted does it confirm, which starts payment. Payment answers PAYMENT_COMPLETED or PAYMENT_FAILED; a failure cancels the order and releases the stock that was already reserved.',
      ],
    },
    {
      id: 'outbox',
      heading: 'Transactional outbox',
      body: [
        'Every service writes its events to an outbox table in the same database transaction as the state change they describe. An event can therefore never be published for work that rolled back, and work can never commit without its event queued.',
        'A relay polls the outbox with SELECT … FOR UPDATE SKIP LOCKED. Rows held by another replica are skipped rather than waited on, so replicas partition the pending work instead of racing for it. A cross-replica ordering guard defers an aggregate whose earlier event another replica still holds, so per-order ordering survives even though publishing is concurrent.',
      ],
    },
    {
      id: 'idempotency',
      heading: 'Idempotent consumers',
      body: [
        'Kafka delivery is at-least-once, so consumers must expect duplicates. Each consumer claims the envelope event id in a processed-events ledger using INSERT … ON CONFLICT DO NOTHING — the insert is itself the duplicate check, with no window between looking and writing.',
        'The claim is made in the same transaction as the mutation it guards. That ordering is what makes retry safe: an attempt that rolls back — including one that loses an optimistic-lock race — leaves no ledger row behind, so redelivery can claim the same event again and apply it. A claim committed in its own transaction would mark an event processed whose work was discarded, losing it permanently.',
      ],
    },
    {
      id: 'concurrency',
      heading: 'Concurrency control',
      body: [
        'The Order aggregate carries a JPA @Version mapped to a version column. Two transactions that load the same order and both write it produce exactly one commit and one ObjectOptimisticLockingFailureException instead of a silent lost update — PostgreSQL row locks serialize the writes but do not protect a read-modify-write cycle at READ COMMITTED.',
        'That exception extends Spring’s TransientDataAccessException, which the Kafka error handler classifies as retryable, so redelivery converges rather than dead-lettering a valid event. Permanent failures — malformed payloads and contract violations — are non-retryable and go straight to a dead-letter topic after bounded exponential backoff.',
      ],
      collapsible: true,
    },
    {
      id: 'schema',
      heading: 'Schema and constraints',
      body: [
        'Flyway manages eight migrations for the order service. Database-level constraints enforce the invariants the domain model promises — NOT NULL on business-required columns, checks on quantities and amounts, and a cascade on the order-items foreign key that matches the JPA mapping so non-JPA deletes behave.',
        'Partial indexes match the outbox publisher’s exact query shapes: one on (occurred_at, id) WHERE published_at IS NULL for the claim, another on (aggregate_id, occurred_at, id) for the ordering guard. Both stay small because they only ever cover the pending backlog. A bounded retention job deletes published outbox rows and expired ledger entries in batches, claimed with SKIP LOCKED so it never contends with the publisher.',
      ],
      collapsible: true,
    },
  ],

  tradeoffs: [
    {
      choice: 'Transactional outbox instead of publishing directly from the service',
      gained: 'Atomicity between the state change and its event — no lost or phantom events.',
      cost: 'Publication is a poll behind the write, adding latency and a relay to operate.',
    },
    {
      choice: 'Optimistic locking rather than pessimistic row locks',
      gained: 'No lock held across the handler; conflicts are rare and resolve by retry.',
      cost: 'Callers must handle a conflict, and hot aggregates would retry more often.',
    },
    {
      choice: 'At-least-once delivery with consumer-side dedup',
      gained: 'No coordination or transactions across Kafka and PostgreSQL.',
      cost: 'Every consumer needs a ledger, and every handler must be idempotent.',
    },
  ],

  testing: [
    '345 automated tests: 189 order, 83 inventory, 57 payment, and 16 end-to-end.',
    'Integration tests run against real PostgreSQL and Kafka using Testcontainers, not mocks or embedded doubles.',
    'Concurrency is tested with two genuine transactions on separate threads, synchronized by a barrier so both provably hold the same version before either commits — the test asserts exactly one commit and one optimistic-lock failure.',
    'A dedicated test proves the idempotency claim rolls back with its mutation and that redelivery can reclaim the same event id.',
    'The end-to-end suite runs the real service jars against Kafka and three PostgreSQL instances, including duplicate delivery, dead-letter routing, and payment-failure compensation.',
  ],

  limitations: [
    'Payment is a simulated service — the saga and its failure handling are real, the payment provider is not.',
    'Per-order event ordering is preserved, but there is no global ordering across aggregates, by design.',
    'The retention job’s ledger window must exceed the longest replay horizon; deleting a ledger row early would re-enable an old event id.',
  ],
};

const novaSearch: Project = {
  slug: 'novasearch',
  name: 'NovaSearch',
  tagline: 'Keyword and vector retrieval over one PostgreSQL, fused by rank rather than score.',
  status: 'in-development',
  statusLabel: 'In development',
  domains: ['Search & AI', 'Backend'],
  summary:
    'A hybrid search service that runs PostgreSQL full-text search and pgvector similarity over the same database and merges the two rankings with Reciprocal Rank Fusion — no separate search cluster to operate or keep in sync.',
  stack: [
    { name: 'Python 3.11' },
    { name: 'FastAPI' },
    { name: 'PostgreSQL', note: 'Full-text search with GIN indexes' },
    { name: 'pgvector', note: 'Cosine similarity with HNSW indexes' },
    { name: 'Redis', note: 'Response cache, never the source of truth' },
    { name: 'Alembic', note: 'Schema migrations' },
    { name: 'Docker Compose' },
  ],
  capabilities: [
    'Keyword, semantic, and hybrid retrieval modes',
    'Reciprocal Rank Fusion across both retrievers',
    'Deterministic word-window chunking',
    'Cache invalidation via a PostgreSQL-owned epoch',
  ],
  repo: 'https://github.com/ahmet-keles/novasearch',
  featured: true,

  problem: [
    'Keyword search and vector search fail in opposite directions. Full-text search is exact about identifiers, error codes, and product names but blind to paraphrase; vector search catches related wording but will happily rank a fuzzy match above a literal one.',
    'Production systems run both and merge the results, which usually means operating a dedicated search cluster alongside the primary database and keeping the two in sync. NovaSearch is a small, testable version of that pattern where both retrievers read the same PostgreSQL instance, so there is nothing to synchronize.',
  ],

  diagram: {
    width: 760,
    height: 320,
    caption:
      'Both retrievers read the same database. Redis is a disposable cache whose invalidation epoch lives in PostgreSQL.',
    nodes: [
      { id: 'client', label: 'Client', x: 20, y: 130, w: 96, h: 56, kind: 'client' },
      { id: 'api', label: 'FastAPI', sublabel: 'ingest · search', x: 156, y: 118, w: 150, h: 78, kind: 'service' },
      { id: 'redis', label: 'Redis', sublabel: 'response cache', x: 156, y: 244, w: 150, h: 58, kind: 'store' },
      { id: 'pg', label: 'PostgreSQL', sublabel: 'documents · chunks · epoch', x: 372, y: 122, w: 180, h: 74, kind: 'store' },
      { id: 'gin', label: 'tsvector', sublabel: 'GIN · keyword', x: 596, y: 44, w: 144, h: 62, kind: 'store' },
      { id: 'hnsw', label: 'vector(256)', sublabel: 'HNSW · semantic', x: 596, y: 212, w: 144, h: 62, kind: 'store' },
    ],
    edges: [
      { from: 'client', to: 'api', label: 'HTTP' },
      { from: 'api', to: 'redis', label: 'cache', dashed: true },
      { from: 'api', to: 'pg' },
      { from: 'pg', to: 'gin' },
      { from: 'pg', to: 'hnsw' },
    ],
  },

  sections: [
    {
      id: 'fusion',
      heading: 'Why rank fusion, not score blending',
      body: [
        'Hybrid mode takes a candidate pool from each retriever and merges them with Reciprocal Rank Fusion: a chunk scores the sum of 1/(60 + rank) across whichever rankings contain it.',
        'The point is that RRF operates on positions, not raw scores. Cosine distance and ts_rank live on unrelated scales, and any attempt to blend them numerically needs a calibration constant that silently rots as the corpus changes. Ranks sidestep that entirely — a result that placed third is third regardless of which retriever produced it.',
      ],
    },
    {
      id: 'ingestion',
      heading: 'Ingestion and index integrity',
      body: [
        'Documents are split by deterministic word-window chunking over normalized whitespace, so identical input always produces identical chunks. Each chunk is embedded, and document and chunks are written in a single transaction.',
        'The tsvector is a stored generated column rather than a value the application maintains, so the keyword index physically cannot drift from the chunk text it indexes. A shared tokenizer defines "indexable" once for embedding, ingestion, and query validation: a punctuation-only window would embed to a zero vector that cosine distance cannot rank, so it is dropped, and a document or query with no indexable tokens is rejected with 422 rather than silently returning nothing.',
      ],
    },
    {
      id: 'cache',
      heading: 'Cache invalidation owned by the database',
      body: [
        'Search responses are cached in Redis under keys that embed an invalidation epoch stored in a single-row PostgreSQL table. Ingestion increments that epoch in the same transaction as the document write, so invalidation commits atomically with the data and cannot be lost.',
        'Each search reads the epoch once and uses it for both the lookup and the write, so a search racing an ingestion can only ever write under the epoch that has already been retired — stale results cannot surface under the new one. Redis stays disposable: if it is down, ingestion and uncached search keep working and only /health reports the outage, and entries left over from before an outage are unreachable afterwards because the epoch moved on.',
      ],
      collapsible: true,
    },
    {
      id: 'embeddings',
      heading: 'What the embeddings actually are',
      body: [
        'Embeddings sit behind a small EmbeddingProvider interface. The shipped implementation is a deterministic feature-hashing bag-of-words baseline — a BLAKE2b bucket and sign per token, L2-normalized — which needs no model download, no network, and keeps the tests hermetic.',
        'It is explicitly not a semantic model: texts score as similar when they share vocabulary. Calling it "semantic search" would be the kind of claim this project is built to avoid. Model-backed providers, local or hosted, are the designed next step and plug in behind the same interface without touching the search code.',
      ],
    },
  ],

  tradeoffs: [
    {
      choice: 'PostgreSQL and pgvector instead of a dedicated search engine',
      gained: 'One datastore, one transaction, no index-sync pipeline to run or repair.',
      cost: 'Gives up the tuning surface, sharding, and scale ceiling of a real search cluster.',
    },
    {
      choice: 'A lexical embedding baseline rather than a model',
      gained: 'Hermetic, fast, dependency-free tests and a fully exercised retrieval path.',
      cost: 'Semantic mode is not yet semantic — it matches shared vocabulary, not meaning.',
    },
    {
      choice: 'Epoch-based cache invalidation instead of key deletion',
      gained: 'Invalidation is transactional with the write and cannot be lost or half-applied.',
      cost: 'Retired entries linger in Redis until their TTL expires, occupying memory.',
    },
  ],

  testing: [
    'Unit tests cover chunking, embeddings, and rank fusion with no services running.',
    'Integration tests run against real PostgreSQL and Redis: they apply the Alembic migrations, ingest over the HTTP API, then assert persisted rows, generated tsvectors, embedding dimensions, per-mode ranking behavior, and cache invalidation.',
    'CI runs Ruff plus the full suite against pgvector and Redis service containers on every push and pull request.',
  ],

  limitations: [
    'Embeddings are a lexical baseline, not a semantic model.',
    'No answer generation or RAG layer — the API does not pretend to have one.',
    'No reranking, authentication, pagination, or document update and deletion yet.',
  ],
};

const jobScheduler: Project = {
  slug: 'distributed-job-scheduler',
  name: 'Distributed Job Scheduler',
  tagline: 'Competing workers coordinated entirely by database row locks — no broker, no consensus service.',
  status: 'in-development',
  statusLabel: 'Milestone 1',
  domains: ['Distributed Systems', 'Reliability', 'Backend'],
  summary:
    'Jobs are submitted over REST, persisted durably, and executed by any number of identical stateless instances. PostgreSQL is the only shared state: workers claim work with FOR UPDATE SKIP LOCKED, hold it on a lease, and a reaper on every instance recovers whatever a crashed worker abandoned.',
  stack: [
    { name: 'Java 21' },
    { name: 'Spring Boot' },
    { name: 'PostgreSQL', note: 'Queue, lease store, and history in one ACID database' },
    { name: 'Flyway', note: 'Schema migrations; Hibernate runs validate-only' },
    { name: 'Docker Compose' },
    { name: 'Testcontainers' },
  ],
  capabilities: [
    'FOR UPDATE SKIP LOCKED claiming',
    'Leases with heartbeat renewal',
    'Lease reaper for crash recovery',
    'Attempt number as a fencing token',
    'Bounded retries with exponential backoff',
  ],
  repo: 'https://github.com/ahmet-keles/distributed-job-scheduler',
  featured: false,

  problem: [
    'The usual way to run background jobs across several machines is to put a broker in the middle. That adds a component to operate, a second place for state to live, and a new failure mode when the broker and the database disagree about what happened.',
    'If the jobs already live in a transactional database, the database can be the queue. This project takes that seriously: claiming, leasing, retrying, and crash recovery are all expressed as transactions over rows, with no coordination service and no single point of failure in the execution path.',
  ],

  diagram: {
    width: 760,
    height: 300,
    caption:
      'Every instance runs the same components. PostgreSQL is the only shared state, so any instance can recover any other’s work.',
    nodes: [
      { id: 'client', label: 'Client', x: 20, y: 124, w: 96, h: 56, kind: 'client' },
      { id: 'api', label: 'Job API', x: 156, y: 26, w: 140, h: 54, kind: 'service' },
      { id: 'poller', label: 'Poller', sublabel: 'claim + execute', x: 156, y: 118, w: 140, h: 66, kind: 'service' },
      { id: 'hb', label: 'Heartbeat', x: 156, y: 222, w: 140, h: 50, kind: 'service' },
      { id: 'reaper', label: 'Lease reaper', x: 344, y: 222, w: 148, h: 50, kind: 'service' },
      { id: 'db', label: 'PostgreSQL', sublabel: 'jobs · job_attempts', x: 552, y: 108, w: 178, h: 80, kind: 'store' },
    ],
    edges: [
      { from: 'client', to: 'api', label: 'REST' },
      { from: 'api', to: 'db', label: 'insert / cancel' },
      { from: 'poller', to: 'db', label: 'SKIP LOCKED claim' },
      { from: 'hb', to: 'db', label: 'extend lease', dashed: true, labelDy: 12 },
      { from: 'reaper', to: 'db', label: 'requeue expired', dashed: true, labelDy: 12 },
    ],
  },

  sections: [
    {
      id: 'execution',
      heading: 'Claim, execute, complete',
      body: [
        'A claim is one short transaction: lock up to N due PENDING rows with FOR UPDATE SKIP LOCKED, flip each to RUNNING with the worker id and a lease deadline, and open an attempt-history row. SKIP LOCKED is what makes concurrent workers partition the queue instead of blocking on each other.',
        'The handler then runs on a dedicated thread pool strictly outside any transaction, so slow work never pins a row lock or a pooled connection — and the poller claims only as many jobs as it has free handler threads. A second short transaction re-locks the row and records the outcome: SUCCEEDED, or FAILED with the retry policy applied.',
      ],
    },
    {
      id: 'fencing',
      heading: 'Leases, reaping, and the zombie problem',
      body: [
        'A claim is a lease. While jobs run, the worker extends the lease of every RUNNING row it owns in a single UPDATE, on a cadence that startup validation forces to be shorter than the lease itself. An already-expired lease is never extended — it belongs to the reaper.',
        'The reaper on every instance locks RUNNING rows whose deadline has passed, closes their attempt as ABANDONED, and requeues or fails the job like any other failure. That leaves the classic zombie: a worker paused past its lease, still executing, that eventually wakes up and reports a verdict for a job someone else now owns.',
        'The fence is the attempt number. A completion is applied only when it matches both the claim’s worker id and its current attempt number, so a stale attempt has no effect on job state or history — even when the same worker process happens to hold the replacement claim.',
      ],
    },
    {
      id: 'honesty',
      heading: 'At-least-once, stated plainly',
      body: [
        'Execution is at-least-once and the design makes every crash window explicit. Crash before the claim commits and nothing happened. Crash after claiming and the job sits RUNNING until its lease expires, then the reaper requeues it — the handler may or may not have run.',
        'What the invariants do not provide is exactly-once handler execution. SKIP LOCKED guarantees only one claim is current; after a lease is lost, the old handler may still be running while the replacement executes. Handlers with external side effects must be idempotent or carry their own fencing, for example an idempotency key derived from the job id and attempt number.',
      ],
      collapsible: true,
    },
    {
      id: 'data',
      heading: 'Data model',
      body: [
        'Two tables carry everything. `jobs` holds current state — status, schedule, attempts against max, claim owner and lease deadline, last error — with CHECK constraints enforcing the status/claim invariant at the schema level rather than trusting application code.',
        '`job_attempts` is append-only: one row per started attempt with its worker, timestamps, outcome (SUCCEEDED, FAILED, or ABANDONED), and error, under a UNIQUE (job_id, attempt_number) constraint that makes the fencing token unforgeable.',
      ],
      collapsible: true,
    },
  ],

  tradeoffs: [
    {
      choice: 'PostgreSQL as the queue instead of a message broker',
      gained: 'One system to operate, and job state plus queue state commit in one transaction.',
      cost: 'Throughput is bounded by the database, and polling costs latency a broker push would not.',
    },
    {
      choice: 'Leases with a reaper rather than a coordination service',
      gained: 'No ZooKeeper or etcd; any instance can recover any other instance’s work.',
      cost: 'Recovery is only as fast as the lease duration, and duplicate execution is possible.',
    },
    {
      choice: 'At-least-once with a fencing token, not exactly-once',
      gained: 'Stale verdicts are provably rejected, and the guarantee is simple to reason about.',
      cost: 'Handler authors carry the idempotency burden — the scheduler cannot do it for them.',
    },
  ],

  testing: [
    '43 tests, run with Docker available.',
    'Unit tests cover state-machine transitions, ownership guards, retry backoff arithmetic, and the handler registry.',
    'Integration tests against real PostgreSQL via Testcontainers cover the API surface, claim semantics with two workers claiming concurrently and proven disjoint results, retry-to-terminal with full attempt history, lease expiry and crash recovery, and the zombie-verdict guard.',
    'End-to-end tests enable the scheduled loop for real: submit through the service and watch the poller claim, execute, retry, and complete.',
    'CI runs the same suite on every push and pull request, with a fail-fast Docker preflight and retried image pre-pulls.',
  ],

  limitations: [
    'Milestone 1 is the durable core: API, persistence, claiming, leases, retries, history, and crash recovery.',
    'Deliberately excluded for now: recurring and cron schedules, job dependency graphs, priorities, a broker, distributed caching, progress streaming, and richer observability.',
    'Exactly-once handler execution is not provided, and is documented as such rather than implied.',
  ],
};

const objectStorage: Project = {
  slug: 'distributed-object-storage',
  name: 'Distributed Object Storage',
  tagline: 'Chunked, replicated, checksum-verified storage that survives losing a node.',
  status: 'in-development',
  statusLabel: 'Milestone 1',
  domains: ['Distributed Systems', 'Reliability'],
  summary:
    'Objects are split into fixed-size chunks, every chunk is replicated to two storage nodes, every byte is SHA-256-verified end to end, and any single storage node can fail without making an object unreadable.',
  stack: [
    { name: 'Java 21' },
    { name: 'Spring Boot' },
    { name: 'PostgreSQL 17', note: 'Object, chunk, and replica metadata' },
    { name: 'Flyway' },
    { name: 'Docker Compose', note: 'Three storage nodes plus the coordinator' },
    { name: 'Testcontainers' },
  ],
  capabilities: [
    'Fixed-size chunking with per-chunk checksums',
    'Deterministic, coordination-free placement',
    'Replication factor 2 with all-replica writes',
    'Read failover across replicas',
    'Corruption detected as node failure',
  ],
  repo: 'https://github.com/ahmet-keles/distributed-object-storage',
  featured: false,

  problem: [
    'Object storage looks trivial until a disk lies to you. A node can be unreachable, or worse, reachable and returning bytes that no longer match what was written — and a naive system will happily hand that corruption to the caller.',
    'This project builds the smallest system that treats both cases identically: split objects into chunks, replicate each chunk, verify every byte against a recorded SHA-256 on both write and read, and fail over to another replica whenever the bytes do not check out — whatever the reason.',
  ],

  diagram: {
    width: 760,
    height: 320,
    caption:
      'The coordinator holds all the intelligence; nodes are dumb byte stores that verify checksums and never talk to each other.',
    nodes: [
      { id: 'client', label: 'Client', x: 20, y: 132, w: 96, h: 56, kind: 'client' },
      { id: 'meta', label: 'metadata-service', sublabel: 'chunk · place · verify', x: 152, y: 118, w: 172, h: 82, kind: 'service' },
      { id: 'db', label: 'PostgreSQL', sublabel: 'objects · chunks · replicas', x: 152, y: 244, w: 172, h: 62, kind: 'store' },
      { id: 'n1', label: 'node-1', x: 420, y: 30, w: 116, h: 54, kind: 'store' },
      { id: 'n2', label: 'node-2', x: 420, y: 134, w: 116, h: 54, kind: 'store' },
      { id: 'n3', label: 'node-3', x: 420, y: 238, w: 116, h: 54, kind: 'store' },
    ],
    edges: [
      { from: 'client', to: 'meta', label: 'PUT / GET' },
      { from: 'meta', to: 'db', label: 'chunk map' },
      { from: 'meta', to: 'n1', label: 'chunks', labelDy: -8 },
      { from: 'meta', to: 'n2' },
      { from: 'meta', to: 'n3', labelDy: 8 },
    ],
  },

  sections: [
    {
      id: 'write',
      heading: 'Write path',
      body: [
        'An upload is split into fixed-size chunks — 1 MiB by default, the last carrying the remainder — and SHA-256 is computed for the whole object and for every chunk.',
        'Placement is deterministic and needs no coordination: nodes are sorted by id, SHA-256(objectId:chunkIndex) selects the primary slot, and remaining replicas take the following slots ring-wise. The same input yields the same placement on any instance.',
        'Every chunk is written to the replication factor’s worth of nodes, each node verifying the declared checksum before the chunk becomes visible, and all replica writes must succeed. Only then is metadata committed — object, chunks, and the replica locations actually written — in one transaction. A committed object is therefore always fully replicated; a failed write aborts with 502, cleans up best-effort, and leaves no metadata behind.',
      ],
    },
    {
      id: 'read',
      heading: 'Read path and failover',
      body: [
        'Reads load the chunk map from PostgreSQL and use the recorded replica locations rather than recomputing placement, so the layout stays stable even if the node list is reordered.',
        'Each chunk is fetched from its replicas in recorded priority order. A replica fails the attempt if its node is unreachable or if the returned bytes do not hash to the recorded SHA-256 — a dead node and a corrupted replica are handled identically, by trying the next replica. With replication factor 2, that is what makes any single node loss survivable for reads.',
        'The reassembled object is verified against the recorded object checksum and served with it in an X-Object-Sha256 header. Body and header come from the same metadata snapshot, read once per download, so an object replaced under the same key mid-request can never pair one version’s bytes with another version’s checksum.',
      ],
    },
    {
      id: 'membership',
      heading: 'Static membership and its consequences',
      body: [
        'Nodes are configuration rather than discovery, and node ids are load-bearing because replicas are recorded against them. Reordering the list or changing a node’s URL is safe as long as ids are preserved; adding nodes changes placement for new objects only.',
        'Removing or renaming an id that still owns recorded replicas makes those replicas unreachable, and losing both ids of a chunk makes the object unreadable until an id returns. Placement is modulo-based rather than consistent hashing, so changing the node count remaps future placements wholesale — acceptable at this scale, and the reason consistent hashing is on the roadmap.',
      ],
      collapsible: true,
    },
  ],

  tradeoffs: [
    {
      choice: 'All replica writes must succeed before committing metadata',
      gained: 'A committed object is always fully replicated — no partially durable state.',
      cost: 'One node being down fails the upload; there is no write quorum or hinted handoff.',
    },
    {
      choice: 'Deterministic placement over a placement service',
      gained: 'Any instance computes the same layout with zero coordination.',
      cost: 'Modulo placement remaps wholesale when the node count changes.',
    },
    {
      choice: 'Dumb storage nodes, all intelligence in the coordinator',
      gained: 'Nodes are trivial to reason about, test, and replace; they hold no metadata.',
      cost: 'The coordinator is a single process and a single point of failure.',
    },
  ],

  testing: [
    'Storage-node tests cover the wire contract, checksum verification, and a path-traversal guard.',
    'Metadata-service tests cover chunking, placement, and the coordinator against real PostgreSQL plus scriptable fake nodes that simulate down nodes, corrupted replicas, and failed uploads.',
    'An end-to-end suite runs real PostgreSQL, three real storage-node containers, and the metadata service together — including a genuine node loss with a container stopped mid-test.',
    'CI runs both service suites and the e2e suite on every push and pull request.',
  ],

  limitations: [
    'No repair or re-replication: a lost node’s replicas are not rebuilt, so redundancy is not restored and a second loss can make objects unreadable.',
    'Whole objects are buffered in coordinator memory, capped at 64 MiB — no streaming, multipart, or range reads.',
    'Single coordinator, no authentication, plain HTTP; orphaned chunk bytes are possible and await a scrubber.',
    'Not S3-compatible: no signed URLs, versioning, or overwrite (delete then re-upload).',
  ],
};

export const projects: readonly Project[] = [
  eventDrivenCommerce,
  novaSearch,
  jobScheduler,
  objectStorage,
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string | undefined): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export const allDomains = [
  ...new Set(projects.flatMap((p) => p.domains)),
].sort() as readonly string[];
