/**
 * Single source of truth for every route's content.
 *
 * Adding a project means adding one object to `projects` — the home page
 * grid, the /projects index, the detail route, and the prerenderer all read
 * from here, so nothing has to be edited in more than one place.
 *
 * Every claim below is drawn from the corresponding repository (its README,
 * release notes, or source). Nothing here is aspirational: where a project
 * is incomplete, its `limitations` say so.
 */

export const site = {
  name: 'Ahmet Keles',
  role: 'Software Engineering · Backend Systems · Distributed Systems · Applied AI',
  kicker: 'Computer Science @ UT Dallas',
  statement:
    'I build backend and distributed systems focused on reliability, concurrency, messaging, search, and scalable infrastructure.',
  url: 'https://ahmet-keles.github.io',
  email: 'akeles655@gmail.com',
  github: 'https://github.com/ahmet-keles',
  linkedin: 'https://www.linkedin.com/in/ahmet-keles-91b33b228/',
};

export const about = [
  "I'm a Computer Science student at The University of Texas at Dallas, graduating Fall 2027 and pursuing Summer 2027 software engineering internships. My primary interests are backend engineering and distributed systems, with a secondary interest in applied AI and retrieval systems. I enjoy building practical software projects focused on reliability, scalability, and real-world engineering problems.",
  "Alongside backend systems, I'm also exploring applied AI through search, retrieval, vector databases, and RAG-oriented projects.",
];

export const projects = [
  {
    slug: 'event-driven-commerce',
    title: 'Event-Driven Commerce Platform',
    status: 'complete',
    statusLabel: 'v1.0.0 · Complete',
    stack: ['Java', 'Spring Boot', 'Kafka', 'PostgreSQL', 'Docker', 'Testcontainers'],
    summary:
      'Three-service event-driven commerce backend coordinating orders, inventory, and payments using Kafka and isolated databases, with reliability patterns for duplicate delivery, failures, and concurrent processing.',
    highlights: [
      'Transactional outbox',
      'Idempotent consumers',
      'Saga compensation',
      'Optimistic locking',
      'Retries & dead-letter topics',
      '345 automated tests',
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/ahmet-keles/event-driven-commerce' },
      {
        label: 'v1.0.0 release',
        href: 'https://github.com/ahmet-keles/event-driven-commerce/releases/tag/v1.0.0',
      },
    ],
    detail: {
      lede:
        'A production-style saga across three independently deployable Spring Boot services, each owning its own PostgreSQL database and communicating only through Kafka. The interesting part is not the happy path — it is what happens when messages arrive twice, a service dies mid-transaction, or two replicas process the same order at once.',
      sections: [
        {
          heading: 'The saga',
          body:
            'An order is assembled item by item, then explicitly submitted. Each item added emits ORDER_ITEM_ADDED; inventory reserves stock per item and answers INVENTORY_RESERVED or INVENTORY_RESERVATION_FAILED. Once every item is reserved and the order is submitted, it confirms and payment begins. Payment answers PAYMENT_COMPLETED or PAYMENT_FAILED, and a failure cancels the order and releases the reserved stock.',
        },
        {
          heading: 'Reliability patterns',
          body:
            'Every service writes events to a transactional outbox in the same database transaction as its state change, so an event can never be published for work that rolled back. A relay polls the outbox with SELECT … FOR UPDATE SKIP LOCKED, which lets multiple replicas publish concurrently without double-sending, and defers an aggregate whose earlier event another replica still holds so per-order ordering survives across replicas. Consumers deduplicate on the envelope event id via a processed-events ledger, claimed in the same transaction as the mutation so a rolled-back attempt leaves no marker behind and redelivery can safely retry.',
        },
        {
          heading: 'Concurrency',
          body:
            'The Order aggregate carries a JPA @Version, so two transactions that load the same order and both write it produce exactly one commit and one optimistic-lock failure rather than a silent lost update. That failure is classified as retryable by the Kafka error handler, so redelivery converges instead of dead-lettering a good event. Permanent failures — malformed payloads, contract violations — are non-retryable and go straight to a dead-letter topic after bounded exponential backoff.',
        },
        {
          heading: 'Schema and testing',
          body:
            'Flyway manages eight migrations per service, with database-level constraints enforcing the invariants the domain model promises, and partial indexes matching the outbox publisher\'s exact query shapes. The suite runs against real PostgreSQL and Kafka via Testcontainers, including concurrency tests that drive two genuine transactions on separate threads through a barrier to prove the lock actually fires, and an end-to-end suite that runs the real service jars against Kafka and three PostgreSQL instances.',
        },
      ],
      facts: [
        ['Services', 'order · inventory · payment'],
        ['Datastores', 'One PostgreSQL per service'],
        ['Tests', '345 (189 order · 83 inventory · 57 payment · 16 e2e)'],
        ['Status', 'v1.0.0 released'],
      ],
    },
  },
  {
    slug: 'novasearch',
    title: 'NovaSearch',
    status: 'wip',
    statusLabel: 'In Development',
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'pgvector', 'Redis', 'Docker'],
    summary:
      'Hybrid search engine putting PostgreSQL full-text search and pgvector semantic search behind one FastAPI service, fused with Reciprocal Rank Fusion.',
    highlights: [
      'Keyword + semantic retrieval',
      'Reciprocal Rank Fusion',
      'Deterministic chunking',
      'Redis response cache',
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/ahmet-keles/novasearch' }],
    detail: {
      lede:
        'Keyword search and semantic search fail in opposite ways: full-text nails exact identifiers but misses paraphrases, while vector search catches related wording but can rank a fuzzy match above an exact one. NovaSearch runs both over one PostgreSQL database and merges the rankings, so there is no separate search cluster to operate or keep in sync.',
      sections: [
        {
          heading: 'Retrieval modes',
          body:
            'Keyword mode uses PostgreSQL full-text search — websearch_to_tsquery ranked by ts_rank_cd over a GIN index. Semantic mode is pgvector cosine nearest-neighbour over chunk embeddings with an HNSW index. Hybrid mode, the default, takes a candidate pool from each retriever and merges them with Reciprocal Rank Fusion, scoring a chunk by the sum of 1/(60 + rank) across the rankings that contain it. Because RRF operates on ranks rather than raw scores, cosine similarity and ts_rank never need to be calibrated against each other.',
        },
        {
          heading: 'Ingestion',
          body:
            'Documents are split by deterministic word-window chunking, so identical input always produces identical chunks. Each chunk is embedded, and the document and its chunks are written in a single transaction. The tsvector is a stored generated column, so the keyword index cannot drift from the chunk text. Chunks with no indexable tokens are dropped rather than stored as zero vectors that cosine distance cannot rank, and queries with no indexable tokens are rejected with 422 in every mode rather than pretending they are searchable.',
        },
        {
          heading: 'Honest state of the embeddings',
          body:
            'Embeddings sit behind a small EmbeddingProvider interface. The shipped implementation is a deterministic feature-hashing bag-of-words baseline — no model download, no network, hermetic tests — which means texts score as similar when they share vocabulary. It is explicitly not a semantic model yet. Model-backed providers, local or hosted, are the designed next step and plug in behind the same interface without touching the search code.',
        },
      ],
      facts: [
        ['Retrievers', 'PostgreSQL FTS + pgvector'],
        ['Fusion', 'Reciprocal Rank Fusion (k=60)'],
        ['Cache', 'Redis, short TTL'],
        ['Status', 'In development'],
      ],
      limitations:
        'The embedding provider is a lexical baseline, not a semantic model — swapping in real embeddings, plus fusion weighting and a relevance evaluation harness, is the current roadmap.',
    },
  },
  {
    slug: 'distributed-job-scheduler',
    title: 'Distributed Job Scheduler',
    status: 'wip',
    statusLabel: 'In Development',
    stack: ['Java 21', 'Spring Boot', 'PostgreSQL', 'Docker'],
    summary:
      'Distributed job platform where competing workers coordinate purely through database row locking — no broker, no coordination service, no single point of failure in the execution path.',
    highlights: [
      'FOR UPDATE SKIP LOCKED claiming',
      'Leases + heartbeats',
      'Crash recovery via reaper',
      'Bounded retries with backoff',
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/ahmet-keles/distributed-job-scheduler' }],
    detail: {
      lede:
        'Jobs are submitted over a REST API, persisted durably, and executed by any number of identical, stateless instances. PostgreSQL is the only shared state: workers claim work with row locks rather than coordinating through a broker or a consensus service.',
      sections: [
        {
          heading: 'Execution model',
          body:
            'A claim is one short transaction that locks up to N due PENDING rows with FOR UPDATE SKIP LOCKED, flips each to RUNNING with the worker id and a lease deadline, and opens an attempt-history row. SKIP LOCKED partitions due jobs between concurrent workers without anyone blocking. The handler then runs on a dedicated thread pool strictly outside any transaction, so slow work never pins locks or connections, and the poller claims only as many jobs as it has free handler threads. A second short transaction records the outcome.',
        },
        {
          heading: 'Failure handling',
          body:
            'A claim is a lease, renewed by a heartbeat while the worker is alive. A reaper returns expired leases to the queue, so a crashed or partitioned worker\'s jobs are re-executed rather than stuck — and because every instance runs its own reaper, any instance can recover any other\'s abandoned work. Failures retry with deterministic exponential backoff up to a bound, then settle in a terminal FAILED state with the last error preserved. Every execution attempt, including ones written off as ABANDONED by crash recovery, leaves an immutable history row.',
        },
      ],
      facts: [
        ['Coordination', 'PostgreSQL row locks only'],
        ['Job states', 'PENDING → RUNNING → SUCCEEDED | FAILED, plus CANCELLED'],
        ['Scheduling', 'Immediate, delayed, or at an instant'],
        ['Status', 'Milestone 1 — durable core'],
      ],
      limitations:
        'Milestone 1 covers the durable core: API, persistence, claiming, leases, retries, history, and crash recovery.',
    },
  },
  {
    slug: 'distributed-object-storage',
    title: 'Distributed Object Storage',
    status: 'wip',
    statusLabel: 'In Development',
    stack: ['Java 21', 'Spring Boot', 'PostgreSQL', 'Docker'],
    summary:
      'Object storage that splits uploads into chunks, replicates every chunk across storage nodes, verifies every byte with SHA-256, and survives the loss of any single node.',
    highlights: [
      'Fixed-size chunking',
      'Deterministic placement',
      'End-to-end SHA-256',
      'Read failover across replicas',
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/ahmet-keles/distributed-object-storage' }],
    detail: {
      lede:
        'Two services with no shared state between nodes: a metadata-service that owns the public API and all the intelligence — chunking, checksums, placement, replication, failover — and a deliberately dumb storage-node that stores bytes against a local directory and verifies checksums on every write and read.',
      sections: [
        {
          heading: 'Write path',
          body:
            'An upload is split into fixed-size chunks (1 MiB by default), and SHA-256 is computed for the whole object and for every chunk. Placement is deterministic: nodes are sorted by id, a hash of the object id and chunk index selects the primary slot, and remaining replicas take the following slots ring-wise — the same input yields the same placement on any instance with no coordination. Every chunk is written to the replication factor\'s worth of nodes and all replica writes must succeed before metadata is committed in a single transaction, so a committed object is always fully replicated. A failed write aborts the upload, cleans up best-effort, and leaves no metadata behind.',
        },
        {
          heading: 'Read path',
          body:
            'Reads load the chunk map from PostgreSQL and use the recorded replica locations rather than recomputing placement, so the layout stays stable even if the node list is reordered. Each chunk is fetched from its replicas in recorded priority order, and a replica fails the attempt either because its node is unreachable or because the returned bytes do not hash to the recorded SHA-256 — a dead node and a corrupted replica are handled identically by trying the next replica.',
        },
      ],
      facts: [
        ['Services', 'metadata-service + storage-node'],
        ['Chunk size', '1 MiB (configurable)'],
        ['Replication factor', '2 (configurable)'],
        ['Status', 'Milestone 1'],
      ],
      limitations:
        'No repair or re-replication yet: a lost node\'s replicas are not rebuilt, so reads survive on the remaining replica but redundancy is not restored.',
    },
  },
];

export const experience = [
  {
    when: 'Summer 2026',
    title: 'Superintendent Intern · Keles Group Inc.',
    body: 'Supported superintendent teams on construction projects totaling over $10.2M across Wylie and Grand Prairie.',
  },
  {
    when: 'Summer 2024',
    title: 'Customer Experience Intern · DTF Order',
    body: 'Supported customer-facing operations for a printing business in Richardson, TX.',
  },
];

export const skills = [
  { group: 'Languages', items: ['Java', 'Python', 'C++', 'SQL', 'JavaScript', 'C#'] },
  { group: 'Backend', items: ['Spring Boot', 'FastAPI', 'REST APIs', 'gRPC'] },
  { group: 'Data & Messaging', items: ['PostgreSQL', 'Kafka', 'Redis', 'RabbitMQ', 'pgvector'] },
  { group: 'Frontend', items: ['React', 'React Router', 'Vite', 'HTML', 'CSS'] },
  {
    group: 'Infrastructure',
    items: ['Docker', 'Git', 'Linux', 'CI/CD', 'AWS', 'Azure', 'Testcontainers'],
  },
];

export const education = {
  when: 'Expected Fall 2027',
  title: 'B.S. Computer Science · The University of Texas at Dallas',
};

export const certifications = [
  {
    when: 'August 2026',
    title: 'Claude 101 · Anthropic',
    href: 'https://verify.skilljar.com/c/u3faoxe7nqz8',
    linkLabel: 'Verify credential',
  },
];

export const getProject = (slug) => projects.find((p) => p.slug === slug);
